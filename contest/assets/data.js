/* 촬영용 가상 데이터 — 모든 기관/공모전명은 허구입니다.
   start/end 는 "오늘" 기준 일수(offset). 언제 촬영해도 D-day가 자연스럽게 보이도록. */

window.CATEGORIES = [
  { key: "all",       label: "전체",          icon: "🗂️" },
  { key: "idea",      label: "기획/아이디어",   icon: "💡" },
  { key: "marketing", label: "광고/마케팅",     icon: "📣" },
  { key: "video",     label: "영상/UCC/사진",   icon: "🎬" },
  { key: "art",       label: "미술/회화",      icon: "🖼️" },
  { key: "design",    label: "디자인/캐릭터",   icon: "🎨" },
  { key: "writing",   label: "문학/시나리오",   icon: "✍️" },
  { key: "it",        label: "IT/SW/게임",     icon: "💻" },
  { key: "science",   label: "과학/공학",      icon: "🔬" },
  { key: "social",    label: "사회/환경",      icon: "🌱" },
  { key: "startup",   label: "창업",          icon: "🚀" },
  { key: "music",     label: "음악/예술",      icon: "🎵" },
];

window.FILTERS = {
  target:   ["누구나", "대학생", "대학원생", "청소년", "일반인", "직장인", "외국인"],
  hostType: ["정부/공공기관", "대기업", "중견/중소기업", "지자체", "비영리/협회", "대학교", "언론사"],
  prize:    ["1억 이상", "5천만~1억", "1천만~5천만", "1천만 미만", "상장/기타"],
  benefit:  ["입사 시 가산점", "인턴 채용", "해외연수", "창업 지원", "전시 기회", "상장 수여"],
};

