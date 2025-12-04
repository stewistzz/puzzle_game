/* game.js
   Implements 5 simple interactive levels tailored for SD kelas 2.
   - Level 1: Pilih gambar yang cocok (multiple choice)
   - Level 2: Memory matching (pair matching)
   - Level 3: Sambung kata (susun kata dari huruf)
   - Level 4: Labirin mini (klik jalur dari Start -> Goal) -- revisi
   - Level 5: Wordsearch sederhana (temukan kata terkait hobi) -- revisi  agar tampilan lebih sederhana dan katanya tidak terpotong
   At the end: tampilkan total skor + tombol main lagi atau kembali ke Home.
*/

(() => {
  // DATA sederhana (emoji sebagai pengganti gambar)
  const hobbies = [
    { key: "membaca", label: "Membaca", img: "./assets/img/games/13.png" },
    { key: "melukis", label: "Melukis", img: "./assets/img/games/14.png" },
    { key: "memasak", label: "Memasak", img: "./assets/img/games/15.png" },
    { key: "berenang", label: "Berenang", img: "./assets/img/games/16.png" },
    { key: "menyanyi", label: "Menyanyi", img: "./assets/img/games/17.png" },
    { key: "olahraga", label: "Olahraga", img: "./assets/img/games/18.png" },
    { key: "bermain", label: "Bermain", img: "./assets/img/games/19.png" },
    { key: "memancing", label: "Memancing", img: "./assets/img/games/20.png" },
  ];

  const gambarHobi = {
    membaca: "./assets/img/icons/5.png",
    melukis: "./assets/img/icons/6.png",
    memasak: "./assets/img/icons/7.png",
    berenang: "./assets/img/icons/8.png",
    menyanyi: "./assets/img/icons/9.png",
    olahraga: "./assets/img/icons/10.png",
    bermain: "./assets/img/icons/11.png",
    memancing: "./assets/img/icons/12.png",
  };

  // level config
  const LEVELS = 5;
  let state = {
    current: 1,
    score: 0,
    screen: document.getElementById("game-screen"),
    timer: null,
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
      case 1:
        renderLevel1(card);
        break;
      case 2:
        renderLevel2(card);
        break;
      case 3:
        renderLevel3(card);
        break;
      case 4:
        renderLevel4(card);
        break;
      case 5:
        renderLevel5(card);
        break;
      default:
        showEnd();
        break;
    }
  }

  /* ---------- LEVEL 1: Pilihan gambar berdasarkan hobi ---------- */
  function renderLevel1(container) {
    container.innerHTML = "";

    const q = el(
      "div",
      "q-text",
      "Pilih gambar yang sesuai dengan hobi berikut:"
    );

    const rndIndex = Math.floor(Math.random() * hobbies.length);
    const target = hobbies[rndIndex];

    // Prompt menampilkan gambar target
    const prompt = el(
      "div",
      "q-text",
      `<img src="${target.img}" class="prompt-img">`
    );

    container.appendChild(q);
    container.appendChild(prompt);

    // Buat opsi (1 benar + 3 random)
    let options = [target];
    while (options.length < 4) {
      const cand = hobbies[Math.floor(Math.random() * hobbies.length)];
      if (!options.find((o) => o.key === cand.key)) options.push(cand);
    }

    // Shuffle
    options = options.sort(() => Math.random() - 0.5);

    const grid = el("div", "options-grid");

    options.forEach((opt) => {
      const imgSrc = gambarHobi[opt.key];

      const o = el(
        "div",
        "opt",
        `<img src="${imgSrc}" class="opt-img">
       <div style="font-weight:800">${opt.label}</div>`
      );

      o.addEventListener("click", () => {
        if (opt.key === target.key) {
          o.classList.add("correct");
          addScore(10);
          nextAfterDelay();
        } else {
          o.classList.add("wrong");
          addScore(-2);

          // Tunjukkan jawaban benar
          Array.from(grid.children).forEach((c) => {
            if (c.innerText.includes(target.label)) c.classList.add("correct");
          });

          // 🔥 Tidak naik level, tapi ulang Level 1
          setTimeout(() => {
            renderLevel1(container); // ulang game ini
          }, 900);
        }
      });

      grid.appendChild(o);
    });

    container.appendChild(grid);
    container.appendChild(
      el(
        "div",
        "status-row",
        `<div class="small-muted">Level 1 — +10 poin benar</div>`
      )
    );
  }
  /* ---------- LEVEL 1: Pilihan gambar berdasarkan hobi ---------- */
  function renderLevel1(container) {
    container.innerHTML = "";

    const q = el(
      "div",
      "q-text",
      "Pilih gambar yang sesuai dengan hobi berikut:"
    );

    const rndIndex = Math.floor(Math.random() * hobbies.length);
    const target = hobbies[rndIndex];

    // Prompt menampilkan gambar target
    const prompt = el(
      "div",
      "q-text",
      `<img src="${target.img}" class="prompt-img">`
    );

    container.appendChild(q);
    container.appendChild(prompt);

    // Buat opsi (1 benar + 3 random)
    let options = [target];
    while (options.length < 4) {
      const cand = hobbies[Math.floor(Math.random() * hobbies.length)];
      if (!options.find((o) => o.key === cand.key)) options.push(cand);
    }

    // Shuffle
    options = options.sort(() => Math.random() - 0.5);

    const grid = el("div", "options-grid");

    options.forEach((opt) => {
      const imgSrc = gambarHobi[opt.key];

      const o = el(
        "div",
        "opt",
        `<img src="${imgSrc}" class="opt-img">
       <div style="font-weight:800">${opt.label}</div>`
      );

      o.addEventListener("click", () => {
        if (opt.key === target.key) {
          o.classList.add("correct");
          addScore(10);
          nextAfterDelay();
        } else {
          o.classList.add("wrong");
          addScore(-2);

          // Tunjukkan jawaban benar
          Array.from(grid.children).forEach((c) => {
            if (c.innerText.includes(target.label)) c.classList.add("correct");
          });

          // 🔥 Tidak naik level, tapi ulang Level 1
          setTimeout(() => {
            renderLevel1(container); // ulang game ini
          }, 900);
        }
      });

      grid.appendChild(o);
    });

    container.appendChild(grid);
    container.appendChild(
      el(
        "div",
        "status-row",
        `<div class="small-muted">Level 1 — +10 poin benar</div>`
      )
    );
  }

  /* ---------- LEVEL 2: Memory matching ---------- */
  function renderLevel2(container) {
    container.innerHTML = "";
    container.appendChild(
      el("div", "q-text", "Pasangkan kartu yang memiliki gambar sama!")
    );

    // Ambil 3 hobi random → total 6 kartu (pair)
    const shuffled = hobbies.sort(() => Math.random() - 0.5).slice(0, 3);
    let cards = [];

    shuffled.forEach((h) => {
      cards.push({ id: randId(), key: h.key, img: h.img });
      cards.push({ id: randId(), key: h.key, img: h.img });
    });

    // Shuffle kartu
    cards = cards.sort(() => Math.random() - 0.5);

    const grid = el("div", "memory-grid");
    container.appendChild(grid);

    let first = null;
    let matched = 0;

    cards.forEach((c) => {
      const card = el("div", "card", "");
      card.dataset.key = c.key;
      card.dataset.id = c.id;

      // Gunakan gambar
      card.innerHTML = `
      <img src="${c.img}" class="memory-img">
    `;

      // awalnya disembunyikan (flip)
      card.style.filter = "grayscale(1)";
      card.addEventListener("click", () => {
        if (card.classList.contains("flipped")) return;
        flip(card);
      });

      grid.appendChild(card);
    });

    function flip(card) {
      if (first && first === card) return;

      card.classList.add("flipped");
      card.style.filter = "none";

      if (!first) {
        first = card;
      } else {
        // cek pasangan
        if (first.dataset.key === card.dataset.key) {
          first = null;
          matched += 1;
          addScore(8);

          if (matched === 3) {
            setTimeout(nextAfterDelay, 800);
          }
        } else {
          // salah
          addScore(-1);
          const a = first,
            b = card;
          first = null;

          setTimeout(() => {
            a.classList.remove("flipped");
            b.classList.remove("flipped");
            a.style.filter = "grayscale(1)";
            b.style.filter = "grayscale(1)";
          }, 700);
        }
      }
    }
  }

  /* ---------- LEVEL 3: Sambung Kata (susun huruf) ---------- */
  function renderLevel3(container) {
    container.innerHTML = "";

    // Ambil data hobi
    const wordObj = hobbies[Math.floor(Math.random() * hobbies.length)];
    const target = wordObj.label.toUpperCase();
    const smallImg = gambarHobi[wordObj.key]; // >>> ambil gambar kecil

    // Tampilkan soal + gambar kecil
    container.appendChild(
      el(
        "div",
        "q-text",
        `
        Susun huruf untuk membentuk kata:<br>
        <img src="${smallImg}" style="width:170px; height:auto; margin-top:6px;" />
      `
      )
    );

    // area jawaban
    const answerDiv = el(
      "div",
      "q-text",
      "Jawaban: <span id='answerArea' style='letter-spacing:8px;font-size:20px'></span>"
    );
    container.appendChild(answerDiv);

    // huruf acak
    const letters = target.replace(/\s+/g, "").split("");

    // ekstra huruf (opsional)
    const extra = "ABCD"
      .split("")
      .slice(0, Math.min(2, Math.max(0, 5 - letters.length)));

    let pool = letters.concat(extra).sort(() => Math.random() - 0.5);

    const lettersWrap = el("div", "letters");
    container.appendChild(lettersWrap);

    let chosen = [];

    pool.forEach((ch) => {
      const b = el("div", "letter", ch);
      b.addEventListener("click", () => {
        chosen.push(ch);
        updateAnswer();
        b.style.opacity = "0.35";
        b.style.pointerEvents = "none";
      });
      lettersWrap.appendChild(b);
    });

    // tombol kontrol
    const controls = el("div", "controls");
    const checkBtn = el("button", "control-btn", "Periksa");
    const resetBtn = el("button", "control-btn", "Reset");
    controls.appendChild(checkBtn);
    controls.appendChild(resetBtn);
    container.appendChild(controls);

    // cek jawaban
    checkBtn.addEventListener("click", () => {
      const formed = chosen.join("").replace(/\s+/g, "");
      if (formed === target.replace(/\s+/g, "")) {
        addScore(12);
        alert("Bagus! Jawaban benar +12 poin");
        nextAfterDelay();
      } else {
        addScore(-2);
        alert("Belum benar, coba lagi (–2 poin)");
      }
    });

    // reset jawaban
    resetBtn.addEventListener("click", () => {
      chosen = [];
      Array.from(lettersWrap.children).forEach((c) => {
        c.style.opacity = 1;
        c.style.pointerEvents = "auto";
      });
      updateAnswer();
    });

    function updateAnswer() {
      document.getElementById("answerArea").innerText = chosen.join(" ");
    }
  }

  /* ---------- LEVEL 4 (SCORING BY PATH LENGTH) ---------- */
  function renderLevel4(container) {
    container.innerHTML = "";
    container.appendChild(
      el(
        "div",
        "q-text",
        "Klik jalur dari <strong>Start</strong> ke <strong>Goal</strong> dengan bergerak selangkah demi selangkah!"
      )
    );

    const cols = 7,
      rows = 5;

    const layout = [
      0,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      "S",
      0,
      0,
      1,
      0,
      0,
      "G",
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const gridWrap = el("div", "maze-grid");
    container.appendChild(gridWrap);

    let cells = [];
    let playerPos = null;
    let steps = 0; // 🔥 jumlah langkah pemain

    // Render Maze
    layout.forEach((v, i) => {
      const c = el("div", "cell");

      if (v === 1) {
        c.classList.add("wall");
      } else if (v === "S") {
        c.classList.add("start");
        c.innerText = "S";
        playerPos = i;
      } else if (v === "G") {
        c.classList.add("goal");
        c.innerHTML = "🏁";
      }

      c.dataset.index = i;
      gridWrap.appendChild(c);
      cells.push(c);
    });

    // highlight start
    cells[playerPos].classList.add("path");

    // 🔥 Hitung jalur terpendek otomatis (BFS)
    const shortest = computeShortestPath(playerPos, layout.indexOf("G"));
    console.log("Shortest path length =", shortest);

    // Click handler
    gridWrap.addEventListener("click", (ev) => {
      const cell = ev.target.closest(".cell");
      if (!cell) return;

      const idx = Number(cell.dataset.index);
      const value = layout[idx];

      if (value === 1) return;

      if (!isAdjacent(playerPos, idx, cols)) {
        addScore(-1);
        cell.style.transform = "scale(.92)";
        setTimeout(() => (cell.style.transform = ""), 120);
        return;
      }

      // Valid move
      steps++; // 🔥 tambah langkah
      playerPos = idx;
      cell.classList.add("path");

      // Sampai Goal
      if (value === "G") {
        const score = computeScore(shortest, steps);
        addScore(score);

        setTimeout(() => {
          alert(
            `Selamat! Kamu mencapai tujuan.\nLangkahmu: ${steps}\nSkor: +${score}`
          );
          nextAfterDelay();
        }, 250);
      }
    });

    // Helper adjacency
    function isAdjacent(a, b, cols) {
      if (b === a - cols) return true;
      if (b === a + cols) return true;
      if (b === a - 1 && Math.floor(a / cols) === Math.floor(b / cols))
        return true;
      if (b === a + 1 && Math.floor(a / cols) === Math.floor(b / cols))
        return true;
      return false;
    }

    // 🔥 BFS shortest path
    function computeShortestPath(start, goal) {
      const q = [[start, 0]];
      const visited = new Set([start]);

      while (q.length) {
        const [pos, dist] = q.shift();

        if (pos === goal) return dist;

        const neighbors = [pos - cols, pos + cols, pos - 1, pos + 1];

        for (let n of neighbors) {
          if (
            layout[n] !== 1 &&
            n >= 0 &&
            n < layout.length &&
            !visited.has(n) &&
            isAdjacent(pos, n, cols)
          ) {
            visited.add(n);
            q.push([n, dist + 1]);
          }
        }
      }
      return 999; // jika gagal (tidak mungkin terjadi)
    }

    // 🔥 Rumus skor berdasarkan efisiensi rute
    function computeScore(shortest, steps) {
      const ratio = shortest / steps;
      let score = Math.round(ratio * 20);
      if (score < 5) score = 5; // minimal
      return score;
    }
  }

  /* ---------- LEVEL 5 (NEW FIXED): Wordsearch Tanpa Conflict ---------- */
  function renderLevel5(container) {
    container.innerHTML = "";
    container.appendChild(
      el(
        "div",
        "q-text",
        "Temukan kata-kata tentang hobi! Klik huruf berurutan lalu tekan 'Cek'"
      )
    );

    // Ambil 3 hobi -> uppercase tanpa spasi
    const words = hobbies
      .slice(0, 3)
      .map((h) => h.label.toUpperCase().replace(/\s+/g, ""));

    const longest = Math.max(...words.map((w) => w.length));
    const size = Math.max(8, longest); // minimal grid 8x8

    // Buat grid kosong
    const grid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => "")
    );

    // Fungsi untuk menempatkan kata dengan aman
    function placeWord(word) {
      const len = word.length;
      let attempts = 0;

      while (attempts < 500) {
        attempts++;

        const horizontal = Math.random() < 0.5;

        if (horizontal) {
          const row = rand(0, size - 1);
          const col = rand(0, size - len);

          // Cek conflict
          let valid = true;
          for (let i = 0; i < len; i++) {
            const cell = grid[row][col + i];
            if (cell !== "" && cell !== word[i]) {
              valid = false;
              break;
            }
          }
          if (!valid) continue;

          // Tempatkan kata
          for (let i = 0; i < len; i++) {
            grid[row][col + i] = word[i];
          }
          return;
        }

        // Vertical
        const row = rand(0, size - len);
        const col = rand(0, size - 1);

        let valid = true;
        for (let i = 0; i < len; i++) {
          const cell = grid[row + i][col];
          if (cell !== "" && cell !== word[i]) {
            valid = false;
            break;
          }
        }
        if (!valid) continue;

        // Tempatkan kata
        for (let i = 0; i < len; i++) {
          grid[row + i][col] = word[i];
        }
        return;
      }

      console.warn("Gagal menempatkan kata:", word);
    }

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Tempatkan semua kata
    words.forEach(placeWord);

    // Isi sisa grid dengan huruf acak
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === "") {
          grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    // Render UI
    const gridWrap = el("div", "wordsearch");
    gridWrap.style.gridTemplateColumns = `repeat(${size}, 32px)`;
    gridWrap.style.gridTemplateRows = `repeat(${size}, 32px)`;

    const cells = [];
    let clickSequence = [];

    grid.flat().forEach((ch, idx) => {
      const cell = el("div", "wcell", ch);
      cell.dataset.index = idx;

      cell.addEventListener("click", () => {
        cell.classList.toggle("selected");

        if (cell.classList.contains("selected")) {
          clickSequence.push(idx);
        } else {
          clickSequence = clickSequence.filter((i) => i !== idx);
        }
      });

      gridWrap.appendChild(cell);
      cells.push(cell);
    });

    container.appendChild(gridWrap);

    // Daftar kata
    container.appendChild(
      el(
        "div",
        "q-text",
        "Kata yang dicari:<br>" +
          words.map((w) => `<strong>${w}</strong>`).join(" | ")
      )
    );

    // Kontrol
    const controls = el("div", "controls");
    const cek = el("button", "control-btn", "Cek");
    const reset = el("button", "control-btn", "Reset");
    controls.appendChild(cek);
    controls.appendChild(reset);
    container.appendChild(controls);

    cek.addEventListener("click", () => {
      const selected = clickSequence.map((i) => cells[i].innerText).join("");

      let found = 0;
      words.forEach((w) => {
        if (selected.includes(w)) found++;
      });

      if (found > 0) {
        addScore(found * 20);
        alert(
          `Kerja bagus! Kamu menemukan ${found} kata! (+${found * 20} poin)`
        );
        clickSequence = [];
        nextAfterDelay();
      } else {
        addScore(-3);
        alert("Belum cocok! Coba lagi ya. (−3 poin)");
      }
    });

    reset.addEventListener("click", () => {
      gridWrap
        .querySelectorAll(".wcell.selected")
        .forEach((c) => c.classList.remove("selected"));

      clickSequence = [];
    });
  }

  /* ---------- helpers ---------- */
  function randId() {
    return Math.random().toString(36).slice(2, 9);
  }

  function addScore(n) {
    state.score = Math.max(0, state.score + n);
    // update header score if present
    const sb = document.querySelector(".score-badge");
    if (sb) sb.innerText = `Poin: ${state.score}`;
  }

  function nextAfterDelay() {
    // progress to next level; small delay to allow UI feedback
    setTimeout(() => {
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
    const endWrap = el("div", "end-screen");
    endWrap.innerHTML = `
      <h2 style="margin:6px 0;color:var(--secondary)">Selamat! Permainan selesai</h2>
      <div class="end-score">${state.score} Poin</div>
      <div class="small-muted">Kamu bisa main lagi untuk menambah skor atau kembali ke halaman utama.</div>
    `;
    const controls = el("div", "controls");
    const again = el("button", "control-btn", "Main Lagi");
    const home = el("button", "control-btn", "Kembali ke Halaman Utama");
    controls.appendChild(again);
    controls.appendChild(home);
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
    const top = el("div", "game-card");
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
