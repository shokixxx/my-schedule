# My Schedule

個人専用のスケジュールプランナー。**平日用**と**休日用**のスケジュールを
**30分単位（4:00〜24:00）**で登録・編集できます。スマホのブラウザからアクセス可能。

## 機能
- 平日 / 休日 をタブで切り替え
- 4:00〜24:00 を30分単位（40枠）で表示
- 各枠に予定タイトルを入力（タップして編集、空にすると削除）
- データはブラウザの **localStorage** に保存（端末ごと・サーバ不要）
- スマホ対応のレスポンシブUI

## 使い方（ローカル確認）
静的サイトなので、リポジトリ直下で簡易サーバを起動するだけです。

```bash
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

## スマホからアクセス（GitHub Pages 公開）
`.github/workflows/deploy-pages.yml` により、`main` ブランチへの push で
自動的に GitHub Pages へデプロイされます。

### 初回のみ必要な設定
1. GitHub リポジトリの **Settings → Pages** を開く
2. **Build and deployment → Source** を **GitHub Actions** に変更
3. 以降、`main` への push（このPRのマージ）で自動公開されます

公開URLは `https://shokixxx.github.io/my-schedule/` になります。
スマホのブラウザでこのURLを開けば、いつでもアクセスできます
（ホーム画面に追加するとアプリのように使えます）。

## 技術構成
- フレームワーク不要の静的Webアプリ（HTML + CSS + JavaScript）
- 保存先: ブラウザの localStorage
- ホスティング: GitHub Pages（GitHub Actions 経由）

詳しい要件は [SPEC.md](./SPEC.md) を参照。
