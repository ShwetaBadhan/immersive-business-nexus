import businessDevelopment from "@/assets/service-business-development.jpg";
import brandStrategy from "@/assets/service-brand-strategy.jpg";
import digitalExperiences from "@/assets/service-digital-experiences.jpg";
import creativeSolutions from "@/assets/service-creative-solutions.jpg";
import growthStrategy from "@/assets/service-growth-strategy.jpg";
import ecommerce from "@/assets/service-growth-strategy.jpg";
import digitalTransformation from "@/assets/service-digital-transformation.jpg";
import digitalresearch from "@/assets/service-digital-transformation.jpg";

export const SERVICE_IMAGES: Record<string, string> = {
  "business-research-and-growth-strategy": digitalresearch,
  "e-commerce-and-marketplace-growth": brandStrategy,
  "warehousing-fulfillment-and-logistics": digitalExperiences,
  "branding-creative-and-content": creativeSolutions,
  "digital-marketing-and-social-growth": growthStrategy,
  "technology-and-digital-solutions": digitalTransformation,
  "pr-sponsorship-and-business-communications": digitalTransformation,
  "business-setup-legal-and-compliance": ecommerce,
  "corporate-merchandise-and-promotional-solutions": businessDevelopment,
};
