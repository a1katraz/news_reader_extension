const tabs = await chrome.tabs.query({
    url: [
      "https://*/*"
    ]
  });

const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));
  
const template = document.getElementById("li_template");
const elements = new Set();

for (const tab of tabs) {
    const element = template.content.firstElementChild.cloneNode(true);
  
    //const title = tab.title.split("-")[0].trim();
    //const pathname = new URL(tab.url).pathname.slice("/docs".length);
  
    const title = tab.title;
    const pathname = tab.url;

    element.querySelector(".title").textContent = title;
    element.querySelector(".pathname").textContent = pathname;
    element.querySelector("a").addEventListener("click", async () => {
      // need to focus window as well as the active tab
      await chrome.tabs.update(tab.id, { active: true });
      await chrome.windows.update(tab.windowId, { focused: true });
    });
  
    elements.add(element);
  }

document.querySelector("ul").append(...elements);

const button = document.querySelector("button");
button.addEventListener("click", async () => {
  let idx = 1;
  let tab_names = "";
  for (const tab of tabs){
    tab_names +=  idx + ": " + tab.url + "\r\n";
    //console.log(idx + ": " +tab.url);
    idx += 1;
  }
  
  const fileHandle = await window.showSaveFilePicker();
  writeFile(fileHandle, tab_names);

  const message = document.getElementById("successMessage");
  message.textContent = "Tabs addresses written to file.";

  //const tabIds = tabs.map(({ id }) => id);
  //if (tabIds.length) {
  //  const group = await chrome.tabs.group({ tabIds });
  //  await chrome.tabGroups.update(group, { title: "DOCS" });
  //}
});

async function writeFile(fileHandle, content) {
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}