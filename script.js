const content = document.querySelector('.content');
let isListening = false;
let selectedVoiceURI = localStorage.getItem('selectedVoiceURI') || null; // Retrieve selected voice URI from local storage

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    
    if (selectedVoiceURI) {
        const selectedVoice = window.speechSynthesis.getVoices().find(voice => voice.voiceURI === selectedVoiceURI);
        text_speak.voice = selectedVoice;
    }
    
    window.speechSynthesis.speak(text_speak);
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS..");
    wishMe();
});

function wishMe() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
    // Start listening for user commands after greeting
    setTimeout(startListening, 2000); // Delay starting listening for 2 seconds after greeting
}

// Rest of the code remains the same

// Voice selection dropdown
const voiceSelect = document.getElementById('voiceSelect');

// Update voices immediately and whenever they are loaded
updateVoices();
window.speechSynthesis.onvoiceschanged = updateVoices;

function updateVoices() {
    // Clear previous options
    voiceSelect.innerHTML = '';
    // Add an option for each available voice
    window.speechSynthesis.getVoices().forEach(voice => {
        const option = document.createElement('option');
        option.textContent = voice.name;
        option.setAttribute('value', voice.voiceURI);
        if (voice.voiceURI === selectedVoiceURI) {
            option.selected = true;
        }
        voiceSelect.appendChild(option);
    });
}

// Event listener for voice selection change
voiceSelect.addEventListener('change', () => {
    selectedVoiceURI = voiceSelect.value; // Store the selected voice URI
    localStorage.setItem('selectedVoiceURI', selectedVoiceURI); // Store selected voice URI in local storage
    
    // Change the greeting text to reflect the selected voice
    const selectedVoice = window.speechSynthesis.getVoices().find(voice => voice.voiceURI === selectedVoiceURI);
    if (selectedVoice) {
        const greeting = document.querySelector('.greeting');
        greeting.textContent = `Initializing Jarvis with ${selectedVoice.name}...`;
    }
});

// Rest of the code remains the same

// Rest of the code remains the same


// Rest of the code remains the same

// Rest of the code remains the same


function startListening() {
    content.textContent = "Listening....";
    recognition.start();
}

function stopListening() {
    content.textContent = "Click here to speak";
    recognition.stop();
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
    isListening = true;
};

recognition.onend = () => {
    isListening = false;
    if (content.textContent !== "Click here to speak") {
        startListening(); // Start listening again if not manually stopped
    }
};

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

function takeCommand(message) {
    if (message.startsWith("jarvis")) {
        if (message.includes("hey jarvis ") || message.includes('hello jarvis')) {
            speak("Hello Sir, How May I Help You?");
            startListening(); // Start listening when greeted
        } else if (message.includes("open google")) {
            window.open("https://google.com", "_blank");
            speak("Opening Google...");
        } else if (message.includes("open youtube")) {
            window.open("https://youtube.com", "_blank");
            speak("Opening Youtube...");
        } else if (message.includes("open facebook")) {
            window.open("https://facebook.com", "_blank");
            speak("Opening Facebook...");
        } else if ( message.includes("play")) { // Command to play music
            const searchQuery = message.replace("play", "").trim(); // Extracting the song or music name from the command
            const youtubeLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`; // Creating a YouTube search link
            window.open(youtubeLink, "_blank"); // Open the YouTube link
            speak(`Playing ${searchQuery} on YouTube...`); // Speaking the response
        } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
            window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
            const finalText = "This is what I found on internet regarding " + message;
            speak(finalText);
        } else if (message.includes('wikipedia')) {
            window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
            const finalText = "This is what I found on wikipedia regarding " + message;
            speak(finalText);
        } else if (message.includes('time')) {
            const time = new Date().toLocaleString(undefined, {
                hour: "numeric",
                minute: "numeric"
            });
            const finalText = time;
            speak(finalText);
        } else if (message.includes('date')) {
            const date = new Date().toLocaleString(undefined, {
                month: "short",
                day: "numeric"
            });
            const finalText = date;
            speak(finalText);
        } else if (message.includes('calculator')) {
            window.open('Calculator:///');
            const finalText = "Opening Calculator";
            speak(finalText);
        } else {
            window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
            const finalText = "I found some information for " + message + " on google";
            speak(finalText);
        }
    }
}
