function startGame() {
    const nickname = document.getElementById('nickname').value;
    if (nickname) {
        localStorage.setItem("playerNickname", nickname);
        window.location.href="../MatchTheCard_GamePlayScreen/GameScreen.html"
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
// 모달 닫기
window.onclick = function(event) {
    const modal = document.getElementById('gameGuideModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
