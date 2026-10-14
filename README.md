# 東大阪市吹奏楽フェスタ LP

2027年5月2日（日）開催「東大阪市吹奏楽フェスタ」の案内ページ。

## 中身を書き換えるとき
`index.html` の上の方にある「📝毎年ここだけ書き換えればOK！」の枠（`FESTA`）だけ直せばOK。
日付・出演団体・プログラム・お店・よくある質問・ビジョンは全部そこにまとまっています。

## 画像
- `images/` … 人物イラスト・会場写真
- `images/decor/` … スクロールで動く飾り（音符や楽器）

画像を差し替えるときは、同じ名前で上書きするか、`FESTA` の中のファイル名を書き換えます。

## 公開前にきめること・入れること
- `shopFormUrl` / `contactUrl`：掲載の相談・出演の相談のフォームURL（Googleフォームなど）。フォームがまだなら `contactEmail` にメールアドレスを入れると、件名つきのメールボタンになる
- `faq` の `fixed`：正式に決まったら `true` に（「調整中」の札が消える）
- `notice`：全部決まったら `""` に（「予定です」の注意書きが消える）

## SNS・検索まわり
- `index.html` のいちばん上の `<meta>` は、LINE や X のシェア表示用。日付・会場・名前が変わったらここも直す
- シェア画像は `images/ogp.jpg`（1200×630）
- 検索エンジン向けのイベント情報（構造化データ）は `FESTA` から自動で作るので、直さなくてOK

## お店向けページ（shop.html）
- 掲載プラン・料金・締切・申し込み先は `shop.html` 上の `SHOP` だけ直せばOK（プランは `group` で「パンフ＋Web／Webのみ／応援」に分かれる。紙面の図の大きさは `size: [よこ, たて]` のマス数、Webのおすすめ枠は `pickup: true`）
- 締切が決まったら `schedule` の `date` に入れる（空のあいだは「調整中」）
- 来場見込み・部数は `expected` / `copies` に入れると表示される
- 申し込みフォームができたら `formUrl` に（フォームがまだなら `email` でもOK）

## 申し込みフォーム（apply.html）とクーポン一覧（coupons.html）
- 設定はぜんぶ `config.js`（Supabase の接続先・プラン・ジャンル・カード払いのリンク・振込先）
- `config.js` の Supabase が空のあいだは「お試しモード」（申し込みは保存されず、クーポン一覧はサンプル表示）
- 申し込みは Supabase の `fes_shops` 表に「確認待ち（pending）」で入る
  - 内容と入金を確認したら、Table Editor で `status` を `published` に → クーポン一覧に出る
  - `paid` は入金確認のチェック、`sort` は大きいほど上に表示、`admin_memo` は自由メモ
- 写真は Supabase Storage の `shop-photos` に保存（長い辺1600pxに縮めてから送る）
- データベースの準備は `supabase/schema.sql` を一度実行するだけ
- `.github/workflows/keep-supabase-awake.yml` が週2回 Supabase に軽くアクセスして、無料プランの自動停止を防ぐ
