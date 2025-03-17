async function startGame() {
    const nickname = document.getElementById('nickname').value;
    if (nickname) {
        const isNicknameValid = await nicknameCheck(nickname);
        if (isNicknameValid) {
            localStorage.setItem("playerNickname", nickname);
            window.location.href="../MatchTheCard_GamePlayScreen/GameScreen.html";
        } else {
            alert('닉네임이 유효하지 않습니다.');
        }
    } else {
        alert('닉네임을 입력해 주세요.');
    }
}

function openGameGuide() {
    document.getElementById('gameGuideModal').style.display = "block";
}

function closeGameGuide() {
    document.getElementById('gameGuideModal').style.display = "none";
}

// 서버에서 랭킹 가져와서 화면에 표시하는 함수
document.addEventListener("DOMContentLoaded", function() {
    function getRanking() {
        fetch("http://125.188.5.149:13131/api/rank.php")
            .then(response => response.json())
            .then(data => {
                console.log("닉네임 중복 검사 완료:", data);
                const rankElements = document.querySelectorAll(".rank");
                
                let rankings = data.rankings;
                let currentIndex = 0;

                function updateRanking() {
                    rankElements.forEach((element, i) => {
                        let rankIndex = currentIndex * 8 + i;
                        if (rankIndex < rankings.length) {
                            let player = rankings[rankIndex];
                            element.innerHTML = `&nbsp;${player.rank}위 &nbsp;| &nbsp;${player.nickname} &nbsp; ${player.score}점`;
                            if (currentIndex == 0) {
                                document.querySelector('.Gold1').src = './MainScreen_Photo/Gold1.png';
                                document.querySelector('.Silver2').src = './MainScreen_Photo/Silver2.png';
                                document.querySelector('.Bronze3').src = './MainScreen_Photo/Bronze3.png';
                            } else {
                                document.querySelector('.Gold1').src = './MainScreen_Photo/TheOther.png';
                                document.querySelector('.Silver2').src = './MainScreen_Photo/TheOther.png';
                                document.querySelector('.Bronze3').src = './MainScreen_Photo/TheOther.png';
                            }
                        } else {
                            element.textContent = "";
                        }
                    });
                    
                    // 다음 순환 구간으로 이동
                    currentIndex = (currentIndex + 1) % Math.ceil(rankings.length / 8);
                }
                
                // 첫 번째 랭킹 업데이트 및 4초마다 업데이트 설정
                updateRanking();
                setInterval(updateRanking, 4000);
            })
            .catch(error => {
                console.error("랭킹 조회 실패:", error);
            });
    }

    getRanking();
});

async function nicknameCheck(nickname) {
    try {
        const response = await fetch("http://125.188.5.149:13131/api/result.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `nickname=${encodeURIComponent(nickname)}`
        });
        const data = await response.json();
        console.log('!@#ㄱㄴㄷ',data);
        return true; // 서버에서 닉네임 유효성을 반환한다고 가정
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}
