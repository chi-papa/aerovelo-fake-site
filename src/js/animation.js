/**
 * =============================================================================
 * メインアニメーションスクリプト (main-animations.js)
 * =============================================================================
 *
 * 【統合内容】
 * - ヒーローセクションの初期アニメーション
 * - Swiperスライダーの初期化と制御
 * - シーケンシャルテキストアニメーション
 * - スクロールトリガーアニメーション
 *
 * 【依存関係】
 * - GSAP (ScrollTrigger プラグイン含む)
 * - Swiper.js
 *
 * 【使用方法】
 * HTML内で以下のクラス/IDを使用:
 * - .circle, .rotating-circle, .scroll-content
 * - .flip-on-scroll, #seq-text, #highlight-content
 * - .hero-swiper (Swiper用)
 *
 * =============================================================================
 */

// =============================================================================
// 1. ヒーローセクション初期アニメーション + スクロールアニメーション
// =============================================================================

/**
 * ヒーローセクションのメインアニメーション制御
 * 画面サイズ対応、初期アニメーション、スクロールアニメーションを統合管理
 */
class HeroAnimationController {
  constructor() {
    this.circles = document.querySelectorAll(".circle");
    this.circleImgs = document.querySelectorAll(".circle img");
    this.content = document.querySelector(".content");
    this.rotatingCircles = document.querySelectorAll(".rotating-circle");
    this.isAnimationComplete = false;

    this.init();
  }

  /**
   * 初期化処理
   * GSAPプラグイン登録、サイズ設定、アニメーション開始
   */
  init() {
    // GSAPプラグイン登録
    if (typeof gsap !== "undefined" && gsap.registerPlugin) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 画面サイズ対応
    this.setCircleSize();
    window.addEventListener("resize", () => this.setCircleSize());

    // 初期アニメーション開始（500ms後）
    setTimeout(() => this.startInitialAnimation(), 500);
  }

  /**
   * 画面サイズに応じて円のサイズを動的設定
   */
  setCircleSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const size = Math.max(windowWidth, windowHeight) * 0.4;

