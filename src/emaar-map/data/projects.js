// Project data and map settings. Add a project = add one line here.
// pos is [lat, lng] and approximate. Check each one on Google Maps and adjust.
// Put your photos in /public/images/ (marassi.jpg, soul.jpg, ...)
// Optional: cameras: false hides the cameras around a project.
// boundaryQueries = names to search in OpenStreetMap (tried in order) for the project's border.
// To use your own border instead, save public/boundaries/<id>.geojson (draw it on geojson.io).
export const projects = [
  { id: "marassi", name: "Marassi", area: "North Coast, Sidi Abdel Rahman", pos: [30.97133171655017, 28.751818704046652], image: "/images/marassi.jpg", boundaryQueries: ["Marassi, Sidi Abdel Rahman, Egypt", "مراسي الساحل الشمالي"], desc: "Seaside resort community on the North Coast." },
  { id: "soul", name: "Soul", area: "North Coast", pos: [31.064174547261498, 28.225913446808278], image: "/images/soul.jpg", boundaryQueries: ["Soul, North Coast, Egypt", "سول الساحل الشمالي", "Emaar Soul North Coast"], desc: "Beach houses and standalone villas on the North Coast." },
  { id: "uptown", name: "Uptown Cairo", area: "Mokattam, Cairo", pos: [30.0235, 31.3005], image: "/images/uptown.jpg", boundaryQueries: ["Uptown Cairo, Mokattam, Cairo, Egypt", "أبتاون كايرو", "Uptown Cairo, Egypt"], desc: "Hilltop community overlooking Cairo." },
  { id: "mivida", name: "Mivida", area: "New Cairo, 5th Settlement", pos: [29.99998268696907, 31.5415174105209], image: "/images/mivida.jpg", boundaryQueries: ["Mivida, New Cairo, Egypt", "ميفيدا القاهرة الجديدة"], desc: "Connected community in New Cairo." },
  { id: "cairogate", name: "Cairo Gate", area: "Sheikh Zayed", pos: [30.058864893653933, 31.031159024013537], image: "/images/cairogate.jpg", boundaryQueries: ["Cairo Gate, Sheikh Zayed City, Egypt", "كايرو جيت الشيخ زايد", "Cairo Gate Emaar Misr"], desc: "Villas, townhouses and apartments at the entrance of Sheikh Zayed." },
  { id: "bellevie", name: "Belle Vie", area: "New Zayed", pos: [30.058252022799536, 30.89735875655901], image: "/images/bellevie.jpg", boundaryQueries: ["Belle Vie, New Zayed, Egypt", "بيل في الشيخ زايد", "بيل فيي", "Belle Vie Emaar Misr"], desc: "500-acre compound with a central green spine." },
];

// Views use [lng, lat] because that is what MapLibre expects.
export const HOME_VIEW = { center: [30.1, 30.5], zoom: 7, pitch: 0, bearing: 0 };
export const CITY_VIEW = { zoom: 15, pitch: 60 };

// Free vector style (no API key). Includes 3D buildings when the map is tilted.
export const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
