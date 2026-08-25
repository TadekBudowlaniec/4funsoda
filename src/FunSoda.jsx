import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import L from "leaflet";
import { funSodaLocations } from "./data/locations.js";
import { extractCity, slugify } from "./lib/cities.js";

export { funSodaLocations };

import {
  MapPin, Phone, Mail, Menu, X, Droplets, Leaf, Award, ChevronDown,
  ChevronLeft, Building2, ArrowRight, Star, Zap, Sparkles, Recycle,
  Facebook,
} from "lucide-react";

// ─── BRAND ──────────────────────────────────────────────────────────────────
const BRAND = {
  name: "4FUNSODA",
  tagline: "Bąbelki pełne frajdy",
  phoneDisplay: "+48 578 424 517",
  phoneHref: "tel:+48578424517",
  email: "kontakt@4funsoda.pl",
  company: "Druk-Styl",
  nip: "5621805300",
  street: "ul. Słoneczna 2 lok. 2",
  city: "88-192 Piechcin",
  domain: "4funsoda.pl",
  facebook: "https://www.facebook.com/profile.php?id=100069558743389&locale=pl_PL",
};

// ─── AURORA PALETTE ─────────────────────────────────────────────────────────
const C = {
  violet: "#7C5CFF",
  blue: "#3B82F6",
  cyan: "#22D3EE",
  ink: "#0B1020",
  muted: "#5B6178",
  bg: "#F7F8FF",
  pink: "#EC4899",
  glass: "rgba(255,255,255,0.62)",
  glassStrong: "rgba(255,255,255,0.85)",
  border: "rgba(124,92,255,0.16)",
  aurora: "linear-gradient(120deg, #7C5CFF 0%, #3B82F6 52%, #22D3EE 100%)",
};

const NAV_LINKS = [
  { label: "Start", href: "#hero" },
  { label: "Mapa punktów", href: "#map" },
  { label: "O nas", href: "#about" },
  { label: "Oferta", href: "#offer" },
  { label: "Współpraca B2B", href: "#b2b" },
];

const scroll = (href) =>
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

// Domyślny widok mapy – wyśrodkowany na Bydgoszczy (ul. Gdańska, centrum).
const BYDGOSZCZ_CENTER = [53.1235, 18.0084];
const BYDGOSZCZ_ZOOM = 12;

const MAP_POINTS = funSodaLocations.map((p) => ({
  ...p,
  position: [p.lat, p.lng],
  city: extractCity(p.address),
  citySlug: slugify(extractCity(p.address)),
}));

const CITY_SLUGS_WITH_PAGE = new Set(MAP_POINTS.map((p) => p.citySlug));

const FAQ_ITEMS = [
  { question: "Czym różni się cylinder różowy od niebieskiego?", type: "long" },
  {
    question: "Jak działa wymiana cylindra CO₂?",
    answer:
      "Przynosisz pusty cylinder do punktu 4FUNSODA i od razu wymieniasz go na pełny. Cały proces jest szybki i prosty.",
  },
  {
    question: "Czy muszę wcześniej coś zamawiać lub się rejestrować?",
    answer: "Nie. Wymiana odbywa się od ręki, bez zamawiania i bez formalności.",
  },
  {
    question: "Jakie cylindry mogę wymienić?",
    answer:
      "Wymieniamy cylindry pasujące do wszystkich saturatorów dostępnych na rynku, w tym modele wkręcane oraz Quick Connect.",
  },
  {
    question: "Czy gaz w cylindrach jest bezpieczny?",
    answer:
      "Tak. Wszystkie cylindry to certyfikowany, bezpieczny gaz spożywczy CO₂.",
  },
  {
    question: "Gdzie znajdę punkty wymiany 4FUNSODA?",
    answer:
      "Nasze punkty znajdują się w wielu miastach, a sieć stale się rozwija. Aktualne lokalizacje znajdziesz na naszej mapie.",
  },
  {
    question: "Czy korzystanie z 4FUNSODA jest bardziej ekologiczne?",
    answer:
      "Tak. Wymiana cylindrów i korzystanie z saturatorów ogranicza zużycie jednorazowych plastikowych butelek i wspiera gospodarkę obiegu zamkniętego.",
  },
  {
    question: "Ile trwa wymiana cylindra?",
    answer: "Zazwyczaj tylko chwilę – tyle, ile standardowa obsługa w punkcie.",
  },
  {
    question: "Gdzie wymienić cylinder CO₂ w Bydgoszczy i okolicach?",
    answer:
      "Wymiana cylindrów CO₂ w Bydgoszczy, Inowrocławiu, Nakle nad Notecią, Solcu Kujawskim i okolicznych miastach jest dostępna w punktach 4FUNSODA. Sprawdź mapę, aby znaleźć najbliższy punkt.",
  },
  {
    question: "Czy mogę wymienić cylinder w Toruniu lub Inowrocławiu?",
    answer:
      "Tak. Punkty wymiany cylindrów CO₂ 4FUNSODA działają zarówno w Toruniu, jak i w Inowrocławiu. Wymiana jest możliwa od ręki w godzinach otwarcia sklepów.",
  },
  {
    question: "W jakich miastach w Polsce mogę wymienić cylinder 4FUNSODA?",
    answer:
      "4FUNSODA posiada punkty wymiany cylindrów CO₂ w wielu miastach, m.in. w Bydgoszczy, Toruniu, Inowrocławiu, Warszawie, Łukowie, Siedlcach i wielu innych. Pełną listę lokalizacji znajdziesz na naszej mapie.",
  },
];

