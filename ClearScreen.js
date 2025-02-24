/*메인화면 이동*/
document.querySelector('button').addEventListener('click', function() {
    window.location.href = ''; 

});

function ScreenSize() {
    const container = document.querySelector(".game-clear-container");
    container.style.height = window.innerHeight + "px"; 
}