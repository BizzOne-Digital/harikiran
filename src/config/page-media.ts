/**
 * Local hero + section images per public page (from /public/images).
 * Admin can still replace any URL via the CMS (Pages → Edit).
 */
export type PageMediaSeed = {
  slug: string;
  heroBg: string;
  images: { url: string; alt: string; caption: string }[];
  bodyHtml: string;
};

const img = (file: string) => `/images/${file}`;

function section(
  prefix: string,
  items: { alt: string; caption: string }[],
) {
  return items.map((item, i) => ({
    url: img(`${prefix}-${i + 1}.png`),
    alt: item.alt,
    caption: item.caption,
  }));
}

export const PAGE_MEDIA: PageMediaSeed[] = [
  {
    slug: "home",
    heroBg: img("hero-bg.png"),
    images: section("Home", [
      { alt: "Family protection", caption: "Protect what matters" },
      { alt: "Home financing", caption: "Finance what’s next" },
      { alt: "Business growth", caption: "Grow with clarity" },
      { alt: "Education planning", caption: "Plan for education" },
      { alt: "Legacy planning", caption: "Preserve your legacy" },
    ]),
    bodyHtml: "",
  },
  {
    slug: "about",
    heroBg: img("About-hero.png"),
    images: section("About", [
      { alt: "Advisory conversation", caption: "Clarity-first conversations" },
      { alt: "Family planning", caption: "Family priorities" },
      { alt: "Financial documents", caption: "Thoughtful planning" },
      { alt: "Trusted handshake", caption: "Trusted relationship" },
      { alt: "Professional advisor", caption: "One advisory relationship" },
    ]),
    bodyHtml: `<p>TopAdvice4U Financial Services Inc. was built for people who want clearer guidance — not more jargon. Whether you are protecting a family, financing a property, strengthening a business, or thinking about the next chapter of your legacy, we help you understand the options in front of you and take the next step with confidence.</p><p>Led by <strong>Harkiran Panesar</strong>, our work sits at the intersection of life insurance, mortgages, business financing, employee benefits, education planning and estate-planning coordination. Instead of sending you to five different conversations, we aim to give you one trusted advisory relationship that can grow with your needs over time.</p><p>We believe good advice starts with listening. Every consultation begins with your goals, your timeline and your constraints — then we translate product and financing pathways into plain language so you can decide what fits.</p><p>Our promise is simple: educational clarity, honest next steps, and no fabricated credentials, rates or guarantees. Final terms always depend on providers, underwriting and approvals.</p>`,
  },
  {
    slug: "services",
    heroBg: img("Services-hero.png"),
    images: section("Services", [
      { alt: "Insurance planning", caption: "Protection pathways" },
      { alt: "Property financing", caption: "Property financing" },
      { alt: "Business analytics", caption: "Business strength" },
      { alt: "Education planning", caption: "Education planning" },
      { alt: "Legacy coordination", caption: "Legacy coordination" },
    ]),
    bodyHtml: `<p>Explore life insurance, mortgages, business financing, employee benefits, education planning and estate-planning coordination — each pathway designed for clarity.</p><p>Open any solution to see who it is for, common challenges, how we help, and a clear process. Final terms always depend on providers, underwriting and approvals.</p>`,
  },
  {
    slug: "contact",
    heroBg: img("Contact-hero.png"),
    // Contact folder only includes a hero — reuse Services section art for splits
    images: section("Services", [
      { alt: "Phone consultation", caption: "Start the conversation" },
      { alt: "Write to us", caption: "Write to us" },
      { alt: "We listen first", caption: "We listen first" },
      { alt: "Book a consultation", caption: "Book a consultation" },
      { alt: "Preferred contact", caption: "Preferred contact" },
    ]),
    bodyHtml: `<p>Tell us what you are planning, protecting or financing. We will help you understand the next step.</p><p>A consultation is a conversation about your goals — not an approval, quotation or guarantee of any product or rate. Share as much or as little as you are comfortable with, and we will follow up with clear next steps.</p>`,
  },
  {
    slug: "blog",
    heroBg: img("Blog-hero.png"),
    images: section("Blog", [
      { alt: "Educational insights", caption: "Educational insights" },
      { alt: "Clear perspectives", caption: "Clear perspectives" },
      { alt: "Practical guidance", caption: "Practical guidance" },
      { alt: "Ideas that matter", caption: "Ideas that matter" },
      { alt: "Not financial advice", caption: "Not financial advice" },
    ]),
    bodyHtml: `<p>Educational articles on insurance, mortgages, business financing, benefits, education and legacy — practical perspectives, not personalized advice.</p><p>Use these pieces to prepare better questions for a consultation. Nothing published here replaces a conversation about your specific circumstances.</p>`,
  },
  {
    slug: "team",
    heroBg: img("Team-hero.png"),
    images: section("Team", [
      { alt: "People behind the advice", caption: "People behind the advice" },
      { alt: "Client conversations", caption: "Client conversations" },
      { alt: "Professional focus", caption: "Professional focus" },
      { alt: "Relationship-led", caption: "Relationship-led" },
      { alt: "Collaborative approach", caption: "Collaborative approach" },
    ]),
    bodyHtml: `<p>Team profiles are published when ready. Until then, connect directly with our advisory team to start a consultation.</p><p>Led by Harkiran Panesar, TopAdvice4U focuses on clear, educational guidance for families, property owners and businesses — across protection, financing and long-term planning.</p>`,
  },
  {
    slug: "faq",
    heroBg: img("FAQ-hero.png"),
    images: section("FAQ", [
      { alt: "Clear answers", caption: "Clear answers" },
      { alt: "Common topics", caption: "Common topics" },
      { alt: "Honest explanations", caption: "Honest explanations" },
      { alt: "Ask anything", caption: "Ask anything" },
      { alt: "No pressure", caption: "No pressure" },
    ]),
    bodyHtml: `<p>Search frequently asked questions about consultations, insurance, mortgages and planning. Still unsure? Contact us.</p><p>These answers are educational. Your situation may differ — a consultation helps us understand what applies to you.</p>`,
  },
  {
    slug: "privacy-policy",
    heroBg: img("Privacy-hero.png"),
    images: section("Privacy", [
      { alt: "Your information", caption: "Your information" },
      { alt: "Respectful handling", caption: "Respectful handling" },
      { alt: "Website enquiries", caption: "Website enquiries" },
      { alt: "No sensitive IDs", caption: "No sensitive IDs" },
      { alt: "Editable policy", caption: "Editable policy" },
    ]),
    bodyHtml: `<p>TopAdvice4U respects your privacy. Information submitted through this website is used to respond to enquiries and provide requested services.</p><p>We do not ask for Social Insurance Numbers, bank login credentials, detailed medical records, credit-card information or government ID uploads through public website forms.</p>`,
  },
  {
    slug: "terms",
    heroBg: img("Terms-hero.png"),
    images: section("Terms", [
      { alt: "Terms of use", caption: "Terms of use" },
      { alt: "Website use", caption: "Website use" },
      { alt: "Educational content", caption: "Educational content" },
      { alt: "No approvals implied", caption: "No approvals implied" },
      { alt: "Review with counsel", caption: "Review with counsel" },
    ]),
    bodyHtml: `<p>By using this website you agree to these terms. Content is provided for general educational purposes and does not constitute a commitment to provide products, rates or approvals.</p>`,
  },
  {
    slug: "disclaimer",
    heroBg: img("Disclaimer-hero.png"),
    images: section("Disclaimer", [
      { alt: "Educational only", caption: "Educational only" },
      { alt: "Estimates only", caption: "Estimates only" },
      { alt: "No guarantees", caption: "No guarantees" },
      { alt: "Subject to underwriting", caption: "Subject to underwriting" },
      { alt: "Qualified professionals", caption: "Qualified professionals" },
    ]),
    bodyHtml: `<p>Information on this website is general and educational. Availability and eligibility depend on individual circumstances.</p><p>Mortgage and insurance examples and calculators are estimates only and are not quotations, approvals, guarantees or financial advice.</p><p>Final terms are subject to relevant providers, underwriting and approvals. Legal and accounting matters should be addressed by qualified professionals.</p>`,
  },
];
