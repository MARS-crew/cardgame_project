// 1. 게임 설정 관련 변수
let isGameStarted = false; // 게임 시작 여부 (초기값: false)
let currentRound = 0; // 현재 진행 중인 라운드 번호
let isRoundCleared = false; // 현재 라운드가 클리어되었는지 여부 (초기값: false)
let myScore = 0; // 현재 점수 (초기값: 0)
let timerTime = 0;

const scoreText = document.getElementById("score-text"); // 점수를 표시할 DOM 요소
const rankText = document.getElementById("rank-text"); // 순위를 표시할 DOM 요소

// 각 라운드별 설정
let roundTime = [20, 30, 40, 50, 60]; // 각 라운드의 제한 시간 (초 단위)
let roundColumn = [3, 6, 6, 6, 6]; // 각 라운드의 열 개수
let roundRow = [2, 2, 3, 4, 5]; // 각 라운드의 행 개수
let maxRound = roundTime.length - 1; // 최대 라운드 번호 (라운드 수 - 1)

// 2. 게임 카드 관련 변수
let CARD_PER_COLUMN = 0; // 카드 한 열에 배치되는 카드 개수
let CARD_PER_ROW = 0; // 카드 한 행에 배치되는 카드 개수
let flippedCards = []; // 현재까지 뒤집힌 카드들을 저장하는 배열
let isFlipping1 = false; // 첫 번째 카드가 회전 중인지 여부 (초기값: false)
let isFlipping2 = false; // 두 번째 카드가 회전 중인지 여부 (초기값: false)
const flipContainer = document.querySelector('.flip'); // 카드가 뒤집히는 컨테이너 요소
const cardValues = []; // 카드 값 배열 (각 카드의 값)
const newCard = []; // 새로 생성된 카드들을 저장하는 배열

// 3. 타이머 관련 변수
let timerId; // 타이머의 고유 ID (setInterval로 생성된 ID)
const timerContainer = document.querySelector(".timer"); // 타이머 표시 컨테이너
const timerDisplay = document.getElementById('timerDisplay'); // 실제로 타이머가 표시될 DOM 요소

// 4. 아이템 관련 변수
const itemContainer = document.getElementById('items'); // 아이템 슬롯 컨테이너 요소
const itemTypes = ['시간 추가', '랜덤 매칭', '전체 보기']; // 사용할 수 있는 아이템 종류 목록

// 5. 기타 변수
let startPoint = { X: 0, Y: 0 }; // 게임 시작 위치 좌표 (X, Y)

// 모달을 위한 변수 (게임 종료 시 메시지 또는 결과를 표시)
const modal = document.querySelector('.modal'); // 모달 요소
const overlay = document.querySelector('.modal-overlay'); // 모달 배경 오버레이
const modalContent = modal.querySelector('.modal-content'); // 모달 내 실제 내용 표시 요소

let rankings = []; // 랭킹 데이터를 저장할 변수
let rank = 0; // 내 순위를 저장할 변수
let MyNickName = ''; // 플레이어 닉네임을 저장할 변수

const rankApiUrl = "http://125.188.5.149:13131/api/rank.php"; // 랭킹 조회 API URL
const resultApiUrl = "http://125.188.5.149:13131/api/score.php"; // 결과 저장 API URL

/**
 * 게임을 시작하는 함수
 */
function gameStart() {
    if (!true) {
        alert("오류가 발생했습니다. 이전 페이지로 돌아갑니다.");
        history.back()
        return;
    }
    MyNickName = localStorage.getItem("playerNickname") || "guest"; // 닉네임 가져오기 (없으면 guest)
    createItemSlots(5);
    roundSet(currentRound);
    isGameStarted = true;
}

// 게임 클리어 시 호출
function gameClear() {
    isGameStarted = false;
    saveRanking(MyNickName, myScore);
    setTimeout(() => {
        window.location.href="../MatchTheCard_GameClearScreen/ClearScreen.html"
    }, 3000);

    localStorage.setItem("playerNickname", MyNickName);
    localStorage.setItem("playerRank", rank);
    localStorage.setItem("playerScore", myScore);
    
}

