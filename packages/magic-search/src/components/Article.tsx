import { ARTICLE_TITLE_ID } from "../utils/constants";
import { getClassOverride, twMerge } from "../utils";
import { useTracker } from "../context/TrackerProvider";
import { useConfiguration } from "../context/ConfigurationProvider";

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
  const tracker = useTracker();
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
  // If time difference is not a number, dont show time since published
  if (Number.isNaN(timeDifference)) {
    timeSincePublished = "";
  } else if (timeDifference < millisecondsInHour) {
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
      className="tb-border-b last:tb-border-0 tb-border-solid tb-border-gray-400 tb-pb-4"
      href={url}
      onClick={() => tracker.trackEvent("article_clicked", { url, title })}
    >
      <h3
        className={twMerge(
          `tb-underline tb-block tb-mb-2 tb-font-semibold tb-text-lg ${getClassOverride(ARTICLE_TITLE_ID, configuration)}`,
        )}
      >
        {title}
      </h3>
      <p className="tb-text-sm">
        {host}
        {timeSincePublished ? `, ${timeSincePublished}` : ""}
        {author ? `, ${author}` : ""}
      </p>
    </a>
  );
};

export default Article;
