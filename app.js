// My Schedule — 平日 / 休日 を 30分単位で登録する個人用プランナー
// データはブラウザの localStorage に保存（端末ごと）

const START_HOUR = 4;   // 4:00 から
const END_HOUR = 24;    // 24:00 まで
const STEP_MIN = 30;    // 30分単位

const STORAGE_PREFIX = "my-schedule:v1:";

let currentType = "weekday"; // "weekday" | "holiday"

const scheduleEl = document.getElementById("schedule");
const clearBtn = document.getElementById("clearBtn");
const tabs = document.querySelectorAll(".tab");

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

function saveEntry(type, time, value) {
  const data = loadData(type);
  if (value.trim() === "") {
    delete data[time];
  } else {
    data[time] = value;
  }
  localStorage.setItem(storageKey(type), JSON.stringify(data));
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// 全ての30分枠の開始時刻ラベルを生成（"04:00" など）
function timeSlots() {
  const slots = [];
  for (let m = START_HOUR * 60; m < END_HOUR * 60; m += STEP_MIN) {
    slots.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  }
  return slots;
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

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    currentType = tab.dataset.type;
    render();
  });
});

clearBtn.addEventListener("click", () => {
  const label = currentType === "weekday" ? "平日" : "休日";
  if (confirm(`${label}の予定をすべて削除しますか？`)) {
    localStorage.removeItem(storageKey(currentType));
    render();
  }
});

render();
