# 4FUNSODA

Strona wizytówka marki **4FUNSODA** – wymiana cylindrów CO₂ do saturatorów.
Operator: **Druk-Styl** (NIP 5621805300, ul. Słoneczna 2 lok. 2, 88-192 Piechcin, tel. +48 578 424 517).

Stack: **Vite + React + Tailwind CSS + Leaflet**. Motyw graficzny: *Aurora Glass* (jasny, premium, glassmorphism) – wariant niebieski.
Formularze: **PHP `mail()`** – endpointy `public/api/contact.php` i `public/api/b2b.php` (identycznie jak na sodawave). Strony miast (SEO): generowane automatycznie.

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

## Wdrożenie na hostingu z PHP (seohost / LiteSpeed – jak sodawave)

1. Zbuduj projekt lokalnie: `npm run build`.
2. Wgraj **całą zawartość katalogu `dist/`** na serwer (do katalogu domeny), łącznie z:
   - `dist/api/contact.php` i `dist/api/b2b.php` – wysyłka maili,
   - `dist/.htaccess` – HTTPS, przekierowania, fallback SPA, ochrona `/api/`.
   > Uwaga: `.htaccess` to plik ukryty – upewnij się, że menedżer plików / FTP go pokazuje i przesyła.
3. Formularze **Kontakt** i **Współpraca B2B** wysyłają zgłoszenia mailem na adres
   ustawiony w plikach PHP (`$mailTo = '4funsoda@4funsoda.pl'`).

### E-mail z formularzy
Adres docelowy zmienisz w `public/api/contact.php` i `public/api/b2b.php` (stała `$mailTo`).
Jeśli hosting wymaga, aby nadawca (`From`) był kontem istniejącym na serwerze,
zmień nagłówek `From:` w obu plikach na taki adres (np. konto serwerowe).

### Domena i dane do podmiany
- Domena `4funsoda.pl` – w `index.html`, `robots.txt`, generatorze stron miast
  (`scripts/generate-city-pages.mjs`, stała `SITE`) oraz w `$allowed` (CORS) w plikach PHP.
- E-mail i linki społecznościowe: `src/FunSoda.jsx`, obiekt `BRAND`.
- Logo/grafiki: `public/logo-4funsoda*.png`, `public/zespol.png`, `public/cylinder-*.png`,
  `public/og-image.png`, `public/favicon.svg`.

---

## Struktura

```
4funsoda/
├─ index.html                     # HTML + meta SEO (+ structured data)
├─ public/
│  ├─ .htaccess                   # HTTPS, przekierowania, fallback SPA, ochrona /api
│  ├─ api/                        # endpointy PHP: contact.php, b2b.php (mail())
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
