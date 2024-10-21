import { MagicSearchConfiguration } from "./types";
import { extendTailwindMerge } from "tailwind-merge";

export const getClassOverride = (
  id: string,
  configuration: MagicSearchConfiguration,
): string => {
  return configuration?.classes?.[id] || "";
};

export const fetcher = async (path: string, key: string, body: object) =>
  fetch(`https://api.tollbit.com${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      TollbitPublicKey: key,
    },
    body: JSON.stringify(body),
  });

export const twMerge = extendTailwindMerge({
  prefix: "tb-",
});
