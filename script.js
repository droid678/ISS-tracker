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
  document.getElementById('user-location').textContent = `Your location: ${lat.toFixed(2)}, ${lon.toFixed(2)}`;

  if (userMarker === null) {
    userMarker = L.marker([lat, lon], {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      })
    }).addTo(map).bindPopup('Your location').openPopup();
  } else {
    userMarker.setLatLng([lat, lon]);
  }

  console.log('User location set:', userLocation);

  findNextPass();
});

const terminator = L.terminator({
  fillColor: '#00000a',
  fillOpacity: 0.4,
  stroke: false
}).addTo(map);

setInterval(() => {
  terminator.setTime();
}, 60000);

const satelliteIcon = L.icon({
  iconUrl: 'assets/satellite.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

let issMarker = null;
let issTrail = [];
let trailLine = null;

function updateISSPosition() {
  fetch('https://api.wheretheiss.at/v1/satellites/25544')
    .then(response => response.json())
    .then(data => {
      const lat = data.latitude;
      const lon = data.longitude;

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

function findNextPass() {
  if (userLocation === null) {
    console.log('Need a clicked location first.');
    return;
  }

  const url = `https://iss-api.polluxlabs.io/iss-pass?lat=${userLocation.lat}&lon=${userLocation.lon}&alt=0&n=5`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const nextPass = data.passes[0];

      if (!nextPass) {
        document.getElementById('pass-result').textContent = 'No upcoming passes found for this location.';
        return;
      }
      const riseTime = new Date(nextPass.rise.time);
      const durationMin = Math.round(nextPass.duration_sec / 60);
      const visible = nextPass.visible ? '👁️ Visible to the eye' : 'Not visible (daylight or in shadow)';

      document.getElementById('pass-result').textContent =
        `Next pass: ${riseTime.toLocaleString()} — lasts ~${durationMin} min — ${visible}`;
    })
    .catch(error => {
      document.getElementById('pass-result').textContent = 'Could not fetch pass data right now.';
      console.log(error);
    });
}