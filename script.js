let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isWorkTime = true;
let sessionLog = [];

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const workButton = document.getElementById('work-mode');
const breakButton = document.getElementById('break-mode');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function addLogEntry(action) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const entry = {
        time: timeString,
        action: action,
        mode: isWorkTime ? 'Work' : 'Break'
    };
    sessionLog.unshift(entry); // Add to beginning of array
    updateLogDisplay();
}

function updateLogDisplay() {
    const logContainer = document.getElementById('session-log');
    logContainer.innerHTML = sessionLog
        .map(entry => `
            <div class="log-entry">
                <span class="log-time">${entry.time}</span> - 
                ${entry.action} (${entry.mode} Mode)
            </div>
        `)
        .join('');
}

function startTimer() {
    if (timerId === null) {
        document.querySelector('.timer').classList.add('running');
        addLogEntry('Started timer');
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                isWorkTime = !isWorkTime;
                timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
                modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
                updateDisplay();
                addLogEntry('Timer completed');
                alert(isWorkTime ? 'Work Time!' : 'Break Time!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        document.querySelector('.timer').classList.remove('running');
        addLogEntry('Paused timer');
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    document.querySelector('.timer').classList.remove('running');
    updateDisplay();
    addLogEntry('Reset timer');
}

function setWorkMode() {
    isWorkTime = true;
    timeLeft = 25 * 60;
    updateDisplay();
    workButton.classList.add('active');
    breakButton.classList.remove('active');
    addLogEntry('Switched to Work mode');
}

function setBreakMode() {
    isWorkTime = false;
    timeLeft = 5 * 60;
    updateDisplay();
    breakButton.classList.add('active');
    workButton.classList.remove('active');
    addLogEntry('Switched to Break mode');
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
workButton.addEventListener('click', setWorkMode);
breakButton.addEventListener('click', setBreakMode);

// Initialize display
updateDisplay();
workButton.classList.add('active'); 