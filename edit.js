// URLから予約IDを取得
function getReservationId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// GASから予約情報を取得
async function fetchReservationData(reservationId) {
  const endpoint = "https://script.google.com/macros/s/AKfycbyE1-J7AqYT9v5SwHZtcC-SjH73CI11KG8jR0dES6fOkEMnZhvsx9gMplEHatxVNRaFaw/exec";
  const url = `${endpoint}?action=get&id=${reservationId}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("取得失敗:", err);
    alert("予約情報の取得に失敗しました。");
  }
}

// フォームに反映
function populateForm(data) {
  document.querySelector("#name").value = data.name || "";
  document.querySelector("#phone").value = data.phone || "";
  document.querySelector("#email").value = data.email || "";
  document.querySelector("#carModel").value = data.carModel || "";
  document.querySelector("#workType").value = data.workType || "";
  document.querySelector("#note").value = data.note || "";

  // 日付（そのまま表示）
  document.querySelector("#date").value = data.date || "";

  // 時刻（1899年問題を回避して、時刻だけ表示）
  if (data.time) {
    const timeObj = new Date(data.time);
    const hours = timeObj.getHours().toString().padStart(2, "0");
    const minutes = timeObj.getMinutes().toString().padStart(2, "0");
    document.querySelector("#time").value = `${hours}:${minutes}`;
  }
}

document.querySelector("#loading").style.display = "none";
document.querySelector("#edit-form").style.display = "block";



// 初期化処理
window.addEventListener("DOMContentLoaded", async () => {
  const id = getReservationId();
  if (!id) {
    alert("予約IDが見つかりません。");
    return;
  }

  const data = await fetchReservationData(id);
  if (!data) return;

  if (data.error) {
    alert("予約情報が見つかりませんでした。");
    return;
  }

  populateForm(data);

  // ? 表示切り替えはここで！
  document.querySelector("#loading").style.display = "none";
  document.querySelector("#edit-form").style.display = "block";

  // フォームイベント登録
  const form = document.querySelector("#edit-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const updatedData = new URLSearchParams({
        action: "update",
        id: getReservationId(),
        name: document.querySelector("#name").value,
        date: document.querySelector("#date").value,
        phone: document.querySelector("#phone").value,
        email: document.querySelector("#email").value,
        carModel: document.querySelector("#carModel").value,
        workType: document.querySelector("#workType").value,
        note: document.querySelector("#note").value,
        selectedDateTime: document.querySelector("#date").value + " " + document.querySelector("#time").value
      });

      const endpoint = "https://script.google.com/macros/s/AKfycbyE1-J7AqYT9v5SwHZtcC-SjH73CI11KG8jR0dES6fOkEMnZhvsx9gMplEHatxVNRaFaw/exec";

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: updatedData,
        });
        const resultText = await res.text();
        alert(resultText);
      } catch (err) {
        console.error("更新失敗:", err);
        alert("更新に失敗しました。");
      }
    });
  }
});