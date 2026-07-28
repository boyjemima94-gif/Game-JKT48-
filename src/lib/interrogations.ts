// Interrogation dialogue trees for each suspect.
// Each suspect has a set of questions the detective can ask.
// Responses can be truthful, deceptive, or evasive — and some reveal
// recorded statements that become clues in the notebook.

export type ResponseTone = "truth" | "lie" | "evasive" | "breakdown";

export interface InterrogationResponse {
  text: string;
  tone: ResponseTone;
  /** clue ID added to notebook when this statement is recorded, if any */
  recordsClueId?: string;
  /** short label shown in notebook for the recorded statement */
  statementLabel?: string;
}

export interface InterrogationQuestion {
  id: string;
  prompt: string; // the question text
  response: InterrogationResponse;
  /** if this question unlocks follow-up questions */
  unlocks?: string[];
}

export interface InterrogationTree {
  suspectId: string;
  greeting: string;
  greetingTone: ResponseTone;
  questions: InterrogationQuestion[];
}

export const INTERROGATIONS: Record<string, InterrogationTree> = {
  oline: {
    suspectId: "oline",
    greeting: "Aku tidak punya waktu untuk ini. Latihanku belum selesai.",
    greetingTone: "evasive",
    questions: [
      {
        id: "q-alibi",
        prompt: "Di mana kau malam itu, pukul 23:17?",
        response: {
          text: "Di panggung. Latihan solo. Sendirian. Tidak ada yang melihatku — itu intinya, bukan? Tapi aku tidak melakukan apa-apa.",
          tone: "evasive",
          recordsClueId: "stmt-oline-alibi",
          statementLabel: "Alibi Oline: latihan solo tanpa saksi",
        },
        unlocks: ["q-motive", "q-hair"],
      },
      {
        id: "q-motive",
        prompt: "Korban mengancam posisimu sebagai center, bukan?",
        response: {
          text: "...Posisi center adalah hidupku. Tapi aku tidak akan membunuh karena itu. Aku lebih baik menang secara adil.",
          tone: "lie",
          recordsClueId: "stmt-oline-motive",
          statementLabel: "Oline menyangkal motif posisi center (terdengar berbohong)",
        },
      },
      {
        id: "q-hair",
        prompt: "Rambut hitammu ditemukan di lokasi kejadian. Bagaimana bisa?",
        response: {
          text: "Itu... bukan rambutku. Mungkin seseorang menanamnya. Atau mungkin dari latihan tadi. Aku tidak tahu!",
          tone: "lie",
          recordsClueId: "stmt-oline-hair",
          statementLabel: "Oline menyangkal rambut di TKP (terdengar panik)",
        },
      },
      {
        id: "q-catherina",
        prompt: "Apa hubunganmu dengan Catherina?",
        response: {
          text: "Dia sainganku. Tapi... malam itu aku melihatnya berdebat dengan korban. Sangat emosional. Aku tidak mendengar semuanya, tapi suaranya meninggi.",
          tone: "truth",
          recordsClueId: "stmt-oline-cath",
          statementLabel: "Oline melihat Catherina berdebat dengan korban malam itu",
        },
      },
    ],
  },
  catherina: {
    suspectId: "catherina",
    greeting: "Oh, detektif. Berapa lama lagi kau akan menggangguku? Aku punya pertunjukan.",
    greetingTone: "evasive",
    questions: [
      {
        id: "q-alibi",
        prompt: "Kau terakhir terlihat berdebat dengan korban. Tentang apa?",
        response: {
          text: "Pertukaran pendapat tentang koreografi. Tidak lebih dari itu. Kami profesional.",
          tone: "lie",
          recordsClueId: "stmt-cath-alibi",
          statementLabel: "Catherina menyebut debat 'hanya koreografi' (berbohong)",
        },
        unlocks: ["q-video", "q-parfum"],
      },
      {
        id: "q-video",
        prompt: "Korban membocorkan video latihanmu. Itu merusak nama baikmu.",
        response: {
          text: "...Aku tahu. Semua orang tahu. Tapi aku sudah menanganinya secara hukum. Aku tidak perlu kekerasan untuk menyelesaikannya.",
          tone: "lie",
          recordsClueId: "stmt-cath-video",
          statementLabel: "Catherina mengaku video bocor tapi 'sudah menanganinya'",
        },
      },
      {
        id: "q-parfum",
        prompt: "Parfum mawarmu ditemukan di jas korban. Bagaimana jelaskannya?",
        response: {
          text: "Aku memakai parfum mawar setiap hari. Semua orang di teater memakai parfum. Itu bukti apa-apa.",
          tone: "evasive",
          recordsClueId: "stmt-cath-parfum",
          statementLabel: "Catherina tak bisa menjelaskan parfum di jas korban",
        },
      },
      {
        id: "q-glove",
        prompt: "Apa kau memakai sarung tangan lace malam itu?",
        response: {
          text: "Aku... aku punya sarung tangan seperti itu. Tapi aku tidak memakainya malam itu. Aku tidak tahu mengapa ada di TKP.",
          tone: "breakdown",
          recordsClueId: "stmt-cath-glove",
          statementLabel: "Catherina mengakui punya sarung tangan lace serupa (gugup)",
        },
      },
    ],
  },
  abigail: {
    suspectId: "abigail",
    greeting: "Aku sudah menelepon ibuku malam itu. Tanyakan padanya, dia akan mengonfirmasi.",
    greetingTone: "evasive",
    questions: [
      {
        id: "q-alibi",
        prompt: "Catatan panggilanmu tidak ditemukan. Kau menelepon siapa sebenarnya?",
        response: {
          text: "Aku... mungkin aku salah ketik nomornya. Atau sinyalnya buruk. Aku tidak ingat persis. Aku hanya tahu aku di kafe.",
          tone: "lie",
          recordsClueId: "stmt-abigail-alibi",
          statementLabel: "Alibi Abigail tentang telepon ibu tidak terverifikasi",
        },
        unlocks: ["q-secret", "q-photo"],
      },
      {
        id: "q-secret",
        prompt: "Korban mengancam mengungkap rahasia keluargamu. Rahasia apa?",
        response: {
          text: "...Aku tidak akan membicarakannya. Itu urusan keluarga. Kau tidak punya hak.",
          tone: "evasive",
          recordsClueId: "stmt-abigail-secret",
          statementLabel: "Abigail menolak membahas rahasia keluarga yang dikorban ketahui",
        },
      },
      {
        id: "q-photo",
        prompt: "Foto keluarga sobek ditemukan di tempat sampah. Milikmu?",
        response: {
          text: "Ya, milikku. Aku... emosional malam itu. Aku menyobeknya sendiri. Bukan karena korban. Karena alasan pribadi.",
          tone: "lie",
          recordsClueId: "stmt-abigail-photo",
          statementLabel: "Abigail mengakui menyobek foto keluarga (alasan diragukan)",
        },
      },
      {
        id: "q-fiony",
        prompt: "Kau bertemu Fiony malam itu?",
        response: {
          text: "Singkat. Di lorong. Dia terburu-buru membawa sesuatu. Aku tidak bertanya apa.",
          tone: "truth",
          recordsClueId: "stmt-abigail-fiony",
          statementLabel: "Abigail melihat Fiony terburu-buru di lorong malam itu",
        },
      },
    ],
  },
  fiony: {
    suspectId: "fiony",
    greeting: "Aku sibuk. Apa ini perlu? Aku sudah memberikan pernyataan resmi.",
    greetingTone: "evasive",
    questions: [
      {
        id: "q-alibi",
        prompt: "Log aktivitasmu terhenti 7 menit. Apa yang kau lakukan?",
        response: {
          text: "Listrik mati sejenak di studio. Komputer restart. Itu biasa terjadi. Aku menunggu, lalu lanjut menyunting.",
          tone: "lie",
          recordsClueId: "stmt-fiony-alibi",
          statementLabel: "Alibi Fiony: 'listrik mati' (log tidak mendukung)",
        },
        unlocks: ["q-usb", "q-access"],
      },
      {
        id: "q-usb",
        prompt: "Drive USB dengan sidik jaraimu ditemukan. Isinya apa?",
        response: {
          text: "Itu... drive kerja. File proyek. Aku tidak ingat persis apa isinya malam itu. Aku punya banyak drive.",
          tone: "evasive",
          recordsClueId: "stmt-fiony-usb",
          statementLabel: "Fiony tak bisa menjelaskan isi USB berciri sidik jaranya",
        },
      },
      {
        id: "q-access",
        prompt: "Kau punya akses ke server rekaman. Mengapa file ulang tahun hilang?",
        response: {
          text: "Aku tidak menghapusnya! Aku justru yang paling rugi — itu karyaku. Mengapa aku akan merusak karyaku sendiri?",
          tone: "lie",
          recordsClueId: "stmt-fiony-access",
          statementLabel: "Fiony menyangkal menghapus rekaman (motif penggantian dirinya)",
        },
      },
      {
        id: "q-calendar",
        prompt: "Kalendermu ada lingkaran merah pada tanggal kejadian. Kenapa?",
        response: {
          text: "...Itu tenggat proyek. Bukan tanggal penting lain. Aku merencanakan jadwal. Itu saja.",
          tone: "lie",
          recordsClueId: "stmt-fiony-calendar",
          statementLabel: "Fiony tak menjelaskan lingkaran merah di kalender (berbohong)",
        },
      },
    ],
  },
};

