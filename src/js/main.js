/**
 * ヒーローセクション統合制御スクリプト
 * hero-section.js + hero-swiper.js を統合
 *
 * 主な機能：
 * 1. 円形要素の初期アニメーション
 * 2. スクロール連動アニメーション（GSAP使用）
 * 3. Swiperスライダーの初期化と制御
 *
 * 依存関係：
 * - GSAP（ScrollTriggerプラグイン含む）
 * - Swiper.js
 */

window.addEventListener("DOMContentLoaded", () => {
  // ===== DOM要素の取得 =====
  const circles = document.querySelectorAll(".circle");
  const circleImgs = document.querySelectorAll(".circle img");
  const content = document.querySelector(".content");
  const rotatingCircles = document.querySelectorAll(".rotating-circle");
  const swiperContainer = document.querySelector(".hero-swiper");

  // ===== GSAP初期化 =====
  gsap.registerPlugin(ScrollTrigger);

  // ===== Swiper関連変数 =====
  let heroSwiper = null;

  // ===== 円のサイズ調整関数 =====
  /**
   * 画面サイズに応じて円のサイズを動的に調整
   * レスポンシブ対応のため、リサイズ時にも実行
   */
  const setCircleSize = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    // 画面の幅・高さの大きい方の40%をサイズとして設定
    const size = Math.max(windowWidth, windowHeight) * 0.4;

    circles.forEach((circle) => {
      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;
    });
  };

  // ===== Swiper初期状態設定 =====
  /**
   * カスタムアニメーション実行中はSwiperを無効化
   * 最初のスライドのみ表示し、ナビゲーション要素を隠す
   */
  const setupSwiperInitialState = () => {
    if (!swiperContainer) return;

    // 最初のスライド以外を非表示
    const slides = swiperContainer.querySelectorAll(".swiper-slide");
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
    const navElements = [
      ".swiper-pagination",
      ".swiper-button-next",
      ".swiper-button-prev",
      ".swiper-progress-bar",
    ];

    navElements.forEach((selector) => {
      const element = swiperContainer.querySelector(selector);
      if (element) element.style.opacity = "0";
    });
  };

  // ===== Swiper初期化関数 =====
  /**
   * カスタムアニメーション完了後にSwiperを初期化
   * 全機能を有効化し、ナビゲーション要素をフェードイン
   */
  const initializeSwiper = () => {
    if (!swiperContainer) return;

    // 全スライドの表示状態をリセット
    const slides = swiperContainer.querySelectorAll(".swiper-slide");
    slides.forEach((slide) => {
      slide.style.display = "";
      slide.style.opacity = "";
    });

    // Swiper設定とインスタンス化
    heroSwiper = new Swiper(".hero-swiper", {
      // ===== 基本設定 =====
      loop: true,
      speed: 1000,
      autoplay: {
        // delay: 4000, // 必要に応じてコメントアウト解除
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      // ===== 3Dキューブエフェクト =====
      effect: "cube",
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      },

      // ===== パララックス効果 =====
      parallax: true,
      watchSlidesProgress: true,

      // ===== ページネーション設定 =====
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        renderBullet: function (index, className) {
          return `<span class="${className}">${index + 1}</span>`;
        },
      },

      // ===== ナビゲーションボタン =====
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      // ===== イベントハンドラー =====
      on: {
        // スライド変更時のアニメーション
        slideChange: function () {
          const activeSlide = this.slides[this.activeIndex];
          const activeImage = activeSlide.querySelector("img");

          if (activeImage) {
            // アクティブな画像に軽いズームエフェクト
            activeImage.style.transform = "scale(1.05)";
            setTimeout(() => {
              activeImage.style.transform = "scale(1)";
            }, 1000);
          }
        },

        // Swiper初期化完了時
        init: function () {
          this.el.classList.add("swiper-initialized");

          // ナビゲーション要素のフェードイン
          setTimeout(() => {
            const navSelectors = [
              ".swiper-pagination",
              ".swiper-button-next",
              ".swiper-button-prev",
              ".swiper-progress-bar",
            ];

            navSelectors.forEach((selector) => {
              const element = this.el.querySelector(selector);
              if (element) {
                element.style.transition = "opacity 0.5s ease";
                element.style.opacity = "1";
              }
            });
          }, 500);
        },
      },

      // ===== レスポンシブ設定 =====
      breakpoints: {
        320: {
          cubeEffect: {
            shadowOffset: 15,
            shadowScale: 0.9,
          },
        },
        768: {
          cubeEffect: {
            shadowOffset: 20,
            shadowScale: 0.94,
          },
        },
        1024: {
          cubeEffect: {
            shadowOffset: 25,
            shadowScale: 0.96,
          },
        },
      },
    });

    // ===== プログレスバー実装 =====
    const progressBar = document.querySelector(".swiper-progress-bar");
    if (progressBar && heroSwiper) {
      heroSwiper.on("autoplayTimeLeft", function (s, time, progress) {
        progressBar.style.setProperty("--progress", 1 - progress);
      });
    }

    // ===== キーボード操作有効化 =====
    if (heroSwiper) {
      heroSwiper.keyboard.enable();
    }
  };

  // ===== スクロールアニメーション設定 =====
  /**
   * GSAP ScrollTriggerを使用したスクロール連動アニメーション
   * 初期アニメーション完了後に実行
   */
  function setupScrollAnimation() {
    // === 回転サークルのアニメーション ===
    rotatingCircles.forEach((rotatingCircle) => {
      // スクロールに連動した360度回転
      gsap.to(rotatingCircle, {
        rotation: 360,
        scrollTrigger: {
          trigger: rotatingCircle.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // スクロールに滑らかに連動
          // markers: true, // デバッグ時にtrueに変更
        },
      });

      // フェードイン + スケールアニメーション
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

    // === 通常コンテンツのスクロールアニメーション ===
    const scrollContents = document.querySelectorAll(".scroll-content");
    scrollContents.forEach((content) => {
      // 子要素を順番に下からフェードイン
      gsap.fromTo(
        content.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2, // 0.2秒ずつ時差をつけて表示
          duration: 0.8,
          scrollTrigger: {
            trigger: content,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // === フリップアニメーション要素 ===
    const flipElements = document.querySelectorAll(".flip-on-scroll");
    flipElements.forEach((el) => {
      // Y軸180度回転から0度へ（裏返し効果）
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
            // markers: true, // デバッグ用
          },
        }
      );
    });
  }

  // ===== 初期化処理の実行 =====

  // 1. 円のサイズ設定とリサイズ対応
  setCircleSize();
  window.addEventListener("resize", setCircleSize);

  // 2. Swiper初期状態設定
  setupSwiperInitialState();

  // 3. 初期アニメーション開始（500ms後）
  setTimeout(() => {
    // 円の拡大アニメーション
    circles.forEach((circle) => {
      circle.style.animation =
        "circleExpand 1.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards";
    });

    // 画像のフェードイン（700ms後）
    setTimeout(() => {
      circleImgs.forEach((img) => {
        img.style.opacity = "1";
      });
    }, 0);

    // メインコンテンツのフェードイン（1000ms後）
    setTimeout(() => {
      content.style.animation = "contentFadeIn 1s ease forwards";
    }, 0);

    // スクロールアニメーション設定（2000ms後）
    setTimeout(() => {
      setupScrollAnimation();
    }, 2000);

    // Swiper初期化（2200ms後）
    setTimeout(() => {
      initializeSwiper();
    }, 0);
  }, 0);

  // ===== デバッグ用グローバル公開 =====
  window.heroSwiper = () => heroSwiper;
});
