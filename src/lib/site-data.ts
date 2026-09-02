export type Service = {
  id: string;
  index: string;
  title: string;
  short: string;
  body: string;
  glyph: "2" | "3" | "9";
  lede: string;
  capabilities: string[];
  process: { step: string; title: string; detail: string }[];
};

export const SERVICES: Service[] = [
  {
    id: "business-strategy-and-growth-consulting",
    index: "01",
    title: "Business Strategy & Growth Consulting",
    // short: "Business & Market Research",
    body: "Helping businesses identify opportunities, partnerships and growth pathways.",
    glyph: "2",
    lede: "We find the routes to revenue that already exist inside your business — then build the structure to walk them.",
    capabilities: [
      "Business & Market Research",
      "Business Strategy & Growth Planning",
      "Market & Competitor Analysis",
      "Product Research & Development",
      "Product Sourcing & Vendor Identification",
      "Sales & Distribution Strategy",
      "Pricing, Costing & Profitability",
      "Offline & Market Expansion",
      "Business Feasibility & Commercial Planning",
      "Process & Business Consulting",
    ],
    process: [
      { step: "01", title: "Diagnose", detail: "We audit demand, pricing and pipeline to see where value actually leaks." },
      { step: "02", title: "Design", detail: "Offers, partners and commercial models are shaped around real willingness to pay." },
      { step: "03", title: "Deploy", detail: "We build the operating rhythm — targets, materials, reporting — and hand it over working." },
    ],
  },
   {
    id: "branding-marketing-and-communications",
    index: "02",
    title: "Branding, Marketing & Communications",
    // short: "Brand Development & Positioning",
    body: "Creating modern websites and digital platforms that connect businesses with their audiences.",
    glyph: "9",
    lede: "Websites and platforms designed around perceived speed, clarity and craft — not template convenience.",
    capabilities: [
      "Brand Development & Positioning",
      "Brand Strategy & Identity",
      "Creative Design & Content Production",
      "Digital Marketing",
      "Performance Advertising",
      "Social Media Management",
      "Influencer & Campaign Marketing",
      "Sponsorship & Event Branding",
      "Public Relations & Corporate Communications",
    ],
    process: [
      { step: "01", title: "Frame", detail: "We define the one job the experience must do and cut everything else." },
      { step: "02", title: "Prototype", detail: "Interfaces are tested in motion, not in static mockups." },
      { step: "03", title: "Ship", detail: "Built, measured and refined against real usage after launch." },
    ],
  },
  {
    id: "e-commerce-and-marketplace-management",
    index: "03",
    title: "E-Commerce & Marketplace Management",
    // short: "E-Commerce Strategy & Setup",
    body: "Building distinctive brand identities and positioning.",
    glyph: "3",
    lede: "A brand is a decision, not a decoration. We make the decision clear and make it look inevitable.",
    capabilities: [
      "Marketplace Onboarding & Management",
      "Amazon, Flipkart, Myntra & Quick Commerce",
      "Product Listing & Catalog Management",
      "Marketplace Advertising & Promotions",
      "Sales & Revenue Growth",
      "Marketplace Account Management",
      "Online-to-Offline & Channel Expansion",
    ],
    process: [
      { step: "01", title: "Listen", detail: "Interviews, category study and evidence gathering before a single word is written." },
      { step: "02", title: "Define", detail: "One territory, one idea, one sentence the whole business can repeat." },
      { step: "03", title: "Build", detail: "A modular identity and system designed to survive every real-world surface." },
    ],
  },
 
  {
    id: "technology-and-digital-solutions",
    index: "04",
    title: "Technology & Digital Solutions",
    // short: "Website Development",
    body: "Campaigns, visual systems and creative experiences designed to create impact.",
    glyph: "2",
    lede: "Work made to be remembered, not merely seen. One message, held with discipline across every surface.",
    capabilities: [
      "Website Development",
      "E-Commerce Website Solutions",
      "Mobile App Development",
      "Custom Technology Solutions",
      "CRM & Business Management Systems",
      "Communication & Automation Solutions",
      "API & Platform Integrations",
      "Technology Support & Maintenance",
    ],
    process: [
      { step: "01", title: "Find the truth", detail: "The single honest thing worth saying about the product." },
      { step: "02", title: "Build the device", detail: "A creative mechanic that scales across channels without diluting." },
      { step: "03", title: "Produce", detail: "Art-directed execution, end to end, with quality control at every step." },
    ],
  },
  {
    id: "warehousing-fulfillment-and-operations",
    index: "05",
    title: "Warehousing, Fulfillment & Operations",
    // short: "Warehousing & Storage",
    body: "Turning ideas and opportunities into sustainable business growth.",
    glyph: "3",
    lede: "Growth that compounds instead of spikes — built on unit economics, not campaigns alone.",
    capabilities: [
      "Warehousing & Storage",
      "Inventory Management",
      "Order Processing & Fulfillment",
      "Pick, Pack & Dispatch",
      "Pan-India Logistics & Shipping",
      "Marketplace Fulfillment",
      "Vendor & Supply Chain Coordination",
      "SOP & Process Development",
      "Operational & Cost Optimization",
    ],
    process: [
      { step: "01", title: "Model", detail: "We build the maths of the business before we build the plan." },
      { step: "02", title: "Prioritise", detail: "A ranked roadmap of moves by impact, confidence and effort." },
      { step: "03", title: "Compound", detail: "Continuous experimentation with clear reporting to the board." },
    ],
  },
  {
    id: "business-support-compliance-and-corporate-solutions",
    index: "06",
    title: "Business Support, Compliance & Corporate Solutions",
    // short: "Company Registration & Business Setup",
    body: "Helping businesses modernize processes, platforms and customer experiences.",
    glyph: "9",
    lede: "Modernisation without disruption — process, platform and people moved together, in the right order.",
    capabilities: [
      "Company Registration & Business Setup",
      "GST & Compliance Support",
      "Legal & Business Compliance Coordination",
      "Documentation & Business Support",
      "Corporate Merchandise",
      "Promotional Products",
      "Corporate Gifting Solutions",
      "Exhibition & Event Support",
    ],
    process: [
      { step: "01", title: "Map", detail: "Current processes documented as they truly run, not as the manual claims." },
      { step: "02", title: "Sequence", detail: "A phased plan that delivers value in months, not years." },
      { step: "03", title: "Embed", detail: "Training, documentation and ownership so the change survives us." },
    ],
  },
  
];

