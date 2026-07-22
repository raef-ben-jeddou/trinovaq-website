# TrinovaQ Website

Marketing site for TrinovaQ. The site is authored as small components under `src/` and compiled into a single self-contained `dist/index.html` (fonts and styles inlined, no external assets except the demo-request form's call to Supabase).

## Editing the site

Everything lives in `src/`:

| File | What it holds |
|------|---------------|
| `src/index.html` | Page shell. Assembles the sections with `<!-- @include ... -->` markers. |
| `src/styles.css` | All CSS. |
| `src/main.js` | All JavaScript (theme toggle, animations, silk background, demo form). |
| `src/config.json` | Supabase URL and public key for the demo form. |
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

The "Request a demo" form writes to a Supabase table (`demo_requests`). View or export the submissions in the Supabase dashboard:

- Table editor: https://supabase.com/dashboard/project/ptwurabluawmmzxqbuaj/editor → `demo_requests`

The key in `src/config.json` is Supabase's *publishable* (anon) key: it is safe to keep in a public repository because the database's row-level security policy only allows inserts, never reads, through it.
