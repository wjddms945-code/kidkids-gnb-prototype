(function () {
  "use strict";
  const PREVIEW_KEY = "kidkids_membership_preview_v1";
  let payload = null;
  try {
    if (window.opener && typeof window.opener.getMembershipPreviewData === "function") payload = window.opener.getMembershipPreviewData();
  } catch (error) { console.warn(error); }
  if (!payload) {
    try { payload = JSON.parse(localStorage.getItem(PREVIEW_KEY)); } catch (error) { console.warn(error); }
  }

  if (!payload || !payload.month) {
    document.querySelector("main").innerHTML = '<div class="empty-preview" style="margin:80px auto;max-width:800px">미리보기 데이터가 없습니다. 관리자 화면에서 미리보기를 다시 실행해주세요.</div>';
    return;
  }

  const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[char]));
  const safeTargetLink = value => /^(https?:\/\/|\/|\.\/|\.\.\/|#)/i.test(String(value || "").trim()) ? String(value).trim() : "";
  const formatMonth = key => { const [year, month] = key.split("-"); return `${year}년 ${Number(month)}월`; };
  const promotionGradients = {
    red:"linear-gradient(120deg,#5d1016,#b82d36 58%,#e1644f)", pink:"linear-gradient(120deg,#701744,#c12e72 58%,#ee7199)", orange:"linear-gradient(120deg,#7b2d0d,#d2641c 58%,#f39a3c)", yellow:"linear-gradient(120deg,#9d6a05,#e4ad20 55%,#ffd86a)", green:"linear-gradient(120deg,#123d2d,#257c57 58%,#63b67d)", blue:"linear-gradient(120deg,#12386a,#2769b4 58%,#64a5e8)", navy:"linear-gradient(120deg,#111b37,#23345f 58%,#465c8c)", purple:"linear-gradient(120deg,#32164f,#6b3490 58%,#a36ac5)", brown:"linear-gradient(120deg,#4d2c1b,#9a5b28 58%,#c57c3d)", black:"linear-gradient(120deg,#080a0f,#202631 58%,#3b4350)", white:"linear-gradient(120deg,#ffffff,#f0f2f6 58%,#dfe4ec)"
  };
  const pageSettings = payload.month.pageSettings || {};
  const visibleSections = payload.month.sections.filter(section => section.visible !== false);

  document.querySelector("#previewMonthLabel").textContent = `${formatMonth(payload.monthKey)} 편성 미리보기`;
  document.querySelector("#previewGeneratedAt").textContent = payload.generatedAt || "";
  const legacyImage = pageSettings.heroImages?.find(slot => slot.visible !== false && slot.image)?.image || "";
  const heroBanners = (pageSettings.heroBanners?.length ? pageSettings.heroBanners : [{
    id: "legacy-banner",
    title: pageSettings.heroTitle,
    subtitle: pageSettings.heroSubtitle,
    badge: pageSettings.heroBadge,
    image: legacyImage,
    visible: true
  }]).filter(banner => banner.visible !== false);
  let activeHeroIndex = 0;
  let heroTimer = null;

  function renderHeroBanner(index) {
    if (!heroBanners.length) return;
    activeHeroIndex = (index + heroBanners.length) % heroBanners.length;
    const banner = heroBanners[activeHeroIndex];
    document.querySelector("#previewHeroTitle").textContent = banner.title || "멤버십 회원만을 위한 특별한 콘텐츠 공간";
    document.querySelector("#previewHeroSubtitle").textContent = banner.subtitle || "수업과 놀이에 필요한 프리미엄 콘텐츠를 한곳에서 만나보세요.";
    document.querySelector("#previewHeroBadge").textContent = banner.badge || "MEMBERS ONLY";
    document.querySelector("#previewHeroImage").innerHTML = banner.image ? `<img src="${escapeHtml(banner.image)}" alt="히어로 배너 통이미지 ${activeHeroIndex + 1}" />` : "";
    const heroElement = document.querySelector(".preview-hero");
    const targetLink = safeTargetLink(banner.targetUrl);
    heroElement.dataset.targetLink = targetLink;
    heroElement.classList.toggle("is-linked", Boolean(targetLink));
    heroElement.tabIndex = targetLink ? 0 : -1;
    heroElement.title = targetLink ? "배너 링크로 이동" : "";
    document.querySelectorAll("[data-hero-dot]").forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === activeHeroIndex));
  }

  document.querySelector("#previewHeroDots").innerHTML = heroBanners.length > 1
    ? heroBanners.map((_, index) => `<button data-hero-dot="${index}" aria-label="${index + 1}번 히어로 배너"></button>`).join("")
    : "";
  document.querySelectorAll("[data-hero-dot]").forEach(button => button.addEventListener("click", () => {
    renderHeroBanner(Number(button.dataset.heroDot));
    restartHeroTimer();
  }));
  const previewHero = document.querySelector(".preview-hero");
  const followHeroLink = event => {
    if (event.target.closest("button")) return;
    const targetLink = safeTargetLink(previewHero.dataset.targetLink);
    if (targetLink) window.open(targetLink, "_self");
  };
  previewHero.addEventListener("click", followHeroLink);
  previewHero.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") followHeroLink(event);
  });
  function restartHeroTimer() {
    if (heroTimer) clearInterval(heroTimer);
    if (heroBanners.length > 1) {
      heroTimer = setInterval(() => renderHeroBanner(activeHeroIndex + 1), 5000);
    }
  }
  renderHeroBanner(0);
  restartHeroTimer();

  const categories = (pageSettings.categories || []).filter(category => {
    if (!category.visible) return false;
    return category.targetSectionId === "top" || visibleSections.some(section => section.id === category.targetSectionId);
  });
  document.querySelector("#previewSectionNav").innerHTML = categories.map((category, index) => `<button class="section-tab ${index === 0 ? "active" : ""}" data-nav-target="${escapeHtml(category.targetSectionId)}">${escapeHtml(category.label)}</button>`).join("");

  function cardMarkup(item) {
    const target = item.openNewWindow ? ' target="_blank" rel="noopener noreferrer"' : "";
    const flags = `${item.recommended ? '<em class="recommended">추천</em>' : ""}${item.isNew ? '<em class="new">NEW</em>' : ""}`;
    return `<a class="content-card" href="${escapeHtml(item.link || "#")}"${target}>
      <div class="content-thumb-wrap"><img src="${escapeHtml(item.thumbnail)}" alt="" /><span class="content-tag">${escapeHtml(item.type)}</span><span class="content-access">${item.source === "url" ? "LINK" : item.access === "무료" ? "FREE" : "MEM"}</span>${flags ? `<span class="content-flags">${flags}</span>` : ""}</div>
      <h3>${escapeHtml(item.displayTitle)}</h3>
      <div class="content-meta"><span>${escapeHtml(item.type)}</span><span>${escapeHtml(item.access)}</span>${item.points ? `<span>${Number(item.points).toLocaleString("ko-KR")}P</span>` : ""}</div>
    </a>`;
  }

  function featuredMarkup(section) {
    if (section.layoutTheme !== "event-showcase") return "";
    const image = section.featuredImage || section.items?.[0]?.thumbnail || "";
    return `<article class="featured-front-card" style="background-image:url('${escapeHtml(image)}')"><span>${escapeHtml(section.badge || "SPECIAL")}</span><h3>${escapeHtml(section.featuredTitle || section.displayTitle)}</h3><p>${escapeHtml(section.featuredDescription || section.subtitle || "")}</p><button>${escapeHtml(section.featuredCta || section.ctaLabel || "자세히 보기")}</button></article>`;
  }

  function shuffled(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function resolveMonthlyTheme(section) {
    if (section.id !== "solution" || !Array.isArray(section.themeGroups)) return null;
    const themes = section.themeGroups.filter(theme => theme.visible !== false);
    if (!themes.length) return { theme: null, items: [] };
    const storageKey = `kidkids_membership_monthly_theme_${payload.monthKey}_${section.id}`;
    let stored = null;
    try { stored = JSON.parse(sessionStorage.getItem(storageKey) || "null"); } catch (error) { /* 세션 저장소를 사용할 수 없으면 현재 진입에서만 유지 */ }
    const theme = themes.find(item => item.id === stored?.themeId) || themes[Math.floor(Math.random() * themes.length)];
    const uniqueItems = [...new Map((theme.items || []).filter(item => item.visible !== false).map(item => [item.id || item.link, item])).values()];
    let items = [];
    if (stored?.themeId === theme.id && Array.isArray(stored.itemIds)) {
      items = stored.itemIds.map(id => uniqueItems.find(item => (item.id || item.link) === id)).filter(Boolean);
    }
    const expectedCount = Math.min(5, uniqueItems.length);
    if (items.length !== expectedCount) items = uniqueItems.length <= 5 ? uniqueItems : shuffled(uniqueItems).slice(0, 5);
    try { sessionStorage.setItem(storageKey, JSON.stringify({ themeId: theme.id, itemIds: items.map(item => item.id || item.link) })); } catch (error) { /* 저장 실패 시에도 미리보기는 계속 표시 */ }
    return { theme, items };
  }

  function monthlyIntroMarkup(section, theme) {
    if (section.layoutTheme !== "monthly-pick") return "";
    if (!theme) return '<article class="monthly-intro-card monthly-theme-empty"><span>MONTHLY PLAY</span><h3>노출 가능한 테마가 없습니다.</h3><p>관리자에서 이 달의 놀이 테마를 등록하고 노출을 켜주세요.</p></article>';
    const target = theme.openNewWindow ? ' target="_blank" rel="noopener noreferrer"' : "";
    const ctaUrl = safeTargetLink(theme.ctaUrl) || "#";
    const imageStyle = theme.image ? ` style="background-image:linear-gradient(180deg,rgba(10,20,35,.05),rgba(10,20,35,.78)),url('${escapeHtml(theme.image)}')"` : "";
    return `<article class="monthly-intro-card monthly-theme-intro"${imageStyle}><span>${escapeHtml(section.badge || "MONTHLY PICK")}</span><h3>${escapeHtml(theme.name)}</h3><p>${escapeHtml(theme.subtitle || "")}</p>${theme.ctaLabel ? `<a href="${escapeHtml(ctaUrl)}"${target}>${escapeHtml(theme.ctaLabel)}</a>` : ""}</article>`;
  }

  function programShortcutMarkup(item) {
    return `<a class="program-shortcut" href="${escapeHtml(item.url || "#")}" style="--shortcut-color:${escapeHtml(item.color || "#4057bd")}">${item.badge ? `<em class="program-shortcut-badge ${item.badge === "HOT" ? "hot" : ""}">${escapeHtml(item.badge)}</em>` : ""}<span class="program-shortcut-icon">${item.icon ? `<img src="${escapeHtml(item.icon)}" alt="" />` : ""}</span><strong>${escapeHtml(item.label)}</strong></a>`;
  }

  document.querySelector("#previewSections").innerHTML = visibleSections.length ? visibleSections.map((section, index) => {
    const monthlyTheme = resolveMonthlyTheme(section);
    const items = monthlyTheme ? monthlyTheme.items : (section.items || []).filter(item => item.visible);
    const isProgram = section.layoutTheme === "program-circles";
    const programs = (pageSettings.programShortcuts || []).filter(item => item.visible !== false);
    const sectionContent = isProgram
      ? `<div class="program-shortcut-grid">${programs.length ? programs.map(programShortcutMarkup).join("") : '<div class="empty-preview">노출할 프로그램 메뉴가 없습니다.</div>'}</div>`
      : `<div class="content-grid">${featuredMarkup(section)}${monthlyIntroMarkup(section, monthlyTheme?.theme)}${items.length ? items.map(cardMarkup).join("") : (monthlyTheme?.theme ? '<div class="empty-preview">선택된 테마에 노출 가능한 콘텐츠가 없습니다.</div>' : section.id === "solution" ? "" : '<div class="empty-preview">이 섹션에 노출 가능한 콘텐츠가 없습니다.</div>')}</div>`;
    return `<section id="front-section-${escapeHtml(section.id)}" class="content-section layout-${escapeHtml(section.layoutTheme || "popular-ranking")}">
      <div class="section-head"><div><span class="section-number">${String(index + 1).padStart(2, "0")}</span><span class="front-badge">${escapeHtml(section.badge || "CURATION")}</span><h2>${escapeHtml(section.displayTitle || section.title)}</h2><p>${escapeHtml(section.subtitle || "")}</p></div><div class="section-side-actions"><a href="#front-section-${escapeHtml(section.id)}">${escapeHtml(section.ctaLabel || "더보기")}</a></div></div>
      ${sectionContent}
    </section>`;
  }).join("") : '<section class="content-section"><div class="empty-preview">이번 달에 노출하도록 설정된 섹션이 없습니다.</div></section>';

  document.querySelectorAll("[data-nav-target]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-nav-target]").forEach(item => item.classList.toggle("active", item === button));
    const target = button.dataset.navTarget;
    const destination = target === "top" ? document.querySelector(".preview-hero") : document.querySelector(`#front-section-${CSS.escape(target)}`);
    destination?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  function focusSelectedSection() {
    if (!payload.focusSelectedSection) return;
    const selectedSectionId = String(payload.selectedSectionId || "").trim();
    if (!selectedSectionId) return;
    const destination = document.querySelector(`#front-section-${CSS.escape(selectedSectionId)}`);
    if (!destination) return;
    document.querySelectorAll("[data-nav-target]").forEach(button => {
      button.classList.toggle("active", button.dataset.navTarget === selectedSectionId);
    });
    destination.scrollIntoView({ behavior: "auto", block: "start" });
  }

  const scheduleSelectedSectionFocus = () => {
    const frame = window.requestAnimationFrame || (callback => setTimeout(callback, 0));
    frame(() => frame(focusSelectedSection));
  };
  scheduleSelectedSectionFocus();
  window.addEventListener("load", focusSelectedSection, { once: true });

  const rawPromo = pageSettings.promotion || {};
  const promo = rawPromo.design || rawPromo.common ? rawPromo : {
    bannerType:"design",
    design:{ badge:rawPromo.badge || "기획전", title:rawPromo.title || "이번 달 기획전", subtitle:rawPromo.subtitle || "", ctaLabel:rawPromo.ctaLabel || "바로가기", colorPreset:"brown" },
    image:{ imageUrl:"", ctaLabel:"바로가기" },
    common:{ linkUrl:rawPromo.url || "#", openNewWindow:false, visible:rawPromo.visible !== false }
  };
  const promotion = document.querySelector("#previewPromotion");
  promotion.hidden = promo.common.visible === false;
  if (!promotion.hidden) {
    const isImage = promo.bannerType === "image";
    const target = promo.common.openNewWindow ? ' target="_blank" rel="noopener"' : "";
    const ctaLabel = isImage ? promo.image.ctaLabel : promo.design.ctaLabel;
    promotion.className = `promotion-banner${isImage ? " image-mode" : ""}${!isImage && ["yellow","white"].includes(promo.design.colorPreset) ? " is-light" : ""}`;
    promotion.style.background = isImage && promo.image.imageUrl
      ? `center / cover no-repeat url("${promo.image.imageUrl.replace(/"/g, "%22")}")`
      : (isImage ? "linear-gradient(135deg,#dfe4ec,#f3f5f8)" : (promotionGradients[promo.design.colorPreset] || promotionGradients.brown));
    promotion.innerHTML = isImage
      ? `${!promo.image.imageUrl ? '<span class="promo-image-empty">등록된 통이미지가 없습니다.</span>' : ""}${ctaLabel ? `<a href="${escapeHtml(promo.common.linkUrl || "#")}"${target}>${escapeHtml(ctaLabel)} →</a>` : ""}`
      : `<span class="promo-badge">${escapeHtml(promo.design.badge)}</span><h2>${escapeHtml(promo.design.title)}</h2><p>${escapeHtml(promo.design.subtitle)}</p>${ctaLabel ? `<a href="${escapeHtml(promo.common.linkUrl || "#")}"${target}>${escapeHtml(ctaLabel)} →</a>` : ""}`;
  }
})();
