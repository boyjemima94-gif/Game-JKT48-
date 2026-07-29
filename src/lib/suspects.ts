// Suspect data for the murder mystery game.
// Portraits are JKT48 members researched via image-search (OSS-hosted, embeddable).
// Characters are FICTIONAL personas for the in-game murder mystery.

export interface CharacterDepth {
  // Physical appearance description
  appearance: string;
  // Distinctive habits or mannerisms
  habits: string[];
  // Personality traits (3-5 keywords)
  personality: string[];
  // Career timeline (key milestones)
  careerTimeline: { year: string; event: string }[];
  // Relationship with the victim (detailed)
  victimRelationship: string;
  // Relationship with each other suspect
  suspectRelationships: { suspectId: string; relationship: string }[];
  // A hidden secret only revealed through deep investigation
  darkSecret: string;
  // What they fear most
  fear: string;
  // Their alibi witness (or lack thereof)
  alibiWitness: string;
  // Where they were during the 9-minute CCTV gap
  duringGap: string;
  // Their reaction when accused (final moment)
  accusationReaction: string;
}

export interface Suspect {
  id: string;
  name: string;
  memberOf: string;
  portrait: string;
  portraitFallback?: string;
  role: string;
  codename: string;
  age: number;
  height: string;
  lastSeen: string;
  alibi: string;
  motive: string;
  evidence: string[];
  threat: number; // 1-5
  accent: string; // tailwind-ish hex used for thread
  quote: string;
  signature: string; // handwriting-ish snippet
  location: { x: number; y: number }; // position on the board (percentage)
  // Deep character data
  depth: CharacterDepth;
}

