import bibleStudyHomePrayer from "../assets/images/bible-study-home-prayer.jpg";
import bibleStudyCircle from "../assets/images/bible-study-circle.jpg";
import churchPicnicGrill from "../assets/images/church-picnic-grill.jpg";
import ctcHeroBackground from "../assets/images/ctc-hero-background-green.webp";
import ctcHeroBackgroundMobile from "../assets/images/ctc-hero-background-green-mobile.webp";
import ctcHeroImage from "../assets/images/ctc-hero-image.jpg";
import ctcLogo from "../assets/images/ctc-logo.png";
import familyCampGames from "../assets/images/family-camp-games.jpg";
import fellowshipCampfire from "../assets/images/fellowship-campfire.jpg";
import fellowshipCarnival from "../assets/images/fellowship-carnival.jpg";
import fellowshipChristmas from "../assets/images/fellowship-christmas.jpg";
import fellowshipHarvest from "../assets/images/fellowship-harvest.jpg";
import fellowshipHourHall from "../assets/images/fellowship-hour-hall.jpg";
import fellowshipTable from "../assets/images/fellowship-meal.jpg";
import fellowshipPicnic from "../assets/images/fellowship-picnic.jpg";
import mensFellowshipGroup from "../assets/images/mens-fellowship-group.jpg";
import ministryKids from "../assets/images/ministry-kids.jpg";
import ministrySchool from "../assets/images/ministry-school.jpg";
import outreachHall from "../assets/images/outreach-hall.jpg";
import outreachHero from "../assets/images/outreach-hero-group.jpg";
import outreachMeal from "../assets/images/outreach-meal.jpg";
import outreachPackingLine from "../assets/images/outreach-packing-line.jpg";
import outreachSeniorHome from "../assets/images/outreach-senior-home.jpg";
import outreachSealing from "../assets/images/outreach-sealing.jpg";
import outreachPrayer from "../assets/images/outreach-street-prayer.jpg";
import sundaySchoolBibleTable from "../assets/images/sunday-school-bible-table.jpg";
import sundaySchoolOutdoor from "../assets/images/sunday-school-outdoor.jpg";
import sundaySchoolColoring from "../assets/images/sunday-school-coloring.jpg";
import vbsCrafts from "../assets/images/vbs-crafts.jpg";
import womensFellowshipPainting from "../assets/images/womens-fellowship-painting.jpg";
import worshipEaster from "../assets/images/worship-easter.jpg";
import worshipHall from "../assets/images/worship-fellowship-hall.jpg";
import worshipKidsChoir from "../assets/images/worship-kids-choir.jpg";
import worshipTeam from "../assets/images/worship-team-cross.jpg";
import worshipTeamStage from "../assets/images/worship-team-red-stage.jpg";
import worshipTeamScreens from "../assets/images/worship-team-screens.jpg";
import worshipYouth from "../assets/images/worship-youth.jpg";

export type SiteImage = {
  id: string;
  src: string;
  alt: string;
  creditName: string;
  creditUrl: string;
  unsplashUrl: string;
  usage: string;
  objectPosition?: string;
};

const utm = "utm_source=christ_tamil_church&utm_medium=referral";