window.CONTESTS = [
  { title: "제12회 청춘 모큐멘터리 영상 공모전", host: "한빛미디어진흥원", hostType: "정부/공공기관", cat: "video", target: ["누구나"], prize: 3000, first: 1000, start: -20, end: 9, views: 18420, scraps: 1204, benefit: ["상장 수여", "전시 기회"], hot: true },
  { title: "2026 그린리프 친환경 아이디어 챌린지", host: "그린리프 그룹", hostType: "대기업", cat: "idea", target: ["대학생", "대학원생"], prize: 5000, first: 2000, start: -12, end: 18, views: 15302, scraps: 980, benefit: ["입사 시 가산점", "인턴 채용"], hot: true },
  { title: "제5회 별빛시 브랜드 슬로건 공모전", host: "별빛시청", hostType: "지자체", cat: "marketing", target: ["누구나"], prize: 600, first: 200, start: -15, end: 2, views: 9821, scraps: 431, benefit: ["상장 수여"] },
  { title: "누리테크 AI 해커톤 2026", host: "(주)누리테크", hostType: "대기업", cat: "it", target: ["대학생", "대학원생", "일반인"], prize: 10000, first: 5000, start: -5, end: 25, views: 22107, scraps: 2311, benefit: ["인턴 채용", "해외연수"], hot: true },
  { title: "푸른바다 해양쓰레기 줄이기 캠페인 공모", host: "한국해양환경협회", hostType: "비영리/협회", cat: "social", target: ["청소년", "대학생"], prize: 800, first: 300, start: -30, end: 0, views: 6411, scraps: 203, benefit: ["상장 수여"] },
  { title: "제3회 달빛제과 신제품 네이밍 공모전", host: "달빛제과", hostType: "중견/중소기업", cat: "marketing", target: ["누구나"], prize: 500, first: 200, start: -3, end: 27, views: 11230, scraps: 650, benefit: ["상장 수여"] },
  { title: "2026 대학생 창업 아이템 경진대회", host: "창업진흥재단", hostType: "정부/공공기관", cat: "startup", target: ["대학생", "대학원생"], prize: 20000, first: 5000, start: -10, end: 40, views: 19870, scraps: 1876, benefit: ["창업 지원", "해외연수"], hot: true },
  { title: "모두의 캐릭터 디자인 공모전 '안녕, 몽이'", host: "몽글몽글 스튜디오", hostType: "중견/중소기업", cat: "design", target: ["누구나"], prize: 1200, first: 500, start: -8, end: 14, views: 8740, scraps: 512, benefit: ["전시 기회"] },
  { title: "제21회 하늘문학상 단편소설 공모", host: "하늘일보", hostType: "언론사", cat: "writing", target: ["누구나"], prize: 3000, first: 2000, start: -40, end: 6, views: 7311, scraps: 389, benefit: ["상장 수여"] },
  { title: "스마트시티 데이터 분석 경진대회", host: "미래도시연구원", hostType: "정부/공공기관", cat: "science", target: ["대학생", "대학원생", "일반인"], prize: 4500, first: 1500, start: -2, end: 33, views: 10255, scraps: 922, benefit: ["입사 시 가산점"] },
  { title: "청춘 숏폼 챌린지 #나의_첫_출근", host: "잡플러스", hostType: "중견/중소기업", cat: "video", target: ["대학생", "일반인"], prize: 700, first: 300, start: -6, end: 1, views: 13450, scraps: 701, benefit: ["인턴 채용"] },
  { title: "제8회 한강 사진 공모전 '도시의 빛'", host: "한강문화재단", hostType: "비영리/협회", cat: "video", target: ["누구나"], prize: 1500, first: 500, start: -25, end: 4, views: 5620, scraps: 287, benefit: ["전시 기회", "상장 수여"] },
  { title: "에코플러스 업사이클링 제품 디자인 어워드", host: "에코플러스", hostType: "중견/중소기업", cat: "design", target: ["대학생", "일반인"], prize: 2000, first: 800, start: -1, end: 45, views: 4402, scraps: 198, benefit: ["창업 지원", "전시 기회"] },
  { title: "제2회 웹툰·웹소설 스토리 원작 공모", host: "하이퍼툰", hostType: "중견/중소기업", cat: "writing", target: ["누구나"], prize: 12000, first: 5000, start: -14, end: 30, views: 25108, scraps: 3021, benefit: ["상장 수여"], hot: true },
  { title: "청소년 과학탐구 아이디어 페스티벌", host: "국립과학관", hostType: "정부/공공기관", cat: "science", target: ["청소년"], prize: 600, first: 100, start: -9, end: 12, views: 3201, scraps: 141, benefit: ["상장 수여", "해외연수"] },
  { title: "온새미은행 금융 마케팅 서포터즈 기획안 공모", host: "온새미은행", hostType: "대기업", cat: "marketing", target: ["대학생"], prize: 2500, first: 1000, start: -4, end: 20, views: 14588, scraps: 1102, benefit: ["입사 시 가산점", "인턴 채용"] },
  { title: "제7회 인디게임 개발 공모전", host: "게임문화협회", hostType: "비영리/협회", cat: "it", target: ["누구나"], prize: 5500, first: 2000, start: -18, end: 11, views: 12034, scraps: 845, benefit: ["창업 지원"] },
  { title: "우리 동네 안전지도 만들기 공모", host: "가람구청", hostType: "지자체", cat: "social", target: ["누구나"], prize: 300, first: 100, start: -7, end: 3, views: 2109, scraps: 77, benefit: ["상장 수여"] },
  { title: "2026 K-뮤직 창작곡 경연대회", host: "소리울엔터테인먼트", hostType: "중견/중소기업", cat: "music", target: ["누구나"], prize: 3000, first: 1500, start: -11, end: 23, views: 9876, scraps: 610, benefit: ["전시 기회"] },
  { title: "도담대학교 개교 50주년 기념 엠블럼 공모", host: "도담대학교", hostType: "대학교", cat: "design", target: ["누구나"], prize: 400, first: 200, start: -16, end: 5, views: 3988, scraps: 160, benefit: ["상장 수여"] },
  { title: "공공데이터 활용 서비스 개발 공모전", host: "행정데이터센터", hostType: "정부/공공기관", cat: "it", target: ["누구나"], prize: 8000, first: 3000, start: -6, end: 36, views: 17760, scraps: 1590, benefit: ["창업 지원", "입사 시 가산점"] },
  { title: "제4회 단편 시나리오 공모 '오늘의 장면'", host: "씨네마루", hostType: "중견/중소기업", cat: "writing", target: ["누구나"], prize: 1800, first: 1000, start: -22, end: 8, views: 8104, scraps: 702, benefit: ["상장 수여"] },
  { title: "탄소중립 생활실천 영상 공모전", host: "기후에너지청", hostType: "정부/공공기관", cat: "video", target: ["청소년", "대학생", "일반인"], prize: 1000, first: 300, start: -13, end: 16, views: 6930, scraps: 355, benefit: ["상장 수여"] },
  { title: "새빛자동차 모빌리티 미래 아이디어 공모", host: "새빛자동차", hostType: "대기업", cat: "idea", target: ["대학생", "대학원생"], prize: 6000, first: 3000, start: -2, end: 29, views: 20511, scraps: 1988, benefit: ["인턴 채용", "해외연수"], hot: true },
  { title: "외국인 유학생 한국생활 수기 공모", host: "국제교류재단", hostType: "비영리/협회", cat: "writing", target: ["외국인"], prize: 500, first: 200, start: -19, end: 10, views: 1840, scraps: 62, benefit: ["상장 수여"] },
  { title: "직장인 업무혁신 아이디어 경진대회", host: "생산성본부", hostType: "정부/공공기관", cat: "idea", target: ["직장인"], prize: 1500, first: 500, start: -21, end: 7, views: 4021, scraps: 133, benefit: ["상장 수여"] },
  { title: "제10회 로봇·드론 창작 경진대회", host: "한울공과대학교", hostType: "대학교", cat: "science", target: ["청소년", "대학생"], prize: 2000, first: 700, start: -3, end: 38, views: 5530, scraps: 304, benefit: ["해외연수"] },
  { title: "마을 공동체 사회문제 해결 프로젝트", host: "희망나눔재단", hostType: "비영리/협회", cat: "social", target: ["누구나"], prize: 3500, first: 1000, start: -8, end: 26, views: 3711, scraps: 219, benefit: ["창업 지원"] },
  { title: "청춘 버스킹 페스티벌 참가팀 모집", host: "별빛시청", hostType: "지자체", cat: "music", target: ["누구나"], prize: 1000, first: 300, start: -12, end: 2, views: 7260, scraps: 390, benefit: ["전시 기회"] },
  { title: "소셜벤처 임팩트 창업 경진대회", host: "임팩트파트너스", hostType: "중견/중소기업", cat: "startup", target: ["누구나"], prize: 15000, first: 5000, start: -7, end: 48, views: 11200, scraps: 940, benefit: ["창업 지원"] },
  { title: "하늘일보 대학생 기자단 기획기사 공모", host: "하늘일보", hostType: "언론사", cat: "writing", target: ["대학생"], prize: 600, first: 200, start: -17, end: 13, views: 4820, scraps: 251, benefit: ["인턴 채용"] },
  { title: "모바일 UX/UI 리디자인 챌린지", host: "(주)픽셀랩", hostType: "중견/중소기업", cat: "design", target: ["대학생", "일반인"], prize: 900, first: 400, start: -5, end: 19, views: 10350, scraps: 1210, benefit: ["인턴 채용"] },
  { title: "제6회 전통시장 홍보 콘텐츠 공모", host: "가람구청", hostType: "지자체", cat: "marketing", target: ["누구나"], prize: 700, first: 300, start: -28, end: -2, views: 3302, scraps: 101, benefit: ["상장 수여"] },
  { title: "2026 사이버보안 CTF 대회", host: "정보보호원", hostType: "정부/공공기관", cat: "it", target: ["대학생", "일반인"], prize: 4000, first: 1500, start: -9, end: 15, views: 8910, scraps: 777, benefit: ["입사 시 가산점"] },
  { title: "반려동물 사진 콘테스트 '우리집 막내'", host: "펫토리", hostType: "중견/중소기업", cat: "video", target: ["누구나"], prize: 200, first: 50, start: -10, end: 0, views: 12980, scraps: 420, benefit: [] },
  { title: "그린에너지 기술 논문 공모전", host: "에너지기술연구원", hostType: "정부/공공기관", cat: "science", target: ["대학원생"], prize: 2500, first: 1000, start: -30, end: 22, views: 2690, scraps: 180, benefit: ["입사 시 가산점", "해외연수"] },
  { title: "제1회 청년 정책 제안 공모전", host: "청년정책위원회", hostType: "정부/공공기관", cat: "idea", target: ["대학생", "일반인"], prize: 1200, first: 500, start: -1, end: 31, views: 6188, scraps: 402, benefit: ["상장 수여"] },
  { title: "광고천재 크리에이티브 어워드", host: "애드브레인", hostType: "중견/중소기업", cat: "marketing", target: ["대학생"], prize: 3000, first: 1000, start: -24, end: 4, views: 16720, scraps: 1442, benefit: ["인턴 채용"] },
  { title: "도시재생 건축 설계 공모전", host: "미래도시연구원", hostType: "정부/공공기관", cat: "design", target: ["대학생", "대학원생"], prize: 5000, first: 2000, start: -35, end: -5, views: 4210, scraps: 260, benefit: ["전시 기회"] },
  { title: "다문화 가족 이야기 그림책 공모", host: "국제교류재단", hostType: "비영리/협회", cat: "writing", target: ["누구나"], prize: 800, first: 300, start: -6, end: 21, views: 2480, scraps: 98, benefit: ["전시 기회"] },
  { title: "누리테크 메타버스 콘텐츠 공모", host: "(주)누리테크", hostType: "대기업", cat: "it", target: ["누구나"], prize: 3000, first: 1000, start: 0, end: 35, views: 980, scraps: 61, benefit: ["인턴 채용"] },
  { title: "제9회 국악 창작 공모전", host: "한빛국악원", hostType: "비영리/협회", cat: "music", target: ["누구나"], prize: 2000, first: 700, start: -20, end: 17, views: 1750, scraps: 77, benefit: ["상장 수여"] },
  { title: "대학생 ESG 경영 케이스 스터디 공모", host: "온새미은행", hostType: "대기업", cat: "idea", target: ["대학생"], prize: 2000, first: 800, start: -2, end: 24, views: 7420, scraps: 618, benefit: ["입사 시 가산점"] },
  { title: "푸드테크 스타트업 데모데이", host: "창업진흥재단", hostType: "정부/공공기관", cat: "startup", target: ["누구나"], prize: 10000, first: 3000, start: -4, end: 19, views: 5302, scraps: 401, benefit: ["창업 지원"] },
  { title: "지역 관광 홍보 UCC 공모전 '여기 어때?'", host: "별빛시청", hostType: "지자체", cat: "video", target: ["누구나"], prize: 1100, first: 400, start: -3, end: 15, views: 6630, scraps: 330, benefit: ["상장 수여"] },
  { title: "장애인식 개선 포스터 공모", host: "희망나눔재단", hostType: "비영리/협회", cat: "social", target: ["청소년", "대학생"], prize: 400, first: 100, start: -14, end: 6, views: 2104, scraps: 88, benefit: ["상장 수여"] },
  { title: "제3회 대학생 모의투자 대회", host: "한울증권", hostType: "대기업", cat: "idea", target: ["대학생"], prize: 3000, first: 1000, start: -11, end: 1, views: 13880, scraps: 1005, benefit: ["인턴 채용"] },
];

