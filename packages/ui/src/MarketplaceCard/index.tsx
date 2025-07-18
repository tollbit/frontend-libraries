import { MarketplaceCardProps } from "./types";
import { cn } from "../utils";
import Heading from "../Heading";

export default function MarketplaceCard({
  title,
  logo,
  subtitle,
  fallbackLogo = "https://tollbit.com/icons/apple-touch-icon.png",
  url,
  chips,
  className,
  theme = "light",
}: MarketplaceCardProps) {
  const isDark = theme === "dark";

  return (
    <a
      href={url}
      className={cn(
        "block",
        // Keep current light mode styles unchanged
        !isDark && "rounded-2xl bg-white hover:bg-background-active",
        // Dark mode: bg-card and white text
        isDark && "bg-card text-white border hover:bg-dev-background-tertiary",
        className,
      )}
    >
      <div className=" p-6 h-[280px] flex flex-col justify-between">
        <div className="flex justify-between gap-6">
          <img
            src={logo}
            alt={title}
            className="w-8 h-8"
            onError={(e) => {
              if (fallbackLogo) {
                e.currentTarget.src = fallbackLogo;
              }
            }}
          />
          <div className="flex flex-row flex-wrap justify-end gap-1">
            {chips.map((chip) => (
              <div
                key={chip}
                className={cn(
                  "px-4 py-2 border font-bold rounded-full text-xs",
                  !isDark && "border-muted text-muted",
                  isDark && "border-dev-secondary text-dev-secondary",
                )}
              >
                {chip}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Heading is="h4">{title}</Heading>
          <p
            className={cn(
              "text-sm pt-2",
              !isDark && "text-secondary",
              isDark && "text-dev-secondary",
            )}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </a>
  );
}
