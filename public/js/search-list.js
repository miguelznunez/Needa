const search = document.querySelector("#search");
  const matchList = document.querySelector("#match-list");

  // Search professions.json and filter it
  const searchProfessions = async searchText => {
    const res = await fetch("/data/professions.json");
    const professions = await res.json();

    matchList.style.display = "block";

    // Get matches to current text input
    let matches = professions.filter(profession => {
      const regex = new RegExp(`^${searchText}`, "gi");
      return profession.name.match(regex);
    });

    if (searchText.length === 0) {
      matches = [];
      matchList.innerHTML = "";
      matchList.style.display = "none";
    }

    outputHtml(matches);
  }

  // Show results in HTML
  const outputHtml = matches => {
      if (matches.length > 0) {
      const html = matches.map(match => `
      <div class="name" onclick="setSearchValue('${match.name}')">
        <p>${match.name}</p>
      </div>
    `).join("");

      matchList.innerHTML = html;
    }
  }

  const setSearchValue = name => {
    search.value = name;
    matchList.style.display = "none";
  }

  search.addEventListener("input", () => searchProfessions(search.value))


  window.addEventListener('click', function (e) {
    if (!document.querySelector("#needa-search").contains(e.target)) {
      matchList.style.display = "none";
    } 
  });