# ISS Live Tracker 🛰️

**🔴 Live demo:** [https://droid678.github.io/ISS-tracker/](https://droid678.github.io/ISS-tracker/)

![ISS Tracker Screenshot](screenshot.png)

A real-time web app that tracks the International Space Station's position on a live map, and predicts exactly when it'll be visible from anywhere on Earth. Built for NASA's Stardance Challenge.

## Features

- **Live ISS position**, updated every few seconds, plotted on an interactive world map
- **Custom satellite marker** with a trail line showing the ISS's recent path
- **Real-time day/night shading**, calculated from the sun's actual current position
- **Click-to-predict**: click anywhere on the map to set a location, and see the next time the ISS will pass overhead — including whether it'll actually be visible to the naked eye (dark sky + sunlit station), not just "passing over"
- Dark-themed dashboard UI

## How it works

- Live position data comes from the [Where The ISS At API](https://api.wheretheiss.at/), plotted using [Leaflet.js](https://leafletjs.com/)
- Day/night shading uses [Leaflet.Terminator](https://github.com/joergdietrich/Leaflet.Terminator), which calculates the sun's real position
- Pass predictions come from the [Pollux Labs ISS Pass API](https://iss-api.polluxlabs.io/), a free, CORS-enabled successor to the old Open Notify pass-prediction service

## Tech stack

- Plain HTML, CSS, and JavaScript — no frameworks
- Leaflet.js for mapping
- Public REST APIs for live ISS data and pass predictions
- Hosted free on GitHub Pages

## Running it locally

1. Clone this repo
2. Open `index.html` with a local server (e.g. VS Code's Live Server extension) — a local server is required for `fetch()` requests to work correctly
3. No build step, no dependencies to install

## What I learned building this

This was my first real shipped project — starting from scratch with just HTML/CSS/JS basics. Along the way I debugged real issues like mixed-content blocking (HTTP vs HTTPS), case-sensitivity bugs between Windows and Linux file systems, and API reliability differences between local and deployed environments.

## Built by

Karthik for NASA Stardance Challenge 2026