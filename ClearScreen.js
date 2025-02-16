/*메인화면 이동*/
document.querySelector('button').addEventListener('click', function() {
    window.location.href = ''; 

});

function ScreenSize() {
    const container = document.querySelector(".game-clear-container");
    container.style.height = window.innerHeight + "px"; 
}



/* 별 애니메이션 */
const stars = document.querySelectorAll('.star1, .star2, .star3, .star4, .star5'); 

stars.forEach((star, index) => {
    setTimeout(() => {
        star.style.opacity = "1";  
        star.style.transform = "rotate(360deg) scale(1.2)"; 
        star.style.transition = "transform 1s ease-in-out, opacity 0.5s ease-in";  
    }, index * 200);  
});