let playerCount = 4; 
let mode = null; 
let playerNames = []; 
let editingIndex = 1; 

// ── Difficulty descriptions ──
const modeDescs = {
  easy:   'common, familiar words — great for mixed groups',
  medium: 'a bit trickier, vague hints',
  hard:   'abstract words, barely-there hints'
};

// ── Fill playerNames array up to n players ──
// If n grows, add new default names. If n shrinks, trim the array.
function initNames(n) {
  while (playerNames.length < n) {
    playerNames.push('Player ' + (playerNames.length + 1));
  }
  playerNames = playerNames.slice(0, n);
}

// ── Build the 2–10 player count buttons ──
function buildCountButtons() {
  const row = document.getElementById('countRow');
  row.innerHTML = '';
 
  for (let i = 2; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.className = 'count-btn' + (i === playerCount ? ' active' : '');
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
 
  document.getElementById('mEasy').className = 'mode-btn' + (m === 'easy'   ? ' active-easy'   : '');
  document.getElementById('mMed').className  = 'mode-btn' + (m === 'medium' ? ' active-medium' : '');
  document.getElementById('mHard').className = 'mode-btn' + (m === 'hard'   ? ' active-hard'   : '');
 
  const desc = document.getElementById('modeDesc');
  desc.textContent = modeDescs[m];
  desc.style.color = '#888780';
}

// ── Render the player list ──
function renderPlayers() {
  const list = document.getElementById('playerList');
  list.innerHTML = '';
 
  for (let i = 0; i < playerCount; i++) {
    const row = document.createElement('div');
    row.className = 'player-row';
 
    // player number on the left
    const num = document.createElement('span');
    num.className = 'player-num';
    num.textContent = i + 1;
 
    if (editingIndex === i) {
      // ── Edit mode: show input + save button ──
      const inp = document.createElement('input');
      inp.className = 'player-input';
      inp.value = playerNames[i];
      inp.maxLength = 18;
      inp.onkeydown = (e) => {
        if (e.key === 'Enter')  saveEdit(i, inp.value);
        if (e.key === 'Escape') { editingIndex = -1; renderPlayers(); }
      };
 
      const saveBtn = document.createElement('button');
      saveBtn.className = 'save-btn';
      saveBtn.textContent = 'save';
      saveBtn.onclick = () => saveEdit(i, inp.value);
 
      row.appendChild(num);
      row.appendChild(inp);
      row.appendChild(saveBtn);
 
      // auto-focus the input after render
      setTimeout(() => inp.focus(), 10);
 
    } else {
      // ── Display mode: show name + rename button ──
      const name = document.createElement('span');
      name.className = 'player-name-display';
      name.textContent = playerNames[i];
 
      const editBtn = document.createElement('button');
      editBtn.className = 'rename-btn';
      editBtn.title = 'rename';
      editBtn.innerHTML = '✎';
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
  // if empty, fall back to default name
  playerNames[i] = val.trim() || ('player ' + (i + 1));
  editingIndex = -1;
  renderPlayers();
}

// ── Start the game ──
function startGame() {
  // make sure a difficulty was chosen
  if (!mode) {
    const desc = document.getElementById('modeDesc');
    desc.textContent = '← pick a difficulty first';
    desc.style.color = '#d85a30';
    return;
  }
 
  // TODO: pass playerCount, playerNames, mode to the card screen
  // for now just log it so you can see everything is working
  console.log('players:', playerNames);
  console.log('count:', playerCount);
  console.log('mode:', mode);
 
  alert('Ready! ' + playerCount + ' players, ' + mode + ' mode.\nCard screen coming next.');
}

// ── Init on page load ──
initNames(playerCount);
buildCountButtons();
renderPlayers();