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
  photoUrl?: string;
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
      "<p>Corporate life insurance planning looks at how coverage may support a business if a key person is lost, or how ownership transitions can be funded more thoughtfully.</p><p>We also support <strong>advanced case conversations for professionals and business owners</strong> — more complex needs that may involve coordination with accountants, lawyers and underwriting specialists.</p><p>We coordinate discussions with your broader advisory team where appropriate. We do not provide legal or tax advice.</p>",
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
    id: "home-business-insurance",
    name: "Home and Business Insurance",
    slug: "home-business-insurance",
    shortDescription:
      "Property insurance for homes, rental properties and business premises.",
    summary:
      "Insurance pathways covering residential properties, rental buildings, commercial premises and business assets — protecting what you own from unexpected losses.",
    content: `<p>Property insurance helps protect homes, rental properties and business premises from risks like fire, theft, water damage and other covered perils.</p><p>TopAdvice4U provides advisory conversations covering home insurance, tenant and landlord coverage, and commercial property insurance for business owners.</p><h2>Home Insurance</h2><p>Coverage for your primary residence — including the structure, contents and additional living expenses if your home becomes uninhabitable due to a covered loss.</p><h2>Rental Property Insurance</h2><p>Protection for landlords and property investors — covering buildings, loss of rental income and liability exposures related to tenants.</p><h2>Commercial Property Insurance</h2><p>Business premises coverage — protecting buildings, equipment, inventory and business interruption risks for retail, office and industrial properties.</p><p>This page is educational. Coverage, terms, exclusions and premiums depend on the property, insurer underwriting and individual circumstances. A consultation is a conversation about coverage needs — not a quotation or guarantee of policy terms.</p>`,
    icon: "Home",
    image: { url: "/images/home-business-insurance.png", alt: "Home and Business Insurance" },
    group: "protection",
    audienceFilters: ["family", "property", "business"],
    targetAudience: [
      "Homeowners",
      "Landlords and property investors",
      "Business owners with commercial premises",
      "Individuals protecting real estate assets",
    ],
    challenges: [
      "Understanding coverage types and exclusions",
      "Determining appropriate coverage limits",
      "Balancing premiums with adequate protection",
      "Coordinating property insurance with mortgages",
    ],
    benefits: [
      "Home, rental and commercial property coverage options",
      "Educational guidance on policy structures",
      "Clear explanations of coverage gaps and exclusions",
      "Coordination with mortgage and financing requirements",
    ],
    processSteps: [
      {
        title: "Identify what needs protecting",
        description:
          "Primary residence, rental properties, commercial premises or all of the above.",
      },
      {
        title: "Review coverage needs",
        description:
          "Structure, contents, liability and income-loss considerations explained clearly.",
      },
      {
        title: "Compare options",
        description:
          "We outline suitable coverage pathways and connect you with next steps.",
      },
    ],
    featured: true,
    sortOrder: 3,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Home and Business Insurance | TopAdvice4U",
      description:
        "Property insurance for homes, rental properties and commercial premises — protecting your real estate assets.",
    },
  },
  {
    id: "liability-insurance",
    name: "Liability Insurance",
    slug: "liability-insurance",
    shortDescription:
      "Protection against legal claims for individuals, landlords and business owners.",
    summary:
      "Liability insurance pathways covering personal liability, landlord exposures, professional liability and commercial general liability — defending against claims and lawsuits.",
    content: `<p>Liability insurance protects you financially if you are sued or held legally responsible for injury, property damage or other covered claims against you.</p><p>TopAdvice4U provides advisory conversations on liability coverage for individuals, property owners and businesses — helping you understand exposure and protection options.</p><h2>Personal Liability</h2><p>Coverage for individuals and families — protecting against lawsuits from accidents on your property, damage you cause to others, or legal defense costs.</p><h2>Landlord Liability</h2><p>Protection for property investors — covering tenant injury claims, property damage liability and legal defense for rental-related lawsuits.</p><h2>Professional Liability (Errors & Omissions)</h2><p>Coverage for professionals and consultants — protecting against claims of negligence, mistakes or failure to deliver promised services.</p><h2>Commercial General Liability</h2><p>Business liability coverage — protecting against customer injury claims, property damage, advertising injury and legal defense costs for business operations.</p><p>This page is educational. Coverage, exclusions, limits and premiums depend on your circumstances, activities and insurer underwriting. A consultation is a conversation about liability exposure — not a quotation or guarantee of policy terms.</p>`,
    icon: "ShieldCheck",
    image: { url: "/images/liability-insurance.png", alt: "Liability Insurance" },
    group: "protection",
    audienceFilters: ["family", "property", "business"],
    targetAudience: [
      "Individuals and families",
      "Landlords and property investors",
      "Professionals and consultants",
      "Business owners and operators",
    ],
    challenges: [
      "Understanding liability exposure and coverage gaps",
      "Determining adequate liability limits",
      "Coordinating personal, landlord and business liability",
      "Managing premiums while maintaining protection",
    ],
    benefits: [
      "Personal, landlord, professional and commercial liability options",
      "Clear explanations of what is and is not covered",
      "Guidance on liability limits and umbrella coverage",
      "Coordination with property and business insurance",
    ],
    processSteps: [
      {
        title: "Identify exposure areas",
        description:
          "Personal activities, rental properties, professional work or business operations.",
      },
      {
        title: "Review liability risks",
        description:
          "We discuss what could go wrong and how liability insurance responds.",
      },
      {
        title: "Explore coverage pathways",
        description:
          "We outline suitable liability options and connect you with next steps.",
      },
    ],
    featured: true,
    sortOrder: 4,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Liability Insurance | TopAdvice4U",
      description:
        "Personal, landlord, professional and commercial liability insurance — protecting against legal claims and lawsuits.",
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
    id: "private-mortgages",
    name: "Private Mortgages",
    slug: "private-mortgages",
    shortDescription:
      "Alternative mortgage pathways when conventional lending is not the right fit.",
    summary:
      "Private mortgage conversations for borrowers exploring alternative financing options.",
    content:
      "<p>Private mortgages can be part of a conversation when conventional lending is delayed, incomplete or not the right fit for a short-term need.</p><p>We help you understand typical considerations, timelines and risks in plain language — without pressure.</p><p>Private lending involves different criteria, costs and timelines than bank mortgages. Approvals and terms are never guaranteed on this website and depend on lenders and your circumstances.</p>",
    icon: "Handshake",
    group: "financing",
    audienceFilters: ["property", "business"],
    targetAudience: [
      "Homeowners and buyers exploring alternatives",
      "Investors with short-term financing needs",
      "Borrowers seeking bridge or specialty solutions",
    ],
    challenges: [
      "Understanding private vs. conventional lending",
      "Comparing cost and timeline trade-offs",
      "Preparing a clear financing story",
    ],
    benefits: [
      "Plain-language private mortgage discussions",
      "Honest risk and cost conversations",
      "Preparation for lender next steps",
      "Educational guidance only — no guaranteed approvals",
    ],
    processSteps: [
      {
        title: "Clarify the need",
        description: "Bridge, refinance, purchase or short-term capital.",
      },
      {
        title: "Review your profile",
        description: "We discuss property, equity and timeline realities.",
      },
      {
        title: "Outline next steps",
        description: "We explain options and prepare you for follow-up.",
      },
    ],
    featured: true,
    sortOrder: 5,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Private Mortgages | TopAdvice4U",
      description:
        "Private mortgage guidance for alternative and short-term property financing conversations.",
    },
  },
  {
    id: "reverse-mortgage",
    name: "Reverse Mortgage",
    slug: "reverse-mortgage",
    shortDescription:
      "Educational guidance on accessing home equity later in life.",
    summary:
      "Reverse mortgage conversations to help homeowners understand how home equity may support retirement cash flow.",
    content:
      "<p>A reverse mortgage is one way some Canadian homeowners explore accessing home equity later in life. It is not right for everyone.</p><p>We help you understand how reverse mortgages generally work, what questions to ask, and how they may relate to broader retirement and estate conversations.</p><p>This page is educational only. Suitability, eligibility, costs and terms depend on providers and your circumstances. Nothing here is a quotation, approval or recommendation.</p>",
    icon: "RefreshCw",
    group: "financing",
    audienceFilters: ["family", "property", "legacy"],
    targetAudience: [
      "Homeowners approaching or in retirement",
      "Families exploring equity options",
      "Clients coordinating retirement cash flow",
    ],
    challenges: [
      "Understanding how reverse mortgages work",
      "Weighing equity access against long-term plans",
      "Coordinating with retirement and estate goals",
    ],
    benefits: [
      "Clear educational explanations",
      "Honest suitability conversations",
      "Coordination with retirement planning topics",
      "No pressure — consultation first",
    ],
    processSteps: [
      {
        title: "Share your goals",
        description: "Cash flow, renovations, debt or lifestyle needs.",
      },
      {
        title: "Understand the basics",
        description: "We explain common structures and considerations.",
      },
      {
        title: "Decide next steps",
        description: "We outline questions and pathways that fit your timeline.",
      },
    ],
    featured: true,
    sortOrder: 6,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Reverse Mortgage | TopAdvice4U",
      description:
        "Educational reverse mortgage guidance for Canadian homeowners exploring home equity options.",
    },
  },
  {
    id: "business-loans",
    name: "Business Loans",
    slug: "business-loans",
    shortDescription:
      "Advisory support for secured and unsecured business financing needs.",
    summary:
      "Explore secured and unsecured business loan conversations focused on growth, operations and opportunity.",
    content:
      "<p>Business financing needs vary widely — from <strong>secured</strong> facilities backed by assets to <strong>unsecured</strong> working-capital conversations.</p><p>We help you clarify the purpose of capital, prepare for lender conversations and understand potential structures.</p><p>Approvals are never guaranteed and depend on lenders and eligibility.</p>",
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
    sortOrder: 7,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Business Loans | TopAdvice4U",
      description:
        "Business loan advisory for secured and unsecured growth and working-capital planning.",
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
    sortOrder: 8,
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
    sortOrder: 9,
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
    sortOrder: 10,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Estate-Planning Coordination | TopAdvice4U",
      description:
        "Estate-planning coordination with partnered lawyers and accountants for a unified financial strategy.",
    },
  },
  {
    id: "investments",
    name: "Investments",
    slug: "investments",
    shortDescription:
      "TFSA, RRSP, FHSA, segregated funds, ETFs and leverage-loan conversations — explained clearly.",
    summary:
      "Educational guidance on registered accounts and investment pathways, including TFSA, RRSP, FHSA, segregated funds, ETFs and leverage-loan discussions — led by our advisory team.",
    content: `<p>Investment planning conversations at TopAdvice4U focus on clarity: how registered accounts work, what questions to ask, and how different pathways may fit your timeline and goals.</p><p>We discuss topics such as <strong>TFSA</strong>, <strong>RRSP</strong>, <strong>FHSA</strong>, <strong>segregated funds</strong>, <strong>ETFs</strong>, and <strong>leverage-loan</strong> considerations in plain language. Our advisory conversations are led by <strong>Harkiran Singh</strong> and <strong>Jennifer Chan</strong>.</p><p>Nothing on this page is a recommendation, quotation, guarantee or personalized investment advice. Suitability, returns and availability depend on your circumstances, product providers and applicable rules. A consultation is a conversation about goals and next steps — not an approval to invest.</p>`,
    icon: "LineChart",
    group: "future-legacy",
    audienceFilters: ["family", "business", "legacy"],
    targetAudience: [
      "Individuals building long-term savings",
      "Families using registered accounts",
      "Clients exploring investment structure options",
    ],
    challenges: [
      "Too many account types and product names",
      "Unclear trade-offs between registered accounts",
      "Pressure to decide without understanding the basics",
    ],
    benefits: [
      "Plain-language explanations of common pathways",
      "Room to ask questions before taking next steps",
      "Coordination with your broader protection and financing picture",
      "Educational clarity — no fabricated returns or guarantees",
    ],
    processSteps: [
      {
        title: "Clarify your goals",
        description:
          "Timeline, risk comfort and what you are saving or investing toward.",
      },
      {
        title: "Review account pathways",
        description:
          "TFSA, RRSP, FHSA and related structures explained in practical terms.",
      },
      {
        title: "Outline next steps",
        description:
          "Educational next steps only — final choices depend on you and the provider.",
      },
    ],
    featured: true,
    sortOrder: 11,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Investments | TopAdvice4U",
      description:
        "TFSA, RRSP, FHSA, segregated funds, ETFs and leverage-loan conversations with clear, educational guidance.",
    },
  },
  {
    id: "retirement-solutions",
    name: "Retirement Solutions",
    slug: "retirement-solutions",
    shortDescription:
      "Clear conversations about retirement income, registered accounts and the path from saving to drawing down.",
    summary:
      "Educational guidance for people planning toward retirement — from savings structure to income conversations — without pressure or fabricated guarantees.",
    content: `<p>Retirement planning is rarely one product. It is a set of conversations about timing, income needs, registered accounts and how protection and investments may fit together over time.</p><p>At TopAdvice4U we help you clarify goals, understand common pathways (including RRSP, TFSA and related structures), and prepare better questions before you decide next steps. Advisory conversations are led by <strong>Harkiran Singh</strong> and <strong>Jennifer Chan</strong>.</p><p>This page is educational only. It is not a retirement income guarantee, investment recommendation or tax advice. Suitability depends on your circumstances and applicable provider rules.</p>`,
    icon: "PiggyBank",
    group: "future-legacy",
    audienceFilters: ["family", "legacy"],
    targetAudience: [
      "Individuals approaching retirement",
      "Families building long-term savings",
      "Clients reviewing income and drawdown questions",
    ],
    challenges: [
      "Uncertainty about when and how to draw income",
      "Too many account and product names",
      "Worry about tax and cash-flow surprises",
    ],
    benefits: [
      "Plain-language retirement pathway discussions",
      "Connection to protection and investment conversations",
      "Room to ask questions before acting",
      "Educational clarity — no fabricated rates or guarantees",
    ],
    processSteps: [
      {
        title: "Map your timeline",
        description: "When you hope to slow down, and what income may need to cover.",
      },
      {
        title: "Review building blocks",
        description:
          "Registered accounts and related structures explained in practical terms.",
      },
      {
        title: "Outline next steps",
        description:
          "Educational next steps only — final choices depend on you and qualified professionals where tax advice is needed.",
      },
    ],
    featured: true,
    sortOrder: 12,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "Retirement Solutions | TopAdvice4U",
      description:
        "Educational retirement planning conversations — savings, income pathways and clear next steps.",
    },
  },
  {
    id: "pos-systems",
    name: "POS Systems",
    slug: "pos-systems",
    shortDescription:
      "Point-of-sale, payment and technology solutions for retail and hospitality businesses.",
    summary:
      "A dedicated business-technology pathway covering hospitality POS, retail POS, payment processing, drive-thru systems, video surveillance, and installation & deployment services — alongside your broader financial conversations.",
    content: `<p>Many business owners need more than insurance and financing — they also need reliable technology to take payments, manage operations and protect their premises.</p><p>TopAdvice4U now offers a dedicated <strong>POS Systems</strong> pathway with six practical service areas:</p><h2>Hospitality POS</h2><p>Streamline every aspect of your restaurant or hospitality operation with best-in-class point-of-sale solutions designed to work together out of the box — from table management to kitchen communication.</p><h2>Retail POS</h2><p>A complete retail point-of-sale solution that is flexible and scalable, built around how your business actually works — covering transactions, inventory and customer management.</p><h2>Payments</h2><p>Deliver seamless payment experiences whether your customers swipe, insert or tap. Secure, scalable payment technologies tailored to the needs of your business and the ways your customers prefer to pay.</p><h2>Drive-Thru</h2><p>Dedicated drive-thru systems engineered to deliver the best possible experience for your customers — keeping lines moving and orders accurate.</p><h2>Video Surveillance</h2><p>Eliminate false alarms and protect your premises with the latest video surveillance and recording technology built specifically for retail and hospitality environments.</p><h2>Installation &amp; Deployment Services</h2><p>End-to-end deployment solutions covering a variety of rollout needs, timelines and cost requirements — successfully supporting many of Canada's leading retail and hospitality operators.</p><p>This page is educational. Final systems, pricing, timelines and suitability depend on your business needs and the relevant technology providers. A consultation is a conversation about goals and next steps — not a guaranteed installation or rate quote.</p>`,
    icon: "MonitorSmartphone",
    group: "financing",
    audienceFilters: ["business"],
    targetAudience: [
      "Restaurant and hospitality owners",
      "Retail operators",
      "Business owners modernizing payments and operations",
      "Drive-thru and quick-service restaurant operators",
    ],
    challenges: [
      "Choosing POS technology that fits day-to-day operations",
      "Connecting payments, ordering and inventory in one system",
      "Protecting premises with reliable surveillance",
      "Managing complex rollouts across multiple locations",
    ],
    benefits: [
      "Hospitality and retail POS solutions tailored to your operation",
      "Secure and scalable payment processing",
      "Drive-thru systems that keep service fast and accurate",
      "Video surveillance built for retail and hospitality environments",
      "Full installation and deployment support from start to finish",
      "One advisory relationship that connects technology with your broader financial picture",
    ],
    processSteps: [
      {
        title: "Share how you operate",
        description:
          "Retail, hospitality, drive-thru or multi-location — we start with how your business actually runs today.",
      },
      {
        title: "Review your technology needs",
        description:
          "POS, payments, surveillance and deployment options explained in plain language.",
      },
      {
        title: "Outline next steps",
        description:
          "We help you identify the right starting point — without pressure or fabricated promises.",
      },
    ],
    featured: true,
    sortOrder: 13,
    ctaLabel: "Book a Free Consultation",
    ctaHref: "/contact",
    seo: {
      title: "POS Systems | TopAdvice4U",
      description:
        "Hospitality POS, retail POS, payment processing, drive-thru systems, video surveillance and installation services for Canadian businesses.",
    },
  },
  {
    id: "web-development",
    name: "Web Development",
    slug: "web-development",
    shortDescription:
      "Professional website design and development services for businesses seeking an impactful online presence.",
    summary:
      "Bizzone Digital offers custom web development solutions tailored to your business needs — from corporate websites to e-commerce platforms.",
    content: `<p>Your website is often the first impression potential customers have of your business. Bizzone Digital creates professional, responsive and user-friendly websites that help you stand out online.</p><p>Whether you need a corporate website, e-commerce platform, landing page or custom web application — Bizzone Digital has the expertise to bring your vision to life.</p><h2>Our Web Development Services</h2><p><strong>Custom Website Design</strong> — Tailored designs that reflect your brand identity and engage your target audience.</p><p><strong>Responsive Development</strong> — Websites that work seamlessly across all devices — desktop, tablet and mobile.</p><p><strong>E-Commerce Solutions</strong> — Online stores with secure payment processing, inventory management and customer-friendly shopping experiences.</p><p><strong>Content Management Systems</strong> — Easy-to-update websites built on platforms like WordPress, Shopify or custom CMS solutions.</p><p><strong>Website Maintenance & Support</strong> — Ongoing technical support, updates and optimization to keep your site running smoothly.</p><p>For more information about our web development services, visit <a href="https://www.bizzonedigital.com/" target="_blank" rel="noopener noreferrer">www.bizzonedigital.com</a></p>`,
    icon: "Globe",
    image: { url: "/images/web-development.png", alt: "Web Development Services" },
    group: "digital-marketing",
    audienceFilters: ["business"],
    targetAudience: [
      "Small businesses establishing online presence",
      "E-commerce retailers",
      "Service providers needing professional websites",
      "Companies requiring custom web applications",
    ],
    challenges: [
      "Creating a professional first impression online",
      "Building websites that convert visitors into customers",
      "Maintaining and updating website content",
      "Ensuring mobile responsiveness and fast loading times",
    ],
    benefits: [
      "Professional website design that reflects your brand",
      "Responsive designs that work on all devices",
      "SEO-friendly development for better search visibility",
      "Easy content management systems",
      "Ongoing support and maintenance",
    ],
    processSteps: [
      {
        title: "Discovery & Planning",
        description:
          "We discuss your business goals, target audience and website requirements.",
      },
      {
        title: "Design & Development",
        description:
          "Our team creates a custom design and develops your website with modern technologies.",
      },
      {
        title: "Launch & Support",
        description:
          "We launch your website and provide ongoing support to ensure optimal performance.",
      },
    ],
    featured: true,
    sortOrder: 14,
    ctaLabel: "Visit Bizzone Digital",
    ctaHref: "https://www.bizzonedigital.com/",
    seo: {
      title: "Web Development | Bizzone Digital",
      description:
        "Professional web development services including custom websites, e-commerce platforms and responsive design.",
    },
  },
  {
    id: "social-media-management",
    name: "Social Media Management",
    slug: "social-media-management",
    shortDescription:
      "Strategic social media management to build your brand presence and engage your audience across platforms.",
    summary:
      "Bizzone Digital provides comprehensive social media management services — from content creation to community engagement and performance analytics.",
    content: `<p>Social media is essential for building brand awareness, engaging customers and driving business growth. Bizzone Digital manages your social media presence so you can focus on running your business.</p><p>Our social media management services cover strategy development, content creation, posting schedules, community management and performance tracking across all major platforms.</p><h2>Our Social Media Services</h2><p><strong>Social Media Strategy</strong> — Custom strategies aligned with your business goals and target audience.</p><p><strong>Content Creation</strong> — Eye-catching posts, graphics and videos designed to engage your followers.</p><p><strong>Community Management</strong> — Active engagement with your audience through comments, messages and interactions.</p><p><strong>Paid Social Advertising</strong> — Targeted ad campaigns to reach new audiences and drive conversions.</p><p><strong>Analytics & Reporting</strong> — Regular performance reports showing growth, engagement and ROI.</p><p>We manage presence across Facebook, Instagram, LinkedIn, Twitter/X, TikTok and more. Learn more at <a href="https://www.bizzonedigital.com/" target="_blank" rel="noopener noreferrer">www.bizzonedigital.com</a></p>`,
    icon: "Share2",
    image: { url: "/images/social-media-management.png", alt: "Social Media Management Services" },
    group: "digital-marketing",
    audienceFilters: ["business"],
    targetAudience: [
      "Businesses building brand awareness",
      "Companies seeking to engage their audience",
      "Organizations with limited marketing resources",
      "Brands expanding their social presence",
    ],
    challenges: [
      "Maintaining consistent social media presence",
      "Creating engaging content regularly",
      "Growing and engaging your audience",
      "Measuring social media ROI",
    ],
    benefits: [
      "Consistent, professional social media presence",
      "High-quality content tailored to each platform",
      "Increased brand awareness and engagement",
      "Time savings allowing focus on core business",
      "Data-driven insights and optimization",
    ],
    processSteps: [
      {
        title: "Strategy Development",
        description:
          "We analyze your brand, audience and goals to create a custom social media strategy.",
      },
      {
        title: "Content Creation & Posting",
        description:
          "Our team creates and publishes engaging content according to an optimized schedule.",
      },
      {
        title: "Engagement & Optimization",
        description:
          "We actively engage with your audience and continuously optimize based on performance data.",
      },
    ],
    featured: true,
    sortOrder: 15,
    ctaLabel: "Visit Bizzone Digital",
    ctaHref: "https://www.bizzonedigital.com/",
    seo: {
      title: "Social Media Management | Bizzone Digital",
      description:
        "Professional social media management services including strategy, content creation and community engagement.",
    },
  },
  {
    id: "content-strategy",
    name: "Content Strategy",
    slug: "content-strategy",
    shortDescription:
      "Strategic content planning and creation that drives engagement, builds authority and converts audiences.",
    summary:
      "Bizzone Digital develops comprehensive content strategies that align with your business goals — from blog posts to email campaigns and beyond.",
    content: `<p>Great content is the foundation of digital marketing success. Bizzone Digital creates strategic content that educates, engages and converts your target audience.</p><p>Our content strategy services encompass planning, creation, optimization and distribution across multiple channels — ensuring your message reaches the right people at the right time.</p><h2>Our Content Strategy Services</h2><p><strong>Content Planning & Strategy</strong> — Comprehensive content roadmaps aligned with your marketing goals and customer journey.</p><p><strong>Blog Writing & SEO Content</strong> — Search-optimized articles that drive organic traffic and establish thought leadership.</p><p><strong>Copywriting</strong> — Compelling website copy, landing pages and marketing materials that convert.</p><p><strong>Email Marketing Campaigns</strong> — Engaging email sequences that nurture leads and drive sales.</p><p><strong>Content Calendars</strong> — Organized publishing schedules ensuring consistent content delivery.</p><p><strong>Performance Analysis</strong> — Data-driven insights showing which content drives results.</p><p>Discover how strategic content can transform your marketing at <a href="https://www.bizzonedigital.com/" target="_blank" rel="noopener noreferrer">www.bizzonedigital.com</a></p>`,
    icon: "FileText",
    image: { url: "/images/content-strategy.png", alt: "Content Strategy Services" },
    group: "digital-marketing",
    audienceFilters: ["business"],
    targetAudience: [
      "Businesses seeking to build authority",
      "Companies wanting to improve SEO rankings",
      "Organizations needing consistent content",
      "Brands looking to nurture leads",
    ],
    challenges: [
      "Creating content consistently",
      "Aligning content with business goals",
      "Improving search engine rankings",
      "Converting content readers into customers",
    ],
    benefits: [
      "Strategic content aligned with business objectives",
      "SEO-optimized content for better visibility",
      "Professional writing that resonates with your audience",
      "Consistent content delivery",
      "Measurable impact on traffic and conversions",
    ],
    processSteps: [
      {
        title: "Strategy & Planning",
        description:
          "We analyze your audience, competitors and goals to develop a comprehensive content strategy.",
      },
      {
        title: "Content Creation",
        description:
          "Our team creates high-quality, SEO-optimized content tailored to your brand voice.",
      },
      {
        title: "Distribution & Analysis",
        description:
          "We distribute content across channels and analyze performance to continuously improve results.",
      },
    ],
    featured: true,
    sortOrder: 16,
    ctaLabel: "Visit Bizzone Digital",
    ctaHref: "https://www.bizzonedigital.com/",
    seo: {
      title: "Content Strategy | Bizzone Digital",
      description:
        "Strategic content planning, creation and optimization services that drive engagement and conversions.",
    },
  },
  {
    id: "ai-automation",
    name: "AI & AI Automations",
    slug: "ai-automation",
    shortDescription:
      "Harness the power of artificial intelligence to automate workflows, enhance productivity and gain competitive advantage.",
    summary:
      "Bizzone Digital implements AI-powered automation solutions that streamline operations, reduce costs and unlock new business opportunities.",
    content: `<p>Artificial intelligence is transforming how businesses operate. Bizzone Digital helps you leverage AI and automation technologies to work smarter, faster and more efficiently.</p><p>From chatbots and automated workflows to predictive analytics and intelligent content generation — we implement AI solutions that deliver real business value.</p><h2>Our AI & Automation Services</h2><p><strong>AI Chatbots & Virtual Assistants</strong> — Intelligent chatbots that handle customer inquiries 24/7, improving service while reducing costs.</p><p><strong>Workflow Automation</strong> — Automated processes that eliminate repetitive tasks and improve efficiency.</p><p><strong>AI Content Generation</strong> — Intelligent tools that assist with content creation, optimization and personalization.</p><p><strong>Predictive Analytics</strong> — AI-powered insights that help forecast trends and make data-driven decisions.</p><p><strong>Marketing Automation</strong> — Smart automation for email campaigns, lead nurturing and customer segmentation.</p><p><strong>Custom AI Solutions</strong> — Tailored AI implementations designed for your specific business needs.</p><p>Explore how AI can transform your business at <a href="https://www.bizzonedigital.com/" target="_blank" rel="noopener noreferrer">www.bizzonedigital.com</a></p>`,
    icon: "Bot",
    image: { url: "/images/ai-automation.png", alt: "AI & AI Automations Services" },
    group: "digital-marketing",
    audienceFilters: ["business"],
    targetAudience: [
      "Businesses seeking operational efficiency",
      "Companies wanting to reduce manual workload",
      "Organizations looking to improve customer service",
      "Enterprises exploring AI implementation",
    ],
    challenges: [
      "Managing repetitive manual tasks",
      "Scaling customer support operations",
      "Keeping up with competitors using AI",
      "Making sense of large data volumes",
    ],
    benefits: [
      "Significant time and cost savings through automation",
      "24/7 customer service capabilities",
      "Data-driven decision making with AI insights",
      "Improved accuracy and reduced human error",
      "Competitive advantage through AI adoption",
    ],
    processSteps: [
      {
        title: "Assessment & Strategy",
        description:
          "We identify automation opportunities and develop an AI implementation strategy.",
      },
      {
        title: "Development & Integration",
        description:
          "Our team builds and integrates AI solutions into your existing systems.",
      },
      {
        title: "Training & Optimization",
        description:
          "We train your team and continuously optimize AI performance for maximum value.",
      },
    ],
    featured: true,
    sortOrder: 17,
    ctaLabel: "Visit Bizzone Digital",
    ctaHref: "https://www.bizzonedigital.com/",
    seo: {
      title: "AI & AI Automations | Bizzone Digital",
      description:
        "AI and automation solutions including chatbots, workflow automation and intelligent business tools.",
    },
  },
  {
    id: "video-production",
    name: "Video Editing & Production",
    slug: "video-production",
    shortDescription:
      "Professional video editing and production services that tell your brand story and captivate audiences.",
    summary:
      "Bizzone Digital creates compelling video content — from promotional videos to social media clips — that engages viewers and drives results.",
    content: `<p>Video is the most engaging form of content online. Bizzone Digital produces professional videos that capture attention, tell your story and drive action.</p><p>Whether you need promotional videos, social media content, product demonstrations or corporate videos — our team handles everything from concept to final edit.</p><h2>Our Video Services</h2><p><strong>Video Editing</strong> — Professional editing that transforms raw footage into polished, engaging content.</p><p><strong>Promotional Videos</strong> — Compelling brand videos that showcase your products, services and value proposition.</p><p><strong>Social Media Videos</strong> — Short-form content optimized for Instagram, TikTok, Facebook and other platforms.</p><p><strong>Product Demonstrations</strong> — Clear, informative videos that show how your products work.</p><p><strong>Corporate Videos</strong> — Professional videos for internal communications, recruitment or investor presentations.</p><p><strong>Animation & Motion Graphics</strong> — Eye-catching animated content that simplifies complex ideas.</p><p><strong>Video Marketing Strategy</strong> — Strategic planning for video content that aligns with your marketing goals.</p><p>See our portfolio and learn more at <a href="https://www.bizzonedigital.com/" target="_blank" rel="noopener noreferrer">www.bizzonedigital.com</a></p>`,
    icon: "Video",
    image: { url: "/images/video-production.png", alt: "Video Editing & Production Services" },
    group: "digital-marketing",
    audienceFilters: ["business"],
    targetAudience: [
      "Businesses needing promotional content",
      "Brands building social media presence",
      "E-commerce companies showcasing products",
      "Organizations requiring corporate videos",
    ],
    challenges: [
      "Creating high-quality video content in-house",
      "Standing out in crowded social media feeds",
      "Explaining complex products or services",
      "Maintaining consistent video output",
    ],
    benefits: [
      "Professional-quality video content",
      "Higher engagement rates across all platforms",
      "Effective storytelling that converts viewers",
      "Videos optimized for each platform",
      "Cost-effective production and editing",
    ],
    processSteps: [
      {
        title: "Concept & Planning",
        description:
          "We collaborate on video concepts, scripts and production plans aligned with your goals.",
      },
      {
        title: "Production & Filming",
        description:
          "Our team handles filming or works with your existing footage for editing.",
      },
      {
        title: "Editing & Delivery",
        description:
          "We edit, refine and deliver polished video content ready for distribution.",
      },
    ],
    featured: true,
    sortOrder: 18,
    ctaLabel: "Visit Bizzone Digital",
    ctaHref: "https://www.bizzonedigital.com/",
    seo: {
      title: "Video Editing & Production | Bizzone Digital",
      description:
        "Professional video editing and production services for promotional videos, social media content and corporate communications.",
    },
  },
];