// 게임 오버 시 호출
function gameOver() {
    isGameStarted = false;
    showRound();
    saveRanking(MyNickName, myScore);
    setTimeout(() => {
        window.location.href="../MatchTheCard_GameOverScreen/gameoverScreen.html"
    }, 3000);

    localStorage.setItem("playerNickname", MyNickName);
    localStorage.setItem("playerRank", rank);
    localStorage.setItem("playerScore", myScore);
}

/**
 * 주어진 라운드에 맞춰 게임을 세팅하는 함수
 * @param {*} round - 현재 라운드 번호
 */
function roundSet(round) {
    CARD_PER_COLUMN = roundColumn[round];
    CARD_PER_ROW = roundRow[round];

    // 카드 및 배열 초기화
    flipContainer.innerHTML = "";
    cardValues.length = 0;
    newCard.length = 0;

    for (let i = 0; i < (CARD_PER_ROW * CARD_PER_COLUMN) / 2; i++) { // 두쌍
        cardValues.push(i);
        cardValues.push(i);
    }

    //셔플
    cardValues.sort(() => Math.random() - 0.5);

    for (let i = 0; i < CARD_PER_ROW * CARD_PER_COLUMN; i++) {
        newCard.push(createCard(cardValues[i]))
        flipContainer.appendChild(newCard[i]);
    }   

    flipContainer.style.display = 'grid';
    flipContainer.style.gridTemplateRows = `repeat(${CARD_PER_ROW}, 1fr)`;
    flipContainer.style.gridTemplateColumns = `repeat(${CARD_PER_COLUMN}, 1fr)`;
    flipContainer.style.gap = '1rem';

    startTimer(roundTime[round]);
}

/**
 * 카드 요소를 생성하는 함수
 * @param {*} value - 카드의 값
 * @returns 생성된 카드 DOM 요소
 */
function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.currentRotate = {X: 0, Y: 0}; // 각 카드마다 개별적으로 회전 상태를 저장

    // 앞면 생성
    const front = document.createElement('div');
    front.classList.add('front');

    // 뒷면 생성
    const back = document.createElement('div');
    back.classList.add('back');

    const cardImage = document.createElement('img');
    cardImage.src = `asset/cardImages/${value}.png`; // 이미지 경로를 설정
    back.appendChild(cardImage); // 이미지 추가

    // 앞면과 뒷면을 카드에 추가
    card.appendChild(front);
    card.appendChild(back);

    rotateCard(card);
    
    return card;
}

/**
 * 드래그로 계산된 회전값을 반환하는 함수
 * @param {Object} start - 시작 좌표 (X, Y)
 * @param {Object} end - 종료 좌표 (X, Y)
 * @returns {Object} 회전값 객체 (X, Y)
 */
const calculateRotation = (start, end) => {
    const tmpX = end.X - start.X;
    const tmpY = end.Y - start.Y;

    if (Math.abs(tmpX) >= Math.abs(tmpY)) {
        return {X: 0, Y: tmpX > 0 ? 180 : -180};
    }
    else {
        return {X: tmpY > 0 ? 180 : -180, Y: 0};
    }
}

/**
 * 카드 회전 및 드래그 마우스 이벤트를 처리하는 함수
 * @param {*} selectedcard - 회전을 적용할 선택된 카드
 */
function rotateCard(selectedcard) {
    selectedcard.addEventListener('mousedown', (e) => {
        startPoint = {X: e.pageX, Y: e.pageY};
    });

    selectedcard.addEventListener('mouseup', (e) => {
        const endPoint = {X: e.pageX, Y: e.pageY};
        const rotation = calculateRotation(startPoint, endPoint);

        if (isFlipping2 || selectedcard.classList.contains('flipped')) {
            return;
        }

        selectedcard.currentRotate.X += rotation.X;
        selectedcard.currentRotate.Y += rotation.Y;
        
        flipCard(selectedcard);
    });
}

/**
 * 카드가 뒤집힌 후 같은 카드인지 확인하고 처리하는 함수
 * @param {card} selectedcard - 선택된 카드 객체
 */
