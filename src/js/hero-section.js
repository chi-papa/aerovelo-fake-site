window.addEventListener("DOMContentLoaded", () => {
  const circles = document.querySelectorAll(".circle");
  const circleImgs = document.querySelectorAll(".circle img"); // .circles → .circle に修正
  const content = document.querySelector(".content");
  const rotatingCircles = document.querySelectorAll(".rotating-circle");

  // GSAPプラグイン（ScrollTrigger）を有効化
  gsap.registerPlugin(ScrollTrigger);

  // ===== 画面サイズに応じて円のサイズを設定する関数 =====
  const setCircleSize = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const size = Math.max(windowWidth, windowHeight) * 0.4; // 幅か高さの大きい方に対して45%のサイズ

    // 全ての.circleにサイズを適用
    circles.forEach((circle) => {
      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;
    });
  }; // setCircleSize関数をここで正しく閉じる

  // 初期サイズ設定＋リサイズ対応
  setCircleSize();
  window.addEventListener("resize", setCircleSize);

  // ===== 初期アニメーション開始（ページロード後）=====
  setTimeout(() => {
    // 円を拡大させるアニメーション（CSSアニメーションで定義）
    circles.forEach((circle) => {
      circle.style.animation =
        "circleExpand 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards";
    });

    // 少し遅れて画像を表示（フェードイン）
    setTimeout(() => {
      circleImgs.forEach((img) => {
        img.style.opacity = "1";
      });
    }, 700);

    // さらに遅れてメインコンテンツをフェードイン
    setTimeout(() => {
      content.style.animation = "contentFadeIn 1s ease forwards";
    }, 1000);

    // 初期アニメーション完了後にスクロールアニメーションをセットアップ
    setTimeout(() => {
      setupScrollAnimation();
    }, 2000);
  }, 500);

  // ===== スクロールに応じたアニメーション設定 =====
  function setupScrollAnimation() {
    // === 回転サークルごとのアニメーション設定 ===
    rotatingCircles.forEach((rotatingCircle) => {
      // スクロール中に360度回転させる
      gsap.to(rotatingCircle, {
        rotation: 360,
        scrollTrigger: {
          trigger: rotatingCircle.parentElement, // アニメーションのトリガー（親要素）
          start: "top bottom", // 親要素が画面下に来た時スタート
          end: "bottom top", // 親要素が画面上を通過した時に終了
          scrub: 1, // スクロールに連動（滑らかに）
          // markers: false, // 開発時はtrueにして位置確認可能
        },
      });

      // 回転サークルがフェードイン＋拡大するアニメーション
      gsap.fromTo(
        rotatingCircle,
        { scale: 0.8, opacity: 0 }, // 初期状態（小さく透明）
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: rotatingCircle.parentElement,
            start: "top 80%", // 親要素が画面の80%位置に来たら開始
            toggleActions: "play none none reverse", // 戻った時に逆再生
          },
        }
      );
    });

    // === 通常のコンテンツ要素に対するアニメーション ===
    const scrollContents = document.querySelectorAll(".scroll-content");
    scrollContents.forEach((content) => {
      // 子要素を順番に下からフェードインさせる
      gsap.fromTo(
        content.children,
        { y: 50, opacity: 0 }, // 下から出てくる
        {
          y: 0,
          opacity: 1,
          stagger: 0.2, // 0.2秒ずつずらして順番に表示
          duration: 0.8,
          scrollTrigger: {
            trigger: content,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // === 💡 追加：フリップアニメーション要素の処理 ===
    const flipElements = document.querySelectorAll(".flip-on-scroll");
    flipElements.forEach((el) => {
      // Y軸180度回転 → 0度（回転しながら表示）
      gsap.fromTo(
        el,
        { rotationY: 180, opacity: 0 }, // 初期状態：裏返って透明
        {
          rotationY: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out", // なめらかなイージング
          scrollTrigger: {
            trigger: el,
            start: "top 75%", // 画面の60%付近でアニメーション開始
            toggleActions: "play none none reverse", // スクロール戻し時に逆再生
            // markers: true, // デバッグ用
          },
        }
      );
    });
  }
});
