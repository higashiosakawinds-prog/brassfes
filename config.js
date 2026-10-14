/*
==========================================================
  📝 申し込みフォーム・クーポンページの設定（ここだけ書き換えればOK）
  apply.html（申し込み）と coupons.html（クーポン一覧）が読み込みます。
==========================================================
*/
window.FES_CONFIG = {
  // ---- Supabase（Project Settings → API に書いてある2つ） ----
  // 空のあいだは「お試しモード」で動きます（申し込みは保存されず、クーポン一覧はサンプル表示）
  supabaseUrl: "",       // 例: "https://xxxx.supabase.co"
  supabaseAnonKey: "",   // 例: "eyJhbGciOi..."（anon public キー。公開しても大丈夫なキーです）

  // ---- プラン（shop.html の料金と合わせる） ----
  // id はデータベースに保存される名前なので変えないでください
  plans: [
    { id: "web_pick", name: "Webピックアップ",      price: 3000,  pickup: true, note: "先着6店" },
    { id: "web_std",  name: "Webスタンダード",      price: 1000,  pickup: false },
    { id: "support",  name: "協賛（応援）",         price: 3000,  pickup: false, note: "3,000円〜・クーポンなし", noCoupon: true }
  ],

  // ---- ジャンル（クーポン一覧の絞り込みに使う） ----
  genres: ["ごはん", "カフェ・スイーツ", "パン", "お酒", "お買い物", "美容・健康", "暮らし・サービス", "その他"],

  // ---- お支払い ----
  // クレジットカード：Stripe の「支払いリンク」をプランごとに作って、URLを貼る（空ならカード払いは選べません）
  cardLinks: {
    p1: "", p2: "", p4: "", web_pick: "", web_std: "", support: ""
  },
  // お振込：振込先（空なら「振込先は後日メールでご案内します」と表示）
  bank: "",   // 例: "〇〇銀行 △△支店 普通 1234567 ヒガシオオサカスイソウガクダン"
  payDeadline: "お申し込みから2週間以内",

  // ---- 問い合わせ先（申し込み完了画面に表示） ----
  contactEmail: "",

  // ---- クーポンを使えるようにするか ----
  // false のあいだは、一覧のクーポンに「当日、パンフレットのQRから使えます」と表示（この画面では使えない）
  couponsOpen: false,
  couponDay: "5月2日（日）",

  // ---- 写真 ----
  photoMaxSide: 1600,   // 長い辺をこのピクセルまで縮めてから保存（通信量と容量の節約）
  photoBucket: "shop-photos"
};
