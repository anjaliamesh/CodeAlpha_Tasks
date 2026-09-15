const galleryImages=document.querySelectorAll(".gallery-item img");
const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightboxImg");
const closeBtn=document.getElementById("closeBtn");
const nextBtn=document.getElementById("nextBtn");
const prevBtn=document.getElementById("prevBtn");
const filterButtons=document.querySelectorAll(".filter-btn");
const galleryItems=document.querySelectorAll(".gallery-item");
const imageCounter=document.getElementById("imageCounter");
const searchInput=document.getElementById("searchInput");
const searchBtn=document.getElementById("searchBtn");



let currentIndex=0;
let visibleImages=[...galleryImages];

// open the image when clicked

galleryImages.forEach((image,index) =>{
    image.addEventListener("click",() =>{ 
        currentIndex=visibleImages.indexOf(image);
        lightboxImg.src=image.src;
        imageCounter.textContent=`${currentIndex+1}/${visibleImages.length}`;
        lightbox.style.display="flex";
    });
});

// close the lightbox

closeBtn.addEventListener("click",() =>{
    lightbox.style.display="none";
});

// next image

nextBtn.addEventListener("click",() =>{
    currentIndex=currentIndex + 1;

    if(currentIndex >= visibleImages.length){
        currentIndex=0;
    }
    lightboxImg.src=visibleImages[currentIndex].src;
    imageCounter.textContent=`${currentIndex+1}/${visibleImages.length}`;
});

// prev image

prevBtn.addEventListener("click",() =>{
    currentIndex=currentIndex-1;

    if(currentIndex<0){
        currentIndex=visibleImages.length-1;
    }

    lightboxImg.src=visibleImages[currentIndex].src;
    imageCounter.textContent=`${currentIndex+1}/${visibleImages.length}`;
});

// keyboard control

document.addEventListener("keydown",(event) =>{
// escape key to close

   if(event.key==="Escape"){
        lightbox.style.display="none";
    }

    // right arrow for next image

    if(lightbox.style.display==="flex")
    {
        if(event.key==="ArrowRight")
    {
        nextBtn.click();
    }

    // left arrow for previous image

    if(event.key==="ArrowLeft")
    {
        prevBtn.click();
    }

    }

});

// lightbox will close when click the darkarea outside the image

lightbox.addEventListener("click", (event) =>{
    if(event.target===lightbox){
        lightbox.style.display="none";
    }
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        // Remove active class
        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        // Add active class to clicked button
        button.classList.add("active");

        // Show selected category

        galleryItems.forEach((item) => {
    if(filter === "all" || item.dataset.category === filter){
        item.classList.remove("hidden");
    } else {
        item.classList.add("hidden");
    }
});

        // Get only currently visible images
        visibleImages = [...galleryItems]
    .filter(item => !item.classList.contains("hidden"))
    .map(item => item.querySelector("img"));

currentIndex = 0;

document.querySelector(".gallery").classList.add("filtered");

        // Move to gallery
        document.querySelector(".gallery").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });
});

// search images

function searchImages()
{
    const searchText=searchInput.value.toLowerCase().trim();

    galleryItems.forEach((item)=> {
        const category=item.dataset.category.toLowerCase();

        const caption=item.querySelector(".image-caption");
        const captionText=caption ? caption.textContent.toLowerCase():"";
        
        if(searchText===""||category.includes(searchText)||captionText.includes(searchText))
            {
           item.classList.remove("hidden");
    } else {
        item.classList.add("hidden");
    }
});

        // update images used by lightbox

        visibleImages = [...galleryItems]
        .filter(item => !item.classList.contains("hidden"))
        .map(item => item.querySelector("img"));

    currentIndex = 0;

    document.querySelector(".gallery").scrollIntoView({
    behavior: "smooth",
    block: "start"
});
}

    // search while typing

    searchInput.addEventListener("input",searchImages);

    // search button

    searchBtn.addEventListener("click",searchImages);