function flipCard(selectedcard) {
    if (!isGameStarted || isFlipping2 || selectedcard.classList.contains('flipped')) {
        return;
    }
    
    selectedcard.classList.add('flipped');
    isFlipping1 = true;
    flippedCards.push(selectedcard);
    selectedcard.style.transform = `rotateX(${selectedcard.currentRotate.X}deg) rotateY(${selectedcard.currentRotate.Y}deg)`;

    if (flippedCards.length === 2) {
        isFlipping2 = true;

        let [firstCard, secondCard] = flippedCards;
        if (firstCard.dataset.value === secondCard.dataset.value) {
            myScore += 55;
            updateUserRank(myScore);
            scoreText.textContent = myScore;

            setTimeout(() => { 
                // 맞은 카드에 효과 추가
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                const correctSound = new Audio('./asset/sounds/DeviceConnect.wav'); // 맞았을 때 효과음
                correctSound.play(); // 맞았을 때 효과음 재생
            }, 500);

            flippedCards = [];
            isFlipping1 = false;
            isFlipping2 = false;
            checkRoundClear();
        } else {
            setTimeout(() => {
                // 틀린 카드에 효과 추가
                firstCard.classList.add('mismatch');
                secondCard.classList.add('mismatch');
                const wrongSound = new Audio('./asset/sounds/DeviceConnectionError.wav'); // 틀렸을 때 효과음
                wrongSound.play(); // 틀렸을 때 효과음 재생
            }, 500);

            setTimeout(() => { 
                firstCard.classList.remove('flipped', 'mismatch');
                secondCard.classList.remove('flipped', 'mismatch');
                firstCard.currentRotate = {X: 0, Y: 0};
                secondCard.currentRotate = {X: 0, Y: 0};
                flippedCards = [];
                isFlipping1 = false;
                isFlipping2 = false;
                firstCard.style.transform = `rotateX(${firstCard.currentRotate.X}deg) rotateY(${firstCard.currentRotate.Y}deg)`;
                secondCard.style.transform = `rotateX(${secondCard.currentRotate.X}deg) rotateY(${secondCard.currentRotate.Y}deg)`;
            }, 1000);
        }
    }
}

/**
 * 모든 카드가 뒤집혀졌는지 확인하고
 * 
 * 라운드 클리어 여부를 처리하는 함수
 */
function checkRoundClear() {
    let allFlipped = document.querySelectorAll('.card.flipped').length === CARD_PER_ROW * CARD_PER_COLUMN;
    if (allFlipped) {
        if (timerId) cancelAnimationFrame(timerId); // 기존 타이머 정리
        showRound();
        nextRound();
        const clearSound = new Audio('./asset/sounds/alarm-3.mp3'); // 맞았을 때 효과음
        clearSound.volume = 0.1;  // 0.5는 50% 볼륨
        clearSound.play(); // 클리어 효과음 재생
    }
}

/**
 * 타이머를 시작하고, 시간이 지나면 게임 종료 처리를 하는 함수
 */
function startTimer(sec) {
    timerTime = sec;
    timerDisplay.textContent = timerTime + "초";
    let startTime = null;
    let num = 360;

    function updateTimer(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsedTime = (timestamp - startTime) / 1000;

        const remainingTime = Math.max(timerTime - elapsedTime, 0);
        timerDisplay.textContent = Math.ceil(remainingTime) + "초";

        const angle = (remainingTime / timerTime) * 360;
        timerContainer.style.setProperty("--timerA", angle + "deg");

        if (remainingTime < 10) {
            timerContainer.style.background = `conic-gradient(crimson var(--timerA), crimson 0deg, #293047 0deg, #293047 360deg)`;
        } else {
            timerContainer.style.background = `conic-gradient(#E1E2E7 var(--timerA), #E1E2E7 0deg, #293047 0deg, #293047 360deg)`;
        }

        if (remainingTime > 0) {
            timerId = requestAnimationFrame(updateTimer);
        } else {
            timerDisplay.textContent = "끝";
            gameOver();
        }
    }

    timerId = requestAnimationFrame(updateTimer);
}

