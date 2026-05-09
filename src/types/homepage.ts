export interface HomepageContentItem {
  id: number;
  section: string;
  key: string;
  value: string | null;
  type: 'text' | 'image' | 'json';
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NavLink { label: string; href: string }
export interface StatItem { num: string; suffix: string; label: string }
export interface StepItem { num: string; title: string; desc: string }
export interface FeatureItem { title: string; desc: string; color: string }
export interface FaqItem { q: string; a: string }
export interface DayStepItem { id: string; time: string; title: string; desc: string }

export interface NavbarContent {
  logo_text?: string;
  login_label?: string;
  login_href?: string;
  cta_label?: string;
  cta_href?: string;
  links?: NavLink[];
}

export interface HeroContent {
  label?: string;
  heading?: string;
  subheading?: string;
  button_primary_label?: string;
  button_primary_href?: string;
  button_secondary_label?: string;
  button_secondary_href?: string;
  image_url?: string;
  image_alt?: string;
}

export interface TrustStatsContent {
  label?: string;
  items?: StatItem[];
}

export interface HowItWorksContent {
  heading?: string;
  subheading?: string;
  steps?: StepItem[];
}

export interface FeaturesContent {
  heading?: string;
  items?: FeatureItem[];
}

export interface DayInTripContent {
  heading?: string;
  subheading?: string;
  steps?: DayStepItem[];
}

export interface FaqContent {
  heading?: string;
  items?: FaqItem[];
}

export interface CtaSectionContent {
  heading?: string;
  subtitle?: string;
  button_label?: string;
  button_href?: string;
}

export interface FooterContent {
  logo_text?: string;
  tagline?: string;
  nav_links?: NavLink[];
  legal_links?: NavLink[];
}

export interface HomepageContentMap {
  navbar?: NavbarContent;
  hero?: HeroContent;
  trust_stats?: TrustStatsContent;
  how_it_works?: HowItWorksContent;
  features?: FeaturesContent;
  day_in_trip?: DayInTripContent;
  faq?: FaqContent;
  cta_section?: CtaSectionContent;
  footer?: FooterContent;
}