// Tone styling metadata for the dialogue UI
export const TONE_META: Record<
  ResponseTone,
  { label: string; color: string; bg: string; icon: string }
> = {
  truth: {
    label: "JUJUR",
    color: "text-green-400",
    bg: "border-green-500/50 bg-green-500/5",
    icon: "✓",
  },
  lie: {
    label: "BERBOHONG",
    color: "text-noir-crimson",
    bg: "border-noir-crimson/50 bg-noir-crimson/5",
    icon: "✗",
  },
  evasive: {
    label: "MENGHINDAR",
    color: "text-noir-brass",
    bg: "border-noir-brass/50 bg-noir-brass/5",
    icon: "↩",
  },
  breakdown: {
    label: "GUGUP",
    color: "text-orange-400",
    bg: "border-orange-500/50 bg-orange-500/5",
    icon: "!",
  },
};

// Timeline events for the reconstruction puzzle.
// The correct chronological order is the array index order.
export interface TimelineEvent {
  id: string;
  time: string;
  event: string;
  detail: string;
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "t1",
    time: "20:00",
    event: "Latihan dimulai",
    detail: "Empat member memulai latihan untuk acara ulang tahun di panggung utama.",
  },
  {
    id: "t2",
    time: "22:14",
    event: "Oline keluar panggung",
    detail: "Oline Manuel keluar lewat pintu belakang setelah latihan solo.",
  },
  {
    id: "t3",
    time: "22:40",
    event: "Debat di ruang ganti",
    detail: "Catherina terlihat berdebat emosional dengan korban di ruang ganti No. 4.",
  },
  {
    id: "t4",
    time: "22:55",
    event: "Abigail di kafe",
    detail: "Abigail duduk sendirian di kafe lobi, menatap ponselnya.",
  },
  {
    id: "t5",
    time: "23:05",
    event: "Fiony di studio",
    detail: "Fiony terakhir terlihat di kamera belakang studio rekaman B.",
  },
  {
    id: "t6",
    time: "23:17",
    event: "Jam berhenti",
    detail: "Jam tangan korban berhenti — titik kematian diperkirakan.",
  },
  {
    id: "t7",
    time: "23:32",
    event: "CCTV mati",
    detail: "Rekaman CCTV panggung mati 9 menit, tanpa penjelasan teknis.",
  },
  {
    id: "t8",
    time: "23:45",
    event: "Penemuan jenazah",
    detail: "Staf menemukan korban tak sadar di belakang panggung utama.",
  },
];

