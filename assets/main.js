// 움직임 (U052): 스크롤 등장, 소개 문장 진해짐, 스크롤하면 커지는 사례 카드, 왼쪽 위치 눈금
(function () {
  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 스크롤 등장 (+ 소개 문장)
  var revealEls = document.querySelectorAll("[data-reveal], .about p");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.1 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  // 사례 카드: 섹션을 지나는 정도(0~1)에 따라 화면 가득 커짐
  var chapters = Array.prototype.slice.call(document.querySelectorAll(".chapter"));
  var ticks = Array.prototype.slice.call(document.querySelectorAll(".ticks a"));
  var sections = ticks.map(function (a) {
    return document.querySelector(a.getAttribute("href"));
  });

  if (!chapters.length && !ticks.length) return;

  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;

    if (!reduceMotion) {
      chapters.forEach(function (ch) {
        var r = ch.getBoundingClientRect();
        var total = r.height - vh;
        var p = total > 0 ? -r.top / total : 0;
        // 앞쪽 55% 구간에서 다 커지고, 나머지는 가득 찬 채로 머무름
        p = Math.max(0, Math.min(1, p / 0.55));
        ch.querySelector(".chapter-card").style.setProperty("--p", p.toFixed(3));
      });
    }

    var current = 0;
    sections.forEach(function (sec, i) {
      if (sec && sec.getBoundingClientRect().top <= vh * 0.5) current = i;
    });
    ticks.forEach(function (a, i) {
      a.classList.toggle("is-on", i === current);
    });
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
