(function(){
  "use strict";

  var TYPE_CLASSES = ["mk-content-type-video", "mk-content-type-download", "mk-content-type-slide"];

  function simpleHash(str){
    var h = 0;
    for(var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function explicitType(node){
    var value = [
      node.getAttribute("data-content-type"),
      node.getAttribute("data-material-type"),
      node.getAttribute("data-type")
    ].filter(Boolean).join(" ").toLowerCase();
    if(value.indexOf("slide") !== -1 || value.indexOf("슬라이드") !== -1) return "slide";
    if(value.indexOf("video") !== -1 || value.indexOf("영상") !== -1) return "video";
    if(value.indexOf("worksheet") !== -1 || value.indexOf("download") !== -1 || value.indexOf("활동지") !== -1) return "download";
    return "";
  }

  function resolveType(node, id){
    var declared = explicitType(node);
    if(declared) return declared;
    // Prototype content registry: st-32 is the slide example and st-15 is
    // the confirmed video example. Future data-* type values take priority.
    if(id === "st-32") return "slide";
    if(id === "st-15") return "video";
    return simpleHash(id) % 2 === 0 ? "video" : "download";
  }

  function applyTypeIcons(){
    var nodes = document.querySelectorAll("[data-mkt]");
    for(var i = 0; i < nodes.length; i++){
      var node = nodes[i];
      var id = node.getAttribute("data-mkt") || "";
      if(!id || id.indexOf("{{") !== -1) continue;
      var chip = node.querySelector(":scope > .mk-typechip");
      if(!chip) continue;
      var type = resolveType(node, id);
      node.classList.remove.apply(node.classList, TYPE_CLASSES);
      node.classList.add("mk-content-type-" + type);
      var label = type === "slide" ? "슬라이드" : (type === "video" ? "영상" : "다운로드 자료");
      chip.setAttribute("title", label);
      chip.setAttribute("aria-label", label);
    }
  }

  var style = document.createElement("style");
  style.textContent =
    "[data-mkt].mk-content-type-video>.mk-typechip," +
    "[data-mkt].mk-content-type-download>.mk-typechip," +
    "[data-mkt].mk-content-type-slide>.mk-typechip{font-size:0!important}" +
    "[data-mkt]>.mk-typechip:before{content:'';display:block;width:16px;height:16px;background-position:center;background-repeat:no-repeat;background-size:contain}" +
    "[data-mkt].mk-content-type-video>.mk-typechip:before{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'%3E%3Cpath fill='%23fff' d='M4 2.8v12.4L15 9z'/%3E%3C/svg%3E\")}" +
    "[data-mkt].mk-content-type-download>.mk-typechip:before{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'%3E%3Cpath fill='none' stroke='%23fff' stroke-width='1.6' stroke-linejoin='round' d='M4 2.5h6l4 4v9H4zM10 2.5v4h4M6.5 10h5M6.5 12.8h5'/%3E%3C/svg%3E\")}" +
    "[data-mkt].mk-content-type-slide>.mk-typechip:before{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'%3E%3Cg fill='none' stroke='%23fff' stroke-width='1.5' stroke-linejoin='round'%3E%3Crect x='2.5' y='4.5' width='11' height='8.5' rx='1'/%3E%3Cpath d='M5 2.5h10.5v8M5.5 8h5M5.5 10.5h3.5'/%3E%3C/g%3E%3C/svg%3E\")}";
  document.head.appendChild(style);

  var scheduled = false;
  function schedule(){
    if(scheduled) return;
    scheduled = true;
    window.setTimeout(function(){ scheduled = false; applyTypeIcons(); }, 0);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule);
  else schedule();
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
})();
