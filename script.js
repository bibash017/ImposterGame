

let playerCount = 4;
let mode = null;
let playerNames = [];
let editingIndex = -1;

const modeDescs = {
  easy:   "common, familiar words — great for mixed groups",
  medium: "a bit trickier, vague hints",
  hard:   "abstract words, barely-there hints"
};

function initNames(n) {
  while (playerNames.length < n) {
    playerNames.push("player " + (playerNames.length + 1));
  }
  playerNames = playerNames.slice(0, n);
}

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

function setMode(m) {
  mode = m;
  document.getElementById("mEasy").className = "mode-btn" + (m === "easy"   ? " active-easy"   : "");
  document.getElementById("mMed").className  = "mode-btn" + (m === "medium" ? " active-medium" : "");
  document.getElementById("mHard").className = "mode-btn" + (m === "hard"   ? " active-hard"   : "");
  const desc = document.getElementById("modeDesc");
  desc.textContent = modeDescs[m];
  desc.style.color = "#3a3a38";
}

function renderPlayers() {
  const list = document.getElementById("playerList");
  list.innerHTML = "";

  for (let i = 0; i < playerCount; i++) {
    const row = document.createElement("div");
    row.className = "player-row";

    const num = document.createElement("span");
    num.className = "player-num";
    num.textContent = i + 1;

    if (editingIndex === i) {
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
      setTimeout(() => inp.focus(), 10);

    } else {
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

function saveEdit(i, val) {
  playerNames[i] = val.trim() || ("player " + (i + 1));
  editingIndex = -1;
  renderPlayers();
}

async function startGame() {
  if (!mode) {
    const desc = document.getElementById("modeDesc");
    desc.textContent = "← pick a difficulty first";
    desc.style.color = "#d85a30";
    return;
  }

  const btn = document.getElementById("startBtn");
  const loadingMsg = document.getElementById("loadingMsg");
  btn.disabled = true;
  loadingMsg.textContent = "fetching word...";
  loadingMsg.style.color = "#5f5e5a";

  try {
    const result = await getWordAndHint(mode);

    sessionStorage.setItem("word",        result.word);
    sessionStorage.setItem("hint",        result.hint);
    sessionStorage.setItem("mode",        mode);
    sessionStorage.setItem("playerCount", playerCount);
    sessionStorage.setItem("playerNames", JSON.stringify(playerNames));

    loadingMsg.textContent = "got it! starting...";

    setTimeout(() => {
      window.location.href = "game.html";
    }, 600);

  } catch (err) {
    console.error(err);
    loadingMsg.textContent = "something went wrong. try again.";
    loadingMsg.style.color = "#d85a30";
    btn.disabled = false;
  }
}

// Init
initNames(playerCount);
buildCountButtons();
renderPlayers();