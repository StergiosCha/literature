/* =========================================================
   Στέργιος Χατζηκυριακίδης — κοινό JavaScript
   Progress bar, εναλλαγή θέματος, μέγεθος γραμμάτων,
   ομαλή εμφάνιση παραγράφων, τοπολογικό δίκτυο στο hero.
   Λειτουργεί και στην αρχική και στις σελίδες κειμένων —
   κάθε κομμάτι ενεργοποιείται μόνο αν υπάρχει το στοιχείο.
   ========================================================= */
(function () {
  var root = document.documentElement;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- progress bar ----- */
  var bar = document.getElementById('progress');
  if (bar) {
    var progress = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
    };
    addEventListener('scroll', progress, { passive: true });
    addEventListener('resize', progress, { passive: true });
    progress();
  }

  /* ----- theme toggle (in-memory, ξεκινά από τις ρυθμίσεις συστήματος) ----- */
  var dark = matchMedia('(prefers-color-scheme: dark)').matches;
  var applyTheme = function () { root.setAttribute('data-theme', dark ? 'dark' : 'light'); };
  applyTheme();
  var tbtn = document.getElementById('theme-btn');
  if (tbtn) tbtn.addEventListener('click', function () { dark = !dark; applyTheme(); });

  /* ----- font size ----- */
  var size = 100;
  var applySize = function () { root.style.fontSize = size + '%'; };
  var fp = document.getElementById('font-plus');
  var fm = document.getElementById('font-minus');
  if (fp) fp.addEventListener('click', function () { size = Math.min(size + 8, 132); applySize(); });
  if (fm) fm.addEventListener('click', function () { size = Math.max(size - 8, 84); applySize(); });

  /* ----- ομαλή εμφάνιση παραγράφων ----- */
  var paras = document.querySelectorAll('article p');
  if (paras.length && !reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('shown'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -5% 0px' });
    paras.forEach(function (p) { p.classList.add('reveal'); io.observe(p); });
  }

  /* ----- τοπολογικό δίκτυο στο hero ----- */
  var canvas = document.getElementById('net');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var nodes = [], N = 42, LINK = 130, seed = 12345;
    var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    var box = function () { return canvas.parentElement.getBoundingClientRect(); };
    var resize = function () {
      var r = box();
      canvas.width = r.width * devicePixelRatio;
      canvas.height = r.height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    var init = function () {
      nodes = []; var r = box();
      for (var i = 0; i < N; i++) {
        nodes.push({
          x: rnd() * r.width, y: rnd() * r.height,
          vx: (rnd() - 0.5) * 0.25, vy: (rnd() - 0.5) * 0.25,
          s: 1.4 + rnd() * 1.8, warm: rnd() > 0.72
        });
      }
    };
    var colors = function () {
      var s = getComputedStyle(root);
      return {
        a: s.getPropertyValue('--accent').trim(),
        b: s.getPropertyValue('--accent-2').trim(),
        m: s.getPropertyValue('--muted').trim()
      };
    };
    var draw = function () {
      var r = box();
      ctx.clearRect(0, 0, r.width, r.height);
      var c = colors();
      for (var i = 0; i < N; i++) {
        for (var j = i + 1; j < N; j++) {
          var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.globalAlpha = 0.14 * (1 - d / LINK);
            ctx.strokeStyle = c.m; ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      for (var k = 0; k < N; k++) {
        var n = nodes[k];
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = n.warm ? c.b : c.a;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    var step = function () {
      var r = box();
      for (var i = 0; i < N; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < -10) n.x = r.width + 10; if (n.x > r.width + 10) n.x = -10;
        if (n.y < -10) n.y = r.height + 10; if (n.y > r.height + 10) n.y = -10;
      }
      draw();
      if (!reduced) requestAnimationFrame(step);
    };
    resize(); init();
    addEventListener('resize', function () { resize(); draw(); });
    if (reduced) draw(); else requestAnimationFrame(step);
  }
})();
