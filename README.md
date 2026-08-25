# 4FUNSODA

Strona wizytówka marki **4FUNSODA** – wymiana cylindrów CO₂ do saturatorów.
Operator: **Druk-Styl** (NIP 5621805300, ul. Słoneczna 2 lok. 2, 88-192 Piechcin, tel. +48 578 424 517).

Stack: **Vite + React + Tailwind CSS + Leaflet**. Motyw graficzny: *Aurora Glass* (jasny, premium, glassmorphism).
Formularze: **Netlify Forms** (kontakt + B2B). Strony miast (SEO): generowane automatycznie.

---

## Szybki start (lokalnie)

```bash
npm install
npm run dev
```

Aplikacja: http://localhost:5173

## Build produkcyjny

```bash
npm run build      # najpierw generuje strony miast (prebuild), potem buduje do /dist
npm run preview    # podgląd zbudowanej wersji
```

`npm run build` automatycznie uruchamia `generate:cities`, który tworzy:
- `public/m/<miasto>/index.html` – strony SEO per miasto (czyste adresy `/m/lukow/`),
- `public/m/index.html` – hub ze wszystkimi miastami,
- `public/sitemap.xml`.

Te pliki są generowane, dlatego są w `.gitignore` (odtwarzają się przy każdym buildzie).

---

## Wdrożenie na Netlify (GitHub)

1. Utwórz repozytorium na GitHubie i wypchnij zawartość tego folderu:
   ```bash
   git init
   git add .
   git commit -m "4FUNSODA – pierwsza wersja"
   git branch -M main
   git remote add origin https://github.com/<uzytkownik>/<repo>.git
   git push -u origin main
   ```
2. W Netlify: **Add new site → Import an existing project → GitHub** i wybierz repo.
3. Ustawienia buildu wykryją się z `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy. Formularze (kontakt, B2B) pojawią się w panelu **Netlify → Forms**.

### Domena i dane do podmiany przed publikacją
- Domena `4funsoda.pl` jest użyta jako placeholder w `index.html`, `robots.txt`,
  `public/... sitemap` i w `scripts/generate-city-pages.mjs` (stała `SITE`). Podmień na docelową.
- E-mail `kontakt@4funsoda.pl` oraz linki do Instagrama/Facebooka (`src/FunSoda.jsx`, obiekt `BRAND`) – uzupełnij.
- Grafiki są w 100% wektorowe (SVG) – brak zależności od zdjęć. Logo można podmienić w `LogoMark` / `public/favicon.svg`.

### Powiadomienia e-mail o zgłoszeniach z formularzy
Netlify → **Forms → Form notifications → Add notification → Email** i podaj adres,
na który mają przychodzić zgłoszenia z formularzy `kontakt` i `b2b`.

---

## Struktura

```
4funsoda/
├─ index.html                     # HTML + meta SEO + ukryte formularze dla Netlify
├─ netlify.toml                   # konfiguracja build/redirects/headers
├─ public/
│  ├─ favicon.svg                 # logo/marker (gradient aurora)
│  ├─ robots.txt
│  └─ m/, sitemap.xml             # (generowane przy buildzie)
├─ scripts/
│  └─ generate-city-pages.mjs     # generator stron miast + sitemap
└─ src/
   ├─ main.jsx
   ├─ index.css                   # design tokens Aurora Glass + animacje
   ├─ FunSoda.jsx                 # cała strona (sekcje + grafiki SVG)
   ├─ data/locations.js           # 95 punktów (lat/lng/adres/godziny)
   └─ lib/cities.js               # slug, region, odmiana miejscownika
```
