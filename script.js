const display = document.body;
let text = "";
let buffer = "";
const dictionary = new Set();
const wordLengthMin = 3;

// Load dictionary
fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt')
  .then(res => res.text())
  .then(data => {
    data.split('\n').forEach(word => {
      word = word.trim().toLowerCase();
      if (word.length >= wordLengthMin) dictionary.add(word);
    });
    generateLetters();
  });

function generateLetters() {
  setInterval(() => {
    const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    buffer += randomChar;
    text += randomChar;

    // Only check the last 20 characters to reduce load
    const maxDisplayLength = 1000;
    if (text.length > maxDisplayLength) {
      text = text.slice(-maxDisplayLength);
    }

    // Format displayed text with highlighting
    const formattedText = highlightWords(text);
    display.innerHTML = formattedText;

    // Autoscroll if user is at bottom
    const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
    if (atBottom) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, 50);
}

function highlightWords(raw) {
  let result = '';
  let current = '';

  for (let i = 0; i < raw.length; i++) {
    current += raw[i];

    // Check only if current length is 3 or more
    if (current.length >= wordLengthMin && dictionary.has(current)) {
      result += `<span class="found">${current}</span>`;
      current = '';
    } else if (current.length > 20) {
      // Give up on matching after 20 characters
      result += current[0];
      current = current.slice(1);
    }
  }

  // Append leftover buffer
  result += current;
  return result;
}