/**
 * 라운드를 표시하고 애니메이션을 처리하는 함수입니다.
 */
function showRound() {
    const roundBox = document.getElementById("roundBox");
    const text = document.getElementById("roundText");

    if (!roundBox || !text) return;
    if (!isGameStarted) {
        roundBox.style.animation = "showRoundBox 3s linear";
        text.innerText = `게임 오버`;
        text.style.animation = "showRound 3s linear";
        return;
    }
    if (currentRound == maxRound) {
        roundBox.style.animation = "showRoundBox 3s linear";
        text.innerText = `클리어`;
        text.style.animation = "showRound 3s linear";
        return;
    }

    roundBox.style.animation = "showRoundBox 3.5s linear";

    text.innerText = `${currentRound+2}라운드`;
    text.style.animation = "showRound 3s linear";

    setTimeout(() => {
        roundBox.style.animation = "none";
        text.style.animation = "none";
    }, 3500);

    const slots = document.querySelectorAll('.item');
    const specialSlots = document.querySelectorAll('.specialItem');
    const emptySlots = Array.from(slots).filter(slot => !slot.dataset.item);
    const emptySpecialSlots = Array.from(specialSlots).filter(specialSlots => !specialSlots.dataset.item);

    if ((emptySlots.length > 0) || (emptySpecialSlots.length > 0)) {
        setTimeout(() => {
            showRoundItem();
        }, 1000);
    }
}

/**
 * 슬롯의 데이터를 초기화하는 함수
 * 
 * 클릭된 슬롯의 데이터를 비우고, 빈 슬롯을 위로 이동시킵니다.
 * 
 * @param {HTMLElement} slot 초기화할 슬롯 요소
 */
function resetSlotData(slot) {
    slot.dataset.item = ''; // 클릭된 슬롯의 데이터 초기화
    slot.innerText = '';
    shiftItemsUp();
}

/**
 * 특수 아이템 슬롯을 생성하는 함수
 * 
 * 특정 슬롯을 생성하고, 클릭 시 특정 동작을 수행하는 이벤트 리스너를 추가합니다.
 * 
 * @param {number} slotcount 생성할 슬롯 개수
 */
function createSpecialItemSlots(slotcount) {
    const slot = document.createElement('div');
    slot.classList.add('specialItem');
    slot.dataset.slotId = slotcount-1;
    slot.dataset.item = ''; // 초기 아이템 값 설정
        
    // 슬롯 클릭 시 해당 아이템 확인
    slot.addEventListener('click', function() {
        const item = slot.dataset.item;
        console.log('클릭된 아이템:', item);
        if (item == '전체 보기') {
            rotateUnflippedCards();
            resetSlotData(slot);
        }
    });
        
    itemContainer.appendChild(slot);
}

/**
 * 주어진 수만큼 아이템 슬롯을 생성하고,
 * 
 * 슬롯 클릭 시 해당 아이템에 따라 동작을 수행하는 함수
 * @param {number} slotcount 아이템 슬롯 개수
 */
function createItemSlots(slotcount) {
    for (let i = 0; i < slotcount - 1; i++) {
        const slot = document.createElement('div');
        slot.classList.add('item');
        slot.dataset.slotId = i;
        slot.dataset.item = ''; // 초기 아이템 값 설정
        
        // 슬롯 클릭 시 해당 아이템 확인
        slot.addEventListener('click', function() {
            const item = slot.dataset.item;
            console.log('클릭된 아이템:', item);
            switch (item) {
                case '시간 추가':
                    timerTime += 10;
                    resetSlotData(slot);
                    break;
                case '랜덤 매칭':
                    if (isFlipping1) {
                        break;
                    }
                    autoMatch();
                    resetSlotData(slot);
                    break;
                default:
                    break;
            }
        });
        
        itemContainer.appendChild(slot);
    }

    createSpecialItemSlots(slotcount);
}

/**
 * 아이템이 있는 슬롯을 위로 이동시켜 빈 슬롯을 채우는 함수
 */
