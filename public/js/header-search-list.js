const headerSearch = document.querySelector("#header-search"),
headerMatchList = document.querySelector("#header-match-list");

// Search professions.json and filter it
const searchHeaderProfessions = async searchText => {
  const res = await fetch("/data/professions.json");
  const professions = await res.json();

  headerMatchList.style.display = "block";

  // Get matches to current text input
  let matches = professions.filter(profession => {
    const regex = new RegExp(`^${searchText}`, "gi");
    return profession.name.match(regex);
  });

  if (searchText.length === 0) {
    matches = [];
    headerMatchList.innerHTML = "";
    headerMatchList.style.display = "none";
  }

  outputHeaderHtml(matches);
}

// Show results in HTML
const outputHeaderHtml = matches => {
    if (matches.length > 0) {
    const html = matches.map(match => `
    <div class="name" onclick="setHeaderSearchValue('${match.name}')">
      <p>${match.name}</p>
    </div>
  `).join("");

    headerMatchList.innerHTML = html;
  }
}

const setHeaderSearchValue = name => {
  headerSearch.value = name;
  headerMatchList.style.display = "none";
}

headerSearch.addEventListener("input", () => searchHeaderProfessions(headerSearch.value))


window.addEventListener('click', function (e) {
  if (!document.querySelector("#header-search").contains(e.target)) {
   headerMatchList.style.display = "none";
  } 
});