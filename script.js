const map = L.map('map', {
    minZoom: 2,
}).setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
fetch(`http://api.open-notify.org/iss-now.json`)
  .then(response => response.json())
  .then(data => {
    const lat = parseFloat(data.iss_position.latitude);
    const lon = parseFloat(data.iss_position.longitude);

    L.marker([lat, lon]).addTo(map)
      .bindPopup('The ISS is here!')
      .openPopup();

    map.setView([lat, lon], 4);    console.log(data);
  });