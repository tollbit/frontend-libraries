function resizeListener(event: any) {
  var matches = document.querySelectorAll("iframe"); // iterate through all iFrames on page
  for (let i = 0; i < matches.length; i++) {
    if (
      matches?.[i]?.contentWindow == event.source &&
      typeof matches?.[i]?.style !== "undefined"
    ) {
      (matches[i] as HTMLIFrameElement).style.height = `${event.data.height}px`;
      return 1;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("message", resizeListener, false);
});
