# TrinovaQ Website

Marketing site for TrinovaQ. The site is authored as small components under `src/` and compiled into a single self-contained `dist/index.html` (fonts and styles inlined, no external assets except the demo-request form's call to a Google Apps Script web app).

## Editing the site

Everything lives in `src/`:

| File | What it holds |
|------|---------------|
| `src/index.html` | Page shell. Assembles the sections with `<!-- @include ... -->` markers. |
| `src/styles.css` | All CSS. |
| `src/main.js` | All JavaScript (theme toggle, animations, silk background, demo form). |
| `src/config.json` | `formEndpoint`: the Apps Script web app URL the demo form posts to. |
| `apps-script/Code.gs` | The Apps Script that receives demo requests (stores them in a Google Sheet, emails the team). Not part of the site build. |
| `src/partials/*.html` | One file per section: `nav`, `hero`, `what-we-do`, `problem`, `mission`, `cta`, `footer`, `background`. |
| `assets/fonts/*.woff2` | Brand fonts, embedded at build time. |

To change wording, open the matching partial (e.g. edit the hero text in `src/partials/hero.html`). To change a color or spacing, edit `src/styles.css`.

## Build and preview locally

Requires [Node.js](https://nodejs.org) (v18 or newer). No packages to install.

```bash
npm run build
```

This writes `dist/index.html`. Open that file in a browser, or serve the folder:

```bash
npx http-server dist -p 4173
```

## Deployment

Pushing to the `main` branch triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`, which runs `node build.mjs` and publishes `dist/` to GitHub Pages. No manual build or upload is needed.

**One-time setup:** in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.

## Demo-request submissions

The "Request a demo" form posts to a Google Apps Script web app (`apps-script/Code.gs`). Each request is added as a row to the `demo_requests` tab of a Google Sheet, and a notification email is sent to Contact@trinovaq.io (reply to it to answer the requester directly). Google's free quotas never pause the script, unlike the free database tier used before.

### One-time setup

1. In the Google account that should own the data, create a Google Sheet (e.g. "TrinovaQ demo requests").
2. In the Sheet, open **Extensions → Apps Script**. Replace the editor contents with `apps-script/Code.gs` and save. (If you use a standalone project from script.google.com instead, set `SHEET_ID` at the top of the script to the Sheet's ID, the part of its URL between `/d/` and `/edit`, and make sure the script runs under a Google account that can edit the Sheet.)
3. Pick `setup` in the function dropdown and click **Run**. Approve the permissions prompt (the script needs the Sheet and "send email as you"). This creates the `demo_requests` tab and its header row.
4. Click **Deploy → New deployment**, choose type **Web app**, set **Execute as: Me** and **Who has access: Anyone**, then **Deploy**. Copy the **Web app URL** (it ends in `/exec`).
5. Paste that URL into `src/config.json` as `formEndpoint` and push to `main`.

If **Anyone** is missing from the access options, a Google Workspace admin policy is blocking public web apps: ask the admin to allow it, or deploy from an account that permits it.

The build refuses to run until `formEndpoint` is a real `https://script.google.com/macros/s/.../exec` URL, so a placeholder can never ship.

### Changing the script later

Edit the code in the Apps Script editor (and mirror the change in `apps-script/Code.gs`), then **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. This keeps the same URL, so the site needs no change. Creating a *new* deployment instead would give a new URL.

### Is the URL safe to be public?

Yes. It is visible in the page source either way. It is write-only: it cannot read the Sheet, and it only stores requests that pass validation (name + valid email, length limits, honeypot). Values are escaped so that text such as `=HYPERLINK(...)` is stored as plain text, never run as a formula.
