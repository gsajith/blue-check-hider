const queryOptions = { active: true, lastFocusedWindow: true };
const [activeTab] = await chrome.tabs.query(queryOptions);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    message.from === "content" &&
    message.type === "parsed-page" &&
    sender.tab.id === activeTab.id
  ) {
    const collator = new Intl.Collator();
    var names = message.data.names;
    names.sort((a, b) => collator.compare(a.title, b.title));

    const template = document.getElementById("li_template");
    const elements = new Set();

    for (const name of names) {
      const element = template.content.firstElementChild.cloneNode(true);
      const username = name;
      element.querySelector(".username").textContent = username;
      elements.add(element);
    }

    document.querySelector("#current_list").innerHTML = "";
    document.querySelector("#current_list").append(...elements);

    chrome.storage.local.get("storedBlueCheckNames").then((storedNames) => {
      if (storedNames.storedBlueCheckNames) {
        const elements = new Set();
        for (const name of [...storedNames.storedBlueCheckNames]) {
          const element = template.content.firstElementChild.cloneNode(true);
          const username = name;
          element.querySelector(".username").textContent = username;
          elements.add(element);
        }
        document.querySelector("#all_names").innerHTML = "";
        document.querySelector("#all_names").append(...elements);
      }
    });
  }
});
