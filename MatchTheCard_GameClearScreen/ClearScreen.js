/*메인화면 이동*/
document.querySelector('button').addEventListener('click', function goMainScreen() {
    window.location.href = '../MatchTheCard_GameMainScreen/MainScreen.html'; 
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

MyNickName = localStorage.getItem("playerNickname")
MyScore = localStorage.getItem("playerScore")
MyRank = localStorage.getItem("playerRank")

console.log(MyScore)

document.addEventListener("DOMContentLoaded", function() {
    console.log("화면 로드 완료");

    MyNickName = localStorage.getItem("playerNickname") 
    rank = localStorage.getItem("rank")

    //현재 플레이어의 닉네임 가져오기
    let myNickname = localStorage.getItem("playerNickname") || new URLSearchParams(window.location.search).get("nickname");

    console.log("현재 플레이어 닉네임:", myNickname);

    document.querySelector(".name p").textContent = myNickname;
    document.querySelector(".score p").innerHTML = 
    `${MyRank}위 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${MyScore}점`;

    //랭킹 가져오기 (페이지 로드 시 실행)
    getMyRanking();
});
