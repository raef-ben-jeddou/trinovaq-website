/* TrinovaQ · v3 · no dependencies */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ── Page load: let the first paint happen, then run the hero intro ── */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add("is-ready"); });
  });

  /* ── Nav ── */
  var nav = $("#nav");
  var toggle = $("#navToggle");

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$("#navLinks a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ── Modes: dark (default), light, and "blueprint" (Hacker mode), which swaps the site for the #lab experience ── */
  var themeButtons = $$("[data-theme-set]");
  var themeMeta = $('meta[name="theme-color"]');
  var paper = { dark: "#0F1838", light: "#FBFBFE", blueprint: "#0B2A5E" };

  function currentTheme() { return root.getAttribute("data-theme") || "dark"; }
  function syncTheme() {
    var now = currentTheme();
    themeButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-theme-set") === now ? "true" : "false");
    });
    if (themeMeta) themeMeta.setAttribute("content", paper[now] || paper.dark);
  }
  function setTheme(t) {
    if (t === "dark") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", t);
    try { localStorage.setItem("tq-theme", t); } catch (e) {}
    syncTheme();
    window.dispatchEvent(new Event("tq:theme"));
  }
  themeButtons.forEach(function (b) {
    b.addEventListener("click", function () { setTheme(b.getAttribute("data-theme-set")); });
  });
  syncTheme();

  /* ── Hacker mode: the visitor breaks into a device from a terminal, then switches sides
        and defends it with the four things TrinovaQ does ── */
  (function () {
    var lab = $("#lab");
    if (!lab) return;

    var head = $("#labTitle"), sub = $("#labSub"), note = $("#labNote"), status = $("#labStatus");
    var seg1 = $("#labSeg1"), seg2 = $("#labSeg2");
    var tag = $("#labTag"), stop = $("#labStop"), stamp = $("#labStamp");
    var term = $("#labTerm"), term2 = $("#labTerm2"), termBox2 = $("#labTermBox2");
    var runBtn = $("#labRun"), result = $("#labResult"), defendBtn = $("#labDefend"), endEl = $("#labEnd");
    var steps = $$(".lab-step", lab);
    var cells = { ts: $("#labTs"), weak: $("#labWeak"), test: $("#labTest"), ev: $("#labEv") };
    var timers = [], route = null, done = 0, cmdAt = 0, busy = false, startedAt = 0;

    /* one entry per way in. The commands are make-believe: they tell the story, they are not real tools. */
    var ROUTES = {
      cellular: {
        from: "modem", to: "act", seg1: "M220 102H250V140H290", seg2: "M470 172H498V192H540", tag: [40, 46],
        cmds: [
          ["connect --via cellular", "connected. no credentials requested"],
          ["send \"open actuator\"", "accepted by the controller"],
          ["status actuator", "actuator moved"]
        ],
        denied: "rejected. authentication required",
        breach: "You moved the actuator from anywhere in the world.",
        tagText: "Threat · risk 5 of 5", ts: "Spoofed command. Risk 5 of 5.",
        weak: "No command authentication", weakShort: "no authentication", test: "Forged command rejected"
      },
      bluetooth: {
        from: "bt", to: "act", seg1: "M220 192H262V172H290", seg2: "M470 172H498V192H540", tag: [40, 138],
        cmds: [
          ["pair --nearby", "paired. the owner was never asked"],
          ["send \"open actuator\"", "accepted by the controller"],
          ["status actuator", "actuator moved"]
        ],
        denied: "refused. pairing must be confirmed on the device",
        breach: "You moved the actuator from the street outside.",
        tagText: "Threat · risk 4 of 5", ts: "Rogue pairing. Risk 4 of 5.",
        weak: "Pairing without confirmation", weakShort: "open pairing", test: "Unconfirmed pairing refused"
      },
      debug: {
        from: "debug", to: "flash", seg1: "M220 282H274V192H290", seg2: "M380 205V250", tag: [40, 228],
        cmds: [
          ["attach --debug-port", "attached. the port was never locked"],
          ["read memory", "the controller handed it over"],
          ["find keys", "device keys copied from flash storage"]
        ],
        denied: "denied. the debug port is locked",
        breach: "You copied the keys that protect every unit.",
        tagText: "Threat · risk 4 of 5", ts: "Key extraction. Risk 4 of 5.",
        weak: "Debug port left open", weakShort: "port left open", test: "Debug access denied"
      }
    };
    var NOTES = [
      "<b>Threat analysis and risk assessment.</b> The path is found on paper, rated, and a control is decided before anyone exploits it.",
      "<b>Vulnerability detection.</b> The weakness that makes the path possible is found in the product and fixed.",
      "<b>Embedded security testing.</b> The real device is attacked again, to confirm that the fix holds.",
      "<b>Compliance and evidence.</b> Each step is linked to the requirement it satisfies, ready for the assessor."
    ];

    function later(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function mod(id) { return $('[data-m="' + id + '"]', lab); }
    function say(title, line) { head.textContent = title; sub.textContent = line; }
    function cell(el, text) { el.textContent = text; el.classList.toggle("empty", text === "—"); }
    function setStatus(text, cls) { status.textContent = text; status.className = "lab-status" + (cls ? " " + cls : ""); }
    function stage(name) {
      lab.setAttribute("data-stage", name);
      $$("[data-panel]", lab).forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== name; });
    }
    function redraw(seg, cls) {                       /* restart a path's animation with a new state */
      seg.classList.remove("go", "plan", "stopped");
      void seg.getBoundingClientRect();
      if (cls) seg.classList.add(cls);
    }
    /* type a command into a terminal, then print the answer */
    function type(box, cmd, answer, answerClass, then) {
      var line = document.createElement("p");
      line.className = "c";
      box.appendChild(line);
      var i = 0;
      (function key() {
        line.textContent = cmd.slice(0, ++i);
        if (i < cmd.length) { later(reduce ? 0 : 30, key); return; }
        later(reduce ? 0 : 340, function () {
          var o = document.createElement("p");
          o.className = "o" + (answerClass ? " " + answerClass : "");
          o.textContent = answer;
          box.appendChild(o);
          if (then) then();
        });
      })();
    }

    function reset() {
      clearTimers();
      route = null; done = 0; cmdAt = 0; busy = false;
      $$(".lab-mod", lab).forEach(function (m) {
        m.classList.remove("is-chosen", "is-hit", "is-weak");
        var s = $(".lab-sub2", m);
        s.textContent = s.getAttribute("data-text");
      });
      [seg1, seg2].forEach(function (s) { redraw(s); s.removeAttribute("d"); });
      [tag, stop, stamp].forEach(function (g) { g.classList.remove("on"); });
      term.innerHTML = ""; term2.innerHTML = ""; termBox2.hidden = true;
      runBtn.hidden = false; runBtn.disabled = false;
      result.textContent = "";
      defendBtn.hidden = true; endEl.hidden = true;
      note.innerHTML = "";
      steps.forEach(function (b, i) {
        b.disabled = i !== 0;
        b.classList.remove("is-done");
        b.classList.toggle("is-next", i === 0);
      });
      cell(cells.ts, "—"); cell(cells.weak, "—"); cell(cells.test, "—"); cell(cells.ev, "—");
      setStatus("Exposed");
      say("Pick your way in.", "This is a connected product, drawn the way its engineers see it. Three interfaces, three ways to break it.");
      stage("pick");
    }

    function attack(key) {
      if (lab.getAttribute("data-stage") !== "pick" || !ROUTES[key]) return;
      route = ROUTES[key];
      mod(route.from).classList.add("is-chosen");
      seg1.setAttribute("d", route.seg1);
      seg2.setAttribute("d", route.seg2);
      startedAt = Date.now();
      setStatus("Under attack");
      say("Now break in.", "Three commands stand between you and this device. Run them and watch the drawing.");
      stage("attack");
      if (runBtn.focus) runBtn.focus({ preventScroll: true });
    }

    function run() {
      if (busy || !route || lab.getAttribute("data-stage") !== "attack" || cmdAt >= route.cmds.length) return;
      busy = true;
      runBtn.disabled = true;
      var c = route.cmds[cmdAt];
      type(term, c[0], c[1], "", function () {
        if (cmdAt === 0) redraw(seg1, "go");
        if (cmdAt === 1) mod("ctrl").classList.add("is-hit");
        if (cmdAt === 2) { redraw(seg2, "go"); later(800, function () { mod(route.to).classList.add("is-hit"); }); }
        cmdAt++;
        busy = false;
        if (cmdAt < route.cmds.length) {
          runBtn.disabled = false;
          if (runBtn.focus) runBtn.focus({ preventScroll: true });
        } else {
          later(1300, breach);
        }
      });
    }

    function breach() {
      var secs = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      runBtn.hidden = true;
      setStatus("Compromised", "is-bad");
      say("You are in.", "No alarm, no record, no resistance.");
      result.textContent = route.breach + " It took three commands and " + secs + " seconds.";
      defendBtn.hidden = false;
    }

    function defend() {
      if (!route) return;
      clearTimers();
      redraw(seg1); redraw(seg2);
      $$(".is-hit", lab).forEach(function (m) { m.classList.remove("is-hit"); });
      setStatus("Being secured");
      say("Now switch sides.", "Take the four steps a TrinovaQ project takes. Each one leaves its mark on the drawing.");
      stage("defend");
    }

    /* what each of the four steps does to the drawing; each calls back when it has finished */
    var ACTIONS = [
      function (next) {                               /* the path is drawn as a plan, and tagged */
        redraw(seg1, "plan"); redraw(seg2, "plan");
        tag.setAttribute("transform", "translate(" + route.tag[0] + " " + route.tag[1] + ")");
        $("text", tag).textContent = route.tagText;
        tag.classList.add("on");
        cell(cells.ts, route.ts);
        next();
      },
      function (next) {                               /* the weak module is marked */
        var m = mod(route.from);
        m.classList.add("is-weak");
        $(".lab-sub2", m).textContent = route.weakShort;
        cell(cells.weak, route.weak + ". Fixed.");
        next();
      },
      function (next) {                               /* the visitor's own attack is replayed, and bounces */
        redraw(seg1); redraw(seg2);
        termBox2.hidden = false;
        type(term2, route.cmds[0][0], route.denied, "no", function () {
          redraw(seg1, "stopped");
          var at = seg1.getPointAtLength(seg1.getTotalLength() * 0.38);
          stop.setAttribute("transform", "translate(" + at.x.toFixed(1) + " " + at.y.toFixed(1) + ")");
          later(reduce ? 0 : 900, function () {
            stop.classList.add("on");
            $(".lab-sub2", mod(route.from)).textContent = "fixed and verified";
            cell(cells.test, route.test + ". Pass.");
            next();
          });
        });
      },
      function (next) {                               /* the sheet is stamped */
        stamp.classList.add("on");
        cell(cells.ev, "Linked to its requirement.");
        setStatus("Defended", "is-ok");
        later(reduce ? 0 : 700, function () {
          say("Same attack. Different ending.", "That is the work: find the threat, fix the weakness, test the device, keep the proof.");
          endEl.hidden = false;
        });
        next();
      }
    ];

    $$("[data-entry]", lab).forEach(function (el) {
      el.addEventListener("click", function () { attack(el.getAttribute("data-entry")); });
    });
    runBtn.addEventListener("click", run);
    document.addEventListener("keydown", function (e) {      /* Enter runs the next command, like a real terminal */
      if (e.key !== "Enter" || currentTheme() !== "blueprint") return;
      if (e.target.closest && e.target.closest("button, a, input, textarea")) return;
      run();
    });
    defendBtn.addEventListener("click", defend);
    $("#labAgain").addEventListener("click", reset);
    steps.forEach(function (b, i) {
      b.addEventListener("click", function () {
        if (i !== done || !route || busy) return;
        busy = true;
        b.classList.remove("is-next");
        b.classList.add("is-done");
        b.disabled = true;
        note.innerHTML = NOTES[i];
        ACTIONS[i](function () {
          busy = false;
          done++;
          if (steps[done]) { steps[done].disabled = false; steps[done].classList.add("is-next"); }
        });
      });
    });

    /* entering or leaving the mode starts it from the beginning */
    window.addEventListener("tq:theme", function () {
      reset();
      if (currentTheme() === "blueprint") window.scrollTo(0, 0);
    });

    /* a link to a part of the site (Book a demo, the logo) leaves the mode and goes there */
    document.addEventListener("click", function (e) {
      if (currentTheme() !== "blueprint" || !e.target.closest) return;
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var goal = document.getElementById(a.getAttribute("href").slice(1));
      if (goal && !lab.contains(goal)) setTheme("dark");
    });

    reset();
  })();

  /* ── Scroll reveal ── */
  var revealEls = $$(".rv");
  if (!hasIO || reduce) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = (n++ * 90) + "ms";   /* stagger items that arrive together */
        e.target.classList.add("in");
        revealIO.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  }

  /* ── Hero panel: the attack path runs through four phases, then repeats ──
        0 idle · 1 path traced · 2 risk rated · 3 control applied            */
  (function () {
    var hp = $("#heroPanel");
    if (!hp) return;
    var timers = [];
    var running = false;

    function phase(n) {
      hp.classList.toggle("p1", n >= 1);
      hp.classList.toggle("p2", n >= 2);
      hp.classList.toggle("p3", n >= 3);
    }
    function later(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function stop() { timers.forEach(clearTimeout); timers = []; running = false; }
    function cycle() {
      phase(0);
      later(1100, function () { phase(1); });
      later(3700, function () { phase(2); });
      later(6500, function () { phase(3); });
      later(11500, cycle);
    }

    if (reduce || !hasIO) { phase(3); return; }

    new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      if (visible && !running) { running = true; cycle(); }
      else if (!visible && running) { stop(); }
    }, { threshold: 0.25 }).observe(hp);
  })();

  /* ── Hero background: circuit traces that light up near the cursor and carry signals ── */
  (function () {
    var cv = $("#heroGrid");
    var hero = $(".hero");
    if (!cv || !cv.getContext) return;

    var ctx = cv.getContext("2d");
    var base = document.createElement("canvas");
    var G = 30;                       /* routing grid, in px */
    var DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    var traces = [];                  /* a trace is a list of nodes {x, y, e}; e is how lit the node is */
    var pulses = [];                  /* signals travelling along a trace */
    var W = 0, H = 0, dpr = 1, light = false;
    var inView = true, frame = 0, lastPulse = 0;

    /* small seeded generator, so the board keeps the same layout between resizes */
    function rng(seed) {
      return function () {
        seed = (seed + 0x6D2B79F5) | 0;
        var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    /* lay out traces the way a board is routed: straight runs, 45° jogs, no two traces on one point */
    function route() {
      var rand = rng(21434);
      var cols = Math.ceil(W / G) + 1;
      var rows = Math.ceil(H * 0.9 / G) + 1;
      var used = {};
      traces = [];

      for (var n = 0, tries = Math.round(cols * rows / 5); n < tries; n++) {
        var cx = Math.floor(rand() * cols), cy = Math.floor(rand() * rows);
        if (used[cx + "," + cy]) continue;

        var d = Math.floor(rand() * 4) * 2;             /* leave straight: right, down, left or up */
        var want = 4 + Math.floor(rand() * 10);
        var turnAt = 2 + Math.floor(rand() * 4);
        var nodes = [{ x: cx * G, y: cy * G, e: 0 }];
        var keys = [cx + "," + cy];

        for (var s = 1; s < want; s++) {
          if (s === turnAt || (s > turnAt && rand() < 0.16)) d = (d + (rand() < 0.5 ? 1 : 7)) % 8;
          var nx = cx + DIRS[d][0], ny = cy + DIRS[d][1];
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || used[nx + "," + ny]) break;
          if (d % 2 && used[cx + "," + ny] && used[nx + "," + cy]) break;   /* would cross another diagonal */
          cx = nx; cy = ny;
          keys.push(cx + "," + cy);
          used[cx + "," + cy] = 1;
          nodes.push({ x: cx * G, y: cy * G, e: 0 });
        }

        if (nodes.length < 3) {
          for (var k = 1; k < keys.length; k++) delete used[keys[k]];
          continue;
        }
        used[keys[0]] = 1;
        traces.push(nodes);
      }
    }

    function build(force) {
      var w = hero.clientWidth, h = hero.clientHeight;
      if (!w || !h) return;                              /* hidden tab or not laid out yet */
      if (force !== true && w === W && h === H) return;
      var cs = getComputedStyle(root);                   /* board colours follow the theme */
      light = root.getAttribute("data-theme") === "light";
      W = w; H = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = base.width = Math.round(W * dpr);
      cv.height = base.height = Math.round(H * dpr);
      pulses = [];
      route();

      /* the unlit board is drawn once and reused every frame */
      var b = base.getContext("2d");
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      b.clearRect(0, 0, W, H);
      b.lineWidth = 1;
      b.lineJoin = "round";
      b.strokeStyle = cs.getPropertyValue("--trace").trim() || "rgba(255,255,255,0.06)";
      b.beginPath();
      traces.forEach(function (tr) {
        b.moveTo(tr[0].x, tr[0].y);
        for (var i = 1; i < tr.length; i++) b.lineTo(tr[i].x, tr[i].y);
      });
      b.stroke();

      b.fillStyle = cs.getPropertyValue("--bg").trim() || "#0F1838";   /* a via at each end of a trace */
      b.strokeStyle = cs.getPropertyValue("--via").trim() || "rgba(255,255,255,0.13)";
      traces.forEach(function (tr) {
        [tr[0], tr[tr.length - 1]].forEach(function (p) {
          b.beginPath();
          b.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
          b.fill();
          b.stroke();
        });
      });
      draw();
    }

    /* lit traces use the one brand cyan */
    function tint(x, a) { return "rgba(29,185,225," + a + ")"; }

    function fire(tr, from, dir) {
      if (pulses.length > 44) return;
      pulses.push({ tr: tr, pos: from, dir: dir, speed: 0.2 + Math.random() * 0.12 });
    }

    function draw() {
      if (!base.width || !base.height) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(base, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";

      var i, k, p, pu, tr, n;

      /* move the signals first: every node a signal passes gets charged */
      for (p = pulses.length - 1; p >= 0; p--) {
        pu = pulses[p];
        pu.pos += pu.dir * pu.speed;
        if (pu.pos < 0 || pu.pos > pu.tr.length - 1) { pulses.splice(p, 1); continue; }
        pu.tr[pu.dir > 0 ? Math.floor(pu.pos) : Math.ceil(pu.pos)].e = 1;
      }

      /* lit segments and vias, then let the charge fade */
      for (i = 0; i < traces.length; i++) {
        tr = traces[i];
        for (k = 0; k < tr.length - 1; k++) {
          var e = Math.max(tr[k].e, tr[k + 1].e);
          if (e < 0.012) continue;
          ctx.beginPath();
          ctx.moveTo(tr[k].x, tr[k].y);
          ctx.lineTo(tr[k + 1].x, tr[k + 1].y);
          ctx.strokeStyle = tint((tr[k].x + tr[k + 1].x) / 2, e * (light ? 0.95 : 0.62));
          ctx.lineWidth = light ? 1.5 : 1.25;
          ctx.stroke();
        }
        for (k = 0; k < tr.length; k++) {
          n = tr[k];
          if (!n.e) continue;
          if (k === 0 || k === tr.length - 1) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 2.6, 0, Math.PI * 2);
            ctx.fillStyle = tint(n.x, n.e * 0.45);
            ctx.fill();
            ctx.strokeStyle = tint(n.x, n.e * 0.95);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          n.e *= 0.95;
          if (n.e < 0.012) n.e = 0;
        }
      }

      /* the bright head of each signal */
      for (p = 0; p < pulses.length; p++) {
        pu = pulses[p];
        var a = Math.floor(pu.pos), f = pu.pos - a;
        var n0 = pu.tr[a], n1 = pu.tr[Math.min(a + 1, pu.tr.length - 1)];
        var hx = n0.x + (n1.x - n0.x) * f, hy = n0.y + (n1.y - n0.y) * f;
        ctx.beginPath();
        ctx.arc(hx, hy, 1.9, 0, Math.PI * 2);
        ctx.shadowColor = tint(hx, 1);
        ctx.shadowBlur = 10;
        ctx.fillStyle = light ? tint(hx, 1) : "rgba(255,255,255,0.95)";
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    function loop(now) {
      frame = 0;
      if (!inView) return;
      /* a signal runs down a random trace now and then, so the board is alive without a cursor */
      if (now - lastPulse > 620 && traces.length) {
        lastPulse = now;
        var tr = traces[Math.floor(Math.random() * traces.length)];
        if (tr[0].y < H * 0.8) {
          if (Math.random() < 0.5) fire(tr, 0, 1); else fire(tr, tr.length - 1, -1);
        }
      }
      draw();
      frame = requestAnimationFrame(loop);
    }
    function wake() { if (!frame && inView) frame = requestAnimationFrame(loop); }

    function local(e) {
      var box = hero.getBoundingClientRect();
      return { x: e.clientX - box.left, y: e.clientY - box.top };
    }

    build();
    window.addEventListener("tq:theme", function () { build(true); });
    if (reduce) return;

    /* traces near the cursor light up */
    hero.addEventListener("pointermove", function (e) {
      var m = local(e), reach = 150;
      for (var i = 0; i < traces.length; i++) {
        for (var k = 0; k < traces[i].length; k++) {
          var n = traces[i][k];
          var dx = n.x - m.x, dy = n.y - m.y;
          if (dx > reach || dx < -reach || dy > reach || dy < -reach) continue;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < reach) n.e = Math.max(n.e, Math.pow(1 - d / reach, 1.6));
        }
      }
      wake();
    }, { passive: true });

    /* a click or tap sends signals out along every trace it touches */
    hero.addEventListener("pointerdown", function (e) {
      var m = local(e), reach = 200, started = 0;
      for (var i = 0; i < traces.length; i++) {
        var tr = traces[i], best = -1, bestD = reach;
        for (var k = 0; k < tr.length; k++) {
          var dx = tr[k].x - m.x, dy = tr[k].y - m.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d >= reach) continue;
          tr[k].e = Math.max(tr[k].e, 1 - d / reach);
          if (d < bestD) { bestD = d; best = k; }
        }
        if (best < 0 || started >= 16) continue;
        started++;
        fire(tr, best, 1);
        fire(tr, best, -1);
      }
      wake();
    }, { passive: true });

    var resizeT;
    window.addEventListener("resize", function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(build, 150);
    });

    if (hasIO) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) { build(); wake(); }
      }).observe(hero);
    }
    wake();
  })();

  /* ── How it works: the line fills as the section moves up the screen ── */
  var flow = $("#flow");
  var flowBar = $("#flowBar");
  var flowSteps = $$("#flow li");
  var narrowFlow = window.matchMedia("(max-width:860px)");

  function updateFlow() {
    if (!flow) return;
    var p = 1;
    if (!reduce) {
      var box = flow.getBoundingClientRect();
      var vh = window.innerHeight;
      p = narrowFlow.matches
        ? (vh * 0.72 - box.top) / box.height
        : (vh * 0.86 - box.top) / (vh * 0.5);
      p = clamp(p, 0, 1);
    }
    flowBar.style.setProperty("--prog", p.toFixed(3));
    flowSteps.forEach(function (li, i) {
      li.classList.toggle("is-lit", p >= i / flowSteps.length + 0.03);
    });
  }

  /* ── One scroll listener for everything that tracks position ── */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      nav.classList.toggle("is-stuck", window.scrollY > 12);
      updateFlow();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ── Statistics: every digit rolls into place, like a mechanical counter ── */
  (function () {
    var rolls = $$("[data-roll]");
    if (!rolls.length) return;

    rolls.forEach(function (el) {
      var value = el.getAttribute("data-roll");
      var html = '<span class="vh">' + value + "</span>";          /* the real number, for screen readers */
      for (var i = 0; i < value.length; i++) {
        var digit = value.charAt(i);
        var land = 10 + Number(digit);                             /* one full turn, then the digit */
        var strip = "";
        for (var n = 0; n <= land; n++) strip += "<i>" + (n % 10) + "</i>";
        /* the hidden digit gives the column its width; the strip rolls over it */
        html += '<span class="dg" aria-hidden="true"><span class="dg-size">' + digit + '</span>' +
                '<span class="dg-col" style="--n:' + land + ";--k:" + i + '">' + strip + "</span></span>";
      }
      el.innerHTML = html;
    });

    if (reduce || !hasIO) { rolls.forEach(function (el) { el.classList.add("go"); }); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("go");
        io.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    rolls.forEach(function (el) { io.observe(el); });
  })();

  /* ── Attacker's view: a lens over the device schematic that reveals its weaknesses ──
        The lens follows the pointer; left alone, it tours the board by itself.          */
  (function () {
    var stage = $("#xrStage");
    if (!stage) return;
    var svg = $("svg", stage);
    var clip = $("#xrClipC");
    var ring = $("#xrRing");
    var side = $("#xrSide");
    var countEl = $("#xrCount");
    var spots = $$(".xr-list li").map(function (li) {
      return { x: Number(li.getAttribute("data-x")), y: Number(li.getAttribute("data-y")), li: li, found: false };
    });
    var VW = 760, VH = 350;                               /* the SVG's own coordinate system */
    var tour = [[130, 102], [380, 160], [630, 102], [630, 192], [380, 282], [130, 282], [130, 192]];
    var pos = { x: 130, y: 102 }, target = { x: 130, y: 102 };
    var manual = false, resumeT = 0, inView = false, raf = 0, found = 0, t0 = 0;

    function place() {
      clip.setAttribute("cx", pos.x.toFixed(1));
      clip.setAttribute("cy", pos.y.toFixed(1));
      ring.setAttribute("transform", "translate(" + pos.x.toFixed(1) + " " + pos.y.toFixed(1) + ")");
    }
    function reveal(s) {
      s.found = true;
      s.li.classList.add("is-found");
      /* a weak point stays marked on the diagram once the lens has found it */
      $$(".xr-base .xr-mod rect", svg).forEach(function (r) {
        var cx = Number(r.getAttribute("x")) + Number(r.getAttribute("width")) / 2;
        var cy = Number(r.getAttribute("y")) + Number(r.getAttribute("height")) / 2;
        if (Math.abs(cx - s.x) < 6 && Math.abs(cy - s.y) < 6) r.parentNode.classList.add("is-known");
      });
      countEl.textContent = String(++found);
      if (found === spots.length) side.classList.add("is-done");
    }
    function check() {
      for (var i = 0; i < spots.length; i++) {
        var s = spots[i];
        if (s.found) continue;
        var dx = s.x - pos.x, dy = s.y - pos.y;
        if (dx * dx + dy * dy < 44 * 44) reveal(s);
      }
    }

    if (reduce || !hasIO) { place(); spots.forEach(reveal); return; }

    function tick(now) {
      raf = 0;
      if (!inView) return;
      if (!manual) {
        if (!t0) t0 = now;
        var stop = tour[Math.floor((now - t0) / 2400) % tour.length];
        target.x = stop[0]; target.y = stop[1];
      }
      var ease = manual ? 0.22 : 0.045;
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      place();
      check();
      raf = requestAnimationFrame(tick);
    }
    function wake() { if (!raf && inView) raf = requestAnimationFrame(tick); }

    stage.addEventListener("pointermove", function (e) {
      var box = svg.getBoundingClientRect();
      if (!box.width) return;
      manual = true;
      clearTimeout(resumeT);
      target.x = clamp((e.clientX - box.left) / box.width * VW, 0, VW);
      target.y = clamp((e.clientY - box.top) / box.height * VH, 0, VH);
      wake();
    }, { passive: true });

    function handBack() {
      clearTimeout(resumeT);
      resumeT = setTimeout(function () { manual = false; t0 = 0; }, 1800);
    }
    stage.addEventListener("pointerleave", handBack);
    stage.addEventListener("pointercancel", handBack);

    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) wake();
    }, { threshold: 0.2 }).observe(stage);
  })();

  /* ── Demo form → Google Sheet (same Apps Script web app as the previous site) ── */
  (function () {
    var form = $("#demoForm");
    if (!form) return;
    var FORM_URL = "__FORM_ENDPOINT__";   /* filled in by build.mjs from config.json */
    var btn = $("#demoSubmit");
    var status = $("#formStatus");
    var btnHTML = btn.innerHTML;

    function say(msg, cls) { status.textContent = msg; status.className = "fstatus " + (cls || ""); }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.website.value) return;                       /* honeypot */

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        say("Please add your name and a valid work email.", "err");
        (name ? form.email : form.name).focus();
        return;
      }

      btn.disabled = true;
      btn.textContent = "Sending…";
      say("");

      /* text/plain keeps this a simple CORS request: Apps Script cannot answer a preflight */
      fetch(FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          name: name,
          email: email,
          company: form.company.value.trim(),
          role: form.role.value.trim(),
          message: form.message.value.trim(),
          website: form.website.value
        })
      }).then(function (r) {
        if (!r.ok) throw new Error("bad status " + r.status);
        return r.json();
      }).then(function (d) {
        /* Apps Script always answers 200; the outcome is in the body */
        if (!d || !d.ok) throw new Error("rejected: " + (d && d.error));
        form.reset();
        say("Request received. We will reach out shortly.", "ok");
      }).catch(function (err) {
        if (window.console) console.error("Demo form failed:", err);
        say("That did not go through. Please write to contact@trinovaq.io.", "err");
      }).then(function () {
        btn.disabled = false;
        btn.innerHTML = btnHTML;
      });
    });
  })();
})();