const SEO_REGIONS = [
  { name: "Województwo Kujawsko-Pomorskie", cities: ["Aleksandrów Kujawski","Barcin","Bydgoszcz","Chełmno","Chełmża","Ciechocinek","Dobrzyń nad Wisłą","Golub-Dobrzyń","Górzno","Grudziądz","Inowrocław","Jabłonowo Pomorskie","Janikowo","Kamień Krajeński","Koronowo","Kowalewo Pomorskie","Kruszwica","Lipno","Mogilno","Mrocza","Nakło nad Notecią","Nieszawa","Nowe","Pakość","Piotrków Kujawski","Radziejów","Rypin","Solec Kujawski","Strzelno","Świecie","Toruń","Tuchola","Wąbrzeźno","Więcbork","Włocławek","Żnin"] },
  { name: "Województwo Mazowieckie", cities: ["Białobrzegi","Błonie","Brwinów","Ciechanów","Garwolin","Gostynin","Góra Kalwaria","Grodzisk Mazowiecki","Grójec","Halinów","Józefów","Karczew","Kobyłka","Konstancin-Jeziorna","Kozienice","Legionowo","Łaskarzew","Łochów","Łomianki","Łosice","Milanówek","Mińsk Mazowiecki","Mława","Mszczonów","Nasielsk","Nowy Dwór Mazowiecki","Otwock","Piaseczno","Piastów","Pionki","Płock","Płońsk","Pruszków","Pułtusk","Radom","Siedlce","Sierpc","Sochaczew","Sokołów Podlaski","Sulejówek","Szydłowiec","Tarczyn","Warszawa","Warka","Węgrów","Wołomin","Wyszków","Ząbki","Zielonka","Żyrardów"] },
  { name: "Województwo Lubelskie", cities: ["Annopol","Bełżyce","Biała Podlaska","Biłgoraj","Chełm","Dęblin","Hrubieszów","Janów Lubelski","Kazimierz Dolny","Kock","Kraśnik","Krasnystaw","Lubartów","Lublin","Łuków","Międzyrzec Podlaski","Nałęczów","Opole Lubelskie","Parczew","Puławy","Radzyń Podlaski","Ryki","Świdnik","Szczebrzeszyn","Terespol","Tomaszów Lubelski","Włodawa","Zamość"] },
  { name: "Województwo Wielkopolskie", cities: ["Chodzież","Czarnków","Gniezno","Gostyń","Grodzisk Wielkopolski","Jarocin","Kalisz","Kępno","Koło","Konin","Kościan","Krotoszyn","Leszno","Międzychód","Mosina","Nowy Tomyśl","Oborniki","Ostrów Wielkopolski","Ostrzeszów","Pleszew","Poznań","Puszczykowo","Rawicz","Rogoźno","Słupca","Szamotuły","Śrem","Środa Wielkopolska","Swarzędz","Turek","Wągrowiec","Wolsztyn","Września","Złotów"] },
  { name: "Województwo Pomorskie", cities: ["Bytów","Chojnice","Człuchów","Gdańsk","Gdynia","Kartuzy","Kościerzyna","Kwidzyn","Lębork","Malbork","Nowy Dwór Gdański","Pruszcz Gdański","Puck","Reda","Rumia","Słupsk","Sopot","Starogard Gdański","Sztum","Tczew","Ustka","Wejherowo","Władysławowo"] },
  { name: "Województwo Zachodniopomorskie", cities: ["Białogard","Choszczno","Darłowo","Drawsko Pomorskie","Goleniów","Gryfice","Gryfino","Kamień Pomorski","Kołobrzeg","Koszalin","Łobez","Międzyzdroje","Myślibórz","Police","Pyrzyce","Sławno","Stargard","Szczecin","Szczecinek","Świdwin","Świnoujście","Trzebiatów","Wałcz","Złocieniec"] },
  { name: "Województwo Dolnośląskie", cities: ["Bielawa","Bogatynia","Bolesławiec","Brzeg Dolny","Dzierżoniów","Głogów","Jawor","Jelenia Góra","Kamienna Góra","Karpacz","Kłodzko","Legnica","Lubań","Lubin","Nowa Ruda","Oleśnica","Oława","Polkowice","Strzegom","Świdnica","Świebodzice","Trzebnica","Wałbrzych","Wołów","Wrocław","Ząbkowice Śląskie","Zgorzelec","Złotoryja"] },
  { name: "Województwo Łódzkie", cities: ["Aleksandrów Łódzki","Bełchatów","Brzeziny","Głowno","Konstantynów Łódzki","Koluszki","Kutno","Łask","Łęczyca","Łowicz","Łódź","Opoczno","Ozorków","Pabianice","Piotrków Trybunalski","Radomsko","Rawa Mazowiecka","Sieradz","Skierniewice","Tomaszów Mazowiecki","Wieluń","Zduńska Wola","Zgierz"] },
  { name: "Województwo Małopolskie", cities: ["Andrychów","Bochnia","Brzesko","Chrzanów","Dąbrowa Tarnowska","Gorlice","Kraków","Krynica-Zdrój","Limanowa","Myślenice","Nowy Sącz","Nowy Targ","Olkusz","Oświęcim","Proszowice","Skawina","Sucha Beskidzka","Tarnów","Trzebinia","Wadowice","Wieliczka","Zakopane"] },
  { name: "Województwo Śląskie", cities: ["Będzin","Bielsko-Biała","Bytom","Chorzów","Cieszyn","Czechowice-Dziedzice","Częstochowa","Dąbrowa Górnicza","Gliwice","Jastrzębie-Zdrój","Jaworzno","Katowice","Knurów","Mikołów","Mysłowice","Piekary Śląskie","Pszczyna","Racibórz","Ruda Śląska","Rybnik","Siemianowice Śląskie","Sosnowiec","Świętochłowice","Tarnowskie Góry","Tychy","Wodzisław Śląski","Zabrze","Zawiercie","Żory","Żywiec"] },
  { name: "Województwo Podlaskie", cities: ["Augustów","Białystok","Bielsk Podlaski","Grajewo","Hajnówka","Kolno","Łapy","Łomża","Mońki","Sejny","Siemiatycze","Sokółka","Suwałki","Wasilków","Zambrów"] },
  { name: "Województwo Podkarpackie", cities: ["Dębica","Jarosław","Jasło","Kolbuszowa","Krosno","Leżajsk","Lubaczów","Łańcut","Mielec","Nisko","Przemyśl","Przeworsk","Ropczyce","Rzeszów","Sanok","Stalowa Wola","Tarnobrzeg","Ustrzyki Dolne"] },
  { name: "Województwo Warmińsko-Mazurskie", cities: ["Bartoszyce","Braniewo","Działdowo","Elbląg","Ełk","Giżycko","Iława","Kętrzyn","Lidzbark Warmiński","Mrągowo","Nidzica","Olsztyn","Ostróda","Pisz","Szczytno","Węgorzewo"] },
  { name: "Województwo Świętokrzyskie", cities: ["Busko-Zdrój","Jędrzejów","Kielce","Końskie","Ostrowiec Świętokrzyski","Pińczów","Sandomierz","Skarżysko-Kamienna","Starachowice","Staszów","Włoszczowa"] },
  { name: "Województwo Lubuskie", cities: ["Gorzów Wielkopolski","Kostrzyn nad Odrą","Krosno Odrzańskie","Nowa Sól","Słubice","Sulechów","Świebodzin","Żagań","Żary","Zielona Góra"] },
  { name: "Województwo Opolskie", cities: ["Brzeg","Głubczyce","Kędzierzyn-Koźle","Kluczbork","Namysłów","Nysa","Olesno","Opole","Prudnik","Strzelce Opolskie"] },
];

const MARKER_ICON = L.icon({
  iconUrl: "/favicon.svg",
  iconRetinaUrl: "/favicon.svg",
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -16],
  className: "fs-marker-icon",
});

// ─── NETLIFY FORM HELPER ─────────────────────────────────────────────────────
const encodeForm = (data) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k] ?? ""))
    .join("&");

async function submitNetlify(formName, data) {
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encodeForm({ "form-name": formName, "bot-field": "", ...data }),
  });
  if (!res.ok) throw new Error("Network response was not ok");
}

// ═══════════════════════════════════════════════════════════════════════════
//  SVG GRAPHICS
// ═══════════════════════════════════════════════════════════════════════════

function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="lm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7C5CFF" />
          <stop offset="0.5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#lm-grad)" />
      <circle cx="38" cy="30" r="9" fill="#fff" opacity="0.96" />
      <circle cx="23" cy="41" r="6.5" fill="#fff" opacity="0.9" />
      <circle cx="44" cy="45" r="4.5" fill="#fff" opacity="0.85" />
      <circle cx="28" cy="23" r="3.2" fill="#fff" opacity="0.8" />
    </svg>
  );
}

function FunSodaLogo({ light = false }) {
  return (
    <a
      href="#hero"
      onClick={(e) => { e.preventDefault(); scroll("#hero"); }}
      className="flex items-center gap-2.5 select-none"
      style={{ textDecoration: "none" }}
      aria-label="4FUNSODA – strona główna"
    >
      <LogoMark size={38} />
      <span
        className="font-display"
        style={{
          fontWeight: 800,
          fontSize: "1.35rem",
          letterSpacing: "-0.02em",
          color: light ? "#fff" : C.ink,
        }}
      >
        <span className="aurora-text" style={light ? { color: "#fff", WebkitTextFillColor: "#fff", background: "none" } : {}}>4FUN</span>
        <span style={{ color: light ? "rgba(255,255,255,0.85)" : C.muted }}>SODA</span>
      </span>
    </a>
  );
}

