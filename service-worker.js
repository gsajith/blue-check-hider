const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";

chrome.runtime.onInstalled.addListener(() => {
  console.log("intsalled");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === "content" && message.type === "parsed-page") {
    console.log(message.data);
  }
});