export function getService(id: string) {
  return SERVICES.find((s) => s.id === id);
}


export const HOME_DISCIPLINES = [
  "Strategy",
  "Branding",
  "Digital",
  "Business Development",
  "Growth",
  "Creative Solutions",
];

export type Project = {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  category: "Books & Publishing" | "Premium Brewing Equipment & Accessories" | "Fashion & Lifestyle" | "Growth" | "Creative" | "Digital";
  client: string;
  industry: string;
  services: string[];
  year: string;
  challenge: string;
  approach: string;
  impact: string;
  results: { value: string; label: string }[];
  hue: number;
};

export const PROJECTS: Project[] = [
  {
    slug: "acharya-prashant",
    index: "01",
    title: "Acharya Prashant",
    kicker: "Building a 40,000+ Books/Month E-Commerce Business",
    category: "Books & Publishing",
    client: "Acharya Prashant",
    industry: "E-Commerce Management • Warehousing • Fulfillment • Marketplace Management",
    services: ["Brand Strategy", "Identity", "Positioning"],
    year: "2024",
    challenge:
      "Thirty years of equity, zero clarity. Meridian was known by everyone in its category and understood by no one outside it. Growth had stalled because the story had stopped moving.",
    approach:
      "• Managed end-to-end marketplace operations and listings\n• Handled inventory and stock at the warehouse\n• Managed order processing, packing and dispatch\n• Optimized product listings and marketplace presence\n• Managed marketplace promotions and sales operations\n• Continuously monitored stock, orders and product performance",
        results: [
       { value: "0 → 40,000+", label: "Books sold per month" },
  { value: "End-to-end", label: "Warehouse & fulfillment management" },
  { value: "Bestseller", label: "Multiple products achieved Bestseller tagging" },
    ],
    impact:
      "We helped transform the brand's online book business into a high-volume, scalable e-commerce operation, managing everything from inventory to marketplace operations and fulfillment.",

    hue: 0.42,
  },
  {
    slug: "brewing-gadgets-india",
    index: "02",
    title: "Brewing Gadgets India",
    kicker: "Scaling Marketplace Sales from ₹8 Lakh to ₹30 Lakh/Month",
    category: "Premium Brewing Equipment & Accessories",
    client: "Brewing Gadgets India",
    industry: "E-Commerce Management • Marketplace Management • Listing Optimization",
    services: ["Digital Experiences", "Product Design", "Build"],
    year: "2025",
    challenge:
      "Scale marketplace sales in a niche, luxury and high-ticket product category, where purchase decisions require strong product presentation, visibility and marketplace positioning.",
     approach:
      "• Managed end-to-end marketplace operations\n• Optimized product listings, content and catalog structure\n• Improved visibility and positioning of premium products\n• Managed marketplace promotions and sales activities\n• Monitored product and marketplace performance\n• Optimized marketplace listings for the client's parent company in Dubai",
        impact:
      "We helped Brewing Gadgets India scale its marketplace business through strategic marketplace management, premium product positioning and continuous listing optimization.",
    results: [
      { value: "₹8 Lakh → ₹30 Lakh+ ", label: "monthly marketplace sales in 6 months" },
      { value: "₹22 Lakh+ ", label: "additional monthly sales" },
      { value: "₹1 Crore+ ", label: "monthly sales" },
    ],
    hue: 0.55,
  },
  {
    slug: "bevaro",
    index: "03",
    title: "Bevaro",
    kicker: "Building Marketplace Recognition in a Competitive FMCG Category",
    category: "Growth",
    client: "Bevaro",
    industry: "FMCG / Beverages",
    services: ["Business Development", "Growth Strategy"],
    year: "2024",
    challenge:
      "Build strong marketplace visibility for Bevaro while competing against established brands such as Hamdard Rooh Afza in a highly competitive category",
   approach:
      "• Optimized marketplace listings and product content\n• Improved product visibility and positionin\n• Managed marketplace operations and performance\n• Focused on building sales momentum and product discoverability\n• Implemented marketplace-specific growth strategies",
        impact:
      "Helped Bevaro earn high-value marketplace recognition alongside established category leaders, strengthening product visibility, credibility and consumer trust.",
    
      results: [
      { value: "Flipkart Bestseller Tag", label: "Achieved on one of Bevaro's products." },
      { value: "Amazon's Choice", label: "Achieved on Amazon for one of its products." },
      
    ],
    hue: 0.33,
  },
  {
    slug: "blush-collection",
    index: "04",
    title: "Blush Collection",
    kicker: "Building a Business from a ₹50,000 Initial Investment",
    category: "Fashion & Lifestyle",
    client: "Blush Collection",
    industry: "Fashion & Lifestyle",
    services: ["Creative Solutions", "Campaign", "Art Direction"],
    year: "2025",
    challenge:
      "Build a scalable online business with a limited initial investment of just ₹50,000.",
    approach:
      "• Developed the initial business and e-commerce strategy\n• Guided product selection and marketplace setup\n• Managed product listings and marketplace operations\n• Optimized sales and product performance\n• Focused on sustainable, volume-driven growth",
      impact:
      "Helped transform a ₹50,000 initial investment into a high-volume online business, demonstrating how focused strategy and marketplace execution can create scalable growth with limited capital.",
    results: [
      { value: "₹50,000 Initial Investment → 100+ ", label: "Units Sold Per Day" },
      { value: "Achieved 100+ units", label: "daily sales" },
      { value: "3", label: "Awards" },
    ],
    hue: 0.62,
  },
  {
    slug: "paytm-marketplace-growth",
    index: "05",
    title: "Paytm Marketplace Growth",
    kicker: "Unlocking High-Volume Sales on an Emerging Marketplace",
    category: "Growth",
    client: "Femmecraft & Rose Collection",
    industry: "Footwear & Handbags",
    services: ["Marketplace Strategy ", "Business Development", "Campaign Management", "Sales Growth"],
    year: "2023",
    challenge:
      "Paytm was an underutilized marketplace for both brands. We identified opportunities to create significant sales through marketplace-specific strategies, offers and product optimization.",
    approach:
      "• Developed marketplace-specific sales strategies\n• Coordinated directly with Paytm for promotional opportunities\n• Leveraged cashback offers to drive customer acquisition\n• Optimized product listings and marketplace positioning\n• Identified high-potential products and sales opportunities\n• Managed marketplace growth and performance",
      
      impact:
      "Demonstrated our ability to identify, activate and scale opportunities across emerging marketplaces, not just the major platforms. From Amazon & Flipkart to emerging marketplaces like Paytm — we know how to find the opportunity and build the sales.",
    
    results: [
      { value: "Femmecraft – Footwear", label: "15,000 orders in just 3 days through a Paytm cashback-led campaign." },
      { value: "Rose Collection – Handbags", label: "0 orders in 8 months → 300+ units/day in 2 months after taking over marketplace growth." },

    ],
    hue: 0.48,
  },
  {
    slug: "blenda",
    index: "06",
    title: "Blenda",
    kicker: "Knowing When to Scale — and When to Exit",
    category: "Digital",
    client: "Blenda",
    industry: "Sugar Alternative / FMCG",
    services: ["Business Consulting", "Exit Strategy", "Inventory Recovery", "Business Closure"],
    year: "2026",
    challenge:
      "Blenda had reached a stage where continuing the business would result in further losses through ongoing rent, operational expenses and aging/expiring inventory. With the owner away in Shimla, timely action was required to minimize further losses.",
    approach:
      "•	Assessed the business situation and ongoing costs\n •	Recommended an orderly business closure instead of further investment\n •	Helped recover available funds from the business\n •	Planned the liquidation of usable inventory\n •	Reduced the risk of further losses from rent and product expiry\n •	Coordinated the closure process while the owner was away",
    impact:
      "Business consulting isn't always about growing a business. Sometimes, the right strategy is knowing when to stop — and helping the client exit with minimum possible loss.",
    results: [
      { value: "•", label: "	Recovered available funds" },
      { value: "•", label: "Avoided continued rental expenses" },
      { value: "•", label: "Share rate" },
      { value: "•", label: "Helped the owner exit the business with a structured approach" },
    ],
    hue: 0.5,
  },
  {
    slug: "saarthi-pure",
    index: "07",
    title: "Saarthi Pure",
    kicker: "Taking a New Premium Brand Directly to the Right Customers",
    category: "Growth",
    client: "Blenda",
    industry: "Premium Copper Products",
    services: ["Market Strategy", "Exhibition Planning", "B2C Sales", "B2B & Gifting Opportunities"],
    year: "2026",
    challenge:
      "Saarthi Pure wanted to reach premium customers face-to-face, but setting up a permanent retail presence in premium malls involved high rental and operating costs for a new brand.",
    approach:
      "•	Recommended premium mall exhibitions instead of permanent retail stores\n •	Identified exhibitions aligned with the target premium audience\n •	Planned and executed the exhibition presence\n •	Created direct customer interaction and product demonstration opportunities\n •	Used exhibitions to generate both B2C sales and bulk corporate/festival gifting orders",
    impact:
      "We helped Saarthi Pure reach the right audience without taking on the cost of a permanent retail store, turning exhibitions into a profitable sales and customer-acquisition channel.",
    results: [
      { value: "₹2 Lakh+ ", label: "Net Monthly Profit" },
      { value: "•", label: "Built a direct premium-customer acquisition channel" },
      { value: "•", label: "Generated strong B2C orders through exhibitions" },
      { value: "•", label: "Secured bulk gifting orders during festive seasons" },
      { value: "•", label: "Avoided the high fixed costs of a permanent premium mall store" },
      { value: "•", label: "Established a profitable growth model for the brand" },
    ],
    hue: 0.5,
  },
  {
    slug: "marketplace-fund-recovery",
    index: "08",
    title: "Marketplace Fund Recovery",
    kicker: "Recovering ₹25 Lakh+ in Unreleased Marketplace Funds",
    category: "Growth",
    client: "Realm & SKNZ",
    industry: "Fashion & Clothing",
    services: ["Account Reconciliation", "Marketplace Coordination", "Fund Recovery"],
    year: "2026",
    challenge:
      "Both brands had mismatches between their historical sales and the funds actually released by Myntra. Without proper reconciliation, these outstanding amounts risked becoming bad debts.",
    approach:
      "•	Conducted detailed account reconciliation\n •	Identified discrepancies in historical marketplace settlements\n •	Matched sales, payments and outstanding amounts\n •	Coordinated with Myntra's Reconciliation and GST teams\n •	Followed up on discrepancies until resolution\n  • Supported recovery of pending marketplace funds",
    impact:
      "Our reconciliation and recovery process helped Realm and SKNZ recover ₹25 lakh+ in pending Myntra funds, converting a potential financial loss into recovered working capital.",
    results: [
      { value: "₹25 Lakh+  ", label: "Funds Recovered" },
      { value: "Realm", label: "₹20 Lakh recovered" },
      { value: "SKNZ", label: "₹5 Lakh recovered" },
      { value: "•", label: "Resolved historical settlement discrepancies" },
      { value: "•", label: "Prevented potentially unrecoverable funds from becoming bad debts" },
     
    ],
    hue: 0.5,
  },
];

export const CATEGORIES = [
  "All",
  "Branding",
  "Digital",
  "Strategy",
  "Growth",
  "Creative",
] as const;

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export function nextProject(slug: string): Project {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length] ?? PROJECTS[0]!;
}