// Parametric CO₂ cylinder illustration
function CylinderSVG({ tint = "blue", style }) {
  const palettes = {
    pink: { a: "#FF7AB6", b: "#EC4899", c: "#BE185D", cap: "#F9A8D4", seal: "#DB2777" },
    blue: { a: "#60A5FA", b: "#3B82F6", c: "#1D4ED8", cap: "#93C5FD", seal: "#2563EB" },
  };
  const p = palettes[tint] || palettes.blue;
  const id = tint;
  return (
    <svg viewBox="0 0 160 300" style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`cyl-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={p.a} />
          <stop offset="0.45" stopColor={p.b} />
          <stop offset="1" stopColor={p.c} />
        </linearGradient>
        <linearGradient id={`gloss-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* valve */}
      <rect x="66" y="6" width="28" height="20" rx="5" fill={p.cap} />
      <rect x="72" y="0" width="16" height="12" rx="3" fill={p.c} />
      {/* shoulder */}
      <path d="M50 40 Q80 18 110 40 L110 60 L50 60 Z" fill={`url(#cyl-${id})`} />
      {/* body */}
      <rect x="40" y="56" width="80" height="230" rx="34" fill={`url(#cyl-${id})`} />
      {/* seal band */}
      <rect x="40" y="80" width="80" height="26" fill={p.seal} opacity="0.92" />
      {/* label plate */}
      <rect x="52" y="126" width="56" height="96" rx="12" fill="#fff" opacity="0.92" />
      <circle cx="80" cy="158" r="15" fill={`url(#cyl-${id})`} />
      <text x="80" y="163" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="16" fontWeight="800" fill="#fff">CO₂</text>
      <rect x="62" y="188" width="36" height="6" rx="3" fill={p.b} opacity="0.7" />
      <rect x="66" y="200" width="28" height="5" rx="2.5" fill={p.b} opacity="0.45" />
      {/* gloss */}
      <rect x="48" y="60" width="26" height="220" rx="13" fill={`url(#gloss-${id})`} />
    </svg>
  );
}

// Hero glass of fizzy soda
function HeroArt() {
  const bubbles = [
    [46, 200, 6], [70, 160, 9], [92, 210, 5], [58, 130, 7], [104, 150, 6],
    [80, 110, 8], [64, 235, 4], [96, 118, 5], [50, 165, 5],
  ];
  return (
    <svg viewBox="0 0 340 380" width="100%" style={{ maxWidth: 400, filter: "drop-shadow(0 24px 44px rgba(124,92,255,0.24))" }} aria-hidden="true">
      <defs>
        <linearGradient id="soda-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A78BFA" />
          <stop offset="0.5" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
        <linearGradient id="glass-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id="halo" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#7C5CFF" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7C5CFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="170" cy="180" r="170" fill="url(#halo)" />

      {/* floating cylinder */}
      <g transform="translate(232 96) rotate(12)">
        <rect x="0" y="0" width="52" height="150" rx="24" fill="#3B82F6" />
        <rect x="0" y="16" width="52" height="16" fill="#2563EB" opacity="0.9" />
        <rect x="14" y="-8" width="24" height="14" rx="4" fill="#93C5FD" />
        <circle cx="26" cy="70" r="12" fill="#fff" />
        <text x="26" y="75" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="12" fontWeight="800" fill="#3B82F6">CO₂</text>
        <rect x="6" y="4" width="10" height="140" rx="5" fill="#fff" opacity="0.3" />
      </g>

      {/* glass cup */}
      <path d="M96 96 L244 96 L228 320 Q226 340 206 340 L134 340 Q114 340 112 320 Z" fill="url(#glass-body)" stroke="rgba(124,92,255,0.35)" strokeWidth="3" />
      {/* liquid */}
      <path d="M104 150 L236 150 L226 316 Q225 330 210 330 L130 330 Q115 330 114 316 Z" fill="url(#soda-liquid)" opacity="0.92" />
      {/* surface ellipse */}
      <ellipse cx="170" cy="150" rx="66" ry="12" fill="#E0F2FE" opacity="0.9" />
      {/* rim */}
      <ellipse cx="170" cy="96" rx="74" ry="14" fill="none" stroke="rgba(124,92,255,0.45)" strokeWidth="3" />

      {/* straw */}
      <rect x="188" y="60" width="12" height="150" rx="6" transform="rotate(10 194 135)" fill="#7C5CFF" />
      <rect x="188" y="60" width="12" height="150" rx="6" transform="rotate(10 194 135)" fill="#fff" opacity="0.18" />

      {/* lemon slice */}
      <g transform="translate(196 156)">
        <circle r="22" fill="#FCD34D" />
        <circle r="22" fill="none" stroke="#FBBF24" strokeWidth="3" />
        <circle r="15" fill="#FEF9C3" />
        {[0,45,90,135,180,225,270,315].map((a) => (
          <line key={a} x1="0" y1="0" x2={13*Math.cos(a*Math.PI/180)} y2={13*Math.sin(a*Math.PI/180)} stroke="#FBBF24" strokeWidth="2" />
        ))}
      </g>

      {/* bubbles */}
      {bubbles.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx + 60} cy={cy} r={r} fill="#fff" opacity="0.75" className="animate-float" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
    </svg>
  );
}

