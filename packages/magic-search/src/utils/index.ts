import { MagicSearchConfiguration } from "./types";
import { extendTailwindMerge } from "tailwind-merge";

export const getClassOverride = (
  id: string,
  configuration: MagicSearchConfiguration,
): string => {
  return configuration?.classes?.[id] || "";
};

export const fetcher = async ({
  path,
  key,
  body,
  host = "https://api.tollbit.com",
}: {
  path: string;
  key: string;
  body: object;
  host?: string;
}) =>
  fetch(`${host}${path}`, {
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
