(function (global) {
  "use strict";

  const toMockOptions = labels => labels.map(label => ({ code: label, label }));
  // 실제 분류 코드가 프로젝트에 포함되어 있지 않아 아래 code는 목업 어댑터 안에서만
  // 쓰입니다. 운영 연동 시 KidkidsClipRepository.getFilterCatalog()가 기존 관리자
  // code/label 쌍을 반환하고 search()가 그 code를 그대로 전달받습니다.
  const mockFilterCatalog = {
    source: "mock",
    materialTypes: toMockOptions(["컷&도안", "활동지", "사진", "동요", "예문/서식", "슬라이드", "소리/효과음", "애니메이션/동영상", "학습지", "오디오클립", "크래프트", "AI 프롬프트"]),
    topics: toMockOptions(["우리 원과 친구", "봄", "나와 가족", "우리 동네", "동식물과 자연", "여름", "건강과 안전", "환경과 생활", "우리나라", "세계여러나라", "가을", "교통기관", "생활도구", "겨울/새해", "색/모양/감각", "수료/졸업"]),
    memberPolicies: toMockOptions(["정회원", "멀티회원", "FREE", "일반(포인트50)"])
  };

  const mockClips = [
    { id: "87021", title: "가을 낙엽으로 꾸미는 우리 반", month: 10, materialTypeCode: "활동지", materialTypeLabel: "활동지", topicCode: "가을", topicLabel: "가을", memberPolicyCode: "정회원", memberPolicyLabel: "정회원", type: "활동지", topic: "가을", access: "유료", points: 300, link: "/clip/87021", thumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_17_57.png", tags: ["시즌", "인기"] },
    { id: "87022", title: "숲에서 찾은 가을 색깔", month: 10, materialTypeCode: "활동지", materialTypeLabel: "활동지", topicCode: "가을", topicLabel: "가을", memberPolicyCode: "FREE", memberPolicyLabel: "FREE", type: "활동지", topic: "가을", access: "무료", points: 0, link: "/clip/87022", thumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_19_38.png", tags: ["시즌", "무료"] },
    { id: "87023", title: "단풍잎 모양 관찰 카드", month: 10, materialTypeCode: "컷&도안", materialTypeLabel: "컷&도안", topicCode: "가을", topicLabel: "가을", memberPolicyCode: "일반(포인트50)", memberPolicyLabel: "일반(포인트50)", type: "컷&도안", topic: "가을", access: "포인트", points: 50, link: "/clip/87023", thumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_24_25.png", tags: ["최근 등록", "시즌"] },
    { id: "87024", title: "오늘은 꼬마 숲 탐험대", month: 10, materialTypeCode: "사진", materialTypeLabel: "사진", topicCode: "동식물과 자연", topicLabel: "동식물과 자연", memberPolicyCode: "멀티회원", memberPolicyLabel: "멀티회원", type: "사진", topic: "동식물과 자연", access: "유료", points: 500, link: "/clip/87024", thumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_36_10.png", tags: ["인기", "유료"] },
    { id: "87025", title: "달토끼의 떡 방앗간", month: 9, materialTypeCode: "애니메이션/동영상", materialTypeLabel: "애니메이션/동영상", topicCode: "우리나라", topicLabel: "우리나라", memberPolicyCode: "정회원", memberPolicyLabel: "정회원", type: "애니메이션/동영상", topic: "우리나라", access: "유료", points: 300, link: "/clip/87025", thumbnail: "이미지/달토끼의 떡 방앗간_가로 .png", tags: ["인기", "유료"] },
    { id: "87026", title: "추석 행사 All-in-one", month: 9, materialTypeCode: "예문/서식", materialTypeLabel: "예문/서식", topicCode: "우리나라", topicLabel: "우리나라", memberPolicyCode: "멀티회원", memberPolicyLabel: "멀티회원", type: "예문/서식", topic: "우리나라", access: "유료", points: 700, link: "/clip/87026", thumbnail: "이미지/추석행사 All-in-one.png", tags: ["시즌", "유료"] },
    { id: "87027", title: "오감으로 만나는 가을 열매", month: 11, materialTypeCode: "오디오클립", materialTypeLabel: "오디오클립", topicCode: "가을", topicLabel: "가을", memberPolicyCode: "FREE", memberPolicyLabel: "FREE", type: "오디오클립", topic: "가을", access: "무료", points: 0, link: "/clip/87027", thumbnail: "이미지/오감퍼포먼스.png", tags: ["최근 등록", "무료"] },
    { id: "87028", title: "바깥놀이 체력 측정 데이", month: 5, materialTypeCode: "학습지", materialTypeLabel: "학습지", topicCode: "건강과 안전", topicLabel: "건강과 안전", memberPolicyCode: "정회원", memberPolicyLabel: "정회원", type: "학습지", topic: "건강과 안전", access: "유료", points: 400, link: "/clip/87028", thumbnail: "이미지/체력 측정 검사.png", tags: ["인기", "유료"] },
    { id: "87029", title: "가족과 함께하는 자동차 극장", month: 5, materialTypeCode: "애니메이션/동영상", materialTypeLabel: "애니메이션/동영상", topicCode: "나와 가족", topicLabel: "나와 가족", memberPolicyCode: "FREE", memberPolicyLabel: "FREE", type: "애니메이션/동영상", topic: "나와 가족", access: "무료", points: 0, link: "/clip/87029", thumbnail: "이미지/시네마 자동차 극장.png", tags: ["최근 등록", "무료"] }
  ];

  function matchesSearchCriteria(item, criteria) {
    const id = String(criteria?.id || "").trim();
    const name = String(criteria?.name || "").trim().toLocaleLowerCase("ko-KR");
    const materialTypeCode = String(criteria?.materialTypeCode || "all");
    const month = String(criteria?.month || "all");
    const topicCode = String(criteria?.topicCode || "all");
    const memberPolicyCode = String(criteria?.memberPolicyCode || "all");
    return (!id || item.id === id)
      && (!name || item.title.toLocaleLowerCase("ko-KR").includes(name))
      && (materialTypeCode === "all" || item.materialTypeCode === materialTypeCode)
      && (topicCode === "all" || item.topicCode === topicCode)
      && (month === "all" || String(item.month) === month)
      && (memberPolicyCode === "all" || item.memberPolicyCode === memberPolicyCode);
  }

  class MockClipRepository {
    async findById(id) {
      await new Promise(resolve => setTimeout(resolve, 280));
      const clip = mockClips.find(item => item.id === String(id).trim());
      if (!clip) return null;
      return JSON.parse(JSON.stringify(clip));
    }

    async search(criteria) {
      await new Promise(resolve => setTimeout(resolve, 180));
      return mockClips
        .filter(item => matchesSearchCriteria(item, criteria))
        .map(item => JSON.parse(JSON.stringify(item)));
    }

    async getFilterCatalog() {
      return JSON.parse(JSON.stringify(mockFilterCatalog));
    }

    async getRecommendations(filter) {
      await new Promise(resolve => setTimeout(resolve, 120));
      const normalized = filter || "전체";
      return mockClips
        .filter(item => normalized === "전체" || item.tags.includes(normalized) || item.access === normalized)
        .map(item => JSON.parse(JSON.stringify(item)));
    }

    async updateBaseThumbnail(id, dataUrl) {
      await new Promise(resolve => setTimeout(resolve, 220));
      const clip = mockClips.find(item => item.id === String(id));
      if (!clip) throw new Error("클립을 찾을 수 없습니다.");
      clip.thumbnail = dataUrl;
      return { ok: true, id: clip.id };
    }
  }

  // 실제 연동 시 window.KidkidsClipRepository에 동일한 메서드 계약을 주입합니다.
  const repository = global.KidkidsClipRepository || new MockClipRepository();

  global.MembershipClipService = {
    findById: id => repository.findById(id),
    getFilterCatalog: () => typeof repository.getFilterCatalog === "function"
      ? repository.getFilterCatalog()
      : Promise.resolve({ ...JSON.parse(JSON.stringify(mockFilterCatalog)), source: "interface-fallback" }),
    search: criteria => typeof repository.search === "function"
      ? repository.search(criteria)
      : (/^\d+$/.test(String(criteria?.id || "").trim())
        ? repository.findById(criteria.id).then(item => item && matchesSearchCriteria(item, criteria) ? [item] : [])
        : Promise.resolve([])),
    getRecommendations: filter => repository.getRecommendations(filter),
    updateBaseThumbnail: (id, dataUrl) => repository.updateBaseThumbnail(id, dataUrl),
    adapterName: global.KidkidsClipRepository ? "KidkidsClipRepository" : "MockClipRepository"
  };
})(window);
