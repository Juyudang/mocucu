/* 목록·상세 페이지 공통 유틸 */
(() => {
  const DAY = 86400000;
  const today = new Date(); today.setHours(0, 0, 0, 0);

  // 포스터 색: [배경, 강조, 글자]
  const COLORS = [
    ["#1f3c88", "#ffcc00", "#fff"], ["#f4efe6", "#d0021b", "#1a1a1a"], ["#0b6e4f", "#f2e8cf", "#fff"],
    ["#ffde59", "#111", "#111"], ["#e8f1f8", "#1f3c88", "#13213c"], ["#c8102e", "#fff", "#fff"],
    ["#222", "#ff7a00", "#fff"], ["#fbe3e8", "#7a1f3d", "#3a0d1c"], ["#5b3fa0", "#b8f2e6", "#fff"],
  ];
  const contests = CONTESTS.map((c, i) => ({
    ...c,
    id: i + 1,
    startDate: new Date(today.getTime() + c.start * DAY),
    endDate: new Date(today.getTime() + c.end * DAY),
    dday: c.end,
  }));

  function load(k, fb) { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

  const favs = new Set(load("moacon_favs", []));
  function toggleFav(id) {
    id = +id;
    const on = !favs.has(id);
    on ? favs.add(id) : favs.delete(id);
    save("moacon_favs", [...favs]);
    toast(on ? "즐겨찾기에 추가했어요 ⭐ 마감 하루 전에 알려드릴게요" : "즐겨찾기를 해제했어요");
    updateFavCount();
    return on;
  }
  function reloadFavs() {
    favs.clear();
    load("moacon_favs", []).forEach((id) => favs.add(id));
  }
  function updateFavCount() {
    const el = document.getElementById("scrapCount");
    if (el) el.textContent = favs.size;
  }

  const catOf = (k) => CATEGORIES.find((c) => c.key === k);
  const fmtDate = (d) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  const fmtNum = (n) => n.toLocaleString("ko-KR");
  const fmtPrize = (m) => (m >= 10000 ? `${m / 10000 % 1 ? (m / 10000).toFixed(1) : m / 10000}억원` : `${fmtNum(m)}만원`);
  const ddayText = (d) => (d < 0 ? "마감" : d === 0 ? "D-Day" : `D-${d}`);
  const ddayClass = (d) => (d < 0 ? "closed" : d <= 3 ? "urgent" : d <= 7 ? "soon" : "");

  // CSS 포스터: 단색 배경 + 타이포. 제목 해시로 색과 레이아웃(3종)을 고른다
  function poster(c, big = false) {
    const h = [...c.title].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 7);
    const [bg, accent, ink] = COLORS[h % COLORS.length];
    const layout = ["pl-a", "pl-b", "pl-c"][(h >>> 4) % 3];
    const edition = (c.title.match(/^제(\d+)회/) || [])[1];
    const name = c.title.replace(/^제\d+회\s*/, "").replace(/^\d{4}\s*/, "");
    const year = c.startDate.getFullYear();
    return `<div class="poster ${layout} ${big ? "big" : ""}" style="--bg:${bg};--ac:${accent};--ink:${ink}">
      <span class="p-top">${edition ? `제${edition}회` : year}</span>
      <span class="p-mark"></span>
      <strong class="p-title">${name}</strong>
      <span class="p-meta">대상 ${fmtPrize(c.first)}</span>
      <span class="p-foot"><b>${c.host}</b>접수 ~ ${fmtDate(c.endDate).slice(5)}</span>
    </div>`;
  }

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  // 헤더 공통: 검색 → 목록 페이지로, data-toast 링크
  document.addEventListener("click", (e) => {
    const tt = e.target.closest("[data-toast]");
    if (tt) { e.preventDefault(); toast(tt.dataset.toast); }
  });
  document.addEventListener("DOMContentLoaded", updateFavCount);

  window.Moacon = {
    contests, favs, toggleFav, reloadFavs, updateFavCount, catOf, fmtDate, fmtNum, fmtPrize, ddayText, ddayClass, poster, toast,
    byId: (id) => contests.find((c) => c.id === +id),
  };
})();
