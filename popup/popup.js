chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === "content" && message.type === "parsed-page") {
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

    document.querySelector("ul").innerHTML = "";
    document.querySelector("ul").append(...elements);
  }
});
