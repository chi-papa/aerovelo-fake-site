// 修正版 Swiperの初期化 - アニメーション競合を解決
document.addEventListener("DOMContentLoaded", function () {
  let heroSwiper = null;

  // 初期状態でSwiperを無効化（最初のスライドのみ表示）
  const swiperContainer = document.querySelector(".hero-swiper");

  if (!swiperContainer) return;

  // 初期状態の設定：最初のスライドのみ表示
  const setupInitialState = () => {
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

    // Swiperのナビゲーション要素を一時的に隠す
    const pagination = swiperContainer.querySelector(".swiper-pagination");
    const nextBtn = swiperContainer.querySelector(".swiper-button-next");
    const prevBtn = swiperContainer.querySelector(".swiper-button-prev");
    const progressBar = swiperContainer.querySelector(".swiper-progress-bar");

    if (pagination) pagination.style.opacity = "0";
    if (nextBtn) nextBtn.style.opacity = "0";
    if (prevBtn) prevBtn.style.opacity = "0";
    if (progressBar) progressBar.style.opacity = "0";
  };

  // カスタムアニメーション完了後にSwiperを初期化する関数
  const initializeSwiperAfterAnimation = () => {
    // 全スライドを表示状態に戻す
    const slides = swiperContainer.querySelectorAll(".swiper-slide");
    slides.forEach((slide) => {
      slide.style.display = "";
      slide.style.opacity = "";
    });

    // Swiperを初期化
    heroSwiper = new Swiper(".hero-swiper", {
      // 基本設定
      loop: true,
      speed: 1000,
      autoplay: {
        // delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      // エフェクトをcubeに設定
      effect: "cube",
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      },

      // パララックス効果
      parallax: true,
      watchSlidesProgress: true,

      // ページネーション
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
      },

      // ナビゲーション
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      // スライドイベント
      on: {
        slideChange: function () {
          const activeSlide = this.slides[this.activeIndex];
          const activeImage = activeSlide.querySelector("img");

          if (activeImage) {
            activeImage.style.transform = "scale(1.05)";
            setTimeout(() => {
              activeImage.style.transform = "scale(1)";
            }, 1000);
          }
        },

        init: function () {
          this.el.classList.add("swiper-initialized");

          // ナビゲーション要素をフェードイン
          setTimeout(() => {
            const pagination = this.el.querySelector(".swiper-pagination");
            const nextBtn = this.el.querySelector(".swiper-button-next");
            const prevBtn = this.el.querySelector(".swiper-button-prev");
            const progressBar = this.el.querySelector(".swiper-progress-bar");

            if (pagination) {
              pagination.style.transition = "opacity 0.5s ease";
              pagination.style.opacity = "1";
            }
            if (nextBtn) {
              nextBtn.style.transition = "opacity 0.5s ease";
              nextBtn.style.opacity = "1";
            }
            if (prevBtn) {
              prevBtn.style.transition = "opacity 0.5s ease";
              prevBtn.style.opacity = "1";
            }
            if (progressBar) {
              progressBar.style.transition = "opacity 0.5s ease";
              progressBar.style.opacity = "1";
            }
          }, 500);
        },
      },

      // レスポンシブ設定
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

    // プログレスバーの実装
    const progressBar = document.querySelector(".swiper-progress-bar");
    if (progressBar && heroSwiper) {
      heroSwiper.on("autoplayTimeLeft", function (s, time, progress) {
        progressBar.style.setProperty("--progress", 1 - progress);
      });
    }

    // キーボード操作対応
    if (heroSwiper) {
      heroSwiper.keyboard.enable();
    }
  };

  // 初期状態をセットアップ
  setupInitialState();

  // hero-section.jsのアニメーションが完了するのを待つ
  // カスタムイベントをリッスンするか、タイムアウトで待機
  const waitForCustomAnimation = () => {
    // hero-section.jsでカスタムアニメーションが完了した時点でSwiperを初期化
    // 3秒後（カスタムアニメーション完了予定時間）にSwiperを開始
    setTimeout(() => {
      initializeSwiperAfterAnimation();
    }, 200); // hero-section.jsのアニメーション完了タイミングに合わせる
  };

  // アニメーション開始を待つ
  waitForCustomAnimation();

  // グローバルに公開（デバッグ用）
  window.heroSwiper = () => heroSwiper;
});
