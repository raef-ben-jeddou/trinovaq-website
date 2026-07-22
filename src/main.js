(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Snap intros to their end state once they should be done */
  setTimeout(function(){ document.body.classList.add("settled"); }, 2300);

  /* Theme toggle */
  var tb = document.getElementById("themeBtn");
  function themeLabel(){
    var dark = document.documentElement.dataset.theme === "dark";
    tb.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  themeLabel();
  tb.addEventListener("click", function(){
    var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.classList.add("theming");
    document.documentElement.dataset.theme = next;
    try{ localStorage.setItem("tq-theme", next); }catch(e){}
    themeLabel();
    setTimeout(function(){ document.documentElement.classList.remove("theming"); }, 420);
  });

  /* Nav background on scroll */
  var nav = document.getElementById("nav");
  function onScroll(){ nav.classList.toggle("scrolled", window.scrollY > 24); }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  /* Mobile menu */
  var mb = document.getElementById("menuBtn"), mp = document.getElementById("mPanel");
  mb.addEventListener("click", function(){
    var open = mp.classList.toggle("open");
    mb.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mp.addEventListener("click", function(e){
    if (e.target.closest("a")) { mp.classList.remove("open"); mb.setAttribute("aria-expanded","false"); }
  });

  /* Stat count-ups: smooth roll to the target value, plain text (clean alignment) */
  function runCounters(scope){
    scope.querySelectorAll(".count").forEach(function(el, idx){
      if (el.dataset.done) return;
      el.dataset.done = "1";
      var target = parseFloat(el.dataset.count);
      var suf = el.dataset.suffix || "";
      var pre = el.dataset.prefix || "";
      var final = el.textContent;
      var dur = 1500, t0 = null;
      function frame(ts){
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(target * e) + suf;
        if (p < 1){ requestAnimationFrame(frame); }
        else { el.textContent = final; el.classList.add("lit"); }
      }
      var cell = el.closest(".dcell");
      setTimeout(function(){
        requestAnimationFrame(frame);
        /* guarantee the final value even if animation frames stall */
        setTimeout(function(){ el.textContent = final; }, dur + 600);
        if (cell && !reduce){
          var scan = document.createElement("i");
          scan.className = "scan";
          cell.appendChild(scan);
          requestAnimationFrame(function(){ scan.classList.add("go"); });
          setTimeout(function(){ if (scan.parentNode) scan.parentNode.removeChild(scan); }, 1300);
        }
      }, idx * 140);
    });
  }

  /* Demo request form → Supabase */
  (function(){
    var form = document.getElementById("demoForm");
    if (!form) return;
    var SUPA_URL = "__SUPA_URL__";
    var SUPA_KEY = "__SUPA_KEY__";
    var btn = document.getElementById("demoSubmit");
    var status = document.getElementById("formStatus");
    function say(msg, cls){ status.textContent = msg; status.className = "fstatus " + cls; }
    form.addEventListener("submit", function(e){
      e.preventDefault();
      if (form.website.value) return;                     /* honeypot */
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      if (!name || !email || email.indexOf("@") < 1){
        say("Please add your name and a valid email.", "err");
        return;
      }
      btn.disabled = true; btn.textContent = "Sending…"; say("", "");
      fetch(SUPA_URL + "/rest/v1/demo_requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPA_KEY,
          "Authorization": "Bearer " + SUPA_KEY,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          company: form.company.value.trim() || null,
          role: form.role.value.trim() || null,
          message: form.message.value.trim() || null
        })
      }).then(function(r){
        if (!r.ok) throw new Error("bad status " + r.status);
        form.reset();
        btn.textContent = "Request a demo"; btn.disabled = false;
        say("Request received. We will reach out shortly.", "ok");
      }).catch(function(){
        btn.textContent = "Request a demo"; btn.disabled = false;
        say("Something went wrong. Please email Contact@trinovaq.io instead.", "err");
      });
    });
  })();

  /* Silk gradient background: brand hues flowing on independent orbits */
  (function(){
    var cv = document.getElementById("silk");
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d");
    var W = 2, H = 2, SCALE = .22;
    function resize(){
      W = Math.max(2, Math.round(window.innerWidth * SCALE));
      H = Math.max(2, Math.round(window.innerHeight * SCALE));
      cv.width = W; cv.height = H;
    }
    window.addEventListener("resize", function(){ resize(); paint(perf()); });
    resize();
    function perf(){ return (window.performance && performance.now) ? performance.now() : Date.now(); }
    var blobs = [
      {c:"29,185,225",  r:.8,  sx:.34, sy:.22, px:.72, py:.16, spx:.00042, spy:.00031, ph:0},
      {c:"140,82,255",  r:.68, sx:.28, sy:.32, px:.92, py:.48, spx:.00029, spy:.00047, ph:2.1},
      {c:"55,158,216",  r:.62, sx:.36, sy:.24, px:.16, py:.06, spx:.00035, spy:.00026, ph:4.2},
      {c:"92,225,230",  r:.52, sx:.3,  sy:.3,  px:.08, py:.72, spx:.00048, spy:.00033, ph:1.2},
      {c:"110,112,187", r:.58, sx:.26, sy:.34, px:.52, py:.34, spx:.00027, spy:.00041, ph:3.3}
    ];
    function paint(t){
      ctx.clearRect(0, 0, W, H);
      var a = document.documentElement.dataset.theme === "dark" ? .16 : .13;
      for (var i = 0; i < blobs.length; i++){
        var b = blobs[i];
        var x = (b.px + Math.sin(t * b.spx + b.ph) * b.sx) * W;
        var y = (b.py + Math.cos(t * b.spy + b.ph) * b.sy) * H;
        var r = b.r * Math.max(W, H);
        var g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, "rgba(" + b.c + "," + a + ")");
        g.addColorStop(1, "rgba(" + b.c + ",0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
    }
    paint(perf());   /* first frame immediately, even if rAF is delayed */
    if (reduce) return;
    var running = true, last = 0;
    document.addEventListener("visibilitychange", function(){
      running = !document.hidden;
      if (running) requestAnimationFrame(frame);
    });
    function frame(t){
      if (!running) return;
      if (t - last > 33){ last = t; paint(t); }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    /* Gentle pointer parallax on the silk (desktop, depth without new elements) */
    if (!reduce && window.matchMedia("(pointer:fine)").matches){
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      window.addEventListener("mousemove", function(e){
        tx = (e.clientX / window.innerWidth - .5) * 26;
        ty = (e.clientY / window.innerHeight - .5) * 20;
        if (!raf) raf = requestAnimationFrame(glide);
      }, {passive:true});
      function glide(){
        cx += (tx - cx) * .05; cy += (ty - cy) * .05;
        cv.style.transform = "translate3d(" + cx.toFixed(2) + "px," + cy.toFixed(2) + "px,0)";
        if (Math.abs(tx - cx) > .1 || Math.abs(ty - cy) > .1){ raf = requestAnimationFrame(glide); }
        else { raf = 0; }
      }
    }
  })();

  /* Scroll reveals */
  var revealEls = document.querySelectorAll(".reveal, .row");
  if ("IntersectionObserver" in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){
          en.target.classList.add("in");
          en.target.classList.remove("reveal-pending");
          io.unobserve(en.target);
          if (en.target.id === "dataBand") runCounters(en.target);
        }
      });
    }, {threshold:.16, rootMargin:"0px 0px -40px 0px"});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in"); el.classList.remove("reveal-pending"); });
  }
})();
