/*메인화면 이동*/
document.querySelector('button').addEventListener('click', function goMainScreen() {
    window.location.href = '../../MatchTheCard_GameMainScreen/MainScreen.html'; 
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

document.addEventListener("DOMContentLoaded", function() {
    console.log("화면 로드 완료");

    //현재 플레이어의 닉네임 가져오기
    let myNickname = localStorage.getItem("playerNickname") || new URLSearchParams(window.location.search).get("nickname");

    console.log("현재 플레이어 닉네임:", myNickname);

    //서버에서 랭킹 가져와서 화면에 표시하는 함수
    function getMyRanking() {
        fetch("http://125.188.5.149:13131/api/rank")
            .then(response => response.json()) 
            .then(data => {
                console.log("랭킹 데이터 받아옴:", data);

                if (data.length > 0) {
                    let myRank = -1;
                    let myScore = 0;

                    //내 순위 찾기
                    data.forEach((player, index) => {
                        if (player.nickname === myNickname) {
                            myRank = index + 1; 
                            myScore = player.score;
                        }
                    });

                    // 내 순위가 있다면 화면 업데이트
                    if (myRank !== -1) {
                        document.querySelector(".name p").textContent = myNickname;
                        document.querySelector(".score p").innerHTML = 
                            `${myRank}위 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${myScore}`;
                    } else {
                        console.warn(` ${myNickname}의 랭킹을 찾을 수 없음`);
                    }
                }
            })
            .catch(error => {
                console.error("랭킹 조회 실패:", error);
            });
    }

    //랭킹 가져오기 (페이지 로드 시 실행)
    getMyRanking();
});
