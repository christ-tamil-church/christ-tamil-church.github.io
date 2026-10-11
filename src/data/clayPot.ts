// Clay Pot (மண்பாண்டம்), the church's writings column, at /grow/clay-pot.
// Each writing gets its own page at /grow/clay-pot/<slug>.
//
// To publish a new writing, add one entry at the TOP of clayPotWritings
// (newest first). Issue numbers count up automatically from the oldest, and
// the page, its metadata, prerendering, and sitemap entry all follow.
//
// Text is kept exactly as the author wrote it. Writings in Tamil stay in
// Tamil; set language: "ta" and the page marks them for screen readers and
// labels them for English readers.

export type ClayPotInline =
  | string
  | { note: number }
  | { em: string }
  | { link: string; href: string };

export type ClayPotBlock =
  | { kind: "p"; content: ClayPotInline[] }
  | { kind: "list"; items: string[] }
  /** Short lines kept on their own lines, like a letter's closing. */
  | { kind: "lines"; lines: string[] };

export type ClayPotWriting = {
  slug: string;
  title: string;
  language: "ta" | "en";
  author: string;
  /** Publication date, YYYY-MM-DD. */
  date: string;
  /** One sentence for search results and link previews. */
  description: string;
  body: ClayPotBlock[];
  /** Footnotes, numbered from 1 in order. */
  notes?: ClayPotInline[][];
  /** Former URL path on the old christtamilchurch.com/clay-pot blog. */
  legacyPath?: string;
};

export const clayPotPath = "/grow/clay-pot";

