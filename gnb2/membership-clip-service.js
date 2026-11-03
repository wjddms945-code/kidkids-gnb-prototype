(function (global) {
  "use strict";

  const mockClips = [
    { id: "87021", title: "가을 낙엽으로 꾸미는 우리 반", type: "활동지", access: "유료", points: 300, link: "/clip/87021", thumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_17_57.png", tags: ["시즌", "인기"] },
    { id: "87022", title: "숲에서 찾은 가을 색깔", type: "영상", access: "무료", points: 0, link: "/clip/87022", thumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_19_38.png", tags: ["시즌", "무료"] },
    { id: "87023", title: "단풍잎 모양 관찰 카드", type: "교수자료", access: "유료", points: 200, link: "/clip/87023", thumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_24_25.png", tags: ["최근 등록", "시즌"] },
    { id: "87024", title: "오늘은 꼬마 숲 탐험대", type: "놀이자료", access: "유료", points: 500, link: "/clip/87024", thumbnail: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_36_10.png", tags: ["인기", "유료"] },
    { id: "87025", title: "달토끼의 떡 방앗간", type: "동화", access: "유료", points: 300, link: "/clip/87025", thumbnail: "이미지/달토끼의 떡 방앗간_가로 .png", tags: ["인기", "유료"] },
    { id: "87026", title: "추석 행사 All-in-one", type: "행사자료", access: "유료", points: 700, link: "/clip/87026", thumbnail: "이미지/추석행사 All-in-one.png", tags: ["시즌", "유료"] },
    { id: "87027", title: "오감으로 만나는 가을 열매", type: "프로그램", access: "무료", points: 0, link: "/clip/87027", thumbnail: "이미지/오감퍼포먼스.png", tags: ["최근 등록", "무료"] },
    { id: "87028", title: "바깥놀이 체력 측정 데이", type: "행사자료", access: "유료", points: 400, link: "/clip/87028", thumbnail: "이미지/체력 측정 검사.png", tags: ["인기", "유료"] },
    { id: "87029", title: "가족과 함께하는 자동차 극장", type: "영상", access: "무료", points: 0, link: "/clip/87029", thumbnail: "이미지/시네마 자동차 극장.png", tags: ["최근 등록", "무료"] }
  ];

  class MockClipRepository {
    async findById(id) {
      await new Promise(resolve => setTimeout(resolve, 280));
      const clip = mockClips.find(item => item.id === String(id).trim());
      if (!clip) return null;
      return JSON.parse(JSON.stringify(clip));
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
    getRecommendations: filter => repository.getRecommendations(filter),
    updateBaseThumbnail: (id, dataUrl) => repository.updateBaseThumbnail(id, dataUrl),
    adapterName: global.KidkidsClipRepository ? "KidkidsClipRepository" : "MockClipRepository"
  };
})(window);
