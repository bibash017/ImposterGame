// ── Game state ──
let playerCount = 4;
let mode = null;
let playerNames = [];
let editingIndex = -1;

// ── Difficulty descriptions ──
const modeDescs = {
  easy:   "Common, familiar words — great for mixed groups",
  medium: "A bit trickier, vague hints",
  hard:   "Abstract words, barely-there hints"
};


// ── Fill playerNames array up to n players ──
// If n grows, add new default names. If n shrinks, trim the array.
function initNames(n) {
  while (playerNames.length < n) {
    playerNames.push("player " + (playerNames.length + 1));
  }
  playerNames = playerNames.slice(0, n);
}


// ── Build the 2–10 player count buttons ──
function buildCountButtons() {
  const row = document.getElementById("countRow");
  row.innerHTML = "";

  for (let i = 2; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.className = "count-btn" + (i === playerCount ? " active" : "");
    btn.textContent = i;
    btn.onclick = () => {
      playerCount = i;
      initNames(i);
      buildCountButtons();
      renderPlayers();
    };
    row.appendChild(btn);
  }
}


// ── Set difficulty mode and update button styles ──
function setMode(m) {
  mode = m;

  document.getElementById("mEasy").className = "mode-btn" + (m === "easy"   ? " active-easy"   : "");
  document.getElementById("mMed").className  = "mode-btn" + (m === "medium" ? " active-medium" : "");
  document.getElementById("mHard").className = "mode-btn" + (m === "hard"   ? " active-hard"   : "");

  const desc = document.getElementById("modeDesc");
  desc.textContent = modeDescs[m];
  desc.style.color = "#3a3a38";
}


// ── Render the player list ──
function renderPlayers() {
  const list = document.getElementById("playerList");
  list.innerHTML = "";

  for (let i = 0; i < playerCount; i++) {
    const row = document.createElement("div");
    row.className = "player-row";

    // player number on the left
    const num = document.createElement("span");
    num.className = "player-num";
    num.textContent = i + 1;

    if (editingIndex === i) {
      // ── Edit mode: show input + save button ──
      const inp = document.createElement("input");
      inp.className = "player-input";
      inp.value = playerNames[i];
      inp.maxLength = 18;
      inp.onkeydown = (e) => {
        if (e.key === "Enter")  saveEdit(i, inp.value);
        if (e.key === "Escape") { editingIndex = -1; renderPlayers(); }
      };

      const saveBtn = document.createElement("button");
      saveBtn.className = "save-btn";
      saveBtn.textContent = "save";
      saveBtn.onclick = () => saveEdit(i, inp.value);

      row.appendChild(num);
      row.appendChild(inp);
      row.appendChild(saveBtn);

      // auto-focus the input after render
      setTimeout(() => inp.focus(), 10);

    } else {
      // ── Display mode: show name + rename button ──
      const name = document.createElement("span");
      name.className = "player-name-display";
      name.textContent = playerNames[i];

      const editBtn = document.createElement("button");
      editBtn.className = "rename-btn";
      editBtn.title = "rename";
      editBtn.innerHTML = "✎";
      editBtn.onclick = () => { editingIndex = i; renderPlayers(); };

      row.appendChild(num);
      row.appendChild(name);
      row.appendChild(editBtn);
    }

    list.appendChild(row);
  }
}


// ── Save a renamed player ──
function saveEdit(i, val) {
  playerNames[i] = val.trim() || ("Player " + (i + 1));
  editingIndex = -1;
  renderPlayers();
}


// ── Start the game ──
// This calls the Claude API to get a word, then would move to the card screen
async function startGame() {
  // make sure a difficulty was chosen
  if (!mode) {
    const desc = document.getElementById("modeDesc");
    desc.textContent = "← pick a difficulty first";
    desc.style.color = "#d85a30";
    return;
  }

  // disable button + show loading message while we fetch the word
  const btn = document.getElementById("startBtn");
  const loadingMsg = document.getElementById("loadingMsg");
  btn.disabled = true;
  loadingMsg.textContent = "fetching word...";

  try {
    // call Claude API (defined in words.js)
    const result = await getWordAndHint(mode);

    // store in sessionStorage so the card screen can access them
    sessionStorage.setItem("Word",        result.word);
    sessionStorage.setItem("Hint",        result.hint);
    sessionStorage.setItem("Mode",        mode);
    sessionStorage.setItem("PlayerCount", playerCount);
    sessionStorage.setItem("PlayerNames", JSON.stringify(playerNames));

    loadingMsg.textContent = "Got it! starting...";

    // small pause so the user sees the message, then go to card screen
    setTimeout(() => {
      window.location.href = "game.html";
    }, 600);

  } catch (err) {
    // something unexpected happened
    console.error(err);
    loadingMsg.textContent = "Something went wrong. try again.";
    loadingMsg.style.color = "#d85a30";
    btn.disabled = false;
  }
}


// ── Init on page load ──
initNames(playerCount);
buildCountButtons();
renderPlayers();