export const FALLBACK_TEAM_MEMBERS: PublicTeamMember[] = [
  {
    id: "team-harkiran",
    name: "Harkiran Singh",
    role: "Life Insurance and Mortgages Broker",
    shortBio:
      "Lead advisor at TopAdvice4U — helping families and businesses with life insurance, mortgages, investments and retirement conversations.",
    photoUrl: "/team/harkiran-singh.png?v=4",
    featured: true,
    sortOrder: 1,
  },
  {
    id: "team-jennifer",
    name: "Jennifer Chan",
    role: "Financial Advisor",
    shortBio:
      "Advisory conversations focused on life insurance products, investments for families and children, and clear next steps for retirement and estate planning for individuals and corporations.",
    photoUrl: "/team/jennifer-chan.png",
    featured: true,
    sortOrder: 2,
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
  {
    id: "blog-4",
    title: "RRSP Withdrawals: Tax-Efficient Strategies Worth Understanding",
    slug: "rrsp-withdrawal-tax-efficient-strategies",
    excerpt:
      "An educational look at common RRSP withdrawal ideas — so you can ask better questions before taking money out.",
    content: `<p>Registered Retirement Savings Plans (RRSPs) are powerful long-term tools — and withdrawals can create unexpected tax bills if timing and structure are not considered carefully.</p><p>This article is educational only. It is not tax, legal or personalized investment advice. Rules change, and your situation is unique. Confirm details with a qualified tax professional before acting.</p><h2>Why RRSP withdrawals feel “expensive”</h2><p>Withdrawals are generally added to your taxable income for the year. That can push you into a higher tax bracket, reduce certain benefits, or create cash-flow surprises — what some people casually call paying “much more tax” than expected.</p><h2>Ideas people commonly discuss (not recommendations)</h2><ul><li><strong>Timing across tax years</strong> — spreading withdrawals when income is lower (for example, between jobs or in early retirement) may change the tax picture versus taking a large lump sum in a high-income year.</li><li><strong>Partial withdrawals</strong> — taking only what you need, when you need it, instead of emptying an account at once.</li><li><strong>Withholding vs. final tax</strong> — amounts withheld at source are not always the full tax you owe; a year-end filing can still result in more payable (or a refund).</li><li><strong>RRIF conversion timing</strong> — understanding when converting an RRSP to a RRIF may fit your retirement income plan (rules and minimums apply).</li><li><strong>Home Buyers’ Plan / Lifelong Learning Plan</strong> — where eligible, these are specific programs with conditions, not general “free withdrawals.”</li><li><strong>Coordination with other income</strong> — pensions, employment income, capital gains and benefits can all interact with RRSP income in a given year.</li></ul><h2>Questions to bring to a consultation</h2><ul><li>What is my expected income this year and next?</li><li>Am I withdrawing for a short-term need or long-term income?</li><li>Have I spoken with a tax professional about bracket and benefit impacts?</li><li>Does my broader plan (TFSA, non-registered, insurance, debt) change the order of withdrawals?</li></ul><p>At TopAdvice4U, we help you prepare clearer questions and understand how RRSP conversations sit beside protection, financing and other planning topics. We do not provide tax advice. For tax treatment, speak with a qualified accountant or tax advisor.</p><p>Ready to talk through your goals? <a href="/contact">Book a free consultation</a>.</p>`,
    coverImage: {
      url: "/images/Blog-covers-2.png",
      alt: "Planning notes and calculator",
    },
    authorName: SITE_DEFAULTS.shortName,
    featured: true,
    readingTimeMinutes: 6,
    publishedAt: "2026-07-21T00:00:00.000Z",
    tags: ["RRSP", "tax planning", "education"],
  },
  {
    id: "blog-5",
    title: "Segregated Funds and Probate: What to Understand First",
    slug: "segregated-funds-and-probate",
    excerpt:
      "An educational overview of how segregated funds and beneficiary designations may relate to estate settlement — without treating this as legal advice.",
    content: `<p>Segregated funds are insurance-based investment contracts. People often ask whether they can help assets pass to beneficiaries more smoothly than assets that must go through probate.</p><p>This article is educational only. It is not legal, tax or personalized investment advice. Probate rules vary by province and by how assets are owned. Confirm details with a qualified lawyer and tax professional.</p><h2>Why probate comes up</h2><p>Probate is the court process that validates a will and authorizes an estate representative to deal with certain assets. It can add time, cost and publicity depending on the situation.</p><h2>What people commonly discuss about segregated funds</h2><ul><li><strong>Beneficiary designations</strong> — where a valid beneficiary is named, death benefits may be paid directly to that beneficiary under the insurance contract, which can be different from assets that must be administered through the estate.</li><li><strong>“Bypass probate” is not automatic</strong> — outcomes depend on designations, ownership, provincial rules and the rest of the estate plan. Incorrect or missing designations can change the result.</li><li><strong>Insurance contract features</strong> — segregated funds may include guarantees and creditor-protection discussions in some contexts; these are product-specific and should never be assumed.</li><li><strong>Coordination matters</strong> — wills, beneficiaries, jointly held assets and registered accounts should be reviewed together so one decision does not conflict with another.</li></ul><h2>Questions to ask before deciding</h2><ul><li>Who is named as beneficiary, and is that designation current?</li><li>How does this fit with my will and overall estate plan?</li><li>Have I spoken with a lawyer about probate in my province?</li><li>Do I understand fees, guarantees and liquidity of the product I am considering?</li></ul><p>TopAdvice4U can help you prepare clearer questions and understand how segregated-fund conversations sit beside protection, investments and legacy coordination. We do not provide legal advice. For probate and estate documents, speak with a qualified estate-planning lawyer.</p><p><a href="/contact">Book a free consultation</a> to start the conversation.</p>`,
    coverImage: {
      url: "/images/Blog-covers-3.png",
      alt: "Estate and planning documents",
    },
    authorName: SITE_DEFAULTS.shortName,
    featured: true,
    readingTimeMinutes: 5,
    publishedAt: "2026-07-21T12:00:00.000Z",
    tags: ["segregated funds", "estate planning", "education"],
  },
  {
    id: "blog-6",
    title: "Critical Illness Insurance: A Plain-Language Introduction",
    slug: "critical-illness-insurance-introduction",
    excerpt:
      "What critical illness coverage is designed to help with — and the questions worth asking before you decide.",
    content: `<p>Critical illness insurance is designed to pay a lump-sum benefit if you are diagnosed with a covered condition and meet the policy’s definition and survival requirements.</p><p>This article is educational only. It is not a quotation, medical advice or a guarantee of coverage. Definitions, exclusions and eligibility vary by insurer and contract.</p><h2>What it is meant to help with</h2><p>A qualifying critical illness benefit is often used to help with costs that can appear after a serious diagnosis — time away from work, travel for treatment, home adjustments, or simply financial breathing room while you focus on recovery.</p><h2>Ideas to understand before comparing policies</h2><ul><li><strong>Covered conditions</strong> — each policy lists which illnesses are covered and how they are defined.</li><li><strong>Survival period</strong> — many policies require you to survive a set number of days after diagnosis before a benefit is paid.</li><li><strong>Exclusions and waiting periods</strong> — pre-existing conditions and other limitations can affect eligibility.</li><li><strong>How it sits beside life and disability coverage</strong> — critical illness is not a substitute for every other protection conversation; the right mix depends on your situation.</li></ul><h2>Questions for a consultation</h2><ul><li>Which conditions matter most to discuss for my age and family history?</li><li>How would a lump sum help my household cash flow if I could not work for a period?</li><li>What documentation does underwriting typically require?</li><li>How does this fit with life insurance and emergency savings I already have?</li></ul><p>At TopAdvice4U, we explain options in plain language and help you prepare next steps. Final coverage depends on underwriting and the insurer — nothing here is an approval or guarantee.</p><p><a href="/contact">Book a free consultation</a>.</p>`,
    coverImage: {
      url: "/images/Blog-covers-1.png",
      alt: "Health and protection planning",
    },
    authorName: SITE_DEFAULTS.shortName,
    featured: true,
    readingTimeMinutes: 5,
    publishedAt: "2026-07-21T15:00:00.000Z",
    tags: ["critical illness", "protection", "education"],
  },
  {
    id: "blog-7",
    title: "Estate Planning for Retirement: Connecting Today’s Income to Tomorrow’s Legacy",
    slug: "estate-planning-for-retirement",
    excerpt:
      "How retirement income, beneficiaries and legacy conversations fit together — an educational overview to help you ask better questions.",
    content: `<p>Retirement planning and estate planning are often treated as separate projects. In practice, the decisions you make about income, registered accounts and beneficiaries can shape what is left for the people you care about.</p><p>This article is educational only. It is not legal, tax or personalized financial advice. Confirm details with qualified legal and tax professionals before acting.</p><h2>Why the two conversations belong together</h2><p>As you move from saving to drawing income, account types, withdrawal order and beneficiary designations can affect both your lifestyle and your estate. A plan that only looks at retirement income — or only at a will — can leave gaps.</p><h2>Topics people commonly review</h2><ul><li><strong>Registered accounts and beneficiaries</strong> — RRSP, RRIF, TFSA and similar accounts often use beneficiary or successor designations that may interact with your will.</li><li><strong>Income timing</strong> — when and how you draw funds can change tax in your lifetime and what remains later.</li><li><strong>Insurance in the picture</strong> — life insurance and related coverage may support dependents, debts or legacy goals alongside investment accounts.</li><li><strong>Business or property interests</strong> — ownership and succession questions should be coordinated with retirement timing.</li><li><strong>Who does what</strong> — lawyers handle wills and legal documents; accountants handle tax; advisory conversations help organize the financial pieces first.</li></ul><h2>Questions to bring to a consultation</h2><ul><li>Who depends on my income if something happens during retirement?</li><li>Are my beneficiary designations current and consistent with my will?</li><li>Have I spoken with a lawyer about probate and estate documents in my province?</li><li>Does my withdrawal plan create avoidable tax pressure later?</li></ul><p>TopAdvice4U helps you prepare clearer questions and coordinate financial conversations with partnered professionals when legal or tax advice is required. We do not provide legal or accounting advice.</p><p><a href="/contact">Book a free consultation</a>.</p>`,
    coverImage: {
      url: "/images/Blog-covers-3.png",
      alt: "Retirement and legacy planning",
    },
    authorName: SITE_DEFAULTS.shortName,
    featured: true,
    readingTimeMinutes: 5,
    publishedAt: "2026-07-21T18:00:00.000Z",
    tags: ["estate planning", "retirement", "education"],
  },
  {
    id: "blog-8",
    title: "RESPs Explained: Building Education Savings With Clearer Questions",
    slug: "resp-education-savings-explained",
    excerpt:
      "A plain-language introduction to Registered Education Savings Plans — contributions, grants and planning points for Canadian families.",
    content: `<p>A Registered Education Savings Plan (RESP) is a registered account used to save for a beneficiary’s post-secondary education. Families often use RESPs because contributions can grow tax-deferred and may attract government grants when rules are met.</p><p>This article is educational only. Grant amounts, limits and eligibility can change. Confirm current rules with Employment and Social Development Canada resources and a qualified advisor or tax professional.</p><h2>Core ideas to understand</h2><ul><li><strong>Subscriber and beneficiary</strong> — the subscriber opens and contributes to the plan; the beneficiary is the student the savings are intended to support.</li><li><strong>Contributions vs. growth and grants</strong> — contribution rules differ from how educational assistance payments (EAPs) are taxed when used for qualifying education.</li><li><strong>Canada Education Savings Grant (CESG)</strong> — where eligible, government grants can add to the plan based on contribution patterns and limits.</li><li><strong>Family vs. individual plans</strong> — structure can matter when more than one child is involved.</li><li><strong>Planning for the unexpected</strong> — successor subscriber / estate instructions can matter if the original subscriber dies; legal advice is required for wills and succession wording.</li></ul><h2>Practical questions before you contribute</h2><ul><li>What education timeline am I planning for?</li><li>Am I coordinating RESP savings with TFSA or other goals?</li><li>Do I understand contribution room and grant limits for my situation?</li><li>Have I thought about who would continue the plan if I could not?</li></ul><p>TopAdvice4U offers RESP and education-planning conversations in plain language as part of a broader advisory relationship. Nothing here is a quotation, grant guarantee or personalized recommendation.</p><p>Explore our <a href="/services/resp-education-planning">RESP and Education Planning</a> page or <a href="/contact">book a free consultation</a>.</p>`,
    coverImage: {
      url: "/images/Blog-1.png",
      alt: "Education planning and savings",
    },
    authorName: SITE_DEFAULTS.shortName,
    featured: true,
    readingTimeMinutes: 5,
    publishedAt: "2026-07-21T19:00:00.000Z",
    tags: ["RESP", "education planning", "family"],
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
        {
          label: "Private Mortgages",
          href: "/services/private-mortgages",
        },
        {
          label: "Reverse Mortgage",
          href: "/services/reverse-mortgage",
        },
        { label: "Business Loans", href: "/services/business-loans" },
        {
          label: "POS Systems",
          href: "/services/pos-systems",
        },
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
          label: "Estate Planning",
          href: "/services/estate-planning-coordination",
        },
        {
          label: "Investments",
          href: "/services/investments",
        },
        {
          label: "Retirement Solutions",
          href: "/services/retirement-solutions",
        },
      ],
    },
    {
      title: "Digital Marketing",
      links: [
        {
          label: "Web Development",
          href: "/services/web-development",
        },
        {
          label: "Social Media Management",
          href: "/services/social-media-management",
        },
        {
          label: "Content Strategy",
          href: "/services/content-strategy",
        },
        {
          label: "AI & AI Automations",
          href: "/services/ai-automation",
        },
        {
          label: "Video Editing & Production",
          href: "/services/video-production",
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
  "digital-marketing": "Digital Marketing",
};

export const AUDIENCE_FILTER_LABELS: Record<ServiceAudienceFilter, string> = {
  family: "Family",
  property: "Property",
  business: "Business",
  legacy: "Legacy",
};
