/* Concept review bar: switch between the five homepage concepts, and preview the open concept at
   tablet and phone size on a laptop. A review tool for the client, not part of the site; remove at launch.
   Inside the preview frame it does nothing, so the framed page shows exactly as on a real device. */
(function () {
  if (window.self !== window.top) return;
  var CONCEPTS = [
    ["01-thermal", "Thermal"], ["02-comfort-dial", "Comfort Dial"], ["03-blueprint", "Blueprint"],
    ["04-live-wire", "Live Wire"], ["05-seasons", "Seasons"]
  ];
  var DEVICES = { tablet: [820, 1180, "Tablet"], phone: [390, 844, "Phone"] };
  var m = location.pathname.match(/designs\/([^/]+)\//);
  if (!m) return;
  var cur = -1;
  CONCEPTS.forEach(function (c, i) { if (c[0] === m[1]) cur = i; });
  if (cur < 0) return;
  var base = location.pathname.slice(0, location.pathname.indexOf("designs/"));
  function href(i, dev) { return base + "designs/" + CONCEPTS[i][0] + "/" + (dev ? "#preview=" + dev : ""); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  var css = [
    ".rvb{position:fixed;left:16px;bottom:16px;z-index:9000;display:flex;align-items:center;gap:4px;padding:5px;border-radius:14px;background:#14161c;color:#f3f3f6;font:500 14px/1 system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 10px 30px -12px rgba(0,0,0,.6);transition:transform .6s cubic-bezier(.2,.7,.2,1)}",
    ".rvb *{box-sizing:border-box}",
    ".rvb a,.rvb button,.rvb summary{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-width:40px;min-height:40px;padding:0 12px;border:0;border-radius:10px;background:transparent;color:inherit;font:inherit;text-decoration:none;cursor:pointer;white-space:nowrap}",
    ".rvb a:hover,.rvb button:hover,.rvb summary:hover{background:rgba(255,255,255,.1)}",
    ".rvb :focus-visible{outline:2px solid #ffb070;outline-offset:2px}",
    ".rvb .sep{width:1px;align-self:stretch;margin:6px 2px;background:rgba(255,255,255,.18)}",
    ".rvb .nm b{font-weight:700;color:#ffb070}",
    ".rvb details{position:relative}",
    ".rvb summary{list-style:none}.rvb summary::-webkit-details-marker{display:none}",
    ".rvb summary::after{content:'';width:7px;height:7px;border:solid currentColor;border-width:0 2px 2px 0;transform:translateY(-2px) rotate(45deg);opacity:.7}",
    ".rvb .menu{position:absolute;left:0;bottom:calc(100% + 10px);min-width:230px;padding:6px;border-radius:12px;background:#14161c;box-shadow:0 18px 40px -16px rgba(0,0,0,.7)}",
    ".rvb .menu a{display:flex;justify-content:flex-start;width:100%}",
    ".rvb .menu a[aria-current]{background:rgba(255,176,112,.16);color:#ffb070}",
    ".rvb .dev[aria-pressed=true]{background:#f3f3f6;color:#14161c}",
    ".rvb .devs{display:flex;gap:2px}",
    "@media (max-width:1099px){.rvb .devs,.rvb .sep.d{display:none}}",
    "@media (max-width:760px){.rvb{bottom:calc(84px + env(safe-area-inset-bottom));left:10px}.rvb .nm span,.rvb .all span{display:none}}",
    ".rvs{position:fixed;inset:0;z-index:8999;display:none;align-items:center;justify-content:center;background:#0b0c10}",
    ".rvs.open{display:flex}",
    ".rvs .dev-box{position:relative;border-radius:34px;background:#000;box-shadow:0 0 0 2px #2a2d36,0 40px 80px -30px rgba(0,0,0,.8);padding:14px;transform-origin:center}",
    ".rvs iframe{display:block;border:0;border-radius:22px;background:#fff}",
    ".rvs .cap{position:absolute;top:14px;left:50%;transform:translateX(-50%);color:#9aa0ad;font:500 13px/1 system-ui,sans-serif;letter-spacing:.06em}",
    "html.rvs-lock,html.rvs-lock body{overflow:hidden}",
    ".rvb.away{transform:translateY(calc(100% + 24px))}",
    "@media (prefers-reduced-motion:reduce){.rvb{transition:none}}"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var prev = (cur + CONCEPTS.length - 1) % CONCEPTS.length, next = (cur + 1) % CONCEPTS.length;
  var bar = document.createElement("nav");
  bar.className = "rvb"; bar.setAttribute("aria-label", "Concept review");
  bar.innerHTML =
    '<a class="pv" aria-label="Previous concept, ' + CONCEPTS[prev][1] + '">&#8592;</a>' +
    '<details><summary class="nm"><b>' + pad(cur + 1) + '</b><span>' + CONCEPTS[cur][1] + '</span></summary><div class="menu">' +
    CONCEPTS.map(function (c, i) { return '<a data-i="' + i + '"' + (i === cur ? ' aria-current="page"' : "") + '><b>' + pad(i + 1) + '</b>' + c[1] + '</a>'; }).join("") +
    '</div></details>' +
    '<a class="nx" aria-label="Next concept, ' + CONCEPTS[next][1] + '">&#8594;</a>' +
    '<span class="sep" aria-hidden="true"></span>' +
    '<a class="all" href="' + base + '" aria-label="All concepts">&#9638;<span>All concepts</span></a>' +
    '<span class="sep d" aria-hidden="true"></span>' +
    '<span class="devs" role="group" aria-label="Preview size">' +
    '<button class="dev" type="button" data-d="desktop" aria-pressed="true">Desktop</button>' +
    '<button class="dev" type="button" data-d="tablet" aria-pressed="false">Tablet</button>' +
    '<button class="dev" type="button" data-d="phone" aria-pressed="false">Phone</button></span>';
  document.body.appendChild(bar);

  // the preview stage: the same page in a frame at the device's real width, scaled to fit the laptop screen
  var stage = document.createElement("div");
  stage.className = "rvs"; stage.setAttribute("role", "dialog"); stage.setAttribute("aria-modal", "true");
  stage.innerHTML = '<span class="cap"></span><div class="dev-box"><iframe></iframe></div>';
  document.body.appendChild(stage);
  var box = stage.querySelector(".dev-box"), frame = stage.querySelector("iframe"), cap = stage.querySelector(".cap");
  var mode = "desktop";

  function link(el, i) { el.href = href(i, mode === "desktop" ? "" : mode); }
  function relink() {
    link(bar.querySelector(".pv"), prev); link(bar.querySelector(".nx"), next);
    [].forEach.call(bar.querySelectorAll(".menu a"), function (a) { link(a, +a.getAttribute("data-i")); });
  }
  function fit() {
    if (mode === "desktop") return;
    var d = DEVICES[mode], w = d[0] + 28, h = d[1] + 28;
    var s = Math.min(1, (innerHeight - 110) / h, (innerWidth - 60) / w);
    box.style.transform = "scale(" + s + ")";
  }
  function setMode(d) {
    if (d !== "desktop" && innerWidth < 1100) d = "desktop";
    mode = d;
    [].forEach.call(bar.querySelectorAll(".dev"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-d") === d)); });
    if (d === "desktop") {
      stage.classList.remove("open"); document.documentElement.classList.remove("rvs-lock"); frame.removeAttribute("src");
      if (location.hash.indexOf("#preview=") === 0) history.replaceState(null, "", location.pathname + location.search);
    } else {
      var dv = DEVICES[d];
      frame.width = dv[0]; frame.height = dv[1]; frame.title = CONCEPTS[cur][1] + " at " + dv[2].toLowerCase() + " size";
      stage.setAttribute("aria-label", dv[2] + " preview, " + dv[0] + " by " + dv[1]);
      cap.textContent = dv[2].toUpperCase() + "  " + dv[0] + " × " + dv[1];
      var src = location.pathname + location.search;
      if (frame.getAttribute("src") !== src) frame.setAttribute("src", src);
      stage.classList.add("open"); document.documentElement.classList.add("rvs-lock");
      history.replaceState(null, "", location.pathname + location.search + "#preview=" + d);
      fit();
    }
    relink();
  }
  [].forEach.call(bar.querySelectorAll(".dev"), function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-d")); }); });
  addEventListener("resize", function () { if (mode !== "desktop" && innerWidth < 1100) setMode("desktop"); else fit(); });
  addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (mode !== "desktop") setMode("desktop"); var dt = bar.querySelector("details"); if (dt.open) dt.open = false; }
  });
  document.addEventListener("click", function (e) { var dt = bar.querySelector("details"); if (dt.open && !dt.contains(e.target)) dt.open = false; });
  // sit above anything the page pins to the bottom edge (Live Wire's service rail) while it is in view
  var rail = document.querySelector(".rail");
  function lift() {
    var b = 16;
    if (rail && innerWidth > 760) { var r = rail.getBoundingClientRect(); if (r.height && r.top < innerHeight && r.bottom > innerHeight - 4) b = innerHeight - r.top + 12; }
    bar.style.bottom = innerWidth > 760 ? b + "px" : "";
  }
  lift(); addEventListener("resize", lift); [600, 1600, 3200].forEach(function (t) { setTimeout(lift, t); });
  // slide away while scrolling down to read, come back on the way up
  var lastY = scrollY, ticking = false;
  addEventListener("scroll", function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var y = scrollY, dt = bar.querySelector("details");
      if (!dt.open && !bar.contains(document.activeElement)) bar.classList.toggle("away", y > lastY && y > 200);
      lift(); lastY = y; ticking = false;
    });
  }, { passive: true });
  bar.addEventListener("focusin", function () { bar.classList.remove("away"); });
  var h = location.hash.match(/^#preview=(tablet|phone)$/);
  setMode(h ? h[1] : "desktop");
})();