export const siteImages = {
  sundaySchool: {
    id: "ctc-sunday-school",
    src: ministrySchool,
    alt: "Children learning together in Christ Tamil Church Sunday School",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Sunday School hero",
    objectPosition: "center center"
  },
  sundaySchoolOutdoor: {
    id: "ctc-sunday-school-outdoor",
    src: sundaySchoolOutdoor,
    alt: "Children in matching purple shirts gathered around an outdoor table with their Bibles as a young leader teaches",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Sunday School event card (autumn-film grade)",
    objectPosition: "center center"
  },
  sundaySchoolColoring: {
    id: "ctc-sunday-school-coloring",
    src: sundaySchoolColoring,
    alt: "Children in festive clothes and flower hair garlands gathered on the floor colouring 'He is risen' Easter pages",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Sunday School hero (autumn-film grade)",
    objectPosition: "center 48%"
  },
  sundaySchoolBibleTable: {
    id: "ctc-sunday-school-bible-table",
    src: sundaySchoolBibleTable,
    alt: "A Sunday School teacher reading Scripture with children as they follow along in their Bibles at a classroom table",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Sunday School parent band (autumn-film grade)",
    objectPosition: "center 35%"
  },
  kidsMinistry: {
    id: "ctc-kids-ministry",
    src: ministryKids,
    alt: "Children participating in ministry at Christ Tamil Church",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Children's ministry supporting image",
    objectPosition: "center center"
  },
  outreachHero: {
    id: "ctc-outreach-hero",
    src: outreachHero,
    alt: "Christ Tamil Church volunteers at Feed My Starving Children holding signs for the countries their packed meals will reach, including Haiti, Kenya, Guatemala, and the Philippines",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Community Outreach hero and Outreach event card (autumn-film grade)",
    objectPosition: "center 45%"
  },
  outreachPackingLine: {
    id: "ctc-outreach-packing-line",
    src: outreachPackingLine,
    alt: "Smiling volunteers in hairnets scooping rice and soy into meal bags at the packing line",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Community Outreach collage (autumn-film grade)",
    objectPosition: "center center"
  },
  outreachSealing: {
    id: "ctc-outreach-sealing",
    src: outreachSealing,
    alt: "A volunteer sealing meal packets at the packing line",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Community Outreach collage (autumn-film grade)",
    objectPosition: "center center"
  },
  outreachHall: {
    id: "ctc-outreach-hall",
    src: outreachHall,
    alt: "A full Feed My Starving Children packing hall, with rows of volunteers in hairnets filling meal bags",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Community Outreach collage (autumn-film grade)",
    objectPosition: "center center"
  },
  outreachMeal: {
    id: "ctc-outreach-meal",
    src: outreachMeal,
    alt: "Church volunteers serving a hot meal to neighbors at a long buffet table",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Community Outreach collage (autumn-film grade)",
    objectPosition: "center center"
  },
  outreachSeniorHome: {
    id: "ctc-outreach-senior-home",
    src: outreachSeniorHome,
    alt: "Church youth in Santa hats singing Christmas carols with guitar and keyboard for residents of a senior home",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Community Outreach collage (autumn-film grade)",
    objectPosition: "center 60%"
  },
  outreachPrayer: {
    id: "ctc-outreach-prayer",
    src: outreachPrayer,
    alt: "A church member praying with a neighbor on a downtown Chicago sidewalk during street outreach",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Community Outreach collage (autumn-film grade)",
    objectPosition: "center 30%"
  },
  fellowshipPicnic: {
    id: "ctc-fellowship-picnic",
    src: fellowshipPicnic,
    alt: "Church families playing a water balloon toss in two lines under the trees at the summer picnic",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Fellowship hero collage (autumn-film grade)",
    objectPosition: "center center"
  },
  fellowshipHarvest: {
    id: "ctc-fellowship-harvest",
    src: fellowshipHarvest,
    alt: "Harvest Festival tables lined with homemade mango pickle, snacks, and fruit baskets",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Fellowship hero collage (autumn-film grade)",
    objectPosition: "center center"
  },
  fellowshipCampfire: {
    id: "ctc-fellowship-campfire",
    src: fellowshipCampfire,
    alt: "Families and children roasting marshmallows around a campfire at family camp",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Fellowship hero collage (autumn-film grade)",
    objectPosition: "center center"
  },
  fellowshipCarnival: {
    id: "ctc-fellowship-carnival",
    src: fellowshipCarnival,
    alt: "A balloon arch and Christ Tamil Church Carnival banner welcoming families to the summer carnival",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Fellowship hero collage (autumn-film grade)",
    objectPosition: "center 40%"
  },
  fellowshipChristmas: {
    id: "ctc-fellowship-christmas",
    src: fellowshipChristmas,
    alt: "Children and families dancing with Santa beside a Christmas tree during carol rounds",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Fellowship hero collage (autumn-film grade)",
    objectPosition: "center center"
  },
  fellowshipTable: {
    id: "ctc-fellowship-table",
    src: fellowshipTable,
    alt: "The pastor greeting church members as they share a meal served on banana leaves",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Fellowship hour section (autumn-film grade)",
    objectPosition: "center center"
  },
  fellowshipHourHall: {
    id: "ctc-fellowship-hour-hall",
    src: fellowshipHourHall,
    alt: "A full fellowship hall of families and children seated together, smiling during a church gathering",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Fellowship Hour event card (autumn-film grade)",
    objectPosition: "center center"
  },
  logo: {
    id: "ctc-logo",
    src: ctcLogo,
    alt: "Christ Tamil Church Chicago logo",
    creditName: "Christ Tamil Church",
    creditUrl: "https://www.christtamilchurch.com/",
    unsplashUrl: "",
    usage: "Site header and footer logo"
  },
  heroBackground: {
    id: "ctc-hero-background-green",
    src: ctcHeroBackground,
    alt: "",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Homepage hero background",
    objectPosition: "center right"
  },
  heroBackgroundMobile: {
    id: "ctc-hero-background-green-mobile",
    src: ctcHeroBackgroundMobile,
    alt: "",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Homepage hero background (portrait crop for phones)"
  },
  hero: {
    id: "ctc-hero-image",
    src: ctcHeroImage,
    alt: "Exterior of Christ Tamil Church with the cross and church sign visible",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Homepage hero",
    objectPosition: "38% 50%"
  },
  worshipTeam: {
    id: "ctc-worship-team",
    src: worshipTeam,
    alt: "The Christ Tamil Church worship team leading songs beneath the lit cross, with Tamil lyrics on the screen",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Worship hero collage (autumn-film grade)",
    objectPosition: "center 60%"
  },
  worshipTeamScreens: {
    id: "ctc-worship-team-screens",
    src: worshipTeamScreens,
    alt: "Worship leaders in saris and shirts singing at microphones in front of the altar",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Worship hero collage (autumn-film grade)",
    objectPosition: "center 70%"
  },
  worshipYouth: {
    id: "ctc-worship-youth",
    src: worshipYouth,
    alt: "Children and youth reading and singing together at the front of the sanctuary",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Worship hero collage (autumn-film grade)",
    objectPosition: "center 65%"
  },
  worshipEaster: {
    id: "ctc-worship-easter",
    src: worshipEaster,
    alt: "The choir singing with keyboard and drums on Easter Sunday, with He Is Risen banners beside the cross",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Worship hero collage (autumn-film grade)",
    objectPosition: "center 55%"
  },
  worshipTeamStage: {
    id: "ctc-worship-team-stage",
    src: worshipTeamStage,
    alt: "Singers and a keyboardist leading worship on the red-carpeted stage",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Worship hero collage (autumn-film grade)",
    objectPosition: "center 60%"
  },
  worshipKidsChoir: {
    id: "ctc-worship-kids-choir",
    src: worshipKidsChoir,
    alt: "The children's choir standing together and singing in front of the altar",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Worship hero collage (autumn-film grade)",
    objectPosition: "center 60%"
  },
  worshipHall: {
    id: "ctc-worship-hall",
    src: worshipHall,
    alt: "A worship band with guitars and keyboard leading songs in the fellowship hall",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Worship hero collage (autumn-film grade)",
    objectPosition: "center 40%"
  },
  worship: {
    id: "small-group-network-community",
    src: "https://images.unsplash.com/photo-1629141649389-1b2b61d7d6f0?auto=format&fit=crop&w=1400&q=80",
    alt: "Small church community group gathered in bright natural light",
    creditName: "Small Group Network",
    creditUrl: `https://unsplash.com/@smallgroupnetwork?${utm}`,
    unsplashUrl: "https://unsplash.com/photos/man-in-blue-polo-shirt-sitting-on-black-armchair-G5Dr31rP0ZA",
    usage: "Welcome/about section",
    objectPosition: "center center"
  },
  bibleStudyCircle: {
    id: "ctc-bible-study-circle",
    src: bibleStudyCircle,
    alt: "Youth and young adults sitting in a circle of chairs, talking together during Bible study",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Bible Study page hero and Bible Study event card (autumn-film grade)",
    objectPosition: "center 58%"
  },
  bibleStudyHomePrayer: {
    id: "ctc-bible-study-home-prayer",
    src: bibleStudyHomePrayer,
    alt: "Church members gathered in a sunlit living room with Bibles, praying together as a leader speaks",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Bible Study 'What to expect' section (autumn-film grade)",
    // Anchor right so the standing leader at the right edge is never cropped.
    objectPosition: "right 72%"
  },
  bibleStudy: {
    id: "aaron-burden-open-bible",
    src: "https://images.unsplash.com/photo-1593485552030-019bfbf6ee1d?auto=format&fit=crop&w=1200&q=80",
    alt: "Open Bible in warm sunlight",
    creditName: "Aaron Burden",
    creditUrl: `https://unsplash.com/@aaronburden?${utm}`,
    unsplashUrl: "https://unsplash.com/photos/white-book-page-on-brown-wooden-table-9d6mKooS324",
    usage: "Bible Study ministry and supporting event",
    objectPosition: "center center"
  },
  prayer: {
    id: "christian-harb-congregation-prayer",
    src: "https://images.unsplash.com/photo-1760367121608-79219f1c9d2a?auto=format&fit=crop&w=1200&q=80",
    alt: "Congregation bowing their heads together in prayer",
    creditName: "Christian Harb",
    creditUrl: `https://unsplash.com/@c7arb?${utm}`,
    unsplashUrl: "https://unsplash.com/photos/a-crowd-of-people-bowing-their-heads-in-prayer-I5WoV6h36n0",
    usage: "Prayer ministry",
    objectPosition: "center center"
  },
  events: {
    id: "helena-lopes-community",
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    alt: "Friends gathered together outdoors at sunset",
    creditName: "Helena Lopes",
    creditUrl: `https://unsplash.com/@wildlittlethingsphoto?${utm}`,
    unsplashUrl: "https://unsplash.com/s/photos/church-family",
    usage: "Events section",
    objectPosition: "center center"
  },
  mensFellowship: {
    id: "ctc-mens-fellowship",
    src: mensFellowshipGroup,
    alt: "The Christ Tamil Church men's fellowship in matching Cool Dad Crew shirts, gathered outside the church building",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Men's Fellowship event (autumn-film grade)",
    objectPosition: "center center"
  },
  womensFellowship: {
    id: "ctc-womens-fellowship",
    src: womensFellowshipPainting,
    alt: "Women from the church smiling and holding up the matching truck paintings they made together at a paint night",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Women's Fellowship event (autumn-film grade)",
    objectPosition: "center center"
  },
  churchPicnic: {
    id: "ctc-church-picnic",
    src: churchPicnicGrill,
    alt: "Church men grilling burgers and chicken together under a park picnic shelter",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Church Picnic event (autumn-film grade)",
    objectPosition: "center 35%"
  },
  familyCamp: {
    id: "ctc-family-camp",
    src: familyCampGames,
    alt: "Family camp friends cheering and laughing as a giant wooden block tower topples",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Family Camp event (autumn-film grade)",
    objectPosition: "center center"
  },
  kidsCraft: {
    id: "ctc-vbs-crafts",
    src: vbsCrafts,
    alt: "Children in Vacation Bible School shirts making crafts along a long table with youth helpers",
    creditName: "Christ Tamil Church",
    creditUrl: "",
    unsplashUrl: "",
    usage: "Vacation Bible School event (autumn-film grade)",
    objectPosition: "center center"
  },
  fellowshipMeal: {
    id: "jonathan-borba-fellowship-meal",
    src: "https://images.unsplash.com/photo-1558661092-f9ad8c1c63c1?auto=format&fit=crop&w=1200&q=80",
    alt: "Friends sharing bread and a meal around a table",
    creditName: "Jonathan Borba",
    creditUrl: `https://unsplash.com/@jonathanborba?${utm}`,
    unsplashUrl: "https://unsplash.com/photos/f9ad8c1c63c1",
    usage: "Fellowship Hour event",
    objectPosition: "center center"
  },
} satisfies Record<string, SiteImage>;
