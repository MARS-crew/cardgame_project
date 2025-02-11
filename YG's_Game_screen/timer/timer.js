var container = document.querySelector(".timer")
var min = 1;
var sec = (min*60);
var num = 360;

/**
 * 타이머 시작 함수
 */
function startTimer() {
    const timerId = setInterval(() => {
        sec--;

        container.style.setProperty("--timerA",num+"deg")
        container.style.background = ` conic-gradient(#E1E2E7 var(--timerA) ,#E1E2E7 0deg ,#293047 0deg,#293047 360deg)`
        num = num - (num / sec);

        document.getElementById('timerDisplay').textContent = sec + "초";

        if (sec <= 0) {
            clearInterval(timerId);
            document.getElementById('timerDisplay').textContent = "끝";
        }
    }, 1000);
}

startTimer();