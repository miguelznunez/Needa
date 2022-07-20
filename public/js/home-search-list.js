const homeSearch = document.querySelector("#home-search"),
homeMatchList = document.querySelector("#home-match-list");

// Search professions.json and filter it
const searchHomeProfessions = async searchText => {
  const res = await fetch("/data/professions.json");
  const professions = await res.json();

  homeMatchList.style.display = "block";

  // Get matches to current text input
  let matches = professions.filter(profession => {
    const regex = new RegExp(`^${searchText}`, "gi");
    return profession.name.match(regex);
  });

  if (searchText.length === 0) {
    matches = [];
    homeMatchList.innerHTML = "";
    homeMatchList.style.display = "none";
  }

  outputHomeHtml(matches);
}

// Show results in HTML
const outputHomeHtml = matches => {
    if (matches.length > 0) {
    const html = matches.map(match => `
    <div class="name" onclick="setHomeSearchValue('${match.name}')">
      <p>${match.name}</p>
    </div>
  `).join("");

    homeMatchList.innerHTML = html;
  }
}

const setHomeSearchValue = name => {
  homeSearch.value = name;
  homeMatchList.style.display = "none";
}

homeSearch.addEventListener("input", () => searchHomeProfessions(homeSearch.value))


window.addEventListener('click', function (e) {
  if (!document.querySelector("#home-search").contains(e.target)) {
   homeMatchList.style.display = "none";
  } 
});