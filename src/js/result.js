// JSONデータを直接JavaScriptに埋め込む方法
document.addEventListener("DOMContentLoaded", function () {
  // JSONデータを直接定義
  const data = [
    {
      country: "🇫🇷",
      name: "Mt. Ventoux Climb Classic",
      location: "フランス",
      distance: "21.1 km",
      elevation: "1,610 m",
      grade: "UCI HC",
      results: [
        { rank: "🏆 優勝", name: "Luca Moretti 🇮🇹" },
        { rank: "🥈 2位", name: "佐藤 悠真 🇯🇵" },
        { rank: "🏅 5位", name: "James Carter 🇺🇸" },
      ],
    },
    {
      country: "🇯🇵",
      name: "Tour de Fuji Hill",
      location: "日本",
      distance: "24.0 km",
      elevation: "1,270 m",
      grade: "国内トップカテゴリー",
      results: [
        { rank: "🏆 優勝", name: "鈴木 颯太 🇯🇵" },
        { rank: "🏅 4位", name: "Javier Rodríguez 🇪🇸" },
        { rank: "🏅 6位", name: "William Thompson 🇬🇧" },
      ],
    },
  ];

  // 以下の処理は前と同じ
  const resultsContainer = document.querySelector(".race-results");
  data.forEach((race) => {
    let raceHTML = `
      <div class="race">
        <h3>${race.country} ${race.name} （${race.location}）</h3>
        <p class="distance">📏 距離: ${race.distance} | ⛰ 標高差: ${race.elevation} | 🏆 グレード: ${race.grade}</p>
        <div class="results">
    `;
    race.results.forEach((result) => {
      raceHTML += `<div class="result"><span class="rank">${result.rank}</span> <span class="name">${result.name}</span></div>`;
    });
    raceHTML += `</div></div>`;
    resultsContainer.innerHTML += raceHTML;
  });
});
