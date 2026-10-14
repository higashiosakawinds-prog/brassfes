/*
  apply.html と coupons.html で共通のしくみ（ふだんは触らなくてOK）
  ・Supabase への接続
  ・お店カードの表示
*/
const C = window.FES_CONFIG;
const DEMO = !C.supabaseUrl || !C.supabaseAnonKey;   // 設定が空ならお試しモード
const db = DEMO ? null : window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey);

// 文字をそのまま表示する（タグとして解釈させない）
const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const planOf = (id) => C.plans.find((p) => p.id === id) || {};

// 写真のURL（保存場所の名前 → 表示用のURL）
function photoUrl(path) {
  if (!path) return "";
  if (/^(https?:|blob:|data:|images\/)/.test(path)) return path;
  return DEMO ? "" : db.storage.from(C.photoBucket).getPublicUrl(path).data.publicUrl;
}

// お店カード。mini=true で一覧用の小さいカード
function shopCard(s, mini = false) {
  const img = photoUrl(s.photo_path);
  const url = s.url && /^https?:\/\//.test(s.url) ? s.url : "";
  return `<article class="shop ${mini ? "mini" : ""}">
    <div class="ph">${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : `<span class="noimg">PHOTO</span>`}
      ${s.genre && !mini ? `<span class="genre">${esc(s.genre)}</span>` : ""}</div>
    <div class="bd">
      ${s.shop_kana ? `<span class="kana">${esc(s.shop_kana)}</span>` : ""}
      <h3>${esc(s.shop_name || "お店の名前")}</h3>
      ${s.catch ? `<p class="catch">${esc(s.catch)}</p>` : ""}
      ${s.intro ? `<p class="intro">${esc(s.intro)}</p>` : ""}
      ${s.coupon ? `<div class="cp"><b>COUPON</b><span>${esc(s.coupon)}${s.coupon_note ? `<small>${esc(s.coupon_note)}</small>` : ""}</span></div>` : ""}
      <p class="meta">${[s.address, s.hours].filter(Boolean).map(esc).join("<br>")}${url ? `${s.address || s.hours ? "<br>" : ""}<a href="${esc(url)}" target="_blank" rel="noopener">お店のページ</a>` : ""}</p>
    </div>
  </article>`;
}
