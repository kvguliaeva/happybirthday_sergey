(function () {
  const $ = window.jQuery;

  function initScrollAnimations() {
    if (typeof window.jsScrollAnimations === "function") {
      window.jsScrollAnimations().init();
    } else {
      document.querySelectorAll("[data-jsscroll]").forEach((node) => {
        node.classList.add("jsScroll__scrolled");
      });
    }
  }

  function initSlick() {
    const wishes = [
      "Самый главный подарок для меня - ваше присутствие. Буду искренне рад видеть каждого из вас и вместе создать этот замечательный праздник!",
      "Если вы планируете поздравить меня подарком, буду благодарен финансовой поддержке: она в полном объеме превратится в интерьерные акценты и останется памятью до следующего юбилея.",
      "Пожалуйста, приходите без цветов. Для меня важнее ваше внимание, настроение и возможность провести этот вечер вместе.",
      "Праздник пройдет во взрослом формате, поэтому прошу вас по возможности прийти без детей."
    ];
    const wishesRoot = document.querySelector(".sm-wishes__content-slider");
    if (wishesRoot) {
      wishesRoot.className = "sm-slider sm-wishes__content-slider";
      wishesRoot.innerHTML = wishes.map((text, index) => (
        `<div class="sm-wishes__content-item"><div class="sm-wishes__content-slide" data-sm-text="WISH_TEXT_ITEMS_${index}">${text}</div></div>`
      )).join("");
    }

    if (!$ || !$.fn || !$.fn.slick || !wishesRoot) return;

    $(".sm-wishes__content-slider").on("init reInit afterChange", function (_event, slick, currentSlide) {
      const slide = typeof currentSlide === "number" ? currentSlide : 0;
      $("#current-slide").text(slide + 1);
      $("#count-slides").text(slick.slideCount);
    });

    $(".sm-wishes__content-slider").slick({
      slidesToShow: 1,
      infinite: true,
      adaptiveHeight: false,
      nextArrow: $(".sm-wishes-slider_next"),
      prevArrow: $(".sm-wishes-slider_prev")
    });
  }

  function initFancybox() {
    if (window.Fancybox) {
      window.Fancybox.bind("[data-fancybox]", {
        touch: true,
        closeButton: true,
        Thumbs: false,
        caption: false,
        autoScale: true
      });
    }
  }

  function initModals() {
    const body = document.body;
    const questModal = document.querySelector(".sm-quest-modal");
    const thanksModal = document.getElementById("thankYouMessage");

    document.querySelectorAll(".open-modal").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        questModal?.classList.add("sm-open");
        body.classList.add("lock");
      });
    });

    document.querySelector(".sm-quest-modal-close")?.addEventListener("click", () => {
      questModal?.classList.remove("sm-open");
      body.classList.remove("lock");
    });

    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        questModal?.classList.remove("sm-open");
        thanksModal?.classList.add("sm-open");
        body.classList.add("lock");
        form.reset();
      });
    });

    document.getElementById("sm-modal-close")?.addEventListener("click", () => {
      thanksModal?.classList.remove("sm-open");
      body.classList.remove("lock");
    });
  }

  function initMobileButton() {
    const button = document.querySelector(".sm-mob-btn");
    const update = () => {
      if (!button) return;
      button.classList.toggle("sm-hidden_slow", window.scrollY < window.innerHeight / 2);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function declension(value, words) {
    const mod10 = value % 10;
    const mod100 = value % 100;
    if (mod10 === 1 && mod100 !== 11) return words[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return words[1];
    return words[2];
  }

  function setDigits(selector, value, minLength) {
    const root = document.querySelector(selector);
    if (!root) return;
    const digits = String(Math.max(0, value)).padStart(minLength, "0").split("");
    root.innerHTML = digits.map((digit) => (
      `<div class="sm-timer-time_number sm-time__item_number"><span class="sm-timer-time_number-span">${digit}</span></div>`
    )).join("");
  }

  function initCountdown() {
    const target = new Date("2026-08-08T12:00:00+03:00");
    const update = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor(diff / 3600000) % 24;
      const minutes = Math.floor(diff / 60000) % 60;
      const seconds = Math.floor(diff / 1000) % 60;

      setDigits("#days", days, days > 99 ? 3 : 2);
      setDigits("#hours > .sm-time__item_number", hours, 2);
      setDigits("#minutes", minutes, 2);
      setDigits("#seconds > .sm-time__item_number", seconds, 2);

      const daysTitle = document.getElementById("days-title");
      const hoursTitle = document.getElementById("hours-title");
      const minutesTitle = document.getElementById("minutes-title");
      const secondsTitle = document.getElementById("seconds-title");
      if (daysTitle) daysTitle.textContent = declension(days, ["День", "Дня", "Дней"]);
      if (hoursTitle) hoursTitle.textContent = declension(hours, ["Час", "Часа", "Часов"]);
      if (minutesTitle) minutesTitle.textContent = declension(minutes, ["Минута", "Минуты", "Минут"]);
      if (secondsTitle) secondsTitle.textContent = declension(seconds, ["Секунда", "Секунды", "Секунд"]);
    };
    update();
    window.setInterval(update, 1000);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initScrollAnimations();
    initSlick();
    initFancybox();
    initModals();
    initMobileButton();
    initCountdown();
  });
}());
