// フォームの検証

function validateForm(event) {
  event.preventDefault();

  let isValid = true;

  const form = document.getElementById("contactForm");

  // 名前の検証

  const name = document.getElementById("name");

  if (!name.value.trim()) {
    showError(name, "name-error");

    isValid = false;
  } else {
    hideError(name, "name-error");
  }

  // メールアドレスの検証

  const email = document.getElementById("email");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.value)) {
    showError(email, "email-error");

    isValid = false;
  } else {
    hideError(email, "email-error");
  }

  // 電話番号の検証 (入力された場合のみ)

  const phone = document.getElementById("phone");

  if (phone.value && !phone.validity.valid) {
    showError(phone, "phone-error");

    isValid = false;
  } else {
    hideError(phone, "phone-error");
  }

  // 件名の検証

  const subject = document.getElementById("subject");

  if (!subject.value.trim()) {
    showError(subject, "subject-error");

    isValid = false;
  } else {
    hideError(subject, "subject-error");
  }

  // メッセージの検証

  const message = document.getElementById("message");

  if (!message.value.trim()) {
    showError(message, "message-error");

    isValid = false;
  } else {
    hideError(message, "message-error");
  }

  // Honeypot検証

  const honeypot = document.getElementById("website");

  if (honeypot.value) {
    // ボットがハニーポットに入力した場合

    console.log("ボット検出: ハニーポットに入力があります");

    isValid = false;

    // ここではボットであることを表示せず、通常どおり送信されているように見せる

    simulateSuccess();

    return false;
  }

  if (isValid) {
    // 実際のフォーム送信処理をここに書く

    // fetch APIなどを使用してサーバーに送信

    // XSS対策としてエスケープ処理を行う

    const sanitizedData = {
      name: escapeHTML(name.value),

      email: escapeHTML(email.value),

      phone: escapeHTML(phone.value),

      subject: escapeHTML(subject.value),

      message: escapeHTML(message.value),

      csrf_token: form.elements["csrf_token"].value,
    };

    // レート制限を設定する（実際のサーバー側での処理）

    // 送信処理のシミュレーション

    document.getElementById("submit-button").disabled = true;

    // 実際には以下のようなFetchを使ってサーバーに送信する

    /*

        fetch('/api/contact', {

          method: 'POST',

          headers: {

            'Content-Type': 'application/json',

          },

          body: JSON.stringify(sanitizedData)

        })

        .then(response => response.json())

        .then(data => {

          if (data.success) {

            showSuccessMessage();

            form.reset();

          } else {

            alert('エラーが発生しました: ' + data.message);

          }

        })

        .catch(error => {

          console.error('エラー:', error);

          alert('送信中にエラーが発生しました。後ほど再度お試しください。');

        })

        .finally(() => {

          document.getElementById('submit-button').disabled = false;

        });

        */

    // デモンストレーション用に成功メッセージを表示

    setTimeout(() => {
      showSuccessMessage();

      form.reset();

      document.getElementById("submit-button").disabled = false;
    }, 1500);
  }

  return false;
}

function showError(input, errorId) {
  input.classList.add("error");

  document.getElementById(errorId).style.display = "block";
}

function hideError(input, errorId) {
  input.classList.remove("error");

  document.getElementById(errorId).style.display = "none";
}

function showSuccessMessage() {
  const successMessage = document.getElementById("success-message");

  successMessage.style.display = "block";

  // 5秒後に成功メッセージを非表示にする

  setTimeout(() => {
    successMessage.style.display = "none";
  }, 5000);
}

function simulateSuccess() {
  // ボットには通常の成功レスポンスを見せる

  setTimeout(() => {
    showSuccessMessage();

    document.getElementById("contactForm").reset();
  }, 1500);
}

// XSS対策のエスケープ処理

function escapeHTML(str) {
  return str

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
}
