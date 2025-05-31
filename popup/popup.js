const template = document.getElementById("li_template");
const elements = new Set();

const Marketsbutton = document.getElementById("Markets");
const Moneybutton = document.getElementById("Money");
const Recosbutton = document.getElementById("Recos");

const message = document.getElementById("statusMessage");

Marketsbutton.addEventListener("click", openRssLink.bind(null, 'https://www.livemint.com/rss/markets'));  
Moneybutton.addEventListener('click', openRssLink.bind(null, 'https://www.livemint.com/rss/money'));
Recosbutton.addEventListener('click', cleanRecommendations.bind(null));

function openRssLink(url) { 
    if (elements.size > 0) {
        document.querySelector("ul").innerHTML = ''; // Clear previous elements
        elements.clear(); // Clear the Set to avoid duplicates
    }

    message.textContent = "Loading..."; // Show loading message

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(xmlText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
      const items = xmlDoc.getElementsByTagName('item');
      
      for (let i = 0; i < items.length; i++) {
          const title = items[i].getElementsByTagName('title')[0].textContent;
          const link = items[i].getElementsByTagName('link')[0].textContent;
          //console.log(title, link);
          
          const element = template.content.firstElementChild.cloneNode(true);
          element.querySelector(".title").textContent = title;
          element.querySelector(".pathname").textContent = link;
          
          elements.add(element);
        }

      message.textContent = "";
      document.querySelector("ul").append(...elements);
      })
      .catch(error => {
            console.error('Error fetching or parsing RSS feed:', error);
      });
}

function cleanRecommendations(url) {
    if (elements.size > 0) {
        document.querySelector("ul").innerHTML = ''; // Clear previous elements
        elements.clear(); // Clear the Set to avoid duplicates
        message.textContent = "Getting Recommendation Links"; // Show loading message
        //Making it intelligent here is too tough.
        // Now I need to setupo Firebase or npm.
        return;
    }
    else {  
        message.textContent = "No Recommendations to clean"; // Show no recommendations message
        return;
    }    
}