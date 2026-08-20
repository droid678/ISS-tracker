const map = L.map('map', {
    minZoom: 2
}).setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let userLocation = null;
let userMarker = null;

map.on('click', function(event) {
  const lat = event.latlng.lat;
  const lon = event.latlng.lng;

  userLocation = { lat: lat, lon: lon };
  document.getElementById('user-location').textContent = 'Your location: ${lat.toFixed(2)}, ${lon.toFixed(2)}';

  if (userMarker === null) {
    userMarker = L.marker([lat, lon], {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30]      
      })
    }).addTo(map).bindPopup('Your location').openPopup();
  } else {
    userMarker,setLatLng([lat, lon]);
  }

  console.log('User location set:', userLocation);
});

const terminator = L.terminator({
  fillColor: '#00000a',
  fillOpacity: 0.4,
  stroke: false
}).addTo(map);

setInterval(() => {
  terminator.setTime();
}, 60000);

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

let satrec = null;

function fetchTLE() {
  fetch('https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE')
    .then(response => response.text())
    .then(tleText => {
      const lines = tleText.trim().split('\n');
      const line1 = lines[1];
      const line2 = lines[2];

      satrec = satellite.twoline2satrec(line1, line2);
      console.log('TLE loaded, satrec ready:', satrec)
    });
}

fetchTLE();