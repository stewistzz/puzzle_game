/* game.js
   Implements 5 simple interactive levels tailored for SD kelas 2.
   - Level 1: Pilih gambar yang cocok (multiple choice)
   - Level 2: Memory matching (pair matching)
   - Level 3: Sambung kata (susun kata dari huruf)
   - Level 4: Labirin mini (klik jalur dari Start -> Goal)
   - Level 5: Wordsearch sederhana (temukan kata terkait hobi)
   At the end: tampilkan total skor + tombol main lagi atau kembali ke Home.
*/

(() => {
  // DATA sederhana (emoji sebagai pengganti gambar)
  const hobbies = [
    { key: "membaca", label: "Membaca", emoji: "📚" },
    { key: "menulis", label: "Menulis", emoji: "✍️" },
    { key: "menggambar", label: "Menggambar", emoji: "🖍️" },
    { key: "melukis", label: "Melukis", emoji: "🎨" },
    { key: "memancing", label: "Memancing", emoji: "🎣" }
  ];

  // level config
  const LEVELS = 5;
  let state = {
    current: 1,
    score: 0,
    screen: document.getElementById("game-screen"),
    timer: null
  };

  // UTIL helpers
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function header() {
    const h = el("div", "game-header");
    const lvl = el("div", "level-badge", `Level ${state.current}`);
    const score = el("div", "score-badge", `Poin: ${state.score}`);
    h.appendChild(lvl);
    h.appendChild(score);
    return h;
  }

  // Render wrapper for a level
  function renderLevel() {
    state.screen.innerHTML = "";
    state.screen.appendChild(header());
    const card = el("div", "game-card");
    state.screen.appendChild(card);

    // switch level
    switch (state.current) {
      case 1: renderLevel1(card); break;
      case 2: renderLevel2(card); break;
      case 3: renderLevel3(card); break;
      case 4: renderLevel4(card); break;
      case 5: renderLevel5(card); break;
      default: showEnd(); break;
    }
  }

  /* ---------- LEVEL 1: Pilihan gambar sederhana ---------- */
  function renderLevel1(container) {
    container.innerHTML = "";
    const q = el("div", "q-text", "Pilih gambar yang sesuai dengan hobi berikut:");
    const rndIndex = Math.floor(Math.random() * hobbies.length);
    const target = hobbies[rndIndex];

    const prompt = el("div", "q-text", `<strong>${target.label}</strong> ${target.emoji}`);
    container.appendChild(q);
    container.appendChild(prompt);

    // build options (include correct + 3 random)
    let options = [target];
    while (options.length < 4) {
      const cand = hobbies[Math.floor(Math.random() * hobbies.length)];
      if (!options.find(o => o.key === cand.key)) options.push(cand);
    }
    // shuffle
    options = options.sort(() => Math.random() - 0.5);

    const grid = el("div", "options-grid");
    options.forEach(opt => {
      const o = el("div", "opt", `<span class="emoji">${opt.emoji}</span><div style="font-weight:800">${opt.label}</div>`);
      o.addEventListener("click", () => {
        if (opt.key === target.key) {
          o.classList.add("correct");
          addScore(10);
          nextAfterDelay();
        } else {
          o.classList.add("wrong");
          // small penalty
          addScore(-2);
          // allow retry but highlight correct
          // reveal correct
          Array.from(grid.children).forEach(c => {
            if (c.innerText.includes(target.label)) c.classList.add("correct");
          });
          setTimeout(nextAfterDelay, 900);
        }
      });
      grid.appendChild(o);
    });
    container.appendChild(grid);

    container.appendChild(el("div", "status-row", `<div class="small-muted">Level 1 — +10 poin benar</div>`));
  }

  /* ---------- LEVEL 2: Memory matching ---------- */
  function renderLevel2(container) {
    container.innerHTML = "";
    container.appendChild(el("div", "q-text", "Pasangkan kartu yang memiliki gambar sama!"));

    // create pairs using 3 random hobbies (so 6 cards)
    const shuffled = hobbies.sort(() => Math.random() - 0.5).slice(0,3);
    let cards = [];
    shuffled.forEach(h => {
      cards.push({id: randId(), key:h.key, emoji:h.emoji});
      cards.push({id: randId(), key:h.key, emoji:h.emoji});
    });
    cards = cards.sort(()=>Math.random()-0.5);

    const grid = el("div","memory-grid");
    container.appendChild(grid);

    let first = null;
    let matched = 0;

    cards.forEach(c => {
      const card = el("div","card","");
      card.dataset.key = c.key;
      card.dataset.id = c.id;
      card.innerHTML = `<div class="emoji" style="font-size:36px">${c.emoji}</div>`;
      // hide content initially
      card.style.filter = "grayscale(1)";
      card.addEventListener("click", () => {
        if (card.classList.contains("flipped")) return;
        flip(card);
      });
      grid.appendChild(card);
    });

    function flip(card){
      if (first && first === card) return;
      card.classList.add("flipped");
      card.style.filter = "none";
      if (!first) {
        first = card;
      } else {
        // compare
        if (first.dataset.key === card.dataset.key) {
          // matched
          first = null;
          matched += 1;
          addScore(8);
          if (matched === 3) {
            // level done
            setTimeout(nextAfterDelay, 800);
          }
        } else {
          // not matched
          addScore(-1);
          const a = first, b = card;
          first = null;
          setTimeout(()=> {
            a.classList.remove("flipped"); a.style.filter="grayscale(1)";
            b.classList.remove("flipped"); b.style.filter="grayscale(1)";
          },700);
        }
      }
    }
  }

  /* ---------- LEVEL 3: Sambung Kata (susun huruf) ---------- */
  function renderLevel3(container) {
    container.innerHTML = "";
    const wordObj = hobbies[Math.floor(Math.random()*hobbies.length)];
    const target = wordObj.label.toUpperCase();
    container.appendChild(el("div", "q-text", `Susun huruf untuk membentuk kata: <strong>Hobi ini: ${wordObj.emoji}</strong>`));
    const display = el("div", "game-card");
    const answerDiv = el("div","q-text","Jawaban: <span id='answerArea' style='letter-spacing:8px;font-size:20px'></span>");
    container.appendChild(answerDiv);

    // create jumbled letters (simple)
    const letters = target.replace(/\s+/g,'').split('');
    // add small shuffle and maybe extra distractor letters (up to +2)
    const extra = "ABCD".split('').slice(0, Math.min(2, Math.max(0,5-letters.length)));
    let pool = letters.concat(extra).sort(()=>Math.random()-0.5);

    const lettersWrap = el("div","letters");
    container.appendChild(lettersWrap);

    let chosen = [];

    pool.forEach((ch, idx) => {
      const b = el("div","letter",ch);
      b.addEventListener("click", () => {
        chosen.push(ch);
        updateAnswer();
        // disable clicked
        b.style.opacity = "0.35";
        b.style.pointerEvents = "none";
      });
      lettersWrap.appendChild(b);
    });

    const controls = el("div","controls");
    const checkBtn = el("button","control-btn","Periksa");
    const resetBtn = el("button","control-btn","Reset");
    controls.appendChild(checkBtn); controls.appendChild(resetBtn);
    container.appendChild(controls);

    checkBtn.addEventListener("click", () => {
      const formed = chosen.join('').replace(/\s+/g,'');
      if (formed === target.replace(/\s+/g,'')) {
        addScore(12);
        alert("Bagus! Jawaban benar +12 poin");
        nextAfterDelay();
      } else {
        addScore(-2);
        alert("Belum benar, coba lagi (–2 poin)");
      }
    });

    resetBtn.addEventListener("click", () => {
      chosen = [];
      // re-enable letters
      Array.from(lettersWrap.children).forEach(c => { c.style.opacity=1; c.style.pointerEvents='auto' });
      updateAnswer();
    });

    function updateAnswer(){
      document.getElementById("answerArea").innerText = chosen.join(' ');
    }
  }

  /* ---------- LEVEL 4: Labirin sederhana ---------- */
  function renderLevel4(container) {
    container.innerHTML = "";
    container.appendChild(el("div","q-text","Klik jalur dari <strong>Start</strong> ke <strong>Goal</strong> untuk menemukan hobi!"));
    // create a small 7x? grid with walls (simple preset)
    const gridWrap = el("div","maze-grid");
    container.appendChild(gridWrap);

    // simple maze layout array  (0 = open, 1 = wall)
    // we'll create a 7x5 (cols x rows) grid flattened
    const cols = 7, rows=5;
    // design a simple maze where a path exists from start (0,2) to goal (6,2)
    // We'll mark walls and allow clicking path cells to move; if clicks follow the correct path sequence allow progress
    const layout = [
      0,1,0,0,0,1,0,
      0,1,0,1,0,1,0,
      "S",0,0,1,0,0,"G", // row middle contains start and goal
      0,1,0,1,0,1,0,
      0,0,0,0,0,0,0
    ];
    // compute correct path (precomputed coordinates)
    const correctPathIdx = computePathIndices();

    const cells = [];
    layout.forEach((v,i) => {
      const c = el("div","cell");
      if (v === 1) { c.classList.add("wall"); c.innerText=""; }
      else if (v === "S") { c.classList.add("start"); c.innerText="S" }
      else if (v === "G") { c.classList.add("goal"); c.innerText="🏁" }
      else { c.innerText = ""; }
      c.dataset.index = i;
      gridWrap.appendChild(c);
      cells.push(c);
    });

    let progress = 0;
    // click handler — only allow clicking next correct index
    gridWrap.addEventListener("click", (ev) => {
      const cell = ev.target.closest(".cell");
      if (!cell || cell.classList.contains("wall")) return;
      const idx = Number(cell.dataset.index);
      // if clicked matches next correct index
      if (idx === correctPathIdx[progress]) {
        cell.classList.add("path");
        progress++;
        if (progress === correctPathIdx.length) {
          addScore(15);
          setTimeout(()=> {
            alert("Hebat! Kamu menemukan jalan :) +15 poin");
            nextAfterDelay();
          },300);
        }
      } else {
        // small penalty and feedback
        addScore(-1);
        cell.style.transform = "scale(.96)";
        setTimeout(()=> cell.style.transform="", 120);
      }
    });

    // helper to compute a simple path indices from S to G
    function computePathIndices(){
      // manual path based on layout shape above (hardcoded for reliability)
      // find index of 'S' and 'G'
      const s = layout.indexOf("S");
      const g = layout.indexOf("G");
      // simple route chosen: s -> s+1 -> s+2 ... -> g (only works for this small maze)
      // We'll return a simple series of indices that are not walls between s and g:
      // For our layout: positions: 14 is S, 16 is G (0-indexed)
      // We'll provide a known correct path (calculated visually)
      return [14,15,16,9,2,3,4,11,18,19,20];
 // works for designed grid (tested)
    }
  }

  /* ---------- LEVEL 5: Wordsearch kecil 5x5 ---------- */
  function renderLevel5(container) {
    container.innerHTML = "";
    container.appendChild(el("div","q-text","Temukan kata-kata tentang hobi! Klik huruf berurutan lalu tekan 'Cek'"));
    // simple 5x5 grid letters + 3 target words (horizontal/vertical)
    // We'll create grid and list of words from hobbies (3 words)
    const words = hobbies.slice(0,3).map(h => h.label.toUpperCase().replace(/\s+/g,''));
    // build a 5x5 letter matrix; to keep it simple, we place words into rows 0,2,4
    const matrix = [
      ...words[0].padEnd(5,'A').split(''),
      ...randomRow(),
      ...words[1].padEnd(5,'B').split(''),
      ...randomRow(),
      ...words[2].padEnd(5,'C').split('')
    ];
    function randomRow(){ return Array.from({length:5},()=>String.fromCharCode(65+Math.floor(Math.random()*26))); }

    const grid = el("div","wordsearch");
    matrix.forEach((ch, idx) => {
      const wc = el("div","wcell",ch);
      wc.dataset.i = idx;
      wc.addEventListener("click", () => {
        wc.classList.toggle("selected");
      });
      grid.appendChild(wc);
    });
    container.appendChild(grid);

    // show target words
    const targetsWrap = el("div","q-text","Kata yang dicari: <br>" + words.map(w=>`<strong>${w}</strong>`).join(" | "));
    container.appendChild(targetsWrap);

    const controls = el("div","controls");
    const cek = el("button","control-btn","Cek");
    const reset = el("button","control-btn","Reset Pilihan");
    controls.appendChild(cek); controls.appendChild(reset);
    container.appendChild(controls);

    cek.addEventListener("click", () => {
      // collect selected sequence as string by row order
      const selected = Array.from(grid.querySelectorAll(".wcell.selected")).map(n=>n.innerText).join('');
      // naive check: if selected contains any of the words
      let found = 0;
      words.forEach(w => {
        if (selected.includes(w)) found++;
      });
      if (found>0) {
        addScore(20 * found);
        alert(`Keren! Kamu menemukan ${found} kata. +${20*found} poin`);
        setTimeout(nextAfterDelay, 300);
      } else {
        addScore(-3);
        alert("Belum ketemu. Coba pilih huruf yang benar (−3 poin)");
      }
    });

    reset.addEventListener("click", () => {
      Array.from(grid.querySelectorAll(".wcell.selected")).forEach(c=>c.classList.remove("selected"));
    });
  }

  /* ---------- helpers ---------- */
  function randId(){ return Math.random().toString(36).slice(2,9); }

  function addScore(n) {
    state.score = Math.max(0, state.score + n);
    // update header score if present
    const sb = document.querySelector(".score-badge");
    if (sb) sb.innerText = `Poin: ${state.score}`;
  }

  function nextAfterDelay() {
    // progress to next level; small delay to allow UI feedback
    setTimeout(()=> {
      state.current++;
      if (state.current > LEVELS) {
        showEnd();
      } else {
        renderLevel();
      }
    }, 500);
  }

  /* ---------- END / FINAL SCREEN ---------- */
  function showEnd() {
    state.screen.innerHTML = "";
    const endWrap = el("div","end-screen");
    endWrap.innerHTML = `
      <h2 style="margin:6px 0;color:var(--secondary)">Selamat! Permainan selesai</h2>
      <div class="end-score">${state.score} Poin</div>
      <div class="small-muted">Kamu bisa main lagi untuk menambah skor atau kembali ke halaman utama.</div>
    `;
    const controls = el("div","controls");
    const again = el("button","control-btn","Main Lagi");
    const home = el("button","control-btn","Kembali ke Halaman Utama");
    controls.appendChild(again); controls.appendChild(home);
    endWrap.appendChild(controls);
    state.screen.appendChild(endWrap);

    again.addEventListener("click", () => {
      // reset and start from level 1
      state.current = 1;
      state.score = 0;
      renderLevel();
    });
    home.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  /* ---------- init ---------- */
  function init() {
    // initial render
    state.screen.innerHTML = "";
    // top quick controls
    const top = el("div","game-card");
    top.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
      <div style="font-weight:800">Permainan: Aku & Teman-temanku</div>
      <div><small class="small-muted">Tema: Hobi</small></div>
    </div>`;
    state.screen.appendChild(top);

    renderLevel();
  }

  // start
  init();

})();
