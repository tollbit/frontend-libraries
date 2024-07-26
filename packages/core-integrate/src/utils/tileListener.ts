// Listens to messages that can be passed from a tile to communicate a new prompt to the ai model
export const createListener =
  (callback: (_message: string) => void) => (event: MessageEvent) => {
    if (event.data.type === "prompt") {
      callback(event.data.message);
    }
  };

export const listenForTileMessages = (
  listener: (_event: MessageEvent) => void,
) => {
  if (typeof window === "undefined") return;

  window.addEventListener("message", listener);
};

export const cleanUpTileListener = (
  listener: (_event: MessageEvent) => void,
) => {
  if (typeof window === "undefined") return;

  window.removeEventListener("message", listener);
};
