# Cye (/sʌɪ/)

Cye is a small circuit-breaker app for the moment you reach for your phone out
of habit. Open it for a gentle prompt to pause, look away from the screen, or
try a small activity. Prompts can be tailored to preferences saved during setup.

Preferences are stored in the browser on the device using `localStorage`; the
app does not currently use a server or sync data between devices.

## Run locally

You need Node.js (LTS) and npm. From this directory:

```sh
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite enables hot reload
while you edit the source.

To try it on a phone connected to the same Wi-Fi, find this computer's local
network IP address and open `http://<computer-ip>:5173` in the phone's browser.
The dev server listens on network interfaces for this purpose.

## Run with Docker

With Docker Desktop running, start the development server from this directory:

```sh
docker run --detach \
  --name phone-pause-dev \
  --restart unless-stopped \
  --publish 5173:5173 \
  --volume "$PWD":/app \
  --volume phone-pause-node-modules:/app/node_modules \
  --workdir /app \
  node:lts-bookworm-slim \
  sh -c 'npm ci && npm run build && npm run dev -- --host 0.0.0.0'
```

The project directory is mounted into the container, so source edits are
available to Vite without rebuilding the image. Visit
[http://localhost:5173](http://localhost:5173) on the computer, or use its
local network IP on a phone on the same Wi-Fi.

Useful container commands:

```sh
docker logs -f phone-pause-dev
docker stop phone-pause-dev
docker start phone-pause-dev
```

## Other commands

```sh
npm run build    # Create a production build in dist/
npm run preview  # Serve the production build locally
npm run lint     # Run ESLint
```

The current codebase has existing lint errors; `npm run lint` reports them.
