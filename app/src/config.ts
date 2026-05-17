// =============================================================================
// Книжный Клуб - Configuration
// =============================================================================
// All site content is configured here. Components render nothing when their
// primary config fields are empty strings or empty arrays.
// =============================================================================

// -----------------------------------------------------------------------------
// Site Config
// -----------------------------------------------------------------------------
export interface SiteConfig {
  title: string;
  description: string;
  language: string;
  keywords: string;
  ogImage: string;
  canonical: string;
}

export const siteConfig: SiteConfig = {
  title: "Книжный Клуб | Читай. Обсуждай. Вдохновляйся.",
  description: "Книжный клуб для тех, кто хочет читать больше и думать глубже. Ежемесячные встречи, интересные книги и единомышленники.",
  language: "ru",
  keywords: "книжный клуб, чтение, книги, г Актобе, Казахстан, литература, обсуждение книг",
  ogImage: "/images/hero-banner.jpg",
  canonical: "",
};

// -----------------------------------------------------------------------------
// Navigation Config
// -----------------------------------------------------------------------------
export interface NavDropdownItem {
  name: string;
  href: string;
}

export interface NavLink {
  name: string;
  href: string;
  icon: string;
  dropdown?: NavDropdownItem[];
}

export interface NavigationConfig {
  brandName: string;
  brandSubname: string;
  tagline: string;
  navLinks: NavLink[];
  ctaButtonText: string;
}

export const navigationConfig: NavigationConfig = {
  brandName: "КнижныйКлуб",
  brandSubname: "Актобе",
  tagline: "Читай больше. Живи глубже.",
  navLinks: [
    { name: "Главная", href: "#hero", icon: "Home" },
    { name: "О клубе", href: "#about", icon: "BookOpen" },
    { name: "Книги", href: "#books", icon: "BookOpen" },
    { name: "События", href: "#events", icon: "Users" },
    { name: "Контакты", href: "#contact", icon: "Mail" },
  ],
  ctaButtonText: "Присоединиться",
};

// -----------------------------------------------------------------------------
// Preloader Config
// -----------------------------------------------------------------------------
export interface PreloaderConfig {
  brandName: string;
  brandSubname: string;
  yearText: string;
}

export const preloaderConfig: PreloaderConfig = {
  brandName: "КнижныйКлуб",
  brandSubname: "Актобе",
  yearText: "Est. 2025",
};

// -----------------------------------------------------------------------------
// Hero Config
// -----------------------------------------------------------------------------
export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
}

export interface HeroConfig {
  scriptText: string;
  mainTitle: string;
  ctaButtonText: string;
  ctaTarget: string;
  stats: HeroStat[];
  decorativeText: string;
  backgroundImage: string;
}

export const heroConfig: HeroConfig = {
  scriptText: "Добро пожаловать в наше книжное сообщество Шаңырақ",
  mainTitle: "Читай.\nОбсуждай.\nВдохновляйся.",
  ctaButtonText: "Вступить в клуб",
  ctaTarget: "#join",
  stats: [
    { value: 500, suffix: "+", label: "Участников" },
    { value: 48, suffix: "", label: "Книг прочитано" },
    { value: 12, suffix: "", label: "Встреч в году" },
  ],
  decorativeText: "Книжный клуб Актобе",
  backgroundImage: "/images/hero-banner.jpg",
};

// -----------------------------------------------------------------------------
// Wine Showcase Config ( repurposed as Book Showcase )
// -----------------------------------------------------------------------------
export interface Wine {
  id: string;
  name: string;
  subtitle: string;
  year: string;
  image: string;
  filter: string;
  glowColor: string;
  description: string;
  tastingNotes: string;
  alcohol: string;
  temperature: string;
  aging: string;
}

export interface WineFeature {
  icon: string;
  title: string;
  description: string;
}

export interface WineQuote {
  text: string;
  attribution: string;
  prefix: string;
}

export interface WineShowcaseConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  wines: Wine[];
  features: WineFeature[];
  quote: WineQuote;
}

export const wineShowcaseConfig: WineShowcaseConfig = {
  scriptText: "Книга этого месяца",
  subtitle: "Май 2026",
  mainTitle: "Мастер и Маргарита",
  wines: [
    {
      id: "book-month",
      name: "Мастер и Маргарита",
      subtitle: "Михаил Булгаков",
      year: "1967",
      image: "/images/book-month.jpg",
      filter: "",
      glowColor: "bg-emerald-800/20",
      description: "Величайший роман XX века о любви, добре и зле. История Мастера, написавшего роман о Понтии Пилате, и его возлюбленной Маргариты, готовой на всё ради спасения его творения.",
      tastingNotes: "Философская притча, сатира, мистика и романтика в одном произведении",
      alcohol: "480",
      temperature: "Классика",
      aging: "Роман",
    },
  ],
  features: [
    { icon: "BookOpen", title: "480 страниц", description: "Объём для комфортного чтения за месяц" },
    { icon: "Clock", title: "Классика", description: "Вечное произведение русской литературы" },
    { icon: "Sparkles", title: "Обсуждение", description: "Глубокие темы для живых дискуссий" },
  ],
  quote: {
    text: "Рукописи не горят. Истинное искусство вечно.",
    attribution: "Михаил Булгаков",
    prefix: "«",
  },
};

// -----------------------------------------------------------------------------
// Winery Carousel Config ( repurposed as Events Carousel )
// -----------------------------------------------------------------------------
export interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
  area: string;
  unit: string;
  description: string;
}

export interface WineryCarouselConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  locationTag: string;
  slides: CarouselSlide[];
}

export const wineryCarouselConfig: WineryCarouselConfig = {
  scriptText: "Ближайшие встречи",
  subtitle: "ПРИСОЕДИНЯЙСЯ К НАМ",
  mainTitle: "События клуба",
  locationTag: "Актобе, Казахстан",
  slides: [
    {
      image: "/images/event-cafe.jpg",
      title: "Обсуждение «Мастера и Маргариты»",
      subtitle: "Ежемесячная встреча",
      area: "25",
      unit: "участников",
      description: "Встречаемся в уютной кофейне «Библиотека» для глубокого обсуждения книги месяца. Приходите с вашими мыслями и вопросами!",
    },
    {
      image: "/images/event-library.jpg",
      title: "Литературный вечер",
      subtitle: "Специальное событие",
      area: "40",
      unit: "мест",
      description: "Встреча с литературным критиком и обсуждение трендов современной литературы. Регистрация обязательна.",
    },
    {
      image: "/images/event-online.jpg",
      title: "Онлайн-обсуждение",
      subtitle: "Для участников из других городов",
      area: "∞",
      unit: "участников",
      description: "Не можете прийти лично? Присоединяйтесь к онлайн-трансляции и участвуйте в дискуссии из любой точки мира.",
    },
  ],
};

// -----------------------------------------------------------------------------
// Museum Config ( repurposed as About/How It Works )
// -----------------------------------------------------------------------------
export interface TimelineEvent {
  year: string;
  event: string;
}

export interface MuseumTabContent {
  title: string;
  description: string;
  highlight: string;
}

export interface MuseumTab {
  id: string;
  name: string;
  icon: string;
  image: string;
  content: MuseumTabContent;
}

export interface MuseumQuote {
  prefix: string;
  text: string;
  attribution: string;
}

export interface MuseumConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  timeline: TimelineEvent[];
  tabs: MuseumTab[];
  openingHours: string;
  openingHoursLabel: string;
  ctaButtonText: string;
  yearBadge: string;
  yearBadgeLabel: string;
  quote: MuseumQuote;
  founderPhotoAlt: string;
  founderPhoto: string;
}

export const museumConfig: MuseumConfig = {
  scriptText: "О нашем клубе",
  subtitle: "КАК ЭТО РАБОТАЕТ",
  mainTitle: "Что такое наш клуб?",
  introText: "Книжный клуб «Шаңырақ» — это интеллектуальное и культурное сообщество, объединяющее людей через любовь к художественной литературе и живому, осмысленному диалогу. Клуб был основан в феврале в городе Актобе. Изначально он возник как небольшое хобби-сообщество, однако со временем интерес к нему значительно вырос — вокруг клуба сформировалась аудитория людей, стремящихся к глубине, смыслу и настоящему общению. Сегодня «Шаңырақ» — это пространство, где участники читают и обсуждают художественные произведения, делятся мыслями и личными историями, а также знакомятся с культурами разных народов через литературу. Особенностью клуба является проведение встреч с представителями разных национальностей при чтении произведений их стран, что позволяет глубже понять культурный контекст и расширить кругозор. Клуб объединяет людей, уставших от поверхностной информации и ищущих в книгах не только сюжет, но и смысл, эмоции и отражение человеческого опыта.",
  timeline: [
    { year: "1", event: "Оставь заявку на сайте" },
    { year: "2", event: "Получи книгу месяца" },
    { year: "3", event: "Читай в удобном темпе" },
    { year: "4", event: "Приходи на встречу и общайся!" },
  ],
  tabs: [
    {
      id: "reading",
      name: "Читаем вместе",
      icon: "BookOpen",
      image: "/images/about-books.jpg",
      content: {
        title: "Каждый месяц — одна книга",
        description: "Мы выбираем интересные произведения разных жанров: от классики до современной прозы. Читаем, думаем, делимся мыслями.",
        highlight: "Классика и современность",
      },
    },
    {
      id: "discussion",
      name: "Обсуждаем вживую",
      icon: "Users",
      image: "/images/about-discuss.jpg",
      content: {
        title: "Встречи раз в месяц",
        description: "Живые дискуссии в уютных местах города. Новые идеи, неожиданные интерпретации, глубокие разговоры.",
        highlight: "Уютные кофейни и библиотеки",
      },
    },
    {
      id: "community",
      name: "Находим друзей",
      icon: "Award",
      image: "/images/about-friends.jpg",
      content: {
        title: "Единомышленники рядом",
        description: "Люди, которые любят книги так же, как ты. Дружба, которая начинается с обсуждения любимых произведений.",
        highlight: "500+ участников",
      },
    },
  ],
  openingHours: "Последняя суббота месяца",
  openingHoursLabel: "Встречи клуба",
  ctaButtonText: "Узнать больше",
  yearBadge: "2025",
  yearBadgeLabel: "Основан",
  quote: {
    prefix: "«",
    text: "Книги — это корабли мысли, странствующие по волнам времени и бережно несущие свой драгоценный груз от поколения к поколению.",
    attribution: "Фрэнсис Бэкон",
  },
  founderPhotoAlt: "Основатель книжного клуба",
  founderPhoto: "/images/avatar-1.jpg",
};

// -----------------------------------------------------------------------------
// News Config ( repurposed as Testimonials & Story )
// -----------------------------------------------------------------------------
export interface NewsArticle {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface StoryQuote {
  prefix: string;
  text: string;
  attribution: string;
}

export interface StoryTimelineItem {
  value: string;
  label: string;
}

export interface NewsConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  viewAllText: string;
  readMoreText: string;
  articles: NewsArticle[];
  testimonialsScriptText: string;
  testimonialsSubtitle: string;
  testimonialsMainTitle: string;
  testimonials: Testimonial[];
  storyScriptText: string;
  storySubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyTimeline: StoryTimelineItem[];
  storyQuote: StoryQuote;
  storyImage: string;
  storyImageCaption: string;
}

export const newsConfig: NewsConfig = {
  scriptText: "Истории участников",
  subtitle: "ОТЗЫВЫ",
  mainTitle: "Что говорят наши читатели",
  viewAllText: "Все отзывы",
  readMoreText: "Читать далее",
  articles: [
    {
      id: 1,
      image: "/images/event-cafe.jpg",
      title: "Как книжный клуб изменил мою жизнь",
      excerpt: "История Айгуль о том, как она нашла новых друзей и открыла для себя мир литературы...",
      date: "10 апреля 2026",
      category: "Истории",
    },
    {
      id: 2,
      image: "/images/event-library.jpg",
      title: "Топ-10 книг по мнению участников",
      excerpt: "Собрали лучшие произведения, которые мы прочитали за последний год...",
      date: "5 апреля 2026",
      category: "Подборки",
    },
    {
      id: 3,
      image: "/images/about-books.jpg",
      title: "Встреча с писателем",
      excerpt: "В следующем месяце нас ждёт особенное событие — встреча с известным автором...",
      date: "1 апреля 2026",
      category: "Анонсы",
    },
  ],
  testimonialsScriptText: "Отзывы",
  testimonialsSubtitle: "ЧТО ГОВОРЯТ УЧАСТНИКИ",
  testimonialsMainTitle: "Истории вдохновения",
  testimonials: [
    {
      name: "Айгуль",
      role: "Участник клуба с 2022",
      text: "Книжный клуб стал для меня настоящим открытием. Я нашла друзей, с которыми можно часами обсуждать прочитанное. Теперь читаю в 3 раза больше!",
      rating: 5,
    },
    {
      name: "Дмитрий",
      role: "Участник клуба с 2023",
      text: "Никогда не думал, что обсуждение книг может быть таким увлекательным. Каждая встреча — это путешествие в мир новых идей и смыслов.",
      rating: 5,
    },
    {
      name: "Елена",
      role: "Участник клуба с 2021",
      text: "Благодаря клубу я открыла для себя жанры, о которых никогда не задумывалась. Классика, фантастика, современная проза — теперь читаю всё!",
      rating: 5,
    },
  ],
  storyScriptText: "Цель клуба Шаңырақ",
  storyTitle: "От идеи к сообществу",
  storyParagraphs: [
    "Формирование интеллектуального и культурного сообщества через глубокое осмысление художественной литературы, развитие эмпатии, критического мышления и живого межкультурного диалога.",
    "Задачи клуба: Создание пространства для людей, стремящихся к содержательному общению и внутреннему развитию, вне поверхностных трендов и «информационного шума». Популяризация художественной литературы как ключевого инструмента понимания человека, его чувств, мотивов и жизненных историй.Развитие культуры чтения и осмысленного обсуждения, формирование навыков анализа и выражения собственных мыслей.Поддержка доверительной атмосферы, в которой участники могут раскрыться, делиться личными историями и находить отклик через прочитанное.Организация межкультурного диалога через литературу: при чтении произведений разных стран приглашение представителей соответствующих диаспор для живого общения, погружения в контекст и культурные особенности.Расширение культурного кругозора участников через знакомство с художественным миром разных народов и традиций.Формирование многонационального сообщества клуба, объединённого интересом к глубокой и содержательной литературе.Поддержка и продвижение качественной художественной литературы и переводов, знакомство с малоизвестными, но значимыми произведениями разных культур.Создание альтернативы массовой поверхностной литературе (псевдопсихологии и «быстрому» саморазвитию) через акцент на глубину, смысл и душевность.",
  ],
  storyTimeline: [
    { value: "2025", label: "Основание" },
    { value: "48", label: "Книг" },
    { value: "500+", label: "Участников" },
  ],
  storyQuote: {
    prefix: "«",
    text: "Чтение — это не просто хобби. Это способ видеть мир шире.",
    attribution: "Основатель клуба",
  },
  storyImage: "/images/about-friends.jpg",
  storyImageCaption: "Участники книжного клуба на встрече",
};

// -----------------------------------------------------------------------------
// Contact Form Config ( repurposed as Join Form )
// -----------------------------------------------------------------------------
export interface ContactInfoItem {
  icon: string;
  label: string;
  value: string;
  subtext: string;
}

export interface ContactFormFields {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  visitDateLabel: string;
  visitorsLabel: string;
  visitorsOptions: string[];
  messageLabel: string;
  messagePlaceholder: string;
  submitText: string;
  submittingText: string;
  successMessage: string;
  errorMessage: string;
}

export interface ContactFormConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  contactInfoTitle: string;
  contactInfo: ContactInfoItem[];
  form: ContactFormFields;
  privacyNotice: string;
  formEndpoint: string;
}

export const contactFormConfig: ContactFormConfig = {
  scriptText: "Присоединяйся к нам",
  subtitle: "ВСТУПИТЬ В КЛУБ",
  mainTitle: "Готов читать по-новому?",
  introText: "Вступи в клуб и открой мир интересных книг и единомышленников. Первая встреча — бесплатно!",
  contactInfoTitle: "Контакты",
  contactInfo: [
    { icon: "MapPin", label: "Адрес", value: "г. Алматы, ул. Абая 150", subtext: "Кофейня «Библиотека»" },
    { icon: "Phone", label: "Телефон", value: "+7 (777) 123-45-67", subtext: "WhatsApp / Telegram" },
    { icon: "Mail", label: "Email", value: "hello@knizhnyyclub.kz", subtext: "Пишите нам" },
    { icon: "Clock", label: "Встречи", value: "Последняя суббота", subtext: "19:00 - 21:00" },
  ],
  form: {
    nameLabel: "Имя",
    namePlaceholder: "Ваше имя",
    emailLabel: "Email или телефон",
    emailPlaceholder: "email@example.com",
    phoneLabel: "Телефон",
    phonePlaceholder: "+7 (___) ___-__-__",
    visitDateLabel: "Когда планируете прийти?",
    visitorsLabel: "Откуда узнали о нас?",
    visitorsOptions: ["Instagram", "Telegram", "Друзья", "Поиск в интернете", "Другое"],
    messageLabel: "Сообщение",
    messagePlaceholder: "Расскажите немного о себе и своих литературных предпочтениях...",
    submitText: "Вступить в клуб",
    submittingText: "Отправка...",
    successMessage: "Спасибо! Мы свяжемся с вами в ближайшее время.",
    errorMessage: "Произошла ошибка. Пожалуйста, попробуйте ещё раз.",
  },
  privacyNotice: "Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности",
  formEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
};

// -----------------------------------------------------------------------------
// Footer Config
// -----------------------------------------------------------------------------
export interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterContactItem {
  icon: string;
  text: string;
}

export interface FooterConfig {
  brandName: string;
  tagline: string;
  description: string;
  socialLinks: SocialLink[];
  linkGroups: FooterLinkGroup[];
  contactItems: FooterContactItem[];
  newsletterLabel: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  newsletterSuccessText: string;
  newsletterErrorText: string;
  newsletterEndpoint: string;
  copyrightText: string;
  legalLinks: string[];
  icpText: string;
  backToTopText: string;
  ageVerificationText: string;
}

export const footerConfig: FooterConfig = {
  brandName: "КнижныйКлуб",
  tagline: "Актобе",
  description: "Сообщество любителей книг. Читаем вместе, обсуждаем, находим друзей. Присоединяйтесь к нам!",
  socialLinks: [
    { icon: "Instagram", label: "Instagram", href: "https://www.instagram.com/shaniraq_book_club?igsh=cHZuaWQ1bm1la3Fs" },
  ],
  linkGroups: [
    {
      title: "О клубе",
      links: [
        { name: "Главная", href: "#hero" },
        { name: "О нас", href: "#about" },
        { name: "Книги", href: "#books" },
        { name: "События", href: "#events" },
      ],
    },
    {
      title: "Информация",
      links: [
        { name: "FAQ", href: "#faq" },
        { name: "Правила клуба", href: "#rules" },
        { name: "Архив книг", href: "#archive" },
        { name: "Контакты", href: "#contact" },
      ],
    },
  ],
  contactItems: [
    { icon: "MapPin", text: "г Актобе. Ул Маметова 4, ТРЦ Керуен Сити, офис С27" },
    { icon: "Phone", text: "+7 (778) 682-72-87" },
    { icon: "Mail", text: "Gulnuryessenkulova@gmail.com" },
  ],
  newsletterLabel: "",
  newsletterPlaceholder: "Ваш email",
  newsletterButtonText: "Подписаться",
  newsletterSuccessText: "Спасибо за подписку!",
  newsletterErrorText: "Ошибка подписки. Попробуйте ещё раз.",
  newsletterEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
  copyrightText: "© 2025 Книжный Клуб Шаңырақ. Все права защищены.",
  legalLinks: ["Политика конфиденциальности", "Условия использования"],
  icpText: "",
  backToTopText: "Наверх",
  ageVerificationText: "Читай больше. Живи глубже.",
};

// -----------------------------------------------------------------------------
// Scroll To Top Config
// -----------------------------------------------------------------------------
export interface ScrollToTopConfig {
  ariaLabel: string;
}

export const scrollToTopConfig: ScrollToTopConfig = {
  ariaLabel: "Наверх",
};
