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
    portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2cdc7c53eba5.jpg",
    portraitFallback: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/29fa230fa001.jpg",
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
    location: { x: 15, y: 25 },
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
    portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6db28d1034ae.jpg",
    portraitFallback: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7b12d88593aa.jpg",
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
    location: { x: 85, y: 20 },
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
    portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1f4e8f0ab43f.jpg",
    portraitFallback: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b3467efd36db.jpg",
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
    location: { x: 20, y: 75 },
    depth: {
      appearance:
        "Rambut cokelat gelanggang seléh bahu, sering dikepang dua. Senyum lembut tapi mata selalu sedih. Memakai kalung salib kecil — warisan neneknya. Tangan dingin, sering memegang pergelangan tangan sendiri saat gugup.",
      habits: [
        "Mengunyah bibir bawah saat berbohong (tidak disadari)",
        "Selalu bawa buku catatan kecil bertuliskan 'Jangan Lupa'",
        "Menyapu meja rias orang lain tanpa diminta (kebiasaan ibu-ibu)",
        "Menelepon ibu setiap malam pukul 22:00 tanpa gagal",
      ],
      personality: ["Tenang", "Perhatian", "Tertutup", "Penyimpan rahasia", "Mudah bersalah"],
      careerTimeline: [
        { year: "2021", event: "Audisi JKT48 — lolos bersamaan dengan Fiony" },
        { year: "2022", event: "Spesialis harmoni vokal, jar ambil spotlight" },
        { year: "2023", event: "Dihormati sesama member karena kedewasaannya" },
        { year: "2024", event: "Korban menemukan rahasia keluarganya" },
        { year: "2025", event: "Diancam korban: ikuti kemauanku atau rahasia terbongkar" },
      ],
      victimRelationship:
        "Awalnya percaya korban sebagai mentor. Tapi korban menemukan skandal keluarga Abigail (ayahnya punya hutang gelap ke lintah darat) dan mengancam mengungkap jika Abigail tidak menjadi mata-mata.",
      suspectRelationships: [
        { suspectId: "oline", relationship: "Sahabat lama, tapi jadi penengah konflik Oline-Catherina" },
        { suspectId: "catherina", relationship: "Menganggap Catherina terlalu dramatis tapi tetap mendengarkan" },
        { suspectId: "fiony", relationship: "Bertemu sebentar di lorong malam itu — melihat Fiony terburu-buru" },
      ],
      darkSecret:
        "Abigail sebenarnya sudah tahu siapa pelaku sejak awal — dia melihat sesuatu malam itu. Tapi diam karena takut rahasia keluarganya terbongkar jika ikut campur.",
      fear: "Rahasia keluarganya terbongkar — ayahnya bisa masuk penjara, ibunya akan hancur.",
      alibiWitness: "Tidak ada — mengaku menelepon ibu, tapi catatan panggilan tidak ditemukan di ponsel.",
      duringGap:
        "Di kafe lobi, menatap ponsel. Tapi ponselnya menunjukkan aplikasi pesan terenkripsi — bukan panggilan telepon biasa.",
      accusationReaction:
        "Mata membasah, lalu menunduk. 'Aku... aku tahu lebih banyak dari yang kukatakan. Tapi aku tidak melakukannya. Aku hanya takut.' Tangannya gemetar memegang kalung.",
    },
  },
  {
    id: "fiony",
    name: "Fiony Alveria",
    memberOf: "JKT48 — Theater Company",
    portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/979622bb2b8b.jpg",
    portraitFallback: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ef8e54666d27.jpeg",
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
    location: { x: 85, y: 70 },
    depth: {
      appearance:
        "Rambut lurus hitam seléh pinggang, jarang diikat. Kacamata baca sering tersangkut di kepala. Memakai jam tangan digital — selalu cek waktu. Kuku pendek, bersih — tangan editor video yang profesional.",
      habits: [
        "Menghitung detik dalam kepala (bisa tebak waktu tanpa lihat jam)",
        "Selalu bawa 2 drive USB — satu untuk kerja, satu 'cadangan rahasia'",
        "Mengetuk meja dengan pola ritmis saat berpikir (mengganggu orang lain)",
        "Menghapus jejak digital setiap selesai menggunakan komputer studio",
      ],
      personality: ["Cerdas", "Terorganisasi", "Ambisius", "Tidak suka perhatian", "Selalu punya rencana"],
      careerTimeline: [
        { year: "2021", event: "Audisi JKT48 — lolos bersamaan dengan Abigail" },
        { year: "2022", event: "Terpilih jadi produser kreatif untuk acara ulang tahun" },
        { year: "2023", event: "Karyanya viral — dijuluki 'genius bayang'" },
        { year: "2024", event: "Korban merencanakan menggantinya dengan orang luar" },
        { year: "2025", event: "Mengetahui rencana korban sehari sebelum kejadian" },
      ],
      victimRelationship:
        "Awalnya mengagumi korban sebagai mentor kreatif. Tapi korban merencanakan menggantikan Fiony sebagai produser kreatif dengan orang luar yang lebih berpengalaman. Fiony merasa dikhianati setelah dedikasinya bertahun-tahun.",
      suspectRelationships: [
        { suspectId: "oline", relationship: "Saling curiga — Fiony dianggap mata-matai latihan Oline" },
        { suspectId: "catherina", relationship: "Aliansi senyap — saling bertukar informasi tentang korban" },
        { suspectId: "abigail", relationship: "Bertemu sebentar di lorong — Abigail melihat Fiony terburu-buru" },
      ],
      darkSecret:
        "Fiony sudah menyalin seluruh file proyek ulang tahun ke drive USB-nya — termasuk rekaman yang seharusnya sudah dihapus dari server. Dia punya backup yang bisa menghancurkan reputasi korban.",
      fear: "Digantikan dan dilupakan — semua kerja kerasnya sia-sia.",
      alibiWitness: "Tidak ada — mengaku menyunting video sendirian di studio.",
      duringGap:
        "Log aktivitas komputernya terhenti 7 menit. Mengaku listrik mati, tapi log server menunjukkan tidak ada pemadaman. Drive USB dengan sidik jaranya ditemukan di TKP.",
      accusationReaction:
        "Diam beberapa detik, lalu tersenyum tipis. 'Kau lebih pintar dari yang kukira. Tapi bukti tidak cukup. Aku selalu meninggalkan jejak yang rapi.' Matanya dingin, tanpa penyesalan.",
    },
  },
  {
    id: "hillary",
    name: "Hillary Abigail",
    memberOf: "JKT48 — Theater Company",
    portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0d4b1eb44c8c.jpg",
    portraitFallback: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d6a930444d07.jpeg",
    role: "The Whisper",
    codename: "BAYANGAN TIRAI",
    age: 19,
    height: "158 cm",
    lastSeen: "Ruang Arsip, 22:30 — mengakses dokumen lama tanpa izin.",
    alibi:
      "Mengaku mencari skenario lama untuk referensi. Tapi ruang arsip dikunci malam itu — siapa yang membukanya?",
    motive:
      "Korban menyembunyikan dokumen yang membuktikan Hillary adalah member bayaran — bukan audisi resmi. Jika terbongkar, karier hancur.",
    evidence: [
      "Kartu akses ruang arsip dicloning",
      "Sidik jari di brankas dokumen",
      "Pesan terhapus: 'kembalikan dokumen itu'",
    ],
    threat: 3,
    accent: "#5a8a6a",
    quote: "Kebenaran terkadang lebih baik disembunyikan.",
    signature: "— H.A.",
    location: { x: 50, y: 15 },
    depth: {
      appearance:
        "Rambut pendek hitam, gaya tomboy. Selalu memakai topi hitam di luar panggung. Mata cokelat tajam yang menatap lama — tidak berkedip. Tangan kanan selalu di saku, menyembunyikan bekas luka bakar lama.",
      habits: [
        "Berbisik saat berbicara — sulit didengar di keramaian",
        "Selalu duduk di pojok ruangan, punggung ke dinding",
        "Mengunyah permen karet tanpa henti saat gugup",
        "Memeriksa kunci pintu 3 kali sebelum pergi",
      ],
      personality: ["Pendiam", "Observatif", "Berhati-hati", "Misterius", "Setia pada rahasia"],
      careerTimeline: [
        { year: "2022", event: "Masuk JKT48 — kontrak khusus, bukan audisi terbuka" },
        { year: "2023", event: "Diberi peran pendukung di 'Malam Sang Misteri'" },
        { year: "2024", event: "Korban menemukan dokumen bayarannya" },
        { year: "2025", event: "Diancam korban: keluar sukarela atau diungkap" },
        { year: "2025", event: "Mengakses ruang arsip malam kejadian — mencari dokumen asli" },
      ],
      victimRelationship:
        "Korban menemukan bahwa Hillary masuk JKT48 melalui jalur bayaran — bukan audisi. Korban menyimpan dokumen sebagai pegangan. Hillary merasa terjerat seumur hidup.",
      suspectRelationships: [
        { suspectId: "oline", relationship: "Saling tidak peduli — Hillary menghindari drama panggung" },
        { suspectId: "catherina", relationship: "Catherina curiga Hillary ada sesuatu — sering mengikuti" },
        { suspectId: "abigail", relationship: "Hillary memperhatikan Abigail dari jauh — tahu rahasianya" },
        { suspectId: "fiony", relationship: "Saling bertukar info rahasia — aliansi diam-diam" },
        { suspectId: "marsha", relationship: "Sahabat dekat — saling melindungi" },
        { suspectId: "victoria", relationship: "Tidak percaya — menganggap Victoria terlalu naif" },
      ],
      darkSecret:
        "Hillary sebenarnya dikirim oleh pihak luar untuk memata-matai Teatro. Identitas aslinya bukan member — dia agen informasi.",
      fear: "Identitas aslinya terbongkar — bukan hanya karier, tapi nyawanya yang taruhan.",
      alibiWitness: "Tidak ada — ruang arsip dikunci, tapi kartu aksesnya tercatat masuk.",
      duringGap:
        "Kartu aksesnya tercatat masuk ruang arsip 23:20 — tepat di jeda CCTV. Tapi tidak ada rekaman keluar.",
      accusationReaction:
        "Topinya tertutup ke bawah, menutupi mata. 'Kau tidak tahu siapa aku sebenarnya. Tapi aku tidak membunuhnya. Aku hanya mengambil apa milikku.' Suaranya datar, tanpa emosi.",
    },
  },
  {
    id: "victoria",
    name: "Victoria Kimberly",
    memberOf: "JKT48 — Theater Company",
    portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6b1ca69c95bc.jpeg",
    portraitFallback: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1e5a2cca0469.jpeg",
    role: "The Innocent",
    codename: "BUMI TERATAI",
    age: 16,
    height: "155 cm",
    lastSeen: "Lobi Theater, 23:00 — duduk di sofa, menangis.",
    alibi:
      "Mengaku tidak tahu apa-apa — dia termuda, baru bergabung. Tapi airmatanya terlalu sempurna.",
    motive:
      "Korban memerasnya dengan foto memalukan. Sebagai member termuda, skandal akan menghancurkan masa depannya.",
    evidence: [
      "Tisu basah di tempat sampah lobi",
      "Ponselnya menampilkan foto terhapus baru-baru ini",
      "Saksi melihatnya berbicara dengan korban 30 menit sebelum kejadian",
    ],
    threat: 2,
    accent: "#6a9bd4",
    quote: "Aku hanya ingin menjadi bintang... tanpa harus membayar harga.",
    signature: "— V.K.",
    location: { x: 50, y: 80 },
    depth: {
      appearance:
        "Rambut pirang belang (diwarnai), ikang ekor kuda. Wajah baby-faced dengan bulu mata panjang. Selalu memakai gelang persahabatan dari Marsha. Mata besar yang mudah berair — senjata alaminya.",
      habits: [
        "Menggigit ujung rambut saat berpikir",
        "Mengetuk kuku di meja berirama 'tik-tik-tik'",
        "Selalu bawa boneka kecil kucing di tas",
        "Menangis dalam 3 detik jika dipancing (aktif atau asli?)",
      ],
      personality: ["Muda", "Naif", "Manipulatif", "Pencari perhatian", "Takut sendirian"],
      careerTimeline: [
        { year: "2024", event: "Audisi JKT48 termuda — fenomena media" },
        { year: "2024", event: "Dijuluki 'golden child' oleh korban" },
        { year: "2025", event: "Korban memfoto situasi memalukan tanpa sepemahamnya" },
        { year: "2025", event: "Diancam korban: ikuti atau foto bocor" },
        { year: "2025", event: "Menangis di lobi malam kejadian — alasan resmi: homesick" },
      ],
      victimRelationship:
        "Awalnya mengagumi korban sebagai mentor. Tapi korban mulai memanfaatkan dia — foto memalukan, tekanan emosional. Victoria merasa terjebak.",
      suspectRelationships: [
        { suspectId: "oline", relationship: "Mengagumi Oline — ingin jadi seperti dia" },
        { suspectId: "catherina", relationship: "Takut pada Catherina — terlalu intense" },
        { suspectId: "abigail", relationship: "Abigail jadi kakak pelindungnya" },
        { suspectId: "fiony", relationship: "Saling bantu editing video — Fiony jadi mentor teknis" },
        { suspectId: "hillary", relationship: "Merasa ada yang aneh dengan Hillary — tapi tidak tahu apa" },
        { suspectId: "marsha", relationship: "Sahabat terbaik — gelang persahabatan, saling melindungi" },
      ],
      darkSecret:
        "Victoria bukan sesedih yang terlihat. Dia pintar berakting — airmatanya terkontrol. Dia tahu lebih banyak dari yang dia tunjukkan.",
      fear: "Diusir dari JKT48 — itu satu-satunya tempat dia merasa dihargai.",
      alibiWitness: "Saksi melihatnya menangis di lobi — tapi tidak ada yang mendekati.",
      duringGap:
        "Di lobi, menangis. Tapi ponselnya menunjukkan aktivitas pesan terhapus selama jeda — kepada siapa?",
      accusationReaction:
        "Mata membesar, airmata mengalir instan. 'Aku? Aku hanya anak kecil! Aku tidak bisa... aku tidak akan!' Tapi setelah beberapa detik, tatapannya berubah dingin sebentar — sebelum kembali menangis.",
    },
  },
  {
    id: "marsha",
    name: "Marsha Lenathea",
    memberOf: "JKT48 — Theater Company",
    portrait: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5c046f46bc01.jpg",
    portraitFallback: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/07b97d20c83c.jpg",
    role: "The Gamer",
    codename: "PIZZA DREAMER",
    age: 19,
    height: "160 cm",
    lastSeen: "Ruang Server, 23:10 — mengakses sistem keamanan.",
    alibi:
      "Mengaku cek sistem keamanan atas permintaan korban. Tapi log menunjukkan dia menonaktifkan CCTV 9 menit.",
    motive:
      "Korban tahu Marsha adalah anggota Valkyrie48 (grup rahasia). Jika terbongkar, kontrak JKT48 batal.",
    evidence: [
      "Akses log server atas namanya",
      "CCTV dimatikan dari terminal yang dia gunakan",
      "Stiker Valkyrie48 di laptopnya",
    ],
    threat: 4,
    accent: "#d46a9b",
    quote: "Setiap game punya cheat code. Tapi hidup bukan game.",
    signature: "— M.L.",
    location: { x: 10, y: 50 },
    depth: {
      appearance:
        "Rambut hitam panjang sering dikepang. Kacamata gaming merah-LED. Selalu bawa laptop gaming — stiker Valkyrie48 tertutup stiker pizza. Tangan cepat, jari lentik — tangan gamer sejati.",
      habits: [
        "Mengklik pen terus-menerus (kebiasaan gaming)",
        "Selalu bawa 2 ponsel — satu pribadi, satu 'rahasia'",
        "Memesan pizza setiap malam latihan (ritual sakti)",
        "Berbicara dengan istilah game di kehidupan nyata",
      ],
      personality: ["Cerdas", "Strategis", "Berwibawa", "Penyimpan rahasia", "Loyal"],
      careerTimeline: [
        { year: "2019", event: "Audisi JKT48 Academy Class B" },
        { year: "2020", event: "Promosi ke Class A — cepat" },
        { year: "2021", event: "Member resmi Team Dream" },
        { year: "2023", event: "Bergabung Valkyrie48 (grup rahasia side-project)" },
        { year: "2025", event: "Korban menemukan keanggotaan Valkyrie48-nya" },
      ],
      victimRelationship:
        "Korban menemukan Marsha adalah anggota Valkyrie48 — grup side-project yang melanggar kontrak eksklusif JKT48. Korban mengancam melaporkan. Marsha merasa terpojok.",
      suspectRelationships: [
        { suspectId: "oline", relationship: "Menghormati Oline — tapi tidak terlalu dekat" },
        { suspectId: "catherina", relationship: "Catherina iri pada popularitas Marsha di media" },
        { suspectId: "abigail", relationship: "Saling bertukar rahasia — keduanya punya beban" },
        { suspectId: "fiony", relationship: "Saling menghormati skill teknis — aliansi diam" },
        { suspectId: "hillary", relationship: "Sahabat dekat — saling melindungi rahasia" },
        { suspectId: "victoria", relationship: "Sahabat terbaik — gelang persahabatan, pelindung" },
      ],
      darkSecret:
        "Marsha yang menonaktifkan CCTV malam itu — atas permintaan seseorang. Tapi siapa yang memintanya? Dia tidak akan mengaku.",
      fear: "Kontrak JKT48 batal — Valkyrie48 dan JKT48 adalah dua dunia yang tidak boleh bertabrakan.",
      alibiWitness: "Log server menunjukkan aksesnya — tapi dia mengaku atas permintaan korban.",
      duringGap:
        "Di ruang server, menonaktifkan CCTV. Tapi mengaku korban yang menyuruh — apakah korban meminta dirinya dibunuh?",
      accusationReaction:
        "Diam lama, lalu tersenyum tipis. 'Kau pintar. Ya, aku matikan CCTV. Tapi bukan untuk membunuh. Seseorang memintanya — dan aku tidak akan mengatakan siapa.' Matanya menantang.",
    },
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
  // Original 4 suspects
  { from: "oline", to: "catherina", label: "Persaingan panggung", weight: 3 },
  { from: "catherina", to: "abigail", label: "Pertemuan rahasia", weight: 2 },
  { from: "abigail", to: "fiony", label: "Pertukaran USB", weight: 2 },
  { from: "fiony", to: "oline", label: "Pesan terhapus", weight: 2 },
  { from: "oline", to: "abigail", label: "Rahasia keluarga", weight: 1 },
  { from: "catherina", to: "fiony", label: "Aliansi senyap", weight: 2 },
  // New 3 suspects — connections to originals
  { from: "hillary", to: "marsha", label: "Saling melindungi", weight: 3 },
  { from: "marsha", to: "victoria", label: "Gelang persahabatan", weight: 3 },
  { from: "hillary", to: "fiony", label: "Aliansi info rahasia", weight: 2 },
  { from: "victoria", to: "abigail", label: "Pelindung & dilindungi", weight: 2 },
  { from: "marsha", to: "abigail", label: "Tukar rahasia", weight: 2 },
  { from: "catherina", to: "marsha", label: "Iri popularitas", weight: 1 },
  { from: "victoria", to: "oline", label: "Mengagumi", weight: 1 },
  { from: "hillary", to: "catherina", label: "Dicurigai", weight: 1 },
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
