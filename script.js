const btn = document.querySelector('.speak-btn');
const content = document.querySelector('#response');
const heading = document.querySelector('#heading');

// Global variables
let recognition;
let isConversationActive = false;

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
    
    // UI Feedback
    if (heading) {
        heading.textContent = "SPEAKING...";
        heading.style.color = "#00bcd4";
    }
    
    text_speak.onend = () => {
        if (heading) {
            heading.textContent = "ONLINE";
            heading.style.color = "#008ba3";
        }
        
        // Continuous Conversation Mode: Restart listening after speaking
        if (recognition && isConversationActive) {
            setTimeout(() => {
                try {
                    recognition.start();
                } catch (error) {
                    console.log("Could not restart recognition:", error);
                }
            }, 500); // Small delay to prevent picking up own echo
        }
    };
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master");
    } else {
        speak("Good Evening Sir");
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
    updateTime();
    updateBattery();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition(); // Use global variable

    recognition.onstart = () => {
        if (heading) {
            heading.textContent = "LISTENING...";
            heading.style.color = "#0f0";
        }
        if (content) content.textContent = "Listening...";
    };

    recognition.onresult = (event) => {
        const currentIndex = event.resultIndex;
        const transcript = event.results[currentIndex][0].transcript;
        if (content) content.textContent = transcript;
        takeCommand(transcript.toLowerCase());
    };
    
    // Error handling to keep it alive
    recognition.onerror = (event) => {
        console.error("Speech Recognition Error", event.error);
        if(isConversationActive) {
             if (heading) {
                heading.textContent = "ONLINE"; 
                heading.style.color = "#008ba3";
            }
        }
    };

    if (btn) {
        btn.addEventListener('click', () => {
            isConversationActive = true; // Enable loop
            if (content) content.textContent = "Listening...";
            try {
                recognition.start();
            } catch(e) { console.log(e); }
        });
    }
}

function takeCommand(message) {
    if (heading) heading.textContent = "PROCESSING...";
    
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("how are you")) {
        speak("I am fine Sir, What about you?");
    } else if (message.includes("stop") || message.includes("exit") || message.includes("bye")) {
        isConversationActive = false; // Stop the loop
        speak("Goodbye Sir, have a nice day!");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(/ /g, "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleTimeString();
        speak("Current time is " + time);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleDateString();
        speak("Today's date is " + date);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    } else {
        // Default AI Conversation Fallback (Simulated)
        // Ideally connect to OpenAI/Gemini API here for real chat
        // For now, simpler responses
        window.open(`https://www.google.com/search?q=${message.replace(/ /g, "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on Google";
        speak(finalText);
    }
}

function updateTime() {
    const timeElement = document.getElementById('time');
    if (timeElement) {
        setInterval(() => {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }, 1000);
    }
}

function updateBattery() {
    const batteryElement = document.getElementById('battery');
    if (batteryElement && navigator.getBattery) {
        navigator.getBattery().then(function(battery) {
            const updateLevel = () => {
                batteryElement.textContent = Math.floor(battery.level * 100) + "%";
            };
            updateLevel();
            battery.addEventListener('levelchange', updateLevel);
        });
    }
}