function shiftItemsUp() {
    const slots = document.querySelectorAll('.item');
    
    let firstEmptySlotIndex = -1;
    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        if (!slot.dataset.item) {
            if (firstEmptySlotIndex === -1) {
                firstEmptySlotIndex = i;
            }
        } else if (firstEmptySlotIndex !== -1) {
            // 빈 슬롯을 찾은 후, 그 이후 아이템을 위로 이동
            slots[firstEmptySlotIndex].dataset.item = slot.dataset.item;
            const itemImage = document.createElement('img');
            itemImage.src = `./asset/cardImages/${slot.dataset.item}.png`;
            slots[firstEmptySlotIndex].appendChild(itemImage)
            slot.dataset.item = '';
            slot.innerText = '';
            firstEmptySlotIndex++;
        }
    }
}

/**
 * 아이템을 빈 슬롯 또는 특수 슬롯에 추가하는 함수
 * 
 * @param {number} itemvalue 추가할 아이템의 인덱스 값
 */
function addItem(itemvalue) {
    const slots = document.querySelectorAll('.item');
    const specialSlots = document.querySelectorAll('.specialItem');
    const emptySlots = Array.from(slots).filter(slot => !slot.dataset.item);
    const emptySpecialSlots = Array.from(specialSlots).filter(specialSlots => !specialSlots.dataset.item);
    const itemImage = document.createElement('img');
    const modalItemImage = document.createElement('img');
    itemImage.src = `./asset/cardImages/${itemTypes[itemvalue]}.png`;
    modalItemImage.src = `./asset/cardImages/${itemTypes[itemvalue]}.png`;

    if (itemvalue == 2) {
        if (emptySpecialSlots.length > 0) {
            emptySpecialSlots[0].dataset.item = itemTypes[itemvalue];
            emptySpecialSlots[0].appendChild(itemImage);
            modalContent.appendChild(modalItemImage);
            //emptySpecialSlots[0].innerText = itemTypes[itemValue];
        } else {
            console.log('빈 슬롯이 없습니다');
        }
    } else {
        if (emptySlots.length > 0) {
            emptySlots[0].dataset.item = itemTypes[itemvalue];
            emptySlots[0].appendChild(itemImage);
            modalContent.appendChild(modalItemImage);
            //emptySlots[0].innerText = itemTypes[itemValue];
        } else {
            console.log('빈 슬롯이 없습니다');
        }
    }
}

/**
 * 현재 라운드에 따라 아이템을 추가하는 함수
 */
function addRoundItem() {
    switch (currentRound) {
        case 1:
        case 2:
            modalContent.innerHTML = '';
            addItem(0);
            addItem(1);
            break;
        case 3:
        case 4:
            modalContent.innerHTML = '';
            addItem(0);
            addItem(1);
            addItem(1);
            addItem(2);
            break;
        default:
            break;
    }
}

/**
 * 다음 라운드로 이동하는 함수
 * 
 * 현재 점수를 증가시키고, 새로운 라운드를 설정
 */
function nextRound() {
    myScore += 550;
    updateUserRank(myScore);
    scoreText.textContent = myScore;
    currentRound++;
    
    if (currentRound < roundColumn.length) {
        setTimeout(() => {
            addRoundItem();
        }, 1000);
        
        setTimeout(() => {
            roundSet(currentRound);
        }, 3000);
    } else {
        gameClear();
    }
}

/**
 * 카드 자동 맞추기 아이템 함수
 * 
 * 아직 뒤집지 않은 카드들 중에서
 * 
 * 짝을 맞출 수 있는 카드 두 장을 찾아 자동으로 뒤집기
 * @returns {void}
 */
