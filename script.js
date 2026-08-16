const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
fetch(`http://api.open-notify.org/iss-now.json`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });