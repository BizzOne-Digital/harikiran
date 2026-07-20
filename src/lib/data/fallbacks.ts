import { SITE_DEFAULTS } from "@/config/site";
import type {
  MegaMenuGroup,
  NavLink,
  ServiceAudienceFilter,
  ServiceGroup,
} from "@/types";

export interface PublicService {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  summary: string;
  content: string;
  icon?: string;
  image?: { url: string; alt?: string };
  group: ServiceGroup;
  audienceFilters: ServiceAudienceFilter[];
  targetAudience: string[];
  challenges: string[];
  benefits: string[];
  processSteps: { title: string; description: string }[];
  featured: boolean;
  sortOrder: number;
  ctaLabel: string;
  ctaHref: string;
  seo: { title?: string; description?: string };
}

export interface PublicFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  featured: boolean;
  sortOrder: number;
}

export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: { url: string; alt?: string };
  authorName: string;
  featured: boolean;
  readingTimeMinutes: number;
  publishedAt: string;
  tags: string[];
}

export interface PublicTeamMember {
  id: string;
  name: string;
  role: string;
  shortBio?: string;
  fullBio?: string;
  featured: boolean;
  sortOrder: number;
}

export interface PublicSiteSettings {
  businessName: string;
  shortName: string;
  description: string;
  tagline: string;
  email: string;
  phone: string;
  footer: {
    summary: string;
    disclaimer: string;
    showNewsletter: boolean;
  };
  social: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    x?: string;
  };
  seo: {
    title?: string;
    description?: string;
    titleTemplate?: string;
    robotsIndex: boolean;
  };
}

export const FALLBACK_SERVICES: PublicService[] = [
  {
    id: "family-life-insurance",
    name: "Family Life Insurance",
    slug: "family-life-insurance",
    shortDescription:
      "Coverage designed to help protect the people who depend on you.",
    summary:
      "Explore personal and family life insurance options that can help provide financial support if the unexpected happens.",
    content:
      "<p>Family life insurance planning focuses on protecting household income, covering outstanding obligations and supporting long-term goals for the people who matter most.</p><p>We help you understand coverage types, estimate needs and compare suitable options based on your circumstances. Final terms depend on underwriting and the insurer.</p>",
    icon: "Shield",
    group: "protection",
    audienceFilters: ["family"],
    targetAudience: [
      "Families",
      "Parents",
      "Homeowners",
      "Individuals building long-term protection",
    ],
    challenges: [
      "Uncertainty about how much coverage is appropriate",
      "Balancing premiums with household budgets",
      "Coordinating coverage with mortgages and savings",
    ],
    benefits: [
      "Income replacement considerations",
      "Debt and mortgage protection planning",
      "Support for education and family goals",
      "Guidance through application and underwriting",
    ],
    processSteps: [
      {
        title: "Clarify priorities",
        description: "We discuss dependents, debts and long-term goals.",
      },
      {
        title: "Estimate needs",
        description:
          "We review coverage scenarios using educational estimators.",
      },
      {
        title: "Compare options",
        description: "We explore suitable products with transparent next steps.",
      },
    ],
    featured: true,
    sortOrder: 1,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Family Life Insurance | TopAdvice4U",
      description:
        "Personal and family life insurance planning to help protect the people who depend on you.",
    },
  },
  {
    id: "corporate-life-insurance",
    name: "Corporate Life Insurance",
    slug: "corporate-life-insurance",
    shortDescription:
      "Business-oriented life insurance strategies for owners and key people.",
    summary:
      "Corporate life insurance can help support succession planning, key-person protection and business continuity goals.",
    content:
      "<p>Corporate life insurance planning looks at how coverage may support a business if a key person is lost, or how ownership transitions can be funded more thoughtfully.</p><p>We coordinate discussions with your broader advisory team where appropriate. We do not provide legal or tax advice.</p>",
    icon: "Building2",
    group: "protection",
    audienceFilters: ["business"],
    targetAudience: [
      "Business owners",
      "Corporations",
      "Partnerships",
      "Key decision-makers",
    ],
    challenges: [
      "Protecting against key-person risk",
      "Funding buy-sell arrangements",
      "Aligning coverage with corporate structure",
    ],
    benefits: [
      "Key-person protection discussions",
      "Business continuity considerations",
      "Coordination with accountants and lawyers",
      "Clear educational guidance",
    ],
    processSteps: [
      {
        title: "Understand the business",
        description: "We review ownership, roles and continuity priorities.",
      },
      {
        title: "Identify coverage goals",
        description: "We clarify what the business needs protected.",
      },
      {
        title: "Explore suitable structures",
        description:
          "We discuss options and coordinate with your professionals.",
      },
    ],
    featured: true,
    sortOrder: 2,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Corporate Life Insurance | TopAdvice4U",
      description:
        "Corporate life insurance planning for business continuity, key-person protection and succession support.",
    },
  },
  {
    id: "residential-mortgages",
    name: "Residential Mortgages",
    slug: "residential-mortgages",
    shortDescription:
      "Guidance for home purchase, refinance and renewal decisions.",
    summary:
      "Residential mortgage advice to help you understand options for buying, refinancing or renewing a home.",
    content:
      "<p>Whether you are purchasing a home, refinancing or approaching renewal, we help you understand structures, timelines and documentation so you can move forward with clarity.</p><p>Rates, terms and approvals depend on lenders and your individual circumstances. Estimators on this site are educational only.</p>",
    icon: "Home",
    group: "financing",
    audienceFilters: ["family", "property"],
    targetAudience: [
      "Homebuyers",
      "Homeowners",
      "Investors considering residential property",
    ],
    challenges: [
      "Comparing mortgage structures",
      "Understanding qualification factors",
      "Planning for renewals and refinancing",
    ],
    benefits: [
      "Purchase and refinance guidance",
      "Renewal planning conversations",
      "Educational payment estimates",
      "Clear next-step support",
    ],
    processSteps: [
      {
        title: "Define the goal",
        description: "Purchase, refinance, renewal or equity planning.",
      },
      {
        title: "Review your profile",
        description: "We discuss income, debts and property details.",
      },
      {
        title: "Explore suitable paths",
        description: "We outline options and prepare you for next steps.",
      },
    ],
    featured: true,
    sortOrder: 3,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Residential Mortgages | TopAdvice4U",
      description:
        "Residential mortgage guidance for purchases, refinancing and renewals.",
    },
  },
  {
    id: "commercial-mortgages",
    name: "Commercial Mortgages",
    slug: "commercial-mortgages",
    shortDescription:
      "Financing conversations for income properties and commercial assets.",
    summary:
      "Commercial mortgage guidance for investors and business owners exploring property financing.",
    content:
      "<p>Commercial mortgage planning involves different lender criteria, documentation and timelines than residential borrowing. We help you prepare and understand the landscape.</p>",
    icon: "Landmark",
    group: "financing",
    audienceFilters: ["property", "business"],
    targetAudience: [
      "Property investors",
      "Business owners",
      "Commercial real-estate buyers",
    ],
    challenges: [
      "Complex documentation requirements",
      "Understanding commercial lending criteria",
      "Aligning financing with cash flow",
    ],
    benefits: [
      "Commercial financing discussions",
      "Preparation support",
      "Investor and business-focused guidance",
      "Coordinated next steps",
    ],
    processSteps: [
      {
        title: "Review the asset",
        description: "We discuss property type, use and financing objective.",
      },
      {
        title: "Assess readiness",
        description: "We identify documents and profile considerations.",
      },
      {
        title: "Plan the approach",
        description: "We outline a practical path forward.",
      },
    ],
    featured: false,
    sortOrder: 4,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Commercial Mortgages | TopAdvice4U",
      description:
        "Commercial mortgage guidance for investors and business property financing.",
    },
  },
  {
    id: "business-loans",
    name: "Business Loans",
    slug: "business-loans",
    shortDescription:
      "Advisory support for business growth and working-capital needs.",
    summary:
      "Explore business financing conversations focused on growth, operations and opportunity.",
    content:
      "<p>Business financing needs vary widely. We help you clarify the purpose of capital, prepare for lender conversations and understand potential structures.</p><p>Approvals are never guaranteed and depend on lenders and eligibility.</p>",
    icon: "Briefcase",
    group: "financing",
    audienceFilters: ["business"],
    targetAudience: ["Entrepreneurs", "Business owners", "Growing companies"],
    challenges: [
      "Identifying appropriate financing types",
      "Preparing financial documentation",
      "Balancing growth with repayment capacity",
    ],
    benefits: [
      "Growth and working-capital discussions",
      "Clearer financing narratives",
      "Practical preparation support",
      "Honest eligibility conversations",
    ],
    processSteps: [
      {
        title: "Clarify the need",
        description: "Growth, equipment, working capital or opportunity.",
      },
      {
        title: "Review business readiness",
        description: "We discuss financials and timeline.",
      },
      {
        title: "Map next steps",
        description: "We outline a realistic financing pathway.",
      },
    ],
    featured: true,
    sortOrder: 5,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Business Loans | TopAdvice4U",
      description:
        "Business loan advisory for growth, operations and working-capital planning.",
    },
  },
  {
    id: "group-health-plans",
    name: "Group Health Plans",
    slug: "group-health-plans",
    shortDescription:
      "Employee benefit planning for teams that want practical coverage.",
    summary:
      "Group health and employee benefit plan discussions for employers building competitive workplaces.",
    content:
      "<p>Group benefits can help attract and retain talent while supporting employee wellbeing. We help employers understand plan components and decision points.</p>",
    icon: "HeartPulse",
    group: "protection",
    audienceFilters: ["business", "family"],
    targetAudience: ["Employers", "Business owners", "HR decision-makers"],
    challenges: [
      "Choosing benefit components",
      "Balancing cost and coverage",
      "Communicating value to employees",
    ],
    benefits: [
      "Plan design conversations",
      "Employer-focused guidance",
      "Employee wellbeing considerations",
      "Practical implementation support",
    ],
    processSteps: [
      {
        title: "Understand the team",
        description: "Size, priorities and budget considerations.",
      },
      {
        title: "Review plan elements",
        description: "Health, dental, life and related benefits.",
      },
      {
        title: "Recommend a path",
        description: "We outline suitable next steps for your workplace.",
      },
    ],
    featured: false,
    sortOrder: 6,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Group Health Plans | TopAdvice4U",
      description:
        "Group health and employee benefit plan guidance for Canadian employers.",
    },
  },
  {
    id: "resp-education-planning",
    name: "RESP and Education Planning",
    slug: "resp-education-planning",
    shortDescription:
      "Education savings conversations for children's future learning goals.",
    summary:
      "RESP and education planning support to help families prepare for future learning costs.",
    content:
      "<p>Education planning is about starting early, understanding contribution approaches and aligning savings with family priorities. We provide educational guidance — not guaranteed return projections.</p>",
    icon: "GraduationCap",
    group: "future-legacy",
    audienceFilters: ["family", "legacy"],
    targetAudience: ["Parents", "Families", "Guardians"],
    challenges: [
      "Knowing when to start",
      "Understanding RESP basics",
      "Balancing education savings with other goals",
    ],
    benefits: [
      "Education savings conversations",
      "Family goal alignment",
      "Practical planning frameworks",
      "Long-term perspective",
    ],
    processSteps: [
      {
        title: "Define education goals",
        description: "Timeline, children and savings capacity.",
      },
      {
        title: "Review approaches",
        description: "We discuss RESP concepts and planning considerations.",
      },
      {
        title: "Build a plan",
        description: "We outline next steps that fit your family.",
      },
    ],
    featured: false,
    sortOrder: 7,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "RESP and Education Planning | TopAdvice4U",
      description:
        "RESP and children's education savings planning for Canadian families.",
    },
  },
  {
    id: "estate-planning-coordination",
    name: "Estate-Planning Coordination",
    slug: "estate-planning-coordination",
    shortDescription:
      "Coordination with partnered lawyers and accountants for legacy planning.",
    summary:
      "We help coordinate estate-planning conversations with partnered corporate lawyers and accountants so your financial strategy works as one.",
    content:
      "<p>TopAdvice4U does not provide legal or accounting advice. We coordinate with partnered corporate lawyers and accountants so insurance, financing and legacy considerations can be discussed together.</p><p>Partner professionals are engaged based on your needs. We do not invent credentials or substitute for qualified legal or tax counsel.</p>",
    icon: "ScrollText",
    group: "future-legacy",
    audienceFilters: ["legacy", "business", "family"],
    targetAudience: [
      "Families planning their legacy",
      "Business owners",
      "Individuals coordinating wills and estates discussions",
    ],
    challenges: [
      "Fragmented advice across professionals",
      "Aligning insurance with estate goals",
      "Business succession complexity",
    ],
    benefits: [
      "Coordinated advisory conversations",
      "Insurance and financing alignment",
      "Introduction to partnered professionals when appropriate",
      "Clearer legacy planning pathway",
    ],
    processSteps: [
      {
        title: "Identify priorities",
        description: "Family, business and legacy objectives.",
      },
      {
        title: "Map the advisors",
        description:
          "We determine where legal or accounting input is needed.",
      },
      {
        title: "Coordinate next steps",
        description:
          "We help keep the financial and professional pieces aligned.",
      },
    ],
    featured: true,
    sortOrder: 8,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Estate-Planning Coordination | TopAdvice4U",
      description:
        "Estate-planning coordination with partnered lawyers and accountants for a unified financial strategy.",
    },
  },
];

export const FALLBACK_FAQS: PublicFAQ[] = [
  {
    id: "faq-1",
    question: "What does a free consultation include?",
    answer:
      "A consultation is a conversation about your goals, priorities and questions. We discuss suitable next steps. It is not an approval, quotation or guarantee of any product or rate.",
    category: "General",
    featured: true,
    sortOrder: 1,
  },
  {
    id: "faq-2",
    question: "Do you provide legal or accounting advice?",
    answer:
      "No. TopAdvice4U coordinates estate-planning needs with partnered corporate lawyers and accountants where appropriate. Legal and accounting matters should be addressed by qualified professionals.",
    category: "Estate Planning",
    featured: true,
    sortOrder: 2,
  },
  {
    id: "faq-3",
    question: "Are the calculator results a formal quote?",
    answer:
      "No. Calculator results are educational estimates only. They are not quotations, approvals, guarantees or personalized financial advice.",
    category: "Calculators",
    featured: true,
    sortOrder: 3,
  },
  {
    id: "faq-4",
    question: "Who do you work with?",
    answer:
      "We work with families, homebuyers, property owners, entrepreneurs, business owners, employers and clients planning family or business legacy goals.",
    category: "General",
    featured: true,
    sortOrder: 4,
  },
  {
    id: "faq-5",
    question: "Can you guarantee mortgage or insurance approval?",
    answer:
      "No. Approvals and terms depend on providers, underwriting and your individual circumstances. We help you understand options and prepare for next steps.",
    category: "Financing",
    featured: true,
    sortOrder: 5,
  },
  {
    id: "faq-6",
    question: "How should I prepare for our first conversation?",
    answer:
      "A brief outline of what you are trying to protect, finance or plan is enough to start. If you have timelines, property details or coverage questions, share those as well.",
    category: "General",
    featured: false,
    sortOrder: 6,
  },
];

export const FALLBACK_BLOG_POSTS: PublicBlogPost[] = [
  {
    id: "blog-1",
    title: "Understanding Life Insurance Needs Without the Guesswork",
    slug: "understanding-life-insurance-needs",
    excerpt:
      "A practical framework for thinking about coverage — without treating an online estimator as a final quote.",
    content: `<p>Life insurance planning starts with clarity about who depends on your income, what obligations you carry and how long support may be needed.</p><p>Begin by listing dependents, debts, and major goals such as education or mortgage payoff. Then explore how long those needs may last — a few years, decades, or a lifetime foundation.</p><p>Educational estimators on this site can help you explore scenarios, but they are not quotations. Final coverage amounts, premiums and eligibility depend on underwriting and the insurer.</p><p>A consultation is simply a conversation: we listen to your priorities, explain suitable pathways in plain language, and outline clear next steps. Nothing is guaranteed until a provider reviews and approves an application.</p>`,
    coverImage: {
      url: "/images/Blog-covers-1.png",
      alt: "Family at home",
    },
    authorName: SITE_DEFAULTS.shortName,
    featured: true,
    readingTimeMinutes: 5,
    publishedAt: "2025-01-15T00:00:00.000Z",
    tags: ["life insurance", "planning"],
  },
  {
    id: "blog-2",
    title: "Mortgage Renewal Conversations Worth Having Early",
    slug: "mortgage-renewal-conversations",
    excerpt:
      "Why reviewing renewal options before your date arrives can help you prepare with less pressure.",
    content: `<p>Renewal timing matters. Starting the conversation early gives you room to understand structures, compare paths and gather documents without rushing.</p><p>Many homeowners wait until the renewal letter arrives — then feel pressured to decide quickly. An earlier review helps you understand fixed versus variable considerations, amortization impacts and what documentation lenders typically request.</p><p>Payment estimates on this site are educational only — not lender quotations or approvals. Final rates and terms depend on the lender, your credit profile and underwriting.</p><p>If you are also reviewing life insurance alongside a mortgage, we can help coordinate those conversations so protection and financing stay aligned.</p>`,
    coverImage: {
      url: "/images/Blog-covers-2.png",
      alt: "Home keys",
    },
    authorName: SITE_DEFAULTS.shortName,
    featured: true,
    readingTimeMinutes: 4,
    publishedAt: "2025-02-01T00:00:00.000Z",
    tags: ["mortgages", "renewal"],
  },
  {
    id: "blog-3",
    title: "Coordinating Estate Planning With Your Financial Picture",
    slug: "coordinating-estate-planning",
    excerpt:
      "How insurance and financing decisions can align with legal and accounting conversations.",
    content: `<p>Estate planning rarely lives in one silo. Insurance, mortgages and business financing can all touch legacy goals — from how a property is titled to how a key-person plan supports a business transition.</p><p>TopAdvice4U helps clients prepare for conversations with lawyers and accountants by clarifying the financial pieces first: coverage in place, debts outstanding, and priorities for the people who matter most.</p><p>We coordinate introductions where appropriate. We do not provide legal or tax advice ourselves — those matters belong with qualified professionals.</p><p>If you are starting to think about wills, beneficiaries or business succession, a consultation can help organize the financial side before you meet your legal team.</p>`,
    coverImage: {
      url: "/images/Blog-covers-3.png",
      alt: "Planning documents",
    },
    authorName: SITE_DEFAULTS.shortName,
    featured: false,
    readingTimeMinutes: 6,
    publishedAt: "2025-03-10T00:00:00.000Z",
    tags: ["estate planning", "coordination"],
  },
];

export const FALLBACK_HEADER_NAV = {
  items: [
    { label: "Home", href: "/", visible: true },
    { label: "About", href: "/about", visible: true },
    { label: "Solutions", href: "/services", visible: true },
    { label: "Blog", href: "/blog", visible: true },
    { label: "Our Team", href: "/team", visible: true },
    { label: "FAQ", href: "/faq", visible: true },
    { label: "Contact", href: "/contact", visible: true },
  ] satisfies NavLink[],
  megaMenuGroups: [
    {
      title: "Protection",
      links: [
        {
          label: "Family Life Insurance",
          href: "/services/family-life-insurance",
        },
        {
          label: "Corporate Life Insurance",
          href: "/services/corporate-life-insurance",
        },
        { label: "Group Health Plans", href: "/services/group-health-plans" },
      ],
    },
    {
      title: "Financing",
      links: [
        {
          label: "Residential Mortgages",
          href: "/services/residential-mortgages",
        },
        {
          label: "Commercial Mortgages",
          href: "/services/commercial-mortgages",
        },
        { label: "Business Loans", href: "/services/business-loans" },
      ],
    },
    {
      title: "Future & Legacy",
      links: [
        {
          label: "RESP and Education Planning",
          href: "/services/resp-education-planning",
        },
        {
          label: "Estate-Planning Coordination",
          href: "/services/estate-planning-coordination",
        },
      ],
    },
  ] satisfies MegaMenuGroup[],
  ctaLabel: SITE_DEFAULTS.primaryCta,
  ctaHref: "/contact",
};

export const FALLBACK_FOOTER_NAV = {
  items: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Team", href: "/team" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ] satisfies NavLink[],
};

export const FALLBACK_SITE_SETTINGS: PublicSiteSettings = {
  businessName: SITE_DEFAULTS.businessName,
  shortName: SITE_DEFAULTS.shortName,
  description: SITE_DEFAULTS.description,
  tagline: SITE_DEFAULTS.tagline,
  email: SITE_DEFAULTS.email,
  phone: SITE_DEFAULTS.phone,
  footer: {
    summary:
      "Trusted advisory for life insurance, mortgages, business financing, employee benefits, education planning and legacy coordination.",
    disclaimer:
      "Information on this website is general and educational. Availability and eligibility depend on individual circumstances. Mortgage and insurance examples are estimates only. Final terms are subject to relevant providers, underwriting and approvals. Legal and accounting matters should be addressed by qualified professionals.",
    showNewsletter: true,
  },
  social: {},
  seo: {
    title: SITE_DEFAULTS.businessName,
    description: SITE_DEFAULTS.description,
    titleTemplate: "%s | TopAdvice4U",
    robotsIndex: true,
  },
};

export const SERVICE_GROUP_LABELS: Record<ServiceGroup, string> = {
  protection: "Protection",
  financing: "Financing",
  "future-legacy": "Future & Legacy",
};

export const AUDIENCE_FILTER_LABELS: Record<ServiceAudienceFilter, string> = {
  family: "Family",
  property: "Property",
  business: "Business",
  legacy: "Legacy",
};
