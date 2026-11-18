(function () {
  "use strict";

  var footerLinks = [
    { label: "회사소개", href: "https://www.ekgroup.co.kr/story", external: true },
    { label: "이용약관", href: "https://www.kidkids.net/cs/agreement.html?type=A" },
    { label: "개인정보 처리방침", href: "https://www.kidkids.net/cs/agreement.html?type=P", important: true },
    { label: "홍보센터", href: "https://www.ekgroup.co.kr/story/pages/group/ad", external: true },
    { label: "제휴문의", href: "https://www.kidkids.net/cs/cs_partner.html" },
    { label: "광고문의", href: "https://www.kidkids.net/cs/cs_advertisement.html" },
    { label: "고객센터", href: "https://www.kidkids.net/cs" },
    { label: "서비스 전체보기", href: "https://www.kidkids.net/cs/sitemap.html" }
  ];

  var socialLinks = [
    { label: "키드키즈 카카오톡채널", href: "https://pf.kakao.com/_ilIrM", image: "https://kidkids.net/img/common/btn_2020_re_kakaoch.png" },
    { label: "키드키즈 공식 유튜브", href: "https://www.youtube.com/user/kidkidsnet", image: "https://kidkids.net/img/common/btn_2019_re_youtube.png" },
    { label: "키드키즈 공식 블로그", href: "https://blog.naver.com/kidkidscorp", image: "https://kidkids.net/img/common/btn_2019_re_blog.png" },
    { label: "키드키즈 인스타그램", href: "https://www.instagram.com/ek_kidkids", image: "https://kidkids.net/img/common/btn_2019_re_instagram.png" },
    { label: "키드키즈 페이스북", href: "https://www.facebook.com/ekkidkids", image: "https://kidkids.net/img/common/btn_2019_re_facebook.png" }
  ];

  var familyFallback = [
    { title: "어린이집 프랜차이즈", subtitle: "빅스맘", href: "https://bigsmom.com" },
    { title: "유아교육전문지", subtitle: "월간유아", href: "https://iyua.kidkids.net" },
    { title: "고용환급", subtitle: "키드키즈평생교육원", href: "https://edu.kidkids.net" },
    { title: "직장보육위탁", subtitle: "EK보육경영연구소", href: "https://ekkidscare.com" },
    { title: "스마트알림장", subtitle: "키드키즈 알림장", href: "https://note.teepahapa.com" },
    { title: "캐릭터 애니메이션", subtitle: "티파하파", href: "https://teepahapa.com" },
    { title: "영유아 홈스쿨링", subtitle: "와글바글", href: "https://www.waglebagle.net" },
    { title: "실버교육서비스", subtitle: "실버에듀넷", href: "https://www.silveredu.net" },
    { title: "몬테소리연구회", subtitle: "한국몬테소리협회", href: "https://kkms.co.kr" },
    { title: "중화권 포털서비스", subtitle: "leyojo", href: "http://www.leyojo.cn" },
    { title: "베트남 포털서비스", subtitle: "EKVINA", href: "https://ibantot.vn" },
    { title: "인도네시아 포털서비스", subtitle: "BigsMom Indonesia", href: "https://bigsmom.co.id" },
    { title: "키즈&실버 마케팅", subtitle: "이엔애드", href: "https://www.eknad.com" }
  ];

  var awardLinks = [
    { label: "KISA정보보호 관리체계인증", href: "https://www.kidkids.net/event/isms_2018/index_1.html", image: "https://www.kidkids.net/img/emblem/emblem01s.png" },
    { label: "굿콘텐츠 서비스인증", href: "https://ek.kidkids.net/story/pr_view.html?uid=942&page=2", image: "https://www.kidkids.net/img/emblem/emblem02s.png" },
    { label: "2024 대한민국 강소기업대상", href: "https://ek.kidkids.net/story/pr_view.html?uid=962&page=1", image: "https://www.kidkids.net/img/emblem/emblem11s.png" },
    { label: "2021 대한민국 교육대상 유아 온라인 부문 대상", href: "https://ek.kidkids.net/story/pr_view.html?uid=1091&page=1", image: "https://www.kidkids.net/img/emblem/emblem03_2.png" },
    { label: "2020 디지털 고객만족도 유아교육부문 1위", href: "https://ek.kidkids.net/story/pr_view.html?uid=1012&page=1", image: "https://www.kidkids.net/img/emblem/emblem03s.png" },
    { label: "2019 국가경쟁력대상 교육부문 대상", href: "https://ek.kidkids.net/story/pr_view.html?uid=956&page=2", image: "https://www.kidkids.net/img/emblem/emblem05s.png" },
    { label: "2019 일본이러닝어워드 글로벌부문 특별상", href: "https://ek.kidkids.net/story/pr_view.html?uid=947&page=1", image: "https://www.kidkids.net/img/emblem/emblem06s.png" },
    { label: "2019 고객이 신뢰하는 브랜드대상", href: "https://ek.kidkids.net/story/pr_view.html?uid=884&page=1", image: "https://www.kidkids.net/img/emblem/emblem07s.png" },
    { label: "6년연속 대한민국 교육기업 유아온라인대상", href: "https://ek.kidkids.net/story/pr_view.html?uid=748&page=4", image: "https://www.kidkids.net/img/emblem/emblem09s.png" }
  ];

  function externalAttributes(item) {
    return item.external ? ' target="_blank" rel="noopener noreferrer"' : "";
  }

  function linksMarkup() {
    return footerLinks.map(function (item) {
      return '<a class="kkm-footer__link' + (item.important ? " is-important" : "") + '" href="' + item.href + '"' + externalAttributes(item) + '>' + item.label + "</a>";
    }).join("");
  }

  function socialsMarkup() {
    return socialLinks.map(function (item) {
      return '<a href="' + item.href + '" target="_blank" rel="noopener noreferrer" aria-label="' + item.label + '" title="' + item.label + '"><img src="' + item.image + '" alt="" /></a>';
    }).join("");
  }

  function awardsMarkup() {
    return awardLinks.map(function (item) {
      return '<a class="kkm-footer__award" href="' + item.href + '" target="_blank" rel="noopener noreferrer" title="' + item.label + '"><img src="' + item.image + '" alt="' + item.label + '" /></a>';
    }).join("");
  }

  function familyMarkup(items) {
    return items.map(function (item) {
      return '<li><a href="' + item.href + '" target="_blank" rel="noopener noreferrer"><span>' + item.title + '</span><strong>' + item.subtitle + '</strong></a></li>';
    }).join("");
  }

  function footerMarkup() {
    return '<footer class="kkm-footer" aria-label="키드키즈 회사 및 서비스 정보">' +
      '<div class="kkm-footer__inner">' +
        '<nav class="kkm-footer__links" aria-label="정책 및 서비스 링크">' + linksMarkup() + '</nav>' +
        '<div class="kkm-footer__middle">' +
          '<div class="kkm-footer__company">' +
            '<p><b>EK㈜ 키드키즈</b><span>대표이사 : 이희주</span></p>' +
            '<p>경기도 용인시 기흥구 기흥로 58 기흥ICT밸리 B동 29층</p>' +
            '<p><span>대표전화 : 02-5880-115</span><span>E-MAIL : KIDKIDS@KIDKIDS.NET</span></p>' +
            '<p><span>사업자등록번호 : 214-86-51854</span><span>통신판매업 신고 : 제 2021-용인기흥-2008호</span><span>직업제공사업 신고 : 서울청 제2012-29호</span></p>' +
            '<small>ⓒ EK Corp. All rights reserved.</small>' +
          '</div>' +
          '<div class="kkm-footer__utility">' +
            '<div class="kkm-footer__family">' +
              '<button type="button" aria-expanded="false" aria-controls="kkmFamilyList"><span>FAMILY SITE</span><i aria-hidden="true"></i></button>' +
              '<ul id="kkmFamilyList">' + familyMarkup(familyFallback) + '</ul>' +
            '</div>' +
            '<div><span class="kkm-footer__utility-label">SNS CHANNEL</span><div class="kkm-footer__socials">' + socialsMarkup() + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="kkm-footer__awards" aria-label="인증 및 수상 내역">' + awardsMarkup() + '</div>' +
      '</div>' +
    '</footer>';
  }

  function injectStyles() {
    if (document.getElementById("kkm-footer-style")) return;
    var style = document.createElement("style");
    style.id = "kkm-footer-style";
    style.textContent = [
      ".kkm-footer{position:relative;z-index:2;width:100%;padding:0!important;border-top:1px solid rgba(255,255,255,.08)!important;background:#090a0f!important;color:#777986!important;font-family:Pretendard,-apple-system,BlinkMacSystemFont,system-ui,sans-serif!important;font-size:12px!important;text-align:left!important}",
      ".kkm-footer *{box-sizing:border-box}",
      ".kkm-footer__inner{width:min(calc(100% - 96px),1784px);margin:0 auto;padding:0}",
      ".kkm-footer__links{min-height:58px;display:flex;align-items:center;gap:0;flex-wrap:wrap;border-bottom:1px solid rgba(255,255,255,.075)}",
      ".kkm-footer__link{position:relative;padding:7px 14px;color:#9698a5!important;font-size:12px!important;font-weight:500!important;line-height:1;text-decoration:none!important;transition:color .18s ease}",
      ".kkm-footer__link:first-child{padding-left:0}",
      ".kkm-footer__link+.kkm-footer__link:before{content:'';position:absolute;left:0;top:50%;width:1px;height:10px;background:rgba(255,255,255,.1);transform:translateY(-50%)}",
      ".kkm-footer__link:hover,.kkm-footer__link:focus-visible{color:#fff!important}",
      ".kkm-footer__link.is-important{color:#d3d4dc!important;font-weight:700!important}",
      ".kkm-footer__link.is-important:hover{color:#ff6d91!important}",
      ".kkm-footer__middle{display:grid;grid-template-columns:minmax(0,1fr) 250px;gap:48px;padding:28px 0 25px}",
      ".kkm-footer__company p{display:flex;flex-wrap:wrap;gap:5px 18px;margin:0 0 7px!important;color:#747783!important;font-size:11px!important;line-height:1.45!important}",
      ".kkm-footer__company p span{position:relative}",
      ".kkm-footer__company p span+span:before{content:'';position:absolute;left:-9px;top:3px;width:1px;height:10px;background:rgba(255,255,255,.1)}",
      ".kkm-footer__company b{color:#a6a8b2;font-weight:650}",
      ".kkm-footer__company small{display:block;margin-top:13px;color:#5f616c;font-size:10.5px;letter-spacing:.02em}",
      ".kkm-footer__utility{display:flex;flex-direction:column;align-items:stretch;gap:17px}",
      ".kkm-footer__family{position:relative}",
      ".kkm-footer__family button{width:100%;height:42px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;border:1px solid rgba(255,255,255,.11);border-radius:8px;background:#111219;color:#c7c8d0;font:650 11px Pretendard,system-ui,sans-serif;cursor:pointer;transition:.18s ease}",
      ".kkm-footer__family button:hover,.kkm-footer__family button[aria-expanded=true]{border-color:rgba(255,255,255,.22);background:#161821;color:#fff}",
      ".kkm-footer__family button i{width:7px;height:7px;border-right:1px solid currentColor;border-bottom:1px solid currentColor;transform:rotate(45deg) translateY(-2px);transition:transform .18s ease}",
      ".kkm-footer__family button[aria-expanded=true] i{transform:rotate(225deg) translate(-1px,-1px)}",
      ".kkm-footer__family ul{position:absolute;z-index:30;left:0;right:0;bottom:48px;max-height:260px;margin:0;padding:6px;display:none;overflow:auto;list-style:none;border:1px solid rgba(255,255,255,.13);border-radius:9px;background:#15161d;box-shadow:0 16px 38px rgba(0,0,0,.45)}",
      ".kkm-footer__family.is-open ul{display:block}",
      ".kkm-footer__family li{margin:0;padding:0;list-style:none}",
      ".kkm-footer__family li a{padding:8px 9px;display:flex;align-items:center;justify-content:space-between;gap:10px;border-radius:6px;color:#868994!important;font-size:10.5px!important;text-decoration:none!important}",
      ".kkm-footer__family li a strong{color:#c8c9d1;font-size:10.5px;font-weight:650;white-space:nowrap}",
      ".kkm-footer__family li a:hover{background:rgba(255,255,255,.065);color:#fff!important}",
      ".kkm-footer__utility-label{display:block;margin-bottom:9px;color:#60626c;font-size:9px;font-weight:750;letter-spacing:.12em}",
      ".kkm-footer__socials{display:flex;align-items:center;gap:18px}",
      ".kkm-footer__socials a{width:25px;height:25px;display:grid;place-items:center;opacity:.58;filter:grayscale(1) invert(1);transition:opacity .18s ease,transform .18s ease}",
      ".kkm-footer__socials a:hover,.kkm-footer__socials a:focus-visible{opacity:1;transform:translateY(-1px)}",
      ".kkm-footer__socials img{max-width:24px;max-height:24px;display:block}",
      ".kkm-footer__awards{padding:18px 0 20px;display:grid;grid-template-columns:repeat(9,minmax(0,1fr));align-items:center;gap:8px;border-top:1px solid rgba(255,255,255,.075)}",
      ".kkm-footer__award{height:54px;padding:7px 8px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.08);border-radius:8px;background:rgba(255,255,255,.92);opacity:.72;transition:opacity .18s ease,background .18s ease}",
      ".kkm-footer__award:hover,.kkm-footer__award:focus-visible{opacity:1;background:#fff}",
      ".kkm-footer__award img{max-width:100%;max-height:38px;display:block;object-fit:contain}",
      "@media(max-width:900px){.kkm-footer__inner{width:min(100% - 40px,1280px)}.kkm-footer__middle{grid-template-columns:1fr;gap:24px}.kkm-footer__utility{max-width:360px}.kkm-footer__awards{grid-template-columns:repeat(3,1fr)}}",
      "@media(max-width:600px){.kkm-footer__inner{width:min(100% - 32px,1280px)}.kkm-footer__links{padding:10px 0}.kkm-footer__link{padding:7px 10px}.kkm-footer__middle{padding:24px 0}.kkm-footer__company p{display:block;margin-bottom:6px!important}.kkm-footer__company p span{display:block;margin-bottom:4px}.kkm-footer__company p span+span:before{display:none}.kkm-footer__utility{max-width:none}.kkm-footer__awards{grid-template-columns:repeat(2,1fr)}.kkm-footer__award{height:50px}}"
    ].join("");
    document.head.appendChild(style);
  }

  function safeFamilyItems(value) {
    if (!Array.isArray(value)) return [];
    return value.filter(function (item) {
      return item && item.title && item.subtitle && /^https?:\/\//i.test(String(item.href || ""));
    });
  }

  function bindFooter(footer) {
    var family = footer.querySelector(".kkm-footer__family");
    var button = family.querySelector("button");
    var list = family.querySelector("ul");
    function setOpen(open) {
      family.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    }
    button.addEventListener("click", function () { setOpen(!family.classList.contains("is-open")); });
    document.addEventListener("click", function (event) { if (!family.contains(event.target)) setOpen(false); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") setOpen(false); });

    fetch("https://www.kidkids.net/api/v1/common/footer/familysites.php")
      .then(function (response) { return response.ok ? response.json() : Promise.reject(new Error("family site response")); })
      .then(function (items) {
        var verified = safeFamilyItems(items);
        if (verified.length) list.innerHTML = familyMarkup(verified);
      })
      .catch(function () { /* 공식 API 접근이 제한되면 확인된 공통 푸터 목록을 유지합니다. */ });
  }

  function mountFooter() {
    if (document.querySelector(".kkm-footer")) return;
    injectStyles();
    var shell = document.createElement("div");
    shell.innerHTML = footerMarkup();
    var footer = shell.firstElementChild;
    var existing = document.querySelector("footer");
    if (existing) existing.replaceWith(footer);
    else document.body.appendChild(footer);
    bindFooter(footer);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountFooter, { once: true });
  else mountFooter();
})();
