const params = new URLSearchParams(window.location.search);
const reservationId = params.get("id");

fetch(`https://script.google.com/macros/s/AKfycb.../exec?id=${reservationId}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("reservationDetails").innerHTML = `
      <p>予約ID：${data.id}</p>
      <p>日時：${data.date} ${data.time}</p>
      <p>作業内容：${data.workType}</p>
      <p>車種：${data.carModel}</p>
      <p>備考：${data.note}</p>
    `;
  });