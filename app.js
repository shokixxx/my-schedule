// My Schedule — 平日 / 休日 / 飲み会 を 30分単位で登録する個人用プランナー
// データはブラウザの localStorage に保存（端末ごと）

const START_HOUR = 4;   // 4:00 から
const END_HOUR = 24;    // 24:00 まで
const STEP_MIN = 30;    // 30分単位

const STORAGE_PREFIX = "my-schedule:v1:";

const TYPE_LABELS = {
  weekday: "平日",
  holiday: "休日",
  drink: "飲み会",
};

let currentType = "weekday"; // "weekday" | "holiday" | "drink"

const scheduleEl = document.getElementById("schedule");
const clearBtn = document.getElementById("clearBtn");
const tabs = document.querySelectorAll(".tab");

// まとめて入力フォーム
const bulkToggle = document.getElementById("bulkToggle");
const bulkForm = document.getElementById("bulkForm");
const bulkTitle = document.getElementById("bulkTitle");
const bulkStart = document.getElementById("bulkStart");
const bulkEnd = document.getElementById("bulkEnd");
const bulkApply = document.getElementById("bulkApply");
const bulkClear = document.getElementById("bulkClear");

function storageKey(type) {
  return STORAGE_PREFIX + type;
}

function loadData(type) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(type))) || {};
  } catch {
    return {};
  }
}

function saveData(type, data) {
  localStorage.setItem(storageKey(type), JSON.stringify(data));
}

function saveEntry(type, time, value) {
  const data = loadData(type);
  if (value.trim() === "") {
    delete data[time];
  } else {
    data[time] = value;
  }
  saveData(type, data);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function label(min) {
  return `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
}

// 全ての30分枠の「開始時刻」（"04:00" 〜 "23:30"）
function timeSlots() {
  const slots = [];
  for (let m = START_HOUR * 60; m < END_HOUR * 60; m += STEP_MIN) {
    slots.push(label(m));
  }
  return slots;
}

function toMin(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function render() {
  const data = loadData(currentType);
  scheduleEl.innerHTML = "";

  for (const time of timeSlots()) {
    const li = document.createElement("li");
    li.className = "slot";
    if (time.endsWith(":00")) li.classList.add("hour-start");

    const timeEl = document.createElement("span");
    timeEl.className = "slot-time";
    timeEl.textContent = time;

    const input = document.createElement("input");
    input.className = "slot-input";
    input.type = "text";
    input.placeholder = "予定を入力";
    input.value = data[time] || "";
    input.addEventListener("change", () => {
      saveEntry(currentType, time, input.value);
    });

    li.append(timeEl, input);
    scheduleEl.append(li);
  }
}

// 開始/終了プルダウンを生成（開始: 04:00〜23:30 / 終了: 04:30〜24:00）
function buildRangeSelects() {
  for (let m = START_HOUR * 60; m < END_HOUR * 60; m += STEP_MIN) {
    bulkStart.append(new Option(label(m), label(m)));
  }
  for (let m = START_HOUR * 60 + STEP_MIN; m <= END_HOUR * 60; m += STEP_MIN) {
    bulkEnd.append(new Option(label(m), label(m)));
  }
  // 初期値の目安（例：勤務 08:00〜18:00）
  bulkStart.value = "08:00";
  bulkEnd.value = "18:00";
}

// 範囲内の全枠に同じ予定を入れる（clear=true なら消去）
function applyRange(clear) {
  const startMin = toMin(bulkStart.value);
  const endMin = toMin(bulkEnd.value);

  if (endMin <= startMin) {
    alert("終了時刻は開始時刻より後にしてください。");
    return;
  }
  const title = bulkTitle.value.trim();
  if (!clear && title === "") {
    alert("予定の内容を入力してください。");
    return;
  }

  const data = loadData(currentType);
  for (let m = startMin; m < endMin; m += STEP_MIN) {
    const time = label(m);
    if (clear) {
      delete data[time];
    } else {
      data[time] = title;
    }
  }
  saveData(currentType, data);
  render();

  if (!clear) bulkTitle.value = "";
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    currentType = tab.dataset.type;
    render();
  });
});

clearBtn.addEventListener("click", () => {
  if (confirm(`${TYPE_LABELS[currentType]}の予定をすべて削除しますか？`)) {
    localStorage.removeItem(storageKey(currentType));
    render();
  }
});

bulkToggle.addEventListener("click", () => {
  const open = bulkForm.hidden;
  bulkForm.hidden = !open;
  bulkToggle.setAttribute("aria-expanded", String(open));
});

bulkApply.addEventListener("click", () => applyRange(false));
bulkClear.addEventListener("click", () => applyRange(true));

buildRangeSelects();
render();
