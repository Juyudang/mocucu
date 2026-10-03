(() => {
  const PER_PAGE = 12;
  const DAY = 86400000;
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const PALETTES = {
    idea: ["#ffcf3d", "#ff8a3d"], marketing: ["#ff5e8a", "#ff9a6b"], video: ["#1e1b4b", "#6d28d9"],
    design: ["#22d3ee", "#a855f7"], writing: ["#f5efe0", "#d8c8a8"], it: ["#0f172a", "#2563eb"],
    science: ["#0ea5e9", "#14b8a6"], social: ["#4ade80", "#15803d"], startup: ["#f43f5e", "#7c3aed"],
    music: ["#111827", "#db2777"],
  };
  const catOf = (k) => CATEGORIES.find((c) => c.key === k);

  // ---------- 데이터 가공 ----------
  const contests = CONTESTS.map((c, i) => {
    const start = new Date(today.getTime() + c.start * DAY);
    const end = new Date(today.getTime() + c.end * DAY);
    return { ...c, id: i + 1, startDate: start, endDate: end, dday: c.end };
  });

  const state = {
    cat: "all", q: "", sort: "latest", view: "grid", page: 1, hideClosed: true,
    target: new Set(), hostType: new Set(), prize: new Set(), benefit: new Set(),
    scraps: new Set(load("moacon_scraps", [])), onlyScraps: false,
  };

  function load(k, fb) { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmtDate = (d) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  const fmtNum = (n) => n.toLocaleString("ko-KR");
  const fmtPrize = (m) => (m >= 10000 ? `${m / 10000 % 1 ? (m / 10000).toFixed(1) : m / 10000}억원` : `${fmtNum(m)}만원`);
  const ddayText = (d) => (d < 0 ? "마감" : d === 0 ? "D-Day" : `D-${d}`);
  const ddayClass = (d) => (d < 0 ? "closed" : d <= 3 ? "urgent" : d <= 7 ? "soon" : "");

  function prizeBucket(p) {
    if (p >= 10000) return "1억 이상";
    if (p >= 5000) return "5천만~1억";
    if (p >= 1000) return "1천만~5천만";
    if (p > 0) return "1천만 미만";
    return "상장/기타";
  }

  function poster(c, big = false) {
    const [a, b] = PALETTES[c.cat] || ["#888", "#444"];
    const dark = c.cat !== "writing" && c.cat !== "idea";
    return `<div class="poster ${big ? "big" : ""}" style="--pa:${a};--pb:${b};color:${dark ? "#fff" : "#2b2113"}">
      <span class="p-host">${c.host}</span>
      <span class="p-icon">${catOf(c.cat).icon}</span>
      <strong class="p-title">${c.title.replace(/^제\d+회\s*/, "").replace(/\s*\d{4}\s*/, " ")}</strong>
      <span class="p-meta">총상금 ${fmtPrize(c.prize)}</span>
      <span class="p-date">~ ${fmtDate(c.endDate).slice(5)}</span>
    </div>`;
  }

  // ---------- 필터 ----------
  function filtered() {
    const q = state.q.trim().toLowerCase();
    let list = contests.filter((c) => {
      if (state.onlyScraps && !state.scraps.has(c.id)) return false;
      if (state.cat !== "all" && c.cat !== state.cat) return false;
      if (state.hideClosed && c.dday < 0) return false;
      if (q && !(`${c.title} ${c.host} ${catOf(c.cat).label}`.toLowerCase().includes(q))) return false;
      if (state.target.size && !c.target.some((t) => state.target.has(t) || t === "누구나")) return false;
      if (state.hostType.size && !state.hostType.has(c.hostType)) return false;
      if (state.prize.size && !state.prize.has(prizeBucket(c.prize))) return false;
      if (state.benefit.size && !c.benefit.some((b) => state.benefit.has(b))) return false;
      return true;
    });
    const by = {
      latest: (a, b) => b.start - a.start,
      deadline: (a, b) => (a.dday < 0) - (b.dday < 0) || a.dday - b.dday,
      views: (a, b) => b.views - a.views,
      prize: (a, b) => b.prize - a.prize,
    }[state.sort];
    return list.sort(by);
  }

  // ---------- 렌더 ----------
  function renderCats() {
    const counts = {};
    contests.forEach((c) => { if (c.dday >= 0) counts[c.cat] = (counts[c.cat] || 0) + 1; });
    counts.all = contests.filter((c) => c.dday >= 0).length;
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
  }

  function renderActiveFilters() {
    const tags = [];
    if (state.onlyScraps) tags.push(["onlyScraps", "", "내 스크랩"]);
    if (state.q) tags.push(["q", "", `"${state.q}"`]);
    ["target", "hostType", "prize", "benefit"].forEach((k) => state[k].forEach((v) => tags.push([k, v, v])));
    $("#activeFilters").innerHTML = tags.map(([k, v, label]) =>
      `<span class="af">${label}<button data-rm="${k}" data-val="${v}">✕</button></span>`).join("");
  }

  function card(c) {
    const scrapped = state.scraps.has(c.id);
    const isNew = c.start >= -3;
    return `<article class="card ${c.dday < 0 ? "is-closed" : ""}" data-id="${c.id}">
      <div class="thumb">${poster(c)}
        <span class="dday ${ddayClass(c.dday)}">${ddayText(c.dday)}</span>
        <button class="scrap ${scrapped ? "on" : ""}" data-scrap="${c.id}" aria-label="스크랩">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 3h12v18l-6-4-6 4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
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
          <span class="m-prize">💰 ${fmtPrize(c.prize)}</span>
          <span class="m-period">${fmtDate(c.startDate).slice(5)} ~ ${fmtDate(c.endDate).slice(5)}</span>
          <span class="m-views">👁 ${fmtNum(c.views)}</span>
        </div>
      </div>
      <span class="dday-col ${ddayClass(c.dday)}">${ddayText(c.dday)}</span>
    </article>`;
  }

  function renderList() {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    state.page = Math.min(state.page, pages);
    const slice = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);

    $("#resultCount").textContent = fmtNum(list.length);
    const catLabel = state.cat === "all" ? "전체" : catOf(state.cat).label;
    $("#listTitle").firstChild.textContent = state.onlyScraps ? "내 스크랩 " : `${catLabel} 공모전 `;
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
    $("#scrapCount").textContent = state.scraps.size;
  }

  function renderSide() {
    const open = contests.filter((c) => c.dday >= 0);
    $("#rankList").innerHTML = [...open].sort((a, b) => b.views - a.views).slice(0, 7).map((c, i) => `
      <li data-id="${c.id}"><b>${i + 1}</b><span>${c.title}</span><em class="${i % 3 === 1 ? "down" : i === 4 ? "same" : "up"}">${i % 3 === 1 ? "▼" : i === 4 ? "-" : "▲"}</em></li>`).join("");
    const urgent = open.filter((c) => c.dday <= 1).sort((a, b) => a.dday - b.dday);
    $("#todayList").innerHTML = urgent.length ? urgent.map((c) => `
      <li data-id="${c.id}"><span class="dday-sm ${ddayClass(c.dday)}">${ddayText(c.dday)}</span><span>${c.title}</span></li>`).join("") : "<li>오늘 마감 공모전이 없습니다.</li>";
  }

  // ---------- 배너 ----------
  let bannerIdx = 0, bannerTimer;
  function renderBanner() {
    $("#bannerTrack").innerHTML = BANNERS.map((b) => `
      <div class="slide" style="background:linear-gradient(120deg, ${b.bg[0]}, ${b.bg[1]})">
        <span class="b-tag">${b.tag}</span>
        <h2>${b.title}</h2><p>${b.sub}</p>
        <button class="b-btn">자세히 보기 →</button>
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

  // ---------- 상세 ----------
  function openDetail(id) {
    const c = contests.find((x) => x.id === +id);
    if (!c) return;
    c.views += 1;
    const scrapped = state.scraps.has(c.id);
    const second = Math.round(c.first / 2), third = Math.round(c.first / 4);
    $("#detail").innerHTML = `
      <div class="d-top">
        ${poster(c, true)}
        <div class="d-info">
          <div class="labels"><span class="lb cat-lb">${catOf(c.cat).label}</span>${c.hot ? '<span class="lb hot">HOT</span>' : ""}</div>
          <h2>${c.title}</h2>
          <table class="d-table">
            <tr><th>주최/주관</th><td>${c.host}</td></tr>
            <tr><th>기업형태</th><td>${c.hostType}</td></tr>
            <tr><th>참여대상</th><td>${c.target.join(", ")}</td></tr>
            <tr><th>접수기간</th><td>${fmtDate(c.startDate)} ~ ${fmtDate(c.endDate)} <span class="dday-sm ${ddayClass(c.dday)}">${ddayText(c.dday)}</span></td></tr>
            <tr><th>총 상금</th><td><b>${fmtPrize(c.prize)}</b></td></tr>
            <tr><th>1등 상금</th><td>${fmtPrize(c.first)}</td></tr>
            <tr><th>입상 혜택</th><td>${c.benefit.length ? c.benefit.join(", ") : "-"}</td></tr>
            <tr><th>홈페이지</th><td><a href="#" data-toast="외부 사이트로 이동합니다.">www.${c.id}contest.example</a></td></tr>
          </table>
          <div class="d-stats">👁 조회 ${fmtNum(c.views)} · 🔖 스크랩 ${fmtNum(c.scraps + (scrapped ? 1 : 0))}</div>
          <div class="d-actions">
            <button class="btn-primary" data-apply="${c.id}" ${c.dday < 0 ? "disabled" : ""}>${c.dday < 0 ? "접수 마감" : "지원하기"}</button>
            <button class="btn-outline ${scrapped ? "on" : ""}" data-scrap="${c.id}">${scrapped ? "★ 스크랩됨" : "☆ 스크랩"}</button>
            <button class="btn-outline" data-toast="링크가 복사되었습니다.">공유</button>
          </div>
        </div>
      </div>
      <div class="d-body">
        <h3>공모 개요</h3>
        <p>${c.host}에서 주최하는 「${c.title}」에 여러분을 초대합니다. 참신한 시각과 열정을 가진 ${c.target.join("·")} 누구나 참여할 수 있으며,
           우수작은 ${c.benefit.includes("전시 기회") ? "온·오프라인 전시와 함께 " : ""}다양한 채널을 통해 소개될 예정입니다.</p>
        <h3>공모 주제</h3>
        <p>"${catOf(c.cat).label}" 분야 자유 주제 — 일상 속 문제를 새로운 관점으로 바라본 작품</p>
        <h3>시상 내역</h3>
        <table class="d-prize">
          <tr><th>구분</th><th>시상 수</th><th>상금</th></tr>
          <tr><td>대상</td><td>1팀</td><td>${fmtPrize(c.first)}</td></tr>
          <tr><td>최우수상</td><td>2팀</td><td>${fmtPrize(second)}</td></tr>
          <tr><td>우수상</td><td>3팀</td><td>${fmtPrize(third)}</td></tr>
          <tr><td>장려상</td><td>10팀</td><td>상장 및 기념품</td></tr>
        </table>
        <h3>접수 방법</h3>
        <ol>
          <li>공식 홈페이지 회원가입 후 온라인 접수</li>
          <li>참가신청서 및 작품 파일 업로드 (개인 또는 최대 4인 팀)</li>
          <li>접수 마감: ${fmtDate(c.endDate)} 23:59까지</li>
        </ol>
        <h3>유의 사항</h3>
        <ul>
          <li>타 공모전 수상작, 표절 작품은 심사에서 제외되며 수상 이후에도 취소될 수 있습니다.</li>
          <li>제출된 작품의 저작권은 응모자에게 있으며, 주최측은 홍보 목적으로 활용할 수 있습니다.</li>
          <li>문의: contest@${c.id}host.example</li>
        </ul>
      </div>`;
    $("#modal").hidden = false;
    document.body.style.overflow = "hidden";
    $(".modal-body").scrollTop = 0;
    history.replaceState(null, "", `#contest-${c.id}`);
  }
  function closeDetail() {
    $("#modal").hidden = true;
    document.body.style.overflow = "";
    history.replaceState(null, "", location.pathname);
    renderList();
  }

  // ---------- 토스트 ----------
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  function toggleScrap(id) {
    id = +id;
    if (state.scraps.has(id)) { state.scraps.delete(id); toast("스크랩이 해제되었습니다."); }
    else { state.scraps.add(id); toast("스크랩 완료! 마감 하루 전에 알려드릴게요 🔔"); }
    save("moacon_scraps", [...state.scraps]);
  }

  // ---------- 이벤트 ----------
  document.addEventListener("click", (e) => {
    const t = e.target;
    const scrapBtn = t.closest("[data-scrap]");
    if (scrapBtn) {
      e.stopPropagation();
      toggleScrap(scrapBtn.dataset.scrap);
      if (!$("#modal").hidden) openDetail(scrapBtn.dataset.scrap); else renderList();
      return;
    }
    const tt = t.closest("[data-toast]");
    if (tt) { e.preventDefault(); toast(tt.dataset.toast); return; }
    const apply = t.closest("[data-apply]");
    if (apply) { toast("공식 접수 페이지로 이동합니다..."); return; }
    if (t.closest("[data-close]")) { closeDetail(); return; }
    const cat = t.closest("[data-cat]");
    if (cat) { state.cat = cat.dataset.cat; state.page = 1; state.onlyScraps = false; renderCats(); renderList(); return; }
    const chip = t.closest(".chip");
    if (chip) {
      const set = state[chip.dataset.key];
      set.has(chip.dataset.val) ? set.delete(chip.dataset.val) : set.add(chip.dataset.val);
      chip.classList.toggle("on"); state.page = 1; renderList(); return;
    }
    const rm = t.closest("[data-rm]");
    if (rm) {
      const k = rm.dataset.rm;
      if (k === "q") { state.q = ""; $("#searchInput").value = ""; }
      else if (k === "onlyScraps") state.onlyScraps = false;
      else state[k].delete(rm.dataset.val);
      renderFilterChips(); renderList(); return;
    }
    const sort = t.closest("[data-sort]");
    if (sort) {
      state.sort = sort.dataset.sort; state.page = 1;
      $$("#sortTabs button").forEach((b) => b.classList.toggle("on", b === sort)); renderList(); return;
    }
    const view = t.closest("[data-view]");
    if (view) {
      state.view = view.dataset.view;
      $$(".view-toggle button").forEach((b) => b.classList.toggle("on", b === view)); renderList(); return;
    }
    const pg = t.closest("[data-page]");
    if (pg && !pg.disabled) { state.page = +pg.dataset.page; renderList(); $(".list-head").scrollIntoView({ behavior: "smooth" }); return; }
    const b = t.closest("[data-b]");
    if (b) { goBanner(+b.dataset.b); return; }
    const item = t.closest("[data-id]");
    if (item) { openDetail(item.dataset.id); return; }
  });

  function resetAll() {
    Object.assign(state, { cat: "all", q: "", page: 1, onlyScraps: false });
    ["target", "hostType", "prize", "benefit"].forEach((k) => state[k].clear());
    $("#searchInput").value = "";
    renderCats(); renderFilterChips(); renderList();
  }
  $("#resetFilters").addEventListener("click", resetAll);
  $("#emptyReset").addEventListener("click", resetAll);
  $("#logoHome").addEventListener("click", (e) => { e.preventDefault(); resetAll(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  $("#scrapListBtn").addEventListener("click", () => { state.onlyScraps = !state.onlyScraps; state.page = 1; renderList(); });
  $("#hideClosed").addEventListener("change", (e) => { state.hideClosed = e.target.checked; renderList(); });
  $("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); state.q = $("#searchInput").value; state.page = 1; renderList(); });
  $("#searchInput").addEventListener("input", (e) => { state.q = e.target.value; state.page = 1; renderList(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#modal").hidden) closeDetail(); });

  // ---------- init ----------
  renderBanner(); renderCats(); renderFilterChips(); renderList(); renderSide();
  const m = location.hash.match(/^#contest-(\d+)/);
  if (m) openDetail(m[1]);
})();