    this.circles.forEach((circle) => {
      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;
    });
  }

  /**
   * 初期アニメーションシーケンス
   * 円の拡大 → 画像フェードイン → コンテンツ表示 → スクロールアニメーション設定
   */
  startInitialAnimation() {
    // 1. 円を拡大させるアニメーション
    this.circles.forEach((circle) => {
      circle.style.animation =
        "circleExpand 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards";
    });

    // 2. 画像フェードイン（700ms後）
    setTimeout(() => {
      this.circleImgs.forEach((img) => {
        img.style.opacity = "1";
      });
    }, 700);

    // 3. メインコンテンツフェードイン（1000ms後）
    setTimeout(() => {
      if (this.content) {
        this.content.style.animation = "contentFadeIn 1s ease forwards";
      }
    }, 1000);

    // 4. スクロールアニメーション設定（2000ms後）
    setTimeout(() => {
      this.setupScrollAnimation();
      this.isAnimationComplete = true;

      // カスタムイベント発火（他のスクリプトが待機している場合）
      document.dispatchEvent(new CustomEvent("heroAnimationComplete"));
    }, 2000);
  }

  /**
   * スクロールトリガーアニメーション設定
   * 回転サークル、フリップ要素、コンテンツ要素のアニメーション
   */
  setupScrollAnimation() {
    if (typeof gsap === "undefined") {
      console.warn("GSAP is not loaded. Scroll animations will be skipped.");
      return;
    }

    // 回転サークルアニメーション
    this.rotatingCircles.forEach((rotatingCircle) => {
      // スクロール連動回転
      gsap.to(rotatingCircle, {
        rotation: 360,
        scrollTrigger: {
          trigger: rotatingCircle.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // フェードイン + 拡大アニメーション
      gsap.fromTo(
        rotatingCircle,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: rotatingCircle.parentElement,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // 通常のスクロールコンテンツアニメーション
    const scrollContents = document.querySelectorAll(".scroll-content");
    scrollContents.forEach((content) => {
      gsap.fromTo(
        content.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.8,
          scrollTrigger: {
            trigger: content,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // フリップアニメーション要素
    const flipElements = document.querySelectorAll(".flip-on-scroll");
    flipElements.forEach((el) => {
      gsap.fromTo(
        el,
        { rotationY: 180, opacity: 0 },
        {
          rotationY: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }
}

// =============================================================================
// 2. Swiperスライダー制御クラス
// =============================================================================

/**
 * ヒーローSwiperの初期化と制御
 * 初期アニメーション完了後にSwiperを有効化
 */
class HeroSwiperController {
  constructor() {
    this.swiperContainer = document.querySelector(".hero-swiper");
    this.heroSwiper = null;

    if (this.swiperContainer) {
      this.init();
    }
  }

  /**
   * 初期化処理
   * 初期状態設定 → アニメーション完了待機 → Swiper有効化
   */
  init() {
    this.setupInitialState();
    this.waitForAnimationComplete();
  }

  /**
   * 初期状態設定：最初のスライドのみ表示
   */
  setupInitialState() {
    const slides = this.swiperContainer.querySelectorAll(".swiper-slide");
    slides.forEach((slide, index) => {
      if (index === 0) {
        slide.style.display = "block";
        slide.style.opacity = "1";
      } else {
        slide.style.display = "none";
        slide.style.opacity = "0";
      }
    });

    // ナビゲーション要素を一時的に隠す
    this.hideNavigationElements();
  }

  /**
   * ナビゲーション要素を非表示
   */
  hideNavigationElements() {
    const elements = [
      ".swiper-pagination",
      ".swiper-button-next",
      ".swiper-button-prev",
      ".swiper-progress-bar",
    ];

    elements.forEach((selector) => {
      const element = this.swiperContainer.querySelector(selector);
      if (element) element.style.opacity = "0";
    });
  }

  /**
   * アニメーション完了を待機してSwiper初期化
   */
  waitForAnimationComplete() {
    // カスタムイベントリスナー（推奨）
    document.addEventListener("heroAnimationComplete", () => {
      setTimeout(() => this.initializeSwiper(), 200);
    });

    // フォールバック：タイムアウトベース
    setTimeout(() => {
      if (!this.heroSwiper) {
        this.initializeSwiper();
      }
    }, 3000);
  }

  /**
   * Swiper初期化
   */
  initializeSwiper() {
    if (typeof Swiper === "undefined") {
      console.warn(
        "Swiper is not loaded. Slider functionality will be unavailable."
      );
      return;
    }

    // 全スライドを表示状態に戻す
    const slides = this.swiperContainer.querySelectorAll(".swiper-slide");
    slides.forEach((slide) => {
      slide.style.display = "";
      slide.style.opacity = "";
    });

    // Swiper設定
    this.heroSwiper = new Swiper(".hero-swiper", {
      // 基本設定
      loop: true,
      speed: 1000,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      // キューブエフェクト
      effect: "cube",
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      },

      // パララックス
      parallax: true,
      watchSlidesProgress: true,

      // ページネーション
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        renderBullet: (index, className) => {
          return `<span class="${className}">${index + 1}</span>`;
        },
      },

      // ナビゲーション
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      // イベントハンドラ
      on: {
        slideChange: () => this.handleSlideChange(),
        init: () => this.handleSwiperInit(),
      },

      // レスポンシブ設定
      breakpoints: {
        320: {
          cubeEffect: { shadowOffset: 15, shadowScale: 0.9 },
        },
        768: {
          cubeEffect: { shadowOffset: 20, shadowScale: 0.94 },
        },
        1024: {
          cubeEffect: { shadowOffset: 25, shadowScale: 0.96 },
        },
      },
    });

    // プログレスバー設定
    this.setupProgressBar();

    // キーボード操作有効化
    if (this.heroSwiper) {
      this.heroSwiper.keyboard.enable();
    }

    // グローバル公開（デバッグ用）
    window.heroSwiper = () => this.heroSwiper;
  }

  /**
   * スライド変更時の処理
   */
  handleSlideChange() {
    if (!this.heroSwiper) return;

    const activeSlide = this.heroSwiper.slides[this.heroSwiper.activeIndex];
    const activeImage = activeSlide?.querySelector("img");

    if (activeImage) {
      activeImage.style.transform = "scale(1.05)";
      setTimeout(() => {
        activeImage.style.transform = "scale(1)";
      }, 1000);
    }
  }

  /**
   * Swiper初期化完了時の処理
   */
  handleSwiperInit() {
    this.swiperContainer.classList.add("swiper-initialized");

    // ナビゲーション要素をフェードイン
    setTimeout(() => {
      const elements = [
        ".swiper-pagination",
        ".swiper-button-next",
        ".swiper-button-prev",
        ".swiper-progress-bar",
      ];

      elements.forEach((selector) => {
        const element = this.swiperContainer.querySelector(selector);
        if (element) {
          element.style.transition = "opacity 0.5s ease";
          element.style.opacity = "1";
        }
      });
    }, 500);
  }

  /**
   * プログレスバー設定
   */
  setupProgressBar() {
    const progressBar = document.querySelector(".swiper-progress-bar");
    if (progressBar && this.heroSwiper) {
      this.heroSwiper.on("autoplayTimeLeft", (s, time, progress) => {
        progressBar.style.setProperty("--progress", 1 - progress);
      });
    }
  }
}

// =============================================================================
// 3. テキストアニメーション機能
// =============================================================================

/**
 * シーケンシャルテキストアニメーション
 * 単語を順番にアニメーション表示
 */
function animateSequence() {
  const text = document.getElementById("seq-text");
  if (!text) return;

  const words = text.textContent.split(" ");
  text.innerHTML = "";

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = word;
    span.style.animationDelay = `${index * 0.5}s`;
    text.appendChild(span);
  });
}

/**
 * ハイライトコンテンツ表示
 */
function showContent() {
  const content = document.getElementById("highlight-content");
  if (content) {
    content.classList.add("highlight-visible");
  }
}

// =============================================================================
// 4. 初期化とイベント設定
// =============================================================================

/**
 * DOMContentLoaded時の初期化
 */
document.addEventListener("DOMContentLoaded", () => {
  // ヒーローアニメーション初期化
  const heroAnimation = new HeroAnimationController();

  // Swiper初期化
  const heroSwiperController = new HeroSwiperController();

  // グローバル公開（デバッグ・外部アクセス用）
  window.heroAnimation = heroAnimation;
  window.heroSwiperController = heroSwiperController;

  // テキストアニメーション関数をグローバル公開
  window.animateSequence = animateSequence;
  window.showContent = showContent;
});

// =============================================================================
// 5. エラーハンドリングとデバッグ
// =============================================================================

/**
 * 依存関係チェック
 */
function checkDependencies() {
  const dependencies = [
    { name: "GSAP", check: () => typeof gsap !== "undefined" },
    {
      name: "ScrollTrigger",
      check: () => typeof ScrollTrigger !== "undefined",
    },
    { name: "Swiper", check: () => typeof Swiper !== "undefined" },
  ];

  dependencies.forEach((dep) => {
    if (!dep.check()) {
      console.warn(
        `${dep.name} is not loaded. Some features may not work properly.`
      );
    }
  });
}

// 開発環境でのデバッグ情報
if (typeof console !== "undefined" && console.log) {
  console.log("Main Animations Script Loaded");
  checkDependencies();
}
