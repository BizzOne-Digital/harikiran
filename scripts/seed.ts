/**
 * Seed script for TopAdvice4U Financial Services Inc.
 * Usage: npx tsx scripts/seed.ts
 *
 * Requires: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, BETTER_AUTH_SECRET
 */
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });
import { MongoClient } from "mongodb";
import { hashPassword } from "better-auth/crypto";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "topadvice4you@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || "Harkiran Panesar";

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}
if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 10) {
  console.error("ADMIN_PASSWORD is required (min 10 characters)");
  process.exit(1);
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  const client = new MongoClient(MONGODB_URI!);
  await client.connect();
  const db = client.db();

  // Dynamically import models after connection
  const { SiteSettings } = await import("../src/models/SiteSettings");
  const { Service } = await import("../src/models/Service");
  const { Page } = await import("../src/models/Page");
  const { FAQ } = await import("../src/models/FAQ");
  const { BlogCategory } = await import("../src/models/Blog");
  const { NavigationMenu } = await import("../src/models/NavigationMenu");
  const { FormDefinition } = await import("../src/models/FormDefinition");

  // --- Super Admin via Better Auth collections ---
  const users = db.collection("user");
  const accounts = db.collection("account");

  const existingAdmin = await users.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (!existingAdmin) {
    const userId = crypto.randomUUID();
    const now = new Date();
    // Better Auth Mongo adapter maps `_id` ↔ `id`. Do not store a separate `id` field.
    await users.insertOne({
      _id: userId as never,
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
      role: "super_admin",
    });
    const hashed = await hashPassword(ADMIN_PASSWORD!);
    await accounts.insertOne({
      _id: crypto.randomUUID() as never,
      accountId: userId,
      providerId: "credential",
      userId,
      password: hashed,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Created Super Admin: ${ADMIN_EMAIL}`);
  } else {
    await users.updateOne(
      { email: ADMIN_EMAIL.toLowerCase() },
      { $set: { role: "super_admin", name: ADMIN_NAME } },
    );
    console.log(`Super Admin already exists: ${ADMIN_EMAIL}`);
  }

  // --- Site Settings ---
  const settingsCount = await SiteSettings.countDocuments();
  if (settingsCount === 0) {
    await SiteSettings.create({
      businessName: "TopAdvice4U Financial Services Inc.",
      shortName: "TopAdvice4U",
      description:
        "Canadian financial advisory for life insurance, mortgages, business financing, employee benefits, education planning and legacy coordination.",
      tagline: "Life. Property. Business. Legacy.",
      email: "topadvice4you@gmail.com",
      phone: "+1 604-837-3797",
      businessHours: "By appointment",
      showBusinessHours: true,
      showAddress: false,
      showMap: false,
      seo: {
        title: "TopAdvice4U Financial Services Inc.",
        description:
          "Protect what matters and finance what’s next. Life insurance, mortgages, business financing, employee benefits, education planning and legacy coordination.",
        titleTemplate: "%s | TopAdvice4U",
        keywords: [
          "life insurance",
          "mortgages",
          "business loans",
          "employee benefits",
          "RESP",
          "estate planning",
          "Canada",
        ],
        robotsIndex: true,
      },
      footer: {
        summary:
          "Trusted advisory for life insurance, mortgages, business financing, employee benefits, education planning and legacy coordination.",
        disclaimer:
          "Information on this website is general and educational. Availability and eligibility depend on individual circumstances. Mortgage and insurance examples are estimates only. Final terms are subject to relevant providers, underwriting and approvals. Legal and accounting matters should be addressed by qualified professionals.",
        showNewsletter: true,
      },
    });
    console.log("Seeded site settings");
  }

  // --- Services ---
  const services = [
    {
      name: "Family Life Insurance",
      slug: "family-life-insurance",
      shortDescription:
        "Coverage designed to help protect the people who depend on you.",
      summary:
        "Explore personal and family life insurance options that can help provide financial support if the unexpected happens.",
      content: `<p>Family life insurance planning focuses on protecting household income, covering outstanding obligations and supporting long-term goals for the people who matter most.</p><p>We help you understand coverage types, estimate needs and compare suitable options based on your circumstances. Final terms depend on underwriting and the insurer.</p>`,
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
          description: "We review coverage scenarios using educational estimators.",
        },
        {
          title: "Compare options",
          description: "We explore suitable products with transparent next steps.",
        },
      ],
      featured: true,
      sortOrder: 1,
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Family Life Insurance | TopAdvice4U",
        description:
          "Personal and family life insurance planning to help protect the people who depend on you.",
      },
    },
    {
      name: "Corporate Life Insurance",
      slug: "corporate-life-insurance",
      shortDescription:
        "Business-oriented life insurance strategies for owners and key people.",
      summary:
        "Corporate life insurance can help support succession planning, key-person protection and business continuity goals.",
      content: `<p>Corporate life insurance planning looks at how coverage may support a business if a key person is lost, or how ownership transitions can be funded more thoughtfully.</p><p>We coordinate discussions with your broader advisory team where appropriate. We do not provide legal or tax advice.</p>`,
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
          description: "We discuss options and coordinate with your professionals.",
        },
      ],
      featured: true,
      sortOrder: 2,
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Corporate Life Insurance | TopAdvice4U",
        description:
          "Corporate life insurance planning for business continuity, key-person protection and succession support.",
      },
    },
    {
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
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Home and Business Insurance | TopAdvice4U",
        description:
          "Property insurance for homes, rental properties and commercial premises — protecting your real estate assets.",
      },
    },
    {
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
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Liability Insurance | TopAdvice4U",
        description:
          "Personal, landlord, professional and commercial liability insurance — protecting against legal claims and lawsuits.",
      },
    },
    {
      name: "Residential Mortgages",
      slug: "residential-mortgages",
      shortDescription:
        "Guidance for home purchase, refinance and renewal decisions.",
      summary:
        "Residential mortgage advice to help you understand options for buying, refinancing or renewing a home.",
      content: `<p>Whether you are purchasing a home, refinancing or approaching renewal, we help you understand structures, timelines and documentation so you can move forward with clarity.</p><p>Rates, terms and approvals depend on lenders and your individual circumstances. Estimators on this site are educational only.</p>`,
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
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Residential Mortgages | TopAdvice4U",
        description:
          "Residential mortgage guidance for purchases, refinancing and renewals.",
      },
    },
    {
      name: "Commercial Mortgages",
      slug: "commercial-mortgages",
      shortDescription:
        "Financing conversations for income properties and commercial assets.",
      summary:
        "Commercial mortgage guidance for investors and business owners exploring property financing.",
      content: `<p>Commercial mortgage planning involves different lender criteria, documentation and timelines than residential borrowing. We help you prepare and understand the landscape.</p>`,
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
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Commercial Mortgages | TopAdvice4U",
        description:
          "Commercial mortgage guidance for investors and business property financing.",
      },
    },
    {
      name: "Business Loans",
      slug: "business-loans",
      shortDescription:
        "Advisory support for business growth and working-capital needs.",
      summary:
        "Explore business financing conversations focused on growth, operations and opportunity.",
      content: `<p>Business financing needs vary widely. We help you clarify the purpose of capital, prepare for lender conversations and understand potential structures.</p><p>Approvals are never guaranteed and depend on lenders and eligibility.</p>`,
      icon: "Briefcase",
      group: "financing",
      audienceFilters: ["business"],
      targetAudience: [
        "Entrepreneurs",
        "Business owners",
        "Growing companies",
      ],
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
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Business Loans | TopAdvice4U",
        description:
          "Business loan advisory for growth, operations and working-capital planning.",
      },
    },
    {
      name: "Group Health Plans",
      slug: "group-health-plans",
      shortDescription:
        "Employee benefit planning for teams that want practical coverage.",
      summary:
        "Group health and employee benefit plan discussions for employers building competitive workplaces.",
      content: `<p>Group benefits can help attract and retain talent while supporting employee wellbeing. We help employers understand plan components and decision points.</p>`,
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
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Group Health Plans | TopAdvice4U",
        description:
          "Group health and employee benefit plan guidance for Canadian employers.",
      },
    },
    {
      name: "RESP and Education Planning",
      slug: "resp-education-planning",
      shortDescription:
        "Education savings conversations for children’s future learning goals.",
      summary:
        "RESP and education planning support to help families prepare for future learning costs.",
      content: `<p>Education planning is about starting early, understanding contribution approaches and aligning savings with family priorities. We provide educational guidance — not guaranteed return projections.</p>`,
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
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "RESP and Education Planning | TopAdvice4U",
        description:
          "RESP and children’s education savings planning for Canadian families.",
      },
    },
    {
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
      sortOrder: 9,
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "POS Systems | TopAdvice4U",
        description:
          "Hospitality POS, retail POS, payment processing, drive-thru systems, video surveillance and installation services for Canadian businesses.",
      },
    },
    {
      name: "Estate-Planning Coordination",
      slug: "estate-planning-coordination",
      shortDescription:
        "Coordination with partnered lawyers and accountants for legacy planning.",
      summary:
        "We help coordinate estate-planning conversations with partnered corporate lawyers and accountants so your financial strategy works as one.",
      content: `<p>TopAdvice4U does not provide legal or accounting advice. We coordinate with partnered corporate lawyers and accountants so insurance, financing and legacy considerations can be discussed together.</p><p>Partner professionals are engaged based on your needs. We do not invent credentials or substitute for qualified legal or tax counsel.</p>`,
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
          description: "We determine where legal or accounting input is needed.",
        },
        {
          title: "Coordinate next steps",
          description: "We help keep the financial and professional pieces aligned.",
        },
      ],
      featured: true,
      sortOrder: 8,
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Estate-Planning Coordination | TopAdvice4U",
        description:
          "Estate-planning coordination with partnered lawyers and accountants for a unified financial strategy.",
      },
    },
    {
      name: "Web Development",
      slug: "web-development",
      shortDescription:
        "Professional website design and development services for businesses seeking an impactful online presence.",
      summary:
        "Custom web development solutions tailored to your business needs — from corporate websites to e-commerce platforms.",
      content: `<p>Your website is often the first impression potential customers have of your business. We create professional, responsive and user-friendly websites that help you stand out online.</p><p>Whether you need a corporate website, e-commerce platform, landing page or custom web application — we have the expertise to bring your vision to life.</p><h2>Our Web Development Services</h2><p><strong>Custom Website Design</strong> — Tailored designs that reflect your brand identity and engage your target audience.</p><p><strong>Responsive Development</strong> — Websites that work seamlessly across all devices — desktop, tablet and mobile.</p><p><strong>E-Commerce Solutions</strong> — Online stores with secure payment processing, inventory management and customer-friendly shopping experiences.</p><p><strong>Content Management Systems</strong> — Easy-to-update websites built on platforms like WordPress, Shopify or custom CMS solutions.</p><p><strong>Website Maintenance & Support</strong> — Ongoing technical support, updates and optimization to keep your site running smoothly.</p><p>Ready to build your online presence? Book a free consultation to discuss your web development needs</p>`,
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
      sortOrder: 9,
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Web Development | TopAdvice4U",
        description:
          "Professional web development services including custom websites, e-commerce platforms and responsive design.",
      },
    },
    {
      name: "Social Media Management",
      slug: "social-media-management",
      shortDescription:
        "Strategic social media management to build your brand presence and engage your audience across platforms.",
      summary:
        "Comprehensive social media management services — from content creation to community engagement and performance analytics.",
      content: `<p>Social media is essential for building brand awareness, engaging customers and driving business growth. We manage your social media presence so you can focus on running your business.</p><p>Our social media management services cover strategy development, content creation, posting schedules, community management and performance tracking across all major platforms.</p><h2>Our Social Media Services</h2><p><strong>Social Media Strategy</strong> — Custom strategies aligned with your business goals and target audience.</p><p><strong>Content Creation</strong> — Eye-catching posts, graphics and videos designed to engage your followers.</p><p><strong>Community Management</strong> — Active engagement with your audience through comments, messages and interactions.</p><p><strong>Paid Social Advertising</strong> — Targeted ad campaigns to reach new audiences and drive conversions.</p><p><strong>Analytics & Reporting</strong> — Regular performance reports showing growth, engagement and ROI.</p><p>We manage presence across Facebook, Instagram, LinkedIn, Twitter/X, TikTok and more. Ready to amplify your social media presence? Book a free consultation to get started</p>`,
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
      sortOrder: 10,
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Social Media Management | TopAdvice4U",
        description:
          "Professional social media management services including strategy, content creation and community engagement.",
      },
    },
    {
      name: "Content Strategy",
      slug: "content-strategy",
      shortDescription:
        "Strategic content planning and creation that drives engagement, builds authority and converts audiences.",
      summary:
        "Comprehensive content strategies that align with your business goals — from blog posts to email campaigns and beyond.",
      content: `<p>Great content is the foundation of digital marketing success. Bizzone Digital creates strategic content that educates, engages and converts your target audience.</p><p>Our content strategy services encompass planning, creation, optimization and distribution across multiple channels — ensuring your message reaches the right people at the right time.</p><h2>Our Content Strategy Services</h2><p><strong>Content Planning & Strategy</strong> — Comprehensive content roadmaps aligned with your marketing goals and customer journey.</p><p><strong>Blog Writing & SEO Content</strong> — Search-optimized articles that drive organic traffic and establish thought leadership.</p><p><strong>Copywriting</strong> — Compelling website copy, landing pages and marketing materials that convert.</p><p><strong>Email Marketing Campaigns</strong> — Engaging email sequences that nurture leads and drive sales.</p><p><strong>Content Calendars</strong> — Organized publishing schedules ensuring consistent content delivery.</p><p><strong>Performance Analysis</strong> — Data-driven insights showing which content drives results.</p><p>Ready to transform your content marketing? Book a free consultation to discuss your content strategy needs</p>`,
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
      sortOrder: 11,
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Content Strategy | TopAdvice4U",
        description:
          "Strategic content planning, creation and optimization services that drive engagement and conversions.",
      },
    },
    {
      name: "AI & AI Automations",
      slug: "ai-automation",
      shortDescription:
        "Harness the power of artificial intelligence to automate workflows, enhance productivity and gain competitive advantage.",
      summary:
        "AI-powered automation solutions that streamline operations, reduce costs and unlock new business opportunities.",
      content: `<p>Artificial intelligence is transforming how businesses operate. We help you leverage AI and automation technologies to work smarter, faster and more efficiently.</p><p>From chatbots and automated workflows to predictive analytics and intelligent content generation — we implement AI solutions that deliver real business value.</p><h2>Our AI & Automation Services</h2><p><strong>AI Chatbots & Virtual Assistants</strong> — Intelligent chatbots that handle customer inquiries 24/7, improving service while reducing costs.</p><p><strong>Workflow Automation</strong> — Automated processes that eliminate repetitive tasks and improve efficiency.</p><p><strong>AI Content Generation</strong> — Intelligent tools that assist with content creation, optimization and personalization.</p><p><strong>Predictive Analytics</strong> — AI-powered insights that help forecast trends and make data-driven decisions.</p><p><strong>Marketing Automation</strong> — Smart automation for email campaigns, lead nurturing and customer segmentation.</p><p><strong>Custom AI Solutions</strong> — Tailored AI implementations designed for your specific business needs.</p><p>Ready to leverage AI for your business? Book a free consultation to explore AI automation opportunities</p>`,
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
      sortOrder: 12,
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "AI & AI Automations | TopAdvice4U",
        description:
          "AI and automation solutions including chatbots, workflow automation and intelligent business tools.",
      },
    },
    {
      name: "Video Editing & Production",
      slug: "video-production",
      shortDescription:
        "Professional video editing and production services that tell your brand story and captivate audiences.",
      summary:
        "Compelling video content — from promotional videos to social media clips — that engages viewers and drives results.",
      content: `<p>Video is the most engaging form of content online. We produce professional videos that capture attention, tell your story and drive action.</p><p>Whether you need promotional videos, social media content, product demonstrations or corporate videos — our team handles everything from concept to final edit.</p><h2>Our Video Services</h2><p><strong>Video Editing</strong> — Professional editing that transforms raw footage into polished, engaging content.</p><p><strong>Promotional Videos</strong> — Compelling brand videos that showcase your products, services and value proposition.</p><p><strong>Social Media Videos</strong> — Short-form content optimized for Instagram, TikTok, Facebook and other platforms.</p><p><strong>Product Demonstrations</strong> — Clear, informative videos that show how your products work.</p><p><strong>Corporate Videos</strong> — Professional videos for internal communications, recruitment or investor presentations.</p><p><strong>Animation & Motion Graphics</strong> — Eye-catching animated content that simplifies complex ideas.</p><p><strong>Video Marketing Strategy</strong> — Strategic planning for video content that aligns with your marketing goals.</p><p>Ready to create powerful video content? Book a free consultation to discuss your video production needs</p>`,
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
      sortOrder: 13,
      status: "published",
      publishedAt: new Date(),
      seo: {
        title: "Video Editing & Production | TopAdvice4U",
        description:
          "Professional video editing and production services for promotional videos, social media content and corporate communications.",
      },
    },
  ];

  for (const service of services) {
    await Service.findOneAndUpdate(
      { slug: service.slug },
      { $setOnInsert: service },
      { upsert: true, new: true },
    );
  }
  console.log(`Seeded ${services.length} services`);

  // --- Pages ---
  const pages = [
    {
      title: "Home",
      slug: "home",
      status: "published",
      visibility: true,
      publishedAt: new Date(),
      seo: {
        title: "TopAdvice4U | Protect What Matters. Finance What’s Next.",
        description:
          "Life insurance, mortgages, business financing, employee benefits, education planning and legacy coordination through one trusted advisory relationship.",
      },
      hero: {
        eyebrow: "Life. Property. Business. Legacy.",
        heading: "Protect What Matters.\nFinance What’s Next.",
        subheading:
          "Life insurance, mortgages, business financing, employee benefits, education planning and legacy coordination—all through one trusted advisory relationship.",
        primaryCtaLabel: "Book a Free Consultation",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Explore Our Solutions",
        secondaryCtaHref: "/services",
      },
      sections: [
        { id: "journey", type: "journey", enabled: true, order: 1, data: {} },
        { id: "services", type: "service-grid", enabled: true, order: 2, data: {} },
        { id: "calculators", type: "calculator", enabled: true, order: 3, data: {} },
        { id: "bento", type: "bento-grid", enabled: true, order: 4, data: {} },
        { id: "coordination", type: "rich-text", enabled: true, order: 5, data: {} },
        { id: "process", type: "process", enabled: true, order: 6, data: {} },
        { id: "team", type: "team", enabled: true, order: 7, data: {} },
        { id: "blog", type: "blog-preview", enabled: true, order: 8, data: {} },
        { id: "cta", type: "cta", enabled: true, order: 9, data: {} },
      ],
    },
    {
      title: "About",
      slug: "about",
      status: "published",
      visibility: true,
      publishedAt: new Date(),
      seo: {
        title: "About TopAdvice4U Financial Services",
        description:
          "Learn how TopAdvice4U helps families, property owners and businesses protect, finance and plan with clarity.",
      },
      hero: {
        heading: "Advice Built Around What You Are Building.",
        subheading:
          "TopAdvice4U Financial Services Inc. helps clients navigate protection, financing and long-term planning through one trusted advisory relationship.",
        primaryCtaLabel: "Book a Free Consultation",
        primaryCtaHref: "/contact",
      },
      sections: [],
    },
    {
      title: "Services",
      slug: "services",
      status: "published",
      visibility: true,
      publishedAt: new Date(),
      seo: {
        title: "Financial Solutions | TopAdvice4U",
        description:
          "Explore life insurance, mortgages, business financing, employee benefits, education planning and estate-planning coordination.",
      },
      hero: {
        heading: "Solutions for Life, Property, Business and Legacy.",
        subheading:
          "Filter by what you are planning and explore advisory pathways designed for clarity.",
      },
      sections: [],
    },
    {
      title: "Contact",
      slug: "contact",
      status: "published",
      visibility: true,
      publishedAt: new Date(),
      seo: {
        title: "Book a Free Consultation | TopAdvice4U",
        description:
          "Tell us what you are planning, protecting or financing. We will help you understand the next step.",
      },
      hero: {
        heading: "Let’s Start the Conversation.",
        subheading:
          "Share a little about your goals and we will follow up with clear next steps.",
      },
      sections: [],
    },
    {
      title: "Blog",
      slug: "blog",
      status: "published",
      visibility: true,
      publishedAt: new Date(),
      seo: {
        title: "Insights | TopAdvice4U",
        description:
          "Educational articles on life insurance, mortgages, business financing, benefits, education planning and legacy.",
      },
      hero: {
        heading: "Insights for Clearer Financial Decisions.",
        subheading:
          "Practical, educational perspectives — not personalized financial advice.",
      },
      sections: [],
    },
    {
      title: "Our Team",
      slug: "team",
      status: "published",
      visibility: true,
      publishedAt: new Date(),
      seo: {
        title: "Our Team | TopAdvice4U",
        description: "Meet the TopAdvice4U advisory team.",
      },
      hero: {
        heading: "People Behind the Advice.",
        subheading:
          "Team profiles are published when ready. Until then, connect directly with our advisory team.",
      },
      sections: [],
    },
    {
      title: "FAQ",
      slug: "faq",
      status: "published",
      visibility: true,
      publishedAt: new Date(),
      seo: {
        title: "Frequently Asked Questions | TopAdvice4U",
        description:
          "Answers to common questions about consultations, insurance, mortgages and planning.",
      },
      hero: {
        heading: "Questions, Answered Clearly.",
        subheading: "Search topics or browse by category.",
      },
      sections: [],
    },
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      status: "published",
      visibility: true,
      publishedAt: new Date(),
      seo: {
        title: "Privacy Policy | TopAdvice4U",
        description: "How TopAdvice4U collects, uses and protects personal information.",
        noIndex: false,
      },
      hero: { heading: "Privacy Policy" },
      sections: [
        {
          id: "privacy-body",
          type: "rich-text",
          enabled: true,
          order: 1,
          data: {
            html: `<p>TopAdvice4U Financial Services Inc. respects your privacy. Information submitted through this website is used to respond to enquiries and provide requested services.</p><p>We do not ask for Social Insurance Numbers, bank login credentials, detailed medical records, credit-card information or government ID uploads through public website forms.</p><p>This policy is editable and should be reviewed by the business before relying on it as final legal wording.</p>`,
          },
        },
      ],
    },
    {
      title: "Terms of Use",
      slug: "terms",
      status: "published",
      visibility: true,
      publishedAt: new Date(),
      seo: {
        title: "Terms of Use | TopAdvice4U",
        description: "Terms governing use of the TopAdvice4U website.",
      },
      hero: { heading: "Terms of Use" },
      sections: [
        {
          id: "terms-body",
          type: "rich-text",
          enabled: true,
          order: 1,
          data: {
            html: `<p>By using this website you agree to these terms. Content is provided for general educational purposes and does not constitute a commitment to provide products, rates or approvals.</p><p>Final wording should be reviewed by the business and legal counsel.</p>`,
          },
        },
      ],
    },
    {
      title: "Disclaimer",
      slug: "disclaimer",
      status: "published",
      visibility: true,
      publishedAt: new Date(),
      seo: {
        title: "Disclaimer | TopAdvice4U",
        description:
          "Important educational and eligibility disclaimers for TopAdvice4U website content.",
      },
      hero: { heading: "Disclaimer" },
      sections: [
        {
          id: "disclaimer-body",
          type: "rich-text",
          enabled: true,
          order: 1,
          data: {
            html: `<p>Information on this website is general and educational. Availability and eligibility depend on individual circumstances.</p><p>Mortgage and insurance examples and calculators are estimates only and are not quotations, approvals, guarantees or financial advice.</p><p>Final terms are subject to relevant providers, underwriting and approvals. Legal and accounting matters should be addressed by qualified professionals. TopAdvice4U coordinates introductions where appropriate and does not itself provide legal or accounting advice.</p>`,
          },
        },
      ],
    },
  ];

  for (const page of pages) {
    await Page.findOneAndUpdate(
      { slug: page.slug },
      { $setOnInsert: page },
      { upsert: true },
    );
  }
  console.log(`Seeded ${pages.length} pages`);

  // --- Page media (hero BG + 5 gallery images + bodyHtml) ---
  const { PAGE_MEDIA } = await import("../src/config/page-media");
  for (const media of PAGE_MEDIA) {
    const images = media.images.map((img, i) => ({
      url: img.url,
      alt: img.alt,
      caption: img.caption,
      order: i,
    }));
    await Page.findOneAndUpdate(
      { slug: media.slug },
      {
        $set: {
          "hero.backgroundImage": media.heroBg,
          bodyHtml: media.bodyHtml,
          images,
        },
      },
    );
  }
  console.log(`Synced media for ${PAGE_MEDIA.length} pages`);

  // --- Blog categories ---
  const categories = [
    { name: "Life Insurance", slug: "life-insurance", sortOrder: 1 },
    { name: "Mortgages", slug: "mortgages", sortOrder: 2 },
    { name: "Business Financing", slug: "business-financing", sortOrder: 3 },
    { name: "Employee Benefits", slug: "employee-benefits", sortOrder: 4 },
    { name: "Education Planning", slug: "education-planning", sortOrder: 5 },
    {
      name: "Estate and Legacy Planning",
      slug: "estate-legacy-planning",
      sortOrder: 6,
    },
  ];
  for (const cat of categories) {
    await BlogCategory.findOneAndUpdate(
      { slug: cat.slug },
      { $setOnInsert: cat },
      { upsert: true },
    );
  }
  console.log("Seeded blog categories");

  // --- FAQs ---
  const faqs = [
    {
      question: "What does a free consultation include?",
      answer:
        "A consultation is a conversation about your goals, priorities and questions. We discuss suitable next steps. It is not an approval, quotation or guarantee of any product or rate.",
      category: "General",
      featured: true,
      sortOrder: 1,
      status: "published",
    },
    {
      question: "Do you provide legal or accounting advice?",
      answer:
        "No. TopAdvice4U coordinates estate-planning needs with partnered corporate lawyers and accountants where appropriate. Legal and accounting matters should be addressed by qualified professionals.",
      category: "Estate Planning",
      featured: true,
      sortOrder: 2,
      status: "published",
    },
    {
      question: "Are the calculator results a formal quote?",
      answer:
        "No. Calculator results are educational estimates only. They are not quotations, approvals, guarantees or personalized financial advice.",
      category: "Calculators",
      featured: true,
      sortOrder: 3,
      status: "published",
    },
    {
      question: "Who do you work with?",
      answer:
        "We work with families, homebuyers, property owners, entrepreneurs, business owners, employers and clients planning family or business legacy goals.",
      category: "General",
      featured: true,
      sortOrder: 4,
      status: "published",
    },
    {
      question: "Can you guarantee mortgage or insurance approval?",
      answer:
        "No. Approvals and terms depend on providers, underwriting and your individual circumstances. We help you understand options and prepare for next steps.",
      category: "Financing",
      featured: true,
      sortOrder: 5,
      status: "published",
    },
    {
      question: "How should I prepare for our first conversation?",
      answer:
        "A brief outline of what you are trying to protect, finance or plan is enough to start. If you have timelines, property details or coverage questions, share those as well.",
      category: "General",
      featured: false,
      sortOrder: 6,
      status: "published",
    },
  ];
  for (const faq of faqs) {
    await FAQ.findOneAndUpdate(
      { question: faq.question },
      { $setOnInsert: faq },
      { upsert: true },
    );
  }
  console.log("Seeded FAQs (no fake testimonials or team members)");

  // --- Navigation ---
  await NavigationMenu.findOneAndUpdate(
    { key: "header" },
    {
      $set: {
        label: "Header",
        items: [
          { label: "Home", href: "/", visible: true },
          { label: "About", href: "/about", visible: true },
          { label: "Solutions", href: "/services", visible: true },
          { label: "Blog", href: "/blog", visible: true },
          { label: "Our Team", href: "/team", visible: true },
          { label: "FAQ", href: "/faq", visible: true },
          { label: "Contact", href: "/contact", visible: true },
        ],
        megaMenuGroups: [
          {
            title: "Protection",
            links: [
              { label: "Family Life Insurance", href: "/services/family-life-insurance" },
              { label: "Corporate Life Insurance", href: "/services/corporate-life-insurance" },
              { label: "Group Health Plans", href: "/services/group-health-plans" },
            ],
          },
          {
            title: "Financing",
            links: [
              { label: "Residential Mortgages", href: "/services/residential-mortgages" },
              { label: "Commercial Mortgages", href: "/services/commercial-mortgages" },
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
        ],
        ctaLabel: "Book a Consultation",
        ctaHref: "/contact",
      },
    },
    { upsert: true },
  );

  await NavigationMenu.findOneAndUpdate(
    { key: "footer" },
    {
      $set: {
        label: "Footer",
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
        ],
        megaMenuGroups: [],
      },
    },
    { upsert: true },
  );
  console.log("Seeded navigation");

  // --- Forms ---
  const consultationForm = await FormDefinition.findOne({ key: "consultation" });
  if (!consultationForm) {
    await FormDefinition.create({
      key: "consultation",
      name: "Consultation Request",
      description: "Primary lead-generation form",
      successMessage:
        "Thank you. Your consultation request has been received. We will be in touch shortly.",
      notifyEmail: "topadvice4you@gmail.com",
      enabled: true,
      fields: [
        { name: "name", label: "Full name", type: "text", required: true, order: 1 },
        { name: "email", label: "Email", type: "email", required: true, order: 2 },
        { name: "phone", label: "Phone", type: "tel", required: false, order: 3 },
        {
          name: "clientType",
          label: "I am enquiring as",
          type: "select",
          required: true,
          options: ["individual", "business"],
          order: 4,
        },
        {
          name: "serviceInterest",
          label: "Service of interest",
          type: "select",
          required: false,
          order: 5,
        },
        {
          name: "message",
          label: "How can we help?",
          type: "textarea",
          required: false,
          order: 6,
        },
      ],
    });
  }
  console.log("Seeded form definitions");

  console.log("\nSeed complete.");
  console.log("Admin login:", ADMIN_EMAIL);
  await client.close();
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
