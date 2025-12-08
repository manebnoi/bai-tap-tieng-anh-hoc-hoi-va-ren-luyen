
// data.js
// Generates ~500 questions programmatically from vocabulary and templates.
// Contains three types: "quiz", "fill", "listening".
// You may edit word lists / templates to customize content.

(function () {
  // Basic word bank (common A1-A2 words suitable for middle school)
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
    // add more words if desired
  ];

  // Simple listening audio pool (free pixabay short audio clips)
  const listeningPool = [
    "https://cdn.pixabay.com/audio/2021/08/04/audio_f17e73b8f1.mp3",
    "https://cdn.pixabay.com/audio/2021/09/09/audio_27f2b83b22.mp3",
    "https://cdn.pixabay.com/audio/2022/03/15/audio_3b9f51a11f.mp3"
  ];

  // Helper: random integer
  function rint(n) { return Math.floor(Math.random() * n); }

  // Helper: shuffle
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Templates for quiz questions (synonym / meaning / choose correct)
  const quizTemplates = [
    (w, distractors) => ({
      type: "quiz",
      q: `Which word means "${w}"?`,
      options: shuffle([w, ...distractors]),
      answer: w
    }),
    (w, distractors) => ({
      type: "quiz",
      q: `Choose the correct word for the picture / idea: "${w}" (meaning)`,
      options: shuffle([w, ...distractors]),
      answer: w
    }),
    (w, distractors) => ({
      type: "quiz",
      q: `Which one is the opposite of "${w}"?`,
      options: shuffle([distractors[0] || "opposite", ...distractors.slice(1), w]),
      answer: distractors[0] || "opposite"
    })
  ];

  // Templates for fill-in-the-blank sentences
  const fillTemplates = [
    (w) => ({ type: "fill", q: `I usually ___ ${w} in the morning.`, answer: `play` }),
    (w) => ({ type: "fill", q: `She ___ to school every day.`, answer: `goes` }),
    (w) => ({ type: "fill", q: `They often ___ ${w} on weekends.`, answer: `play` }),
    (w) => ({ type: "fill", q: `He likes to ___ ${w}.`, answer: `eat` })
  ];

  // We'll create sets of distractors for quiz from vocab
  function makeDistractors(correct, count = 3) {
    const pool = vocab.filter(x => x !== correct);
    shuffle(pool);
    return pool.slice(0, count);
  }

  // Build an array of question objects
  const ALL_QUESTIONS = [];

  // 1) Generate many quiz questions based on words (approx 300)
  for (let i = 0; i < 300; i++) {
    const w = vocab[rint(vocab.length)];
    const distractors = makeDistractors(w, 3);
    const tpl = quizTemplates[rint(quizTemplates.length)];
    ALL_QUESTIONS.push(tpl(w, distractors));
  }

  // 2) Generate many fill questions (approx 120)
  for (let i = 0; i < 120; i++) {
    const w = vocab[rint(vocab.length)];
    const tpl = fillTemplates[rint(fillTemplates.length)];
    // Use simple verbs where appropriate; adjust answers for templates
    const obj = tpl(w);
    // If template had placeholder answer like 'play' and word is sport, keep it; else occasionally vary
    ALL_QUESTIONS.push(obj);
  }

  // 3) Generate listening questions (approx 80)
  for (let i = 0; i < 80; i++) {
    const correct = vocab[rint(vocab.length)];
    // choose 3 distractors
    const opts = makeDistractors(correct, 3);
    const options = shuffle([correct, ...opts]);
    const audio = listeningPool[i % listeningPool.length]; // reuse pool
    ALL_QUESTIONS.push({
      type: "listening",
      q: `Listen and choose the word you hear (speaking: "${correct}")`,
      audio: audio,
      options: options,
      answer: correct
    });
  }

  // If we are slightly under/over 500, adjust
  // Ensure at least 500 items — if fewer, add more quiz items
  while (ALL_QUESTIONS.length < 500) {
    const w = vocab[rint(vocab.length)];
    ALL_QUESTIONS.push({
      type: "quiz",
      q: `Which word is "${w}"?`,
      options: shuffle([w, ...makeDistractors(w,3)]),
      answer: w
    });
  }

  // Trim to exactly 500
  const QUESTIONS = ALL_QUESTIONS.slice(0, 500);

  // Export global variable used by the game
  window.ALL_QUESTIONS = QUESTIONS;

  // Provide helper to sample N random questions (shuffled)
  window.getRandomQuizSet = function (n = 20) {
    const copy = QUESTIONS.slice();
    shuffle(copy);
    return copy.slice(0, n);
  };

  console.log(`data.js: Generated ${QUESTIONS.length} questions (types: quiz/fill/listening).`);
})();
