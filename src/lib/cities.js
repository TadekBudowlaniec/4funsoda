const POLISH_MAP = {
  "ą": "a", "ć": "c", "ę": "e", "ł": "l", "ń": "n",
  "ó": "o", "ś": "s", "ż": "z", "ź": "z",
  "Ą": "a", "Ć": "c", "Ę": "e", "Ł": "l", "Ń": "n",
  "Ó": "o", "Ś": "s", "Ż": "z", "Ź": "z",
};

export function slugify(input) {
  if (!input) return "";
  const ascii = Array.from(String(input))
    .map((ch) => POLISH_MAP[ch] ?? ch)
    .join("")
    .toLowerCase();
  return ascii
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const POSTCODE_ONLY = /^\d{2}-\d{3}$/;
const POSTCODE_PREFIX = /^\d{2}-\d{3}\s+(.+)$/;
const STREET_PREFIX = /^(?:ul\.?|al\.?|aleje|aleja|pl\.?|plac|os\.?|osiedle)\s+/i;
const TRAILING_HOUSE_NUMBER = /\s+\d+[A-Za-z]?(?:\s*\/\s*\w+)?$/;

export function extractCity(address) {
  if (!address) return "";
  const parts = String(address).split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].replace(TRAILING_HOUSE_NUMBER, "").trim();
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    if (POSTCODE_ONLY.test(p)) continue;
    if (STREET_PREFIX.test(p)) continue;
    const m = p.match(POSTCODE_PREFIX);
    if (m) return m[1].trim();
    return p;
  }
  return parts[parts.length - 1];
}

export function groupByCity(locations) {
  const map = new Map();
  for (const loc of locations) {
    const city = extractCity(loc.address);
    const slug = slugify(city);
    if (!map.has(slug)) {
      map.set(slug, { city, slug, locations: [] });
    }
    map.get(slug).locations.push(loc);
  }
  return Array.from(map.values()).sort((a, b) => b.locations.length - a.locations.length || a.city.localeCompare(b.city, "pl"));
}

const REGION_BY_CITY = {
  "Łuków": "lubelskie",
  "Łaskarzew": "mazowieckie",
  "Międzyrzec Podlaski": "lubelskie",
  "Siedlce": "mazowieckie",
  "Warszawa": "mazowieckie",
  "Garwolin": "mazowieckie",
  "Pilawa": "mazowieckie",
  "Ryki": "lubelskie",
  "Trąbki": "mazowieckie",
  "Bydgoszcz": "kujawsko-pomorskie",
  "Toruń": "kujawsko-pomorskie",
  "Inowrocław": "kujawsko-pomorskie",
  "Barcin": "kujawsko-pomorskie",
  "Mogilno": "kujawsko-pomorskie",
  "Łabiszyn": "kujawsko-pomorskie",
  "Pakość": "kujawsko-pomorskie",
  "Janikowo": "kujawsko-pomorskie",
  "Białe Błota": "kujawsko-pomorskie",
  "Żnin": "kujawsko-pomorskie",
  "Strzelno": "kujawsko-pomorskie",
  "Szubin": "kujawsko-pomorskie",
  "Nakło nad Notecią": "kujawsko-pomorskie",
  "Koronowo": "kujawsko-pomorskie",
  "Złotniki Kujawskie": "kujawsko-pomorskie",
  "Jaksice": "kujawsko-pomorskie",
  "Rojewo": "kujawsko-pomorskie",
  "Gniewkowiec": "kujawsko-pomorskie",
  "Nowa Wieś Wielka": "kujawsko-pomorskie",
  "Gniewkowo": "kujawsko-pomorskie",
  "Mochle": "kujawsko-pomorskie",
  "Kruszwica": "kujawsko-pomorskie",
  "Wierzchosławice": "kujawsko-pomorskie",
  "Brzoza": "kujawsko-pomorskie",
  "Solec Kujawski": "kujawsko-pomorskie",
  "Siennica": "mazowieckie",
  "Stary Jamielnik": "lubelskie",
  "Zbuczyn": "lubelskie",
  "Biardy": "lubelskie",
  "Krynka": "lubelskie",
  "Radomyśl": "lubelskie",
  "Gręzówka": "lubelskie",
  "Krzywda": "lubelskie",
  "Stanin": "lubelskie",
  "Trzebieszów Drugi": "lubelskie",
  "Huta-Dąbrowa": "lubelskie",
  "Tuchowicz": "lubelskie",
  "Gostchorz": "mazowieckie",
  "Romanówka": "mazowieckie",
};

const REGION_LABELS = {
  "lubelskie": "Lubelskie",
  "mazowieckie": "Mazowieckie",
  "kujawsko-pomorskie": "Kujawsko-Pomorskie",
};

export function regionForCity(city) {
  const key = REGION_BY_CITY[city];
  return key ? { slug: key, name: REGION_LABELS[key] } : null;
}

const LOCATIVE = {
  "Łuków": "Łukowie",
  "Łaskarzew": "Łaskarzewie",
  "Międzyrzec Podlaski": "Międzyrzecu Podlaskim",
  "Siedlce": "Siedlcach",
  "Warszawa": "Warszawie",
  "Garwolin": "Garwolinie",
  "Pilawa": "Pilawie",
  "Ryki": "Rykach",
  "Trąbki": "Trąbkach",
  "Bydgoszcz": "Bydgoszczy",
  "Toruń": "Toruniu",
  "Inowrocław": "Inowrocławiu",
  "Barcin": "Barcinie",
  "Mogilno": "Mogilnie",
  "Łabiszyn": "Łabiszynie",
  "Pakość": "Pakości",
  "Janikowo": "Janikowie",
  "Białe Błota": "Białych Błotach",
  "Żnin": "Żninie",
  "Strzelno": "Strzelnie",
  "Szubin": "Szubinie",
  "Nakło nad Notecią": "Nakle nad Notecią",
  "Koronowo": "Koronowie",
  "Złotniki Kujawskie": "Złotnikach Kujawskich",
  "Jaksice": "Jaksicach",
  "Rojewo": "Rojewie",
  "Gniewkowiec": "Gniewkowcu",
  "Nowa Wieś Wielka": "Nowej Wsi Wielkiej",
  "Gniewkowo": "Gniewkowie",
  "Mochle": "Mochlach",
  "Kruszwica": "Kruszwicy",
  "Wierzchosławice": "Wierzchosławicach",
  "Brzoza": "Brzozie",
  "Solec Kujawski": "Solcu Kujawskim",
  "Siennica": "Siennicy",
  "Stary Jamielnik": "Starym Jamielniku",
  "Zbuczyn": "Zbuczynie",
  "Biardy": "Biardach",
  "Krynka": "Krynce",
  "Radomyśl": "Radomyślu",
  "Gręzówka": "Gręzówce",
  "Krzywda": "Krzywdzie",
  "Stanin": "Staninie",
  "Trzebieszów Drugi": "Trzebieszowie Drugim",
  "Huta-Dąbrowa": "Hucie-Dąbrowie",
  "Tuchowicz": "Tuchowiczu",
  "Gostchorz": "Gostchorzu",
  "Romanówka": "Romanówce",
};

export function locativeOf(city) {
  return LOCATIVE[city] || `mieście ${city}`;
}
