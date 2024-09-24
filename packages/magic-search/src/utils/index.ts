import { MagicSearchConfiguration } from "./types";

export const getClassOverride = (
  id: string,
  configuration: MagicSearchConfiguration,
): string => {
  return configuration?.classes?.[id] || "";
};

export const fetcher = async (path: string, key: string, body: object) =>
  fetch(`https://pre-api.tollbit.com${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      TollbitPublicKey: key,
    },
    body: JSON.stringify(body),
  });