export const SUSPECTS: Suspect[] = [
  {
    id: "oline",
    name: "Oline Manuel",
    memberOf: "JKT48 — Theater Company",
    portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c558a2398836.jpg",
    portraitFallback: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a2f9ccc031f2.jpg",
    role: "The Lead Star",
    codename: "BURUNG MERAK",
    age: 22,
    height: "163 cm",
    lastSeen: "Panggung Theater, 22:14 — keluar lewat pintu belakang.",
    alibi:
      "Mengaku latihan solo hingga 23:30, namun rekaman CCTV panggung mati 9 menit.",
    motive:
      "Posisi center terancam oleh korban. Surat peringatan tertulis ditemukan di laci.",
    evidence: [
      "Helai rambut hitam di lokasi kejadian",
      "Stiker panggung bertanggal sama",
      "Pesan terhapus: 'jangan ambil panggungku'",
    ],
    threat: 4,
    accent: "#e0a83c",
    quote: "Panggung ini milikku. Selalu milikku.",
    signature: "— O.M.",
    location: { x: 20, y: 32 },
    depth: {
      appearance:
        "Rambut hitam panjang, sering diikat saat latihan. Mata tajam, ekspresi tertutup. Memakai syal merah tua kemanapun pergi — hadiah dari ibunya sebelum meninggal.",
      habits: [
        "Menggigit kuku saat gugup (terlihat di rekaman latihan)",
        "Selalu tiba 30 menit lebih awal untuk latihan solo",
        "Menulis diary setiap malam di buku bersampul cokelat",
        "Berbisik pada diri sendiri sebelum naik panggung",
      ],
      personality: ["Perfeksionis", "Ambisius", "Tertutup", "Protektif", "Cemburu"],
      careerTimeline: [
        { year: "2020", event: "Audisi JKT48 — lolos di percobaan ketiga" },
        { year: "2021", event: "Naik jadi member reguler setelah video viral" },
        { year: "2023", event: "Dipilih jadi center untuk 'Malam Sang Misteri'" },
        { year: "2024", event: "Konflik dengan korban soal koreografi solo" },
        { year: "2025", event: "Terima surat ancaman anonim — disimpan diam-diam" },
      ],
      victimRelationship:
        "Awalnya mentor-keturunan, berubah jadi saingan. Korban merencanakan menggantikan Oline sebagai center dengan member baru. Oline merasa dikhianati setelah semua pengorbanannya.",
      suspectRelationships: [
        { suspectId: "catherina", relationship: "Saingan langsung — saling menghindari di ruang ganti" },
        { suspectId: "abigail", relationship: "Sahabat lama, tapi hubungan mendingin setelah Oline jadi center" },
        { suspectId: "fiony", relationship: "Saling tidak percaya — Oline curiga Fiony mata-matai latihannya" },
      ],
      darkSecret:
        "Oline sebenarnya menerima tawaran dari agensi lain untuk pindah, dengan syarat posisi center dilepas. Korban mengetahui ini dan mengancam mengungkapnya.",
      fear: "Kehilangan panggung — itu satu-satunya hal yang membuatnya merasa hidup.",
      alibiWitness: "Tidak ada — mengaku sendirian di panggung saat latihan solo.",
      duringGap:
        "Mengaku masih di panggung, tapi tidak ada saksi. Pintu belakang terbuka dari dalam — bisa keluar-masuk tanpa terlihat.",
      accusationReaction:
        "Mata membesar, lalu menatap tajam. 'Kau tidak tahu apa-apa. Aku tidak akan merusak panggungku sendiri.' Tapi suaranya bergetar.",
    },
  },
  {
    id: "catherina",
    name: "Catherina Valencia",
    memberOf: "JKT48 — Theater Company",
    portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f20059fab187.jpg",
    portraitFallback: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0e1dc4d095ab.jpg",
    role: "The Rival",
    codename: "MERAH MUDA",
    age: 21,
    height: "160 cm",
    lastSeen: "Ruang ganti, 22:40 — terlihat berdebat dengan korban.",
    alibi:
      "Bersama dua staf di koridor utama, tetapi staf tersebut hilang 6 menit.",
    motive:
      "Korban membocorkan video latihan pribadinya ke media, merusak nama baiknya.",
    evidence: [
      "Parfum mawar di jas korban",
      "Kartu akses ruang arsip dipinjam malam itu",
      "Note berisi kebencian tersembunyi di meja rias",
    ],
    threat: 5,
    accent: "#c0392b",
    quote: "Aku tidak pernah memaafkan pengkhianatan.",
    signature: "— C.V.",
    location: { x: 80, y: 28 },
    depth: {
      appearance:
        "Rambut hitam bergelombang seléh bahu. Memakai parfum mawar yang kuat — aromanya bisa tercium dari jarak 2 meter. Kuku selalu dicat merah muda. Memiliki bekas luka tipis di pergelangan tangan kanan.",
      habits: [
        "Menyemprot parfum 3 kali sebelum tampil (ritual sakti)",
        "Memeriksa ponsel setiap 5 menit — selalu cemas media",
        "Merapikan rambut orang lain tanpa sadar (kebiasaan lama)",
        "Menyimpan kliping koran tentang dirinya di dompet",
      ],
      personality: ["Karismatik", "Tegas", "Pendendam", "Mudah cemburu", "Setia pada yang dipercaya"],
      careerTimeline: [
        { year: "2018", event: "Member termuda yang jadi center — fenomena" },
        { year: "2020", event: "Posisi center diambil alih Oline — pukulan besar" },
        { year: "2023", event: "Memimpin koreografi ensemble, kembali bersinar" },
        { year: "2025", event: "Video latihan bocor ke media — merusak nama baik" },
        { year: "2025", event: "Menuntut korban secara hukum — kalah karena bukti kurang" },
      ],
      victimRelationship:
        "Mantan dekat korban — dulu pasangan kreatif yang dipuja. Hubungan berubah racun setelah korban membocorkan videonya. Catherina merasa dihancurkan oleh orang yang dulu percaya.",
      suspectRelationships: [
        { suspectId: "oline", relationship: "Saingan utama — tidak pernah berdamaka sejak posisi center berpindah" },
        { suspectId: "abigail", relationship: "Tidak terlalu dekat — menganggap Abigail terlalu pasif" },
        { suspectId: "fiony", relationship: "Aliansi senyap — saling bertukar informasi tentang korban" },
      ],
      darkSecret:
        "Catherina menyimpan salinan video asli yang membuktikan korban yang membocorkannya. Tapi mengungkap berarti mengaku video itu ada — malu.",
      fear: "Dicintai lalu ditinggalkan lagi — trauma dari masa kecil.",
      alibiWitness: "Dua staf di koridor utama, tapi mereka hilang 6 menit — tidak bisa konfirmasi sepenuhnya.",
      duringGap:
        "Staf yang jadi saksi alibi menghilang 6 menit. Catherina mengaku di koridor, tapi tidak ada CCTV yang mengonfirmasi.",
      accusationReaction:
        "Tertawa pahit. 'Akhirnya kau tuduh aku. Ya, aku membencinya. Tapi aku tidak membunuhnya. Aku lebih baik dari itu.' Matanya basah tapi suaranya tegas.",
    },
  },
  {
    id: "abigail",
    name: "Abigail Rachel",
    memberOf: "JKT48 — Theater Company",
    portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a90f049d7e2c.jpg",
    portraitFallback: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bad492ab380d.jpg",
    role: "The Confidante",
    codename: "ANGSA PUTIH",
    age: 23,
    height: "165 cm",
    lastSeen: "Kafe lobi, 22:55 — sendirian, menatap layar ponsel.",
    alibi:
      "Mengaku menelepon ibunya, tetapi catatan panggilan tidak ditemukan.",
    motive:
      "Korban mengetahui rahasia keluarganya dan mengancam mengungkapnya.",
    evidence: [
      "Sarung tangan lace hitam di dekat jenazah",
      "Foto lama keluarga sobek di tempat sampah",
      "Aplikasi pesan terenkripsi di ponselnya",
    ],
    threat: 3,
    accent: "#9a7b4f",
    quote: "Ada rahasia yang lebih baik kubur bersamaamanya.",
    signature: "— A.R.",
    location: { x: 24, y: 72 },
  },
  {
    id: "fiony",
    name: "Fiony Alveria",
    memberOf: "JKT48 — Theater Company",
    portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e7a0fe342f45.jpg",
    portraitFallback: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3364a2ab5ea4.jpg",
    role: "The Strategist",
    codename: "BAYANG MALAM",
    age: 22,
    height: "161 cm",
    lastSeen: "Studio rekaman, 23:05 — terakhir di kamera belakang.",
    alibi:
      "Mengaku menyunting video sendirian, file log menunjukkan aktivitas terhenti 7 menit.",
    motive:
      "Korban akan menggantikannya sebagai produser kreatif acara ulang tahun.",
    evidence: [
      "Drive USB berisi rekaman terenkripsi",
      "Sidik jari pada gagang pintu rahasia",
      "Kalender dengan lingkaran merah pada tanggal kejadian",
    ],
    threat: 4,
    accent: "#7a5c8a",
    quote: "Setiap langkah sudah kuhitung. Termasuk langkahnya.",
    signature: "— F.A.",
    location: { x: 80, y: 70 },
  },
];

