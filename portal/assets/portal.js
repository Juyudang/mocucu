/* 포털 페이지 공통 스크립트. <body data-page="home|search|article|comments"> 로 분기 */
(() => {
  const $ = (s) => document.querySelector(s);
  const page = document.body.dataset.page;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtNum = (n) => n.toLocaleString("ko-KR");

  // 로고 글자
  document.querySelectorAll(".logo").forEach((el) => (el.textContent = PORTAL.brand));
  document.querySelectorAll("[data-brand-news]").forEach((el) => (el.textContent = PORTAL.newsBrand));

  const seed = (str) => [...str].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 7);
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
  // 일반 뉴스용 사진 느낌 썸네일 (하늘/지면 + 흐릿한 형체). 그림(art)은 지다람 기사 전용
  function photo(palette = ["#cbd5e1", "#64748b"], key = "") {
    const h = seed(key || palette.join());
    return `<div class="photo thumb" style="--a:${palette[0]};--b:${palette[1]};--x:${20 + h % 50}%;--w:${18 + (h >>> 3) % 22}%"><i></i><i></i></div>`;
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

  // id로 기사 찾기 (홈 더미 뉴스 + 지다람 관련 기사)
  const ALL_NEWS = DUMMY_NEWS.concat(NEWS_RESULTS.filter((n) => !n.main));
  const findNews = (id) => ALL_NEWS.find((n) => n.id === id);
  const REPORTERS = ["김도현", "이수빈", "정하늘", "최민재", "한서영", "오지훈"];
  function dummyComments(n) {
    const pool = DUMMY_COMMENTS[n.cat] || DUMMY_COMMENTS["사회"];
    const h = seed(n.id);
    const ids = ["sky7", "mint", "blue", "haru", "nana", "jjun", "rain", "lucy"];
    return pool.map((text, i) => ({
      id: ids[(h + i) % ids.length] + "****", text,
      min: Math.max(3, n.min - 2 - i * 4), up: Math.round(((h >>> i) % 300) / (i + 1)) + 5,
      down: (h >>> (i + 3)) % 20, replies: (h >>> (i + 5)) % 6,
    })).sort((a, b) => b.up - a.up);
  }
  const thumbFor = (n) => (n.id.startsWith("j") ? art(n.palette) : photo(n.palette, n.id));
  function newsCard(n, q = "") {
    return `<a class="news-item" href="article.html?id=${n.id}">
          <div class="ni-press"><span class="pm" style="background:#6b7280">${n.press.slice(0, 2)}</span>${n.press}<span class="dot">·</span>${ago(n.min)}</div>
          <div class="ni-body"><div><h3 class="ni-title">${highlight(n.title, q)}</h3><p class="ni-sum">${highlight(n.summary, q)}</p></div>${thumbFor(n)}</div>
        </a>`;
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

  // ---------- 홈 ---------- (지다람 기사 없음. 일반 뉴스만)
  if (page === "home") {
    const TABS = { 뉴스: ["사회", "생활"], 엔터: ["엔터"], 스포츠: ["스포츠"], 경제: ["경제"] };
    const render = (tab) => {
      document.querySelectorAll(".feed-tabs span").forEach((el) => el.classList.toggle("on", el.textContent === tab));
      $("#feed").innerHTML = DUMMY_NEWS.filter((n) => TABS[tab].includes(n.cat)).sort((x, y) => x.min - y.min).map((n) => `
        <li><a href="article.html?id=${n.id}"><div><b>${esc(n.title)}</b><small>${n.press} · ${ago(n.min)}</small></div>${thumbFor(n)}</a></li>`).join("");
    };
    $(".feed-tabs").addEventListener("click", (e) => { const t = e.target.closest("span"); if (t) render(t.textContent); });
    render("뉴스");
  }

  // ---------- 검색 결과 ----------
  // '지다람' 관련 검색어면 시나리오 기사, 그 외에는 더미 뉴스에서 검색
  if (page === "search") {
    const q = (new URLSearchParams(location.search).get("query") || "").trim();
    $("#q").value = q;
    document.title = `${q || "검색"} : ${PORTAL.brand} 검색`;
    const isJ = q && JIDARAM_KEYWORDS.some((k) => q.replace(/\s/g, "").includes(k.replace(/\s/g, "")));
    if (isJ) {
      const a = ARTICLE;
      $("#news").innerHTML = NEWS_RESULTS.map((n) => n.main
        ? `<a class="news-item main" href="article.html">
            <div class="ni-press"><span class="pm">${a.pressMark}</span>${a.press}<span class="dot">·</span>${ago(a.postedMinutesAgo)}</div>
            <div class="ni-body"><div><h3 class="ni-title">${highlight(a.title, q)}</h3><p class="ni-sum">${highlight(a.body[0] + " " + a.body[1], q)}</p></div>${articleImage("thumb")}</div>
          </a>`
        : newsCard(n, q)).join("");
      $("#related").innerHTML = RELATED_SEARCHES.map((r) => `<a href="search.html?query=${encodeURIComponent(r)}">${esc(r)}</a>`).join("");
      $("#images").innerHTML = [["#fde68a", "#f472b6"], ["#a7f3d0", "#60a5fa"], ["#e9d5ff", "#818cf8"]].map(art).join("");
    } else {
      const words = q.split(/\s+/).filter(Boolean);
      const hits = words.length ? DUMMY_NEWS.filter((n) => words.some((w) => `${n.title} ${n.summary} ${n.press}`.includes(w))) : [];
      $("#news").innerHTML = hits.length ? hits.map((n) => newsCard(n, q)).join("")
        : `<div class="no-result"><b>'${esc(q)}'</b>에 대한 검색결과가 없습니다.<span>단어의 철자가 정확한지 확인해 보세요.</span></div>`;
      $("#imgSec").hidden = true;
      $("#related").innerHTML = ["날씨", "환율", "유니콘스", "시청률", "마라톤"].map((r) => `<a href="search.html?query=${encodeURIComponent(r)}">${esc(r)}</a>`).join("");
    }
    $("#clearQ").addEventListener("click", () => { $("#q").value = ""; $("#q").focus(); });
  }

  // ---------- 기사 ---------- (id 없으면 시나리오 기사, id 있으면 더미 기사)
  if (page === "article") {
    const id = new URLSearchParams(location.search).get("id");
    const n = id && findNews(id);
    const a = n ? {
      press: n.press, title: n.title, postedMinutesAgo: n.min,
      reporter: REPORTERS[seed(n.id) % REPORTERS.length], body: n.body, caption: `${n.title.split("…")[0]} 관련 현장. (사진=${n.press})`,
      reactions: [["👍", "좋아요", 40 + seed(n.id) % 400], ["😊", "훈훈해요", seed(n.id) % 90], ["😢", "슬퍼요", seed(n.id) % 30], ["😡", "화나요", seed(n.id) % 60], ["🙏", "후속기사 원해요", seed(n.id) % 50]],
    } : ARTICLE;
    const cmts = n ? dummyComments(n) : COMMENTS;
    const cmtHref = n ? `comments.html?id=${n.id}` : "comments.html";
    document.title = `${a.title} : ${PORTAL.brand} 뉴스`;
    $("#press").textContent = a.press;
    $("#title").textContent = a.title;
    $("#stamp").textContent = `입력 ${stamp(a.postedMinutesAgo)}`;
    $("#rep").textContent = `${a.reporter} 기자`;
    $("#body").innerHTML = `
      <p>${esc(a.body[0])}</p>
      <figure class="a-figure">${n ? thumbFor(n) : articleImage()}<figcaption>${esc(a.caption)}</figcaption></figure>
      ${a.body.slice(1).map((p) => `<p>${esc(p)}</p>`).join("")}`;
    $("#repCard").innerHTML = `<b>${a.reporter} 기자</b> · ${a.press}<br>${a.press} 기사 제보 및 보도자료 news@press.example`;
    $("#reacts").innerHTML = a.reactions.map(([i, label, c]) =>
      `<li><button data-react="${c}"><i>${i}</i>${label}<b>${fmtNum(c)}</b></button></li>`).join("");
    $("#cmtCount").textContent = cmts.length;
    $("#cmtCount2").textContent = cmts.length;
    $("#cmtPreview").textContent = cmts[0].text;
    document.querySelectorAll('a[href="comments.html"]').forEach((el) => (el.href = cmtHref));
    $("#reacts").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const on = b.classList.toggle("on");
      b.querySelector("b").textContent = fmtNum(+b.dataset.react + (on ? 1 : 0));
    });
  }

  // ---------- 댓글 ----------
  if (page === "comments") {
    const id = new URLSearchParams(location.search).get("id");
    const n = id && findNews(id);
    const list = n ? dummyComments(n) : COMMENTS;
    $("#cmtCount").textContent = list.length;
    $("#cmtTitle").textContent = n ? n.title : ARTICLE.title;
    if (n) document.querySelector(".back").href = `article.html?id=${n.id}`;
    $("#list").innerHTML = list.map((c, i) => `
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
      const c = list[b.dataset.i];
      const on = b.classList.toggle("on");
      b.querySelector("b").textContent = fmtNum(c[b.dataset.k] + (on ? 1 : 0));
    });
  }
})();
