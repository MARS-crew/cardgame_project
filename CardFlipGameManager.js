let isGameStarted = true;
let CARD_PER_ROW = 4;
let CARD_PER_COLUMN = 4;
let isFlipping = false;
let flippedCards = [];

const flipContainer = document.querySelector('.flip');
const cardValues = [];

for (let i = 0; i < (CARD_PER_ROW * CARD_PER_COLUMN) / 2; i++) { // 두쌍
    cardValues.push(i);
    cardValues.push(i);
}

//셔플
cardValues.sort(() => Math.random() - 0.5);

/**
 * 카드를 생성하는 함수
 * @returns Tag Card
 */
function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.currentRotate = {X: 0, Y: 0}; // 각 카드마다 개별적으로 회전 상태를 저장

    // 앞면 생성
    const front = document.createElement('div');
    front.classList.add('front');

    const frontHeading = document.createElement('h1');
    frontHeading.textContent = value;
    front.appendChild(frontHeading); // 앞면에 제목 추가

    // 뒷면 생성
    const back = document.createElement('div');
    back.classList.add('back');

    const backHeading = document.createElement('h1');
    backHeading.textContent = '뒷면';
    back.appendChild(backHeading); // 뒷면에 제목 추가

    // 앞면과 뒷면을 카드에 추가
    card.appendChild(front);
    card.appendChild(back);

    rotateCard(card);
    
    return card;
}

/**
 * 마우스 동작 감지 후 드래그 방향 계산 함수
 * @param {*} selectedCard 
 */
function rotateCard(selectedCard) {
    if (!isGameStarted) return;

    let startPoint = {X: 0, Y: 0};

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

    selectedCard.addEventListener('mousedown', (e) => {
        startPoint = {X: e.pageX, Y: e.pageY};
    });

    selectedCard.addEventListener('mouseup', (e) => {
        const endPoint = {X: e.pageX, Y: e.pageY};
        const rotation = calculateRotation(startPoint, endPoint);

        if (isFlipping || selectedCard.classList.contains('flipped')) {
            return;
        }

        selectedCard.currentRotate.X += rotation.X;
        selectedCard.currentRotate.Y += rotation.Y;
        
        flipCard(selectedCard);
    });
}

/**
 * 카드 회전 함수
 * @param {*} selectedCard 
 * @returns 
 */
function flipCard(selectedCard) {
    if (!isGameStarted || isFlipping || selectedCard.classList.contains('flipped')) {
        return;
    }
    
    selectedCard.classList.add('flipped');
    flippedCards.push(selectedCard);
    selectedCard.style.transform = `rotateX(${selectedCard.currentRotate.X}deg) rotateY(${selectedCard.currentRotate.Y}deg)`;

    if (flippedCards.length === 2) {
        isFlipping = true;

        let [firstCard, secondCard] = flippedCards;
        if (firstCard.dataset.value === secondCard.dataset.value) {
            flippedCards = [];
            isFlipping = false;
        } else {
            setTimeout(() => { //  초 후 제거
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard.currentRotate = {X: 0, Y: 0};
                secondCard.currentRotate = {X: 0, Y: 0};
                flippedCards = [];
                isFlipping = false;
                firstCard.style.transform = `rotateX(${selectedCard.currentRotate.X}deg) rotateY(${selectedCard.currentRotate.Y}deg)`;
                secondCard.style.transform = `rotateX(${selectedCard.currentRotate.X}deg) rotateY(${selectedCard.currentRotate.Y}deg)`;
            }, 1000);
        }
    }
}

flipContainer.style.display = 'grid';
flipContainer.style.gridTemplateRows = `repeat(${CARD_PER_ROW}, 1fr)`;
flipContainer.style.gridTemplateColumns = `repeat(${CARD_PER_COLUMN}, 1fr)`;
flipContainer.style.gap = '1rem';

for (let i = 0; i < CARD_PER_ROW * CARD_PER_COLUMN; i++) {
    const newCard = createCard(cardValues[i]);
    flipContainer.appendChild(newCard);
}

let seconds = 99998989898998;

/**
 * 타이머
 */
function startTimer() {
    const timerId = setInterval(() => {
        seconds--;

        document.getElementById('timerDisplay').textContent = seconds;

        if (seconds <= 0) {
            clearInterval(timerId);
            document.getElementById('timerDisplay').textContent = "시간 종료!";
            isGameStarted = false;
        }
    }, 1000);
}

startTimer();