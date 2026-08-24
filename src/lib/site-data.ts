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
    id: "business-development",
    index: "01",
    title: "Business Development",
    short: "Opportunities, partnerships, pathways.",
    body: "Helping businesses identify opportunities, partnerships and growth pathways.",
    glyph: "2",
    lede: "We find the routes to revenue that already exist inside your business — then build the structure to walk them.",
    capabilities: [
      "Market and opportunity mapping",
      "Partnership and channel development",
      "Commercial model design",
      "Pipeline and forecasting systems",
      "Sales enablement",
    ],
    process: [
      { step: "01", title: "Diagnose", detail: "We audit demand, pricing and pipeline to see where value actually leaks." },
      { step: "02", title: "Design", detail: "Offers, partners and commercial models are shaped around real willingness to pay." },
      { step: "03", title: "Deploy", detail: "We build the operating rhythm — targets, materials, reporting — and hand it over working." },
    ],
  },
  {
    id: "brand-strategy",
    index: "02",
    title: "Brand Strategy",
    short: "Distinctive identity and positioning.",
    body: "Building distinctive brand identities and positioning.",
    glyph: "3",
    lede: "A brand is a decision, not a decoration. We make the decision clear and make it look inevitable.",
    capabilities: [
      "Positioning and narrative",
      "Naming and verbal identity",
      "Visual identity systems",
      "Brand architecture",
      "Guidelines and rollout",
    ],
    process: [
      { step: "01", title: "Listen", detail: "Interviews, category study and evidence gathering before a single word is written." },
      { step: "02", title: "Define", detail: "One territory, one idea, one sentence the whole business can repeat." },
      { step: "03", title: "Build", detail: "A modular identity and system designed to survive every real-world surface." },
    ],
  },
  {
    id: "digital-experiences",
    index: "03",
    title: "Digital Experiences",
    short: "Platforms that connect.",
    body: "Creating modern websites and digital platforms that connect businesses with their audiences.",
    glyph: "9",
    lede: "Websites and platforms designed around perceived speed, clarity and craft — not template convenience.",
    capabilities: [
      "Product and UX design",
      "Design systems",
      "Web and platform engineering",
      "Motion and interaction design",
      "Performance and accessibility",
    ],
    process: [
      { step: "01", title: "Frame", detail: "We define the one job the experience must do and cut everything else." },
      { step: "02", title: "Prototype", detail: "Interfaces are tested in motion, not in static mockups." },
      { step: "03", title: "Ship", detail: "Built, measured and refined against real usage after launch." },
    ],
  },
  {
    id: "creative-solutions",
    index: "04",
    title: "Creative Solutions",
    short: "Campaigns and visual systems.",
    body: "Campaigns, visual systems and creative experiences designed to create impact.",
    glyph: "2",
    lede: "Work made to be remembered, not merely seen. One message, held with discipline across every surface.",
    capabilities: [
      "Campaign concepting",
      "Art direction",
      "Film and photography",
      "Content systems",
      "Packaging and retail",
    ],
    process: [
      { step: "01", title: "Find the truth", detail: "The single honest thing worth saying about the product." },
      { step: "02", title: "Build the device", detail: "A creative mechanic that scales across channels without diluting." },
      { step: "03", title: "Produce", detail: "Art-directed execution, end to end, with quality control at every step." },
    ],
  },
  {
    id: "growth-strategy",
    index: "05",
    title: "Growth Strategy",
    short: "Ideas into sustainable growth.",
    body: "Turning ideas and opportunities into sustainable business growth.",
    glyph: "3",
    lede: "Growth that compounds instead of spikes — built on unit economics, not campaigns alone.",
    capabilities: [
      "Growth modelling",
      "Pricing and packaging",
      "Acquisition and retention design",
      "Analytics and measurement",
      "Experiment roadmaps",
    ],
    process: [
      { step: "01", title: "Model", detail: "We build the maths of the business before we build the plan." },
      { step: "02", title: "Prioritise", detail: "A ranked roadmap of moves by impact, confidence and effort." },
      { step: "03", title: "Compound", detail: "Continuous experimentation with clear reporting to the board." },
    ],
  },
  {
    id: "digital-transformation",
    index: "06",
    title: "Digital Transformation",
    short: "Modern processes and platforms.",
    body: "Helping businesses modernize processes, platforms and customer experiences.",
    glyph: "9",
    lede: "Modernisation without disruption — process, platform and people moved together, in the right order.",
    capabilities: [
      "Process and systems audit",
      "Platform selection and architecture",
      "Automation and integration",
      "Data foundations",
      "Change enablement",
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
  category: "Branding" | "Digital" | "Strategy" | "Growth" | "Creative";
  client: string;
  industry: string;
  services: string[];
  year: string;
  challenge: string;
  approach: string;
  solution: string;
  results: { value: string; label: string }[];
  hue: number;
};

export const PROJECTS: Project[] = [
  {
    slug: "brand-transformation",
    index: "01",
    title: "Brand Transformation",
    kicker: "A legacy manufacturer, rebuilt for a new market",
    category: "Branding",
    client: "Meridian Industries",
    industry: "Manufacturing",
    services: ["Brand Strategy", "Identity", "Positioning"],
    year: "2024",
    challenge:
      "Thirty years of equity, zero clarity. Meridian was known by everyone in its category and understood by no one outside it. Growth had stalled because the story had stopped moving.",
    approach:
      "We rebuilt from the inside out — interviews across four plants, a positioning territory grounded in precision rather than heritage, and a visual system that could survive on a factory floor and in a boardroom deck.",
    solution:
      "A single-idea brand platform, a modular identity built on a numeric grid, and a rollout playbook that let 11 regional teams move at once without diluting the centre.",
    results: [
      { value: "+41%", label: "Qualified inbound" },
      { value: "2.6×", label: "Brand recall" },
      { value: "11", label: "Markets aligned" },
    ],
    hue: 0.42,
  },
  {
    slug: "digital-experience",
    index: "02",
    title: "Digital Experience",
    kicker: "A commerce platform that behaves like a showroom",
    category: "Digital",
    client: "Aureal Living",
    industry: "Retail / Interiors",
    services: ["Digital Experiences", "Product Design", "Build"],
    year: "2025",
    challenge:
      "A beautiful catalogue trapped inside a hostile checkout. Visitors browsed for minutes and left in seconds.",
    approach:
      "We treated the site as spatial rather than tabular — configuration first, catalogue second — and rebuilt the front end around perceived speed instead of raw page weight.",
    solution:
      "A real-time configurator, a rendered room preview, and a three-step checkout that removed 60% of the original fields.",
    results: [
      { value: "+68%", label: "Conversion" },
      { value: "-52%", label: "Bounce" },
      { value: "1.1s", label: "LCP" },
    ],
    hue: 0.55,
  },
  {
    slug: "business-growth",
    index: "03",
    title: "Business Growth",
    kicker: "Turning one product line into four revenue engines",
    category: "Growth",
    client: "Northbay Logistics",
    industry: "Logistics",
    services: ["Business Development", "Growth Strategy"],
    year: "2024",
    challenge:
      "One customer segment produced 80% of revenue. Every quarter was a negotiation with a single buyer.",
    approach:
      "We mapped adjacent demand, priced three new offers against real willingness-to-pay, and built a partner channel before building a sales team.",
    solution:
      "Four productised service lines, a partner programme with 19 signed operators, and a pipeline model the board could actually forecast against.",
    results: [
      { value: "4", label: "Revenue lines" },
      { value: "+37%", label: "ARR" },
      { value: "19", label: "Partners" },
    ],
    hue: 0.33,
  },
  {
    slug: "creative-strategy",
    index: "04",
    title: "Creative Strategy",
    kicker: "A campaign built to be remembered, not just seen",
    category: "Creative",
    client: "Solen Foods",
    industry: "FMCG",
    services: ["Creative Solutions", "Campaign", "Art Direction"],
    year: "2025",
    challenge:
      "A crowded shelf, a modest budget, and a category where everyone shouted the same three words.",
    approach:
      "We found the one true thing the product did differently and refused to say anything else. Single message, six surfaces, zero compromise.",
    solution:
      "An art-directed campaign system spanning film, print, packaging and retail, held together by a typographic device rather than a logo lockup.",
    results: [
      { value: "8.4M", label: "Organic reach" },
      { value: "+29%", label: "Sell-through" },
      { value: "3", label: "Awards" },
    ],
    hue: 0.62,
  },
  {
    slug: "market-repositioning",
    index: "05",
    title: "Market Repositioning",
    kicker: "From vendor to advisor in eighteen months",
    category: "Strategy",
    client: "Kaveri Systems",
    industry: "B2B Software",
    services: ["Brand Strategy", "Growth Strategy"],
    year: "2023",
    challenge:
      "Priced as a tool, sold as a tool, replaced like a tool. Kaveri needed to move up the value chain or race to the bottom.",
    approach:
      "We rewrote the offer before the messaging — repackaging implementation expertise as the headline product and the software as the delivery mechanism.",
    solution:
      "A three-tier advisory model, a new commercial narrative, and enablement that got 40 sellers speaking the same language.",
    results: [
      { value: "2.2×", label: "Deal size" },
      { value: "-18%", label: "Churn" },
      { value: "40", label: "Sellers enabled" },
    ],
    hue: 0.48,
  },
  {
    slug: "immersive-launch",
    index: "06",
    title: "Immersive Launch",
    kicker: "A product reveal that existed only in motion",
    category: "Digital",
    client: "Vireo Mobility",
    industry: "Mobility",
    services: ["Digital Experiences", "Creative Solutions"],
    year: "2026",
    challenge:
      "A category-defining product with no photographs, no reviews and a launch date that would not move.",
    approach:
      "If the object could not be shown, the idea would be. We built the launch as a real-time environment where the product was implied by light, mass and movement.",
    solution:
      "A WebGL reveal experience, a synchronised press environment, and a waitlist mechanic that turned scarcity into narrative.",
    results: [
      { value: "112k", label: "Waitlist" },
      { value: "4:12", label: "Avg. session" },
      { value: "+94%", label: "Share rate" },
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