function autoMatch() {
    const unmatchedCards = Array.from(document.querySelectorAll('.card:not(.flipped)')); // 아직 뒤집지 않은 카드들

    if (unmatchedCards.length < 2) { // 뒤집을 카드가 2개 미만일 경우
        console.log("뒤집을 카드가 부족합니다.");
        return;
    }

    let cardPairs = {}; // 카드 값을 기준으로 짝을 찾기 위한 객체

    // 카드 값별로 그룹화
    unmatchedCards.forEach(card => {
        const value = card.dataset.value; // 카드의 데이터 값
        if (!cardPairs[value]) {
            cardPairs[value] = [];
        }
        cardPairs[value].push(card); // 값에 맞는 카드들 그룹에 추가
    });

    let matchedPair = null; // 매칭된 카드 쌍을 저장할 변수

    // 두 장의 카드가 일치하는 짝을 찾기
    for (let key in cardPairs) {
        if (cardPairs[key].length === 2) { // 짝을 이룬 카드 2개를 찾음
            matchedPair = cardPairs[key];
            break;
        }
    }

    if (matchedPair) { // 짝을 찾았다면
        const [firstCard, secondCard] = matchedPair; // 첫 번째, 두 번째 카드

        // 마우스 이벤트 시뮬레이션
        const mouseDownEvent = new MouseEvent('mousedown', {});
        const mouseUpEvent = new MouseEvent('mouseup', {});

        // 첫 번째 카드와 두 번째 카드에 대해 mouseup 이벤트를 트리거
        firstCard.dispatchEvent(mouseDownEvent);
        firstCard.dispatchEvent(mouseUpEvent);
        secondCard.dispatchEvent(mouseDownEvent);
        secondCard.dispatchEvent(mouseUpEvent);
    } else {
        console.log("매칭 가능한 카드가 없습니다.");
    }
}

/**
 * 뒤집히지 않은 카드들만 회전시키고 다시 원래대로 돌아오는 함수
 * 
 * 뒤집히지 않은 카드들을 180도 회전시키고 3초 후 원래 상태로 되돌림
 * @returns {void}
 */
function rotateUnflippedCards() {
    isFlipping2 = true;
    const allCards = document.querySelectorAll('.card:not(.flipped)'); // 뒤집히지 않은 카드들만 선택
    allCards.forEach(card => {
        card.style.transition = 'transform 0.5s';  // 회전 애니메이션 설정
        card.style.transform = 'rotateY(180deg)'; // 카드를 180도 회전시킴
    });

    setTimeout(() => {
        allCards.forEach(card => {
            card.style.transform = 'rotateY(0deg)';  // 카드를 원래 상태로 되돌림
        });
        isFlipping2 = false;
    }, 3000); // 3초 후 원래대로 회전
}

/**
 * 모달을 표시하고 애니메이션을 처리하는 함수입니다.
 */
function showRoundItem() {
    // 모달 표시
    modal.style.display = 'block';
    overlay.style.display = 'block';
    
    // 2초 후 모달 닫기
    setTimeout(() => {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }, 2000);
}

// 게임 시작 시 호출 (초기 GET 요청)
async function initializeGame() {
    try {
        const response = await fetch(rankApiUrl);
        rankings = (await response.json()).rankings;
        //console.log("초기 랭킹 정보:", rankings);
        rankText.textContent = rankings.length; // 초기 순위 설정
    } catch (error) {
        console.error("랭킹 데이터를 가져오는 중 오류 발생:", error);
    }
}

// 원하는 시점에 호출하여 내 점수와 비교 후 순위 계산
function updateUserRank(currentscore) {
    for (let i = 0; i < rankings.length; i++) {
        if (currentscore >= rankings[i].score) {
            rank = rankings[i].rank;
            rankText.textContent = rank;
            break;
        }
    }
    console.log(`당신의 순위는: ${rank}위`);
}

async function saveRanking(nickname, score) {
    const params = new URLSearchParams();
    params.append("nickname", nickname);
    params.append("score", score);

    for (let i = 0; i < rankings.length; i++) {
        if (rankings[i].nickname == nickname && rankings[i].score < score) {
            try {
                const response = await fetch(resultApiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: params.toString(),
                });
            
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error("랭킹 저장 실패:", error);
                throw error; // 에러를 호출자에게 다시 던져준다.
            }
        }
    }
}

initializeGame();

window.onload = function() {
    document.getElementById('loading-screen').style.display = 'none';
    gameStart();
}