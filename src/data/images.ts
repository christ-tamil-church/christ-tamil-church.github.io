import ctcHeroBackground from "../assets/images/ctc-hero-background-green.webp";
import ctcHeroBackgroundMobile from "../assets/images/ctc-hero-background-green-mobile.webp";
import ctcHeroImage from "../assets/images/ctc-hero-image.jpg";
import ctcLogo from "../assets/images/ctc-logo.png";
import ministryKids from "../assets/images/ministry-kids.jpg";
import ministrySchool from "../assets/images/ministry-school.jpg";

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
    id: "matheus-ferrero-mens-fellowship",
    src: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1200&q=80",
    alt: "Four friends sitting together on a mountain trail",
    creditName: "Matheus Ferrero",
    creditUrl: `https://unsplash.com/@matheusferrero?${utm}`,
    unsplashUrl: "https://unsplash.com/photos/699cd4e2cf59",
    usage: "Men's Fellowship event",
    objectPosition: "center center"
  },
  womensFellowship: {
    id: "meredith-spencer-womens-study",
    src: "https://images.unsplash.com/photo-1663162550932-f67b561e656f?auto=format&fit=crop&w=1200&q=80",
    alt: "Friends gathered on the grass reading together",
    creditName: "Meredith Spencer",
    creditUrl: `https://unsplash.com/@meredithspencer22?${utm}`,
    unsplashUrl: "https://unsplash.com/photos/f67b561e656f",
    usage: "Women's Fellowship event",
    objectPosition: "center center"
  },
  churchPicnic: {
    id: "liviu-boldis-family-picnic",
    src: "https://images.unsplash.com/photo-1719759336550-4fecc23ab176?auto=format&fit=crop&w=1200&q=80",
    alt: "A family relaxing together on a picnic blanket",
    creditName: "Liviu Boldis",
    creditUrl: `https://unsplash.com/@livioart?${utm}`,
    unsplashUrl: "https://unsplash.com/photos/4fecc23ab176",
    usage: "Church Picnic event",
    objectPosition: "center center"
  },
  familyCamp: {
    id: "kitera-dent-group-retreat",
    src: "https://images.unsplash.com/photo-1597120590849-a1d5a743d155?auto=format&fit=crop&w=1200&q=80",
    alt: "A group walking together along a wooded trail",
    creditName: "Kitera Dent",
    creditUrl: `https://unsplash.com/@kitera?${utm}`,
    unsplashUrl: "https://unsplash.com/photos/a1d5a743d155",
    usage: "Family Camp event",
    objectPosition: "center center"
  },
  kidsCraft: {
    id: "alan-rodriguez-kids-craft",
    src: "https://images.unsplash.com/photo-1617117206620-b01f2919ff86?auto=format&fit=crop&w=1200&q=80",
    alt: "Children drawing together with colorful markers and crayons",
    creditName: "Alan Rodriguez",
    creditUrl: `https://unsplash.com/@alanrodriguez?${utm}`,
    unsplashUrl: "https://unsplash.com/photos/b01f2919ff86",
    usage: "Vacation Bible School event",
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
