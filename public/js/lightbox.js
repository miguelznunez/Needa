//getting all required elements
const gallery  = document.querySelectorAll(".image"),
previewBox = document.querySelector(".preview-box"),
previewImg = previewBox.querySelector("img"),
closeIcon = previewBox.querySelector(".icon"),
currentImg = previewBox.querySelector(".current-img"),
totalImg = previewBox.querySelector(".total-img"),
shadow = document.querySelector(".shadow");


for (let i = 0; i < gallery.length; i++) {
    totalImg.textContent = gallery.length; //passing total img length to totalImg variable
    let newIndex = i; //passing i value to newIndex variable
    let clickedImgIndex; //creating new variable

    
    gallery[i].onclick = () =>{
        clickedImgIndex = i; //passing cliked image index to created variable (clickedImgIndex)
        function preview(){
            currentImg.textContent = newIndex + 1; //passing current img index to currentImg varible with adding +1
            let imageURL = gallery[newIndex].querySelector("img").src; //getting user clicked img url
            previewImg.src = imageURL; //passing user clicked img url in previewImg src
            // previewImg.classList.remove('animate__animated', 'animate__fadeIn');
            // void previewImg.offsetWidth;
            // previewImg.classList.add('animate__animated', 'animate__fadeIn');
        }
        
        preview(); //calling above function

        const prevBtn = document.querySelector("#prev");
        const nextBtn = document.querySelector("#next");

        prevBtn.onclick = ()=>{ 
            newIndex--; //decrement index
            
            if(newIndex == -1){
                newIndex = gallery.length - 1;
                preview();
            } else {
                preview();
            }
        }
        nextBtn.onclick = ()=>{ 
            newIndex++; //increment index
            if(newIndex >= gallery.length){
                newIndex = 0;
                preview();
            } else {
                preview();
            }
        }
        previewBox.classList.add("show"); 
        shadow.style.display = "block"; 
        closeIcon.onclick = ()=>{
            newIndex = clickedImgIndex; //assigning user first clicked img index to newIndex
            prevBtn.style.display = "block"; 
            nextBtn.style.display = "block";
            previewBox.classList.remove("show");
            shadow.style.display = "none";
        }
    }
} 
