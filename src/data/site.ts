import { siteImages } from "./images";
import { churchYoutubeChannelUrl } from "./sermonVideos";

export const churchInfo = {
  worship: {
    time: "10:30 AM",
    schedule: "Sunday at 10:30 AM"
  },
  address: {
    street: "1330 63rd St",
    city: "Downers Grove",
    state: "IL",
    zip: "60516",
    short: "1330 63rd St, Downers Grove, IL",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=1330%2063rd%20St%20Downers%20Grove%20IL%2060516"
  },
  contact: {
    phone: "(773) 936-3097",
    phoneHref: "tel:+17739363097",
    email: "info@christtamilchurch.com",
    emailHref: "mailto:info@christtamilchurch.com"
  },
  social: {
    facebookUrl: "https://www.facebook.com/ChristTamilChurchChicago",
    instagramUrl: "https://www.instagram.com/christtamilchurchchicago/",
    youtubeUrl: churchYoutubeChannelUrl
  }
} as const;

// Update this single object when the featured weekly scripture changes.
export const verseOfTheWeek = {
  label: "Verse of the Week",
  text: "என்னைப் பெலப்படுத்துகிற கிறிஸ்துவினாலே எல்லாவற்றையும் செய்ய எனக்குப் பெலனுண்டு.",
  reference: "Philippians 4:13"
} as const;


export type ChurchEvent = {
  title: string;
  frequency: string;
  time?: string;
  category: string;
  description: string;
  date: string;
  location?: string;
  image: string | null;
};

// Church admin/developer note:
// Add or update events here; the Events page lists every entry in this order.
// Bible Study & Prayer also reads the schedule of a few entries by title, so
// renaming one of those is a compile error until that page is updated too.
export const churchEvents = [
  {
    title: "Sunday Worship Service",
    frequency: "Every Sunday",
    time: churchInfo.worship.time,
    category: "Tamil & English Worship",
    description:
      "Join us for Tamil and English worship, prayer, Scripture, sermon, children's ministry, communion, and fellowship.",
    date: "Every Sunday",
    location: "Christ Tamil Church",
    image: siteImages.worshipSundayService.src
  },
  {
    title: "Sunday School",
    frequency: "Every Sunday",
    time: "During worship",
    category: "Children's Ministry",
    description:
      "Bible-based learning for children to grow in faith through age-appropriate lessons and activities.",
    date: "Every Sunday",
    location: "Christ Tamil Church",
    image: siteImages.sundaySchoolOutdoor.src
  },
  {
    title: "Prayer Conference",
    frequency: "Monday to Thursday",
    time: "7:00 PM",
    category: "Prayer Gathering",
    description:
      "Join us during the week for prayer, encouragement, and spiritual strengthening as a church family.",
    date: "Monday to Thursday",
    location: "UberConference (online)",
    image: siteImages.prayerTamilBible.src
  },
  {
    title: "Bible Study & Prayer",
    frequency: "Friday",
    time: "7:30 PM",
    category: "Weekly Bible Study",
    description:
      "Grow deeper in God's Word through weekly Bible study and prayer on Friday evenings.",
    date: "Friday",
    location: "Christ Tamil Church",
    image: siteImages.bibleStudyCircle.src
  },
  {
    title: "Fasting Prayer",
    frequency: "First Saturday of every month",
    time: "10:30 AM",
    category: "Prayer & Fasting",
    description:
      "A dedicated time of prayer, fasting, worship, and seeking God together.",
    date: "First Saturday of every month",
    location: "Christ Tamil Church",
    image: siteImages.prayerFastingBowed.src
  },
  {
    title: "Men's Fellowship",
    frequency: "Periodic Gathering",
    category: "Men's Ministry",
    description:
      "A time for men to grow in faith, encourage one another, and build Christ-centered relationships.",
    date: "Periodic Gathering",
    location: "Christ Tamil Church",
    image: siteImages.mensFellowship.src
  },
  {
    title: "Women's Fellowship",
    frequency: "Periodic Gathering",
    category: "Women's Ministry",
    description:
      "A gathering for women to worship, learn, pray, and encourage one another in faith.",
    date: "Periodic Gathering",
    location: "Christ Tamil Church",
    image: siteImages.womensFellowship.src
  },
  {
    title: "Outreach",
    frequency: "Seasonal / As Scheduled",
    time: "Saturday before Communion Sunday, 4:30 PM",
    category: "Community Outreach",
    description:
      "Serving our community through love, care, prayer, and practical support.",
    date: "Seasonal / As Scheduled",
    location: "Chicago Area",
    image: siteImages.outreachHero.src
  },
  {
    title: "Vacation Bible School",
    frequency: "Every Summer",
    category: "Children's Summer Ministry",
    description:
      "A joyful summer program where children learn God's Word through Bible stories, songs, games, crafts, and activities.",
    date: "Every Summer",
    location: "Christ Tamil Church",
    image: siteImages.kidsCraft.src
  },
  {
    title: "Church Picnic",
    frequency: "Every June",
    category: "Family Fellowship",
    description:
      "A yearly outdoor gathering for food, fellowship, games, and community as a church family.",
    date: "Every June",
    image: siteImages.churchPicnic.src
  },
  {
    title: "Family Camp",
    frequency: "Labor Day Weekend Every Year",
    category: "Family Retreat",
    description:
      "A yearly family retreat for worship, teaching, fellowship, rest, and spiritual renewal.",
    date: "Labor Day Weekend Every Year",
    image: siteImages.familyCamp.src
  },
  {
    title: "Fellowship Hour",
    frequency: "After Service",
    category: "Fellowship",
    description:
      "Stay after worship to connect, encourage one another, and share life together.",
    date: "After Service",
    location: "Christ Tamil Church",
    image: siteImages.fellowshipHourHall.src
  }
] as const satisfies readonly ChurchEvent[];

