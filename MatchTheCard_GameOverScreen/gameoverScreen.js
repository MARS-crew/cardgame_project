/*메인화면 이동*/
document.querySelector('button').addEventListener('click', function goMainScreen() {
    window.location.href = '../MatchTheCard_GameMainScreen/MainScreen.html'; 
});

document.addEventListener("DOMContentLoaded", function() {
    console.log("게임 오버 화면 로드 완료");

    //  현재 플레이어의 닉네임 가져오기
    let myNickname = localStorage.getItem("playerNickname") || new URLSearchParams(window.location.search).get("nickname");

    console.log("🎮 현재 플레이어 닉네임:", myNickname);

    // 서버에서 랭킹 가져와서 화면에 표시하는 함수
    function getRanking() {
        fetch("http://125.188.5.149:13131/api/rank")
            .then(response => response.json())  // JSON 변환
            .then(data => {
                console.log("랭킹 데이터 받아옴:", data);

                const rankElements = document.querySelectorAll(".rank");

                if (data.length > 0) {
                    let myRank = -1;
                    let myScore = 0;

                    // 🔹 왼쪽 랭킹 리스트 업데이트
                    data.forEach((player, index) => {
                        if (rankElements[index]) {
                            rankElements[index].innerHTML = `${player.nickname}&emsp;${player.score}점`;
                        }
                        if (player.nickname === myNickname) {
                            myRank = index + 1;
                            myScore = player.score;
                        }
                    });

                    //오른쪽 내 점수 & 순위 업데이트
                    if (myRank !== -1) {
                        document.querySelector(".name p").textContent = myNickname;
                        document.querySelector(".score p").innerHTML = 
                            `${myRank}위 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${myScore}`;
                    } else {
                        document.querySelector(".name p").textContent = "데이터 없음";
                        document.querySelector(".score p").textContent = "순위 없음";
                    }
                } else {
                    console.warn("서버에서 랭킹 데이터가 비어 있음");
                }
            })
            .catch(error => {
                console.error("랭킹 조회 실패:", error);
                document.querySelector(".name p").textContent = "오류 발생";
                document.querySelector(".score p").textContent = "데이터 불러오기 실패";
            });
    }

    // 게임 오버 화면 로딩 시 랭킹 가져오기
    getRanking();
});

