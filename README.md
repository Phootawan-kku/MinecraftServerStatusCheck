# Plub & Friend Survival Server - Status Page

A small static website that shows the live status of a Minecraft Java server: whether it is online, how many players are connected, and (when the server shares them) the usernames of everyone online.

The design is a modern layout built around a pixel-art landscape: a daytime scene with drifting clouds when the server is online, which turns into a starry night when it is offline. Below it, the page sits on a dirt texture with light cards, a hotbar-style capacity meter, and player tiles with Minecraft-style name tags.

## Features

- Online / Offline status with a pulsing indicator
- Player count with a hotbar-style capacity meter (for example `3/20`)
- Day and night landscape that follows the server status
- Usernames of online players, each with their Minecraft head and a name tag
- Search box for the player list (appears when 6 or more players are online)
- Server MOTD, version, and software shown when available
- Copy-address button and manual Refresh button
- Auto-refresh every 30 seconds
- Loading placeholders and clear messages for empty, offline, and error states
- Responsive layout for phones and desktops
- Respects the "reduce motion" system setting

## Files

```
index.html    Page structure (the HTML)
style.css     All styling
script.js     Settings, landscape drawing, status fetching and rendering
README.md     This file
```

Keep the three site files in the same folder. There is no build step and nothing to install.

## Quick start

1. Download `index.html`, `style.css`, and `script.js` into one folder.
2. Open `index.html` in a web browser (double-click the file).

You need an internet connection, because the page loads data and images from outside services (see "How it works").

## Configuration

Settings are at the top of `script.js`:

```js
const SERVER_HOST = "138.2.92.246";
const SERVER_PORT = 25566;
const SERVER_NAME = "Plub & Friend Survival Server";
const REFRESH_SECONDS = 30;
```

| Setting | What it does |
| --- | --- |
| `SERVER_HOST` | IP address or domain of the Minecraft server |
| `SERVER_PORT` | Server port (Java default is `25565`) |
| `SERVER_NAME` | Title shown on the page and in the browser tab |
| `REFRESH_SECONDS` | How often the page re-checks the server |

Keep `REFRESH_SECONDS` at 30 or higher so the free status services are not overloaded.

### Changing colors

The card and accent colors are CSS variables at the top of `style.css`. For example, change `--emerald` and `--emerald-d` to switch the green accent (buttons, capacity meter) to another color. The landscape itself is drawn in the `drawScene` function in `script.js`, where the sky, hill, grass, and dirt colors can be edited.

## Deploying

It is a static site (three files, no backend), so it works on any static host. Upload all three site files together:

- **GitHub Pages:** put the files in a repository and enable Pages in the repository settings.
- **Netlify or Cloudflare Pages:** drag and drop the folder containing the files into a new site.
- **Your own web server:** copy the files into your web root (Nginx, Apache, and similar).

## How it works

The page runs entirely in the visitor's browser. It does not have a backend.

1. It requests the server status from the public [mcsrvstat.us](https://mcsrvstat.us) API.
2. If that request fails, it falls back to the [mcstatus.io](https://mcstatus.io) API.
3. It draws the result and repeats the check on a timer.
4. Player heads are loaded from [mc-heads.net](https://mc-heads.net), using each player's username.
5. Fonts (Outfit and Press Start 2P) are loaded from Google Fonts. If they cannot load, the page falls back to system fonts.

## Limitations

- **Usernames depend on the server.** Many servers, especially ones with certain plugins or a hidden player list, only share the player count. In that case the page shows the count and a note that names are hidden.
- **Partial lists are possible.** Some servers only share a sample of players, so the page may show "Showing 12 of 30 players".
- **Java Edition only.** The checks use the Java status protocol. A Bedrock Edition server would need a different API endpoint.
- **Data can lag slightly.** The status services may cache results for a short time, so the page can be a few moments behind the game.
- **Needs internet access** to reach the status APIs, the font host, and the head image host.

## Troubleshooting

| Problem | Likely cause and fix |
| --- | --- |
| Shows "No data" | The status APIs could not be reached. Check your internet connection and press Refresh. |
| Shows Offline but the server is running | Check that the IP and port are correct and that the port is open in the server's firewall. |
| Count shows but no usernames | The server does not share its player list. This is a server setting, not a page bug. |
| Heads show a default Steve face | The head service could not find that username, which can happen with offline-mode servers or unusual names. |
| Pixel font looks different | Google Fonts did not load. The page still works with a fallback font. |

## Credits

- Status data: [mcsrvstat.us](https://mcsrvstat.us) and [mcstatus.io](https://mcstatus.io)
- Player heads: [mc-heads.net](https://mc-heads.net)
- Fonts: [Outfit](https://fonts.google.com/specimen/Outfit) and [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) via Google Fonts

This is a fan-made project and is not affiliated with Mojang or Microsoft. Minecraft is a trademark of Mojang Synergies AB.
