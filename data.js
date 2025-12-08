
// data.js
// Generates ~500 questions programmatically from vocabulary and templates.
// Contains three types: "quiz", "fill", "listening".
// Works 100% on GitHub Pages.

(function () {

  // -----------------------
  // BASIC WORD LIST
  // -----------------------
  const vocab = [
    "apple","banana","orange","pineapple","grape","school","teacher","student",
    "book","pen","pencil","classroom","library","homework","friend","family",
    "mother","father","brother","sister","grandmother","grandfather","baby",
    "dog","cat","bird","fish","run","walk","swim","play","read","write",
    "listen","speak","eat","drink","sleep","study","learn","watch","sing",
    "dance","happy","sad","angry","tired","hungry","hot","cold","big","small",
    "long","short","fast","slow","beautiful","pretty","ugly","old","young",
    "car","bike","bus","train","plane","ship","city","village","market",
    "shop","store","food","water","juice","milk","bread","rice","noodle",
    "math","english","science","history","geography","music","art","sport",
    "football","basketball","volleyball","tennis","swim","run","jump","climb",
    "morning","afternoon","evening","night","today","tomorrow","yesterday",
    "monday","tuesday","wednesday","thursday","friday","saturday","sunday",
    "January","February","March","April","May","June","July","August","September",
    "October","November","December","one","two","three","four","five","six",
    "seven","eight","nine","ten","first","second","third","next","last","always",
    "often","sometimes","never","can","cannot","must","should","want","like",
    "love","hate","need","have","has","had","is","are","was","were","do","does",
    "did","go","went","come","came","see","saw","hear","heard","think","thought"
  ];

  // -----------------------
  // LISTENING AUDIO
  // -----------------------
  const listeningPool = [
    "https://cdn.pixabay.com/audio/2021/08/04/audio_f17e73b8f1.mp3",
    "https://cdn.pixabay.com/audio/2021/09/09/audio_27f2b83b22.mp3",
    "https://cdn.pixabay.com/audio/2022/03/15/audio_3b9f51a11f.mp3"
  ];

  // Utilities
  function rint(n) { return Math.floor(Math.random() * n); }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function makeDistractors(correct, count = 3) {
    const pool = vocab.filter(v => v !== correct);
    shuffle(pool);
    return pool.slice(0, count);
  }

  // -----------------------
  // TEMPLATES
  // -----------------------
  const quizTemplates = [
    (w, d) => ({
      type: "quiz",
      q: 'Which word means "' + w + '"?',
      options: shuffle([w].concat(d)),
      answer: w
    }),
    (w, d) => ({
      type: "quiz",
      q: 'Choose the correct word for: "' + w + '"',
      options: shuffle([w].concat(d)),
      answer: w
    }),
    (w, d) => ({
      type: "quiz",
      q: 'Which word is the opposite of "' + w + '"?',
      options: shuffle([d[0] || "opposite"].concat(d.slice(1), [w])),
      answer: d[0] || "opposite"
    })
  ];

  const fillTemplates = [
    (w) => ({ type: "fill", q: "I usually ___ " + w + " in the morning.", answer: "play" }),
    (w) => ({ type: "fill", q: "She ___ to school every day.", answer: "goes" }),
    (w) => ({ type: "fill", q: "They often ___ " + w + " on weekends.", answer: "play" }),
    (w) => ({ type: "fill", q: "He likes to ___ " + w + ".", answer: "eat" })
  ];

  // -----------------------
  // GENERATE QUESTIONS
  // -----------------------
  const ALL = [];

  // 300 quiz
  for (let i = 0; i < 300; i++) {
    const w = vocab[rint(vocab.length)];
    const d = makeDistractors(w, 3);
    const tpl = quizTemplates[rint(quizTemplates.length)];
    ALL.push(tpl(w, d));
  }

  // 120 fill-in
  for (let i = 0; i < 120; i++) {
    const w = vocab[rint(vocab.length)];
    const tpl = fillTemplates[rint(fillTemplates.length)];
    ALL.push(tpl(w));
  }

  // 80 listening
  for (let i = 0; i < 80; i++) {
    const w = vocab[rint(vocab.length)];
    const d = makeDistractors(w, 3);
    ALL.push({
      type: "listening",
      q: "Listen and choose the word you hear.",
      audio: listeningPool[i % listeningPool.length],
      options: shuffle([w].concat(d)),
      answer: w
    });
  }

  // Guarantee 500 total
  while (ALL.length < 500) {
    const w = vocab[rint(vocab.length)];
    ALL.push({
      type: "quiz",
      q: 'Which word is "' + w + '"?',
      options: shuffle([w].concat(makeDistractors(w, 3))),
      answer: w
    });
  }

  const QUESTIONS = ALL.slice(0, 500);

  // GLOBAL EXPORT
  window.ALL_QUESTIONS = QUESTIONS;

  window.getRandomQuizSet = function (n) {
    const arr = QUESTIONS.slice();
    shuffle(arr);
    return arr.slice(0, n || 20);
  };

  console.log("data.js loaded: " + QUESTIONS.length + " questions ready.");

})();