// Victim profile data
export interface VictimProfile {
  name: string;
  role: string;
  age: number;
  portrait: string;
  background: string;
  relationships: { suspectId: string; relation: string }[];
  lastWords: string;
  causeOfDeath: string;
}

export const VICTIM: VictimProfile = {
  name: "Mardiono 'M' Santoso",
  role: "Produser Senior Teatro",
  age: 47,
  portrait:
    "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c558a2398836.jpg",
  background:
    "Mardiono memimpin Teatro del Misteri selama 12 tahun. Dikenal tegas namun genius dalam mengarahkan pertunjukan. Akhir-akhir ini ia menyimpan banyak rahasia — termasuk dokumen yang mengancam karier beberapa member.",
  relationships: [
    {
      suspectId: "oline",
      relation: "Merencanakan menggantikan Oline sebagai center",
    },
    {
      suspectId: "catherina",
      relation: "Membocorkan video latihan Catherina ke media",
    },
    {
      suspectId: "abigail",
      relation: "Mengetahui rahasia keluarga Abigail",
    },
    {
      suspectId: "fiony",
      relation: "Akan menggantikan Fiony sebagai produser kreatif",
    },
  ],
  lastWords: "...panggung... bukan untukmu... semuanya...",
  causeOfDeath:
    "Cedera kepala akibat benturan keras. Ditemukan bekas cairan tidak teridentifikasi di gelasnya — diduga penenang.",
};
