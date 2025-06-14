class HamburgerMenu {
  /**

   * ハンバーガーメニューを初期化します

   * @param {Object} options - 設定オプション

   */

  constructor(options = {}) {
    // デフォルトオプション

    this.options = {
      containerId: "hamburgerContainer",

      buttonId: "hamburgerButton",

      menuId: "hamburgerMenu",

      menuItems: null,

      position: "right", // 'right' または 'left'

      theme: "light", // 'light' または 'dark'

      barColor: "", // バーの色を変更するクラス（例: 'red'）

      menuWidth: "", // メニューの幅を変更するクラス（例: 'wide'）

      onOpen: null, // メニューが開いた時のコールバック

      onClose: null, // メニューが閉じた時のコールバック

      ...options,
    };

    // 要素の取得

    this.container = document.getElementById(this.options.containerId);

    this.button = document.getElementById(this.options.buttonId);

    this.menu = document.getElementById(this.options.menuId);

    // 要素が存在するか確認

    if (!this.container || !this.button || !this.menu) {
      console.error("ハンバーガーメニューの要素が見つかりませんでした");

      return;
    }

    // カスタムメニュー項目があれば設定

    if (this.options.menuItems) {
      this.setMenuItems(this.options.menuItems);
    }

    // カスタマイズ適用

    this.applyCustomizations();

    // イベントリスナー設定

    this.button.addEventListener("click", this.toggleMenu.bind(this));

    document.addEventListener("click", this.handleOutsideClick.bind(this));

    // 初期状態

    this.isOpen = false;
  }

  /**

   * メニューの開閉を切り替えます

   */

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**

   * メニューを開きます

   */

  openMenu() {
    this.button.classList.add("is-open");

    this.button.setAttribute("aria-expanded", "true");

    this.menu.classList.add("is-open");

    this.isOpen = true;

    // コールバックがあれば実行

    if (typeof this.options.onOpen === "function") {
      this.options.onOpen();
    }
  }

  /**

   * メニューを閉じます

   */

  closeMenu() {
    this.button.classList.remove("is-open");

    this.button.setAttribute("aria-expanded", "false");

    this.menu.classList.remove("is-open");

    this.isOpen = false;

    // コールバックがあれば実行

    if (typeof this.options.onClose === "function") {
      this.options.onClose();
    }
  }

  /**

   * メニュー外のクリックを処理します

   * @param {Event} event - クリックイベント

   */

  handleOutsideClick(event) {
    if (this.isOpen && !this.container.contains(event.target)) {
      this.closeMenu();
    }
  }

  /**

   * カスタムメニュー項目を設定します

   * @param {Array} items - メニュー項目の配列 [{label: '項目名', href: 'リンク先'}]

   */

  setMenuItems(items) {
    if (!Array.isArray(items) || items.length === 0) return;

    const ul = this.menu.querySelector("ul");

    if (!ul) return;

    // 既存のメニュー項目をクリア

    ul.innerHTML = "";

    // 新しいメニュー項目を追加

    items.forEach((item) => {
      const li = document.createElement("li");

      const a = document.createElement("a");

      a.textContent = item.label;

      a.href = item.href || "#";

      if (item.target) a.target = item.target;

      li.appendChild(a);

      ul.appendChild(li);
    });
  }

  /**

   * カスタマイズを適用します

   */

  applyCustomizations() {
    // バーの色を変更

    if (this.options.barColor) {
      const bars = this.button.querySelectorAll(".hamburger-bar");

      bars.forEach((bar) => bar.classList.add(this.options.barColor));
    }

    // メニューの位置を変更

    if (this.options.position === "left") {
      this.menu.classList.add("left");
    }

    // メニューの幅を変更

    if (this.options.menuWidth) {
      this.menu.classList.add(this.options.menuWidth);
    }

    // テーマを適用

    if (this.options.theme === "dark") {
      this.menu.classList.add("dark");
    }
  }
}

// デフォルトのハンバーガーメニューをインスタンス化
document.addEventListener("DOMContentLoaded", function () {
  const defaultMenu = new HamburgerMenu();
});

// 使用例:

// カスタマイズしたハンバーガーメニュー

/*

const customMenu = new HamburgerMenu({

  containerId: 'customContainer',

  buttonId: 'customButton',

  menuId: 'customMenu',

  barColor: 'red',

  position: 'left',

  menuWidth: 'wide',

  theme: 'dark',

  menuItems: [

    { label: 'ホーム', href: '/' },

    { label: 'ブログ', href: '/blog' },

    { label: '外部リンク', href: 'https://example.com', target: '_blank' }

  ],

  onOpen: () => console.log('メニューが開きました'),

  onClose: () => console.log('メニューが閉じました')

});

*/
