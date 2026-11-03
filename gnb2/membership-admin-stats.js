(function () {
  "use strict";

  /*
   * Statistics prototype data boundary
   * ----------------------------------
   * This file contains UI-validation mock data only. It is not connected to
   * production analytics, member identity, orders, or payment completion.
   * Purchase counts and conversion rates intentionally remain unavailable.
   */
  const DATA_SOURCE = "prototype-mock";
  const PAYMENT_CONNECTION = "not-connected";
  const EVENT_SCHEMA = Object.freeze({
    eventNames: [
      "page_view", "content_impression", "content_click", "content_use",
      "video_play", "download_click", "program_click",
      "membership_cta_click", "checkout_view", "membership_purchase"
    ],
    fields: [
      "userKey", "sessionId", "contentId", "clipId", "sectionId",
      "contentType", "membershipStatus", "eventName", "eventAt", "source"
    ],
    notes: "userKey must follow the existing privacy and identity policy before connection."
  });

  const METRIC_INFO = Object.freeze({
    uv: { title: "방문자 수 (UV)", definition: "선택 기간 내 멤버십전용관을 방문한 중복 제거 사용자 수", basis: "동일 사용자가 여러 번 방문해도 1명으로 집계합니다.", usage: "실제 서비스 유입 규모를 확인할 때 봅니다." },
    pv: { title: "페이지 조회수 (PV)", definition: "멤버십전용관 페이지가 조회된 총 횟수", basis: "같은 사용자가 페이지를 다시 조회하면 별도 조회로 집계합니다.", usage: "방문자 대비 페이지가 얼마나 반복해서 소비되는지 확인할 때 봅니다." },
    contentClick: { title: "콘텐츠 클릭수", definition: "콘텐츠 카드 클릭 후 상세 화면에 진입한 건수", basis: "콘텐츠 카드의 content_click 이벤트를 기준으로 집계합니다.", usage: "콘텐츠가 실제 관심과 상세 탐색으로 이어지는 규모를 확인할 때 봅니다." },
    contentUse: { title: "콘텐츠 이용수", definition: "상세 화면에서 실제 콘텐츠 이용 행동이 발생한 건수", basis: "영상 재생, 자료 다운로드, 프로그램 이동 등 content_use 계열 이벤트를 합산합니다.", usage: "클릭 이후 실제 이용으로 이어진 콘텐츠를 판단할 때 봅니다." },
    ctaClick: { title: "멤버십 CTA 클릭수", definition: "멤버십 가입 또는 구매 관련 CTA를 클릭한 건수", basis: "membership_cta_click 이벤트를 기준으로 집계합니다.", usage: "콘텐츠 이용이 가입·구매 관심으로 이어지는지 확인할 때 봅니다." },
    checkoutView: { title: "결제 페이지 이동수", definition: "멤버십 결제 화면까지 이동한 건수", basis: "checkout_view 이벤트를 기준으로 집계하며 결제 완료와는 구분합니다.", usage: "구매 의도가 결제 단계까지 이어진 규모를 확인할 때 봅니다." },
    purchase: { title: "멤버십 구매 완료수", definition: "멤버십전용관 이용 이후 실제 멤버십 결제가 완료된 사용자 수", basis: "클릭 이벤트가 아닌 주문·결제 시스템의 완료 상태와 회원 식별값을 연결해 집계해야 합니다.", usage: "실제 매출 전환 규모를 확인할 때 봅니다." },
    purchaseConversion: { title: "구매 전환율", definition: "멤버십전용관 방문자 중 구매를 완료한 사용자의 비율", formula: "멤버십 구매 완료 사용자 ÷ 멤버십전용관 방문자(UV) × 100", usage: "방문이 실제 구매까지 얼마나 이어졌는지 확인할 때 봅니다." },
    impression: { title: "콘텐츠 노출수", definition: "콘텐츠 카드가 사용자 화면에 노출된 횟수", basis: "content_impression 이벤트를 기준으로 집계하며 동일 콘텐츠의 재노출은 별도 노출로 계산합니다.", usage: "클릭수의 배경이 되는 노출 규모와 편성 도달 정도를 확인할 때 봅니다." },
    sectionUsers: { title: "노출 사용자", definition: "해당 섹션을 실제로 본 중복 제거 사용자 수", basis: "같은 사용자가 해당 섹션을 여러 번 봐도 1명으로 집계합니다.", usage: "섹션이 얼마나 넓은 사용자에게 도달했는지 확인할 때 봅니다." },
    ctr: { title: "콘텐츠 클릭률 (CTR)", definition: "콘텐츠 노출 중 상세 클릭으로 이어진 비율", formula: "콘텐츠 클릭수 ÷ 콘텐츠 노출수 × 100", usage: "노출량과 관계없이 상대적으로 관심을 많이 받은 콘텐츠를 판단할 때 봅니다." },
    stageConversion: { title: "단계별 전환율", definition: "전환 퍼널의 바로 이전 단계에서 다음 단계로 이동한 사용자 비율", formula: "현재 단계 사용자 수 ÷ 이전 단계 사용자 수 × 100", usage: "이탈이 크게 발생하는 전환 단계를 찾을 때 봅니다." },
    contributionRate: { title: "구매 전환 기여율", definition: "구매 완료 흐름에서 해당 콘텐츠가 직접 또는 일정 기간 내 기여한 비율", formula: "해당 콘텐츠 기여 구매 사용자 ÷ 전체 멤버십 구매 완료 사용자 × 100", usage: "구매 원인을 단정하지 않고 구매 흐름에 영향을 준 콘텐츠를 비교할 때 봅니다." }
  });

  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const number = value => new Intl.NumberFormat("ko-KR").format(value);
  const safe = value => String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  const percent = (value, total) => total ? `${(value / total * 100).toFixed(1)}%` : "-";
  let metricTooltip = null;
  let pinnedInfoButton = null;

  const prototypeData = Object.freeze({
    kpis: [
      { key: "uv", infoKey: "uv", label: "방문자 수 (UV)", value: 8420 },
      { key: "pv", infoKey: "pv", label: "페이지 조회수 (PV)", value: 21640 },
      { key: "click", infoKey: "contentClick", label: "콘텐츠 클릭수", value: 4218 },
      { key: "use", infoKey: "contentUse", label: "콘텐츠 이용수", value: 2894 },
      { key: "cta", infoKey: "ctaClick", label: "멤버십 CTA 클릭수", value: 640 },
      { key: "checkout", infoKey: "checkoutView", label: "결제 페이지 이동수", value: 310 },
      { key: "purchase", infoKey: "purchase", label: "멤버십 구매 완료수", value: null, pending: true },
      { key: "conversion", infoKey: "purchaseConversion", label: "구매 전환율", value: null, pending: true }
    ],
    trend: {
      day: {
        labels: ["10/05", "10/09", "10/13", "10/17", "10/21", "10/25", "10/29", "11/03"],
        visitor: [710, 820, 760, 940, 1030, 1120, 1080, 1240],
        click: [310, 380, 335, 440, 485, 520, 500, 585],
        use: [205, 250, 228, 295, 328, 350, 344, 395]
      },
      month: {
        labels: ["6월", "7월", "8월", "9월", "10월", "11월"],
        visitor: [5620, 6110, 6480, 7050, 7860, 8420],
        click: [2480, 2760, 2980, 3360, 3820, 4218],
        use: [1620, 1810, 1970, 2240, 2580, 2894]
      }
    },
    popular: [
      { id: "clip-241031", name: "가을 낙엽 놀이", section: "가을 자연", type: "자료", impressions: 3200, clicks: 820, uses: 510, cta: 48, checkout: 23, image: "이미지/추석행사 All-in-one.png" },
      { id: "clip-241044", name: "추석 행사 All-in-one", section: "행사", type: "자료", impressions: 2910, clicks: 702, uses: 488, cta: 42, checkout: 20, image: "이미지/추석행사 All-in-one.png" },
      { id: "clip-241052", name: "달토끼의 떡 방앗간", section: "추천 테마", type: "영상", impressions: 2540, clicks: 625, uses: 452, cta: 38, checkout: 18, image: "이미지/달토끼의 떡 방앗간_가로 .png" },
      { id: "clip-241063", name: "오감 퍼포먼스", section: "프로그램", type: "프로그램", impressions: 2180, clicks: 590, uses: 431, cta: 35, checkout: 16, image: "이미지/오감퍼포먼스.png" },
      { id: "clip-241078", name: "우리 반 가을 미술관", section: "추천 테마", type: "자료", impressions: 1870, clicks: 510, uses: 342, cta: 31, checkout: 14, image: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_19_38.png" },
      { id: "clip-241086", name: "신체 측정 놀이", section: "프로그램", type: "프로그램", impressions: 2090, clicks: 478, uses: 366, cta: 26, checkout: 12, image: "이미지/체력 측정 검사.png" },
      { id: "clip-241094", name: "시네마 자동차 극장", section: "이달의 놀이", type: "영상", impressions: 1760, clicks: 446, uses: 325, cta: 24, checkout: 11, image: "이미지/시네마 자동차 극장.png" },
      { id: "clip-241101", name: "가을 자연물 수놀이", section: "가을 자연", type: "자료", impressions: 1510, clicks: 421, uses: 287, cta: 22, checkout: 10, image: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_17_57.png" },
      { id: "clip-241116", name: "우리 동네 소리 산책", section: "바깥놀이", type: "자료", impressions: 1680, clicks: 392, uses: 268, cta: 19, checkout: 8, image: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_36_10.png" },
      { id: "clip-241128", name: "디지털 미래교실", section: "교육부 추천", type: "영상", impressions: 1290, clicks: 348, uses: 236, cta: 18, checkout: 7, image: "이미지/ChatGPT Image 2026년 9월 9일 오후 03_24_25.png" }
    ],
    sections: [
      ["지금 많이 보는 콘텐츠", 8420, 12840, 2130, 1680],
      ["가을 자연", 6840, 9210, 1820, 1240],
      ["행사", 5980, 7740, 1460, 1035],
      ["프로그램", 5420, 6980, 1335, 980],
      ["추천 테마", 4890, 6260, 1180, 812],
      ["바깥놀이", 4210, 5340, 910, 645],
      ["이달의 놀이", 3880, 4920, 825, 580],
      ["교육부 추천", 3260, 4180, 690, 472]
    ]
  });

  function renderKpis() {
    $("#statsKpiGrid").innerHTML = prototypeData.kpis.map(item => `
      <article class="stats-kpi-card ${item.pending ? "pending" : ""}">
        <div class="stats-kpi-card-head"><span>${safe(item.label)}</span><button class="metric-info-button" type="button" data-metric-info="${safe(item.infoKey)}" aria-label="${safe(item.label)} 설명">i</button></div>
        <strong class="stats-kpi-value">${item.pending ? "연동 준비" : number(item.value)}</strong>
        <em class="stats-no-compare">${item.pending ? "결제 데이터 연결 후 제공" : "비교 데이터 없음"}</em>
      </article>`).join("");
  }

  function renderPopular() {
    $("#statsPopularBody").innerHTML = prototypeData.popular.map((item, index) => `
      <tr>
        <td><span class="stats-rank ${index < 3 ? "top" : ""}">${index + 1}</span></td>
        <td><button class="stats-content-link" type="button" data-stats-content="${safe(item.id)}"><img src="${safe(item.image)}" alt="" /><strong>${safe(item.name)}</strong></button></td>
        <td>${safe(item.id)}</td><td>${safe(item.section)}</td><td><span class="stats-type-chip">${safe(item.type)}</span></td>
        <td>${number(item.impressions)}</td><td>${number(item.clicks)}</td><td><span class="stats-ctr">${percent(item.clicks, item.impressions)}</span></td><td>${number(item.uses)}</td>
      </tr>`).join("");
  }

  function renderSections() {
    $("#statsSectionBody").innerHTML = prototypeData.sections.map(([name, users, impressions, clicks, uses]) => `
      <tr><td><strong>${safe(name)}</strong></td><td>${number(users)}</td><td>${number(impressions)}</td><td>${number(clicks)}</td><td><span class="stats-ctr">${percent(clicks, impressions)}</span></td><td>${number(uses)}</td></tr>`).join("");
  }

  function renderContribution() {
    $("#statsContributionBody").innerHTML = prototypeData.popular.map(item => `
      <tr><td><button class="stats-content-link" type="button" data-stats-content="${safe(item.id)}"><img src="${safe(item.image)}" alt="" /><strong>${safe(item.name)}</strong></button></td><td>${safe(item.section)}</td><td>${number(item.cta)}</td><td>${number(item.checkout)}</td><td><span class="stats-pending-cell">연동 준비</span></td><td><span class="stats-pending-cell">연동 후 제공</span></td></tr>`).join("");
  }

  function renderFunnel() {
    const stages = [
      { label: "멤버십전용관 방문", value: 8420, rate: "기준 단계" },
      { label: "멤버십 CTA 클릭", value: 640, rate: percent(640, 8420) },
      { label: "결제 페이지 이동", value: 310, rate: percent(310, 640) },
      { label: "멤버십 구매 완료", value: null, rate: "결제 연동 후 제공", pending: true }
    ];
    $("#statsMembershipFunnel").innerHTML = stages.map((stage, index) => `
      <div class="stats-funnel-step ${stage.pending ? "pending" : ""}"><div class="stats-funnel-main"><span>${stage.label}</span><strong>${stage.value === null ? "연동 준비" : `${number(stage.value)}명`}</strong></div><span class="stats-funnel-arrow">${index === stages.length - 1 ? "" : "↓"}</span><span class="stats-funnel-rate">${index === 0 ? stage.rate : `이전 단계 대비 ${stage.rate}`}</span></div>`).join("");
  }

  function points(values, maxValue, width, height, left, top) {
    const innerWidth = width - left - 20;
    const innerHeight = height - top - 34;
    return values.map((value, index) => {
      const x = left + (values.length === 1 ? 0 : innerWidth * index / (values.length - 1));
      const y = top + innerHeight - (value / maxValue * innerHeight);
      return [x, y];
    });
  }

  function pathFor(coords) {
    return coords.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ");
  }

  function renderTrend(granularity = "day") {
    const data = prototypeData.trend[granularity];
    const width = 1000;
    const height = 270;
    const left = 56;
    const top = 18;
    const maximum = Math.ceil(Math.max(...data.visitor) / 500) * 500;
    const series = [
      ["visitor", data.visitor, "#316be8"],
      ["click", data.click, "#28a08b"],
      ["use", data.use, "#8a5de8"]
    ];
    const grid = Array.from({ length: 5 }, (_, index) => {
      const y = top + (height - top - 34) * index / 4;
      const value = Math.round(maximum * (1 - index / 4));
      return `<line class="stats-chart-grid" x1="${left}" y1="${y}" x2="980" y2="${y}"/><text class="stats-chart-label" x="46" y="${y + 3}" text-anchor="end">${number(value)}</text>`;
    }).join("");
    const labelMarkup = data.labels.map((label, index) => {
      const x = left + (924 * index / (data.labels.length - 1));
      return `<text class="stats-chart-label" x="${x}" y="258" text-anchor="middle">${safe(label)}</text>`;
    }).join("");
    const seriesMarkup = series.map(([key, values, color]) => {
      const coords = points(values, maximum, width, height, left, top);
      const line = pathFor(coords);
      const area = `${line} L${coords[coords.length - 1][0]},236 L${coords[0][0]},236 Z`;
      const dots = coords.map(point => `<circle class="stats-chart-point" cx="${point[0]}" cy="${point[1]}" r="4" fill="${color}"/>`).join("");
      return `<path class="stats-chart-area" d="${area}" fill="${color}"/><path class="stats-chart-line" d="${line}" stroke="${color}" data-series="${key}"/>${dots}`;
    }).join("");
    $("#statsTrendChart").innerHTML = `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true">${grid}${labelMarkup}${seriesMarkup}</svg>`;
  }

  function openDetail(item) {
    if (!item) return;
    $("#statsDetailThumb").src = item.image;
    $("#statsDetailThumb").alt = `${item.name} 썸네일`;
    $("#statsDetailSection").textContent = `${item.section} · ${item.type}`;
    $("#statsDetailName").textContent = item.name;
    $("#statsDetailClip").textContent = item.id;
    const metrics = [
      ["노출", number(item.impressions)], ["상세 클릭", number(item.clicks)], ["CTR", percent(item.clicks, item.impressions)], ["실제 이용", number(item.uses)],
      ["멤버십 CTA 이동", number(item.cta)], ["결제 페이지 이동", number(item.checkout)], ["구매 완료", "연동 준비", true], ["구매 기여율", "연동 후 제공", true]
    ];
    $("#statsDetailMetrics").innerHTML = metrics.map(([label, value, pending]) => `<div class="stats-detail-metric ${pending ? "pending" : ""}"><span>${label}</span><strong>${value}</strong></div>`).join("");
    const stages = [["노출", item.impressions], ["상세 클릭", item.clicks], ["실제 이용", item.uses], ["CTA 클릭", item.cta], ["결제 이동", item.checkout], ["구매 완료", null]];
    $("#statsDetailFunnel").innerHTML = stages.map(([label, value]) => `<div class="${value === null ? "pending" : ""}"><span>${label}</span><strong>${value === null ? "연동 준비" : number(value)}</strong></div>`).join("");
    const backdrop = $("#statsDetailBackdrop");
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
  }

  function closeDetail() {
    const backdrop = $("#statsDetailBackdrop");
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
  }

  function localDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function setRange(type) {
    const end = new Date();
    const start = new Date(end);
    if (type === "7d") start.setDate(end.getDate() - 6);
    if (type === "30d") start.setDate(end.getDate() - 29);
    if (type === "month") start.setDate(1);
    if (type === "previous-month") {
      start.setMonth(end.getMonth() - 1, 1);
      end.setDate(0);
    }
    $("#statsStartDate").value = localDateString(start);
    $("#statsEndDate").value = localDateString(end);
    $$('[data-stats-range]').forEach(button => button.classList.toggle("active", button.dataset.statsRange === type));
  }

  function selectedText(selector) {
    const select = $(selector);
    return select.options[select.selectedIndex].textContent;
  }

  function showPrototypeToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    $("#toastStack").appendChild(toast);
    window.setTimeout(() => toast.remove(), 2600);
  }

  function createMetricTooltip() {
    metricTooltip = document.createElement("div");
    metricTooltip.id = "metricInfoTooltip";
    metricTooltip.className = "metric-info-tooltip";
    metricTooltip.setAttribute("role", "tooltip");
    metricTooltip.hidden = true;
    document.body.appendChild(metricTooltip);
  }

  function positionMetricTooltip(button) {
    const rect = button.getBoundingClientRect();
    const width = metricTooltip.offsetWidth;
    const height = metricTooltip.offsetHeight;
    const gap = 9;
    const left = Math.min(Math.max(12, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 12);
    const fitsBelow = rect.bottom + gap + height <= window.innerHeight - 12;
    const top = fitsBelow ? rect.bottom + gap : Math.max(12, rect.top - height - gap);
    metricTooltip.style.left = `${left}px`;
    metricTooltip.style.top = `${top}px`;
    metricTooltip.dataset.placement = fitsBelow ? "bottom" : "top";
  }

  function showMetricTooltip(button, pin = false) {
    const info = METRIC_INFO[button.dataset.metricInfo];
    if (!info || !metricTooltip) return;
    if (pin) pinnedInfoButton = button;
    $$(".metric-info-button.is-active").forEach(item => {
      if (item !== button) {
        item.classList.remove("is-active");
        item.setAttribute("aria-expanded", "false");
        item.removeAttribute("aria-describedby");
      }
    });
    const basisLabel = info.formula ? "산출식" : "집계 기준";
    const basisText = info.formula || info.basis;
    metricTooltip.innerHTML = `<strong>${safe(info.title)}</strong><dl><div><dt>정의</dt><dd>${safe(info.definition)}</dd></div><div><dt>${basisLabel}</dt><dd>${safe(basisText)}</dd></div><div><dt>활용</dt><dd>${safe(info.usage)}</dd></div></dl>`;
    metricTooltip.hidden = false;
    metricTooltip.style.visibility = "hidden";
    positionMetricTooltip(button);
    metricTooltip.style.visibility = "visible";
    button.classList.add("is-active");
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-describedby", metricTooltip.id);
  }

  function hideMetricTooltip(force = false) {
    if (!metricTooltip || (pinnedInfoButton && !force)) return;
    $$(".metric-info-button.is-active").forEach(item => {
      item.classList.remove("is-active");
      item.setAttribute("aria-expanded", "false");
      item.removeAttribute("aria-describedby");
    });
    metricTooltip.hidden = true;
    if (force) pinnedInfoButton = null;
  }

  function applyFilters() {
    const start = $("#statsStartDate").value;
    const end = $("#statsEndDate").value;
    if (!start || !end || start > end) {
      showPrototypeToast("조회 기간을 확인해주세요.");
      return;
    }
    $("#statsResultRange").textContent = `${start.replaceAll("-", ".")} ~ ${end.replaceAll("-", ".")}`;
    $("#statsResultFilter").textContent = `${selectedText("#statsMemberFilter")} · ${selectedText("#statsSectionFilter")} · ${selectedText("#statsTypeFilter")}`;
    showPrototypeToast("프로토타입 조회 조건을 적용했습니다. 실제 데이터 재조회는 API 연동 후 동작합니다.");
  }

  function bindEvents() {
    $$('[data-stats-range]').forEach(button => button.addEventListener("click", () => setRange(button.dataset.statsRange)));
    $("#statsSearchBtn").addEventListener("click", applyFilters);
    $$('[data-stats-granularity]').forEach(button => button.addEventListener("click", () => {
      $$('[data-stats-granularity]').forEach(item => item.classList.toggle("active", item === button));
      renderTrend(button.dataset.statsGranularity);
    }));
    document.addEventListener("mouseover", event => {
      const infoButton = event.target.closest?.("[data-metric-info]");
      if (infoButton && !pinnedInfoButton) showMetricTooltip(infoButton);
    });
    document.addEventListener("mouseout", event => {
      const infoButton = event.target.closest?.("[data-metric-info]");
      if (infoButton && !pinnedInfoButton && !infoButton.contains(event.relatedTarget)) hideMetricTooltip();
    });
    document.addEventListener("focusin", event => {
      const infoButton = event.target.closest?.("[data-metric-info]");
      if (infoButton && !pinnedInfoButton) showMetricTooltip(infoButton);
    });
    document.addEventListener("focusout", event => {
      const infoButton = event.target.closest?.("[data-metric-info]");
      if (infoButton && !pinnedInfoButton) hideMetricTooltip();
    });
    document.addEventListener("click", event => {
      const infoButton = event.target.closest?.("[data-metric-info]");
      if (infoButton) {
        event.preventDefault();
        if (pinnedInfoButton === infoButton) hideMetricTooltip(true);
        else showMetricTooltip(infoButton, true);
        return;
      }
      if (pinnedInfoButton) hideMetricTooltip(true);
      const contentButton = event.target.closest("[data-stats-content]");
      if (contentButton) openDetail(prototypeData.popular.find(item => item.id === contentButton.dataset.statsContent));
    });
    $("#statsDetailClose").addEventListener("click", closeDetail);
    $("#statsDetailConfirm").addEventListener("click", closeDetail);
    $("#statsDetailBackdrop").addEventListener("click", event => { if (event.target.id === "statsDetailBackdrop") closeDetail(); });
    $("#statsDataInfoBtn").addEventListener("click", () => $("#statsConversion").scrollIntoView({ behavior: "smooth", block: "start" }));
    $$('[data-stats-anchor]').forEach(button => button.addEventListener("click", () => {
      $$('[data-stats-anchor]').forEach(item => item.classList.toggle("active", item === button));
      $(`#${button.dataset.statsAnchor}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    window.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      if (pinnedInfoButton) hideMetricTooltip(true);
      if ($("#statsDetailBackdrop").classList.contains("open")) closeDetail();
    });
    window.addEventListener("resize", () => hideMetricTooltip(true));
    window.addEventListener("scroll", () => hideMetricTooltip(true), { passive: true });
  }

  function init() {
    createMetricTooltip();
    setRange("30d");
    renderKpis();
    renderTrend("day");
    renderPopular();
    renderSections();
    renderFunnel();
    renderContribution();
    bindEvents();
  }

  window.MEMBERSHIP_STATS_PROTOTYPE = Object.freeze({
    dataSource: DATA_SOURCE,
    paymentConnection: PAYMENT_CONNECTION,
    eventSchema: EVENT_SCHEMA,
    metricInfo: METRIC_INFO
  });

  init();
})();
