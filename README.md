# File Transfer

- 指定したディレクトリを監視して、古いファイルをS3に転送する。
  - 最新の1つは対象外。
  - 日時の基準は、ファイル生成日時

# 要るもの

- AWS CLI v2
  - `aws configure` は事前に済ませておくこと
  - S3へのwrite権限があるIAMであること
- Node.js
  - v14で動作確認。最新のバージョンに依存したことはしていないはず

# Config
`config/default.json`

# 一時データ
`data/twitch.csv`
Twitchの配信タイトルから抜き出したもの。
次にアップロードするファイル名に使うので、手動で変えてもOK。末尾の改行は不要。
ファイルが無い場合は自動生成される。

# 準備
`npm install --production`

# 実行
`npm run start`