// Conspiracy board connections (red thread) — pairs of suspect ids with a label
export interface ThreadLink {
  from: string;
  to: string;
  label: string;
  weight: number; // 1-3
}

export const THREAD_LINKS: ThreadLink[] = [
  { from: "oline", to: "catherina", label: "Persaingan panggung", weight: 3 },
  { from: "catherina", to: "abigail", label: "Pertemuan rahasia", weight: 2 },
  { from: "abigail", to: "fiony", label: "Pertukaran USB", weight: 2 },
  { from: "fiony", to: "oline", label: "Pesan terhapus", weight: 2 },
  { from: "oline", to: "abigail", label: "Rahasia keluarga", weight: 1 },
  { from: "catherina", to: "fiony", label: "Aliansi senyap", weight: 2 },
];

export interface CaseFile {
  id: string;
  code: string;
  title: string;
  classification: string;
  date: string;
  location: string;
  victim: string;
  summary: string;
  clues: string[];
  status: "TERBUKA" | "DALAM SIKLUS" | "RAHASIA";
}

export const CASE_FILES: CaseFile[] = [
  {
    id: "case-1",
    code: "JKT-48-001",
    title: "Insiden Panggung Utama",
    classification: "RAHASIA",
    date: "14 Oktober, 23:17",
    location: "Theater JKT48, Lantai 2",
    victim: "M — Produser Senior",
    summary:
      "Korban ditemukan tak sadarkan diri di belakang panggung utama. Tidak ada saksi mata langsung. Empat orang terakhir terlihat bersamanya.",
    clues: [
      "Bekas cairan tidak teridentifikasi di gelas korban",
      "Pintu belakang terbuka dari dalam",
      "Jam tangan korban berhenti tepat 23:17",
    ],
    status: "DALAM SIKLUS",
  },
  {
    id: "case-2",
    code: "JKT-48-002",
    title: "Surat Tanpa Nama",
    classification: "TERBUKA",
    date: "12 Oktober, 09:00",
    location: "Ruang Ganti No. 4",
    victim: "Seluruh member",
    summary:
      "Surat peringatan tanpa pengirim ditemukan di meja rias. Berisi ancaman terhadap siapa pun yang mengambil posisi center.",
    clues: [
      "Tinta spidol merah, merek langka",
      "Gaya tulisan meniru tiga member berbeda",
      "Cap pos tanggal dua minggu lalu",
    ],
    status: "TERBUKA",
  },
  {
    id: "case-3",
    code: "JKT-48-003",
    title: "Rekaman Hilang",
    classification: "RAHASIA",
    date: "13 Oktober, 02:30",
    location: "Studio Rekaman B",
    victim: "File proyek ulang tahun",
    summary:
      "Seluruh rekaman latihan untuk acara ulang tahun hilang dari server. Hanya tiga orang memiliki akses penuh.",
    clues: [
      "Log akses terakhir: 02:14",
      "Drive backup fisik dicuri",
      "Sidik jari sebagian pada kabel",
    ],
    status: "RAHASIA",
  },
];
