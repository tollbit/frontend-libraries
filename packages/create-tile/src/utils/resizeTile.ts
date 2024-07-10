var iframeDimensionsOld = { height: 0 };
var resizeObserver: any;

function setupResizeObserver(el: any) {
  if (!resizeObserver) {
    resizeObserver = new ResizeObserver(() => sendDimensionsToParent(el));
  }
  resizeObserver.observe(el);
}

function getHeight(el: any) {
  const style = window.getComputedStyle(el);

  const paddingTop = parseInt(style.paddingTop);
  const paddingBottom = parseInt(style.paddingBottom);

  return el.offsetHeight + 16 + paddingTop + paddingBottom;
}

// send the latest page dimensions to the parent page on which this iframe is embedded
function sendDimensionsToParent(el: any) {
  const height = getHeight(el);

  var iframeDimensionsNew = {
    height,
  };

  if (iframeDimensionsNew.height != iframeDimensionsOld.height) {
    // if old width is not equal new width, or old height is not equal new height, then...
    window.parent.postMessage(iframeDimensionsNew, "*");
    iframeDimensionsOld = iframeDimensionsNew;
  }
}

const init = (el: any) => {
  iframeDimensionsOld = {
    height: getHeight(el),
  };
  window.parent.postMessage(iframeDimensionsOld, "*"); //send our dimensions once, initially - so the iFrame is initialized to the correct size

  if (window.MutationObserver) {
    var observer = new MutationObserver(() => sendDimensionsToParent(el));
    const config = {
      attributes: false,
      attributeOldValue: false,
      characterData: false,
      characterDataOldValue: false,
      childList: true,
      subtree: true,
    };

    observer.observe(el, config);
  }

  setupResizeObserver(el);
};

export default init;
