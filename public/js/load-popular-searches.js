const popularGrid = document.querySelector(".grid-wrapper-popular-searches");

let pObject = [ 
  {
    "img": "images/mechanic.jpg",
    "h3" : "Mechanics",
    "value" : "mechanics"
  },
  {
    "img": "images/caterers.jpg",
    "h3" : "Caterers",
    "value" : "caterers"
  },
  {
    "img": "images/movers.jpg",
    "h3" : "Movers",
    "value" : "movers"
  },
  {
    "img": "images/painters.jpg",
    "h3" : "Painters",
    "value" : "painters"
  },
  {
    "img": "images/web_developers.jpg",
    "h3" : "Web Developers",
    "value" : "web developers"
  },
  {
    "img": "images/cleaners.jpg",
    "h3" : "Cleaners",
    "value" : "cleaners"
  },
  {
    "img": "images/dj.jpg",
    "h3" : "Disc Jockeys",
    "value" : "disc jokeys"
  },
  {
    "img": "images/plumbers.jpg",
    "h3" : "Plumbers",
    "value" : "plumbers"
  },
  {
    "img": "images/security.jpg",
    "h3" : "Security",
    "value" : "security"
  },
  {
    "img": "images/electricians.jpg",
    "h3" : "Electricians",
    "value" : "electricians"
  },
  {
    "img": "images/photographers.jpg",
    "h3" : "Photographers",
    "value" : "photographers"
  },
  {
    "img": "images/masseuse.jpg",
    "h3" : "Masseuses",
    "value" : "Masseuses"
  }
].sort( () => Math.random() - 0.5);

pObject = Object.keys(pObject).slice(0, 6).reduce((result, key) => {
                    result[key] = pObject[key];
                    return result;
                }, {});


window.addEventListener("load", initializePopularSearch());

function initializePopularSearch(){
  let professions = "";
  for(let profession in pObject){
    professions += `<form action="/auth/find-professionals" method="POST" class="my-form">
                      <input type="hidden" name="profession" value="${pObject[profession].value}">
                      <input type="hidden" name="location" class="my-location">
                      <div class="popular-box-img">
                        <img data-src="${pObject[profession].img}" class="lazy" width="100%">
                      </div>
                      <div class="popular-box-info flex-column-gap-10">
                        <h3>${pObject[profession].h3}</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero laboriosam blanditiis quia</p>
                        <span class="border"></span>
                      </div>
                      <div class="popular-box-user"></div>
                      <button>Search</button>
                    </form>`
  }
  popularGrid.innerHTML = professions;
}