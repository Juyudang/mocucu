/* Original vector posters. All lettering and dates stay live and share the contest data.
   A fixed viewBox keeps the same composition in cards, detail pages and the viewer. */
(() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const text = (x, y, size, content, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" ${extra}>${esc(content)}</text>`;
  const rect = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
  const line = (x1, y1, x2, y2, color) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}"/>`;
  const circle = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const label = (s, y = 67, color = 'inherit') => text(42, y, 16, s, `fill="${color}" font-weight="700" letter-spacing="2"`);
  const title = (lines, x, y, size, extra = '') => lines.map((s, i) => text(x, y + i * size * 1.12, size, s, `font-weight="900" letter-spacing="-3" ${extra}`)).join('');

  function footer(c, { bg = '#f7f3e8', ink = '#202623', accent = ink } = {}) {
    const { fmtDate, fmtPrize } = Moacon;
    return rect(0, 638, 600, 162, bg) + `<g fill="${ink}">`
      + line(42, 658, 558, 658, ink)
      + text(42, 690, 17, '접수기간', 'font-weight="700"')
      + text(144, 690, 20, `${fmtDate(c.startDate).slice(5)} — ${fmtDate(c.endDate)}`, 'font-weight="700"')
      + text(42, 721, 16, '참가대상', 'font-weight="700"')
      + text(144, 721, 16, c.target.includes('청소년') && c.target.length === 1 ? '전국 만 13–18세 청소년' : c.target.join(' · '))
      + text(42, 771, 18, c.host, 'font-weight="700"')
      + text(558, 771, 20, `대상 ${fmtPrize(c.first)}`, `text-anchor="end" font-weight="900" fill="${accent}"`)
      + '</g>';
  }

  // A paper plane, an open doorway and stairs: a drawing of a possible tomorrow.
  function tomorrow(c) {
    return rect(0, 0, 600, 800, '#2049b5')
      + `<g fill="#fff8dd">${label('PUREUNKKUM  /  YOUTH ART 07')}${text(42, 112, 22, '제7회 푸른꿈 청소년 그림 공모전')}
      ${title(['나의', '내일'], 36, 224, 112)}${text(338, 198, 18, '10년 뒤,')}${text(338, 225, 18, '나의 하루를')}${text(338, 252, 18, '그려주세요.')}</g>
      <path d="M286 604V392a112 112 0 0 1 224 0v212Z" fill="#ffb56b"/>
      <path d="M326 604V395a72 72 0 0 1 144 0v209Z" fill="#ffe9b1"/>
      ${circle(398, 413, 47, '#f37249')}
      <path d="M326 486q72-80 144 0v118H326" fill="#a8b9ee"/>
      <path d="M326 530q72-80 144-4v78H326" fill="#5275cd"/>
      <path d="M155 638v-39h42v-39h43v-39h43v-39h43v156" fill="#fff8dd"/>
      <path d="M198 599h128m-86-39h86m-43-39h43" stroke="#2049b5" stroke-width="2"/>
      <g transform="translate(65 403) rotate(-13)"><path d="m0 0 153 12-104 44 12-32Z" fill="#f5f2d9"/><path d="m49 56 12-32L153 12" fill="none" stroke="#8fafe4" stroke-width="2"/></g>
      <path d="M50 545q44-74 111-57" stroke="#b8ceff" stroke-dasharray="5 8" fill="none"/>
      ${text(44, 596, 11, 'DRAW YOUR OWN', 'fill="#fff8dd" letter-spacing="1"')}${text(44, 616, 11, 'TOMORROW', 'fill="#fff8dd" letter-spacing="1"')}`
      + footer(c, { accent: '#2049b5' });
  }

  function light(c) {
    return rect(0, 0, 600, 800, '#f1eddf')
      + `<g fill="#232323">${label('NATIONAL YOUTH ART EXHIBITION')}${text(42, 113, 22, `${c.startDate.getFullYear()} 전국 청소년 미술대전`)}
      ${title(['빛과', '그림자'], 37, 225, 102)}${text(552, 222, 96, '&', 'text-anchor="end" font-family="Georgia, serif" font-style="italic" fill="#b19551"')}
      ${text(44, 377, 17, '당신의 시선으로 발견하는 또 다른 세계')}</g>
      <path d="M70 638V510a118 118 0 0 1 236 0v148Z" fill="#b8a476"/>
      <path d="M103 638V510a85 85 0 0 1 170 0v148Z" fill="#222b36"/>
      <path d="M140 638V511a48 48 0 0 1 96 0v147Z" fill="#e8d9b4"/>
      <path d="m236 501 302 137H140Z" fill="#d3b563"/>
      <path d="M334 638V465a78 78 0 0 1 156 0v173Z" fill="#527682"/>
      <path d="M359 638V466a53 53 0 0 1 106 0v172Z" fill="#1f394c"/>
      <path d="M384 638V466a28 28 0 0 1 56 0v172Z" fill="#a6ccd0"/>
      <path d="m440 547 160 91H384Z" fill="#e4eee7"/>
      <path d="M42 620h516" stroke="#232323" stroke-width="1"/>`
      + footer(c, { bg: '#f1eddf' });
  }

  function humanity(c) {
    return rect(0, 0, 600, 800, '#ee6648')
      + `<g fill="#272d2a">${label('HANBIT CULTURAL FOUNDATION')}${text(42, 112, 23, '제5회 한빛 청소년 미술 공모전')}</g>
      <g fill="#fff7df">${title(['사람을', '그리다'], 36, 222, 104)}</g>
      ${text(44, 380, 22, c.theme, 'fill="#272d2a" font-weight="700"')}
      <path d="M0 638V529q31-50 93-43l25-65q8-25 31-17l-4 76 41 19-27 24 6 52 52 63" fill="#f2b0b1"/>
      <path d="M600 638V490q-62-40-123-15l-27-56q-13-24-31-10l12 72-38 25 28 20-1 54-62 58" fill="#273e37"/>
      <path d="M204 638v-54q-27-13-29-48l-20-15 24-23v-25q5-64 78-64 80 4 77 82l-3 33 24 28-22 7q1 43-50 46v33" fill="#fff3d8"/>
      <path d="M260 434q27 27 15 63l-12 27 22 9-9 15m-46-58 15-3m39 80q-25 10-43-7" fill="none" stroke="#313d34" stroke-width="3" stroke-linecap="round"/>
      <path d="M335 638v-45q35-7 37-37l19-15-21-22v-28q-3-48-49-53" fill="none" stroke="#fff3d8" stroke-width="3"/>
      ${circle(530, 176, 22, '#fff3d8')}${text(530, 183, 18, '05', 'fill="#ee6648" font-weight="900" text-anchor="middle"')}`
      + footer(c, { bg: '#fff3d8', accent: '#bb3e28' });
  }

  function earth(c, campaign = false) {
    const bg = campaign ? '#d6e9f6' : '#e8f39a';
    return rect(0, 0, 600, 800, bg)
      + `<g fill="#174b3c">${label(campaign ? 'OURDAYS  /  EARTH CAMPAIGN' : 'A SMALL DRAWING, A GREENER WORLD')}
      ${text(42, 113, 22, campaign ? '아워데이즈 캠페인 공모전' : '청소년 환경 포스터 공모전')}
      ${title(campaign ? ['우리들의', '지구'] : ['숨 쉬는', '지구'], 38, 219, 94)}
      ${text(44, 365, 18, '그림 한 장으로 시작하는 초록빛 변화')}</g>
      ${circle(316, 506, 119, '#265db2')}
      <path d="m245 411 46-20 44 6 13 31-29 26 24 27-28 46-40-14-13-39-34-25Z" fill="#a1cc90"/>
      <path d="m357 500 51-16 23 30-20 48-41 42-14-35-29-24Z" fill="#c5df99"/>
      <g fill="none" stroke="#a2bfdd" stroke-width="1.5"><ellipse cx="316" cy="506" rx="69" ry="119"/><ellipse cx="316" cy="506" rx="119" ry="42"/><path d="M197 506h238M316 387v238"/></g>
      <path d="M165 637q36-83-13-175m18 95q-88-6-88-79 88-1 88 79m-7 46q79-12 70-80-67 5-70 80" fill="#174b3c"/>
      <path d="M446 638q-8-76 57-146m-54 96q-15-78 59-103 20 62-59 103" fill="#3a7b53"/>
      <path d="m482 384 8 17 19 3-14 13 3 19-16-9-17 9 3-19-14-13 19-3Z" fill="#174b3c"/>`
      + footer(c, { bg, ink: '#174b3c' });
  }

  function neighborhood(c) {
    return rect(0, 0, 600, 800, '#eae1f1')
      + `<g fill="#513962">${label('GARAM  /  OUR NEIGHBORHOOD')}${text(42, 115, 22, '청소년 풍경 그리기 대회')}
      ${title(['우리 동네', '풍경 그리기'], 38, 213, 77)}${text(42, 345, 18, '매일 걷던 길에서, 처음 만나는 장면')}</g>
      ${circle(482, 387, 45, '#e88d59')}
      <path d="M0 484q122-125 266 0t334-10v164H0" fill="#a8b79c"/>
      <path d="M0 573q125-55 260 10t340-50v105H0" fill="#54765d"/>
      ${rect(55, 471, 128, 144, '#f6d7aa')}${rect(230, 438, 130, 177, '#fcf1d8')}${rect(412, 490, 112, 125, '#d3a8c3')}
      <path d="m39 471 80-66 80 66m12-33 84-70 84 70m17 52 72-56 71 56" fill="#ad6554"/>
      <g fill="#4d6174">${rect(75, 491, 26, 32, 'currentColor')}${rect(136, 491, 26, 32, 'currentColor')}${rect(251, 461, 28, 34, 'currentColor')}${rect(311, 461, 28, 34, 'currentColor')}${rect(431, 509, 27, 30, 'currentColor')}${rect(484, 509, 22, 30, 'currentColor')}${rect(282, 548, 28, 67, 'currentColor')}</g>
      <path d="m282 615-32 23h110l-50-23" fill="#edca9e"/>
      <g stroke="#384c3e" stroke-width="5"><path d="M205 614v-88m347 88V483"/></g>
      ${circle(205, 518, 26, '#73915c')}${circle(549, 479, 35, '#385a47')}`
      + footer(c, { bg: '#eae1f1', ink: '#513962' });
  }

  const fields = {
    video: ['#202726', '#f4f0de', '#f6a73e', 'FILM & PHOTOGRAPHY', 'film'],
    idea: ['#f5d34f', '#202d36', '#2466ad', 'IDEAS FOR TOMORROW', 'spark'],
    marketing: ['#ee673e', '#fff6e2', '#632c54', 'CREATIVE COMMUNICATION', 'type'],
    it: ['#122c42', '#e2f5e2', '#b9f36b', 'BUILD THE NEXT', 'code'],
    social: ['#dae6c7', '#254c3e', '#6d995c', 'BETTER TOGETHER', 'leaf'],
    startup: ['#e2e8f0', '#233e85', '#eb6240', 'MAKE YOUR NEXT MOVE', 'steps'],
    design: ['#d6c7ec', '#3b2a5d', '#ed6950', 'DESIGN A NEW PERSPECTIVE', 'flower'],
    writing: ['#eee5d5', '#433c35', '#98644f', 'STORIES THAT STAY', 'book'],
    science: ['#c9e3ed', '#173e60', '#ee8254', 'EXPLORE THE POSSIBLE', 'orbit'],
    music: ['#b53f45', '#fff0db', '#f8bb6f', 'SOUND OF A NEW GENERATION', 'sound'],
    art: ['#eae1f1', '#513962', '#e88d59', 'A NEW WAY OF SEEING', 'flower'],
  };

  function motif(kind, ink, accent) {
    const shapes = {
      film: `<g transform="rotate(-12 300 490)">${rect(107, 388, 386, 207, ink)}${rect(126, 418, 348, 148, accent)}${Array.from({ length: 10 }, (_, i) => rect(119 + i * 37, 395, 20, 13, '#202726') + rect(119 + i * 37, 576, 20, 12, '#202726')).join('')}<path d="m264 445 83 46-83 46Z" fill="${ink}"/></g>`,
      spark: `<path d="m299 366 30 72 78-49-42 81 112 21-111 25 45 77-82-46-30 79-27-79-83 46 46-77-111-25 111-21-44-81 78 49Z" fill="${accent}"/>${circle(299, 492, 46, ink)}`,
      type: `<g transform="rotate(-10 300 500)">${text(50, 557, 185, 'Aa!', `fill="${ink}" font-family="Georgia, serif" font-style="italic"`)}<path d="M70 588h460" stroke="${accent}" stroke-width="16"/></g>`,
      code: `<g fill="none" stroke="${accent}" stroke-width="18" stroke-linejoin="round"><path d="m220 425-80 68 80 68m160-136 80 68-80 68m-47-174-60 213"/></g>${rect(52, 381, 496, 229, 'none', `stroke="${ink}" stroke-opacity=".3"`)}${circle(75, 401, 5, accent)}${circle(94, 401, 5, accent)}`,
      leaf: `<path d="M299 617V470m0 79q-126-2-138-149 143 9 138 149m0-50q125-2 138-141-142 9-138 141" fill="${accent}" stroke="${ink}" stroke-width="3"/><path d="m180 421 119 128 115-168" fill="none" stroke="${ink}" stroke-width="2"/>`,
      steps: `<path d="M102 617v-48h75v-48h75v-48h75v-48h75v-48h76v240Z" fill="${ink}"/>${circle(441, 332, 32, accent)}<path d="m95 452 230-106m-65-12 65 12-28 58" fill="none" stroke="${accent}" stroke-width="7"/>`,
      flower: `<g fill="${accent}">${Array.from({ length: 8 }, (_, i) => `<ellipse cx="300" cy="431" rx="40" ry="74" transform="rotate(${i * 45} 300 493)"/>`).join('')}</g>${circle(300, 493, 49, ink)}${circle(300, 493, 18, '#fff6df')}`,
      book: `<path d="M300 424q-100-68-205-26v185q106-42 205 26 99-68 205-26V398q-105-42-205 26Z" fill="${ink}"/><path d="M300 424v185" stroke="${accent}" stroke-width="3"/><g fill="none" stroke="${accent}" stroke-width="2">${Array.from({ length: 7 }, (_, i) => `<path d="M120 ${430 + i * 21}q74-21 155 23m50 0q81-44 155-23"/>`).join('')}</g>`,
      orbit: `<g fill="none" stroke="${ink}" stroke-width="3">${[0, 60, 120].map(a => `<ellipse cx="300" cy="493" rx="183" ry="58" transform="rotate(${a} 300 493)"/>`).join('')}</g>${circle(300, 493, 33, accent)}${circle(483, 493, 14, ink)}${circle(210, 337, 14, ink)}`,
      sound: `<g fill="${ink}">${Array.from({ length: 17 }, (_, i) => { const h = 40 + Math.round((Math.sin(i * .9) + 1) * 90); return rect(64 + i * 28, 490 - h / 2, 13, h, i % 4 ? ink : accent, 'rx="7"'); }).join('')}</g>`,
    };
    const transform = kind === 'orbit' ? 'translate(60 102) scale(.8)' : kind === 'steps' ? 'translate(45 112) scale(.85)' : '';
    return `<g transform="${transform}">${shapes[kind]}</g>`;
  }

  function wrap(s, width = 12) {
    const lines = [];
    let current = '';
    for (const word of s.split(/\s+/)) {
      if (current && (current + ' ' + word).length > width) { lines.push(current); current = ''; }
      // Long unbroken names also need to stay within the print area.
      for (const ch of word) {
        if (current.length >= width) { lines.push(current); current = ''; }
        current += ch;
      }
      current += ' ';
    }
    if (current.trim()) lines.push(current.trim());
    return lines.map(s => s.trim());
  }

  function general(c) {
    const [bg, ink, accent, eyebrow, kind] = fields[c.cat] || fields.art;
    const name = c.title.replace(/^제\d+회\s*/, '').replace(/^\d{4}\s*/, '');
    const lines = wrap(name);
    const size = Math.min(44, 172 / lines.length);
    const edition = c.title.match(/^제\d+회/);
    return rect(0, 0, 600, 800, bg)
      + `<g fill="${ink}">${label(eyebrow)}${text(42, 115, 19, `${edition ? edition[0] + ' · ' : ''}${c.startDate.getFullYear()} ${Moacon.catOf(c.cat).label} 공모`)}
      ${title(lines, 40, 184, size)}${text(42, 343, 17, `총상금 ${Moacon.fmtPrize(c.prize)}  /  ${c.benefit[0] || '작품 공모'}`)}</g>`
      + motif(kind, ink, accent) + footer(c, { bg, ink });
  }

  const designs = { tomorrow, light, humanity, earth, neighborhood, ourdays: c => earth(c, true) };
  window.ContestPosters = {
    render(c, big = false) {
      const art = (designs[c.posterDesign] || general)(c);
      const description = `${c.title}, 주최 ${c.host}, 대상 ${Moacon.fmtPrize(c.first)}, 접수 ${Moacon.fmtDate(c.startDate)}부터 ${Moacon.fmtDate(c.endDate)}까지`;
      return `<div class="poster${big ? ' big' : ''}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" role="img" aria-label="${esc(description)}" focusable="false" font-family="Noto Sans KR, sans-serif"><title>${esc(description)}</title>${art}</svg></div>`;
    },
  };
})();
