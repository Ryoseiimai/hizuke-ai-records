# ひづけAIレコーズ 公式サイト

AIで音楽を作る事務所「ひづけAIレコーズ」の公式サイト。静的HTML・外部ライブラリ最小（Google Fontsのみ）。

## 公開URL

https://ryoseiimai.github.io/hizuke-ai-records/

GitHub Pages（`main` ブランチの `/` から配信）。ホスティング設定・デプロイの詳細は運用担当に確認。

## ページ構成

```
index.html                    事務所トップ
artists/shuten-laundry/       終点ランドリー
artists/tomori/               ともり
artists/zeroji/               ZEROJI
data/catalog.json             リリース一覧（曲データ）
assets/                       CSS・JS・OGP画像
```

## リリースを追加する方法（`data/catalog.json`）

`songs` 配列の末尾に、以下の形でオブジェクトを1つ追記してコミット・pushするだけで、
トップページと該当アーティストページの「リリース一覧」に自動で反映されます。
ビルド手順は不要です（ページを開いたときに `data/catalog.json` を読み込んで描画します）。

```json
{
  "id": "shuten-laundry-day002",
  "artist_slug": "shuten-laundry",
  "artist_name": "終点ランドリー",
  "day": 2,
  "title": "曲名",
  "title_reading": "曲名の読み",
  "date": "2026-09-28",
  "lyrics_excerpt": [
    "歌詞の1行目",
    "歌詞の2行目",
    "歌詞の3行目",
    "歌詞の4行目"
  ],
  "audio_url": "",
  "video_url": ""
}
```

- `artist_slug` は `shuten-laundry` / `tomori` / `zeroji` のいずれか。
- `date` は `YYYY-MM-DD`。一覧は日付の新しい順に並び替えて表示されます。
- `audio_url` / `video_url` が両方とも空文字のままなら、一覧には「音源・映像 準備中」と表示されます。値を入れると「公開中」表示に変わりますが、実際の音源・動画の埋め込み表示（`<audio>`/`<video>`/`<iframe>` への差し替え）は各ページの `.media-slot` を参照してあわせて実装してください（`assets/catalog.js` はテキスト一覧のみを描画します）。
- 配信リンク・動画・SNSのリンクカード（各アーティストページの `.link-cards`）は、窓口が決まってから手動でリンクに差し替えてください。

## 画像について

ジャケット・人物イラストはまだ生成していないため未収録。`assets/og/*.png` のOGP画像は、写真・イラストを使わず、色とタイポグラフィだけで作った暫定版（`assets/style.css` と同じアクセントカラーを使用）。ジャケットができたら、各ページの `<meta property="og:image">` と `assets/og/*.png` を差し替えてください。

## 公開範囲についての注意

所属アーティスト名（終点ランドリー／ともり／ZEROJI）と事務所名（ひづけAIレコーズ）は、商標の最終確認待ちです。確認が済むまで `robots.txt` で検索エンジンのクロールを止め、各ページに `<meta name="robots" content="noindex, nofollow">` を入れています。確認が済んだら、両方を外してください。

## デザインの決まりごと

- 色は白・墨（`#111114`）・アクセント1色のみ（アーティストごとに1色だけ差し替え）。
- 角丸・グラデーション・ドロップシャドウ・パステル塗りは使わない。
- 日本語の改行は BudouX（`assets/wrap.js`・MIT License, Copyright 2021 Google LLC）で文節の途中を避ける。
