# Cye (/sʌɪ/)

Cye is a small circuit-breaker app for the moment you reach for your phone out
of habit. Open it for a gentle prompt to pause, look away from the screen, or
try a small activity. Prompts can be tailored to preferences saved during setup.

Preferences are stored in the browser on the device using `localStorage`; the
app does not currently use a server or sync data between devices.
After acknowledging a prompt, Cye stays paused for at least one minute. Set a
longer pause in preferences; the next prompt appears when you reopen or return
to Cye after the pause has elapsed.
If left untouched, a prompt and its button begin to fade after 30 seconds and
fade out over the next minute. The configured pause begins when the fade
finishes.
Reloading Cye while a prompt is showing starts the configured pause instead
of displaying a different prompt.

When task nudges are enabled, you can add recurring chores and one-time tasks
in preferences. Recurring chores can be suggested repeatedly; mark one-time
tasks done in preferences, or check “Mark this task done” on a one-time prompt
before acknowledging it. Both lists are stored locally and remain saved while
task nudges are turned off. New users start with a few example recurring
chores, and short recurring prompts may get a gentle randomized prefix or
suffix; one-time task wording is left as entered.

## Run locally

You need Node.js (LTS) and npm. From the repository root:

```sh
cd phone-pause
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite enables hot reload
while you edit the source.

To try it on a phone connected to the same Wi-Fi, find this computer's local
network IP address and open `http://<computer-ip>:5173` in the phone's browser.
The dev server listens on network interfaces for this purpose.

## Install as an app

The app includes a web app manifest, Android-sized icons, and an Apple touch
icon. Deploy it over HTTPS, then use the browser's "Install app" option on
Android or "Add to Home Screen" in Safari on iOS. Localhost is treated as a
secure context, but the local network address uses HTTP, so install options
may be limited when testing on a phone.

## Deploy to GitHub Pages

The GitHub Actions workflow deploys this app to
[https://stringfellow.github.io/cye/](https://stringfellow.github.io/cye/)
when changes to `phone-pause/` are pushed to the `basics` branch. It can also be
started manually from the repository's Actions tab. In the repository settings,
set Pages' build and deployment source to **GitHub Actions**.

The production build pre-caches the app shell and icons with a service worker,
so after the first successful online visit, the app can be opened offline.
Preferences remain stored locally in the browser on each device. The service
worker is only enabled in production builds; the Vite development server does
not register it.

To try the offline build locally, from `phone-pause/` run `npm run build`
followed by `npm run preview`, open the preview on
`http://localhost:4173`, and wait for the service worker to install. Reload
once, then use the browser's offline mode and reload again to check that the
cached app shell opens.

## Run with Docker

With Docker Desktop running, start the development server from the repository
root:

```sh
docker run --detach \
  --name phone-pause-dev \
  --restart unless-stopped \
  --publish 5173:5173 \
  --publish 4173:4173 \
  --volume "$PWD/phone-pause":/app \
  --volume phone-pause-node-modules:/app/node_modules \
  --workdir /app \
  node:lts-bookworm-slim \
  sh -c 'npm ci && npm run build && npm run dev -- --host 0.0.0.0'
```

The project directory is mounted into the container, so source edits are
available to Vite without rebuilding the image. Visit
[http://localhost:5173](http://localhost:5173) on the computer, or use its
local network IP on a phone on the same Wi-Fi.

To test the production offline build in Docker, build the app and start its
preview server:

```sh
docker exec phone-pause-dev npm run build
docker exec --detach phone-pause-dev npm run preview -- --host 0.0.0.0 --port 4173
```

Open [http://localhost:4173](http://localhost:4173), wait for the service worker
to install, and reload before testing with the browser's offline mode.

Useful container commands:

```sh
docker logs -f phone-pause-dev
docker stop phone-pause-dev
docker start phone-pause-dev
```

## Other commands

```sh
cd phone-pause
npm run build    # Create a production build in dist/
npm run preview  # Serve the production build locally
npm run lint     # Run ESLint
```

The current codebase has existing lint errors; `npm run lint` reports them.