export const clayPotWritings = [
  {
    slug: "theermanangalum-thadumaatrangalum",
    title: "தீர்மானங்களும் தடுமாற்றங்களும்",
    language: "ta",
    author: "Rev. Jagan Sathiya Seelan",
    date: "2020-01-20",
    description: "A New Year letter in Tamil by Rev. Jagan Sathiya Seelan, from Clay Pot, the writings column of Christ Tamil Church Chicago.",
    legacyPath: "/clay-pot/2020/01/20/தீர்மானங்களும்-தடுமாற்ற",
    body: [
      { kind: "p", content: ["கிறிஸ்துவுக்குள் பிரியமானவர்களே உங்கள் அனைவரையும் புதிய ஆண்டில் சந்திப்பதில் பெருமகிழச்சி அடைகின்றேன். புதிய ஆண்டை காண செய்த ஆண்டவர் தாமே உங்களை புதிய நன்மைகளினாலும் கிருபைகளினாலும் முடிசூட்டுவாராக."] },
      { kind: "p", content: ["புதிய ஆண்டு என்றதுமே நம் நினைவுக்கு வருவது நாம் எடுக்கும் தீர்மானங்கள் தான். தீர்மானம் நம்மை ஆண்டவர் பார்வையில் அவரின் சிறந்த பிள்ளைகளாக உலக பார்வையில் சிறந்த மனிதர்களாக நம்மை தன்னால் தானே செதுக்க உதவுகின்றன. அந்த வகையில் தீர்மானம் எடுப்பது ஆகசிறந்தது. ஆனால் எடுத்த தீர்மானங்களை காபாற்றுவது பின்பற்றுவது என்பது மிகவும் கடினமான ஒரு காரியம்."] },
      { kind: "p", content: ["இதற்கு ஆதாரமாக இங்கிலாந்து தேசத்தை சேர்ந்த லாளலி, தன்னுடைய ஆய்வு அறிக்கையில் சொல்வது என்னவென்றால் எந்தவொரு தீர்மானத்தையும் ஒருவர் தன்னுடைய பழக்கமாக மாற்றுவதற்கு குறைந்தபட்சம் 18 நாட்கள் ஆகும் என்கின்றார். ஆனால் அதே ஆய்வறிக்கையில் அவர் குறிப்பிடுவது 33% சதவீத மக்கள் ஒரு மாதத்திற்குள்ளக தாங்கள் எடுக்கும் தீர்மானத்தில் தோற்றுவிடுகின்றனர். அதின்நிமித்தம் வழி தவறுகின்றனர், பழைய வழிக்கு செல்கின்றனர், தீர்மானத்தை விடுகின்றனர், தடுமாறி போகின்றனர்.", { note: 1 }] },
      { kind: "p", content: ["எனதருமை பிள்ளைகளே உலகத்தார் தீர்மானததில் இருந்து வழிதவறலாம் ஆனால் கிறிஸ்துவின் பிள்ளைகள் அப்படி செய்யலாகாது. ஆண்டவர் பின்பாக போக துணிந்த நீங்கள் மீண்டும் தடுமாறி பழைய பாவ வழிகளுக்கு செல்லலாகாது. ஒருவேளை இந்த ஆண்டில் நீங்கள் ஆண்டவற்கு பின்பாக செல்ல முடிவுஎடுத்து இந்த 18 நாட்களக்குள் தவறி இருப்பீர்கள் என்றால் உலகத்தார் போன்று தடுமாறி போகதிருங்கள்."] },
      { kind: "p", content: ["வேதம் சொல்கின்றது நீதி 24:16ல் நீதிமான் ஏழுதரம் விழுந்தாலும் திரும்பவும் எழுந்திருப்பான்; துன்மார்க்கரோ தீங்கிலே இடறுண்டு கிடப்பார்கள். நீங்கள் விழுந்தலாம், தடுமாறினாலும், தோற்றாலும், நீங்கள் நீதிமானாக ஆண்டவரின் பிள்ளையாக இருக்க அழைக்கப்பட்டவர்கள். நீங்கள் இந்த 18 நாட்களுக்குள்ளாக எவ்வளவு முறை தடுமாறி இருந்தாலும் நீங்கள் மீண்டும் எழுந்திருக்க அழைக்கபட்டவர்கள். தீர்மானததை காத்துக்கொள்ளுங்கள், போராட்டத்தை போராடுங்கள், நிச்சயமாக இந்த வருட முடிவில் மாற்றதை காண்பீர்கள், அவரின் பிள்ளைகளாக நீதியின் சூரியன் உங்கள் மேல் உதிப்பதை காண்பீர்கள்."] }
    ],
    notes: [
      [{ link: "onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674", href: "https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674" }, " (accessed on Jan 14, 2020)"]
    ]
  },
  {
    slug: "marumalarchi-aani-adippoma",
    title: "மறுமலர்ச்சி ஆணி அடிப்போமா?",
    language: "ta",
    author: "Rev. Jagan Sathiya Seelan",
    date: "2019-11-01",
    description: "A November letter in Tamil by Rev. Jagan Sathiya Seelan for Reformation Day, from Clay Pot, the writings column of Christ Tamil Church Chicago.",
    legacyPath: "/clay-pot/2019/11/01/மறுமலர்ச்சி-ஆணி-அடிப்போம",
    body: [
      { kind: "p", content: ["கிறிஸ்துவுக்குள் அன்பானவர்களே,"] },
      { kind: "p", content: ["உங்களுக்கு என் நவம்பர் மாத அன்பின் வாழ்த்துக்கள்."] },
      { kind: "p", content: ["நவம்பர் மாதம் என்றாலே எல்லோர்க்கும் நினைவுக்கு வருவது வருட முடிவு. பெரும்பாலான திருச்சபை காரியதரிசிகளும் கிறிஸ்துமஸ் கொண்டாட்டத்திற்கான, ஆயத்த வேலைகளை இந்த மாதத்தில் முடுக்கி விடுவர். காரணம் என்ன? வருட முடிவு."] },
      { kind: "p", content: ["ஆனால் இந்த நவம்பர் மாதம் திருச்சபை மறுமலர்ச்சி, சீர்திருத்தம் ஆகியவற்றின் முதல் நாள் என்பது நம்மில் எத்தனை பேருக்கு தெரியும்?. திருச்சபை வரலாற்றில் அக்டோபர் மாத கடைசி நாள் மற்றும் நவம்பர் மாத முதல் நாள் பொன்னெழுத்துக்களால் பொறிக்கப்பட வேண்டிய நாட்கள். காரணம் என்ன? ரோமன் கதோலிக திருச்சபையின் பிரதான குருவின் போதனைகள் முக்கியம் அல்ல, அவரின் எழுத்துக்கள் ரட்சிப்பு அல்ல, அவரின் வழிநடத்துதல் ஆண்டவரின் ராஜ்யத்தின் வழிகள் அல்ல, என்று மார்ட்டின் லூதர் கூக்குரல் இட்ட நாள் அக்டோபர் 31,1517. எவ்வாறாக நமது ஆண்டவராகியே இயேசு கிறிஸ்து ஈராயிரம் ஆண்டுகளுக்கு முன்பு பரிசேயர், சதுசேயர் என்பவர்களுக்கு எதிராக அறைகூவல் விடுத்தாரோ அதேபோன்று லூதர் விடுத்த அறைகூவல் அது. அந்த அறைகூவல் பற்றி எரிய தொடங்கிய நாள் நவம்பர் 1."] },
      { kind: "p", content: ["அக்டோபர் 31 தேதி, மார்ட்டின் லூதர் ஆண்டவரின் வசனத்தின் படி தான் எழுதிய 95 ஆய்வுஅறிக்கைகளை தன்னுடைய திருச்சபையின் வாசல்களில் ஆணி கொண்டு அறைந்தார். நவம்பர் 1, அனைத்து புனிதர்களின் நாள் நிமித்தம் திருச்சபைக்கு வந்திருந்தோர் கண்களில் அது பட்டது, தீயாய் பரவியது. ஆண்டவரின் கைகளிலும், கால்களிலும் அறையப்பட்ட ஆணிகள் எவ்வாறாக மனுக்குல வாழ்க்கையில் மாற்றத்தை கொண்டுவந்ததோ அதேபோன்று திருச்சபை வாசல்களில் அறையப்பட்ட ஆணிகள் திருச்சபை வாழ்வில் புதிய அத்தியாயத்தை ஏற்படுத்தியது."] },
      { kind: "p", content: ["லூதர் அறைந்த ஆய்வுஅறிக்கைகளின் சாராம்சம் என்ன?"] },
      {
        kind: "list",
        items: [
          "ஆண்டவர் மட்டுமே நமக்கு வழிகாட்டி (Christ alone),",
          "அவர்மேல் நாம் வைக்கும் விசுவாசம் மட்டுமே நம்மை அவரிடம் அழைத்து செல்லும் (Faith alone),",
          "அவர் நம்மேல் வைத்த கிருபையால் மட்டுமே நாம் ரட்சிப்பை சுதந்தரித்து கொள்ளுகின்றோம் (Grace alone),",
          "அவரின் வார்த்தையால் மட்டுமே நாம் பிழைக்கின்றோம் (Scripture alone)",
          "ஆகவே அவருக்கு மட்டுமே புகழும் மாட்சிமையும் செலுத்துவோம் (Glory to God alone)."
        ]
      },
      { kind: "p", content: ["ஏனென்றால் கத்தோலிக்க திருச்சபை பணம், பதவி, பொருள் ஆகிவற்றை கொண்டு பாவ மன்னிப்பு மற்றும் ரட்சிப்பு பெற முடியும் என்று நம்பியது. அதின் குரு அவ்வாறாக போதித்தார், வழிநடத்தினார். கத்தோலிக்க திருச்சபை ஆண்டவரை விட்டும் அவரின் வார்த்தையை விட்டும் வெகு தூரம் சென்று இருந்தது."] },
      { kind: "p", content: ["எனவே இந்த நாளில் எனக்கு அன்பான திருச்சபையே,"] },
      {
        kind: "list",
        items: [
          "லூதர் கூறிய இந்த ஐந்து காரியங்களும் உனக்குள் இருக்கின்றதா என்று, நீ இன்று சிந்தித்துப்பார்.",
          "நீ தனிநபர் புகழ் படுகின்றாயா, ஆண்டவர் புகழ் பாடுகின்றாயா?",
          "உனக்கு ஆண்டவர் வழிகாட்டியா, போதகர் வழிகாட்டியா?",
          "விசுவாசம் மற்றும் கிருபையா அல்லது பணம் மற்றும் பதவியா?",
          "பரமனின் வேதாகமமா இல்லை பாழ்கடிப்புகளின் ஆகமமா?"
        ]
      },
      {
        kind: "lines",
        lines: [
          "யோசனை செய்!",
          "இதில் ஏதாவது ஒன்றுக்கு உன் பதில் தவறாக இருக்குமாயின்,",
          "உன் வாசல்களிலும் ஆணி அறையும் நேரம் வந்துவிட்டது.",
          "நவம்பர் மாதம் முடிவல்ல ஆரம்பம்."
        ]
      }
    ]
  },
  {
    slug: "pentecostal-paradoxes",
    title: "Pentecostal Paradoxes",
    language: "en",
    author: "Ajith Samuel",
    date: "2016-05-15",
    description: "A Pentecost Sunday reflection by Ajith Samuel on the striking parallels and contrasts between Mount Sinai and Mount Zion.",
    legacyPath: "/clay-pot/2016/05/15/pentecostal-paradoxes",
    body: [
      { kind: "p", content: ["Today is Pentecost Sunday. I can’t help but remember how in the church I grew up, Pentecost Sunday used to be observed in a muted fashion. In many mainline churches, Pentecost Sunday is deemphasized, knowingly or unwittingly."] },
      { kind: "p", content: ["To a conventional CSI (Church of South India) congregant like myself, the word “Pentecost” evokes vivid images of the purposefully distinctive white attire of the denominational Pentecostals in South India. Literally, the word “Pentecost” is of Greek origin and simply means fiftieth. It is that simple, yet profound in nature; so profound that it is referred as the birth date of the church."] },
      { kind: "p", content: ["On the fiftieth day after resurrection morning, God, in the form of the Holy Spirit, came down to dwell in the hearts of His people. Various bible scholars indicate that it happened in an upper room on Mount Zion.", { note: 1 }, " This historical event was very much real and the most important event right next to the birth and resurrection of Jesus. For any such real things in the New Testament, shadows are often cast in the Old Testament.", { note: 2 }, " An unmistakable hint was cast nearly 1,500 years before the Day of Pentecost in the times of the Old Testament, at Mount Sinai. Precisely fifty days after the Israelites left the bondage of Egypt, the Ten Commandments was thundered from the top of Mt. Sinai."] },
      { kind: "p", content: ["A striking resemblance between the events at Mt. Sinai and Mt. Zion is their anchor points. The Mt. Sinai event occurred on the fiftieth day of the Passover and Mt. Zion event on the fiftieth day of the Easter. While the Passover marks the deliverance from earthly bondage, the resurrection of Christ marks the deliverance from eternal bondage."] },
      { kind: "p", content: ["The plot thickens, as the parallels continue. Both events were accompanied by strikingly similar graphic and acoustic elements. At Mt. Sinai, the glory of the Lord appeared “like a consuming fire” and at Mt. Zion it similarly appeared as “divided tongues, as of fire.” At Mt. Sinai, there were “thunderings and lightnings … the sound of the trumpet was very loud”", { note: 3 }, " and at Mt. Zion, “a sound from heaven, as of a rushing mighty wind”", { note: 4 }, " was heard. Mt. Sinai was only a hint to the awesome plan to come at Mt. Zion.", { note: 5 }] },
      { kind: "p", content: ["At Mt. Sinai, God wrote the law on stone tablets, and at Pentecost He wrote the law “on their hearts”.", { note: 6 }, " While the chosen ones were busy celebrating Jehovah’s giving of His laws on tablets of stone, the Holy Spirit came down and wrote His laws on everyone’s hearts. The indwelling Spirit in the tablets of human hearts replaced the tablets of stone. If Mt. Sinai’s Ten Commandments is a static map to guide us on how to live, then the indwelling Spirit at Mt. Zion is a dynamic GPS to constantly guide us on our journey through life. Mt. Sinai is the shadow, while Mt. Zion is the real thing.", { note: 5 }] },
      { kind: "p", content: ["Here is the kicker: as that day progressed, contrasting events took place as a figurative hint. At Mt. Sinai, 3,000 men died", { note: 7 }, " on the day the law was given. At Mt. Zion 3,000 people were saved", { note: 8 }, " on the day the Holy Spirit was given. The law brought death, while the Spirit brought life! The letter kills, but the Spirit gives life.", { note: 9 }] },
      { kind: "p", content: ["This curious confluence of parallel motifs and contrasts brings about a fascinating antithetical resemblance that demands a compelling question – are these two happenings just a sheer coincidence? Or as G.K. Chesterton would put it, is “truth standing on her head to attract the attention” of conventional congregants?"] }
    ],
    notes: [
      ["Taylor, John William. ", { link: "The Coming of the Saints", href: "https://archive.org/details/comingofthesaint00tayluoft" }, ". 1906. p.39"],
      ["Colossians 2:17"],
      ["Exodus 19:16"],
      ["Acts 2:2"],
      ["Hebrews 10:1"],
      ["Jeremiah 31:33"],
      ["Exodus 32:28"],
      ["Acts 2:41"],
      ["II Corinthians 3:6"]
    ]
  }
] as const satisfies readonly ClayPotWriting[];

export type ClayPotSlug = (typeof clayPotWritings)[number]["slug"];

export function clayPotWritingPath(slug: string) {
  return `${clayPotPath}/${slug}`;
}

/** Issue number: the oldest writing is No. 1. */
export function clayPotIssue(slug: string) {
  const index = clayPotWritings.findIndex((writing) => writing.slug === slug);
  return clayPotWritings.length - index;
}

export const clayPotLanguageLabel = {
  ta: { short: "தமிழ்", long: "Written in Tamil" },
  en: { short: "English", long: "Written in English" }
} as const;

export function formatClayPotDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

/** Plain text of a writing's opening paragraphs, for previews. */
export function clayPotOpening(writing: ClayPotWriting, paragraphs = 3) {
  return writing.body
    .filter((block): block is Extract<ClayPotBlock, { kind: "p" }> => block.kind === "p")
    .slice(0, paragraphs)
    .map((block) => block.content.filter((part): part is string => typeof part === "string").join(""));
}