/* ── S#2 촬영용: 청소년 미술 공모전 ──────────────────────────────
   scene 값이 있는 3개가 시나리오 속 공모전 (대상 45만 / 90만 / 180만 원). 열린 미술 공모전은 5개만 둔다.
   first = 대상 상금(만원), theme = 공모 주제 */
window.CONTESTS.unshift(
  /* 기본 정렬(최신순)에서 45만 → 90만 → 180만 순서로 위에서부터 보이도록 start 값을 맞춤 */
  { posterDesign: "tomorrow", scene: "45",  title: "제7회 푸른꿈 청소년 그림 공모전 '나의 내일'", host: "푸른꿈청소년재단", hostType: "비영리/협회", cat: "art", target: ["청소년"], prize: 150, first: 45, start: -2, end: 12, views: 4120, scraps: 233, benefit: ["상장 수여"], theme: "10년 뒤 나의 하루" },
  { posterDesign: "light", scene: "90",  title: "2026 전국 청소년 미술대전 '빛과 그림자'", host: "한국청소년미술협회", hostType: "비영리/협회", cat: "art", target: ["청소년"], prize: 300, first: 90, start: -3, end: 17, views: 6380, scraps: 412, benefit: ["상장 수여", "전시 기회"], theme: "빛과 그림자" },
  { posterDesign: "humanity", scene: "180", title: "제5회 한빛 청소년 미술 공모전", host: "한빛문화재단", hostType: "비영리/협회", cat: "art", target: ["청소년"], prize: 600, first: 180, start: -4, end: 21, views: 9874, scraps: 871, benefit: ["상장 수여", "전시 기회", "해외연수"], hot: true, theme: "현대사회 속 인간성의 회복" },
  { posterDesign: "earth", title: "청소년 환경 포스터 공모전 '숨 쉬는 지구'", host: "기후에너지청", hostType: "정부/공공기관", cat: "art", target: ["청소년"], prize: 100, first: 30, start: -7, end: 9, views: 2210, scraps: 98, benefit: ["상장 수여"] },
  { posterDesign: "neighborhood", title: "우리 동네 풍경 그리기 대회", host: "가람구청", hostType: "지자체", cat: "art", target: ["청소년"], prize: 60, first: 20, start: -9, end: 4, views: 1320, scraps: 41, benefit: ["상장 수여"] },
  /* 이미 마감된 공모전 (S#3 알림의 그 공모전). '마감된 공모전 숨기기'가 켜져 있으면 안 보임 */
  { posterDesign: "ourdays", title: "아워데이즈 〈우리들의 지구〉 캠페인 공모전", host: "아워데이즈", hostType: "중견/중소기업", cat: "art", target: ["누구나"], prize: 500, first: 200, start: -60, end: -21, views: 15020, scraps: 1320, benefit: ["상장 수여", "전시 기회"], theme: "우리들의 지구" },
);

window.BANNERS = [
  { tag: "EVENT", title: "가을 공모전 대축제", sub: "지금 지원하면 참가자 전원 커피 쿠폰 증정", bg: ["#5b5bff", "#a26bff"] },
  { tag: "HOT", title: "누리테크 AI 해커톤 2026", sub: "총상금 1억원 · 수상자 전원 인턴 채용 연계", bg: ["#ff6a3d", "#ffb547"] },
  { tag: "NEW", title: "제5회 한빛 청소년 미술 공모전", sub: "주제: 현대사회 속 인간성의 회복 · 대상 180만원", href: "detail.html?id=3", bg: ["#0bb5a6", "#3b82f6"] },
];
