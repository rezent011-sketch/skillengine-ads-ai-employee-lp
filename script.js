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
        sticky.classList.toggle("is-hidden", visible > 0);
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.35 }
    );

    pageCtas.forEach(function (el) {
      observer.observe(el);
    });
  }

  function showStatic() {
    document.querySelectorAll(".reveal, .js-hero").forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
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

  function pulseCtas() {
    var ctas = document.querySelectorAll(".btn-cta");
    ctas.forEach(function (btn, index) {
      window.gsap.to(btn, {
        boxShadow: "0 0 0 1px rgba(255,255,255,0.16), 0 0 28px rgba(34,197,94,0.55)",
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.12
      });
    });
  }

  function runMotion() {
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    var heroBits = document.querySelectorAll(".js-hero");
    gsap.to(heroBits, {
      opacity: 1,
      y: 0,
      duration: 0.78,
      stagger: 0.09,
      ease: "power2.out",
      delay: 0.08
    });

    gsap.to(".orb-a", {
      y: 18,
      x: -10,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".orb-b", {
      y: -16,
      x: 12,
      duration: 8.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".orb-c", {
      y: 14,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    document.querySelectorAll("section").forEach(function (section) {
      var items = section.querySelectorAll(".reveal");
      if (!items.length) return;

      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.62,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true
        }
      });
    });

    pulseCtas();
  }

  bindStickyCta();

  if (reduceMotion) {
    showStatic();
    return;
  }

  waitForGsap(runMotion);
})();
