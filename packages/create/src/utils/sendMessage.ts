export const sendMessage = (message: string) => {
  if (typeof window === "undefined") return;
  window.parent.postMessage({ type: "prompt", message }, "*");
};
