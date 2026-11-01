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

  const regDate = new Date(c.startDate.getTime() - 2 * 86400000);
  const awardRows = awards.map(([n, k, m]) => `<tr><td>${n}</td><td>${k}명</td><td>${m ? fmtPrize(m) : "상장 및 부상"}</td></tr>`).join("");
  const awardText = awards.filter(([, , m]) => m).map(([n, k, m]) => `${n} ${k}명(${fmtPrize(m)})`).join(", ");
  const subField = c.cat === "art" ? "회화, 일러스트, 디지털 드로잉" : cat.label;

  function favBtn(on) {
    return `<button class="fav-btn ${on ? "on" : ""}" id="favBtn" aria-pressed="${on}">
      <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
      즐겨찾기 <em>${fmtNum(c.scraps + (on ? 1 : 0))}</em></button>`;
  }

  function render() {
    const fav = favs.has(c.id);
    $("#detail").innerHTML = `
      <header class="dt-head">
        <h1>${c.title}</h1>
        <span class="dt-dday ${c.dday < 0 ? "closed" : ""}">${ddayText(c.dday)}</span>
        <p class="dt-sub"><span>등록일 ${fmtDate(regDate)}</span><span>조회수 ${fmtNum(c.views)}</span><span>즐겨찾기 ${fmtNum(c.scraps)}</span></p>
      </header>

      <div class="dt-top">
        <div class="dt-poster">${poster(c, true)}<a class="zoom" href="#posterViewer" aria-haspopup="dialog">포스터 크게보기 ＋</a></div>
        <div class="dt-info">
          <table class="info-tbl">
            <tr><th>주최</th><td>${c.host}</td></tr>
            <tr><th>주관</th><td>${c.host} 사무국</td></tr>
            <tr><th>응모분야</th><td>${subField}</td></tr>
            <tr><th>참가자격</th><td>${c.target.join(", ")}${c.target.includes("청소년") ? " (만 13~18세 중·고등학생)" : ""}</td></tr>
            <tr><th>접수기간</th><td>${fmtDate(c.startDate)} ~ ${fmtDate(c.endDate)}</td></tr>
            <tr><th>총 상금</th><td>${fmtPrize(c.prize)}</td></tr>
            <tr class="prize-row"><th>대상 상금</th><td>${fmtNum(c.first)}만 원</td></tr>
            <tr><th>시상내역</th><td>${awardText}</td></tr>
            <tr><th>홈페이지</th><td><a href="#" data-toast="외부 사이트로 이동합니다.">http://www.${c.id}contest.example</a></td></tr>
            <tr><th>첨부파일</th><td><a href="#" class="file" data-toast="파일을 내려받는 중입니다…">${c.title.replace(/'.*?'|〈.*?〉/g, "").trim()}_공모요강.hwp</a></td></tr>
          </table>
          <div class="dt-actions">
            ${favBtn(fav)}
            <button class="apply" data-toast="${c.dday < 0 ? "접수가 마감된 공모전입니다." : "공식 홈페이지 접수 페이지로 이동합니다…"}" ${c.dday < 0 ? "disabled" : ""}>${c.dday < 0 ? "접수마감" : "홈페이지 지원하기"}</button>
            <button data-toast="URL이 복사되었습니다.">공유</button>
          </div>
        </div>
      </div>

      <nav class="dt-tabs"><a href="#" class="on">상세정보</a><a href="#" data-toast="등록된 문의가 없습니다.">Q&amp;A (0)</a><a href="#" data-toast="댓글을 불러오는 중입니다…">댓글 (${(c.id * 7) % 23})</a></nav>

      <section class="d-body">
        <div class="notice-img">${poster(c, true)}</div>
        <h3>공모주제</h3>
        <p class="theme">${theme}</p>
        <h3>응모자격</h3>
        <p>${c.target.join(", ")}${c.target.includes("청소년") ? " (만 13~18세 중·고등학생, 학교 밖 청소년 포함)" : ""} / 개인 참가만 가능</p>
        <h3>접수기간</h3>
        <p>${fmtDate(c.startDate)}(${"일월화수목금토"[c.startDate.getDay()]}) ~ ${fmtDate(c.endDate)}(${"일월화수목금토"[c.endDate.getDay()]}) 23:59까지</p>
        <h3>응모규격</h3>
        <ul>
          <li>${c.cat === "art" ? "4절 ~ 2절 크기, 재료 및 기법 제한 없음" : "형식 자유"}</li>
          <li>디지털 작품은 A3 크기 300dpi 이상 JPG 또는 PDF</li>
          <li>1인 1작품 응모 원칙</li>
        </ul>
        <h3>시상내역</h3>
        <table class="d-prize"><tr><th>구분</th><th>인원</th><th>상금</th></tr>${awardRows}</table>
        <p class="note">※ 제세공과금은 수상자 본인 부담입니다.</p>
        <h3>제출방법</h3>
        <ol>
          <li>공식 홈페이지 회원가입 후 온라인 접수</li>
          <li>참가신청서(첨부파일 양식) 작성 후 작품 이미지와 함께 업로드</li>
        </ol>
        <h3>심사 및 발표</h3>
        <p>1차 서류심사 → 2차 원화심사 / 결과 발표: ${fmtDate(new Date(c.endDate.getTime() + 21 * 86400000))} 홈페이지 공지 및 개별 연락</p>
        <h3>유의사항</h3>
        <ul>
          <li>타 공모전 수상작, 표절 및 모작이 확인될 경우 수상이 취소됩니다.</li>
          <li>수상작의 저작권은 응모자에게 있으며, 주최 측은 홍보 목적으로 사용할 수 있습니다.</li>
          <li>제출된 작품은 반환하지 않습니다.</li>
        </ul>
        <h3>문의처</h3>
        <p>${c.host} 공모전 사무국 (contest@${c.id}host.example / 02-000-${String(1000 + c.id * 37).slice(-4)})</p>
      </section>
      <div class="list-btns"><a href="index.html" data-back>목록</a><a class="dark" href="#" onclick="scrollTo({top:0});return false">맨위로</a></div>
      <dialog class="poster-dialog" id="posterViewer" aria-labelledby="posterViewerTitle">
        <div class="poster-dialog-head"><h2 id="posterViewerTitle">공모전 포스터</h2><button type="button" id="closePoster" autofocus>닫기 ×</button></div>
        ${poster(c, true)}
      </dialog>`;

    const viewer = $("#posterViewer");
    $(".zoom").addEventListener("click", (e) => {
      e.preventDefault();
      viewer.showModal();
    });
    $("#closePoster").addEventListener("click", () => viewer.close());
    viewer.addEventListener("click", (e) => {
      const r = viewer.getBoundingClientRect();
      if (e.target === viewer && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) viewer.close();
    });

    $("#favBtn").addEventListener("click", (e) => {
      const on = toggleFav(c.id);
      const btn = e.currentTarget;
      btn.classList.toggle("on", on);
      btn.setAttribute("aria-pressed", on);
      btn.classList.remove("pop"); void btn.offsetWidth; if (on) btn.classList.add("pop");
      btn.querySelector("em").textContent = fmtNum(c.scraps + (on ? 1 : 0));
    });
  }

  function relList(list) {
    return `<ul class="rel">${list.map((x) => `
      <li><a href="detail.html?id=${x.id}">
        <div class="rel-thumb">${poster(x)}</div>
        <div><b>${x.title}</b><span><em>${ddayText(x.dday)}</em> · 대상 ${fmtPrize(x.first)}</span></div>
      </a></li>`).join("")}</ul>`;
  }
  function renderRelated() {
    const open = contests.filter((x) => x.id !== c.id && x.dday >= 0);
    const same = open.filter((x) => x.cat === c.cat).sort((a, b) => b.views - a.views).slice(0, 5);
    const soon = open.filter((x) => x.cat === c.cat).sort((a, b) => a.dday - b.dday).slice(0, 4);
    $("#related").innerHTML = `
      <div class="side-box"><h3>같은 분야 인기 공모전</h3>${relList(same)}</div>
      <div class="side-box"><h3>마감 임박</h3>${relList(soon)}</div>`;
  }

  document.addEventListener("click", (e) => {
    const back = e.target.closest("[data-back]");
    if (back && fromList) { e.preventDefault(); history.back(); }
  });

  render(); renderRelated(); Moacon.updateFavCount();
})();
