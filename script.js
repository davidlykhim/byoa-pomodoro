let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isWorkTime = true;
let sessionLog = [];

// Load saved logs when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Get saved logs from localStorage, or use empty array if none exists
    const savedLogs = localStorage.getItem('sessionLog');
    if (savedLogs) {
        sessionLog = JSON.parse(savedLogs);
        updateLogDisplay();
    }

    // Add clear log button functionality
    const clearLogButton = document.getElementById('clear-log');
    clearLogButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all logs?')) {
            sessionLog = [];
            localStorage.removeItem('sessionLog');
            updateLogDisplay();
        }
    });
});

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const workButton = document.getElementById('work-mode');
const breakButton = document.getElementById('break-mode');

const inspirationalQuotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "It's not about perfect. It's about effort. - Jillian Michaels",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The future depends on what you do today. - Mahatma Gandhi",
    "Start where you are. Use what you have. Do what you can. - Arthur Ashe",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
    "Focus on being productive instead of busy. - Tim Ferriss",
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "Don't count the days, make the days count. - Muhammad Ali"
];

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    return inspirationalQuotes[randomIndex];
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function addLogEntry(action) {
    const now = new Date();
    // Format: "Mar 14, 2024, 2:30 PM"
    const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    const dateString = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    const entry = {
        date: dateString,
        time: timeString,
        action: action,
        mode: isWorkTime ? 'Work' : 'Break'
    };
    sessionLog.unshift(entry);
    localStorage.setItem('sessionLog', JSON.stringify(sessionLog));
    updateLogDisplay();
}

function updateLogDisplay() {
    const logContainer = document.getElementById('session-log');
    
    if (sessionLog.length === 0) {
        logContainer.innerHTML = `
            <div class="empty-log">
                <p class="empty-message">You haven't started a session yet. Let's get started.</p>
                <p class="quote">${getRandomQuote()}</p>
            </div>
        `;
    } else {
        logContainer.innerHTML = sessionLog
            .map(entry => `
                <div class="log-entry">
                    <span class="log-time">${entry.time}</span> - 
                    ${entry.action} (${entry.mode} Mode)
                </div>
            `)
            .join('');
    }
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

document.addEventListener('DOMContentLoaded', () => {
    updateLogDisplay();  // Initialize the log display
}); 