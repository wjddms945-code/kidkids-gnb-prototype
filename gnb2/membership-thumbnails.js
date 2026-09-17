(function () {
  "use strict";

  var ATTR = "data-mkt";
  var TEXT_ATTR = "data-mktxt";
  var config = window.KIDKIDS_SUPABASE || {};
  var client = null;
  var remoteThumbnails = {};
  var textCache = {};
  var editing = false;
  var busy = false;
  var pendingRawKey = null;
  var setEditingMode = function () {};
  var OAUTH_EDIT_KEY = "kidkids-membership-thumbnail-oauth-edit";

  var CONTENT_KEY_OVERRIDES = {
    "st-0": "dal-tokki-rice-cake",
    "st-1": "chuseok-all-in-one",
    "st-2": "sensory-performance",
    "st-3": "cinema-car-theater",
    "st-4": "physical-fitness-test"
  };

  function hashString(value) {
    var hash = 2166136261;
    for (var i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function contentKey(rawKey) {
    var raw = String(rawKey || "").trim();
    if (!raw) return "";
    if (CONTENT_KEY_OVERRIDES[raw]) return CONTENT_KEY_OVERRIDES[raw];
    if (raw.indexOf("membership-") === 0) return raw;
    if (/^[a-z0-9][a-z0-9_-]*$/i.test(raw)) {
      return "membership-" + raw.toLowerCase().replace(/_/g, "-");
    }
    return "membership-id-" + hashString(raw);
  }

  function isConfigured() {
    return Boolean(
      config.url && config.publishableKey && config.storageBucket &&
      config.thumbnailsTable && config.textsTable && config.adminCheckFunction &&
      config.oauthRedirectTo && window.supabase &&
      typeof window.supabase.createClient === "function"
    );
  }

  function createSupabaseClient() {
    if (!isConfigured()) return null;
    return window.supabase.createClient(config.url, config.publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  async function loadRemoteText() {
    if (!client) return;
    var response = await client
      .from(config.textsTable)
      .select("text_key,text_value,updated_at");
    if (response.error) throw response.error;
    textCache = {};
    (response.data || []).forEach(function (record) {
      textCache[record.text_key] = record.text_value;
    });
    applyAllText();
  }

  async function saveText(key, value) {
    var user = await requireAdmin();
    var saved = await client.from(config.textsTable).upsert({
      text_key: key,
      text_value: value,
      updated_at: new Date().toISOString(),
      updated_by: user.id
    }, { onConflict: "text_key" }).select("text_key,text_value,updated_at").single();
    if (saved.error) throw saved.error;
    textCache[key] = saved.data.text_value;
    return saved.data;
  }

  async function clearRemoteText() {
    var deleted = await client.from(config.textsTable).delete().like("text_key", "%");
    if (deleted.error) throw deleted.error;
  }

  function applyThumbnail(element) {
    var key = contentKey(element.getAttribute(ATTR));
    if (!key) return;
    var record = remoteThumbnails[key];
    var url = record && record.image_url;

    if (url) {
      if (element.__mkRemoteApplied !== url) {
        element.style.setProperty("background-image", "url('" + url.replace(/'/g, "%27") + "')", "important");
        element.style.setProperty("background-size", "cover", "important");
        element.style.setProperty("background-position", "center", "important");
        element.style.setProperty("background-repeat", "no-repeat", "important");
        element.__mkRemoteApplied = url;
      }
    } else if (element.__mkRemoteApplied) {
      element.style.removeProperty("background-image");
      element.style.removeProperty("background-size");
      element.style.removeProperty("background-position");
      element.style.removeProperty("background-repeat");
      element.__mkRemoteApplied = "";
    }
  }

  function badgeFor(element) {
    var badge = element.__mkBadge;
    if (!badge || badge.parentNode !== element) {
      badge = document.createElement("div");
      badge.className = "mk-thumb-badge";
      if (getComputedStyle(element).position === "static") element.style.position = "relative";
      element.appendChild(badge);
      element.__mkBadge = badge;
    }
    return badge;
  }

  function refreshBadges() {
    var elements = document.querySelectorAll("[" + ATTR + "]");
    for (var i = 0; i < elements.length; i += 1) {
      var element = elements[i];
      var key = contentKey(element.getAttribute(ATTR));
      var badge = badgeFor(element);
      var label = "";
      if (editing) {
        label = busy ? "저장 중..." : (remoteThumbnails[key] ? "✎ 변경 · 우클릭 삭제" : "＋ 이미지 등록");
      }
      if (badge.textContent !== label) badge.textContent = label;
      badge.style.display = editing ? "flex" : "none";
    }
  }

  function applyAllThumbnails() {
    var elements = document.querySelectorAll("[" + ATTR + "]");
    for (var i = 0; i < elements.length; i += 1) applyThumbnail(elements[i]);
    refreshBadges();
  }

  function applyAllText() {
    var elements = document.querySelectorAll("[" + TEXT_ATTR + "]");
    for (var i = 0; i < elements.length; i += 1) {
      var element = elements[i];
      var value = textCache[element.getAttribute(TEXT_ATTR)];
      if (value != null && document.activeElement !== element && element.__mkTextApplied !== value) {
        element.textContent = value;
        element.__mkTextApplied = value;
      }
    }
  }

  function refreshTextEditable() {
    var elements = document.querySelectorAll("[" + TEXT_ATTR + "]");
    for (var i = 0; i < elements.length; i += 1) {
      elements[i].contentEditable = editing ? "true" : "false";
    }
  }

  async function loadRemoteThumbnails() {
    if (!client) return;
    var response = await client
      .from(config.thumbnailsTable)
      .select("content_key,image_url,storage_path,updated_at");
    if (response.error) throw response.error;

    remoteThumbnails = {};
    (response.data || []).forEach(function (record) {
      remoteThumbnails[record.content_key] = record;
    });
    applyAllThumbnails();
  }

  function requestGoogleLogin() {
    return new Promise(function (resolve, reject) {
      var overlay = document.createElement("div");
      overlay.className = "mk-auth-overlay";
      overlay.innerHTML =
        '<div class="mk-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="mk-auth-title">' +
          '<strong id="mk-auth-title">썸네일 관리자 로그인</strong>' +
          '<p>등록된 관리자 Google 계정으로 로그인해주세요.</p>' +
          '<button type="button" class="mk-google-login" data-google-login>' +
            '<span class="mk-google-mark" aria-hidden="true">G</span>' +
            '<span>Google 계정으로 로그인</span>' +
          '</button>' +
          '<div><button type="button" data-cancel>취소</button></div>' +
        '</div>';
      document.body.appendChild(overlay);
      var loginButton = overlay.querySelector("[data-google-login]");

      function close() { overlay.remove(); }
      loginButton.addEventListener("click", async function () {
        loginButton.disabled = true;
        loginButton.querySelector("span:last-child").textContent = "Google로 이동 중...";
        sessionStorage.setItem(OAUTH_EDIT_KEY, "1");
        var login = await client.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: config.oauthRedirectTo }
        });
        if (login.error) {
          sessionStorage.removeItem(OAUTH_EDIT_KEY);
          close();
          reject(login.error);
          return;
        }
        resolve();
      });
      overlay.querySelector("[data-cancel]").addEventListener("click", function () {
        close();
        reject(new Error("로그인이 취소되었습니다."));
      });
      loginButton.focus();
    });
  }

  async function isThumbnailAdmin() {
    var result = await client.rpc(config.adminCheckFunction);
    if (result.error) throw result.error;
    return result.data === true;
  }

  async function requireAdmin() {
    if (!client) throw new Error("Supabase 설정을 불러오지 못했습니다.");
    var current = await client.auth.getUser();
    var user = current.data && current.data.user;

    if (!user) {
      await requestGoogleLogin();
      return new Promise(function () {});
    }

    if (!(await isThumbnailAdmin())) {
      await client.auth.signOut();
      throw new Error("이 계정에는 썸네일 편집 권한이 없습니다.");
    }
    return user;
  }

  function fileToThumbnail(file) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.onload = function () {
        URL.revokeObjectURL(image.src);
        var max = 1000;
        var width = image.naturalWidth || 800;
        var height = image.naturalHeight || 800;
        var scale = Math.min(1, max / Math.max(width, height));
        var canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(function (webpBlob) {
          if (webpBlob) return resolve({ blob: webpBlob, extension: "webp" });
          canvas.toBlob(function (jpegBlob) {
            if (jpegBlob) resolve({ blob: jpegBlob, extension: "jpg" });
            else reject(new Error("편집 결과를 이미지로 만들 수 없습니다."));
          }, "image/jpeg", 0.86);
        }, "image/webp", 0.86);
      };
      image.onerror = function () {
        URL.revokeObjectURL(image.src);
        reject(new Error("이미지를 읽을 수 없습니다."));
      };
      image.src = URL.createObjectURL(file);
    });
  }

  async function saveThumbnail(rawKey, prepared) {
    var user = await requireAdmin();
    var key = contentKey(rawKey);
    if (!key) throw new Error("콘텐츠 식별자를 확인할 수 없습니다.");

    var timestamp = Date.now();
    var storagePath = key + "/" + key + "-" + timestamp + "." + prepared.extension;
    var uploaded = await client.storage.from(config.storageBucket).upload(storagePath, prepared.blob, {
      cacheControl: "31536000",
      contentType: prepared.blob.type,
      upsert: false
    });
    if (uploaded.error) throw uploaded.error;

    var publicResult = client.storage.from(config.storageBucket).getPublicUrl(storagePath);
    var publicUrl = publicResult.data && publicResult.data.publicUrl;
    if (!publicUrl) {
      await client.storage.from(config.storageBucket).remove([storagePath]);
      throw new Error("업로드된 이미지 URL을 만들 수 없습니다.");
    }
    publicUrl += (publicUrl.indexOf("?") === -1 ? "?" : "&") + "v=" + timestamp;

    var saved = await client.from(config.thumbnailsTable).upsert({
      content_key: key,
      image_url: publicUrl,
      storage_path: storagePath,
      updated_at: new Date(timestamp).toISOString(),
      updated_by: user.id
    }, { onConflict: "content_key" }).select("content_key,image_url,storage_path,updated_at").single();

    if (saved.error) {
      await client.storage.from(config.storageBucket).remove([storagePath]);
      throw saved.error;
    }
    remoteThumbnails[key] = saved.data;
    applyAllThumbnails();
  }

  async function removeThumbnail(rawKey) {
    await requireAdmin();
    var key = contentKey(rawKey);
    var record = remoteThumbnails[key];
    var removed = await client.from(config.thumbnailsTable).delete().eq("content_key", key);
    if (removed.error) throw removed.error;
    if (record && record.storage_path) {
      var storageResult = await client.storage.from(config.storageBucket).remove([record.storage_path]);
      if (storageResult.error) console.warn("이전 썸네일 파일 정리 실패:", storageResult.error);
    }
    delete remoteThumbnails[key];
    applyAllThumbnails();
  }

  function dataUrlToBlob(dataUrl) {
    var parts = dataUrl.split(",");
    var mime = (parts[0].match(/:(.*?);/) || [null, "image/jpeg"])[1];
    var bytes = atob(parts[1]);
    var array = new Uint8Array(bytes.length);
    for (var i = 0; i < bytes.length; i += 1) array[i] = bytes.charCodeAt(i);
    return new Blob([array], { type: mime });
  }

  function installStyles() {
    var css = document.createElement("style");
    css.textContent =
      ".mk-thumb-badge{position:absolute;left:0;right:0;bottom:0;z-index:9;display:none;align-items:center;justify-content:center;padding:7px 6px;font:700 11px/1.2 'Pretendard',system-ui,sans-serif;color:#fff;text-align:center;background:linear-gradient(180deg,rgba(255,46,99,0),rgba(255,46,99,.94));pointer-events:none;letter-spacing:.02em}" +
      "body.mk-editing [data-mkt]{outline:2px dashed rgba(255,46,99,.85);outline-offset:-2px;cursor:pointer}" +
      "body.mk-editing [data-mkt]:hover{outline-color:#fff}" +
      "body.mk-editing [data-mktxt]{outline:1px dashed rgba(124,196,255,.85);outline-offset:2px;cursor:text;pointer-events:auto}" +
      "body.mk-editing [data-mktxt]:hover{outline-color:#7cc4ff}" +
      "[data-mktxt][contenteditable=\"true\"]:focus{outline:2px solid #7cc4ff!important;outline-offset:2px;background:rgba(124,196,255,.1)}" +
      "body.mk-editing .mk-hov{opacity:1}" +
      ".mk-thumb-fab{position:fixed;right:16px;bottom:74px;z-index:120;display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;max-width:70vw}" +
      ".mk-thumb-fab button{padding:10px 14px;border-radius:100px;border:1px solid rgba(255,255,255,.16);background:rgba(18,18,28,.94);color:#fff;font:700 12.5px 'Pretendard',system-ui,sans-serif;cursor:pointer;backdrop-filter:blur(12px);box-shadow:0 10px 30px rgba(0,0,0,.5)}" +
      ".mk-thumb-fab button.on{background:#ff2e63;border-color:#ff2e63}" +
      ".mk-auth-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(7,7,12,.76);backdrop-filter:blur(8px)}" +
      ".mk-auth-dialog{width:min(390px,100%);display:flex;flex-direction:column;gap:12px;padding:24px;border:1px solid rgba(255,255,255,.13);border-radius:18px;background:#171722;color:#fff;box-shadow:0 24px 80px rgba(0,0,0,.55);font-family:'Pretendard',system-ui,sans-serif}" +
      ".mk-auth-dialog strong{font-size:18px}.mk-auth-dialog p{margin:0 0 4px;color:#aaaabd;font-size:13px;line-height:1.5}" +
      ".mk-auth-dialog div{display:flex;justify-content:flex-end;gap:8px;margin-top:4px}" +
      ".mk-auth-dialog button{padding:9px 14px;border:0;border-radius:8px;background:#30303c;color:#fff;font-weight:700;cursor:pointer}.mk-auth-dialog button:disabled{cursor:wait;opacity:.68}" +
      ".mk-auth-dialog .mk-google-login{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:12px 14px;border:1px solid rgba(255,255,255,.2);background:#fff;color:#202124;font-size:14px}" +
      ".mk-google-mark{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;font:bold 16px Arial,sans-serif;color:#4285f4}";
    document.head.appendChild(css);
  }

  async function resetAll() {
    await requireAdmin();
    var paths = Object.keys(remoteThumbnails).map(function (key) {
      return remoteThumbnails[key] && remoteThumbnails[key].storage_path;
    }).filter(Boolean);
    var deleted = await client.from(config.thumbnailsTable).delete().like("content_key", "%");
    if (deleted.error) throw deleted.error;
    for (var i = 0; i < paths.length; i += 100) {
      var result = await client.storage.from(config.storageBucket).remove(paths.slice(i, i + 100));
      if (result.error) console.warn("썸네일 파일 일괄 정리 실패:", result.error);
    }
    remoteThumbnails = {};
    textCache = {};
    await clearRemoteText();
    location.reload();
  }

  function downloadExport() {
    var payload = {
      version: 2,
      exported_at: new Date().toISOString(),
      thumbnails: remoteThumbnails,
      texts: textCache
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "membership-thumbnails.json";
    document.body.appendChild(anchor);
    anchor.click();
    var objectUrl = anchor.href;
    anchor.remove();
    setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 0);
  }

  function buildControls() {
    var picker = document.createElement("input");
    picker.type = "file";
    picker.accept = "image/*";
    picker.style.display = "none";
    document.body.appendChild(picker);

    var importInput = document.createElement("input");
    importInput.type = "file";
    importInput.accept = "application/json,.json";
    importInput.style.display = "none";
    document.body.appendChild(importInput);

    var fab = document.createElement("div");
    fab.className = "mk-thumb-fab";
    var toggle = document.createElement("button");
    var exportButton = document.createElement("button");
    var importButton = document.createElement("button");
    var resetButton = document.createElement("button");
    toggle.textContent = "🖼✏️ 편집";
    exportButton.textContent = "내보내기";
    importButton.textContent = "가져오기";
    resetButton.textContent = "전체 초기화";
    exportButton.style.display = importButton.style.display = resetButton.style.display = "none";
    fab.appendChild(toggle);
    fab.appendChild(exportButton);
    fab.appendChild(importButton);
    fab.appendChild(resetButton);
    document.body.appendChild(fab);

    setEditingMode = function (enabled) {
      editing = enabled;
      document.body.classList.toggle("mk-editing", editing);
      toggle.classList.toggle("on", editing);
      toggle.textContent = editing ? "✓ 편집 종료" : "🖼✏️ 편집";
      var display = editing ? "block" : "none";
      exportButton.style.display = importButton.style.display = resetButton.style.display = display;
      refreshBadges();
      refreshTextEditable();
    };

    toggle.addEventListener("click", async function () {
      try {
        if (!editing) await requireAdmin();
        setEditingMode(!editing);
      } catch (error) {
        if (error && error.message !== "로그인이 취소되었습니다.") {
          alert("편집 모드 진입 실패: " + (error.message || error));
        }
      }
    });

    picker.addEventListener("change", async function () {
      var file = picker.files && picker.files[0];
      var rawKey = pendingRawKey;
      picker.value = "";
      pendingRawKey = null;
      if (!file || !rawKey) return;
      busy = true;
      refreshBadges();
      try {
        var prepared = await fileToThumbnail(file);
        await saveThumbnail(rawKey, prepared);
        alert("썸네일이 공통 저장소에 저장되었습니다.");
      } catch (error) {
        alert("저장 실패: " + (error.message || error));
      } finally {
        busy = false;
        refreshBadges();
      }
    });

    exportButton.addEventListener("click", downloadExport);
    importButton.addEventListener("click", function () { importInput.click(); });
    importInput.addEventListener("change", function () {
      var file = importInput.files && importInput.files[0];
      importInput.value = "";
      if (!file) return;
      var reader = new FileReader();
      reader.onload = async function () {
        try {
          var parsed = JSON.parse(reader.result);
          var entries = parsed.thumbnails || parsed;
          var keys = Object.keys(entries);
          await requireAdmin();
          for (var i = 0; i < keys.length; i += 1) {
            var rawKey = keys[i];
            var value = entries[rawKey];
            var imageValue = typeof value === "string" ? value : value && value.image_url;
            if (!imageValue || rawKey.indexOf("T:") === 0) continue;
            if (imageValue.indexOf("data:image/") === 0) {
              var blob = dataUrlToBlob(imageValue);
              await saveThumbnail(rawKey, {
                blob: blob,
                extension: blob.type.indexOf("png") >= 0 ? "png" : "jpg"
              });
            }
          }
          var importedTexts = parsed.texts || {};
          var textKeys = Object.keys(importedTexts);
          for (var j = 0; j < textKeys.length; j += 1) {
            await saveText(textKeys[j], String(importedTexts[textKeys[j]]));
          }
          applyAllText();
          alert("가져오기가 완료되었습니다.");
        } catch (error) {
          alert("가져오기 실패: " + (error.message || error));
        }
      };
      reader.readAsText(file);
    });

    resetButton.addEventListener("click", async function () {
      if (!confirm("등록한 모든 썸네일을 삭제하고 기본 이미지로 되돌릴까요?")) return;
      busy = true;
      refreshBadges();
      try { await resetAll(); }
      catch (error) { alert("전체 초기화 실패: " + (error.message || error)); }
      finally { busy = false; refreshBadges(); }
    });

    document.addEventListener("click", function (event) {
      if (!editing || busy) return;
      if (event.target.closest && event.target.closest("[" + TEXT_ATTR + "]")) return;
      var element = event.target.closest && event.target.closest("[" + ATTR + "]");
      if (!element) return;
      event.preventDefault();
      event.stopPropagation();
      pendingRawKey = element.getAttribute(ATTR);
      picker.click();
    }, true);

    document.addEventListener("contextmenu", async function (event) {
      if (!editing || busy) return;
      var element = event.target.closest && event.target.closest("[" + ATTR + "]");
      if (!element) return;
      var rawKey = element.getAttribute(ATTR);
      if (!remoteThumbnails[contentKey(rawKey)]) return;
      event.preventDefault();
      if (!confirm("이 썸네일을 기본 이미지로 되돌릴까요?")) return;
      busy = true;
      refreshBadges();
      try { await removeThumbnail(rawKey); }
      catch (error) { alert("삭제 실패: " + (error.message || error)); }
      finally { busy = false; refreshBadges(); }
    }, true);
  }

  function boot() {
    if (!document.body) return setTimeout(boot, 50);
    installStyles();
    buildControls();

    document.addEventListener("focusout", async function (event) {
      var element = event.target;
      if (!element.getAttribute || element.getAttribute(TEXT_ATTR) == null) return;
      if (element.getAttribute("contenteditable") !== "true") return;
      var cacheKey = element.getAttribute(TEXT_ATTR);
      var value = element.textContent;
      if (textCache[cacheKey] === value) return;
      var previous = textCache[cacheKey];
      try {
        await saveText(cacheKey, value);
        element.__mkTextApplied = value;
      } catch (error) {
        if (previous != null) element.textContent = previous;
        alert("텍스트 저장 실패: " + (error.message || error));
      }
    }, true);

    client = createSupabaseClient();
    if (client) {
      loadRemoteThumbnails().catch(function (error) {
        console.error("Supabase 썸네일 조회 실패:", error);
      });
      loadRemoteText().catch(function (error) {
        console.error("Supabase 텍스트 조회 실패:", error);
      });
      if (sessionStorage.getItem(OAUTH_EDIT_KEY) === "1") {
        sessionStorage.removeItem(OAUTH_EDIT_KEY);
        requireAdmin().then(function () {
          setEditingMode(true);
        }).catch(function (error) {
          alert("편집 모드 진입 실패: " + (error.message || error));
        });
      }
    } else {
      console.error("Supabase 썸네일 설정을 불러오지 못했습니다.");
    }

    applyAllThumbnails();
    applyAllText();
    refreshTextEditable();

    var timer;
    var observer = new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        applyAllThumbnails();
        applyAllText();
      }, 120);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.addEventListener("load", function () {
      applyAllThumbnails();
      applyAllText();
    });
    setTimeout(applyAllThumbnails, 700);
    setTimeout(applyAllThumbnails, 2000);
    setTimeout(applyAllText, 700);
    setTimeout(applyAllText, 2000);
  }

  boot();
})();
