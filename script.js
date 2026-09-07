(function () {
  var sticky = document.getElementById("sticky-cta");
  var pageCtas = document.querySelectorAll(".js-page-cta");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function bindStickyCta() {
    if (!sticky || !pageCtas.length || !("IntersectionObserver" in window)) return;

    var visible = 0;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible += entry.isIntersecting ? 1 : -1;
        });
        sticky.classList.toggle("is-visible", visible <= 0);
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.35 }
    );

    pageCtas.forEach(function (el) {
      observer.observe(el);
    });
  }

  function showStatic() {
    document.querySelectorAll(".reveal, .card-reveal").forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  function formatCount(value) {
    return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function waitForGsap(done) {
    if (window.gsap && window.ScrollTrigger) {
      done();
      return;
    }

    var tries = 0;
    var timer = window.setInterval(function () {
      tries += 1;
      if (window.gsap && window.ScrollTrigger) {
        window.clearInterval(timer);
        done();
      } else if (tries > 40) {
        window.clearInterval(timer);
        showStatic();
      }
    }, 50);
  }

  function runMotion() {
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll("section").forEach(function (section) {
      var headings = section.querySelectorAll(".reveal");
      if (headings.length) {
        gsap.to(headings, {
          opacity: 1,
          y: 0,
          duration: 0.28,
          ease: "power2.out",
          stagger: 0.04,
          scrollTrigger: {
            trigger: section,
            start: "top 84%",
            once: true
          }
        });
      }

      var cards = section.querySelectorAll(".card-reveal");
      if (cards.length) {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true
          }
        });
      }
    });

    document.querySelectorAll(".js-count").forEach(function (el) {
      var end = Number(el.getAttribute("data-end") || "0");
      var counter = { value: 0 };

      gsap.to(counter, {
        value: end,
        duration: 0.48,
        ease: "power1.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true
        },
        onUpdate: function () {
          el.textContent = formatCount(counter.value);
        },
        onComplete: function () {
          el.textContent = formatCount(end);
        }
      });
    });
  }

  bindStickyCta();

  if (reduceMotion) {
    showStatic();
    return;
  }

  waitForGsap(runMotion);
})();
