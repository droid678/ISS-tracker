const map = L.map('map', {
    minZoom: 2
}).setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let issMarker = null;
let issTrail = [];
let trailLine = null;
const satelliteIcon = L.icon({
  iconUrl: 'assets/satellite.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

function updateISSPosition() {
  fetch('http://api.open-notify.org/iss-now.json')
    .then(response => response.json())
    .then(data => {
      const lat = parseFloat(data.iss_position.latitude);
      const lon = parseFloat(data.iss_position.longitude);

      document.getElementById('coords').textContent = `Latitude: ${lat.toFixed(2)}, Longitude: ${lon.toFixed(2)}`;

      issTrail.push([lat, lon]);
      if (issTrail.length > 20) {
        issTrail.shift();
      }

      if (trailLine === null) {
        trailLine = L.polyline(issTrail, { color: 'red' }).addTo(map);
      } else {
        trailLine.setLatLngs(issTrail);
      }

      if (issMarker === null) {
        issMarker = L.marker([lat, lon], { icon: satelliteIcon }).addTo(map)
          .bindPopup('The ISS is here!');
        map.setView([lat, lon], 4);
      } else {
        issMarker.setLatLng([lat, lon]);
      }

      console.log('Updated position:', lat, lon);
    });
}

updateISSPosition();
setInterval(updateISSPosition, 5000);