function AboutArt() {
  return (
    <svg viewBox="0 0 360 360" width="100%" style={{ maxWidth: 380 }} aria-hidden="true">
      <defs>
        <linearGradient id="ring-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7C5CFF" />
          <stop offset="0.5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
        <radialGradient id="ring-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#22D3EE" stopOpacity="0.28" />
          <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="180" cy="180" r="180" fill="url(#ring-halo)" />
      <circle cx="180" cy="180" r="120" fill="none" stroke="url(#ring-a)" strokeWidth="26" strokeLinecap="round" strokeDasharray="470 300" transform="rotate(-90 180 180)" />
      <circle cx="180" cy="180" r="86" fill="rgba(255,255,255,0.7)" stroke="rgba(124,92,255,0.2)" strokeWidth="2" />
      {/* wave inside */}
      <clipPath id="wc"><circle cx="180" cy="180" r="86" /></clipPath>
      <g clipPath="url(#wc)">
        <path d="M94 190 Q124 168 154 190 T214 190 T274 190 V266 H94 Z" fill="#38BDF8" opacity="0.85" />
        <path d="M94 202 Q124 182 154 202 T214 202 T274 202 V266 H94 Z" fill="#7C5CFF" opacity="0.55" />
        {[[130,150,6],[170,138,8],[210,152,5],[150,120,4],[196,120,5]].map(([cx,cy,r],i)=>(
          <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" opacity="0.8" />
        ))}
      </g>
      <g transform="translate(180 66)">
        <circle r="20" fill="#fff" stroke="url(#ring-a)" strokeWidth="4" />
        <text y="6" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="16" fontWeight="800" fill="#7C5CFF">CO₂</text>
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  BACKGROUND (aurora blobs + rising bubbles)
// ═══════════════════════════════════════════════════════════════════════════
function AuroraBackground() {
  const bubbles = [
    { left: "8%", size: 14, dur: 15, delay: 0, drift: 20 },
    { left: "20%", size: 22, dur: 19, delay: -4, drift: -18 },
    { left: "34%", size: 10, dur: 13, delay: -8, drift: 24 },
    { left: "48%", size: 26, dur: 21, delay: -2, drift: -14 },
    { left: "62%", size: 16, dur: 17, delay: -6, drift: 18 },
    { left: "76%", size: 20, dur: 20, delay: -3, drift: -22 },
    { left: "88%", size: 12, dur: 14, delay: -9, drift: 16 },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }} aria-hidden="true">
      <div className="aurora-blob" style={{ width: 460, height: 460, left: "-6%", top: "-8%", background: "#7C5CFF" }} />
      <div className="aurora-blob" style={{ width: 520, height: 520, right: "-10%", top: "18%", background: "#22D3EE", animationDelay: "-6s" }} />
      <div className="aurora-blob" style={{ width: 420, height: 420, left: "26%", bottom: "-12%", background: "#3B82F6", animationDelay: "-11s", opacity: 0.4 }} />
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="fs-bubble"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
            "--bubble-drift": `${b.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

// ─── NAVBAR ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const go = (e, href) => { e.preventDefault(); setOpen(false); scroll(href); };

  return (
    <header className="fixed top-0 left-0 right-0" style={{ zIndex: 1000, padding: scrolled ? "8px 0" : "14px 0", transition: "padding 0.3s ease" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div
          className="glass flex items-center justify-between"
          style={{
            borderRadius: 999,
            padding: "10px 14px 10px 18px",
            boxShadow: scrolled ? "0 10px 30px rgba(124,92,255,0.16)" : "0 6px 22px rgba(124,92,255,0.10)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <FunSodaLogo />

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                style={{ fontWeight: 600, fontSize: "0.92rem", color: C.muted, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.violet)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => go(e, "#contact")}
              className="text-white font-bold flex items-center gap-2"
              style={{ background: C.aurora, fontSize: "0.9rem", padding: "10px 20px", borderRadius: 999, boxShadow: "0 8px 22px rgba(124,92,255,0.4)" }}
            >
              <Sparkles size={15} /> Kontakt
            </a>
          </nav>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2" style={{ color: C.violet }} aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          className="md:hidden glass"
          style={{
            maxHeight: open ? 420 : 0,
            opacity: open ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.35s ease, opacity 0.3s ease",
            borderRadius: 24,
            marginTop: open ? 10 : 0,
          }}
        >
          <nav className="flex flex-col px-6 py-5 gap-3">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)} style={{ fontWeight: 700, color: C.ink }}>
                {l.label}
              </a>
            ))}
            <a href="#contact" onClick={(e) => go(e, "#contact")} className="text-white font-bold text-center" style={{ background: C.aurora, padding: "12px", borderRadius: 999, marginTop: 6 }}>
              Kontakt
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

// ─── HERO ───────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1300) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frameId;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);
  return value;
}

function Hero() {
  const points = useCountUp(200);
  const cities = useCountUp(40);
  const clients = useCountUp(10000, 1700);

  const stats = [
    { v: `${points}+`, l: "Autoryzowanych punktów" },
    { v: `${cities}+`, l: "Miast w Polsce" },
    { v: `${clients.toLocaleString("pl-PL")}+`, l: "Zadowolonych klientów" },
  ];

  return (
    <section id="hero" style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", paddingTop: 100, paddingBottom: 48 }}>
      <div className="max-w-7xl mx-auto px-6 w-full hero-grid" style={{ display: "grid", gap: "2rem", alignItems: "center", position: "relative", zIndex: 1 }}>
        {/* LEFT */}
        <div className="flex flex-col items-start animate-slide-up">
          <span className="glass" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 700, padding: "7px 15px", borderRadius: 999, marginBottom: 20, color: C.violet }}>
            <Sparkles size={14} /> Błyskawiczna wymiana cylindrów CO₂
          </span>

          <h1 className="font-display" style={{ fontSize: "clamp(2.2rem, 4.4vw, 3.3rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 16, color: C.ink }}>
            Bąbelki pełne <br />
            <span className="aurora-text">frajdy i orzeźwienia</span>
          </h1>

          <p style={{ color: C.muted, lineHeight: 1.7, maxWidth: 460, marginBottom: 26, fontSize: 15 }}>
            {BRAND.name} to nowoczesna i ekologiczna usługa wymiany cylindrów CO₂ do saturatorów. Nasze autoryzowane punkty zapewniają szybki, wygodny i bezpieczny dostęp do wszystkiego, czego potrzebujesz do przygotowania wody gazowanej w domu – w oparciu o certyfikowany gaz spożywczy CO₂.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a href="#map" onClick={(e) => { e.preventDefault(); scroll("#map"); }}
              className="text-white font-bold flex items-center gap-2"
              style={{ background: C.aurora, padding: "12px 24px", borderRadius: 999, fontSize: 14.5, boxShadow: "0 12px 26px rgba(124,92,255,0.35)" }}>
              <MapPin size={17} /> Znajdź punkt
            </a>
            <a href="#offer" onClick={(e) => { e.preventDefault(); scroll("#offer"); }}
              className="glass font-bold flex items-center gap-2"
              style={{ padding: "12px 24px", borderRadius: 999, fontSize: 14.5, color: C.violet }}>
              Nasza oferta <ArrowRight size={17} />
            </a>
          </div>

          <div style={{ display: "flex", gap: 28, marginTop: 34, flexWrap: "wrap" }}>
            {stats.map((s) => (
              <div key={s.l}>
                <div className="font-display aurora-text" style={{ fontSize: "1.65rem", fontWeight: 800, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="animate-fade-in delay-200" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <HeroArt />
        </div>
      </div>

      <a href="#map" onClick={(e) => { e.preventDefault(); scroll("#map"); }} className="animate-bounce"
        style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: C.violet, zIndex: 2 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6 }}>Przewiń</span>
        <ChevronDown size={20} />
      </a>
    </section>
  );
}

// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────
function Section({ id, title, subtitle, children, style }) {
  return (
    <section id={id} style={{ padding: "64px 0", position: "relative", zIndex: 1, ...style }}>
      <div className="max-w-7xl mx-auto px-6">
        {(title || subtitle) && (
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            {subtitle && (
              <span className="glass" style={{ display: "inline-block", fontSize: 10.5, fontWeight: 700, padding: "5px 14px", borderRadius: 999, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.12em", color: C.violet }}>
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="font-display" style={{ fontSize: "clamp(1.7rem, 3vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: C.ink }}>
                {title}
              </h2>
            )}
            <div style={{ width: 56, height: 4, background: C.aurora, borderRadius: 999, margin: "14px auto 0" }} />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

// ─── MAP ─────────────────────────────────────────────────────────────────────
function MapSection() {
  return (
    <Section id="map" title="Znajdź punkt wymiany" subtitle="Sieć punktów w Polsce">
      <div className="fs-map-shell">
        <MapWithSearch />
        <div className="glass" style={{ borderRadius: 24, padding: "26px 24px", display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 14px 40px rgba(124,92,255,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.aurora, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <MapPin size={20} />
            </div>
            <h3 className="font-display" style={{ fontSize: "1.05rem", fontWeight: 700, color: C.ink }}>Partnerzy {BRAND.name}</h3>
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>
            Punkty wymiany cylindrów CO₂ znajdziesz w wybranych lokalizacjach popularnych sieci handlowych i lokalnych sklepów. Wybierz miasto, aby sprawdzić najbliższy punkt.
          </p>
          <div style={{ marginTop: 4, paddingTop: 14, borderTop: "1px dashed rgba(124,92,255,0.25)", fontSize: 13, color: C.muted, display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ display: "flex", gap: 8 }}><Zap size={16} color={C.cyan} /> Kliknij marker na mapie, aby zobaczyć szczegóły punktu.</span>
            <span style={{ display: "flex", gap: 8 }}><Droplets size={16} color={C.violet} /> Dwa rodzaje cylindrów CO₂ pasujące do każdego saturatora – wkręcane i Quick Connect.</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

function MapWithSearch() {
  const [searchCity, setSearchCity] = useState("");
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  const normalized = searchCity.trim().toLowerCase();
  const visiblePoints = normalized
    ? MAP_POINTS.filter((p) => p.city.toLowerCase().includes(normalized))
    : MAP_POINTS;

  useEffect(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return;
    const map = L.map(mapContainerRef.current).setView(BYDGOSZCZ_CENTER, BYDGOSZCZ_ZOOM);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);
    leafletMapRef.current = map;
    map.whenReady(() => {
      map.invalidateSize();
      setTimeout(() => map.invalidateSize(), 400);
    });
    return () => { map.remove(); leafletMapRef.current = null; };
  }, []);

  useEffect(() => {
    const handleResize = () => leafletMapRef.current?.invalidateSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    visiblePoints.forEach((p) => {
      const marker = L.marker(p.position, { icon: MARKER_ICON }).addTo(map);
      marker.bindPopup(
        `<div style="min-width:200px">
           <div style="font-size:12px;font-weight:800;color:#0B1020;margin-bottom:2px">${p.name}</div>
           <div style="font-size:11px;color:#5B6178;margin-bottom:6px">${p.address}</div>
           <div style="display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:999px;background:#EEF0FB;border:1px solid #7C5CFF;font-size:10px;font-weight:700;color:#5B21B6;margin-bottom:4px">Dostępne: Cylindry CO₂</div>
           <div style="margin-top:4px;font-size:10px;color:#5B6178">Godziny: ${p.hours || "8–18"}</div>
         </div>`
      );
      markersRef.current.push(marker);
    });
    // Wyśrodkuj na wynik wyszukiwania; bez wyszukiwania trzymaj domyślny widok na Bydgoszczy.
    if (normalized && visiblePoints.length > 0) map.setView(visiblePoints[0].position, 11);
    else map.setView(BYDGOSZCZ_CENTER, BYDGOSZCZ_ZOOM);
  }, [visiblePoints, normalized]);

  return (
    <div className="fs-map-container glass" style={{ borderRadius: 24, padding: "18px", boxShadow: "0 18px 48px rgba(59,130,246,0.16)", display: "flex", flexDirection: "column", gap: 12, minHeight: 400 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 34, borderRadius: 999, background: C.aurora }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.violet }}>Mapa autoryzowanych punktów</div>
            <div style={{ fontSize: 13, color: C.ink, fontWeight: 600 }}>Wymiana cylindrów CO₂</div>
          </div>
        </div>
        <div style={{ position: "relative", maxWidth: 240, flex: "1 1 180px" }}>
          <input
            type="text"
            placeholder="Wyszukaj po mieście"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            style={{ width: "100%", borderRadius: 999, border: "1px solid rgba(124,92,255,0.3)", background: "rgba(255,255,255,0.85)", padding: "9px 34px 9px 14px", fontSize: 13, outline: "none" }}
          />
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: C.muted }}>
            {visiblePoints.length}/{MAP_POINTS.length}
          </span>
        </div>
      </div>
      <div style={{ flex: 1, borderRadius: 18, overflow: "hidden" }}>
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%", minHeight: 300 }} />
      </div>
    </div>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function AboutSection() {
  const pillars = [
    { icon: <Recycle size={24} />, title: "Ekologia", desc: "Wielokrotnie mniej plastiku dzięki wymianie cylindrów CO₂. Mniej odpadów to mniejszy ślad węglowy." },
    { icon: <Zap size={24} />, title: "Wygoda", desc: "Prosto, lokalnie i bez zbędnych kroków. Wymiana zawsze na miejscu, od ręki." },
    { icon: <Award size={24} />, title: "Polska firma", desc: "Działamy lokalnie i rozwijamy się w całym kraju, w 100% polski kapitał." },
    { icon: <Star size={24} />, title: "Jakość", desc: "Pewna wymiana, produkty atestowane i bezpieczne. Certyfikowany gaz spożywczy CO₂." },
  ];

  return (
    <Section id="about" title="O nas" subtitle="Kim jesteśmy">
      <div className="about-grid" style={{ marginBottom: 56 }}>
        <div className="about-text">
          <p style={{ color: C.muted, lineHeight: 1.85, fontSize: 16, marginBottom: 16 }}>
            {BRAND.name} to wygodna i ekologiczna alternatywa dla kupowania wody w plastikowych butelkach. Ułatwiamy codzienne korzystanie z saturatorów, oferując szybką wymianę cylindrów CO₂ w dogodnych punktach blisko Ciebie. Przychodzisz do punktu z pustym cylindrem i od razu wymieniasz go na pełny – bez czekania, bez zamawiania i bez komplikacji.
          </p>
          <p style={{ color: C.muted, lineHeight: 1.85, marginBottom: 16 }}>
            Działamy w wielu miastach i stale rozwijamy sieć punktów wymiany. Każdy cylinder napełniany jest certyfikowanym, bezpiecznym gazem spożywczym CO₂, co gwarantuje wysoką jakość oraz bezpieczeństwo użytkowania w domowych warunkach.
          </p>
          <p style={{ color: C.muted, lineHeight: 1.85 }}>
            {BRAND.name} to także świadomy wybór dla środowiska. Wymiana cylindrów i korzystanie z saturatorów pozwala ograniczyć ilość jednorazowych butelek PET i wspiera ideę gospodarki obiegu zamkniętego – bez rezygnowania z komfortu i z realną oszczędnością.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
            <LogoMark size={38} />
            <span style={{ fontWeight: 600, color: C.ink, fontSize: 15 }}>{BRAND.tagline} – razem z nami.</span>
          </div>
        </div>
        <div className="about-image animate-float" style={{ display: "flex", justifyContent: "center" }}>
          <AboutArt />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 20 }}>
        {pillars.map((p) => (
          <div key={p.title} className="glass" style={{ borderRadius: 22, padding: "30px 24px", textAlign: "center", transition: "transform 0.25s, box-shadow 0.25s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 44px rgba(124,92,255,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ width: 58, height: 58, background: C.aurora, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#fff" }}>{p.icon}</div>
            <h3 className="font-display" style={{ fontWeight: 700, color: C.ink, marginBottom: 8 }}>{p.title}</h3>
            <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.6 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── OFFER ───────────────────────────────────────────────────────────────────
function OfferSection() {
  const [openFaq, setOpenFaq] = useState(0);

  const OfferCard = ({ accent, title, desc, tags, art, textColor, panelBg }) => (
    <div className="offer-card glass" style={{ borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 10px 30px rgba(124,92,255,0.1)" }}>
      <div style={{ padding: "22px 20px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
            <Droplets size={20} />
          </div>
          <h3 className="font-display" style={{ fontSize: "1.02rem", fontWeight: 700, color: textColor, lineHeight: 1.2 }}>{title}</h3>
        </div>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{desc}</p>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6, fontSize: 10.5 }}>
          {tags.map((t) => (
            <span key={t} style={{ padding: "4px 9px", borderRadius: 999, background: "rgba(124,92,255,0.09)", color: C.violet, fontWeight: 700 }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ height: 148, background: panelBg, borderTop: "1px solid rgba(124,92,255,0.1)", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
        {art}
      </div>
    </div>
  );

  return (
    <Section id="offer" title="Nasza oferta" subtitle="Produkty">
      <div className="offer-grid">
        <OfferCard
          accent="#EC4899" textColor="#BE185D" panelBg="linear-gradient(160deg, #FDF2F8, #FCE7F3)"
          title="Cylinder Quick Connect"
          desc="Szybki montaż, pasuje do saturatorów z systemem Quick Connect (różowa plomba)."
          tags={["60 L napoju", "Ekologia", "Quick Connect"]}
          art={<CylinderSVG tint="pink" style={{ height: 122 }} />}
        />
        <OfferCard
          accent="#3B82F6" textColor="#1D4ED8" panelBg="linear-gradient(160deg, #EFF6FF, #DBEAFE)"
          title="Cylinder Wkręcany"
          desc="Klasyczny system wkręcany, pasuje do większości saturatorów (niebieska plomba)."
          tags={["60 L napoju", "Oszczędność", "Wkręcany"]}
          art={<CylinderSVG tint="blue" style={{ height: 122 }} />}
        />

        {/* Eco box */}
        <div style={{ background: C.aurora, borderRadius: 20, padding: "26px 22px", color: "#fff", boxShadow: "0 14px 36px rgba(124,92,255,0.3)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Leaf size={24} />
            <h3 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 700 }}>Ekologicznie i oszczędnie</h3>
          </div>
          <p style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.7, color: "rgba(255,255,255,0.9)" }}>
            Jeden cylinder wystarcza nawet na 60 litrów wody gazowanej – to woda gazowana w domu bez generowania dodatkowych opakowań PET.
          </p>
          <ul style={{ marginTop: 16, listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
            {[
              [<Zap size={12} key="z" />, "Niższy koszt 1 litra napoju niż woda w butelkach"],
              [<Droplets size={12} key="d" />, "Nawet 60 litrów wody z jednego cylindra"],
              [<Building2 size={12} key="b" />, "Mniej zapasów butelek – więcej miejsca w domu"],
              [<Star size={12} key="s" />, "Pełna kontrola nad nagazowaniem wody"],
            ].map(([ic, txt], i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: 999, background: "rgba(255,255,255,0.18)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{ic}</span>
                {txt}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" style={{ marginTop: 48 }}>
        <h3 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 700, color: C.ink, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 26, height: 26, borderRadius: 999, background: C.aurora, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, fontWeight: 900 }}>?</span>
          Najczęstsze pytania
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={item.question} className="glass" style={{ borderRadius: 16, overflow: "hidden" }}>
                <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  style={{ width: "100%", padding: "14px 18px", background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "inherit" }}>
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: C.ink, textAlign: "left" }}>{item.question}</span>
                  <span style={{ fontSize: 20, color: C.violet, marginLeft: 12, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                </button>
                <div style={{ maxHeight: isOpen ? 600 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
                  <div style={{ padding: "0 18px 16px", fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                    {item.type === "long" ? (
                      <>
                        <p style={{ marginBottom: 8 }}>Różnica dotyczy sposobu montażu cylindra w saturatorze. Saturatory dzielą się na dwa typy: wkręcane oraz wciskane (Quick Connect).</p>
                        <p style={{ marginBottom: 8 }}><strong>Cylinder wkręcany</strong> – najczęściej oznaczony kolorem niebieskim. Montuje się go poprzez wkręcenie do saturatora.</p>
                        <p style={{ marginBottom: 8 }}><strong>Cylinder Quick Connect</strong> – oznaczony kolorem różowym. To system wciskany, umożliwiający szybki montaż bez wkręcania.</p>
                        <p>Jeśli nie masz pewności, który cylinder pasuje do Twojego saturatora, obsługa punktu chętnie pomoże w wyborze właściwego wariantu.</p>
                      </>
                    ) : (
                      <p>{item.answer}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

// ─── SHARED FIELD STYLE ──────────────────────────────────────────────────────
const fieldStyle = (hasError) => ({
  width: "100%",
  borderRadius: 12,
  border: `1.5px solid ${hasError ? "#ef4444" : "rgba(124,92,255,0.22)"}`,
  background: "rgba(255,255,255,0.8)",
  padding: "11px 14px",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
});
const labelStyle = {
  display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase",
  letterSpacing: "0.1em", color: C.muted, marginBottom: 6,
};
const focusOn = (e) => { e.target.style.borderColor = C.violet; e.target.style.boxShadow = "0 0 0 3px rgba(124,92,255,0.14)"; };
const focusOff = (hasError) => (e) => { e.target.style.boxShadow = "none"; e.target.style.borderColor = hasError ? "#ef4444" : "rgba(124,92,255,0.22)"; };

// ─── B2B ─────────────────────────────────────────────────────────────────────
function B2BSection() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [serverMsg, setServerMsg] = useState(null);

  const onSubmit = async (data) => {
    setServerMsg(null);
    try {
      await submitNetlify("b2b", data);
      setServerMsg({ type: "success", text: "Dziękujemy za zgłoszenie! Skontaktujemy się z Tobą wkrótce." });
      reset();
    } catch {
      setServerMsg({ type: "error", text: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie." });
    }
  };

  const benefits = [
    "Brak inwestycji własnych",
    "Stały, przewidywalny dochód",
    "Pełne wsparcie logistyczne i serwisowe po naszej stronie",
    "Regularna promocja punktu zwiększająca ruch klientów",
    "Popularna i poszukiwana usługa przyciągająca nowych klientów",
    "Utożsamienie punktu z trendami ekologicznymi",
    "Prosty i szybki proces wymiany bez dodatkowej obsługi",
    "Elastyczna współpraca – zakończenie w dowolnym momencie",
  ];

  const nipPattern = /^[0-9]{10}$/;
  const b2bFields = [
    { name: "companyName", label: "Nazwa firmy", type: "text", placeholder: "Nazwa sklepu / sieci" },
    { name: "nip", label: "NIP", type: "text", placeholder: "10-cyfrowy NIP (bez myślników)", validation: { pattern: { value: nipPattern, message: "NIP powinien składać się z 10 cyfr" } } },
    { name: "fullName", label: "Imię i nazwisko", type: "text", placeholder: "Osoba kontaktowa" },
    { name: "email", label: "Adres e-mail", type: "email", placeholder: "kontakt@twojsklep.pl", validation: { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Podaj poprawny adres e-mail" } } },
    { name: "phone", label: "Telefon", type: "tel", placeholder: "+48 ___ ___ ___" },
    { name: "address", label: "Adres lokalu", type: "text", placeholder: "Ulica, numer, miejscowość" },
  ];

  return (
    <Section id="b2b" title="Współpraca B2B" subtitle="Dla sklepów">
      <div className="b2b-grid">
        <div className="b2b-benefits" style={{ background: C.aurora, borderRadius: 24, padding: "28px 24px", color: "#fff", boxShadow: "0 22px 50px rgba(124,92,255,0.4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Building2 size={26} />
            <div>
              <h3 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 700 }}>Korzyści dla partnerów</h3>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.82)" }}>Dołącz do sieci {BRAND.name} i zwiększ atrakcyjność oferty.</p>
            </div>
          </div>
          <ul style={{ marginTop: 16, listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
            {benefits.map((b) => (
              <li key={b} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 22, height: 22, borderRadius: 999, background: "rgba(255,255,255,0.18)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Star size={13} /></span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed rgba(255,255,255,0.28)", fontSize: 12.5 }}>
            Zadzwoń bezpośrednio:{" "}
            <a href={BRAND.phoneHref} style={{ fontWeight: 800, color: "#fff", textDecoration: "underline", textDecorationStyle: "dotted" }}>{BRAND.phoneDisplay}</a>.
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} name="b2b" className="b2b-form glass" style={{ borderRadius: 24, padding: "30px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.violet, marginBottom: 4 }}>Formularz dla sklepów</div>
            <p style={{ fontSize: 13.5, color: C.muted }}>Wypełnij zgłoszenie, a nasz opiekun skontaktuje się z Tobą i przedstawi warunki współpracy.</p>
          </div>
          {b2bFields.map((f) => (
            <div key={f.name}>
              <label htmlFor={`b2b-${f.name}`} style={labelStyle}>{f.label}</label>
              <input id={`b2b-${f.name}`} type={f.type} placeholder={f.placeholder}
                {...register(f.name, { required: "To pole jest wymagane", ...(f.validation || {}) })}
                style={fieldStyle(!!errors[f.name])} onFocus={focusOn} onBlur={focusOff(!!errors[f.name])} />
              {errors[f.name] && <p style={{ marginTop: 4, fontSize: 11, color: "#b91c1c" }}>{errors[f.name].message}</p>}
            </div>
          ))}
          <button type="submit" disabled={isSubmitting}
            className="text-white font-bold"
            style={{ marginTop: 4, width: "100%", border: "none", borderRadius: 999, padding: "13px 16px", fontSize: 14.5, cursor: "pointer", background: C.aurora, boxShadow: "0 12px 28px rgba(124,92,255,0.4)", opacity: isSubmitting ? 0.8 : 1 }}>
            {isSubmitting ? "Wysyłanie..." : "Wyślij zgłoszenie"}
          </button>
          {serverMsg && <p style={{ marginTop: 6, fontSize: 12.5, fontWeight: 700, color: serverMsg.type === "success" ? "#16a34a" : "#b91c1c" }}>{serverMsg.text}</p>}
        </form>
      </div>
    </Section>
  );
}

// ─── SEO / REGIONS ────────────────────────────────────────────────────────────
function SeoSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [openRegion, setOpenRegion] = useState(SEO_REGIONS[0]?.name ?? null);

  return (
    <section style={{ padding: "32px 0 56px", position: "relative", zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6">
        <button type="button" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}
          style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="font-display" style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: C.ink, textAlign: "center" }}>
            Wymiana cylindrów CO₂ – znajdź nas w swoim mieście
          </span>
          <ChevronDown size={26} color={C.violet} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
        </button>

        <div className={`seo-content-wrapper${isOpen ? " seo-content-wrapper--open" : ""}`}>
          <div className="seo-content-inner">
            <p style={{ textAlign: "center", maxWidth: 720, margin: "24px auto 12px", fontSize: 14, color: C.muted }}>
              Poniżej znajdziesz miasta, w których dostępne są (lub sukcesywnie uruchamiane) punkty wymiany cylindrów CO₂ {BRAND.name}. Lista ma charakter informacyjny i jest na bieżąco rozwijana.
            </p>
            <div style={{ textAlign: "center", margin: "0 auto 28px" }}>
              <a href="/m/" className="text-white font-bold" style={{ display: "inline-block", padding: "11px 20px", background: C.aurora, borderRadius: 12, fontSize: 14 }}>
                Zobacz wszystkie strony miast →
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SEO_REGIONS.map((region) => {
                const rOpen = openRegion === region.name;
                return (
                  <div key={region.name} className="glass" style={{ borderRadius: 16, overflow: "hidden" }}>
                    <button type="button" onClick={() => setOpenRegion(rOpen ? null : region.name)}
                      style={{ width: "100%", padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                      <span style={{ fontSize: 14.5, fontWeight: 700, color: C.ink, textAlign: "left" }}>{region.name}</span>
                      <span style={{ fontSize: 20, color: C.violet, transform: rOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    <div style={{ maxHeight: rOpen ? 900 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
                      <div style={{ padding: "10px 18px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "6px 16px", fontSize: 13, color: C.muted }}>
                        {region.cities.map((city) => {
                          const citySlug = slugify(city);
                          const hasPage = CITY_SLUGS_WITH_PAGE.has(citySlug);
                          return hasPage ? (
                            <a key={city} href={`/m/${citySlug}/`} style={{ color: C.violet, fontWeight: 600 }}>{city}</a>
                          ) : (
                            <span key={city}>{city}</span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 28, fontSize: 12.5, color: C.muted, lineHeight: 1.75, maxWidth: 900 }}>
              <p style={{ marginBottom: 10 }}>
                Wymiana cylindrów CO₂ do saturatorów to usługa, która umożliwia szybki i wygodny dostęp do wody gazowanej bez konieczności kupowania plastikowych butelek. Coraz więcej użytkowników wybiera lokalne punkty wymiany, ponieważ pozwala to oszczędzać czas, pieniądze i ograniczać ilość odpadów – bez zamawiania i bez formalności.
              </p>
              <p style={{ marginBottom: 10 }}>
                Jeden cylinder pozwala przygotować nawet do 60 litrów wody gazowanej, co oznacza niższy koszt jednego litra w porównaniu z wodą kupowaną w butelkach. To praktyczna i ekologiczna alternatywa dla zgrzewek PET, dostępna lokalnie w wielu miastach.
              </p>
              <p style={{ marginBottom: 10 }}>
                <strong>Wymiana cylindrów CO₂ Bydgoszcz, Toruń, Inowrocław</strong> – w regionie kujawsko-pomorskim sieć {BRAND.name} obejmuje Bydgoszcz, Toruń, Inowrocław, Nakło nad Notecią, Solec Kujawski, Żnin, Szubin, Mogilno, Kruszwicę i wiele innych miast. Wymiana odbywa się w sklepach partnerskich bez formalności.
              </p>
              <p>
                <strong>Wymiana cylindrów CO₂ Warszawa, Łuków, Siedlce</strong> – punkty {BRAND.name} działają także w Warszawie oraz we wschodniej części Mazowsza i Lubelszczyzny. Sprawdź mapę, aby znaleźć najbliższy punkt wymiany w swoim mieście.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function ContactSection() {
  const contacts = [
    { icon: <Phone size={24} />, title: "Telefon", value: BRAND.phoneDisplay, href: BRAND.phoneHref },
    { icon: <Mail size={24} />, title: "E-mail", value: BRAND.email, href: `mailto:${BRAND.email}` },
    { icon: <MapPin size={24} />, title: "Siedziba", value: "Piechcin", href: "#map" },
  ];

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [serverMsg, setServerMsg] = useState(null);

  const onSubmit = async (data) => {
    setServerMsg(null);
    try {
      await submitNetlify("kontakt", data);
      setServerMsg({ type: "success", text: "Wiadomość została wysłana. Dziękujemy!" });
      reset();
    } catch {
      setServerMsg({ type: "error", text: "Nie udało się wysłać wiadomości. Spróbuj ponownie." });
    }
  };

  const fields = [
    { name: "fullName", label: "Imię i nazwisko", type: "text", ph: "Jan Kowalski", validation: { required: "To pole jest wymagane" } },
    { name: "email", label: "Adres e-mail", type: "email", ph: "jan@firma.pl", validation: { required: "To pole jest wymagane", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Podaj poprawny adres e-mail" } } },
    { name: "phone", label: "Telefon", type: "tel", ph: "+48 ___ ___ ___", validation: { required: "To pole jest wymagane" } },
  ];

  return (
    <Section id="contact" title="Kontakt" subtitle="Skontaktuj się">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginBottom: 40 }}>
        {contacts.map((c) => (
          <a key={c.title} href={c.href} className="glass" style={{ borderRadius: 20, padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 18px 40px rgba(124,92,255,0.18)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ width: 54, height: 54, background: C.aurora, color: "#fff", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon}</div>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{c.title}</span>
            <span className="font-display" style={{ fontWeight: 700, color: C.ink }}>{c.value}</span>
          </a>
        ))}
      </div>

      <div className="contact-layout" style={{ display: "grid", gap: 32, alignItems: "stretch" }}>
        <form onSubmit={handleSubmit(onSubmit)} name="kontakt" className="glass" style={{ borderRadius: 24, padding: "36px" }}>
          <h3 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 700, color: C.ink, textAlign: "center", marginBottom: 22 }}>Napisz do nas</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {fields.map((f) => (
              <div key={f.name}>
                <label htmlFor={`c-${f.name}`} style={labelStyle}>{f.label}</label>
                <input id={`c-${f.name}`} type={f.type} placeholder={f.ph} {...register(f.name, f.validation)}
                  style={fieldStyle(!!errors[f.name])} onFocus={focusOn} onBlur={focusOff(!!errors[f.name])} />
                {errors[f.name] && <p style={{ marginTop: 4, fontSize: 11, color: "#b91c1c" }}>{errors[f.name].message}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="c-message" style={labelStyle}>Wiadomość</label>
              <textarea id="c-message" rows={4} placeholder="Twoja wiadomość..." {...register("message", { required: "To pole jest wymagane" })}
                style={{ ...fieldStyle(!!errors.message), resize: "none" }} onFocus={focusOn} onBlur={focusOff(!!errors.message)} />
              {errors.message && <p style={{ marginTop: 4, fontSize: 11, color: "#b91c1c" }}>{errors.message.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="text-white font-bold"
              style={{ width: "100%", background: C.aurora, padding: 14, borderRadius: 12, border: "none", fontSize: 15, cursor: "pointer", boxShadow: "0 12px 28px rgba(124,92,255,0.4)", opacity: isSubmitting ? 0.85 : 1 }}>
              {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
            </button>
            {serverMsg && <p style={{ marginTop: 6, fontSize: 12.5, fontWeight: 700, color: serverMsg.type === "success" ? "#16a34a" : "#b91c1c" }}>{serverMsg.text}</p>}
          </div>
        </form>

        <div className="glass" style={{ borderRadius: 24, padding: 36, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
          <div className="animate-float" style={{ display: "flex", justifyContent: "center" }}>
            <HeroArt />
          </div>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 14, lineHeight: 1.7 }}>
            Masz pytanie o wymianę cylindra, godziny otwarcia punktów albo chcesz zostać naszym partnerem? Napisz lub zadzwoń – chętnie pomożemy.
          </p>
        </div>
      </div>
    </Section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="footer" style={{ position: "relative", zIndex: 1, background: "linear-gradient(135deg, #1E1B4B, #0B1020)", padding: "60px 0 32px", color: "#fff", marginTop: 20 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 40, marginBottom: 40 }}>
          <div>
            <FunSodaLogo light />
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13.5, marginTop: 16, lineHeight: 1.7 }}>
              Nowoczesna i ekologiczna usługa wymiany cylindrów CO₂ do saturatorów. Dostępna w wielu miastach w Polsce – szybko, wygodnie i bez plastiku.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              {[{ icon: <Facebook size={18} />, href: BRAND.facebook }].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer"
                  style={{ width: 36, height: 36, borderRadius: 999, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "background 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}>{s.icon}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display" style={{ fontWeight: 700, marginBottom: 16 }}>Nawigacja</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[...NAV_LINKS, { label: "Kontakt", href: "#contact" }, { label: "FAQ", href: "#faq" }].map((l) => (
                <li key={l.href} style={{ marginBottom: 9 }}>
                  <a href={l.href} onClick={(e) => { e.preventDefault(); scroll(l.href); }}
                    style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}>{l.label}</a>
                </li>
              ))}
              <li><a href="/m/" style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Punkty w miastach</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display" style={{ fontWeight: 700, marginBottom: 16 }}>Dane firmy</h4>
            <ul style={{ listStyle: "none", padding: 0, color: "rgba(255,255,255,0.6)", fontSize: 13.5 }}>
              {[
                { label: "Firma", val: `${BRAND.company} | operator sieci ${BRAND.name}` },
                { label: "NIP", val: BRAND.nip },
                { label: "Adres", val: `${BRAND.street}, ${BRAND.city}` },
              ].map(({ label, val }) => (
                <li key={label} style={{ marginBottom: 9 }}><span style={{ fontWeight: 700 }}>{label}: </span>{val}</li>
              ))}
              <li style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                <Phone size={13} /> <a href={BRAND.phoneHref} style={{ color: "rgba(255,255,255,0.6)" }}>{BRAND.phoneDisplay}</a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mail size={13} /> <a href={`mailto:${BRAND.email}`} style={{ color: "rgba(255,255,255,0.6)" }}>{BRAND.email}</a>
              </li>
              <li style={{ marginTop: 10 }}>
                <a href="#privacy" style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, textDecoration: "underline", textDecorationStyle: "dotted" }}>Polityka prywatności</a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>© {new Date().getFullYear()} {BRAND.name} | {BRAND.company} – wszelkie prawa zastrzeżone</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
            <Leaf size={12} color="#86efac" /> <span>Działamy zgodnie z ideą gospodarki obiegu zamkniętego</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── PRIVACY ─────────────────────────────────────────────────────────────────
function PrivacyPage() {
  const goHome = () => { window.location.hash = ""; window.scrollTo(0, 0); };
  const h2 = { fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, color: C.ink, marginTop: 28, marginBottom: 10 };
  return (
    <div style={{ minHeight: "100vh", background: C.bg, position: "relative" }}>
      <AuroraBackground />
      <header className="glass" style={{ position: "sticky", top: 0, zIndex: 100, padding: "16px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <a href="#" onClick={(e) => { e.preventDefault(); goHome(); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.violet, fontWeight: 700, fontSize: 14 }}>
            <ChevronLeft size={20} /> Strona główna
          </a>
        </div>
      </header>
      <main style={{ padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 className="font-display" style={{ fontSize: "clamp(1.7rem, 3vw, 2.1rem)", fontWeight: 800, color: C.ink, marginBottom: 24 }}>
            Polityka Prywatności serwisu {BRAND.domain}
          </h1>
          <div style={{ color: C.muted, lineHeight: 1.85, fontSize: 15 }}>
            <h2 style={h2}>1. Informacje ogólne</h2>
            <p>Operatorem serwisu {BRAND.domain} oraz Administratorem danych osobowych jest firma {BRAND.company} (NIP {BRAND.nip}), z siedzibą: {BRAND.street}, {BRAND.city}. Kontakt: <a href={`mailto:${BRAND.email}`} style={{ color: C.violet, fontWeight: 600 }}>{BRAND.email}</a> lub <a href={BRAND.phoneHref} style={{ color: C.violet, fontWeight: 600 }}>{BRAND.phoneDisplay}</a>.</p>
            <h2 style={h2}>2. Jakie dane zbieramy?</h2>
            <p>Serwis pozyskuje informacje w następujący sposób:</p>
            <ul style={{ paddingLeft: "1.25rem", marginTop: 8 }}>
              <li>Poprzez dobrowolnie wprowadzone w formularzach dane (imię, e-mail, numer telefonu).</li>
              <li>Poprzez pliki cookie zapisywane w urządzeniu końcowym.</li>
              <li>Poprzez logi serwera zbierane przez operatora hostingowego (Netlify).</li>
            </ul>
            <h2 style={h2}>3. Cel przetwarzania danych</h2>
            <p>Dane z formularzy są przetwarzane w celu obsługi zgłoszenia handlowego lub kontaktu zwrotnego.</p>
            <h2 style={h2}>4. Odbiorcy danych</h2>
            <p>Dane mogą być przekazywane podmiotom technicznie realizującym usługi (hosting Netlify, operatorzy map – OpenStreetMap – w celu wyświetlania mapy punktów).</p>
            <h2 style={h2}>5. Twoje prawa</h2>
            <p>Zgodnie z RODO przysługuje Ci prawo do: dostępu do danych, sprostowania, usunięcia, ograniczenia przetwarzania oraz wniesienia sprzeciwu.</p>
            <h2 style={h2}>6. Pliki Cookies</h2>
            <p>Serwis korzysta z plików cookies w celu utrzymania sesji użytkownika oraz w celach statystycznych. Ustawienia cookies można w każdej chwili zmienić w przeglądarce.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
function useHashRoute() {
  const [showPrivacy, setShowPrivacy] = useState(
    () => typeof window !== "undefined" && window.location.hash === "#privacy"
  );
  useEffect(() => {
    const onHashChange = () => setShowPrivacy(window.location.hash === "#privacy");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return showPrivacy;
}

function useStructuredData() {
  useEffect(() => {
    const faq = document.createElement("script");
    faq.type = "application/ld+json";
    faq.dataset.fsSchema = "faq";
    faq.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQ_ITEMS.filter((i) => i.answer).map((i) => ({
        "@type": "Question",
        "name": i.question,
        "acceptedAnswer": { "@type": "Answer", "text": i.answer },
      })),
    });
    document.head.appendChild(faq);
    return () => { faq.remove(); };
  }, []);
}

export default function App() {
  const showPrivacy = useHashRoute();
  useStructuredData();

  if (showPrivacy) return <PrivacyPage />;

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <AuroraBackground />
      <Navbar />
      <Hero />
      <MapSection />
      <AboutSection />
      <OfferSection />
      <B2BSection />
      <ContactSection />
      <SeoSection />
      <Footer />
    </div>
  );
}
