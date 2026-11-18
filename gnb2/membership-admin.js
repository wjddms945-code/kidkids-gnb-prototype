(function () {
  "use strict";

  const STORAGE_KEY = "kidkids_membership_curation_v2";
  const LEGACY_STORAGE_KEY = "kidkids_membership_curation_v1";
  const PREVIEW_KEY = "kidkids_membership_preview_v1";
  const URL_EXAMPLE_MIGRATION_KEY = "kidkids_membership_url_example_v1";
  const URL_EXAMPLE_ID = "url-membership-guide";
  const USER_NAME = "김정은";

  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const clone = value => JSON.parse(JSON.stringify(value));

  const layoutThemes = [
    { id: "popular-ranking", label: "인기 순위형", description: "큰 순위 숫자와 가로 영상 카드", cards: 6 },
    { id: "season-masonry", label: "시즌 모자이크형", description: "크기가 다른 이미지 타일 조합", cards: 7 },
    { id: "event-showcase", label: "행사 쇼케이스형", description: "좌측 행사 배너와 우측 6개 카드", cards: 7 },
    { id: "program-circles", label: "프로그램 원형 메뉴형", description: "원형 아이콘 바로가기 메뉴", cards: 9 },
    { id: "art-gallery", label: "명화 갤러리형", description: "가로 이미지 카드 5개 나열", cards: 5 },
    { id: "outdoor-board", label: "바깥놀이 보드형", description: "번호가 있는 텍스트 카드 2단", cards: 8 },
    { id: "monthly-pick", label: "이달 추천 배너형", description: "좌측 CTA 배너와 우측 추천 카드", cards: 5 },
    { id: "future-ranking", label: "미래교육 랭킹형", description: "안내 바와 2열 순위 리스트", cards: 10 }
  ];

  const promotionPresets = [
    { id: "red", label: "빨강", gradient: "linear-gradient(120deg,#5d1016,#b82d36 58%,#e1644f)" },
    { id: "pink", label: "분홍", gradient: "linear-gradient(120deg,#701744,#c12e72 58%,#ee7199)" },
    { id: "orange", label: "주황", gradient: "linear-gradient(120deg,#7b2d0d,#d2641c 58%,#f39a3c)" },
    { id: "yellow", label: "노랑", gradient: "linear-gradient(120deg,#9d6a05,#e4ad20 55%,#ffd86a)", light: true },
    { id: "green", label: "초록", gradient: "linear-gradient(120deg,#123d2d,#257c57 58%,#63b67d)" },
    { id: "blue", label: "파랑", gradient: "linear-gradient(120deg,#12386a,#2769b4 58%,#64a5e8)" },
    { id: "navy", label: "남색", gradient: "linear-gradient(120deg,#111b37,#23345f 58%,#465c8c)" },
    { id: "purple", label: "보라", gradient: "linear-gradient(120deg,#32164f,#6b3490 58%,#a36ac5)" },
    { id: "brown", label: "브라운", gradient: "linear-gradient(120deg,#4d2c1b,#9a5b28 58%,#c57c3d)" },
    { id: "black", label: "검정", gradient: "linear-gradient(120deg,#080a0f,#202631 58%,#3b4350)" },
    { id: "white", label: "흰색", gradient: "linear-gradient(120deg,#ffffff,#f0f2f6 58%,#dfe4ec)", light: true }
  ];

  const sectionBlueprints = [
    { id: "popular", adminName: "인기 콘텐츠", displayTitle: "지금 많이 보는 콘텐츠", subtitle: "선생님들이 가장 많이 찾는 멤버십 자료예요.", badge: "인기", ctaLabel: "전체 보기", visible: true, layoutTheme: "popular-ranking" },
    { id: "autumn", adminName: "시즌 콘텐츠", displayTitle: "단풍과 은행잎으로 만나는 가을", subtitle: "가을 자연을 활용한 다양한 놀이자료를 만나보세요.", badge: "자료 모음", ctaLabel: "가을 자료 보기", visible: true, layoutTheme: "season-masonry" },
    { id: "special-day", adminName: "행사", displayTitle: "특별한 하루를 만드는 행사", subtitle: "준비는 가볍게, 기억은 오래 남는 행사 자료.", badge: "SPECIAL DAY", ctaLabel: "행사 모음 보기", visible: true, layoutTheme: "event-showcase", featuredTitle: "특별한날-추석", featuredDescription: "명절과 특별한 순간을 다양한 놀이와 활동으로 만나보세요.", featuredCta: "행사 모음 보기", featuredImage: "이미지/추석행사 All-in-one.png" },
    { id: "program", adminName: "프로그램", displayTitle: "프로그램 바로가기", subtitle: "수업에 바로 활용하는 키드키즈 대표 프로그램.", badge: "PROGRAM", ctaLabel: "프로그램 보기", visible: true, layoutTheme: "program-circles" },
    { id: "theme", adminName: "추천 테마", displayTitle: "명화로 즐기는 가을", subtitle: "가을의 색과 자연을 담은 작품을 만나보세요.", badge: "추천 테마", ctaLabel: "테마 더보기", visible: true, layoutTheme: "art-gallery" },
    { id: "outdoor", adminName: "바깥놀이", displayTitle: "오늘 바깥놀이, 뭐 하지?", subtitle: "계절을 느끼며 몸과 마음이 자라는 놀이.", badge: "OUTDOOR", ctaLabel: "놀이 더보기", visible: true, layoutTheme: "outdoor-board" },
    { id: "solution", adminName: "이달의 놀이", displayTitle: "이번 달 놀이 고민, 여기서 끝!", subtitle: "매달 새롭게 만나는 놀이 자료를 확인해보세요.", badge: "MONTHLY PLAY", ctaLabel: "놀이자료 보기", visible: true, layoutTheme: "monthly-pick" },
    { id: "future", adminName: "교육부 추천", displayTitle: "교육부 추천, 미래교육", subtitle: "아이들의 내일을 여는 디지털·AI 교육.", badge: "미래교육", ctaLabel: "추천자료 보기", visible: true, layoutTheme: "future-ranking" }
  ];

  function defaultCategories(monthKey) {
    const seasonName = monthKey === "2026-11" ? "겨울 자연" : "가을 자연";
    return [
      { id: "category-all", label: "전체", targetSectionId: "top", visible: true },
      { id: "category-popular", label: "인기 콘텐츠", targetSectionId: "popular", visible: true },
      { id: "category-season", label: seasonName, targetSectionId: "autumn", visible: true },
      { id: "category-event", label: "행사", targetSectionId: "special-day", visible: true },
      { id: "category-program", label: "프로그램", targetSectionId: "program", visible: true },
      { id: "category-theme", label: "추천 테마", targetSectionId: "theme", visible: true },
      { id: "category-outdoor", label: "바깥놀이", targetSectionId: "outdoor", visible: true },
      { id: "category-monthly", label: "이달의 놀이", targetSectionId: "solution", visible: true },
      { id: "category-future", label: "교육부 추천", targetSectionId: "future", visible: true }
    ];
  }

  function defaultProgramShortcuts() {
    const items = [
      ["매직TV", "NEW", "#bf2d73", "이미지/추석행사 All-in-one.png"],
      ["튼튼쑥쑥", "HOT", "#087b68", "이미지/체력 측정 검사.png"],
      ["매직아이", "", "#6246bd", "이미지/시네마 자동차 극장.png"],
      ["디지털 갤러리", "HOT", "#4057bd", "이미지/ChatGPT Image 2026년 9월 9일 오후 03_19_38.png"],
      ["명화감상", "", "#31589c", "이미지/달토끼의 떡 방앗간_가로 .png"],
      ["유아 인성게임", "NEW", "#dc8f22", "이미지/오감퍼포먼스.png"],
      ["매직TV+", "NEW", "#2c9b98", "이미지/ChatGPT Image 2026년 9월 9일 오후 03_17_57.png"],
      ["신체게임놀이", "", "#7d2e91", "이미지/ChatGPT Image 2026년 9월 9일 오후 03_36_10.png"],
      ["소리펜", "", "#27668d", "이미지/ChatGPT Image 2026년 9월 9일 오후 03_24_25.png"]
    ];
    return items.map(([label, badge, color, icon], index) => ({ id: `program-shortcut-${index + 1}`, label, badge, color, icon, url: `/program/${index + 1}`, visible: true }));
  }

  function defaultHeroBanner(monthKey, index = 0) {
    const winter = monthKey === "2026-11";
    return {
      id: `hero-banner-${index + 1}`,
      label: `히어로 배너 ${index + 1}`,
      title: winter ? "상상력과 배움이 자라는\n11월 멤버십 콘텐츠" : "멤버십 회원만을 위한\n특별한 콘텐츠 공간",
      subtitle: winter ? "깊어가는 가을, 수업과 놀이에 필요한 프리미엄 콘텐츠를 만나보세요." : "수업과 놀이에 필요한 프리미엄 콘텐츠를\n한곳에서 만나보세요.",
      badge: winter ? "NOVEMBER MEMBERSHIP" : "MEMBERS ONLY",
      image: winter ? "1.png" : "이미지/추석행사 All-in-one.png",
      visible: true
    };
  }

  function defaultPromotion(monthKey) {
    const winter = monthKey === "2026-11";
    return {
      bannerType: "design",
      design: {
        badge: winter ? "겨울 기획전" : "가을 기획전",
        title: winter ? "겨울 준비, 쇼핑몰에서 한 번에" : "가을 준비, 쇼핑몰에서 한 번에",
        subtitle: winter ? "겨울 놀이와 행사에 필요한 상품을 기획전에서 만나보세요." : "가을 놀이와 행사에 필요한 상품을 기획전에서 만나보세요.",
        ctaLabel: winter ? "겨울 기획전 바로가기" : "가을 기획전 바로가기",
        colorPreset: winter ? "navy" : "brown"
      },
      image: { imageUrl: "", ctaLabel: "바로가기" },
      common: { linkUrl: "/shop/exhibition/season", openNewWindow: false, visible: true }
    };
  }

  function normalizePromotion(saved, monthKey) {
    const base = defaultPromotion(monthKey);
    if (!saved) return base;
    if (saved.design || saved.image || saved.common) {
      return {
        bannerType: saved.bannerType === "image" ? "image" : "design",
        design: { ...base.design, ...(saved.design || {}) },
        image: { ...base.image, ...(saved.image || {}) },
        common: { ...base.common, ...(saved.common || {}) }
      };
    }
    return {
      ...base,
      design: {
        ...base.design,
        badge: saved.badge ?? base.design.badge,
        title: saved.title ?? base.design.title,
        subtitle: saved.subtitle ?? base.design.subtitle,
        ctaLabel: saved.ctaLabel ?? base.design.ctaLabel
      },
      common: {
        ...base.common,
        linkUrl: saved.url ?? base.common.linkUrl,
        visible: saved.visible !== false
      }
    };
  }

  function defaultPageSettings(monthKey) {
    return {
      heroBanners: [defaultHeroBanner(monthKey)],
      categories: defaultCategories(monthKey),
      programShortcuts: defaultProgramShortcuts(),
      promotion: defaultPromotion(monthKey)
    };
  }

  const clipSeeds = {
    "87021": { id: "87021", title: "가을 낙엽으로 꾸미는 우리 반", displayTitle: "가을 낙엽으로 꾸미는 우리 반", month: 10, topic: "가을", type: "활동지", access: "유료", points: 300, link: "/clip/87021", thumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_17_57.png", baseThumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_17_57.png", visible: true, source: "manual" },
    "87022": { id: "87022", title: "숲에서 찾은 가을 색깔", displayTitle: "숲에서 찾은 가을 색깔", month: 10, topic: "가을", type: "영상", access: "무료", points: 0, link: "/clip/87022", thumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_19_38.png", baseThumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_19_38.png", visible: true, source: "recommended" },
    "87023": { id: "87023", title: "단풍잎 모양 관찰 카드", displayTitle: "단풍잎 모양 관찰 카드", month: 10, topic: "가을", type: "교수자료", access: "유료", points: 200, link: "/clip/87023", thumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_24_25.png", baseThumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_24_25.png", visible: true, source: "manual" },
    "87024": { id: "87024", title: "오늘은 꼬마 숲 탐험대", displayTitle: "오늘은 꼬마 숲 탐험대", month: 10, topic: "자연과 생활", type: "놀이자료", access: "유료", points: 500, link: "/clip/87024", thumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_36_10.png", baseThumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_36_10.png", visible: true, source: "recommended" },
    "87025": { id: "87025", title: "달토끼의 떡 방앗간", displayTitle: "달토끼의 떡 방앗간", month: 9, topic: "우리나라", type: "동화", access: "유료", points: 300, link: "/clip/87025", thumbnail: "이미지/달토끼의 떡 방앗간_가로 .png", baseThumbnail: "이미지/달토끼의 떡 방앗간_가로 .png", visible: true, source: "manual" },
    "87026": { id: "87026", title: "추석 행사 All-in-one", displayTitle: "추석 행사 All-in-one", month: 9, topic: "우리나라", type: "행사자료", access: "유료", points: 700, link: "/clip/87026", thumbnail: "이미지/추석행사 All-in-one.png", baseThumbnail: "이미지/추석행사 All-in-one.png", visible: true, source: "recommended" },
    "87027": { id: "87027", title: "오감으로 만나는 가을 열매", displayTitle: "오감으로 만나는 가을 열매", month: 11, topic: "가을", type: "프로그램", access: "무료", points: 0, link: "/clip/87027", thumbnail: "이미지/오감퍼포먼스.png", baseThumbnail: "이미지/오감퍼포먼스.png", visible: true, source: "manual" },
    "87028": { id: "87028", title: "바깥놀이 체력 측정 데이", displayTitle: "바깥놀이 체력 측정 데이", month: 5, topic: "건강과 안전", type: "행사자료", access: "유료", points: 400, link: "/clip/87028", thumbnail: "이미지/체력 측정 검사.png", baseThumbnail: "이미지/체력 측정 검사.png", visible: true, source: "recommended" },
    "87029": { id: "87029", title: "가족과 함께하는 자동차 극장", displayTitle: "가족과 함께하는 자동차 극장", month: 5, topic: "나와 가족", type: "영상", access: "무료", points: 0, link: "/clip/87029", thumbnail: "이미지/시네마 자동차 극장.png", baseThumbnail: "이미지/시네마 자동차 극장.png", visible: false, source: "manual" }
  };
  const clipSeedTaxonomy = {
    "87021": { materialTypeCode: "활동지", materialTypeLabel: "활동지", topicCode: "가을", topicLabel: "가을", memberPolicyCode: "정회원", memberPolicyLabel: "정회원", access: "유료", points: 300 },
    "87022": { materialTypeCode: "활동지", materialTypeLabel: "활동지", topicCode: "가을", topicLabel: "가을", memberPolicyCode: "FREE", memberPolicyLabel: "FREE", access: "무료", points: 0 },
    "87023": { materialTypeCode: "컷&도안", materialTypeLabel: "컷&도안", topicCode: "가을", topicLabel: "가을", memberPolicyCode: "일반(포인트50)", memberPolicyLabel: "일반(포인트50)", access: "포인트", points: 50 },
    "87024": { materialTypeCode: "사진", materialTypeLabel: "사진", topicCode: "동식물과 자연", topicLabel: "동식물과 자연", memberPolicyCode: "멀티회원", memberPolicyLabel: "멀티회원", access: "유료", points: 500 },
    "87025": { materialTypeCode: "애니메이션/동영상", materialTypeLabel: "애니메이션/동영상", topicCode: "우리나라", topicLabel: "우리나라", memberPolicyCode: "정회원", memberPolicyLabel: "정회원", access: "유료", points: 300 },
    "87026": { materialTypeCode: "예문/서식", materialTypeLabel: "예문/서식", topicCode: "우리나라", topicLabel: "우리나라", memberPolicyCode: "멀티회원", memberPolicyLabel: "멀티회원", access: "유료", points: 700 },
    "87027": { materialTypeCode: "오디오클립", materialTypeLabel: "오디오클립", topicCode: "가을", topicLabel: "가을", memberPolicyCode: "FREE", memberPolicyLabel: "FREE", access: "무료", points: 0 },
    "87028": { materialTypeCode: "학습지", materialTypeLabel: "학습지", topicCode: "건강과 안전", topicLabel: "건강과 안전", memberPolicyCode: "정회원", memberPolicyLabel: "정회원", access: "유료", points: 400 },
    "87029": { materialTypeCode: "애니메이션/동영상", materialTypeLabel: "애니메이션/동영상", topicCode: "나와 가족", topicLabel: "나와 가족", memberPolicyCode: "FREE", memberPolicyLabel: "FREE", access: "무료", points: 0 }
  };
  Object.entries(clipSeedTaxonomy).forEach(([id, taxonomy]) => {
    Object.assign(clipSeeds[id], taxonomy, {
      type: taxonomy.materialTypeLabel,
      topic: taxonomy.topicLabel,
      memberPolicy: taxonomy.memberPolicyLabel
    });
  });

  function createUrlLinkExample() {
    const title = "키드키즈 멤버십 이용 안내";
    const thumbnail = defaultLinkThumbnail(title);
    return {
      id: URL_EXAMPLE_ID,
      title,
      displayTitle: title,
      type: "URL 링크",
      access: "바로가기",
      points: 0,
      link: "./kidkidsmembership.html",
      urlThumbnailData: "",
      thumbnail,
      baseThumbnail: thumbnail,
      visible: true,
      openNewWindow: true,
      recommended: false,
      isNew: false,
      source: "url"
    };
  }

  function normalizeContentItem(item) {
    const normalized = { ...clone(clipSeeds[item.id] || {}), ...item };
    normalized.recommended = item.recommended == null ? normalized.source === "recommended" : Boolean(item.recommended);
    normalized.isNew = Boolean(item.isNew);
    return normalized;
  }

  function normalizeThemeItem(item) {
    return normalizeContentItem(item);
  }

  function createThemeGroup(data = {}) {
    const fallbackImage = data.items?.[0]?.thumbnail || "";
    return {
      id: data.id || `theme-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: data.name || "새 놀이 테마",
      image: data.image || fallbackImage,
      subtitle: data.subtitle || "",
      ctaLabel: data.ctaLabel || "테마 전체 보기",
      ctaUrl: data.ctaUrl || "",
      openNewWindow: Boolean(data.openNewWindow),
      visible: data.visible !== false,
      updatedAt: data.updatedAt || nowText(),
      items: (data.items || []).map(normalizeThemeItem)
    };
  }

  function defaultThemeGroups(monthKey, legacyItems = []) {
    const migratedItems = legacyItems.map(normalizeThemeItem);
    const samples = [
      {
        id: `theme-${monthKey}-squirrel`, name: "다람쥐 놀이터", subtitle: "글자·도안·가을 열매",
        ctaLabel: "테마 전체 보기", ctaUrl: "/theme/squirrel-playground", visible: true,
        image: migratedItems[0]?.thumbnail || clipSeeds["87021"].thumbnail,
        items: migratedItems.length ? migratedItems : [clipSeeds["87021"], clipSeeds["87023"], clipSeeds["87024"]]
      },
      {
        id: `theme-${monthKey}-autumn-fruit`, name: "가을 열매 놀이", subtitle: "오감으로 만나는 계절 놀이",
        ctaLabel: "테마 전체 보기", ctaUrl: "/theme/autumn-fruit", visible: true,
        image: clipSeeds["87027"].thumbnail, items: [clipSeeds["87027"], clipSeeds["87022"]]
      },
      {
        id: `theme-${monthKey}-kimchi`, name: "김장 놀이", subtitle: "우리 음식과 문화를 즐기는 놀이",
        ctaLabel: "테마 전체 보기", ctaUrl: "/theme/kimchi-play", visible: true,
        image: clipSeeds["87026"].thumbnail, items: [clipSeeds["87026"], clipSeeds["87025"]]
      }
    ];
    return samples.map((sample, index) => createThemeGroup({ ...sample, updatedAt: index === 0 ? "2026-11-18" : index === 1 ? "2026-11-17" : "2026-11-15" }));
  }

  function seedSections(variant) {
    const sections = sectionBlueprints.map(item => ({ ...clone(item), items: [] }));
    const get = id => sections.find(section => section.id === id);
    const use = ids => ids.map(id => clone(clipSeeds[id]));

    if (variant === "september") {
      get("popular").items = use(["87025", "87026", "87027"]);
      get("special-day").items = use(["87026", "87029"]);
      get("program").items = use(["87027", "87028"]);
      get("theme").items = use(["87025", "87029"]);
    } else if (variant === "october") {
      get("popular").items = [...use(["87021", "87022", "87025", "87027"]), createUrlLinkExample()];
      get("autumn").items = use(["87023", "87024", "87021"]);
      get("special-day").items = use(["87026", "87025", "87029"]);
      get("program").items = use(["87027", "87028"]);
      get("theme").items = use(["87022", "87024", "87026"]);
      get("outdoor").items = use(["87028", "87024"]);
      get("solution").items = use(["87021", "87023"]);
      get("future").items = use(["87022"]);
    } else if (variant === "november") {
      get("autumn").displayTitle = "늦가을 자연이 들려주는 이야기";
      get("autumn").subtitle = "바람과 나뭇잎으로 만나는 11월의 자연 놀이.";
      get("theme").displayTitle = "상상력이 자라는 동화 속 세상";
      get("theme").subtitle = "아이들의 상상을 넓혀주는 이야기 콘텐츠를 만나보세요.";
      get("solution").displayTitle = "11월 놀이 고민, 여기서 끝!";
    }
    return sections;
  }

  function createInitialState() {
    return {
      months: {
        "2026-09": {
          status: "published",
          pageSettings: defaultPageSettings("2026-09"),
          sections: seedSections("september"),
          modifiedAt: "2026-09-30 17:40",
          modifiedBy: USER_NAME,
          history: [
            { action: "9월 편성 발행", at: "2026-09-30 17:40", by: USER_NAME },
            { action: "콘텐츠 순서 변경", at: "2026-09-30 17:18", by: USER_NAME },
            { action: "추석 행사 자료 추가", at: "2026-09-29 14:06", by: USER_NAME }
          ]
        },
        "2026-10": {
          status: "published",
          pageSettings: defaultPageSettings("2026-10"),
          sections: seedSections("october"),
          modifiedAt: "2026-10-29 16:20",
          modifiedBy: USER_NAME,
          history: [
            { action: "10월 편성 발행", at: "2026-10-29 16:20", by: USER_NAME },
            { action: "‘지금 많이 보는 콘텐츠’ 순서 변경", at: "2026-10-29 16:12", by: USER_NAME },
            { action: "‘숲에서 찾은 가을 색깔’ 썸네일 변경", at: "2026-10-29 15:48", by: USER_NAME }
          ]
        },
        "2026-11": {
          status: "draft",
          pageSettings: defaultPageSettings("2026-11"),
          sections: seedSections("november"),
          modifiedAt: "2026-10-29 16:25",
          modifiedBy: USER_NAME,
          history: [
            { action: "11월 신규 편성 생성", at: "2026-10-29 16:25", by: USER_NAME }
          ]
        }
      }
    };
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const normalized = normalizeState(JSON.parse(saved));
        if (!localStorage.getItem(URL_EXAMPLE_MIGRATION_KEY)) {
          const hasUrlItem = Object.values(normalized.months).some(month => month.sections.some(section => section.items.some(item => item.source === "url")));
          const targetMonth = normalized.months["2026-10"] || normalized.months[Object.keys(normalized.months).sort().at(-1)];
          const targetSection = targetMonth?.sections.find(section => section.id === "popular") || targetMonth?.sections[0];
          if (!hasUrlItem && targetSection) {
            targetSection.items.push(createUrlLinkExample());
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          }
          localStorage.setItem(URL_EXAMPLE_MIGRATION_KEY, "1");
        }
        return normalized;
      }
    } catch (error) {
      console.warn("편성 저장 데이터를 불러오지 못했습니다.", error);
    }
    const initialState = normalizeState(createInitialState());
    try { localStorage.setItem(URL_EXAMPLE_MIGRATION_KEY, "1"); } catch (error) { /* 저장소를 사용할 수 없는 환경에서는 기본 예시만 유지 */ }
    return initialState;
  }

  function normalizeCommonSettings(normalized) {
    const monthKeys = Object.keys(normalized.months).sort();
    const referenceMonth = normalized.months["2026-10"] || normalized.months[monthKeys.at(-1)];
    const savedCommon = normalized.commonSettings || {};
    const basePageSettings = clone(savedCommon.pageSettings || referenceMonth.pageSettings);
    const discoveredSections = [];
    const knownSectionIds = new Set();
    const collectSection = section => {
      if (!section || knownSectionIds.has(section.id)) return;
      knownSectionIds.add(section.id);
      const commonSection = { ...clone(section), items: [] };
      delete commonSection.themeGroups;
      discoveredSections.push(commonSection);
    };
    (savedCommon.sections || []).forEach(collectSection);
    Object.values(normalized.months).forEach(month => (month.sections || []).forEach(collectSection));

    const commonModifiedAt = savedCommon.modifiedAt || referenceMonth.modifiedAt || nowText();
    const normalizedHeroBanners = clone(basePageSettings.heroBanners || referenceMonth.pageSettings.heroBanners).map((banner, index) => ({
      ...banner,
      label: banner.label || `히어로 배너 ${index + 1}`,
      createdAt: banner.createdAt || commonModifiedAt,
      updatedAt: banner.updatedAt || banner.createdAt || commonModifiedAt
    }));
    normalized.commonSettings = {
      pageSettings: {
        ...clone(referenceMonth.pageSettings),
        ...basePageSettings,
        heroBanners: normalizedHeroBanners,
        categories: clone(basePageSettings.categories || referenceMonth.pageSettings.categories),
        programShortcuts: clone(basePageSettings.programShortcuts || referenceMonth.pageSettings.programShortcuts),
        promotion: normalizePromotion(basePageSettings.promotion, "2026-10")
      },
      sections: discoveredSections,
      modifiedAt: commonModifiedAt,
      modifiedBy: savedCommon.modifiedBy || referenceMonth.modifiedBy || USER_NAME,
      history: Array.isArray(savedCommon.history) ? savedCommon.history : []
    };
    syncAllMonthsToCommonStructure(normalized);
  }

  function syncAllMonthsToCommonStructure(targetState = state) {
    if (!targetState?.commonSettings?.sections) return;
    Object.values(targetState.months).forEach(month => {
      const existingById = new Map((month.sections || []).map(section => [section.id, section]));
      month.sections = targetState.commonSettings.sections.map(commonSection => {
        const existing = existingById.get(commonSection.id);
        return existing
          ? { ...clone(commonSection), ...existing, adminName: commonSection.adminName, layoutTheme: commonSection.layoutTheme, visible: commonSection.visible, items: existing.items || [] }
          : { ...clone(commonSection), items: [], ...(commonSection.id === "solution" ? { themeGroups: [] } : {}) };
      });
    });
  }

  function normalizeState(input) {
    const normalized = input && input.months ? input : createInitialState();
    Object.entries(normalized.months).forEach(([monthKey, month]) => {
      const previousSettings = month.pageSettings || {};
      month.pageSettings = { ...defaultPageSettings(monthKey), ...previousSettings };
      if (!Array.isArray(previousSettings.heroBanners) || !previousSettings.heroBanners.length) {
        const fallback = defaultHeroBanner(monthKey);
        const legacyImage = previousSettings.heroImages?.find(item => item.visible !== false && item.image)?.image;
        month.pageSettings.heroBanners = [{
          ...fallback,
          title: previousSettings.heroTitle || fallback.title,
          subtitle: previousSettings.heroSubtitle || fallback.subtitle,
          badge: previousSettings.heroBadge || fallback.badge,
          image: legacyImage || fallback.image
        }];
      }
      month.pageSettings.heroBanners = month.pageSettings.heroBanners.map((banner, index) => ({
        ...defaultHeroBanner(monthKey, index),
        ...banner,
        id: banner.id || `hero-banner-${index + 1}-${Date.now()}`,
        label: banner.label || `히어로 배너 ${index + 1}`,
        visible: banner.visible !== false
      }));
      month.pageSettings.categories = month.pageSettings.categories || defaultCategories(monthKey);
      month.pageSettings.programShortcuts = (month.pageSettings.programShortcuts || defaultProgramShortcuts()).map((item, index) => ({
        id: item.id || `program-shortcut-${index + 1}`,
        label: item.label || `프로그램 ${index + 1}`,
        badge: item.badge || "",
        color: item.color || "#4057bd",
        icon: item.icon || "",
        url: item.url || "#",
        visible: item.visible !== false
      }));
      month.pageSettings.promotion = normalizePromotion(month.pageSettings.promotion, monthKey);
      month.sections = (month.sections || []).map((section, index) => {
        const blueprint = sectionBlueprints.find(item => item.id === section.id) || sectionBlueprints[index] || {};
        const normalizedTheme = layoutThemes.some(theme => theme.id === section.layoutTheme)
          ? section.layoutTheme
          : (blueprint.layoutTheme || "popular-ranking");
        const normalizedSection = {
          ...clone(blueprint),
          ...section,
          adminName: section.adminName || blueprint.adminName || section.title || `섹션 ${index + 1}`,
          displayTitle: section.displayTitle || section.title || blueprint.displayTitle || `섹션 ${index + 1}`,
          subtitle: section.subtitle ?? blueprint.subtitle ?? "",
          badge: section.badge ?? blueprint.badge ?? "",
          ctaLabel: section.ctaLabel ?? blueprint.ctaLabel ?? "",
          visible: section.visible !== false,
          layoutTheme: normalizedTheme,
          items: (section.items || []).map(normalizeContentItem)
        };
        if (normalizedSection.id === "solution") {
          normalizedSection.themeGroups = Array.isArray(section.themeGroups)
            ? section.themeGroups.map(createThemeGroup)
            : defaultThemeGroups(monthKey, normalizedSection.items);
          normalizedSection.items = [];
        }
        return normalizedSection;
      });
    });
    normalizeCommonSettings(normalized);
    return normalized;
  }

  let state = loadState();
  let currentMonthKey = state.months["2026-10"] ? "2026-10" : Object.keys(state.months).sort().at(-1);
  let currentSectionId = state.months[currentMonthKey].sections[0].id;
  let dirty = false;
  let dragItemId = null;
  let activeClip = null;
  let contentSourceMode = "clip";
  let urlThumbnailData = "";
  let contentDestination = "section";
  let clipSearchResults = [];
  let selectedClipIds = new Set();
  let clipFilterCatalog = null;
  let editingItemId = null;
  let pendingConfirmResolve = null;
  let recommendationFilter = "전체";
  let recommendations = [];
  let selectedRecommendationIds = new Set();
  let sectionSettingsDraft = [];
  let currentAdminView = "main";
  let activeMainPanelId = "mainHeroSettings";
  let heroManagerMode = "list";
  let heroEditorIsNew = false;
  let activeHeroBannerId = state.commonSettings.pageSettings.heroBanners[0].id;
  let categoryDragId = null;
  let layoutDragId = null;
  let layoutPreviewTargetId = null;
  let programDragId = null;
  let programIconTargetId = null;
  let historyViewOpen = false;
  let historyPage = 1;
  let historyResults = [];
  let copyMonthDirection = "pull";
  let activeThemeId = null;
  const HISTORY_PAGE_SIZE = 5;

  function currentMonth() { return state.months[currentMonthKey]; }
  function commonSettings() { return state.commonSettings; }
  function commonPageSettings() { return commonSettings().pageSettings; }
  function commonSections() { return commonSettings().sections; }
  function currentSection() { return currentMonth().sections.find(section => section.id === currentSectionId) || currentMonth().sections[0]; }
  function isThemeGroupSection(section = currentSection()) { return section?.id === "solution"; }
  function currentTheme() {
    const groups = currentSection().themeGroups || [];
    return groups.find(theme => theme.id === activeThemeId) || groups[0] || null;
  }
  function destinationItems() {
    return contentDestination === "theme" ? (currentTheme()?.items || []) : currentSection().items;
  }
  function touchTheme(theme = currentTheme()) {
    if (theme) theme.updatedAt = nowText();
  }
  function currentHeroBanner() {
    const banners = commonPageSettings().heroBanners;
    return banners.find(banner => banner.id === activeHeroBannerId) || banners[0];
  }

  function sectionContentCountAcrossMonths(sectionId) {
    return Object.values(state.months).reduce((total, month) => {
      const section = (month.sections || []).find(item => item.id === sectionId);
      const directCount = section?.items?.length || 0;
      const themeCount = (section?.themeGroups || []).reduce((sum, theme) => sum + (theme.items?.length || 0), 0);
      return total + directCount + themeCount;
    }, 0);
  }

  function formatMonth(key) {
    const [year, month] = key.split("-");
    return `${year}년 ${Number(month)}월`;
  }

  function nowText() {
    const date = new Date();
    const parts = new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(date).reduce((acc, part) => { acc[part.type] = part.value; return acc; }, {});
    return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function saveStateToStorage() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { console.warn("로컬 저장에 실패했습니다.", error); }
  }

  function inferHistoryArea(action) {
    if (/히어로/.test(action)) return { key: "hero", label: "메인관리 > 히어로 배너" };
    if (/카테고리|섹션|레이아웃|대표 카드/.test(action)) return { key: "category", label: "메인관리 > 카테고리·섹션" };
    if (/프로그램/.test(action)) return { key: "program", label: "메인관리 > 프로그램 메뉴" };
    if (/프로모션|하단 배너/.test(action)) return { key: "promotion", label: "메인관리 > 하단 프로모션" };
    if (/발행/.test(action)) return { key: "publish", label: "발행 관리" };
    return { key: "content", label: "콘텐츠 편성관리" };
  }

  function inferHistoryType(action) {
    if (/발행/.test(action)) return "발행";
    if (/삭제/.test(action)) return "삭제";
    if (/추가|등록|생성/.test(action)) return "등록";
    if (/순서/.test(action)) return "순서 변경";
    if (/노출|새창 열기/.test(action)) return "노출 ON/OFF";
    if (/이미지|썸네일|아이콘/.test(action)) return "이미지 변경";
    if (/타이틀|문구|메뉴명|설명|배지|CTA/.test(action)) return "문구 수정";
    return "수정";
  }

  function inferHistoryItem(action) {
    if (/메인 타이틀/.test(action)) return "메인 타이틀";
    if (/보조문구/.test(action)) return "보조문구";
    if (/배지/.test(action)) return "배지";
    if (/CTA/.test(action)) return "CTA";
    if (/링크/.test(action)) return "연결 URL";
    if (/순서/.test(action)) return "노출 순서";
    if (/노출/.test(action)) return "노출 상태";
    if (/이미지|썸네일|아이콘/.test(action)) return "이미지";
    if (/발행/.test(action)) return "멤버십전용관 발행";
    return action.replace(/\s*(수정|변경|등록|삭제|추가|선택)\s*$/, "") || "운영 설정";
  }

  function inferHistoryValues(action, type) {
    const stateMatch = action.match(/(ON|OFF)$/);
    if (stateMatch) return { before: stateMatch[1] === "ON" ? "OFF" : "ON", after: stateMatch[1] };
    if (type === "삭제") return { before: "등록된 상태", after: "삭제됨" };
    if (type === "등록") return { before: "-", after: action };
    if (type === "순서 변경") return { before: "기존 노출 순서", after: "변경된 노출 순서" };
    if (type === "이미지 변경") return { before: "기존 이미지", after: /삭제/.test(action) ? "이미지 없음" : "변경 이미지" };
    if (type === "발행") return { before: "임시저장", after: "발행" };
    return { before: "기록 당시 이전 값 미저장", after: action };
  }

  function normalizeHistoryEntry(item, monthKey, index = 0) {
    const action = item.action || item.detail || "운영 설정 변경";
    const area = item.area && item.areaKey ? { key: item.areaKey, label: item.area } : inferHistoryArea(action);
    const type = item.type || inferHistoryType(action);
    const values = inferHistoryValues(action, type);
    return {
      ...item,
      id: item.id || `${monthKey}-${item.at || "unknown"}-${index}`.replace(/[^a-zA-Z0-9가-힣-]/g, "-"),
      action,
      at: item.at || "-",
      by: item.by || USER_NAME,
      monthKey: item.monthKey || monthKey,
      monthLabel: (item.monthKey || monthKey) === "common" ? "공통 설정" : formatMonth(item.monthKey || monthKey),
      areaKey: item.areaKey || area.key,
      area: item.area || area.label,
      type,
      item: item.item || inferHistoryItem(action),
      before: item.before ?? values.before,
      after: item.after ?? values.after
    };
  }

  function recordHistory(action, details = {}) {
    const isCommon = currentAdminView === "main";
    const target = isCommon ? commonSettings() : currentMonth();
    target.history = target.history || [];
    const area = details.area && details.areaKey ? { key: details.areaKey, label: details.area } : inferHistoryArea(action);
    const type = details.type || inferHistoryType(action);
    const values = inferHistoryValues(action, type);
    target.history.unshift({
      id: `history-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      action,
      at: nowText(),
      by: USER_NAME,
      monthKey: isCommon ? "common" : currentMonthKey,
      areaKey: details.areaKey || area.key,
      area: details.area || area.label,
      type,
      item: details.item || inferHistoryItem(action),
      before: details.before ?? values.before,
      after: details.after ?? values.after
    });
    target.modifiedAt = target.history[0].at;
    target.modifiedBy = USER_NAME;
  }

  function setDirty(action) {
    dirty = true;
    if (action) recordHistory(action);
    $("#dirtyAlert").classList.add("show");
    renderAudit();
    renderHistory();
  }

  function clearDirty() {
    dirty = false;
    $("#dirtyAlert").classList.remove("show");
  }

  function toast(message, type) {
    const element = document.createElement("div");
    element.className = `toast ${type || ""}`.trim();
    element.textContent = message;
    $("#toastStack").appendChild(element);
    setTimeout(() => element.remove(), 3200);
  }

  function confirmAction({ title, body, okText = "확인", danger = false }) {
    $("#confirmTitle").textContent = title;
    $("#confirmBody").textContent = body;
    $("#confirmOk").textContent = okText;
    $("#confirmOk").className = danger ? "btn danger" : "btn primary";
    $("#confirmBackdrop").classList.add("open");
    $("#confirmBackdrop").setAttribute("aria-hidden", "false");
    return new Promise(resolve => { pendingConfirmResolve = resolve; });
  }

  function closeConfirm(result) {
    $("#confirmBackdrop").classList.remove("open");
    $("#confirmBackdrop").setAttribute("aria-hidden", "true");
    if (pendingConfirmResolve) pendingConfirmResolve(result);
    pendingConfirmResolve = null;
  }

  function renderMonthOptions() {
    const options = Object.keys(state.months).sort().map(key => `<option value="${key}" ${key === currentMonthKey ? "selected" : ""}>${formatMonth(key)}</option>`).join("");
    $("#monthSelect").innerHTML = options;
  }

  function renderStatus() {
    const published = currentMonth().status === "published";
    const badge = $("#monthStatus");
    badge.className = `status-pill ${published ? "published" : "draft"}`;
    badge.textContent = published ? "발행중" : "임시저장";
  }

  function renderSections() {
    const month = currentMonth();
    $("#sectionTotal").textContent = `${month.sections.length}개`;
    $("#sectionList").innerHTML = month.sections.map((section, index) => `
      <button class="section-item ${section.id === currentSectionId ? "active" : ""} ${section.visible ? "" : "section-off"}" data-section-id="${escapeHtml(section.id)}" title="Front 타이틀: ${escapeHtml(section.displayTitle)}">
        <span class="section-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="section-name">${escapeHtml(section.adminName)}</span>
        <span class="section-item-count">${section.visible ? (isThemeGroupSection(section) ? `${(section.themeGroups || []).length}테마` : section.items.length) : "OFF"}</span>
      </button>
    `).join("");
    $$(".section-item").forEach(button => button.addEventListener("click", () => switchSection(button.dataset.sectionId)));
  }

  function updateCopyCounter(input) {
    if (!input) return;
    const limit = Number(input.dataset.copyLimit || 0);
    const length = input.value.length;
    const count = $(`[data-count-for="${input.id}"]`);
    if (count) count.textContent = `${length} / ${limit}`;
    input.closest(".copy-field")?.classList.toggle("over-limit", limit > 0 && length > limit);
  }

  function setCopyValue(id, value) {
    const input = $(`#${id}`);
    if (!input) return;
    input.value = value || "";
    updateCopyCounter(input);
  }

  function renderPageSettings() {
    const banner = currentHeroBanner();
    if (!banner) return;
    setCopyValue("heroLabelInput", banner.label);
    setCopyValue("heroTitleInput", banner.title);
    setCopyValue("heroSubtitleInput", banner.subtitle);
    setCopyValue("heroBadgeInput", banner.badge);
    $("#heroTargetUrlInput").value = banner.targetUrl || "";
    $("#heroBannerEditorLabel").textContent = banner.label;
    $("#heroBannerVisibleInput").checked = banner.visible;
    $("#heroBannerVisibleLabel").textContent = banner.visible ? "ON" : "OFF";
  }

  const mainPanelMeta = {
    mainHeroSettings: { title: "히어로 배너", description: "등록된 히어로 배너의 순서와 노출 상태를 관리합니다." },
    sectionLayoutSettings: { title: "카테고리·섹션", description: "상단 카테고리와 연결 섹션, 레이아웃을 관리합니다." },
    programMenuSettings: { title: "프로그램 메뉴", description: "프로그램 바로가기 메뉴와 노출 순서를 관리합니다." },
    promotionSettings: { title: "하단 프로모션", description: "하단 프로모션 유형과 이미지, URL, 노출 상태를 관리합니다." }
  };

  function renderMainPanel() {
    $$('[data-main-panel]').forEach(panel => { panel.hidden = panel.id !== activeMainPanelId; });
    $$('[data-main-anchor]').forEach(button => button.classList.toggle("active", button.dataset.mainAnchor === activeMainPanelId));
    if (activeMainPanelId === "mainHeroSettings") renderHeroBannerManager();
    const meta = mainPanelMeta[activeMainPanelId] || mainPanelMeta.mainHeroSettings;
    if (currentAdminView === "main" && !historyViewOpen) {
      $("#operationTitle").textContent = `메인관리 · ${meta.title}`;
      $("#operationDescription").textContent = meta.description;
    }
  }

  function switchMainPanel(panelId) {
    if (!mainPanelMeta[panelId] || panelId === activeMainPanelId) return;
    if (dirty && !window.confirm("저장하지 않은 변경사항이 있습니다. 메뉴를 이동해도 변경 내용은 현재 작업 상태로 유지됩니다.")) return;
    activeMainPanelId = panelId;
    heroManagerMode = "list";
    heroEditorIsNew = false;
    renderMainPanel();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderAdminView() {
    const isMain = currentAdminView === "main";
    const isContent = currentAdminView === "content";
    const isStats = currentAdminView === "stats";
    const statsVisible = isStats && !historyViewOpen;
    $("#mainManagementView").hidden = historyViewOpen || !isMain;
    $("#contentManagementView").hidden = historyViewOpen || !isContent;
    $("#statsManagementView").hidden = historyViewOpen || !isStats;
    $("#historyManagementView").hidden = !historyViewOpen;
    $("#mainSidebarMenu").hidden = !isMain;
    $("#contentSidebarMenu").hidden = !isContent;
    $("#statsSidebarMenu").hidden = !isStats;
    $("#mainModeTab").classList.toggle("active", isMain);
    $("#contentModeTab").classList.toggle("active", isContent);
    $("#statsModeTab").classList.toggle("active", isStats);
    $("#openHistoryBtn").classList.toggle("active", historyViewOpen);
    $$("[data-main-anchor]").forEach(item => item.classList.toggle("history-inactive", historyViewOpen));
    document.body.classList.toggle("stats-mode", statsVisible);
    document.body.classList.toggle("main-mode", isMain && !historyViewOpen);
    document.body.classList.toggle("content-mode", isContent && !historyViewOpen);
    $("#operationTitle").textContent = historyViewOpen ? "멤버십전용관 변경 이력" : isStats ? "멤버십전용관 통계" : isMain ? "멤버십전용관 메인 관리" : "멤버십전용관 콘텐츠 편성 관리";
    $("#copyMonthLabel").textContent = "편성 불러오기";
    const scopeBadge = $("#managementScopeBadge");
    scopeBadge.hidden = historyViewOpen || isStats || isMain;
    scopeBadge.className = `management-scope-badge ${isMain ? "common" : "monthly"}`;
    scopeBadge.innerHTML = isMain
      ? "<strong>공통 설정</strong><span>연·월과 무관</span>"
      : `<strong>${formatMonth(currentMonthKey)}</strong><span>월별 편성</span>`;
    $("#saveDraftBtn").lastChild.textContent = isMain ? " 공통 설정 저장" : " 임시저장";
    $("#publishBtn").textContent = isMain ? "공통 설정 적용" : "발행";
    const operationDescription = $("#operationDescription");
    if (operationDescription) operationDescription.textContent = historyViewOpen
      ? "최근 운영 변경사항을 기간·영역·유형·관리자 기준으로 조회합니다."
      : isMain
      ? "연·월과 무관한 히어로·카테고리·섹션 구조·프로그램 메뉴·하단 프로모션을 관리합니다."
      : "연·월별 섹션 문구와 콘텐츠를 편성하고 다른 월로 복사·발행합니다.";
    if (isMain && !historyViewOpen) renderMainPanel();
  }

  function renderHeroBannerManager() {
    const settings = commonPageSettings();
    const banners = settings.heroBanners;
    if (banners.length && !banners.some(banner => banner.id === activeHeroBannerId)) activeHeroBannerId = banners[0].id;
    const activeBanner = currentHeroBanner();
    $("#heroBannerCount").textContent = `${banners.length}개`;
    $("#heroBannerListView").hidden = heroManagerMode !== "list";
    $("#heroBannerEditorView").hidden = heroManagerMode !== "editor";
    $("#heroBannerSetList").innerHTML = banners.length ? banners.map((banner, index) => `
      <article class="hero-admin-row" data-hero-set="${escapeHtml(banner.id)}">
        <div class="hero-admin-order"><strong>${String(index + 1).padStart(2, "0")}</strong><span><button data-hero-move="up" data-hero-id="${escapeHtml(banner.id)}" ${index === 0 ? "disabled" : ""} title="위로">↑</button><button data-hero-move="down" data-hero-id="${escapeHtml(banner.id)}" ${index === banners.length - 1 ? "disabled" : ""} title="아래로">↓</button></span></div>
        <div class="hero-admin-thumb">${banner.image ? `<img src="${escapeHtml(banner.image)}" alt="" />` : "이미지 없음"}</div>
        <strong class="hero-admin-name" title="${escapeHtml(banner.label)}">${escapeHtml(banner.label)}${banner.targetUrl ? '<small class="hero-link-badge">LINK</small>' : ""}</strong>
        <span class="hero-admin-title" title="${escapeHtml(String(banner.title || "").replace(/\n/g, " "))}">${escapeHtml(String(banner.title || "").replace(/\n/g, " ") || "-")}</span>
        <label class="hero-admin-visible" title="배너 노출"><span class="toggle"><input type="checkbox" data-hero-set-visible="${escapeHtml(banner.id)}" ${banner.visible ? "checked" : ""} /><span class="toggle-track"></span></span><strong>${banner.visible ? "ON" : "OFF"}</strong></label>
        <span class="hero-admin-date">${escapeHtml(String(banner.updatedAt || banner.createdAt || "-").slice(0, 10))}</span>
        <div class="hero-admin-actions"><button class="btn small" data-hero-preview="${escapeHtml(banner.id)}">미리보기</button><button class="btn small" data-hero-edit="${escapeHtml(banner.id)}">수정</button><button class="btn small danger" data-hero-remove="${escapeHtml(banner.id)}" ${banners.length === 1 ? "disabled" : ""}>삭제</button></div>
      </article>`).join("") : '<div class="hero-admin-empty">등록된 히어로 배너가 없습니다.</div>';

    if (activeBanner && heroManagerMode === "editor") {
      $("#heroBannerEditorTitle").textContent = heroEditorIsNew ? "히어로 배너 등록" : "히어로 배너 수정";
      $("#heroEditorDoneBtn").textContent = heroEditorIsNew ? "등록 완료" : "수정 완료";
      $("#heroCompositePreview").innerHTML = activeBanner.image
        ? `<img src="${escapeHtml(activeBanner.image)}" alt="${escapeHtml(activeBanner.label)} 통이미지" />`
        : '<span class="empty-image">등록된 통이미지가 없습니다.</span>';
      $("#heroImageDeleteBtn").disabled = !activeBanner.image;
      renderPageSettings();
    }

    $$('[data-hero-edit]').forEach(button => button.addEventListener("click", () => openHeroEditor(button.dataset.heroEdit, false)));
    $$('[data-hero-preview]').forEach(button => button.addEventListener("click", () => previewHeroBanner(button.dataset.heroPreview)));
    $$('[data-hero-set-visible]').forEach(input => input.addEventListener("change", () => {
      const banner = banners.find(item => item.id === input.dataset.heroSetVisible);
      banner.visible = input.checked;
      banner.updatedAt = nowText();
      setDirty(`${banner.label} 노출 ${input.checked ? "ON" : "OFF"}`);
      renderHeroBannerManager();
    }));
    $$('[data-hero-move]').forEach(button => button.addEventListener("click", () => {
      const fromIndex = banners.findIndex(item => item.id === button.dataset.heroId);
      const toIndex = button.dataset.heroMove === "up" ? fromIndex - 1 : fromIndex + 1;
      if (toIndex < 0 || toIndex >= banners.length) return;
      const [moved] = banners.splice(fromIndex, 1);
      banners.splice(toIndex, 0, moved);
      setDirty("히어로 배너 세트 순서 변경");
      renderHeroBannerManager();
    }));
    $$('[data-hero-remove]').forEach(button => button.addEventListener("click", () => {
      if (banners.length === 1 || !window.confirm("이 히어로 배너 세트를 삭제할까요?")) return;
      const index = banners.findIndex(item => item.id === button.dataset.heroRemove);
      const [removed] = banners.splice(index, 1);
      activeHeroBannerId = banners[Math.max(0, index - 1)].id;
      setDirty(`${removed.label} 삭제`);
      renderHeroBannerManager();
    }));
  }

  function openHeroEditor(bannerId, isNew) {
    if (!commonPageSettings().heroBanners.some(banner => banner.id === bannerId)) return;
    activeHeroBannerId = bannerId;
    heroEditorIsNew = Boolean(isNew);
    heroManagerMode = "editor";
    renderHeroBannerManager();
  }

  function closeHeroEditor() {
    heroManagerMode = "list";
    heroEditorIsNew = false;
    renderHeroBannerManager();
  }

  function touchCurrentHeroBanner() {
    const banner = currentHeroBanner();
    if (banner) banner.updatedAt = nowText();
  }

  function themeIconMarkup(theme) {
    const blocks = Array.from({ length: Math.min(theme.cards, 10) }, () => "<i></i>").join("");
    return `<span class="theme-icon ${escapeHtml(theme.id)}">${blocks}</span>`;
  }

  function syncNavigationRows() {
    const settings = commonPageSettings();
    const sections = commonSections();
    const categories = settings.categories || [];
    const topCategory = categories.find(category => category.targetSectionId === "top") || { id: `category-top-${Date.now()}`, label: "전체", targetSectionId: "top", visible: true };
    const unused = categories.filter(category => category !== topCategory);
    const linked = sections.map((section, index) => {
      const exactIndex = unused.findIndex(category => category.targetSectionId === section.id);
      const category = exactIndex >= 0
        ? unused.splice(exactIndex, 1)[0]
        : (unused.shift() || { id: `category-${section.id}`, label: section.adminName || `메뉴 ${index + 1}`, visible: true });
      category.targetSectionId = section.id;
      return category;
    });
    settings.categories = [topCategory, ...linked];
    return settings.categories;
  }

  function previewCardsMarkup(theme) {
    return Array.from({ length: theme.cards }, () => '<div class="layout-preview-card"><div class="layout-preview-thumb"></div><strong></strong><span></span></div>').join("");
  }

  function openLayoutPreview(themeId, targetSectionId = null) {
    const theme = layoutThemes.find(item => item.id === themeId) || layoutThemes[0];
    layoutPreviewTargetId = targetSectionId;
    $("#layoutPreviewTitle").textContent = theme.label;
    $("#layoutPreviewDescription").textContent = theme.description;
    $("#layoutPreviewStage").className = `layout-preview-stage preview-theme--${theme.id}`;
    $("#layoutPreviewStage").innerHTML = `<div class="layout-preview-section-head"><div class="layout-preview-copy"><small>MEMBERSHIP CURATION</small><h4>${escapeHtml(theme.label)}</h4><p>${escapeHtml(theme.description)} 레이아웃 예시입니다.</p></div><span class="layout-preview-more">전체 보기</span></div><div class="layout-preview-cards">${previewCardsMarkup(theme)}</div>`;
    $("#layoutPreviewApply").hidden = true;
    const backdrop = $("#layoutPreviewBackdrop");
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
  }

  function closeLayoutPreview() {
    const backdrop = $("#layoutPreviewBackdrop");
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
    layoutPreviewTargetId = null;
  }

  function renderSectionLayouts() {
    const sections = commonSections();
    const categories = syncNavigationRows();
    const topCategory = categories[0];
    const themeOptions = selected => layoutThemes.map(theme => `<option value="${theme.id}" ${theme.id === selected ? "selected" : ""}>${escapeHtml(theme.label)}</option>`).join("");
    const sectionOptions = selected => sections.map(section => `<option value="${escapeHtml(section.id)}" ${section.id === selected ? "selected" : ""}>${escapeHtml(section.adminName)}</option>`).join("");

    $("#layoutThemeGuide").innerHTML = layoutThemes.map(theme => `<button class="layout-theme-card" data-theme-guide-preview="${theme.id}">${themeIconMarkup(theme)}<span><strong>${escapeHtml(theme.label)}</strong><span>${escapeHtml(theme.description)}</span></span></button>`).join("");
    $("#layoutSectionList").innerHTML = `
      <article class="layout-section-row is-top">
        <div class="layout-order"><span>고정</span></div>
        <input class="copy-input" value="${escapeHtml(topCategory.label)}" data-category-label="${escapeHtml(topCategory.id)}" aria-label="상단 카테고리명" />
        <span class="category-home-label">페이지 상단 / 첫 콘텐츠</span>
        <span class="layout-not-applicable">레이아웃 없음</span>
        <label class="layout-visible"><span class="toggle"><input type="checkbox" data-category-visible="${escapeHtml(topCategory.id)}" ${topCategory.visible ? "checked" : ""} /><span class="toggle-track"></span></span><span>${topCategory.visible ? "ON" : "OFF"}</span></label>
        <span class="layout-not-applicable">—</span><span class="layout-not-applicable">—</span>
      </article>
      ${sections.map((section, index) => {
        const category = categories[index + 1];
        return `<article class="layout-section-row" draggable="true" data-layout-section="${escapeHtml(section.id)}">
          <div class="layout-order"><button class="drag-handle" aria-label="카테고리와 섹션 순서 변경">${dragIcon()}</button><span>${String(index + 1).padStart(2, "0")}</span></div>
          <input class="copy-input" value="${escapeHtml(category.label)}" data-category-label="${escapeHtml(category.id)}" aria-label="상단 카테고리명" />
          <select class="copy-input" data-category-target="${escapeHtml(category.id)}" aria-label="연결 섹션">${sectionOptions(category.targetSectionId)}</select>
          <select class="copy-input" data-layout-theme="${escapeHtml(section.id)}" aria-label="레이아웃 테마">${themeOptions(section.layoutTheme)}</select>
          <label class="layout-visible"><span class="toggle"><input type="checkbox" data-category-visible="${escapeHtml(category.id)}" ${category.visible ? "checked" : ""} /><span class="toggle-track"></span></span><span>${category.visible ? "ON" : "OFF"}</span></label>
          <label class="layout-visible"><span class="toggle"><input type="checkbox" data-layout-visible="${escapeHtml(section.id)}" ${section.visible ? "checked" : ""} /><span class="toggle-track"></span></span><span>${section.visible ? "ON" : "OFF"}</span></label>
          <div class="layout-actions"><button class="btn small preview-layout-btn" data-layout-preview="${escapeHtml(section.id)}">미리보기</button><button class="btn small danger" data-layout-delete="${escapeHtml(section.id)}" ${sectionContentCountAcrossMonths(section.id) ? "disabled" : ""} title="${sectionContentCountAcrossMonths(section.id) ? "월별 편성 콘텐츠가 있어 삭제할 수 없습니다." : "모든 월에서 비어 있는 공통 섹션을 삭제합니다."}">삭제</button></div>
        </article>`;
      }).join("")}`;

    $$('[data-theme-guide-preview]').forEach(button => button.addEventListener("click", () => openLayoutPreview(button.dataset.themeGuidePreview)));
    $$('[data-category-label]').forEach(input => {
      input.addEventListener("input", () => {
        categories.find(item => item.id === input.dataset.categoryLabel).label = input.value;
        setDirty();
      });
      input.addEventListener("change", () => { recordHistory("상단 카테고리 메뉴명 수정"); renderHistory(); renderAudit(); });
    });
    $$('[data-category-target]').forEach(select => select.addEventListener("change", () => {
      const category = categories.find(item => item.id === select.dataset.categoryTarget);
      const previousTarget = category.targetSectionId;
      const otherCategory = categories.find(item => item !== category && item.targetSectionId === select.value);
      category.targetSectionId = select.value;
      if (otherCategory) otherCategory.targetSectionId = previousTarget;
      setDirty("상단 카테고리 연결 섹션 변경");
      renderSectionLayouts();
    }));
    $$('[data-category-visible]').forEach(input => input.addEventListener("change", () => {
      const category = categories.find(item => item.id === input.dataset.categoryVisible);
      category.visible = input.checked;
      setDirty(`‘${category.label}’ 카테고리 노출 ${input.checked ? "ON" : "OFF"}`);
      renderSectionLayouts();
    }));
    $$('[data-layout-theme]').forEach(select => select.addEventListener("change", () => {
      const section = sections.find(item => item.id === select.dataset.layoutTheme);
      section.layoutTheme = select.value;
      syncAllMonthsToCommonStructure();
      setDirty(`‘${section.adminName}’ 레이아웃 테마 변경`);
      openLayoutPreview(section.layoutTheme, section.id);
    }));
    $$('[data-layout-preview]').forEach(button => button.addEventListener("click", () => {
      const section = sections.find(item => item.id === button.dataset.layoutPreview);
      openLayoutPreview(section.layoutTheme, section.id);
    }));
    $$('[data-layout-visible]').forEach(input => input.addEventListener("change", () => {
      const section = sections.find(item => item.id === input.dataset.layoutVisible);
      section.visible = input.checked;
      syncAllMonthsToCommonStructure();
      setDirty(`‘${section.adminName}’ 섹션 노출 ${input.checked ? "ON" : "OFF"}`);
      renderSectionLayouts();
      renderSections();
    }));
    $$('[data-layout-delete]').forEach(button => button.addEventListener("click", () => deleteSectionById(button.dataset.layoutDelete)));
    $$("#layoutSectionList [data-layout-section]").forEach(row => {
      row.addEventListener("dragstart", () => { layoutDragId = row.dataset.layoutSection; row.classList.add("dragging"); });
      row.addEventListener("dragend", () => { layoutDragId = null; row.classList.remove("dragging"); $$("#layoutSectionList .drag-over").forEach(item => item.classList.remove("drag-over")); });
      row.addEventListener("dragover", event => { event.preventDefault(); row.classList.add("drag-over"); });
      row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
      row.addEventListener("drop", event => {
        event.preventDefault();
        const targetId = row.dataset.layoutSection;
        if (!layoutDragId || layoutDragId === targetId) return;
        const fromIndex = sections.findIndex(section => section.id === layoutDragId);
        const toIndex = sections.findIndex(section => section.id === targetId);
        const [moved] = sections.splice(fromIndex, 1);
        sections.splice(toIndex, 0, moved);
        const categoryByTarget = new Map(categories.map(category => [category.targetSectionId, category]));
        commonPageSettings().categories = [categories[0], ...sections.map(section => categoryByTarget.get(section.id))];
        syncAllMonthsToCommonStructure();
        setDirty("상단 카테고리와 Front 섹션 순서 변경");
        renderSectionLayouts();
        renderSections();
      });
    });
  }

  function renderProgramShortcuts() {
    const programs = commonPageSettings().programShortcuts;
    $("#programShortcutList").innerHTML = programs.map((program, index) => `
      <article class="program-shortcut-row" draggable="true" data-program-id="${escapeHtml(program.id)}">
        <div class="program-order"><button class="drag-handle" aria-label="프로그램 순서 변경">${dragIcon()}</button><span>${String(index + 1).padStart(2, "0")}</span></div>
        <button class="program-icon-button" data-program-icon="${escapeHtml(program.id)}" style="--program-color:${escapeHtml(program.color)}" aria-label="${escapeHtml(program.label)} 아이콘 교체">${program.icon ? `<img src="${escapeHtml(program.icon)}" alt="" />` : "<span>+</span>"}<em>교체</em></button>
        <input class="copy-input" value="${escapeHtml(program.label)}" data-program-label="${escapeHtml(program.id)}" aria-label="프로그램명" />
        <select class="copy-input" data-program-badge="${escapeHtml(program.id)}" aria-label="배지"><option value="" ${!program.badge ? "selected" : ""}>없음</option><option value="NEW" ${program.badge === "NEW" ? "selected" : ""}>NEW</option><option value="HOT" ${program.badge === "HOT" ? "selected" : ""}>HOT</option></select>
        <input class="copy-input" value="${escapeHtml(program.url)}" data-program-url="${escapeHtml(program.id)}" aria-label="연결 URL" />
        <label class="layout-visible"><span class="toggle"><input type="checkbox" data-program-visible="${escapeHtml(program.id)}" ${program.visible ? "checked" : ""} /><span class="toggle-track"></span></span><span>${program.visible ? "ON" : "OFF"}</span></label>
        <div class="layout-actions"><button class="btn small danger" data-program-delete="${escapeHtml(program.id)}" ${programs.length <= 1 ? "disabled" : ""}>삭제</button></div>
      </article>`).join("");

    $$('[data-program-label]').forEach(input => input.addEventListener("input", () => {
      programs.find(item => item.id === input.dataset.programLabel).label = input.value;
      setDirty();
    }));
    $$('[data-program-label]').forEach(input => input.addEventListener("change", () => { recordHistory("프로그램 메뉴명 수정"); renderHistory(); }));
    $$('[data-program-badge]').forEach(select => select.addEventListener("change", () => {
      const item = programs.find(program => program.id === select.dataset.programBadge);
      item.badge = select.value;
      setDirty(`‘${item.label}’ 배지 변경`);
    }));
    $$('[data-program-url]').forEach(input => input.addEventListener("input", () => {
      programs.find(item => item.id === input.dataset.programUrl).url = input.value;
      setDirty();
    }));
    $$('[data-program-icon]').forEach(button => button.addEventListener("click", () => {
      programIconTargetId = button.dataset.programIcon;
      $("#programIconFileInput").click();
    }));
    $$('[data-program-visible]').forEach(input => input.addEventListener("change", () => {
      const item = programs.find(program => program.id === input.dataset.programVisible);
      item.visible = input.checked;
      setDirty(`‘${item.label}’ 프로그램 노출 ${item.visible ? "ON" : "OFF"}`);
      renderProgramShortcuts();
    }));
    $$('[data-program-delete]').forEach(button => button.addEventListener("click", () => {
      const item = programs.find(program => program.id === button.dataset.programDelete);
      if (programs.length <= 1 || !window.confirm(`‘${item.label}’ 프로그램 메뉴를 삭제할까요?`)) return;
      commonPageSettings().programShortcuts = programs.filter(program => program.id !== item.id);
      setDirty(`‘${item.label}’ 프로그램 메뉴 삭제`);
      renderProgramShortcuts();
    }));
    $$("#programShortcutList [data-program-id]").forEach(row => {
      row.addEventListener("dragstart", () => { programDragId = row.dataset.programId; row.classList.add("dragging"); });
      row.addEventListener("dragend", () => { programDragId = null; row.classList.remove("dragging"); $$("#programShortcutList .drag-over").forEach(item => item.classList.remove("drag-over")); });
      row.addEventListener("dragover", event => { event.preventDefault(); row.classList.add("drag-over"); });
      row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
      row.addEventListener("drop", event => {
        event.preventDefault();
        const targetId = row.dataset.programId;
        if (!programDragId || programDragId === targetId) return;
        const from = programs.findIndex(item => item.id === programDragId);
        const to = programs.findIndex(item => item.id === targetId);
        const [moved] = programs.splice(from, 1);
        programs.splice(to, 0, moved);
        setDirty("프로그램 원형 메뉴 순서 변경");
        renderProgramShortcuts();
      });
    });
  }

  function addProgramShortcut() {
    const programs = commonPageSettings().programShortcuts;
    const next = programs.length + 1;
    const item = { id: `program-shortcut-${Date.now()}`, label: `새 프로그램 ${next}`, badge: "NEW", color: "#4057bd", icon: "", url: "#", visible: true };
    programs.push(item);
    setDirty(`‘${item.label}’ 프로그램 메뉴 추가`);
    renderProgramShortcuts();
    setTimeout(() => $(`[data-program-label="${item.id}"]`)?.select(), 0);
  }

  function renderCategoryMenus() {}

  function renderPromotionLivePreview() {
    const promo = commonPageSettings().promotion;
    const preview = $("#promoLivePreview");
    const isImage = promo.bannerType === "image";
    const preset = promotionPresets.find(item => item.id === promo.design.colorPreset) || promotionPresets.find(item => item.id === "brown");
    preview.className = `promo-live-preview${isImage ? " image-mode" : ""}${!isImage && preset.light ? " is-light" : ""}`;
    preview.style.background = isImage && promo.image.imageUrl
      ? `center / cover no-repeat url("${promo.image.imageUrl.replace(/"/g, "%22")}")`
      : (isImage ? "linear-gradient(135deg,#dfe4ec,#f3f5f8)" : preset.gradient);
    const ctaLabel = isImage ? promo.image.ctaLabel : promo.design.ctaLabel;
    preview.innerHTML = isImage
      ? `${!promo.image.imageUrl ? '<span class="preview-image-empty">통이미지를 등록해주세요</span>' : ""}${ctaLabel ? `<span class="preview-promo-cta">${escapeHtml(ctaLabel)}</span>` : ""}`
      : `<div class="preview-promo-content"><span class="preview-promo-badge">${escapeHtml(promo.design.badge)}</span><h3>${escapeHtml(promo.design.title)}</h3><p>${escapeHtml(promo.design.subtitle)}</p></div>${ctaLabel ? `<span class="preview-promo-cta">${escapeHtml(ctaLabel)}</span>` : ""}`;
    if (!promo.common.visible) preview.insertAdjacentHTML("beforeend", '<span class="preview-off-state">현재 Front 비노출 상태입니다.</span>');
  }

  function renderPromotionSettings() {
    const promo = commonPageSettings().promotion;
    $("#promoTypeDesign").checked = promo.bannerType === "design";
    $("#promoTypeImage").checked = promo.bannerType === "image";
    $("#promoDesignSettings").hidden = promo.bannerType !== "design";
    $("#promoImageSettings").hidden = promo.bannerType !== "image";
    setCopyValue("promoBadgeInput", promo.design.badge);
    setCopyValue("promoTitleInput", promo.design.title);
    setCopyValue("promoSubtitleInput", promo.design.subtitle);
    setCopyValue("promoCtaInput", promo.design.ctaLabel);
    setCopyValue("promoImageCtaInput", promo.image.ctaLabel);
    setCopyValue("promoUrlInput", promo.common.linkUrl);
    $("#promoOpenNewWindowInput").checked = promo.common.openNewWindow;
    $("#promoOpenNewWindowLabel").textContent = promo.common.openNewWindow ? "ON" : "OFF";
    $("#promoCommonVisibleInput").checked = promo.common.visible;
    $("#promoCommonVisibleLabel").textContent = promo.common.visible ? "ON" : "OFF";
    $("#promoColorPresets").innerHTML = promotionPresets.map(preset => `<button class="promo-preset-card${preset.light ? " light" : ""}${preset.id === promo.design.colorPreset ? " selected" : ""}" data-promo-preset="${preset.id}" style="background:${preset.gradient}">${preset.label}</button>`).join("");
    $$('[data-promo-preset]').forEach(button => button.addEventListener("click", () => {
      promo.design.colorPreset = button.dataset.promoPreset;
      setDirty(`하단 배너 배경 ${promotionPresets.find(item => item.id === promo.design.colorPreset).label} 프리셋 선택`);
      renderPromotionSettings();
    }));
    const imagePreview = $("#promoImageAdminPreview");
    imagePreview.classList.toggle("empty", !promo.image.imageUrl);
    imagePreview.style.backgroundImage = promo.image.imageUrl ? `url("${promo.image.imageUrl.replace(/"/g, "%22")}")` : "none";
    renderPromotionLivePreview();
  }

  function switchAdminView(nextView) {
    if (nextView === currentAdminView && !historyViewOpen) return;
    if (dirty && !window.confirm("저장하지 않은 변경사항이 있습니다. 이 페이지를 나가시겠습니까?")) return;
    currentAdminView = nextView;
    historyViewOpen = false;
    renderAdminView();
    renderStatus();
    renderAudit();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderSectionExposureSettings() {
    const section = currentSection();
    currentSectionId = section.id;
    const sectionIndex = currentMonth().sections.findIndex(item => item.id === section.id) + 1;
    $("#selectedSectionNumber").textContent = String(sectionIndex).padStart(2, "0");
    $("#selectedAdminName").textContent = section.adminName;
    setCopyValue("sectionDisplayTitleInput", section.displayTitle);
    setCopyValue("sectionSubtitleInput", section.subtitle);
    setCopyValue("sectionBadgeInput", section.badge);
    setCopyValue("sectionCtaInput", section.ctaLabel);
    $("#sectionVisibleInput").checked = section.visible;
    $("#sectionVisibleLabel").textContent = section.visible ? "ON" : "OFF";
    const deleteButton = $("#deleteCurrentSectionBtn");
    const totalContentCount = sectionContentCountAcrossMonths(section.id);
    const canDelete = commonSections().length > 1 && totalContentCount === 0;
    deleteButton.disabled = !canDelete;
    deleteButton.title = commonSections().length <= 1
      ? "마지막 섹션은 삭제할 수 없습니다."
      : totalContentCount
        ? `전체 월에 편성된 콘텐츠 ${totalContentCount}건을 먼저 삭제해 주세요.`
        : "모든 월에서 콘텐츠가 없는 공통 섹션을 삭제합니다.";

    const hasFeaturedCard = section.layoutTheme === "event-showcase";
    $("#featuredCardSettings").hidden = !hasFeaturedCard;
    if (hasFeaturedCard) {
      setCopyValue("featuredTitleInput", section.featuredTitle);
      setCopyValue("featuredDescriptionInput", section.featuredDescription);
      setCopyValue("featuredCtaInput", section.featuredCta);
      $("#featuredImagePreview").src = section.featuredImage || section.items[0]?.thumbnail || "이미지/추석행사 All-in-one.png";
    }
  }

  function dragIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.5"/><circle cx="8" cy="12" r="1.5"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="6" r="1.5"/><circle cx="16" cy="12" r="1.5"/><circle cx="16" cy="18" r="1.5"/></svg>';
  }

  function editIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>';
  }

  function deleteIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/></svg>';
  }

  function curationRowMarkup(item, order, scope = "section") {
    const isTheme = scope === "theme";
    const attributePrefix = isTheme ? "theme-content-" : "";
    const rowAttribute = isTheme ? "data-theme-item-id" : "data-item-id";
    const isUrl = item.source === "url";
    const originClass = isUrl ? "url" : (item.source === "recommended" ? "recommended" : "");
    const originLabel = isUrl ? "URL" : (item.source === "recommended" ? "추천" : "수동");
    const itemIdentifier = isUrl ? `URL ${item.link || "-"}` : `ID ${item.id}`;
    const accessClass = item.access === "무료" ? "access-free" : (isUrl ? "access-link" : "access-paid");
    return `
      <tr draggable="true" ${rowAttribute}="${escapeHtml(item.id)}">
        <td class="col-order"><div class="order-cell"><button class="drag-handle" aria-label="순서 변경">${dragIcon()}</button><span class="order-number">${String(order).padStart(2, "0")}</span></div></td>
        <td><img class="thumb" src="${escapeHtml(item.thumbnail || "")}" alt="" /></td>
        <td><strong class="content-name" title="${escapeHtml(item.displayTitle || item.title)}">${escapeHtml(item.displayTitle || item.title)}</strong><div class="content-meta"><span title="${escapeHtml(itemIdentifier)}">${escapeHtml(itemIdentifier)}</span><span class="origin-badge ${originClass}">${originLabel}</span></div></td>
        <td><span class="type-badge">${escapeHtml(item.type || "-")}</span></td>
        <td><span class="${accessClass}">${escapeHtml(item.access || "-")}</span></td>
        <td><span class="point">${item.points ? `${Number(item.points).toLocaleString("ko-KR")}P` : "-"}</span></td>
        <td class="col-flag"><label class="toggle" title="추천 콘텐츠"><input type="checkbox" data-${attributePrefix}recommended-id="${escapeHtml(item.id)}" ${item.recommended ? "checked" : ""} /><span class="toggle-track"></span></label></td>
        <td class="col-flag"><label class="toggle" title="신규 콘텐츠"><input type="checkbox" data-${attributePrefix}new-id="${escapeHtml(item.id)}" ${item.isNew ? "checked" : ""} /><span class="toggle-track"></span></label></td>
        <td class="col-visible"><label class="toggle" title="Front 노출"><input type="checkbox" data-${attributePrefix}visible-id="${escapeHtml(item.id)}" ${item.visible !== false ? "checked" : ""} /><span class="toggle-track"></span></label></td>
        <td class="col-manage"><div class="row-actions"><button class="row-action" data-${attributePrefix}edit-id="${escapeHtml(item.id)}" title="수정">${editIcon()}</button><button class="row-action delete" data-${attributePrefix}delete-id="${escapeHtml(item.id)}" title="삭제">${deleteIcon()}</button></div></td>
      </tr>`;
  }

  function renderTable() {
    const section = currentSection();
    const query = $("#contentSearch").value.trim().toLowerCase();
    const filtered = section.items.filter(item => !query || item.displayTitle.toLowerCase().includes(query) || item.id.includes(query) || String(item.link || "").toLowerCase().includes(query));
    $("#contentCount").textContent = `${section.items.length}개`;

    if (!filtered.length) {
      $("#contentTableBody").innerHTML = `
        <tr><td colspan="10" class="empty-state">
          <div class="empty-icon">＋</div>
          <strong>${query ? "검색 결과가 없습니다." : "아직 편성된 콘텐츠가 없습니다."}</strong>
          <p>${query ? "다른 콘텐츠명, ID 또는 URL로 검색해 보세요." : "클립을 검색하거나 URL 링크를 등록해 콘텐츠를 추가해 보세요."}</p>
          ${query ? "" : '<button class="btn small primary" data-empty-add>콘텐츠 추가</button>'}
        </td></tr>`;
      const addButton = $("[data-empty-add]");
      if (addButton) addButton.addEventListener("click", () => openContentDrawer("section"));
      return;
    }

    $("#contentTableBody").innerHTML = filtered.map(item => {
      const order = section.items.findIndex(candidate => candidate.id === item.id) + 1;
      return curationRowMarkup(item, order, "section");
    }).join("");

    bindTableEvents();
  }

  async function deleteSectionById(sectionId) {
    const sections = commonSections();
    const sectionIndex = sections.findIndex(section => section.id === sectionId);
    const section = sections[sectionIndex];
    if (!section) return false;
    const totalContentCount = sectionContentCountAcrossMonths(section.id);
    if (totalContentCount) {
      toast(`전체 월에 편성된 콘텐츠 ${totalContentCount}건이 있어 삭제할 수 없습니다.`, "error");
      return false;
    }
    if (sections.length <= 1) {
      toast("섹션은 최소 1개가 필요합니다.", "error");
      return false;
    }
    const accepted = await confirmAction({
      title: "섹션을 삭제할까요?",
      body: `‘${section.adminName}’ 섹션과 연결된 상단 카테고리도 함께 삭제합니다.`,
      okText: "섹션 삭제",
      danger: true
    });
    if (!accepted) return false;

    state.commonSettings.sections = sections.filter(item => item.id !== section.id);
    commonPageSettings().categories = commonPageSettings().categories.filter(category => category.targetSectionId !== section.id);
    Object.values(state.months).forEach(month => {
      month.sections = month.sections.filter(item => item.id !== section.id);
    });
    if (currentSectionId === section.id) {
      currentSectionId = commonSections()[Math.min(sectionIndex, commonSections().length - 1)].id;
    }
    setDirty(`‘${section.adminName}’ 섹션 영역 삭제`);
    renderAll();
    toast("빈 섹션과 연결 카테고리를 삭제했습니다.", "success");
    return true;
  }

  function bindTableEvents() {
    $$('[data-recommended-id]').forEach(input => input.addEventListener("change", () => {
      const item = currentSection().items.find(candidate => candidate.id === input.dataset.recommendedId);
      if (!item) return;
      item.recommended = input.checked;
      setDirty(`‘${item.displayTitle}’ 추천 ${item.recommended ? "ON" : "OFF"}`);
    }));
    $$('[data-new-id]').forEach(input => input.addEventListener("change", () => {
      const item = currentSection().items.find(candidate => candidate.id === input.dataset.newId);
      if (!item) return;
      item.isNew = input.checked;
      setDirty(`‘${item.displayTitle}’ 신규 ${item.isNew ? "ON" : "OFF"}`);
    }));
    $$('[data-visible-id]').forEach(input => input.addEventListener("change", () => {
      const item = currentSection().items.find(candidate => candidate.id === input.dataset.visibleId);
      if (!item) return;
      item.visible = input.checked;
      setDirty(`‘${item.displayTitle}’ 노출 상태 변경`);
    }));

    $$('[data-edit-id]').forEach(button => button.addEventListener("click", () => editContent(button.dataset.editId)));
    $$('[data-delete-id]').forEach(button => button.addEventListener("click", () => deleteContent(button.dataset.deleteId)));

    $$("#contentTableBody tr[data-item-id]").forEach(row => {
      row.addEventListener("dragstart", event => {
        dragItemId = row.dataset.itemId;
        row.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
      });
      row.addEventListener("dragend", () => {
        dragItemId = null;
        row.classList.remove("dragging");
        $$(".drag-over").forEach(element => element.classList.remove("drag-over"));
      });
      row.addEventListener("dragover", event => { event.preventDefault(); row.classList.add("drag-over"); });
      row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
      row.addEventListener("drop", event => {
        event.preventDefault();
        row.classList.remove("drag-over");
        reorderContent(dragItemId, row.dataset.itemId);
      });
    });
  }

  function parseHistoryDate(value) {
    const date = new Date(String(value || "").replace(" ", "T"));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function allHistoryEntries() {
    const monthlyEntries = Object.entries(state.months).flatMap(([monthKey, month]) =>
      (month.history || []).map((item, index) => normalizeHistoryEntry(item, monthKey, index))
    );
    const commonEntries = (commonSettings().history || []).map((item, index) => normalizeHistoryEntry(item, "common", index));
    return [...commonEntries, ...monthlyEntries].sort((a, b) => (parseHistoryDate(b.at)?.getTime() || 0) - (parseHistoryDate(a.at)?.getTime() || 0));
  }

  function populateHistoryAdminFilter() {
    const select = $("#historyAdminFilter");
    const previous = select.value || "all";
    const admins = [...new Set(allHistoryEntries().map(item => item.by).filter(Boolean))];
    select.innerHTML = '<option value="all">전체</option>' + admins.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
    select.value = admins.includes(previous) ? previous : "all";
  }

  function historyPeriodStart(period, reference) {
    const start = new Date(reference);
    if (period === "1m") start.setMonth(start.getMonth() - 1);
    else if (period === "3m") start.setMonth(start.getMonth() - 3);
    else if (period === "6m") start.setMonth(start.getMonth() - 6);
    else start.setFullYear(start.getFullYear() - 1);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  function applyHistoryFilters(resetPage = true) {
    const period = $("#historyPeriodFilter").value;
    const area = $("#historyAreaFilter").value;
    const type = $("#historyTypeFilter").value;
    const admin = $("#historyAdminFilter").value;
    const now = new Date();
    const oneYearAgo = historyPeriodStart("1y", now);
    let start = historyPeriodStart(period === "custom" ? "1y" : period, now);
    let end = now;

    if (period === "custom") {
      const customStart = $("#historyStartDate").value ? new Date(`${$("#historyStartDate").value}T00:00:00`) : null;
      const customEnd = $("#historyEndDate").value ? new Date(`${$("#historyEndDate").value}T23:59:59`) : null;
      if (customStart && customStart > oneYearAgo) start = customStart;
      if (customEnd && customEnd < now) end = customEnd;
      if (customStart && customStart < oneYearAgo) toast("변경 이력은 최근 1년 범위에서 조회할 수 있습니다.");
      if (start > end) { toast("시작일은 종료일보다 빠르게 설정해주세요.", "error"); return; }
    }

    historyResults = allHistoryEntries().filter(item => {
      const at = parseHistoryDate(item.at);
      if (!at || at < oneYearAgo || at < start || at > end) return false;
      if (area !== "all" && item.areaKey !== area) return false;
      if (type !== "all" && (type === "수정" ? !item.type.includes("수정") : item.type !== type)) return false;
      if (admin !== "all" && item.by !== admin) return false;
      return true;
    });
    if (resetPage) historyPage = 1;
    renderHistoryTable();
  }

  function renderHistoryTable() {
    const totalPages = Math.max(1, Math.ceil(historyResults.length / HISTORY_PAGE_SIZE));
    historyPage = Math.min(historyPage, totalPages);
    const startIndex = (historyPage - 1) * HISTORY_PAGE_SIZE;
    const pageItems = historyResults.slice(startIndex, startIndex + HISTORY_PAGE_SIZE);
    $("#historyResultCount").textContent = `총 ${historyResults.length}건`;
    $("#historyTableBody").innerHTML = pageItems.length ? pageItems.map(item => `
      <tr>
        <td>${escapeHtml(item.at)}</td>
        <td>${escapeHtml(item.by)}</td>
        <td>${escapeHtml(item.area)}</td>
        <td><span class="history-type-pill">${escapeHtml(item.type)}</span></td>
        <td>${escapeHtml(item.action)}</td>
        <td>${escapeHtml(item.monthLabel)}</td>
        <td><button class="history-detail-btn" data-history-detail="${escapeHtml(item.id)}">상세</button></td>
      </tr>
    `).join("") : '<tr class="history-empty-row"><td colspan="7">조건에 맞는 변경 이력이 없습니다.</td></tr>';
    $$('[data-history-detail]').forEach(button => button.addEventListener("click", () => openHistoryDetail(button.dataset.historyDetail)));
    renderHistoryPagination(totalPages);
  }

  function renderHistoryPagination(totalPages) {
    const pageButtons = Array.from({ length: totalPages }, (_, index) => index + 1).map(page =>
      `<button class="history-page-btn${page === historyPage ? " active" : ""}" data-history-page="${page}" aria-label="${page}페이지">${page}</button>`
    ).join("");
    $("#historyPagination").innerHTML = `
      <button class="history-page-btn" data-history-page="${historyPage - 1}" ${historyPage === 1 ? "disabled" : ""}>이전</button>
      ${pageButtons}
      <button class="history-page-btn" data-history-page="${historyPage + 1}" ${historyPage === totalPages ? "disabled" : ""}>다음</button>
    `;
    $$('[data-history-page]').forEach(button => button.addEventListener("click", () => {
      if (button.disabled) return;
      historyPage = Number(button.dataset.historyPage);
      renderHistoryTable();
    }));
  }

  function renderHistory() {
    if (!historyViewOpen) return;
    populateHistoryAdminFilter();
    applyHistoryFilters(false);
  }

  function openHistoryView() {
    if (dirty && !window.confirm("저장하지 않은 변경사항이 있습니다. 이 페이지를 나가시겠습니까?")) return;
    historyViewOpen = true;
    historyPage = 1;
    if (!$("#historyStartDate").value || !$("#historyEndDate").value) {
      const end = new Date();
      const start = historyPeriodStart("3m", end);
      const dateValue = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      $("#historyStartDate").value = dateValue(start);
      $("#historyEndDate").value = dateValue(end);
    }
    renderAdminView();
    populateHistoryAdminFilter();
    applyHistoryFilters();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openHistoryDetail(id) {
    const item = allHistoryEntries().find(entry => entry.id === id);
    if (!item) return;
    $("#historyDetailItem").textContent = item.item;
    $("#historyDetailArea").textContent = item.area;
    $("#historyDetailType").textContent = item.type;
    $("#historyDetailMonth").textContent = item.monthLabel;
    $("#historyDetailBefore").textContent = item.before;
    $("#historyDetailAfter").textContent = item.after;
    $("#historyDetailBy").textContent = item.by;
    $("#historyDetailAt").textContent = item.at;
    $("#historyDetailBackdrop").classList.add("open");
    $("#historyDetailBackdrop").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeHistoryDetail() {
    $("#historyDetailBackdrop").classList.remove("open");
    $("#historyDetailBackdrop").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function renderAudit() {
    const target = currentAdminView === "main" ? commonSettings() : currentMonth();
    $("#lastModifiedAt").textContent = target.modifiedAt || "-";
    $("#lastModifiedBy").textContent = target.modifiedBy || "-";
  }

  function themeMonthOptions() {
    return Object.keys(state.months).sort().map(key => `<option value="${key}" ${key === currentMonthKey ? "selected" : ""}>${formatMonth(key)}</option>`).join("");
  }

  function renderThemeManager() {
    const card = $("#themeManagementCard");
    const directCard = $("#directCurationCard");
    const themeMode = isThemeGroupSection();
    directCard.hidden = themeMode;
    card.hidden = !themeMode;
    if (!themeMode) return;

    const groups = currentSection().themeGroups || (currentSection().themeGroups = []);
    $("#themeMonthSelect").innerHTML = themeMonthOptions();
    const active = currentTheme();
    const editorOpen = Boolean(activeThemeId && active);
    $("#themeListView").hidden = editorOpen;
    $("#themeEditorView").hidden = !editorOpen;

    if (editorOpen) {
      renderThemeEditor(active);
      return;
    }

    $("#themeList").innerHTML = groups.length ? groups.map((theme, index) => `
      <div class="theme-list-row" data-theme-id="${escapeHtml(theme.id)}">
        <span class="theme-list-order"><span>${String(index + 1).padStart(2, "0")}</span><span class="theme-order-actions"><button type="button" data-theme-up="${escapeHtml(theme.id)}" ${index === 0 ? "disabled" : ""} aria-label="위로 이동">▲</button><button type="button" data-theme-down="${escapeHtml(theme.id)}" ${index === groups.length - 1 ? "disabled" : ""} aria-label="아래로 이동">▼</button></span></span>
        <span>${theme.image ? `<img class="theme-list-thumb" src="${escapeHtml(theme.image)}" alt="" />` : '<span class="theme-list-thumb"></span>'}</span>
        <strong title="${escapeHtml(theme.name)}">${escapeHtml(theme.name)}</strong>
        <span class="theme-content-count">${theme.items.length}개</span>
        <label class="toggle"><input type="checkbox" data-theme-visible="${escapeHtml(theme.id)}" ${theme.visible ? "checked" : ""} /><span class="toggle-track"></span></label>
        <span>${escapeHtml(theme.updatedAt || "-")}</span>
        <span class="theme-row-actions"><button type="button" class="btn small" data-theme-edit="${escapeHtml(theme.id)}">수정</button><button type="button" class="btn small danger" data-theme-delete="${escapeHtml(theme.id)}">삭제</button></span>
      </div>`).join("") : '<div class="theme-empty"><strong>등록된 놀이 테마가 없습니다.</strong><span>테마를 등록하고 콘텐츠를 그룹으로 편성해 주세요.</span></div>';

    $$('[data-theme-edit]').forEach(button => button.addEventListener("click", () => openThemeEditor(button.dataset.themeEdit)));
    $$('[data-theme-visible]').forEach(input => input.addEventListener("change", () => {
      const theme = groups.find(item => item.id === input.dataset.themeVisible);
      if (!theme) return;
      theme.visible = input.checked;
      touchTheme(theme);
      setDirty(`‘${theme.name}’ 테마 노출 ${theme.visible ? "ON" : "OFF"}`);
      renderThemeManager();
    }));
    $$('[data-theme-up],[data-theme-down]').forEach(button => button.addEventListener("click", () => {
      const id = button.dataset.themeUp || button.dataset.themeDown;
      const from = groups.findIndex(item => item.id === id);
      const to = from + (button.dataset.themeUp ? -1 : 1);
      if (from < 0 || to < 0 || to >= groups.length) return;
      const [moved] = groups.splice(from, 1);
      groups.splice(to, 0, moved);
      touchTheme(moved);
      setDirty(`‘${moved.name}’ 테마 순서 변경`);
      renderThemeManager();
    }));
    $$('[data-theme-delete]').forEach(button => button.addEventListener("click", async () => {
      const theme = groups.find(item => item.id === button.dataset.themeDelete);
      if (!theme) return;
      const accepted = await confirmAction({ title: "테마를 삭제할까요?", body: `‘${theme.name}’ 테마와 소속 콘텐츠 편성 ${theme.items.length}건을 삭제합니다. 원본 클립자료는 삭제되지 않습니다.`, okText: "테마 삭제", danger: true });
      if (!accepted) return;
      currentSection().themeGroups = groups.filter(item => item.id !== theme.id);
      setDirty(`‘${theme.name}’ 테마 삭제`);
      renderThemeManager();
      renderSections();
    }));
  }

  function openThemeEditor(themeId) {
    activeThemeId = themeId;
    renderThemeManager();
  }

  function renderThemeEditor(theme) {
    $("#themeEditorTitle").textContent = theme.name === "새 놀이 테마" ? "테마 등록" : "테마 수정";
    $("#themeNameInput").value = theme.name;
    $("#themeSubtitleInput").value = theme.subtitle || "";
    $("#themeCtaInput").value = theme.ctaLabel || "";
    $("#themeUrlInput").value = theme.ctaUrl || "";
    $("#themeOpenNewWindowInput").checked = Boolean(theme.openNewWindow);
    $("#themeOpenNewWindowLabel").textContent = theme.openNewWindow ? "ON" : "OFF";
    $("#themeVisibleInput").checked = theme.visible !== false;
    $("#themeVisibleLabel").textContent = theme.visible !== false ? "ON" : "OFF";
    $("#themeImagePreview").innerHTML = theme.image ? `<img src="${escapeHtml(theme.image)}" alt="${escapeHtml(theme.name)} 대표 이미지" />` : "<span>대표 이미지를 등록해주세요.</span>";
    renderThemeContent(theme);
  }

  function renderThemeContent(theme) {
    $("#themeContentCount").textContent = `${theme.items.length}개`;
    $("#themeContentTableBody").innerHTML = theme.items.length
      ? theme.items.map((item, index) => curationRowMarkup(item, index + 1, "theme")).join("")
      : '<tr><td colspan="10" class="theme-content-empty">아직 등록된 콘텐츠가 없습니다. 콘텐츠 추가에서 클립 또는 URL 링크를 편성해 주세요.</td></tr>';

    $$('[data-theme-content-recommended-id]').forEach(input => input.addEventListener("change", () => {
      const item = theme.items.find(candidate => candidate.id === input.dataset.themeContentRecommendedId);
      if (!item) return;
      item.recommended = input.checked;
      touchTheme(theme);
      setDirty(`‘${theme.name}’ 테마의 ‘${item.displayTitle}’ 추천 ${item.recommended ? "ON" : "OFF"}`);
    }));
    $$('[data-theme-content-new-id]').forEach(input => input.addEventListener("change", () => {
      const item = theme.items.find(candidate => candidate.id === input.dataset.themeContentNewId);
      if (!item) return;
      item.isNew = input.checked;
      touchTheme(theme);
      setDirty(`‘${theme.name}’ 테마의 ‘${item.displayTitle}’ 신규 ${item.isNew ? "ON" : "OFF"}`);
    }));
    $$('[data-theme-content-visible-id]').forEach(input => input.addEventListener("change", () => {
      const item = theme.items.find(candidate => candidate.id === input.dataset.themeContentVisibleId);
      if (!item) return;
      item.visible = input.checked;
      touchTheme(theme);
      setDirty(`‘${theme.name}’ 테마의 ‘${item.displayTitle}’ 노출 ${item.visible ? "ON" : "OFF"}`);
    }));
    $$('[data-theme-content-edit-id]').forEach(button => button.addEventListener("click", () => editContent(button.dataset.themeContentEditId, "theme")));
    $$('[data-theme-content-delete-id]').forEach(button => button.addEventListener("click", async () => {
      const item = theme.items.find(candidate => candidate.id === button.dataset.themeContentDeleteId);
      if (!item) return;
      const accepted = await confirmAction({ title: "테마에서 삭제할까요?", body: `‘${item.displayTitle}’ 콘텐츠를 이 테마 편성에서 삭제합니다.`, okText: "삭제", danger: true });
      if (!accepted) return;
      theme.items = theme.items.filter(candidate => candidate.id !== item.id);
      touchTheme(theme);
      setDirty(`‘${theme.name}’ 테마에서 ‘${item.displayTitle}’ 삭제`);
      renderThemeContent(theme);
    }));

    $$("#themeContentTableBody tr[data-theme-item-id]").forEach(row => {
      row.addEventListener("dragstart", event => {
        dragItemId = row.dataset.themeItemId;
        row.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
      });
      row.addEventListener("dragend", () => {
        dragItemId = null;
        row.classList.remove("dragging");
        $$("#themeContentTableBody .drag-over").forEach(element => element.classList.remove("drag-over"));
      });
      row.addEventListener("dragover", event => { event.preventDefault(); row.classList.add("drag-over"); });
      row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
      row.addEventListener("drop", event => {
        event.preventDefault();
        row.classList.remove("drag-over");
        const fromIndex = theme.items.findIndex(item => item.id === dragItemId);
        const toIndex = theme.items.findIndex(item => item.id === row.dataset.themeItemId);
        if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
        const [moved] = theme.items.splice(fromIndex, 1);
        theme.items.splice(toIndex, 0, moved);
        touchTheme(theme);
        setDirty(`‘${theme.name}’ 테마 콘텐츠 순서 변경`);
        renderThemeContent(theme);
      });
    });
  }

  function addTheme() {
    const theme = createThemeGroup({ name: "새 놀이 테마", visible: true, items: [] });
    currentSection().themeGroups.push(theme);
    activeThemeId = theme.id;
    setDirty("새 놀이 테마 등록 시작");
    renderThemeManager();
    setTimeout(() => $("#themeNameInput").select(), 0);
  }

  function closeThemeEditor() {
    activeThemeId = null;
    contentDestination = "section";
    renderThemeManager();
    renderSections();
  }

  function renderAll() {
    renderMonthOptions();
    renderStatus();
    renderAdminView();
    renderSections();
    renderPageSettings();
    renderHeroBannerManager();
    renderSectionLayouts();
    renderCategoryMenus();
    renderProgramShortcuts();
    renderPromotionSettings();
    renderSectionExposureSettings();
    renderTable();
    renderThemeManager();
    renderHistory();
    renderAudit();
  }

  function switchSection(nextId) {
    if (nextId === currentSectionId) return;
    if (dirty && !window.confirm("저장하지 않은 변경사항이 있습니다. 그래도 다른 섹션으로 이동할까요?")) return;
    currentSectionId = nextId;
    activeThemeId = null;
    contentDestination = "section";
    $("#contentSearch").value = "";
    renderSections();
    renderSectionExposureSettings();
    renderTable();
    renderThemeManager();
  }

  function switchMonth(nextKey, keepSection = false) {
    if (nextKey === currentMonthKey) return;
    if (dirty && !window.confirm("저장하지 않은 변경사항이 있습니다. 그래도 다른 월로 이동할까요?")) {
      $("#monthSelect").value = currentMonthKey;
      if ($("#themeMonthSelect")) $("#themeMonthSelect").value = currentMonthKey;
      return;
    }
    currentMonthKey = nextKey;
    currentSectionId = keepSection && currentMonth().sections.some(section => section.id === currentSectionId)
      ? currentSectionId
      : currentMonth().sections[0].id;
    activeThemeId = null;
    contentDestination = "section";
    clearDirty();
    $("#contentSearch").value = "";
    renderAll();
  }

  function reorderContent(fromId, toId) {
    if (!fromId || fromId === toId) return;
    const items = currentSection().items;
    const fromIndex = items.findIndex(item => item.id === fromId);
    const toIndex = items.findIndex(item => item.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    setDirty(`‘${currentSection().displayTitle}’ 순서 변경`);
    renderTable();
    renderSections();
  }

  function openDrawer(backdropId) {
    const backdrop = $(backdropId);
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer(backdropId) {
    const backdrop = $(backdropId);
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function fillClipFilterSelect(id, options) {
    const select = $(`#${id}`);
    select.innerHTML = '<option value="all">전체</option>' + (options || []).map(option =>
      `<option value="${escapeHtml(String(option.code))}">${escapeHtml(option.label)}</option>`
    ).join("");
  }

  async function ensureClipFilterCatalog() {
    if (clipFilterCatalog) return clipFilterCatalog;
    const catalog = await window.MembershipClipService.getFilterCatalog();
    clipFilterCatalog = catalog || { materialTypes: [], topics: [], memberPolicies: [], source: "unavailable" };
    fillClipFilterSelect("clipTypeFilter", clipFilterCatalog.materialTypes);
    fillClipFilterSelect("clipTopicFilter", clipFilterCatalog.topics);
    fillClipFilterSelect("clipMemberPolicyFilter", clipFilterCatalog.memberPolicies);
    fillClipFilterSelect("clipMonthFilter", Array.from({ length: 12 }, (_, index) => ({ code: index + 1, label: `${index + 1}월` })));
    $("#clipFilterSourceNote").textContent = clipFilterCatalog.source === "mock"
      ? "프로토타입 분류 데이터입니다. 운영 연동 시 기존 클립자료 관리의 코드값을 그대로 사용합니다."
      : clipFilterCatalog.source === "interface-fallback"
        ? "기존 분류 API가 아직 연결되지 않아 인터페이스 기준 목록을 표시합니다."
        : "기존 클립자료 관리 분류값과 연결되었습니다.";
    return clipFilterCatalog;
  }

  function setContentSourceMode(mode) {
    contentSourceMode = mode === "url" ? "url" : "clip";
    $$('[data-content-source]').forEach(button => {
      const active = button.dataset.contentSource === contentSourceMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    const isUrl = contentSourceMode === "url";
    $("#clipSearchPanel").hidden = isUrl;
    $("#urlContentPanel").hidden = !isUrl;
    $("#clipForm").classList.remove("show");
    $("#lookupError").classList.remove("show");
    $("#submitContentBtn").textContent = editingItemId ? (isUrl ? "URL 링크 수정" : "수정 완료") : (isUrl ? "URL 링크 추가" : "편성에 추가");
    if (isUrl) updateUrlContentPreview();
    else $("#submitContentBtn").disabled = !activeClip;
  }

  function updateUrlContentPreview() {
    const title = $("#urlTitleInput").value.trim();
    const address = $("#urlLinkInput").value.trim();
    $("#urlPreviewTitle").textContent = title || "페이지명을 입력해주세요.";
    $("#urlPreviewAddress").textContent = address || "이동 URL이 표시됩니다.";
    $("#urlPreviewThumb").style.backgroundImage = urlThumbnailData ? `url("${urlThumbnailData.replace(/"/g, "%22")}")` : "";
    $("#urlPreviewThumb").querySelector("span").hidden = Boolean(urlThumbnailData);
    $("#submitContentBtn").disabled = !(title && address);
  }

  function renderUrlThumbnailChoice() {
    const hasThumbnail = Boolean(urlThumbnailData);
    $("#urlThumbnailEmpty").hidden = hasThumbnail;
    $("#urlThumbnailRegistered").hidden = !hasThumbnail;
    $("#clearUrlThumbnailBtn").classList.toggle("active", !hasThumbnail);
    $("#urlThumbnailPreviewImage").src = hasThumbnail ? urlThumbnailData : "";
    updateUrlContentPreview();
  }

  function normalizeLinkUrl(value, label) {
    const url = String(value || "").trim();
    if (!url) return "";
    if (/^(https?:\/\/|\/|\.\/|\.\.\/|#)/i.test(url)) return url;
    throw new Error(`${label}은 http(s):// 또는 /, ./로 시작하는 주소를 입력해 주세요.`);
  }

  function defaultLinkThumbnail(title) {
    const safeTitle = String(title || "URL LINK").slice(0, 18).replace(/[<>&"']/g, "");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#263b69"/><stop offset="1" stop-color="#7894d7"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><text x="320" y="155" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="64">↗</text><text x="320" y="235" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="28" font-weight="700">${safeTitle}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function resetContentForm() {
    activeClip = null;
    clipSearchResults = [];
    selectedClipIds.clear();
    editingItemId = null;
    $("#contentDrawerTitle").textContent = "콘텐츠 추가";
    $("#contentSourceTabs").hidden = false;
    $("#submitContentBtn").textContent = "편성에 추가";
    $("#urlTitleInput").value = "";
    $("#urlLinkInput").value = "";
    urlThumbnailData = "";
    $("#urlThumbnailFileInput").value = "";
    $("#urlVisibleSelect").value = "true";
    $("#urlOpenNewWindowInput").checked = true;
    $("#clipIdInput").value = "";
    $("#clipNameInput").value = "";
    ["clipTypeFilter", "clipTopicFilter", "clipMonthFilter", "clipMemberPolicyFilter"].forEach(id => { $(`#${id}`).value = "all"; });
    $("#searchClipsBtn").disabled = false;
    $("#searchClipsBtn").textContent = "검색";
    $("#clipSearchSummary").textContent = "";
    $("#clipSearchResults").innerHTML = "";
    $("#clipSearchResults").classList.remove("show");
    $("#clipActiveFilters").hidden = true;
    $("#clipActiveFilterList").innerHTML = "";
    $("#clipBatchActions").hidden = true;
    $("#selectedClipCount").textContent = "0";
    $("#lookupError").classList.remove("show");
    $("#clipForm").classList.remove("show");
    $("#submitContentBtn").disabled = true;
    renderUrlThumbnailChoice();
    setContentSourceMode("clip");
  }

  async function openContentDrawer(destination = "section") {
    contentDestination = destination === "theme" ? "theme" : "section";
    if (contentDestination === "theme" && !currentTheme()) return;
    resetContentForm();
    $("#contentDrawerTitle").textContent = contentDestination === "theme" ? `테마 콘텐츠 추가 · ${currentTheme().name}` : "콘텐츠 추가";
    openDrawer("#contentDrawerBackdrop");
    try {
      await ensureClipFilterCatalog();
    } catch (error) {
      showLookupError("클립자료 분류값을 불러오지 못했습니다. 기존 관리자 연동 상태를 확인해 주세요.");
    }
    setTimeout(() => $("#clipIdInput").focus(), 100);
  }

  function populateClipForm(clip, editingItem) {
    activeClip = {
      ...clone(clip),
      baseThumbnail: editingItem ? editingItem.baseThumbnail : clip.thumbnail,
      membershipThumbnail: editingItem ? editingItem.thumbnail : clip.thumbnail
    };
    $("#originalThumb").src = activeClip.baseThumbnail;
    $("#originalTitle").textContent = clip.title;
    $("#originalId").textContent = clip.id;
    $("#originalType").textContent = clip.materialTypeLabel || clip.type || "-";
    $("#originalAccess").textContent = clip.access;
    $("#originalPoints").textContent = clip.points ? `${Number(clip.points).toLocaleString("ko-KR")}P` : "무료";
    $("#originalMonth").textContent = clip.month ? `${clip.month}월` : "-";
    $("#originalTopic").textContent = clip.topicLabel || clip.topic || "-";
    $("#originalMemberPolicy").textContent = clip.memberPolicyLabel || clip.memberPolicy || "-";
    $("#displayTitleInput").value = editingItem ? editingItem.displayTitle : clip.title;
    $("#displayVisibleSelect").value = String(editingItem ? editingItem.visible : true);
    $("#baseThumbPreview").src = activeClip.baseThumbnail;
    $("#membershipThumbPreview").src = activeClip.membershipThumbnail;
    $("#lookupError").classList.remove("show");
    $("#clipForm").classList.add("show");
    $("#submitContentBtn").disabled = false;
    $$('[data-clip-row]').forEach(row => row.classList.toggle("selected", row.dataset.clipRow === clip.id));
  }

  function clipCostLabel(clip) {
    if (clip.points) return `${clip.access || "포인트"} · ${Number(clip.points).toLocaleString("ko-KR")}P`;
    return clip.access || "무료";
  }

  function renderClipBatchActions() {
    const selectableIds = new Set(clipSearchResults
      .filter(clip => !destinationItems().some(item => item.id === clip.id))
      .map(clip => clip.id));
    selectedClipIds = new Set([...selectedClipIds].filter(id => selectableIds.has(id)));
    $("#selectedClipCount").textContent = String(selectedClipIds.size);
    $("#clipBatchActions").hidden = selectedClipIds.size === 0;
  }

  function renderClipSearchResults(clips) {
    clipSearchResults = clips;
    selectedClipIds.clear();
    $("#clipSearchSummary").textContent = `검색 결과 ${clips.length}개`;
    if (!clips.length) {
      $("#clipSearchResults").innerHTML = "";
      $("#clipSearchResults").classList.remove("show");
      showLookupError("검색 조건에 맞는 클립이 없습니다. 클립명, 월 또는 주제를 변경해 보세요.");
      return;
    }
    $("#clipSearchResults").innerHTML = clips.map(clip => {
      const alreadyAdded = destinationItems().some(item => item.id === clip.id);
      const materialType = clip.materialTypeLabel || clip.type || "-";
      const topic = clip.topicLabel || clip.topic || "-";
      const memberPolicy = clip.memberPolicyLabel || clip.memberPolicy || "-";
      return `
        <div class="clip-search-result ${alreadyAdded ? "is-added" : ""}" data-clip-row="${escapeHtml(clip.id)}">
          <input class="clip-search-select" type="checkbox" data-select-clip="${escapeHtml(clip.id)}" aria-label="${escapeHtml(clip.title)} 선택" ${alreadyAdded ? "disabled" : ""} />
          <img src="${escapeHtml(clip.thumbnail)}" alt="" />
          <span class="clip-search-result-copy">
            <span>클립 ID ${escapeHtml(clip.id)}</span>
            <strong>${escapeHtml(clip.title)}</strong>
            <span class="clip-search-meta">
              <em>${escapeHtml(materialType)}</em><em>${escapeHtml(topic)}</em><em>${escapeHtml(String(clip.month || "-"))}월</em><em>${escapeHtml(memberPolicy)}</em>
            </span>
          </span>
          <span class="clip-search-result-actions">
            <span>${escapeHtml(clipCostLabel(clip))}</span>
            <button type="button" class="btn small ${alreadyAdded ? "" : "primary"}" data-add-clip="${escapeHtml(clip.id)}" ${alreadyAdded ? "disabled" : ""}>${alreadyAdded ? "편성됨" : "추가"}</button>
          </span>
        </div>`;
    }).join("");
    $("#clipSearchResults").classList.add("show");
    $("#lookupError").classList.remove("show");
    $$('[data-select-clip]').forEach(input => input.addEventListener("change", () => {
      if (input.checked) selectedClipIds.add(input.dataset.selectClip);
      else selectedClipIds.delete(input.dataset.selectClip);
      input.closest("[data-clip-row]").classList.toggle("selected", input.checked);
      renderClipBatchActions();
    }));
    $$('[data-add-clip]').forEach(button => button.addEventListener("click", () => {
      const clip = clipSearchResults.find(item => item.id === button.dataset.addClip);
      if (clip) populateClipForm(clip, null);
    }));
    renderClipBatchActions();
  }

  function currentClipSearchCriteria() {
    return {
      id: $("#clipIdInput").value.trim(),
      name: $("#clipNameInput").value.trim(),
      materialTypeCode: $("#clipTypeFilter").value,
      topicCode: $("#clipTopicFilter").value,
      month: $("#clipMonthFilter").value,
      memberPolicyCode: $("#clipMemberPolicyFilter").value
    };
  }

  function selectedOptionLabel(id) {
    return $(`#${id}`).selectedOptions[0]?.textContent || "";
  }

  function renderActiveClipFilters(criteria) {
    const filters = [
      { key: "id", label: "클립 ID", value: criteria.id },
      { key: "name", label: "클립명", value: criteria.name },
      { key: "materialTypeCode", label: "자료유형", value: criteria.materialTypeCode === "all" ? "" : selectedOptionLabel("clipTypeFilter") },
      { key: "topicCode", label: "주제", value: criteria.topicCode === "all" ? "" : selectedOptionLabel("clipTopicFilter") },
      { key: "month", label: "월", value: criteria.month === "all" ? "" : selectedOptionLabel("clipMonthFilter") },
      { key: "memberPolicyCode", label: "회원유형", value: criteria.memberPolicyCode === "all" ? "" : selectedOptionLabel("clipMemberPolicyFilter") }
    ].filter(filter => filter.value);
    $("#clipActiveFilters").hidden = filters.length === 0;
    $("#clipActiveFilterList").innerHTML = filters.map(filter =>
      `<button type="button" class="clip-filter-chip" data-clear-clip-filter="${filter.key}"><b>${escapeHtml(filter.label)}</b>${escapeHtml(filter.value)} ×</button>`
    ).join("");
    $$('[data-clear-clip-filter]').forEach(button => button.addEventListener("click", () => {
      const controls = {
        id: "clipIdInput", name: "clipNameInput", materialTypeCode: "clipTypeFilter",
        topicCode: "clipTopicFilter", month: "clipMonthFilter", memberPolicyCode: "clipMemberPolicyFilter"
      };
      const control = $(`#${controls[button.dataset.clearClipFilter]}`);
      control.value = control.tagName === "SELECT" ? "all" : "";
      searchClips();
    }));
  }

  async function searchClips() {
    const criteria = currentClipSearchCriteria();
    activeClip = null;
    $("#searchClipsBtn").disabled = true;
    $("#searchClipsBtn").textContent = "검색 중";
    $("#clipForm").classList.remove("show");
    $("#submitContentBtn").disabled = true;
    $("#lookupError").classList.remove("show");
    renderActiveClipFilters(criteria);
    try {
      const clips = await window.MembershipClipService.search(criteria);
      renderClipSearchResults(clips || []);
      if (criteria.id && clips?.length === 1) populateClipForm(clips[0], null);
    } catch (error) {
      showLookupError(error.message || "클립 통합검색 중 오류가 발생했습니다.");
    } finally {
      $("#searchClipsBtn").disabled = false;
      $("#searchClipsBtn").textContent = "검색";
    }
  }

  function resetClipFilters() {
    $("#clipIdInput").value = "";
    $("#clipNameInput").value = "";
    ["clipTypeFilter", "clipTopicFilter", "clipMonthFilter", "clipMemberPolicyFilter"].forEach(id => { $(`#${id}`).value = "all"; });
    searchClips();
  }

  function clipToCurationItem(clip) {
    return {
      id: clip.id,
      title: clip.title,
      displayTitle: clip.title,
      materialTypeCode: clip.materialTypeCode,
      materialTypeLabel: clip.materialTypeLabel || clip.type,
      topicCode: clip.topicCode,
      topicLabel: clip.topicLabel || clip.topic,
      memberPolicyCode: clip.memberPolicyCode,
      memberPolicyLabel: clip.memberPolicyLabel || clip.memberPolicy,
      type: clip.materialTypeLabel || clip.type,
      topic: clip.topicLabel || clip.topic,
      memberPolicy: clip.memberPolicyLabel || clip.memberPolicy,
      month: clip.month,
      access: clip.access,
      points: clip.points,
      link: clip.link,
      thumbnail: clip.thumbnail,
      baseThumbnail: clip.thumbnail,
      visible: true,
      recommended: false,
      isNew: false,
      source: "manual"
    };
  }

  function addSelectedClips() {
    const targetItems = destinationItems();
    const existingIds = new Set(targetItems.map(item => item.id));
    const clips = clipSearchResults.filter(clip => selectedClipIds.has(clip.id) && !existingIds.has(clip.id));
    if (!clips.length) { toast("추가할 콘텐츠를 선택해 주세요.", "error"); return; }
    targetItems.push(...clips.map(clipToCurationItem));
    if (contentDestination === "theme") touchTheme();
    setDirty(`${contentDestination === "theme" ? `‘${currentTheme().name}’ 테마에 ` : ""}콘텐츠 ${clips.length}건 일괄 등록`);
    closeDrawer("#contentDrawerBackdrop");
    if (contentDestination === "theme") renderThemeContent(currentTheme());
    else renderTable();
    renderSections();
    toast(`${clips.length}개 콘텐츠를 편성에 추가했습니다.`, "success");
  }

  function showLookupError(message) {
    $("#lookupError").textContent = message;
    $("#lookupError").classList.add("show");
    $("#submitContentBtn").disabled = true;
  }

  function editContent(id, destination = "section") {
    contentDestination = destination === "theme" ? "theme" : "section";
    const item = destinationItems().find(candidate => candidate.id === id);
    if (!item) return;
    resetContentForm();
    editingItemId = id;
    $("#contentDrawerTitle").textContent = "콘텐츠 수정";
    $("#contentSourceTabs").hidden = true;
    if (item.source === "url") {
      $("#urlTitleInput").value = item.displayTitle || item.title || "";
      $("#urlLinkInput").value = item.link || "";
      urlThumbnailData = item.urlThumbnailData || item.urlThumbnail || "";
      $("#urlVisibleSelect").value = String(item.visible !== false);
      $("#urlOpenNewWindowInput").checked = item.openNewWindow !== false;
      renderUrlThumbnailChoice();
      setContentSourceMode("url");
    } else {
      setContentSourceMode("clip");
      $("#clipSearchPanel").hidden = true;
      populateClipForm({ ...clone(item), thumbnail: item.baseThumbnail }, item);
      $("#submitContentBtn").textContent = "수정 완료";
    }
    openDrawer("#contentDrawerBackdrop");
  }

  async function deleteContent(id) {
    const item = currentSection().items.find(candidate => candidate.id === id);
    if (!item) return;
    const accepted = await confirmAction({ title: "편성에서 삭제할까요?", body: `‘${item.displayTitle}’ 콘텐츠를 현재 섹션에서 삭제합니다. 원본 클립자료는 삭제되지 않습니다.`, okText: "삭제", danger: true });
    if (!accepted) return;
    currentSection().items = currentSection().items.filter(candidate => candidate.id !== id);
    setDirty(`‘${item.displayTitle}’ 삭제`);
    renderTable();
    renderSections();
    toast("콘텐츠를 편성에서 삭제했습니다.");
  }

  function submitUrlContent() {
    const title = $("#urlTitleInput").value.trim();
    if (!title) { toast("페이지명을 입력해 주세요.", "error"); return; }
    let link;
    try {
      link = normalizeLinkUrl($("#urlLinkInput").value, "이동 URL");
      if (!link) throw new Error("이동 URL을 입력해 주세요.");
    } catch (error) {
      toast(error.message, "error");
      return;
    }
    const targetItems = destinationItems();
    const previousItem = editingItemId ? targetItems.find(candidate => candidate.id === editingItemId) : null;
    const thumbnail = urlThumbnailData || defaultLinkThumbnail(title);
    const item = {
      id: editingItemId || `url-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      displayTitle: title,
      type: "URL 링크",
      access: "바로가기",
      points: 0,
      link,
      urlThumbnailData,
      thumbnail,
      baseThumbnail: thumbnail,
      visible: $("#urlVisibleSelect").value === "true",
      openNewWindow: $("#urlOpenNewWindowInput").checked,
      recommended: previousItem?.recommended || false,
      isNew: previousItem?.isNew || false,
      source: "url"
    };
    if (editingItemId) {
      const index = targetItems.findIndex(candidate => candidate.id === editingItemId);
      targetItems[index] = item;
      if (contentDestination === "theme") touchTheme();
      setDirty(`${contentDestination === "theme" ? `‘${currentTheme().name}’ 테마의 ` : ""}‘${title}’ URL 링크 수정`);
      toast("URL 링크를 수정했습니다.", "success");
    } else {
      targetItems.push(item);
      if (contentDestination === "theme") touchTheme();
      setDirty(`${contentDestination === "theme" ? `‘${currentTheme().name}’ 테마에 ` : ""}‘${title}’ URL 링크 등록`);
      toast("URL 링크를 편성에 추가했습니다.", "success");
    }
    closeDrawer("#contentDrawerBackdrop");
    if (contentDestination === "theme") renderThemeContent(currentTheme());
    else renderTable();
    renderSections();
  }

  function submitContent() {
    if (contentSourceMode === "url") { submitUrlContent(); return; }
    if (!activeClip) return;
    const title = $("#displayTitleInput").value.trim();
    if (!title) { toast("노출 제목을 입력해주세요.", "error"); return; }
    const targetItems = destinationItems();
    const previousItem = editingItemId ? targetItems.find(candidate => candidate.id === editingItemId) : null;
    const item = {
      id: activeClip.id,
      title: activeClip.title,
      displayTitle: title,
      materialTypeCode: activeClip.materialTypeCode,
      materialTypeLabel: activeClip.materialTypeLabel || activeClip.type,
      topicCode: activeClip.topicCode,
      topicLabel: activeClip.topicLabel || activeClip.topic,
      memberPolicyCode: activeClip.memberPolicyCode,
      memberPolicyLabel: activeClip.memberPolicyLabel || activeClip.memberPolicy,
      type: activeClip.materialTypeLabel || activeClip.type,
      access: activeClip.access,
      points: activeClip.points,
      month: activeClip.month,
      topic: activeClip.topicLabel || activeClip.topic,
      memberPolicy: activeClip.memberPolicyLabel || activeClip.memberPolicy,
      link: activeClip.link,
      thumbnail: activeClip.membershipThumbnail,
      baseThumbnail: activeClip.baseThumbnail,
      visible: $("#displayVisibleSelect").value === "true",
      recommended: previousItem?.recommended || false,
      isNew: previousItem?.isNew || false,
      source: previousItem?.source || "manual"
    };

    if (editingItemId) {
      const index = targetItems.findIndex(candidate => candidate.id === editingItemId);
      targetItems[index] = item;
      if (contentDestination === "theme") touchTheme();
      setDirty(`${contentDestination === "theme" ? `‘${currentTheme().name}’ 테마의 ` : ""}‘${title}’ 노출정보 수정`);
      toast("콘텐츠 노출정보를 수정했습니다.", "success");
    } else {
      if (targetItems.some(candidate => candidate.id === item.id)) {
        toast("현재 섹션에 이미 편성된 클립입니다.", "error");
        return;
      }
      targetItems.push(item);
      if (contentDestination === "theme") touchTheme();
      setDirty(`${contentDestination === "theme" ? `‘${currentTheme().name}’ 테마에 ` : ""}‘${title}’ 등록`);
      toast("콘텐츠를 편성에 추가했습니다.", "success");
    }
    closeDrawer("#contentDrawerBackdrop");
    if (contentDestination === "theme") renderThemeContent(currentTheme());
    else renderTable();
    renderSections();
  }

  async function fileToDataUrl(file) {
    const source = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const image = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = source;
    });
    const maxWidth = 1000;
    const scale = Math.min(1, maxWidth / image.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", .86);
  }

  async function applyMembershipThumbToBase() {
    if (!activeClip) return;
    const accepted = await confirmAction({
      title: "클립자료 썸네일도 변경할까요?",
      body: "현재 등록한 이미지를 클립자료의 기본 썸네일에도 적용합니다. 기존 썸네일이 변경됩니다.",
      okText: "적용"
    });
    if (!accepted) return;
    try {
      await window.MembershipClipService.updateBaseThumbnail(activeClip.id, activeClip.membershipThumbnail);
      activeClip.baseThumbnail = activeClip.membershipThumbnail;
      $("#baseThumbPreview").src = activeClip.baseThumbnail;
      $("#originalThumb").src = activeClip.baseThumbnail;
      toast("클립자료 기본 썸네일에 적용했습니다.", "success");
    } catch (error) {
      toast(error.message || "기본 썸네일 적용에 실패했습니다.", "error");
    }
  }

  async function openRecommendations() {
    selectedRecommendationIds.clear();
    recommendationFilter = "전체";
    openDrawer("#recommendDrawerBackdrop");
    renderRecommendationTabs();
    await loadRecommendations();
  }

  function renderRecommendationTabs() {
    const filters = ["전체", "최근 등록", "인기", "시즌", "무료", "유료"];
    $("#recommendTabs").innerHTML = filters.map(filter => `<button class="recommend-tab ${filter === recommendationFilter ? "active" : ""}" data-recommend-filter="${filter}">${filter}</button>`).join("");
    $$('[data-recommend-filter]').forEach(button => button.addEventListener("click", async () => {
      recommendationFilter = button.dataset.recommendFilter;
      selectedRecommendationIds.clear();
      renderRecommendationTabs();
      await loadRecommendations();
    }));
  }

  async function loadRecommendations() {
    $("#recommendGrid").innerHTML = '<div class="history-item">추천 후보를 불러오는 중입니다.</div>';
    recommendations = await window.MembershipClipService.getRecommendations(recommendationFilter);
    renderRecommendationGrid();
  }

  function renderRecommendationGrid() {
    const existingIds = new Set(currentSection().items.map(item => item.id));
    $("#recommendGrid").innerHTML = recommendations.map(item => {
      const exists = existingIds.has(item.id);
      const selected = selectedRecommendationIds.has(item.id);
      return `
        <label class="recommend-card ${selected ? "selected" : ""}" data-recommend-id="${item.id}">
          <input type="checkbox" ${selected ? "checked" : ""} ${exists ? "disabled" : ""} />
          <img src="${escapeHtml(item.thumbnail)}" alt="" />
          <div><div class="recommend-title">${escapeHtml(item.title)}</div><div class="recommend-meta">ID ${item.id} · ${item.type} · ${exists ? "이미 편성됨" : item.access}</div></div>
        </label>`;
    }).join("");
    $$("[data-recommend-id]").forEach(card => {
      const input = card.querySelector("input");
      input.addEventListener("change", () => {
        if (input.checked) selectedRecommendationIds.add(card.dataset.recommendId);
        else selectedRecommendationIds.delete(card.dataset.recommendId);
        renderRecommendationGrid();
      });
    });
    $("#recommendSelectionCount").textContent = `${selectedRecommendationIds.size}개 선택`;
    $("#addRecommendationsBtn").disabled = selectedRecommendationIds.size === 0;
  }

  function addSelectedRecommendations() {
    const chosen = recommendations.filter(item => selectedRecommendationIds.has(item.id));
    chosen.forEach(clip => currentSection().items.push({
      id: clip.id, title: clip.title, displayTitle: clip.title, type: clip.type, access: clip.access,
      points: clip.points, link: clip.link, thumbnail: clip.thumbnail, baseThumbnail: clip.thumbnail,
      visible: true, recommended: true, isNew: false, source: "recommended"
    }));
    setDirty(`추천 콘텐츠 ${chosen.length}개 추가`);
    closeDrawer("#recommendDrawerBackdrop");
    renderTable();
    renderSections();
    toast(`${chosen.length}개 추천 콘텐츠를 편성에 추가했습니다.`, "success");
  }

  function saveDraft() {
    if (currentAdminView === "main") {
      commonSettings().modifiedAt = nowText();
      commonSettings().modifiedBy = USER_NAME;
      saveStateToStorage();
      clearDirty();
      renderHistory();
      renderAudit();
      toast("메인 공통 설정을 저장했습니다.", "success");
      return;
    }
    currentMonth().status = "draft";
    saveStateToStorage();
    clearDirty();
    renderStatus();
    renderHistory();
    renderAudit();
    toast("임시저장했습니다.", "success");
  }

  async function publish() {
    if (currentAdminView === "main") {
      const accepted = await confirmAction({ title: "메인 공통 설정을 적용할까요?", body: "히어로, 카테고리·섹션 구조, 프로그램 메뉴와 하단 프로모션 설정이 모든 연·월 화면에 공통 적용됩니다.", okText: "공통 설정 적용" });
      if (!accepted) return;
      recordHistory("메인 공통 설정 적용", { area: "메인관리 > 공통 설정", areaKey: "main-common", type: "적용" });
      saveStateToStorage();
      clearDirty();
      renderHistory();
      renderAudit();
      toast("메인 공통 설정을 적용했습니다.", "success");
      return;
    }
    const accepted = await confirmAction({ title: `${formatMonth(currentMonthKey)} 운영 화면을 발행할까요?`, body: "현재 메인 설정과 콘텐츠 편성 데이터가 합쳐져 멤버십전용관에 노출됩니다.", okText: "발행" });
    if (!accepted) return;
    currentMonth().status = "published";
    recordHistory(`${formatMonth(currentMonthKey)} 멤버십전용관 발행`);
    saveStateToStorage();
    clearDirty();
    renderStatus();
    renderHistory();
    renderAudit();
    toast("멤버십전용관 편성을 발행했습니다.", "success");
  }

  function monthOffset(key, amount) {
    const [year, month] = key.split("-").map(Number);
    const date = new Date(year, month - 1 + amount, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  function availableCopyMonthKeys() {
    return Object.keys(state.months).filter(key => key !== currentMonthKey).sort().reverse();
  }

  function selectedCopyMonthKey() {
    const year = $("#copySourceYear").value;
    const month = $("#copySourceMonth").value;
    return year && month ? `${year}-${month}` : "";
  }

  function selectedCopyTargetKey() {
    const year = Number($("#copyTargetYear").value);
    const month = Number($("#copyTargetMonth").value);
    if (!Number.isInteger(year) || year < 2000 || year > 2100 || month < 1 || month > 12) return "";
    return `${year}-${String(month).padStart(2, "0")}`;
  }

  function renderCopySourceInfo() {
    const sourceKey = selectedCopyMonthKey();
    const source = state.months[sourceKey];
    if (!source) {
      $("#copyMonthSourceInfo").textContent = "선택한 월에 저장된 편성 데이터가 없습니다.";
      $("#copyMonthApply").disabled = true;
      return;
    }
    const status = source.status === "published" ? "발행 완료" : "임시저장";
    $("#copyMonthSourceInfo").textContent = `${formatMonth(sourceKey)} · ${status} · 최종 수정 ${source.modifiedAt || "정보 없음"}`;
    $("#copyMonthApply").disabled = false;
  }

  function renderCopySourceMonths(preferredMonth) {
    const year = $("#copySourceYear").value;
    const monthKeys = availableCopyMonthKeys().filter(key => key.startsWith(`${year}-`));
    $("#copySourceMonth").innerHTML = monthKeys.map(key => {
      const month = key.split("-")[1];
      return `<option value="${month}">${Number(month)}월</option>`;
    }).join("");
    const preferred = String(preferredMonth || "").padStart(2, "0");
    if (monthKeys.some(key => key.endsWith(`-${preferred}`))) $("#copySourceMonth").value = preferred;
    renderCopySourceInfo();
  }

  function renderCopyTargetInfo() {
    const targetKey = selectedCopyTargetKey();
    if (!targetKey) {
      $("#copyMonthSourceInfo").textContent = "대상 연도와 월을 확인해 주세요.";
      $("#copyMonthApply").disabled = true;
      return;
    }
    if (targetKey === currentMonthKey) {
      $("#copyMonthSourceInfo").textContent = "현재 작업 중인 월과 다른 대상 월을 선택해 주세요.";
      $("#copyMonthApply").disabled = true;
      return;
    }
    const target = state.months[targetKey];
    $("#copyMonthSourceInfo").textContent = target
      ? `${formatMonth(targetKey)}에 기존 편성이 있습니다. 복사하면 선택 영역이 교체됩니다.`
      : `${formatMonth(targetKey)} 신규 편성을 만들고 현재 데이터를 복사합니다.`;
    $("#copyMonthTarget").textContent = `${formatMonth(targetKey)} 콘텐츠 편성`;
    $("#copyMonthApply").disabled = false;
  }

  function prepareCopyTargetPicker() {
    const nextKey = monthOffset(currentMonthKey, 1);
    const [year, month] = nextKey.split("-");
    $("#copyTargetYear").value = year;
    $("#copyTargetMonth").innerHTML = Array.from({ length: 12 }, (_, index) => {
      const value = String(index + 1).padStart(2, "0");
      return `<option value="${value}">${index + 1}월</option>`;
    }).join("");
    $("#copyTargetMonth").value = month;
  }

  function setCopyMonthDirection(direction) {
    copyMonthDirection = direction === "push" ? "push" : "pull";
    $$('[data-copy-direction]').forEach(button => {
      const active = button.dataset.copyDirection === copyMonthDirection;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    const pushing = copyMonthDirection === "push";
    $("#copySourcePicker").hidden = pushing;
    $("#copyTargetPicker").hidden = !pushing;
    $("#copyMonthTitle").textContent = pushing
      ? "현재 콘텐츠 편성을 다른 월로 복사"
      : "콘텐츠 편성 불러오기";
    $("#copyMonthDescription").textContent = pushing
      ? "현재 작업 중인 데이터를 복사할 대상 연도와 월을 선택해 주세요."
      : "복사할 원본 연도와 월을 선택해 주세요.";
    $("#copyMonthWarning").textContent = pushing
      ? "대상 월의 기존 콘텐츠 편성을 현재 편성으로 교체합니다. 메인 공통 설정은 복사하지 않으며, 복사 후 대상 월로 이동합니다."
      : "선택 월의 섹션 문구와 콘텐츠 편성만 복사합니다. 히어로·카테고리 구조·프로그램 메뉴·하단 프로모션 공통 설정은 변경되지 않습니다.";
    $("#copyMonthApply").textContent = pushing ? "현재 편성 복사하기" : "선택 월 불러오기";
    if (pushing) {
      renderCopyTargetInfo();
      $("#copyTargetYear").focus();
    } else {
      $("#copyMonthTarget").textContent = `${formatMonth(currentMonthKey)} 콘텐츠 편성`;
      renderCopySourceInfo();
      $("#copySourceYear").focus();
    }
  }

  function openCopyMonthModal() {
    if (currentAdminView !== "content") {
      toast("편성 불러오기는 콘텐츠 편성관리에서만 사용할 수 있습니다.", "error");
      return;
    }
    const sourceKeys = availableCopyMonthKeys();
    const previousKey = monthOffset(currentMonthKey, -1);
    if (sourceKeys.length) {
      const preferredKey = sourceKeys.includes(previousKey) ? previousKey : sourceKeys[0];
      const [preferredYear, preferredMonth] = preferredKey.split("-");
      const years = [...new Set(sourceKeys.map(key => key.split("-")[0]))];
      $("#copySourceYear").innerHTML = years.map(year => `<option value="${year}">${year}년</option>`).join("");
      $("#copySourceYear").value = preferredYear;
      renderCopySourceMonths(preferredMonth);
    } else {
      $("#copySourceYear").innerHTML = "";
      $("#copySourceMonth").innerHTML = "";
    }
    prepareCopyTargetPicker();
    $("#copyMonthBackdrop").classList.add("open");
    $("#copyMonthBackdrop").setAttribute("aria-hidden", "false");
    setCopyMonthDirection(sourceKeys.length ? "pull" : "push");
  }

  function closeCopyMonthModal() {
    $("#copyMonthBackdrop").classList.remove("open");
    $("#copyMonthBackdrop").setAttribute("aria-hidden", "true");
  }

  function copySelectedMonth() {
    if (copyMonthDirection === "push") {
      copyCurrentMonthToTarget();
      return;
    }
    const sourceKey = selectedCopyMonthKey();
    const source = state.months[sourceKey];
    if (!source || sourceKey === currentMonthKey) { toast("불러올 월의 편성 데이터를 확인해 주세요.", "error"); return; }
    currentMonth().sections = clone(source.sections);
    syncAllMonthsToCommonStructure();
    currentMonth().status = "draft";
    currentSectionId = currentMonth().sections[0].id;
    closeCopyMonthModal();
    setDirty(`${formatMonth(sourceKey)} 콘텐츠 편성 불러오기`);
    renderAll();
    toast(`${formatMonth(sourceKey)} 콘텐츠 편성을 불러왔습니다.`, "success");
  }

  function copyCurrentMonthToTarget() {
    const targetKey = selectedCopyTargetKey();
    if (!targetKey || targetKey === currentMonthKey) { toast("복사할 대상 연도와 월을 확인해 주세요.", "error"); return; }
    const sourceKey = currentMonthKey;
    const source = clone(currentMonth());
    const targetExists = Boolean(state.months[targetKey]);
    const target = state.months[targetKey] || {
      status: "draft",
      pageSettings: defaultPageSettings(targetKey),
      sections: sectionBlueprints.map(section => ({ ...clone(section), items: [] })),
      modifiedAt: nowText(),
      modifiedBy: USER_NAME,
      history: []
    };
    target.sections = clone(source.sections);
    target.status = "draft";
    state.months[targetKey] = target;
    currentMonthKey = targetKey;
    currentSectionId = target.sections[0].id;
    closeCopyMonthModal();
    setDirty(`${formatMonth(sourceKey)} 콘텐츠 편성을 ${formatMonth(targetKey)}에 복사`);
    $("#contentSearch").value = "";
    renderAll();
    toast(`${formatMonth(targetKey)}에 현재 콘텐츠 편성을 ${targetExists ? "교체" : "생성"}했습니다.`, "success");
  }

  function createNextMonth() {
    const lastKey = Object.keys(state.months).sort().at(-1);
    const newKey = monthOffset(lastKey, 1);
    state.months[newKey] = {
      status: "draft",
      pageSettings: clone(commonPageSettings()),
      sections: commonSections().map(section => ({ ...clone(section), items: [], ...(section.id === "solution" ? { themeGroups: [] } : {}) })),
      modifiedAt: nowText(), modifiedBy: USER_NAME,
      history: [{ action: `${formatMonth(newKey)} 신규 편성 생성`, at: nowText(), by: USER_NAME }]
    };
    currentMonthKey = newKey;
    currentSectionId = state.months[newKey].sections[0].id;
    clearDirty();
    saveStateToStorage();
    renderAll();
    toast(`${formatMonth(newKey)} 편성을 생성했습니다.`, "success");
  }

  function preview() {
    const previewMonth = clone(currentMonth());
    const commonById = new Map(commonSections().map(section => [section.id, section]));
    previewMonth.pageSettings = clone(commonPageSettings());
    previewMonth.sections = previewMonth.sections.map(section => {
      const common = commonById.get(section.id) || {};
      return { ...section, adminName: common.adminName || section.adminName, layoutTheme: common.layoutTheme || section.layoutTheme, visible: common.visible !== false && section.visible !== false };
    });
    const payload = { monthKey: currentMonthKey, month: previewMonth, selectedSectionId: currentSectionId, focusSelectedSection: currentAdminView === "content", generatedAt: nowText() };
    try { localStorage.setItem(PREVIEW_KEY, JSON.stringify(payload)); } catch (error) { console.warn(error); }
    window.getMembershipPreviewData = () => clone(payload);
    window.open("membership_admin_preview.html", "_blank", "noopener=false");
  }

  function previewHeroBanner(bannerId) {
    const banner = commonPageSettings().heroBanners.find(item => item.id === bannerId);
    if (!banner) return;
    const previewMonth = clone(currentMonth());
    previewMonth.pageSettings = clone(commonPageSettings());
    previewMonth.pageSettings.heroBanners = [{ ...clone(banner), visible: true }];
    const payload = { monthKey: currentMonthKey, month: previewMonth, selectedSectionId: currentSectionId, focusSelectedSection: false, generatedAt: nowText() };
    try { localStorage.setItem(PREVIEW_KEY, JSON.stringify(payload)); } catch (error) { console.warn(error); }
    window.getMembershipPreviewData = () => clone(payload);
    window.open("membership_admin_preview.html", "_blank", "noopener=false");
  }

  function addHeroBanner() {
    const banners = commonPageSettings().heroBanners;
    const timestamp = nowText();
    const banner = {
      id: `hero-banner-${Date.now()}`,
      label: `새 히어로 배너 ${banners.length + 1}`,
      title: "",
      subtitle: "",
      badge: "",
      image: "",
      targetUrl: "",
      visible: false,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    banners.push(banner);
    activeHeroBannerId = banner.id;
    setDirty(`${banner.label} 추가`);
    openHeroEditor(banner.id, true);
    toast("새 히어로 배너 등록 화면을 열었습니다.", "success");
  }

  function addLayoutSection() {
    const sections = commonSections();
    const nextNumber = sections.length + 1;
    const section = {
      id: `section-${Date.now()}`,
      adminName: `새 섹션 ${nextNumber}`,
      displayTitle: "새 콘텐츠 영역",
      subtitle: "섹션 보조문구를 입력하세요.",
      badge: "NEW",
      ctaLabel: "더보기",
      visible: true,
      layoutTheme: "popular-ranking",
      items: []
    };
    sections.push(section);
    commonPageSettings().categories.push({
      id: `category-${section.id}`,
      label: `새 메뉴 ${nextNumber}`,
      targetSectionId: section.id,
      visible: true
    });
    Object.values(state.months).forEach(month => month.sections.push({ ...clone(section), items: [] }));
    currentSectionId = section.id;
    setDirty(`‘${section.adminName}’ 섹션 영역 추가`);
    renderSectionLayouts();
    renderSections();
    renderCategoryMenus();
    toast("새 섹션 영역을 추가했습니다. 레이아웃 테마를 선택해 주세요.", "success");
    setTimeout(() => $(`[data-category-target] option[value="${section.id}"]`)?.closest("select")?.focus(), 0);
  }

  function openSectionSettings() {
    sectionSettingsDraft = commonSections().map(section => ({ id: section.id, adminName: section.adminName }));
    renderSectionSettings();
    openDrawer("#sectionSettingsBackdrop");
  }

  function renderSectionSettings() {
    $("#sectionSettingsList").innerHTML = sectionSettingsDraft.map((section, index) => `
      <div class="settings-row" data-settings-id="${escapeHtml(section.id)}">
        <span class="settings-index">${String(index + 1).padStart(2, "0")}</span>
        <input class="input" value="${escapeHtml(section.adminName)}" data-settings-title="${escapeHtml(section.id)}" />
        <button class="settings-delete" data-settings-delete="${escapeHtml(section.id)}" title="섹션 삭제">×</button>
      </div>`).join("");
    $$('[data-settings-title]').forEach(input => input.addEventListener("input", () => {
      const item = sectionSettingsDraft.find(section => section.id === input.dataset.settingsTitle);
      item.adminName = input.value;
    }));
    $$('[data-settings-delete]').forEach(button => button.addEventListener("click", () => {
      const original = commonSections().find(section => section.id === button.dataset.settingsDelete);
      if (original && sectionContentCountAcrossMonths(original.id)) { toast("월별 편성 콘텐츠가 있는 섹션은 삭제할 수 없습니다.", "error"); return; }
      if (sectionSettingsDraft.length <= 1) { toast("섹션은 최소 1개가 필요합니다.", "error"); return; }
      sectionSettingsDraft = sectionSettingsDraft.filter(section => section.id !== button.dataset.settingsDelete);
      renderSectionSettings();
    }));
  }

  function addSectionSetting() {
    const id = `section-${Date.now()}`;
    sectionSettingsDraft.push({ id, adminName: "새 섹션" });
    renderSectionSettings();
    setTimeout(() => $(`[data-settings-title="${id}"]`)?.select(), 0);
  }

  function saveSectionSettings() {
    if (sectionSettingsDraft.some(section => !section.adminName.trim())) { toast("모든 관리용 섹션명을 입력해주세요.", "error"); return; }
    const previous = commonSections();
    state.commonSettings.sections = sectionSettingsDraft.map(draft => {
      const existing = previous.find(section => section.id === draft.id);
      return existing ? { ...existing, adminName: draft.adminName.trim() } : { id: draft.id, adminName: draft.adminName.trim(), displayTitle: "새 섹션 타이틀", subtitle: "섹션 보조문구를 입력하세요.", badge: "", ctaLabel: "더보기", visible: true, layoutTheme: "popular-ranking", items: [] };
    });
    syncAllMonthsToCommonStructure();
    if (!commonSections().some(section => section.id === currentSectionId)) currentSectionId = commonSections()[0].id;
    setDirty("섹션 구조 변경");
    closeDrawer("#sectionSettingsBackdrop");
    renderAll();
    toast("섹션 구조를 변경했습니다. 저장하면 반영됩니다.", "success");
  }

  function bindCopyInput(id, resolveTarget, property, historyLabel, afterInput) {
    const input = $(`#${id}`);
    let previousValue = resolveTarget()[property] ?? "";
    input.addEventListener("focus", () => { previousValue = resolveTarget()[property] ?? ""; });
    input.addEventListener("input", () => {
      resolveTarget()[property] = input.value;
      updateCopyCounter(input);
      setDirty();
      if (afterInput) afterInput();
    });
    const commitHistory = () => {
      const nextValue = resolveTarget()[property] ?? "";
      if (String(previousValue) !== String(nextValue)) recordHistory(historyLabel, { before: previousValue || "-", after: nextValue || "-" });
      previousValue = nextValue;
      renderHistory();
      renderAudit();
    };
    input.addEventListener("change", commitHistory);
    input.addEventListener("blur", commitHistory);
  }

  function bindGlobalEvents() {
    $("#mainModeTab").addEventListener("click", () => switchAdminView("main"));
    $("#contentModeTab").addEventListener("click", () => switchAdminView("content"));
    $("#statsModeTab").addEventListener("click", () => switchAdminView("stats"));
    $$("[data-main-anchor]").forEach(button => button.addEventListener("click", () => {
      if (historyViewOpen) {
        historyViewOpen = false;
        currentAdminView = "main";
        renderAdminView();
      }
      switchMainPanel(button.dataset.mainAnchor);
    }));
    $("#monthSelect").addEventListener("change", event => switchMonth(event.target.value));
    $("#createMonthBtn").addEventListener("click", createNextMonth);
    $("#copyMonthBtn").addEventListener("click", openCopyMonthModal);
    $$('[data-copy-direction]').forEach(button => button.addEventListener("click", () => setCopyMonthDirection(button.dataset.copyDirection)));
    $("#copySourceYear").addEventListener("change", () => renderCopySourceMonths());
    $("#copySourceMonth").addEventListener("change", renderCopySourceInfo);
    $("#copyTargetYear").addEventListener("input", renderCopyTargetInfo);
    $("#copyTargetMonth").addEventListener("change", renderCopyTargetInfo);
    $("#copyMonthCancel").addEventListener("click", closeCopyMonthModal);
    $("#copyMonthApply").addEventListener("click", copySelectedMonth);
    $("#copyMonthBackdrop").addEventListener("click", event => { if (event.target.id === "copyMonthBackdrop") closeCopyMonthModal(); });
    $("#addHeroBannerBtn").addEventListener("click", addHeroBanner);
    $("#heroEditorBackBtn").addEventListener("click", closeHeroEditor);
    $("#heroEditorDoneBtn").addEventListener("click", () => {
      try {
        currentHeroBanner().targetUrl = normalizeLinkUrl($("#heroTargetUrlInput").value, "타겟 링크");
      } catch (error) {
        toast(error.message, "error");
        $("#heroTargetUrlInput").focus();
        return;
      }
      touchCurrentHeroBanner();
      const wasNew = heroEditorIsNew;
      closeHeroEditor();
      toast(wasNew ? "히어로 배너를 등록했습니다." : "히어로 배너 수정을 완료했습니다.", "success");
    });
    $("#addLayoutSectionBtn").addEventListener("click", addLayoutSection);
    $("#addProgramShortcutBtn").addEventListener("click", addProgramShortcut);
    $("#previewBtn").addEventListener("click", preview);
    $("#saveDraftBtn").addEventListener("click", saveDraft);
    $("#quickSaveBtn").addEventListener("click", saveDraft);
    $("#publishBtn").addEventListener("click", publish);
    $("#addContentBtn").addEventListener("click", () => openContentDrawer("section"));
    $("#addThemeBtn").addEventListener("click", addTheme);
    $("#themeMonthSelect").addEventListener("change", event => switchMonth(event.target.value, true));
    $("#themeEditorBackBtn").addEventListener("click", closeThemeEditor);
    $("#themeEditorDoneBtn").addEventListener("click", () => {
      const theme = currentTheme();
      if (!theme) return;
      if (!theme.name.trim()) { toast("테마명을 입력해 주세요.", "error"); $("#themeNameInput").focus(); return; }
      try { theme.ctaUrl = normalizeLinkUrl($("#themeUrlInput").value, "CTA 연결 URL"); }
      catch (error) { toast(error.message, "error"); $("#themeUrlInput").focus(); return; }
      touchTheme(theme);
      closeThemeEditor();
      toast("테마 편집을 완료했습니다.", "success");
    });
    $("#addThemeContentBtn").addEventListener("click", () => openContentDrawer("theme"));
    const updateThemeField = (id, key, action) => $(id).addEventListener("input", event => {
      const theme = currentTheme();
      if (!theme) return;
      theme[key] = event.target.value;
      touchTheme(theme);
      setDirty(action);
    });
    updateThemeField("#themeNameInput", "name", "테마명 수정");
    updateThemeField("#themeSubtitleInput", "subtitle", "테마 보조문구 수정");
    updateThemeField("#themeCtaInput", "ctaLabel", "테마 CTA 문구 수정");
    updateThemeField("#themeUrlInput", "ctaUrl", "테마 CTA URL 수정");
    $("#themeOpenNewWindowInput").addEventListener("change", event => {
      const theme = currentTheme(); if (!theme) return;
      theme.openNewWindow = event.target.checked; touchTheme(theme);
      $("#themeOpenNewWindowLabel").textContent = theme.openNewWindow ? "ON" : "OFF";
      setDirty(`‘${theme.name}’ 새창 열기 ${theme.openNewWindow ? "ON" : "OFF"}`);
    });
    $("#themeVisibleInput").addEventListener("change", event => {
      const theme = currentTheme(); if (!theme) return;
      theme.visible = event.target.checked; touchTheme(theme);
      $("#themeVisibleLabel").textContent = theme.visible ? "ON" : "OFF";
      setDirty(`‘${theme.name}’ 테마 노출 ${theme.visible ? "ON" : "OFF"}`);
    });
    $("#themeImageUploadBtn").addEventListener("click", () => $("#themeImageFileInput").click());
    $("#themeImageDeleteBtn").addEventListener("click", () => {
      const theme = currentTheme(); if (!theme) return;
      theme.image = ""; touchTheme(theme); setDirty(`‘${theme.name}’ 대표 이미지 삭제`); renderThemeEditor(theme);
    });
    $("#themeImageFileInput").addEventListener("change", async event => {
      const file = event.target.files?.[0]; event.target.value = "";
      if (!file) return;
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { toast("JPG, PNG, WebP 이미지만 등록할 수 있습니다.", "error"); return; }
      try {
        const theme = currentTheme(); if (!theme) return;
        theme.image = await fileToDataUrl(file); touchTheme(theme); setDirty(`‘${theme.name}’ 대표 이미지 등록`); renderThemeEditor(theme);
        toast("테마 대표 이미지를 등록했습니다.", "success");
      } catch (error) { toast("이미지를 읽지 못했습니다.", "error"); }
    });
    $("#recommendBtn").addEventListener("click", openRecommendations);
    $("#openHistoryBtn").addEventListener("click", openHistoryView);
    $("#historyPeriodFilter").addEventListener("change", event => {
      $("#historyCustomRange").hidden = event.target.value !== "custom";
    });
    $("#historySearchBtn").addEventListener("click", () => applyHistoryFilters());
    $("#historyDetailClose").addEventListener("click", closeHistoryDetail);
    $("#historyDetailConfirm").addEventListener("click", closeHistoryDetail);
    $("#historyDetailBackdrop").addEventListener("click", event => { if (event.target.id === "historyDetailBackdrop") closeHistoryDetail(); });
    $("#contentSearch").addEventListener("input", renderTable);

    bindCopyInput("heroLabelInput", currentHeroBanner, "label", "히어로 배너명 수정", () => {
      touchCurrentHeroBanner();
      $("#heroBannerEditorLabel").textContent = currentHeroBanner().label || "이름 없는 배너";
    });
    bindCopyInput("heroTitleInput", currentHeroBanner, "title", "히어로 배너 메인 타이틀 수정", touchCurrentHeroBanner);
    bindCopyInput("heroSubtitleInput", currentHeroBanner, "subtitle", "히어로 배너 보조문구 수정", touchCurrentHeroBanner);
    bindCopyInput("heroBadgeInput", currentHeroBanner, "badge", "히어로 배너 배지 수정", touchCurrentHeroBanner);
    bindCopyInput("heroTargetUrlInput", currentHeroBanner, "targetUrl", "히어로 배너 타겟 링크 수정", touchCurrentHeroBanner);
    bindCopyInput("promoBadgeInput", () => commonPageSettings().promotion.design, "badge", "프로모션 배지 수정", renderPromotionLivePreview);
    bindCopyInput("promoTitleInput", () => commonPageSettings().promotion.design, "title", "프로모션 메인 문구 수정", renderPromotionLivePreview);
    bindCopyInput("promoSubtitleInput", () => commonPageSettings().promotion.design, "subtitle", "프로모션 보조문구 수정", renderPromotionLivePreview);
    bindCopyInput("promoCtaInput", () => commonPageSettings().promotion.design, "ctaLabel", "프로모션 디자인형 CTA 수정", renderPromotionLivePreview);
    bindCopyInput("promoImageCtaInput", () => commonPageSettings().promotion.image, "ctaLabel", "프로모션 통이미지형 CTA 수정", renderPromotionLivePreview);
    bindCopyInput("promoUrlInput", () => commonPageSettings().promotion.common, "linkUrl", "프로모션 링크 수정");
    bindCopyInput("sectionDisplayTitleInput", currentSection, "displayTitle", "섹션 Front 타이틀 수정");
    bindCopyInput("sectionSubtitleInput", currentSection, "subtitle", "섹션 보조문구 수정");
    bindCopyInput("sectionBadgeInput", currentSection, "badge", "섹션 배지 문구 수정");
    bindCopyInput("sectionCtaInput", currentSection, "ctaLabel", "섹션 CTA 문구 수정");
    bindCopyInput("featuredTitleInput", currentSection, "featuredTitle", "대표 카드 타이틀 수정");
    bindCopyInput("featuredDescriptionInput", currentSection, "featuredDescription", "대표 카드 설명 수정");
    bindCopyInput("featuredCtaInput", currentSection, "featuredCta", "대표 카드 CTA 수정");

    $$('input[name="promoType"]').forEach(input => input.addEventListener("change", () => {
      commonPageSettings().promotion.bannerType = input.value;
      setDirty(`하단 프로모션 배너 유형 ${input.value === "design" ? "디자인형" : "통이미지형"} 선택`);
      renderPromotionSettings();
    }));
    $("#promoOpenNewWindowInput").addEventListener("change", event => {
      commonPageSettings().promotion.common.openNewWindow = event.target.checked;
      setDirty(`하단 프로모션 새창 열기 ${event.target.checked ? "ON" : "OFF"}`);
      renderPromotionSettings();
    });
    $("#promoCommonVisibleInput").addEventListener("change", event => {
      commonPageSettings().promotion.common.visible = event.target.checked;
      setDirty(`하단 프로모션 배너 노출 ${event.target.checked ? "ON" : "OFF"}`);
      renderPromotionSettings();
    });
    $("#promoImageChangeBtn").addEventListener("click", () => $("#promoImageFileInput").click());
    $("#promoImageDeleteBtn").addEventListener("click", () => {
      commonPageSettings().promotion.image.imageUrl = "";
      setDirty("하단 프로모션 통이미지 삭제");
      renderPromotionSettings();
    });
    $("#promoImageFileInput").addEventListener("change", async event => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { toast("JPG, PNG, WebP 이미지만 등록할 수 있습니다.", "error"); return; }
      try {
        commonPageSettings().promotion.image.imageUrl = await fileToDataUrl(file);
        setDirty("하단 프로모션 통이미지 등록");
        renderPromotionSettings();
        toast("통이미지 배너를 등록했습니다.", "success");
      } catch (error) { toast("이미지를 읽지 못했습니다.", "error"); }
    });

    $("#heroBannerVisibleInput").addEventListener("change", event => {
      currentHeroBanner().visible = event.target.checked;
      touchCurrentHeroBanner();
      $("#heroBannerVisibleLabel").textContent = event.target.checked ? "ON" : "OFF";
      setDirty(`${currentHeroBanner().label} 노출 ${event.target.checked ? "ON" : "OFF"}`);
      renderHeroBannerManager();
    });
    $("#heroImageChangeBtn").addEventListener("click", () => $("#heroImageFileInput").click());
    $("#heroImageDeleteBtn").addEventListener("click", () => {
      const banner = currentHeroBanner();
      banner.image = "";
      touchCurrentHeroBanner();
      setDirty(`${banner.label} 통이미지 삭제`);
      renderHeroBannerManager();
    });

    $("#heroImageFileInput").addEventListener("change", async event => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      if (!file.type.startsWith("image/")) { toast("이미지 파일만 업로드할 수 있습니다.", "error"); return; }
      try {
        const banner = currentHeroBanner();
        banner.image = await fileToDataUrl(file);
        touchCurrentHeroBanner();
        setDirty(`${banner.label} 통이미지 교체`);
        renderHeroBannerManager();
        toast("히어로 배너 통이미지를 교체했습니다.", "success");
      } catch (error) { toast("이미지를 읽지 못했습니다.", "error"); }
    });

    $("#programIconFileInput").addEventListener("change", async event => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file || !programIconTargetId) return;
      if (!file.type.startsWith("image/")) { toast("이미지 파일만 업로드할 수 있습니다.", "error"); return; }
      try {
        const item = commonPageSettings().programShortcuts.find(program => program.id === programIconTargetId);
        if (!item) return;
        item.icon = await fileToDataUrl(file);
        setDirty(`‘${item.label}’ 프로그램 아이콘 교체`);
        renderProgramShortcuts();
        toast("프로그램 원형 아이콘을 교체했습니다.", "success");
      } catch (error) { toast("이미지를 읽지 못했습니다.", "error"); }
      finally { programIconTargetId = null; }
    });

    $("#sectionVisibleInput").addEventListener("change", event => {
      const commonSection = commonSections().find(section => section.id === currentSectionId);
      if (commonSection) commonSection.visible = event.target.checked;
      syncAllMonthsToCommonStructure();
      $("#sectionVisibleLabel").textContent = event.target.checked ? "ON" : "OFF";
      setDirty(`‘${currentSection().adminName}’ 섹션 노출 ${event.target.checked ? "ON" : "OFF"}`);
      renderSections();
    });
    $("#deleteCurrentSectionBtn").addEventListener("click", () => deleteSectionById(currentSectionId));

    $("#changeFeaturedImageBtn").addEventListener("click", () => $("#featuredImageFileInput").click());
    $("#featuredImageFileInput").addEventListener("change", async event => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      if (!file.type.startsWith("image/")) { toast("이미지 파일만 업로드할 수 있습니다.", "error"); return; }
      try {
        currentSection().featuredImage = await fileToDataUrl(file);
        $("#featuredImagePreview").src = currentSection().featuredImage;
        setDirty("대표 카드 이미지 변경");
        toast("대표 카드 이미지를 변경했습니다.", "success");
      } catch (error) { toast("이미지를 읽지 못했습니다.", "error"); }
    });

    $$('[data-content-source]').forEach(button => button.addEventListener("click", () => {
      setContentSourceMode(button.dataset.contentSource);
      setTimeout(() => (contentSourceMode === "url" ? $("#urlTitleInput") : $("#clipIdInput")).focus(), 0);
    }));
    ["urlTitleInput", "urlLinkInput"].forEach(id => $(`#${id}`).addEventListener("input", updateUrlContentPreview));
    $("#registerUrlThumbnailBtn").addEventListener("click", () => $("#urlThumbnailFileInput").click());
    $("#clearUrlThumbnailBtn").addEventListener("click", () => {
      urlThumbnailData = "";
      $("#urlThumbnailFileInput").value = "";
      renderUrlThumbnailChoice();
    });
    $("#deleteUrlThumbnailBtn").addEventListener("click", () => {
      urlThumbnailData = "";
      $("#urlThumbnailFileInput").value = "";
      renderUrlThumbnailChoice();
      toast("등록한 썸네일 이미지를 삭제했습니다.", "success");
    });
    $("#urlThumbnailFileInput").addEventListener("change", async event => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      if (!file.type.startsWith("image/")) { toast("이미지 파일만 등록할 수 있습니다.", "error"); return; }
      try {
        urlThumbnailData = await fileToDataUrl(file);
        renderUrlThumbnailChoice();
        toast("URL 링크 썸네일 이미지를 등록했습니다.", "success");
      } catch (error) { toast("이미지를 읽지 못했습니다.", "error"); }
    });
    $("#searchClipsBtn").addEventListener("click", searchClips);
    ["clipIdInput", "clipNameInput"].forEach(id => $(`#${id}`).addEventListener("keydown", event => { if (event.key === "Enter") searchClips(); }));
    $("#resetClipFiltersBtn").addEventListener("click", resetClipFilters);
    $("#addSelectedClipsBtn").addEventListener("click", addSelectedClips);
    $$('[data-sample-id]').forEach(button => button.addEventListener("click", () => {
      $("#clipIdInput").value = button.dataset.sampleId;
      $("#clipNameInput").value = "";
      ["clipTypeFilter", "clipTopicFilter", "clipMonthFilter", "clipMemberPolicyFilter"].forEach(id => { $(`#${id}`).value = "all"; });
      searchClips();
    }));
    $("#submitContentBtn").addEventListener("click", submitContent);
    $("#changeThumbBtn").addEventListener("click", () => $("#thumbFileInput").click());
    $("#thumbFileInput").addEventListener("change", async event => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file || !activeClip) return;
      if (!file.type.startsWith("image/")) { toast("이미지 파일만 업로드할 수 있습니다.", "error"); return; }
      try {
        activeClip.membershipThumbnail = await fileToDataUrl(file);
        $("#membershipThumbPreview").src = activeClip.membershipThumbnail;
        toast("멤버십용 썸네일을 변경했습니다.", "success");
      } catch (error) { toast("이미지를 읽지 못했습니다.", "error"); }
    });
    $("#resetThumbBtn").addEventListener("click", () => {
      if (!activeClip) return;
      activeClip.membershipThumbnail = activeClip.baseThumbnail;
      $("#membershipThumbPreview").src = activeClip.membershipThumbnail;
      toast("기본 썸네일로 되돌렸습니다.");
    });
    $("#applyToBaseBtn").addEventListener("click", applyMembershipThumbToBase);

    $("#addRecommendationsBtn").addEventListener("click", addSelectedRecommendations);
    $("#addSectionBtn").addEventListener("click", addSectionSetting);
    $("#saveSectionSettingsBtn").addEventListener("click", saveSectionSettings);

    $$('[data-close-drawer="content"]').forEach(button => button.addEventListener("click", () => closeDrawer("#contentDrawerBackdrop")));
    $$('[data-close-drawer="recommend"]').forEach(button => button.addEventListener("click", () => closeDrawer("#recommendDrawerBackdrop")));
    $$('[data-close-drawer="settings"]').forEach(button => button.addEventListener("click", () => closeDrawer("#sectionSettingsBackdrop")));
    $$(".drawer-backdrop").forEach(backdrop => backdrop.addEventListener("click", event => { if (event.target === backdrop) closeDrawer(`#${backdrop.id}`); }));

    $("#confirmCancel").addEventListener("click", () => closeConfirm(false));
    $("#confirmOk").addEventListener("click", () => closeConfirm(true));
    $("#confirmBackdrop").addEventListener("click", event => { if (event.target.id === "confirmBackdrop") closeConfirm(false); });
    $("#layoutPreviewClose").addEventListener("click", closeLayoutPreview);
    $$('[data-close-layout-preview]').forEach(button => button.addEventListener("click", closeLayoutPreview));
    $("#layoutPreviewBackdrop").addEventListener("click", event => { if (event.target.id === "layoutPreviewBackdrop") closeLayoutPreview(); });
    window.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      if ($("#copyMonthBackdrop").classList.contains("open")) closeCopyMonthModal();
      if ($("#layoutPreviewBackdrop").classList.contains("open")) closeLayoutPreview();
      if ($("#historyDetailBackdrop").classList.contains("open")) closeHistoryDetail();
    });

    window.addEventListener("beforeunload", event => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    });
  }

  bindGlobalEvents();
  renderAll();
})();
