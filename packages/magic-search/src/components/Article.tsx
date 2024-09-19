import React from "react";
import { ARTICLE_TITLE_ID } from "../utils/constants";
import { useClassOverride } from "../utils";
import { useConfiguration } from "../context/ConfigurationProvider";
import { twMerge } from "tailwind-merge";

const Article = ({
  title,
  publishedDate,
  author,
  url,
}: {
  title: string;
  publishedDate: string;
  author: string;
  url: string;
}) => {
  const configuration = useConfiguration();
  // Get the domain from the URL
  const urlObject = new URL(url);
  const host = urlObject.host.replace("www.", "");

  // Calculate the time since the article was published
  const articleDate = new Date(publishedDate);
  const dateNow = new Date();
  // @ts-expect-error
  const timeDifference = dateNow - articleDate;

  const millisecondsInHour = 1000 * 60 * 60;
  const millisecondsInDay = millisecondsInHour * 24;
  const millisecondsInWeek = millisecondsInDay * 7;
  const millisecondsInMonth = millisecondsInDay * 30;
  const millisecondsInYear = millisecondsInDay * 365;

  let timeSincePublished;
  if (timeDifference < millisecondsInHour) {
    timeSincePublished = "less than an hour ago";
  } else if (timeDifference < millisecondsInDay) {
    const hours = Math.floor(timeDifference / millisecondsInHour);
    timeSincePublished = `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (timeDifference < millisecondsInWeek) {
    const days = Math.floor(timeDifference / millisecondsInDay);
    timeSincePublished = `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (timeDifference < millisecondsInMonth) {
    const weeks = Math.floor(timeDifference / millisecondsInWeek);
    timeSincePublished = `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (timeDifference < millisecondsInYear) {
    const months = Math.floor(timeDifference / millisecondsInMonth);
    timeSincePublished = `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(timeDifference / millisecondsInYear);
    timeSincePublished = `${years} year${years > 1 ? "s" : ""} ago`;
  }

  return (
    <a
      className="border-b-px border-solid border-gray-400 pt-0 px-1 pb-2"
      href={url}
    >
      <h3
        className={twMerge(
          `underline block mb-1 font-semibold ${useClassOverride(ARTICLE_TITLE_ID)}`,
        )}
      >
        {title}
      </h3>
      <p className="text-sm">
        {host}, {timeSincePublished}, {author || "Unknown Author"}
      </p>
    </a>
  );
};

export default Article;
