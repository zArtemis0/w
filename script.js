const display = document.body;
let text = "";
const dictionary = new Set();

// Load dictionary (you can use a different word list if preferred)
fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt')
    .then(response => response.text())
    .then(data => {
        data.split('\n').forEach(word => {
            dictionary.add(word.trim());
        });
        generateLetters(); // Start only after dictionary loads
    });

function generateLetters() {
    setInterval(() => {
        const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        text += randomChar;

        // Only analyze the most recent 100 characters
        let windowText = text.slice(-100);
        let highlighted = "";

        for (let i = 0; i < windowText.length; i++) {
            let found = false;
            for (let j = windowText.length; j > i; j--) {
                let segment = windowText.slice(i, j);
                if (dictionary.has(segment)) {
                    highlighted += `<span class="found">${segment}</span>`;
                    i = j - 1;
                    found = true;
                    break;
                }
            }
            if (!found) {
                highlighted += windowText[i];
            }
        }

        display.innerHTML = highlighted;

        // Auto-scroll if user is at the bottom
        const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
        if (atBottom) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, 50); // 50ms delay between characters
}
