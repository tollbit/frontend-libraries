export interface MarketplaceCardProps {
  theme?: "light" | "dark";
  title: string;
  logo: string;
  domain: string;
  subtitle: string;
  url: string;
  chips: string[];
  className?: string;
}
