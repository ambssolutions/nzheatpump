/* NZ Heat Pump Services: shared behaviour. Loaded with defer after business.js.
   1. Facts: fill [data-fact] from SITE and show [data-need] blocks only when SITE has the value.
   2. Header: solid on scroll, phone menu, light/dark switch (remembered as nzhp-theme).
   3. Phone quick bar: hidden while the hero is on screen.
   4. Accordions: slow grid-rows fold, aria-expanded.
   5. Services showcase: story bars, autoplay with pause, swipe and arrow keys; pauses off screen.
   6. Sizing demo: too small vs sized right.
   7. Enquiry forms: validation, honeypot, endpoint or mailto, honest status; town prefilled from the map.
   8. Reveals: .rv, .draw, .map, .wipe get .in on entering the screen. Content shows without JS. */
(function () {
  var SITE = window.SITE || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  function has(v) { return v != null && v !== "" && !(Array.isArray(v) && !v.length); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }

  // 1. facts
  $$("[data-fact]").forEach(function (el) {
    var k = el.getAttribute("data-fact"), v = SITE[k];
    if (!has(v)) return;
    el.textContent = v;
    if (k === "phone" && SITE.phoneTel && el.tagName === "A") el.href = "tel:" + SITE.phoneTel;
    if (k === "email" && el.tagName === "A") el.href = "mailto:" + v;
    if (k === "address" && el.tagName === "A") el.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(v);
  });
  $$("[data-href=tel]").forEach(function (el) { if (SITE.phoneTel) el.href = "tel:" + SITE.phoneTel; });
  $$("[data-need]").forEach(function (el) {
    if (el.getAttribute("data-need").split(/\s+/).every(function (k) { return has(SITE[k]); })) el.classList.add("has");
  });
  var rl = document.getElementById("review-list");
  if (rl && has(SITE.reviews)) SITE.reviews.slice(0, 2).forEach(function (r) {
    var q = document.createElement("blockquote"), p = document.createElement("p"), c = document.createElement("cite");
    p.textContent = r.text; c.textContent = r.name; q.appendChild(p); q.appendChild(c); rl.appendChild(q);
  });

  var bl = document.getElementById("brand-list");
  if (bl && has(SITE.brands)) SITE.brands.forEach(function (n) { var li = document.createElement("li"); li.textContent = n; bl.appendChild(li); });

  // 2. header, menu, theme
  var hdr = document.querySelector(".hdr"), btn = document.querySelector(".menu-btn");
  function onScroll() { if (hdr) hdr.classList.toggle("solid", scrollY > 40); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open)); hdr.classList.toggle("open", open);
    });
    $$(".nav a").forEach(function (a) { a.addEventListener("click", function () { btn.setAttribute("aria-expanded", "false"); hdr.classList.remove("open"); }); });
    addEventListener("keydown", function (e) { if (e.key === "Escape" && hdr.classList.contains("open")) { btn.click(); btn.focus(); } });
  }
  var tbs = $$(".theme-btn");
  function syncTheme() {
    var dark = root.getAttribute("data-theme") === "dark";
    tbs.forEach(function (b) { b.setAttribute("aria-pressed", String(dark)); if (b.classList.contains("in-nav")) b.textContent = dark ? "Light mode" : "Dark mode"; });
  }
  tbs.forEach(function (tb) {
    tb.addEventListener("click", function () {
      var t = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", t); syncTheme();
      try { localStorage.setItem("nzhp-theme", t); } catch (e) {}
    });
  });
  syncTheme();

  // 3. quick bar
  var bar = document.querySelector(".qbar"), hero = document.querySelector(".hero, .phero");
  if (bar && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { bar.classList.toggle("show", !es[0].isIntersecting); }).observe(hero);
  } else if (bar) bar.classList.add("show");

  // 4. accordions
  $$(".acc-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", String(open)); b.closest(".acc-item").classList.toggle("open", open);
    });
  });

  // 5. services showcase
  var show = document.querySelector(".show[aria-roledescription=carousel]");
  if (show) {
    var slides = $$(".slide", show), bars = $$(".bar", show), count = show.querySelector(".count"),
        tog = show.querySelector(".toggle"), cur = 0, userPaused = false, n = slides.length;
    function pad(i) { return (i < 9 ? "0" : "") + (i + 1); }
    function go(i, focus) {
      cur = (i + n) % n;
      slides.forEach(function (s, k) { s.classList.toggle("on", k === cur); s.setAttribute("aria-hidden", String(k !== cur)); s.inert = k !== cur; });
      bars.forEach(function (b, k) {
        b.classList.toggle("done", k < cur);
        if (k === cur) { b.setAttribute("aria-current", "true"); var f = b.querySelector("b"); f.style.animation = "none"; void f.offsetWidth; f.style.animation = ""; }
        else b.removeAttribute("aria-current");
      });
      if (count) count.textContent = pad(cur) + " / " + pad(n - 1);
      if (focus) slides[cur].querySelector("h3").focus({ preventScroll: true });
    }
    function setPaused(p) { show.classList.toggle("paused", p); if (tog) tog.setAttribute("aria-label", p ? "Play the slideshow" : "Pause the slideshow"); }
    if (reduced) { show.classList.add("static"); userPaused = true; if (tog) tog.hidden = true; }
    bars.forEach(function (b, k) {
      b.addEventListener("click", function () { go(k); });
      b.querySelector("b").addEventListener("animationend", function () { if (k === cur) go(cur + 1); });
    });
    show.querySelector(".prev").addEventListener("click", function () { go(cur - 1); });
    show.querySelector(".next").addEventListener("click", function () { go(cur + 1); });
    if (tog) tog.addEventListener("click", function () { userPaused = !userPaused; setPaused(userPaused); });
    show.addEventListener("mouseenter", function () { setPaused(true); });
    show.addEventListener("mouseleave", function () { setPaused(userPaused); });
    show.addEventListener("focusin", function () { setPaused(true); });
    show.addEventListener("focusout", function (e) { if (!show.contains(e.relatedTarget)) setPaused(userPaused); });
    var stage = show.querySelector(".stage"), x0 = null;
    stage.addEventListener("pointerdown", function (e) { x0 = e.clientX; });
    stage.addEventListener("pointerup", function (e) { if (x0 == null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); });
    stage.setAttribute("tabindex", "0");
    stage.setAttribute("aria-label", "Service slides. Use the left and right arrow keys to move between them.");
    stage.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1); });
    $$("[data-go]").forEach(function (a) { a.addEventListener("click", function () { go(+a.getAttribute("data-go")); }); });
    $$(".slide h3", show).forEach(function (h) { h.setAttribute("tabindex", "-1"); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) {
      var off = !es[0].isIntersecting; show.classList.toggle("offscreen", off); setPaused(off || userPaused);
    }, { threshold: .25 }).observe(show);
    go(0);
  }

  // 6. sizing demo: plays once on its own when it comes into view, then the visitor can switch
  var room = document.getElementById("room"), say = document.getElementById("say"), touched = false;
  var SAY = {
    small: ["Too small", "The unit runs flat out to keep up. Warm air stays near the heat pump, while the window side of the room stays cold. It is noisier and works harder than it should.",
      "A room with a heat pump that is too small: warm air stays near the unit and the window side stays cold"],
    ok: ["Sized right", "The unit reaches the set temperature, then eases back. Warmth spreads across the whole room, right to the window side, and it runs quietly.",
      "A room with a heat pump sized right: warmth fills the whole room, including the window side"]
  };
  function setSize(k) {
    room.classList.toggle("ok", k === "ok");
    room.setAttribute("aria-label", SAY[k][2]);
    say.innerHTML = "<strong>" + SAY[k][0] + "</strong>" + SAY[k][1];
    $$("[data-size]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.size === k)); });
  }
  if (room) {
    $$("[data-size]").forEach(function (b) { b.addEventListener("click", function () { touched = true; setSize(b.dataset.size); }); });
    if ("IntersectionObserver" in window && !reduced) {
      var dio = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { dio.disconnect(); setTimeout(function () { if (!touched) setSize("ok"); }, 2400); }
      }, { threshold: .5 });
      dio.observe(room);
    }
  }

  // 6b. rough sizing guide: area x watts per m2 x ceiling x location, shown as a range rounded to 0.5 kW
  var sz = document.getElementById("sizer");
  if (sz) {
    var area = document.getElementById("sz-area"), aout = document.getElementById("sz-area-out"),
        lo = document.getElementById("sz-lo"), hi = document.getElementById("sz-hi"),
        arc = document.getElementById("sz-arc"), needle = document.getElementById("sz-needle");
    function val(n) { var c = sz.querySelector('input[name="' + n + '"]:checked'); return c ? +c.value : 1; }
    function r5(x) { return Math.max(2, Math.round(x * 2) / 2); }
    function calc() {
      var kw = +area.value * val("sz-ins") * val("sz-ceil") * val("sz-loc") / 1000, a = r5(kw * .9), b = r5(kw * 1.1);
      if (b <= a) b = a + .5;
      aout.textContent = area.value + " m²"; lo.textContent = a.toFixed(1); hi.textContent = b.toFixed(1);
      var f = Math.min(1, Math.max(0, (kw - 2) / 12));
      arc.setAttribute("stroke-dashoffset", String(100 - f * 100));
      needle.style.transform = "rotate(" + (-90 + f * 180) + "deg)";
    }
    sz.addEventListener("input", calc); calc();
  }

  // 7. forms
  var town = document.getElementById("town"), qt = new URLSearchParams(location.search).get("town");
  if (town && qt) town.value = qt.slice(0, 60);
  var EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  $$("form[data-enquiry]").forEach(function (f) {
    f.setAttribute("novalidate", "");
    var status = f.querySelector(".form-status");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = null;
      [].forEach.call(f.elements, function (el) {
        if (!el.name || el.type === "hidden" || el.closest("[data-hp]")) return;
        var v = (el.value || "").trim(), wrong = (el.required && !v) || (el.type === "email" && v && !EMAIL.test(v));
        el.setAttribute("aria-invalid", wrong ? "true" : "false"); if (wrong && !bad) bad = el;
      });
      if (bad) { bad.focus(); status.textContent = "Please check the highlighted fields."; return; }
      var hp = f.querySelector("[data-hp] input"); if (hp && hp.value) { done(); return; }
      var data = {}; new FormData(f).forEach(function (v, k) { if (!(hp && k === hp.name)) data[k] = v; });
      data.page = location.href; data.subject = "Website enquiry" + (data.name ? " from " + data.name : "");
      if (!SITE.formEndpoint) {
        if (!SITE.email) { status.textContent = "This form isn't connected yet, so nothing was sent. It goes live before launch."; return; }
        var body = Object.keys(data).filter(function (k) { return k !== "subject"; }).map(function (k) { return k + ": " + data[k]; }).join("\n");
        location.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent(data.subject) + "&body=" + encodeURIComponent(body);
        status.textContent = "Your email app should open with your message ready to send.";
        return;
      }
      if (SITE.web3formsKey) data.access_key = SITE.web3formsKey;
      var sb = f.querySelector("[type=submit]"); sb.disabled = true; status.textContent = "Sending…";
      fetch(SITE.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw 0; done(); })
        .catch(function () { status.textContent = "Sorry, that didn't send. Please try again in a moment."; sb.disabled = false; });
    });
    function done() { f.reset(); status.textContent = "Thanks. We have your message and will be in touch."; }
  });

  // 8. reveals
  var els = $$(".rv, .draw, .map, .wipe");
  if (reduced || !("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  els.forEach(function (el) { io.observe(el); });
})();
