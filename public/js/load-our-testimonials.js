const testimonialsGrid = document.querySelector(".grid-wrapper-testimonials-searches");

let tObject = [ 
  {
    "img": "images/landscaper.jpg",
    "name" : "Earl Stevens",
    "profession" : "Landscaper",
    "userId" : "2"
  },
  {
    "img": "images/tutor.jpg",
    "name" : "Madison Lee",
    "profession" : "Tutor",
    "userId" : "3"
  },
  {
    "img": "images/disc_jockey.jpg",
    "name" : "Anthony Carter",
    "profession" : "Disc Jockey",
    "userId" : "4"
  },
  {
    "img": "images/pt.jpg",
    "name" : "Jason Corsa",
    "profession" : "Personal Trainer",
    "userId" : "5"
  }
].sort( () => Math.random() - 0.5);

tObject = Object.keys(tObject).slice(0, 3).reduce((result, key) => {
                    result[key] = tObject[key];
                    return result;
                }, {});


window.addEventListener("load", initializeTestimonials());

function initializeTestimonials(){
  let testimonials = "";
  for(let testimonial in tObject){
    testimonials += `<div class="my-form">
                      <div class="testimonials-box-img">
                        <img data-src="${tObject[testimonial].img}" class="lazy" width="100%">
                      </div>
                      <div class="testimonials-box-info flex-column-gap-10">
                        <div >
                          <h3>${tObject[testimonial].name}</h3>
                          <p>${tObject[testimonial].profession}</p>
                        </div>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, rerum?</p>
                        <span class="border"></span>
                      </div>
                      <div class="testimonials-box-user">
                      <a href="http://needa.online/search-results-user-profile/${tObject[testimonial].userId}"><button>View User</button></a>
                        <div class="flex-row-gap-20">
                          <i class="fa-solid fa-phone-flip"></i>
                          <i class="fa-solid fa-envelope"></i>
                        </div>
                      </div>
                    </div>`;
  }
  testimonialsGrid.innerHTML = testimonials;
}