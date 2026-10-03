/* 포털 페이지 공통 스크립트. <body data-page="home|search|article|comments"> 로 분기 */
(() => {
  const $ = (s) => document.querySelector(s);
  const page = document.body.dataset.page;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtNum = (n) => n.toLocaleString("ko-KR");

  // 로고 글자
  document.querySelectorAll(".logo").forEach((el) => (el.textContent = PORTAL.brand));
  document.querySelectorAll("[data-brand-news]").forEach((el) => (el.textContent = PORTAL.newsBrand));

  function ago(min) {
    if (min < 60) return `${Math.max(1, min)}분 전`;
    if (min < 1440) return `${Math.floor(min / 60)}시간 전`;
    return `${Math.floor(min / 1440)}일 전`;
  }
  function stamp(minAgo) {
    const d = new Date(Date.now() - minAgo * 60000);
    const h = d.getHours(), ap = h < 12 ? "오전" : "오후", hh = h % 12 || 12;
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}. ${ap} ${hh}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  function art(palette = ["#a7f3d0", "#60a5fa"]) {
    return `<div class="art thumb" style="--a:${palette[0]};--b:${palette[1]}"><span class="brush"></span><span class="figs"><i></i><i></i><i></i></span></div>`;
  }
  function articleImage(cls = "") {
    return ARTICLE.image
      ? `<img class="${cls}" src="${ARTICLE.image}" alt="">`
      : art(["#fde68a", "#f472b6"]);
  }
  function highlight(text, q) {
    const out = esc(text);
    const words = q.trim().split(/\s+/).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    return words.length ? out.replace(new RegExp(`(${words.join("|")})`, "g"), "<mark>$1</mark>") : out;
  }

  let toastTimer;
  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1600);
  }
  document.addEventListener("click", (e) => {
    const tt = e.target.closest("[data-toast]");
    if (tt) { e.preventDefault(); toast(tt.dataset.toast); }
    const back = e.target.closest("[data-back]");
    if (back && history.length > 1) { e.preventDefault(); history.back(); }
  });

  // ---------- 홈 ----------
  if (page === "home") {
    $("#feed").innerHTML = NEWS_RESULTS.slice(1).concat([
      { press: "별빛경제", title: "가을 축제 시즌 돌입… 주말 나들이객 몰린다", min: 50, palette: ["#fecaca", "#fb923c"] },
      { press: "한강신문", title: "\"올해 첫 단풍\" 설악산 정상부 물들기 시작", min: 95, palette: ["#fef3c7", "#34d399"] },
    ]).map((n) => `
      <li><div><b>${esc(n.title)}</b><small>${n.press} · ${ago(n.min)}</small></div>${art(n.palette)}</li>`).join("");
  }

  // ---------- 검색 결과 ----------
  if (page === "search") {
    const q = new URLSearchParams(location.search).get("query") || "지다람";
    $("#q").value = q;
    document.title = `${q} : ${PORTAL.brand} 검색`;
    const a = ARTICLE;
    const items = NEWS_RESULTS.map((n) => n.main
      ? `<a class="news-item main" href="article.html">
          <div class="ni-press"><span class="pm">${a.pressMark}</span>${a.press}<span class="dot">·</span>${ago(a.postedMinutesAgo)}</div>
          <div class="ni-body"><div><h3 class="ni-title">${highlight(a.title, q)}</h3><p class="ni-sum">${highlight(a.body[0] + " " + a.body[1], q)}</p></div>${articleImage("thumb")}</div>
        </a>`
      : `<a class="news-item" href="#" data-toast="기사를 불러오는 중입니다…">
          <div class="ni-press"><span class="pm" style="background:#6b7280">${n.press.slice(0, 2)}</span>${n.press}<span class="dot">·</span>${ago(n.min)}</div>
          <div class="ni-body"><div><h3 class="ni-title">${highlight(n.title, q)}</h3><p class="ni-sum">${highlight(n.summary, q)}</p></div>${art(n.palette)}</div>
        </a>`).join("");
    $("#news").innerHTML = items;
    $("#related").innerHTML = RELATED_SEARCHES.map((r) => `<a href="search.html?query=${encodeURIComponent(r)}">${esc(r)}</a>`).join("");
    $("#images").innerHTML = [["#fde68a", "#f472b6"], ["#a7f3d0", "#60a5fa"], ["#e9d5ff", "#818cf8"]].map(art).join("");
    $("#clearQ").addEventListener("click", () => { $("#q").value = ""; $("#q").focus(); });
  }

  // ---------- 기사 ----------
  if (page === "article") {
    const a = ARTICLE;
    document.title = `${a.title} : ${PORTAL.brand} 뉴스`;
    $("#press").textContent = a.press;
    $("#title").textContent = a.title;
    $("#stamp").textContent = `입력 ${stamp(a.postedMinutesAgo)}`;
    $("#rep").textContent = `${a.reporter} 기자`;
    $("#body").innerHTML = `
      <p>${esc(a.body[0])}</p>
      <figure class="a-figure">${articleImage()}<figcaption>${esc(a.caption)}</figcaption></figure>
      ${a.body.slice(1).map((p) => `<p>${esc(p)}</p>`).join("")}`;
    $("#repCard").innerHTML = `<b>${a.reporter} 기자</b> · ${a.press} 문화부<br>${a.press} 기사 제보 및 보도자료 news@haneul.example`;
    $("#reacts").innerHTML = a.reactions.map(([i, label, n]) =>
      `<li><button data-react="${n}"><i>${i}</i>${label}<b>${fmtNum(n)}</b></button></li>`).join("");
    $("#cmtCount").textContent = COMMENTS.length;
    $("#cmtCount2").textContent = COMMENTS.length;
    $("#cmtPreview").textContent = COMMENTS[0].text;
    $("#reacts").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const on = b.classList.toggle("on");
      b.querySelector("b").textContent = fmtNum(+b.dataset.react + (on ? 1 : 0));
    });
  }

  // ---------- 댓글 ----------
  if (page === "comments") {
    $("#cmtCount").textContent = COMMENTS.length;
    $("#cmtTitle").textContent = ARTICLE.title;
    $("#list").innerHTML = COMMENTS.map((c, i) => `
      <li class="c-item">
        <div class="c-top"><span class="c-avatar">●</span><span class="c-id">${esc(c.id)}</span></div>
        <p class="c-text">${esc(c.text)}</p>
        <div class="c-meta">
          <span>${ago(c.min)}</span>
          <a class="reply" href="#" data-toast="답글을 불러오는 중입니다…">답글 ${c.replies}</a>
          <span class="votes">
            <button data-i="${i}" data-k="up">👍 <b>${fmtNum(c.up)}</b></button>
            <button data-i="${i}" data-k="down">👎 <b>${fmtNum(c.down)}</b></button>
          </span>
        </div>
      </li>`).join("");
    $("#list").addEventListener("click", (e) => {
      const b = e.target.closest("[data-k]"); if (!b) return;
      const c = COMMENTS[b.dataset.i];
      const on = b.classList.toggle("on");
      b.querySelector("b").textContent = fmtNum(c[b.dataset.k] + (on ? 1 : 0));
    });
  }
})();
