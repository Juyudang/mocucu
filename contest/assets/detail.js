/* 상세 페이지 (detail.html?id=N). 별도 페이지라 트랙패드 스와이프 '뒤로 가기'가 그대로 동작한다. */
(() => {
  const { contests, favs, toggleFav, catOf, fmtDate, fmtNum, fmtPrize, ddayText, ddayClass, poster } = Moacon;
  const $ = (s) => document.querySelector(s);
  const c = Moacon.byId(new URLSearchParams(location.search).get("id")) || contests[0];

  document.title = `${c.title} - 모아콘`;
  c.views += 1;

  // 목록에서 들어왔으면 '목록으로'는 history.back() (필터·스크롤 유지)
  const dir = (u) => u.pathname.replace(/[^/]*$/, "");
  const fromList = (() => {
    try { const r = new URL(document.referrer); return dir(r) === dir(location) && !/detail\.html$/.test(r.pathname); }
    catch { return false; }
  })();
  const cat = catOf(c.cat);
  $("#crumb").innerHTML = `
    <a href="index.html" data-back>공모전</a><span>›</span>
    <a href="index.html?cat=${c.cat}">${cat.label}</a><span>›</span>
    <b>상세정보</b>`;

  const awards = [
    ["대상", 1, c.first],
    ["최우수상", 2, Math.round(c.first / 2)],
    ["우수상", 3, Math.round(c.first / 4)],
    ["장려상", 10, 0],
  ];
  const theme = c.theme || `${cat.label} 분야 자유 주제`;

  function render() {
    const fav = favs.has(c.id);
    $("#detail").innerHTML = `
      <header class="dt-head">
        <div class="labels">
          <span class="lb cat-lb">${cat.label}</span>
          ${c.hot ? '<span class="lb hot">HOT</span>' : ""}
          <span class="dday-sm ${ddayClass(c.dday)}">${ddayText(c.dday)}</span>
        </div>
        <h1>${c.title}</h1>
        <p class="dt-sub">${c.host} · 조회 ${fmtNum(c.views)}</p>
      </header>

      <div class="dt-top">
        <div class="dt-poster">${poster(c, true)}</div>
        <div class="dt-info">
          <div class="prize-hero">
            <span class="ph-label">대상 상금</span>
            <strong class="ph-amount">${fmtNum(c.first)}<small>만 원</small></strong>
            <span class="ph-total">총 상금 ${fmtPrize(c.prize)}</span>
          </div>
          <table class="d-table">
            <tr><th>주최/주관</th><td>${c.host}</td></tr>
            <tr><th>응모 대상</th><td>${c.target.join(", ")}</td></tr>
            <tr><th>접수 기간</th><td>${fmtDate(c.startDate)} ~ ${fmtDate(c.endDate)}</td></tr>
            <tr><th>공모 주제</th><td><b>${theme}</b></td></tr>
            <tr><th>입상 혜택</th><td>${c.benefit.length ? c.benefit.join(", ") : "-"}</td></tr>
            <tr><th>홈페이지</th><td><a href="#" data-toast="외부 사이트로 이동합니다.">www.${c.id}contest.example</a></td></tr>
          </table>
          <div class="dt-actions">
            <button class="fav-btn ${fav ? "on" : ""}" id="favBtn" aria-pressed="${fav}">
              <svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
              <span>${fav ? "즐겨찾기 완료" : "즐겨찾기"}</span>
              <em>${fmtNum(c.scraps + (fav ? 1 : 0))}</em>
            </button>
            <button class="btn-primary" data-toast="${c.dday < 0 ? "접수가 마감된 공모전입니다." : "공식 접수 페이지로 이동합니다..."}" ${c.dday < 0 ? "disabled" : ""}>${c.dday < 0 ? "접수 마감" : "지원하기"}</button>
            <button class="btn-outline" data-toast="링크가 복사되었습니다.">공유</button>
          </div>
        </div>
      </div>

      <section class="d-body">
        <h3>공모 개요</h3>
        <p>${c.host}에서 주최하는 「${c.title}」에 여러분을 초대합니다. 참신한 시각과 열정을 가진 ${c.target.join("·")}이라면 누구나 참여할 수 있으며,
           우수작은 ${c.benefit.includes("전시 기회") ? "온·오프라인 전시와 함께 " : ""}다양한 채널을 통해 소개될 예정입니다.</p>
        <h3>공모 주제</h3>
        <p class="theme-box">${theme}</p>
        <h3>시상 내역</h3>
        <table class="d-prize">
          <tr><th>구분</th><th>시상 수</th><th>상금</th></tr>
          ${awards.map(([n, k, m]) => `<tr><td>${n}</td><td>${k}명</td><td>${m ? fmtPrize(m) : "상장 및 부상"}</td></tr>`).join("")}
        </table>
        <h3>응모 방법</h3>
        <ol>
          <li>작품 규격: ${c.cat === "art" ? "4절 ~ 2절 (재료 제한 없음, 디지털 작업 시 A3 300dpi 이상)" : "자유"}</li>
          <li>공식 홈페이지에서 참가신청서 작성 후 작품 이미지 업로드</li>
          <li>접수 마감: ${fmtDate(c.endDate)} 23:59까지</li>
        </ol>
        <h3>유의 사항</h3>
        <ul>
          <li>타 공모전 수상작, 표절 작품은 심사에서 제외되며 수상 이후에도 취소될 수 있습니다.</li>
          <li>제출된 작품의 저작권은 응모자에게 있으며, 주최 측은 홍보 목적으로 활용할 수 있습니다.</li>
          <li>문의: contest@${c.id}host.example</li>
        </ul>
      </section>`;

    $("#favBtn").addEventListener("click", (e) => {
      const on = toggleFav(c.id);
      const btn = e.currentTarget;
      btn.classList.toggle("on", on);
      btn.classList.remove("pop"); void btn.offsetWidth; if (on) btn.classList.add("pop");
      btn.querySelector("span").textContent = on ? "즐겨찾기 완료" : "즐겨찾기";
      btn.querySelector("em").textContent = fmtNum(c.scraps + (on ? 1 : 0));
    });
  }

  function renderRelated() {
    const rel = contests.filter((x) => x.cat === c.cat && x.id !== c.id && x.dday >= 0)
      .sort((a, b) => b.views - a.views).slice(0, 5);
    $("#related").innerHTML = `
      <div class="box">
        <h3>같은 분야 공모전</h3>
        <ul class="rel">${rel.map((x) => `
          <li><a href="detail.html?id=${x.id}">
            <div class="rel-thumb">${poster(x)}</div>
            <div><b>${x.title}</b><span>대상 ${fmtPrize(x.first)} · ${ddayText(x.dday)}</span></div>
          </a></li>`).join("")}</ul>
      </div>`;
  }

  document.addEventListener("click", (e) => {
    const back = e.target.closest("[data-back]");
    if (back && fromList) { e.preventDefault(); history.back(); }
  });

  render(); renderRelated(); Moacon.updateFavCount();
})();
