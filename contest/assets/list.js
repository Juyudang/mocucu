/* 목록 페이지. 필터 상태는 주소(?cat=art&target=청소년 …)에 남겨서
   상세 페이지에서 '뒤로 가기' 했을 때 같은 목록·스크롤로 돌아오게 한다. */
(() => {
  const { contests, favs, toggleFav, updateFavCount, catOf, fmtDate, fmtNum, fmtPrize, ddayText, ddayClass, poster } = Moacon;
  const PER_PAGE = 20;
  const MULTI = ["target", "hostType", "prize", "benefit"];
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const state = { cat: "all", q: "", sort: "latest", view: "grid", page: 1, hideClosed: true, onlyFavs: false };
  MULTI.forEach((k) => (state[k] = new Set()));

  // ---------- 주소 ↔ 상태 ----------
  function readUrl() {
    const p = new URLSearchParams(location.search);
    state.cat = p.get("cat") || "all";
    state.q = p.get("q") || "";
    state.sort = p.get("sort") || "latest";
    state.view = p.get("view") || "grid";
    state.page = +p.get("page") || 1;
    state.hideClosed = p.get("closed") !== "1";
    state.onlyFavs = p.get("fav") === "1";
    MULTI.forEach((k) => (state[k] = new Set(p.getAll(k))));
  }
  function writeUrl() {
    const p = new URLSearchParams();
    if (state.cat !== "all") p.set("cat", state.cat);
    if (state.q) p.set("q", state.q);
    if (state.sort !== "latest") p.set("sort", state.sort);
    if (state.view !== "grid") p.set("view", state.view);
    if (state.page > 1) p.set("page", state.page);
    if (!state.hideClosed) p.set("closed", "1");
    if (state.onlyFavs) p.set("fav", "1");
    MULTI.forEach((k) => state[k].forEach((v) => p.append(k, v)));
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  }

  function prizeBucket(p) {
    if (p >= 10000) return "1억 이상";
    if (p >= 5000) return "5천만~1억";
    if (p >= 1000) return "1천만~5천만";
    if (p > 0) return "1천만 미만";
    return "상장/기타";
  }

  function filtered() {
    const q = state.q.trim().toLowerCase();
    const list = contests.filter((c) => {
      if (state.onlyFavs && !favs.has(c.id)) return false;
      if (state.cat !== "all" && c.cat !== state.cat) return false;
      if (state.hideClosed && c.dday < 0) return false;
      if (q && !`${c.title} ${c.host} ${catOf(c.cat).label} ${c.theme || ""}`.toLowerCase().includes(q)) return false;
      if (state.target.size && !c.target.some((t) => state.target.has(t) || t === "누구나")) return false;
      if (state.hostType.size && !state.hostType.has(c.hostType)) return false;
      if (state.prize.size && !state.prize.has(prizeBucket(c.prize))) return false;
      if (state.benefit.size && !c.benefit.some((b) => state.benefit.has(b))) return false;
      return true;
    });
    const by = {
      latest: (a, b) => b.start - a.start || a.id - b.id,
      deadline: (a, b) => (a.dday < 0) - (b.dday < 0) || a.dday - b.dday,
      views: (a, b) => b.views - a.views,
      prize: (a, b) => b.first - a.first,
    }[state.sort];
    return list.sort(by);
  }

  // ---------- 렌더 ----------
  function renderCats() {
    const counts = { all: 0 };
    contests.forEach((c) => { if (c.dday >= 0) { counts[c.cat] = (counts[c.cat] || 0) + 1; counts.all++; } });
    $("#catStrip").innerHTML = CATEGORIES.map((c) => `
      <button class="cat ${state.cat === c.key ? "on" : ""}" data-cat="${c.key}">
        <span class="cat-icon">${c.icon}</span>
        <span class="cat-label">${c.label}</span>
        <span class="cat-count">${counts[c.key] || 0}</span>
      </button>`).join("");
  }

  function renderFilterChips() {
    $$(".chips").forEach((box) => {
      const key = box.dataset.filter;
      box.innerHTML = FILTERS[key].map((v) =>
        `<button class="chip ${state[key].has(v) ? "on" : ""}" data-key="${key}" data-val="${v}">${v}</button>`).join("");
    });
    $("#hideClosed").checked = state.hideClosed;
    $$("#sortTabs button").forEach((b) => b.classList.toggle("on", b.dataset.sort === state.sort));
    $$(".view-toggle button").forEach((b) => b.classList.toggle("on", b.dataset.view === state.view));
    $("#searchInput").value = state.q;
  }

  function renderActiveFilters() {
    const tags = [];
    if (state.onlyFavs) tags.push(["onlyFavs", "", "즐겨찾기"]);
    if (state.q) tags.push(["q", "", `"${state.q}"`]);
    MULTI.forEach((k) => state[k].forEach((v) => tags.push([k, v, v])));
    $("#activeFilters").innerHTML = tags.map(([k, v, label]) =>
      `<span class="af">${label}<button data-rm="${k}" data-val="${v}">✕</button></span>`).join("");
  }

  function card(c) {
    const fav = favs.has(c.id);
    const isNew = c.start >= -3;
    return `<a class="card ${c.dday < 0 ? "is-closed" : ""}" href="detail.html?id=${c.id}">
      <div class="thumb">${poster(c)}
        <span class="dday ${ddayClass(c.dday)}">${ddayText(c.dday)}</span>
        <button class="scrap ${fav ? "on" : ""}" data-fav="${c.id}" aria-label="즐겨찾기">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="info">
        <div class="labels">
          <span class="lb cat-lb">${catOf(c.cat).label}</span>
          ${c.hot ? '<span class="lb hot">HOT</span>' : ""}
          ${isNew ? '<span class="lb new">NEW</span>' : ""}
        </div>
        <h3 class="title">${c.title}</h3>
        <p class="host">${c.host}</p>
        <div class="meta">
          <span class="m-prize">🏆 대상 ${fmtPrize(c.first)}</span>
          <span class="m-period">${fmtDate(c.startDate).slice(5)} ~ ${fmtDate(c.endDate).slice(5)}</span>
          <span class="m-views">👁 ${fmtNum(c.views)}</span>
        </div>
      </div>
      <span class="dday-col ${ddayClass(c.dday)}">${ddayText(c.dday)}</span>
    </a>`;
  }

  function renderList() {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    state.page = Math.min(state.page, pages);
    const slice = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);

    $("#resultCount").textContent = fmtNum(list.length);
    const catLabel = state.cat === "all" ? "전체" : catOf(state.cat).label;
    $("#listTitle").firstChild.textContent = state.onlyFavs ? "즐겨찾기 " : `${catLabel} 공모전 `;
    $("#cards").className = `cards ${state.view}`;
    $("#cards").innerHTML = slice.map(card).join("");
    $("#empty").hidden = list.length > 0;

    let html = "";
    if (pages > 1) {
      html += `<button data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""}>‹</button>`;
      for (let i = 1; i <= pages; i++) html += `<button data-page="${i}" class="${i === state.page ? "on" : ""}">${i}</button>`;
      html += `<button data-page="${state.page + 1}" ${state.page === pages ? "disabled" : ""}>›</button>`;
    }
    $("#pagination").innerHTML = html;
    renderActiveFilters();
    updateFavCount();
    writeUrl();
  }

  function renderSide() {
    const open = contests.filter((c) => c.dday >= 0);
    $("#rankList").innerHTML = [...open].sort((a, b) => b.views - a.views).slice(0, 7).map((c, i) => `
      <li><a href="detail.html?id=${c.id}"><b>${i + 1}</b><span>${c.title}</span><em class="${i % 3 === 1 ? "down" : i === 4 ? "same" : "up"}">${i % 3 === 1 ? "▼" : i === 4 ? "-" : "▲"}</em></a></li>`).join("");
    const urgent = open.filter((c) => c.dday <= 1).sort((a, b) => a.dday - b.dday);
    $("#todayList").innerHTML = urgent.length ? urgent.map((c) => `
      <li><a href="detail.html?id=${c.id}"><span class="dday-sm ${ddayClass(c.dday)}">${ddayText(c.dday)}</span><span>${c.title}</span></a></li>`).join("") : "<li>마감 임박 공모전이 없습니다.</li>";
  }

  // ---------- 배너 ----------
  let bannerIdx = 0, bannerTimer;
  function renderBanner() {
    $("#bannerTrack").innerHTML = BANNERS.map((b) => `
      <div class="slide" style="background:linear-gradient(120deg, ${b.bg[0]}, ${b.bg[1]})">
        <span class="b-tag">${b.tag}</span>
        <h2>${b.title}</h2><p>${b.sub}</p>
        ${b.href ? `<a class="b-btn" href="${b.href}">자세히 보기 →</a>` : '<button class="b-btn">자세히 보기 →</button>'}
        <div class="b-deco">🏆</div>
      </div>`).join("");
    $("#bannerDots").innerHTML = BANNERS.map((_, i) => `<button data-b="${i}"></button>`).join("");
    goBanner(0);
  }
  function goBanner(i) {
    bannerIdx = (i + BANNERS.length) % BANNERS.length;
    $("#bannerTrack").style.transform = `translateX(-${bannerIdx * 100}%)`;
    $$("#bannerDots button").forEach((d, j) => d.classList.toggle("on", j === bannerIdx));
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => goBanner(bannerIdx + 1), 4500);
  }

  // ---------- 이벤트 ----------
  document.addEventListener("click", (e) => {
    const t = e.target;
    const favBtn = t.closest("[data-fav]");
    if (favBtn) {
      e.preventDefault(); e.stopPropagation();
      favBtn.classList.toggle("on", toggleFav(favBtn.dataset.fav));
      if (state.onlyFavs) renderList();
      return;
    }
    const cat = t.closest("[data-cat]");
    if (cat) { state.cat = cat.dataset.cat; state.page = 1; state.onlyFavs = false; renderCats(); renderList(); return; }
    const chip = t.closest(".chip");
    if (chip) {
      const set = state[chip.dataset.key];
      set.has(chip.dataset.val) ? set.delete(chip.dataset.val) : set.add(chip.dataset.val);
      chip.classList.toggle("on"); state.page = 1; renderList(); return;
    }
    const rm = t.closest("[data-rm]");
    if (rm) {
      const k = rm.dataset.rm;
      if (k === "q") state.q = "";
      else if (k === "onlyFavs") state.onlyFavs = false;
      else state[k].delete(rm.dataset.val);
      renderFilterChips(); renderList(); return;
    }
    const sort = t.closest("[data-sort]");
    if (sort) { state.sort = sort.dataset.sort; state.page = 1; renderFilterChips(); renderList(); return; }
    const view = t.closest("[data-view]");
    if (view) { state.view = view.dataset.view; renderFilterChips(); renderList(); return; }
    const pg = t.closest("[data-page]");
    if (pg && !pg.disabled) { state.page = +pg.dataset.page; renderList(); $(".list-head").scrollIntoView({ behavior: "smooth" }); return; }
    const b = t.closest("[data-b]");
    if (b) { goBanner(+b.dataset.b); return; }
  });

  function resetAll() {
    Object.assign(state, { cat: "all", q: "", page: 1, onlyFavs: false });
    MULTI.forEach((k) => state[k].clear());
    renderCats(); renderFilterChips(); renderList();
  }
  $("#resetFilters").addEventListener("click", resetAll);
  $("#emptyReset").addEventListener("click", resetAll);
  $("#logoHome").addEventListener("click", (e) => { e.preventDefault(); resetAll(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  $("#scrapListBtn").addEventListener("click", () => { state.onlyFavs = !state.onlyFavs; state.page = 1; renderList(); });
  $("#hideClosed").addEventListener("change", (e) => { state.hideClosed = e.target.checked; renderList(); });
  $("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); state.q = $("#searchInput").value; state.page = 1; renderList(); });
  $("#searchInput").addEventListener("input", (e) => { state.q = e.target.value; state.page = 1; renderList(); });

  // 뒤로 가기로 돌아왔을 때(bfcache) 즐겨찾기 표시 갱신
  window.addEventListener("pageshow", (e) => { if (e.persisted) { Moacon.reloadFavs(); renderList(); } });

  // 스크롤 위치는 직접 저장/복원 (브라우저 자동 복원은 렌더 타이밍에 따라 어긋남)
  const SCROLL_KEY = () => `moacon_scroll:${location.search}`;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("pagehide", () => { try { sessionStorage.setItem(SCROLL_KEY(), scrollY); } catch {} });

  // ---------- init ----------
  readUrl();
  renderBanner(); renderCats(); renderFilterChips(); renderList(); renderSide();
  try {
    const y = +sessionStorage.getItem(SCROLL_KEY());
    if (y) window.scrollTo(0, y);
  } catch {}
})();
