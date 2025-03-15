const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeToggle.checked = savedTheme === 'dark';

themeToggle.addEventListener('change', () => {
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});


const textarea = document.querySelector('textarea');
const selectVoice = document.querySelector('select');
const button = document.querySelector('button');

let voices = [];

function loadVoices() {
    voices = speechSynthesis.getVoices();
    selectVoice.innerHTML = voices
        .map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`)
        .join('');
}

speechSynthesis.addEventListener('voiceschanged', loadVoices);

loadVoices();

button.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) {
        alert('Please enter some text to convert to speech.');
        return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices[selectVoice.value];
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    button.style.opacity = '0.7';
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Speaking...';

    utterance.onend = () => {
        button.style.opacity = '1';
        button.innerHTML = '<i class="fas fa-play"></i> Listen';
    };

    utterance.onerror = () => {
        button.style.opacity = '1';
        button.innerHTML = '<i class="fas fa-play"></i> Listen';
        alert('An error occurred while converting text to speech.');
    };

    speechSynthesis.speak(utterance);
});