export type ChurchEventTitle = (typeof churchEvents)[number]["title"];

export type Belief = {
  title: string;
  text: string;
};

export const beliefs: Belief[] = [
  {
    title: "God, the Father Almighty",
    text:
      "We believe in God, the Father Almighty, maker of heaven and earth (Heb. 11:3); and in Jesus Christ, His only Son, our Lord (Matt. 26:63-64); and in the Holy Spirit, the Comforter sent by God to teach and remind us (John 14:26); and that these three are one God."
  },
  {
    title: "The Scriptures",
    text:
      "We reverently receive the Scriptures of the Old and New Testaments, and believe that every part of Scripture is God-breathed and useful for showing us truth, exposing rebellion, correcting mistakes, and training us to live God's way (II Tim. 3:16)."
  },
  {
    title: "The Lord Jesus Christ",
    text:
      "We believe in the Lord Jesus Christ, who in the beginning was with God and was God, and who Himself bore our sins in His body on the tree, so that we might die to sins and live for righteousness (1 Peter 2:24)."
  },
  {
    title: "The Holy Spirit",
    text:
      "We believe the Holy Spirit has led us to repent of all our sins, turn from them, and obey Christ where He says, \"If anyone would come after me, he must deny himself and take up his cross and follow me\" (Mark 8:34)."
  },
  {
    title: "Resurrection and Judgement",
    text:
      "We believe the resurrection of the dead and the final judgement of all people. Whoever believes in the Son has eternal life, but whoever rejects the Son will not see life, for God's wrath remains on him (John 3:36)."
  },
  {
    title: "Grace Through Faith",
    text:
      "We believe that we are saved by grace through faith in the Lord Jesus Christ, and that good works are the certain fruit of such faith. Salvation is a gift of God, claimed by faith and not through our works (Eph. 2:8), and we have to endure unto the end to be saved (Matt. 10:22)."
  },
  {
    title: "Church Life",
    text:
      "We cheerfully submit ourselves to the instruction and government of this church, and we promise to promote its purity, peace, and welfare by all means within our power, so long as we shall continue to be a member."
  }
];
