# 4FUNSODA

Strona wizytówka marki **4FUNSODA** – wymiana cylindrów CO₂ do saturatorów.
Operator: **Druk-Styl** (NIP 5621805300, ul. Słoneczna 2 lok. 2, 88-192 Piechcin, tel. +48 578 424 517).

Stack: **Vite + React + Tailwind CSS + Leaflet**. Motyw graficzny: *Aurora Glass* (jasny, premium, glassmorphism) – wariant niebieski.
Formularze: **FormSubmit** (Kontakt + B2B) – zgłoszenia idą mailem na `4funsoda@4funsoda.pl`, bez backendu i bez planu Netlify Pro. Strony miast (SEO): generowane automatycznie.

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

1. Repo połączone z Netlify – push na `main` uruchamia build.
2. Ustawienia buildu wykrywają się z `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### E-mail z formularzy (FormSubmit – bez planu Pro)
Formularze **Kontakt** i **Współpraca B2B** wysyłają zgłoszenia przez
[FormSubmit](https://formsubmit.co) na adres z `FORMSUBMIT_TARGET` w `src/FunSoda.jsx`
(`4funsoda@4funsoda.pl`).

> **Jednorazowa aktywacja:** po pierwszej wysłanej wiadomości FormSubmit przyśle na tę
> skrzynkę e-mail z linkiem aktywacyjnym – trzeba w niego kliknąć, żeby kolejne
> zgłoszenia dochodziły. Po aktywacji, aby nie trzymać adresu jawnie w kodzie, można
> podmienić `FORMSUBMIT_TARGET` na losowy **alias** z panelu FormSubmit.

### Domena i dane do podmiany
- Domena `4funsoda.pl` – w `index.html`, `robots.txt` i generatorze stron miast
  (`scripts/generate-city-pages.mjs`, stała `SITE`).
- E-mail i linki społecznościowe: `src/FunSoda.jsx`, obiekt `BRAND`.
- Logo/grafiki: `public/logo-4funsoda*.png`, `public/zespol.png`, `public/cylinder-*.png`,
  `public/og-image.png`, `public/favicon.svg`.

---

## Struktura

```
4funsoda/
├─ index.html                     # HTML + meta SEO (+ structured data)
├─ netlify.toml                   # build / redirects / nagłówki
├─ public/
│  ├─ logo-4funsoda*.png          # logo (kolor + biały wariant na ciemne tło)
│  ├─ zespol.png, cylinder-*.png  # zdjęcia: zespół + butelki
│  ├─ og-image.png                # obraz Open Graph 1200×630
│  ├─ favicon.svg                 # favicon/marker (bąbelki, niebieski)
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
