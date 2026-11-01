/* 목록·상세 페이지 공통 유틸 */
(() => {
  const DAY = 86400000;
  const today = new Date(); today.setHours(0, 0, 0, 0);

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

  function poster(c, big = false) {
    return ContestPosters.render(c, big);
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
