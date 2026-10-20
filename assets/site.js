/* NZ Heat Pump Services: shared behaviour. Loaded with defer after business.js.
   1. Facts: fill [data-fact] from SITE and show [data-need] blocks only when SITE has the value.
   2. Header: solid on scroll, phone menu.
   3. Phone quick bar: hidden while the hero is on screen.
   4. Accordions: slow grid-rows fold, aria-expanded.
   5. Enquiry forms: validation, honeypot, endpoint or mailto, honest status.
   6. Sizing demo: too small vs sized right.
   7. Reveals: .rv, .draw, .map and .wipe get .in on entering the screen. Content shows without JS. */
(function () {
  var SITE = window.SITE || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function has(v) { return v != null && v !== "" && !(Array.isArray(v) && !v.length); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }

  // 1. facts
  $$("[data-fact]").forEach(function (el) {
    var k = el.getAttribute("data-fact"), v = SITE[k];
    if (!has(v)) return;
    el.textContent = v;
    if (k === "phone" && SITE.phoneTel) el.href = "tel:" + SITE.phoneTel;
    if (k === "email") el.href = "mailto:" + v;
    if (k === "address") el.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(v);
  });
  $$("[data-href=tel]").forEach(function (el) { if (SITE.phoneTel) el.href = "tel:" + SITE.phoneTel; });
  $$("[data-need]").forEach(function (el) {
    if (el.getAttribute("data-need").split(/\s+/).every(function (k) { return has(SITE[k]); })) el.classList.add("has");
  });
  var rv = document.getElementById("review-list");
  if (rv && has(SITE.reviews)) SITE.reviews.slice(0, 2).forEach(function (r) {
    var q = document.createElement("blockquote"), p = document.createElement("p"), c = document.createElement("cite");
    p.textContent = r.text; c.textContent = r.name; q.appendChild(p); q.appendChild(c); rv.appendChild(q);
  });

  // 2. header
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

  // 5. forms
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

  // 7. reveals
  var els = $$(".rv, .draw, .map, .wipe");
  if (reduced || !("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  els.forEach(function (el) { io.observe(el); });
})();
