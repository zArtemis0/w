const display = document.body;
let text = "";
const dictionary = new Set();

// Load dictionary
fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt')
    .then(response => response.text())
    .then(data => {
        data.split('\n').forEach(word => {
            const cleanWord = word.trim().toLowerCase();
            if (cleanWord.length >= 3) dictionary.add(cleanWord); // only keep words 3+ letters
        });
        generateLetters();
    });

function generateLetters() {
    setInterval(() => {
        const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        text += randomChar;

        // Keep the last 200 characters max
        const windowText = text.slice(-200);
        let highlighted = "";

        let i = 0;
        while (i < windowText.length) {
            let matched = false;

            // Try matching the longest possible word first (up to 20 chars)
            for (let j = Math.min(windowText.length, i + 20); j > i + 2; j--) {
                const segment = windowText.slice(i, j);
                if (dictionary.has(segment)) {
                    highlighted += `<span class="found">${segment}</span>`;
                    i = j;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                highlighted += windowText[i];
                i++;
            }
        }

        display.innerHTML = highlighted;

        // Autoscroll if near bottom
        const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
        if (atBottom) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, 50);
}
