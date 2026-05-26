"use strict";

const fileInput = document.querySelector("#fileInput");
const dropZone = document.querySelector("#dropZone");
const uploadStatus = document.querySelector("#uploadStatus");
const message = document.querySelector("#message");
const programGrid = document.querySelector("#programGrid");

const bundledPrograms = [
  {
    fileName: "pgm1.txt",
    title: "Candidate-Elimination",
    description: "Learns the specific and general hypotheses from training data.",
  },
  {
    fileName: "pgm2.txt",
    title: "A* Search Algorithm",
    description: "Finds the shortest path using a heuristic and a priority queue.",
  },
  {
    fileName: "Pgm3.txt",
    title: "Simple Linear Regression",
    description: "Implements least squares linear regression for prediction.",
  },
  {
    fileName: "pgm4.txt",
    title: "Decision Tree Classification",
    description: "Builds a decision tree classifier and evaluates predictions.",
  },
  {
    fileName: "pgm5.txt",
    title: "Back Propagation",
    description: "Uses a neural network to predict stock prices.",
  },
  {
    fileName: "pgm6.txt",
    title: "Perceptron Learning",
    description: "Trains a perceptron model on binary input data.",
  },
  {
    fileName: "pgm7.txt",
    title: "Naive Bayes Classification",
    description: "Uses categorical features to classify the target output.",
  },
  {
    fileName: "pgm8.txt",
    title: "Random Forest Classification",
    description: "Trains an ensemble classifier on the Iris dataset.",
  },
  {
    fileName: "pgm9.txt",
    title: "K-Means and GMM Clustering",
    description: "Compares clustering models with silhouette scores.",
  },
  {
    fileName: "pgm10.txt",
    title: "K-Nearest Neighbors",
    description: "Classifies Iris flower samples using nearest neighbors.",
  },
];

let programs = [];
let messageTimer;

// Keep the gallery in the requested white theme.
localStorage.setItem("program-gallery-theme", "light");
loadBundledPrograms();

fileInput.addEventListener("change", () => {
  addUploadedFiles([...fileInput.files]);
  fileInput.value = "";
});

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("drag-over");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("drag-over");
  });
});

dropZone.addEventListener("drop", (event) => {
  addUploadedFiles([...event.dataTransfer.files]);
});

async function loadBundledPrograms() {
  uploadStatus.textContent = "Loading uploaded text files...";

  try {
    const loadedPrograms = await Promise.all(
      bundledPrograms.map(async (program) => {
        const response = await fetch(encodeURI(program.fileName));

        if (!response.ok) {
          throw new Error(`Could not load ${program.fileName}`);
        }

        const code = await response.text();
        return {
          ...program,
          id: crypto.randomUUID(),
          number: getProgramNumber(program.fileName),
          code,
          size: new Blob([code]).size,
        };
      })
    );

    programs = loadedPrograms;
    renderPrograms();
    uploadStatus.textContent = `${programs.length} programs loaded from this folder`;
  } catch {
    uploadStatus.textContent = "Open with http://localhost:5500/index.html to load folder files";
    showMessage("The cards need the local server URL, or you can add files manually.", true);
  }
}

function addUploadedFiles(files) {
  const textFiles = files.filter((file) => /\.txt$/i.test(file.name));

  if (textFiles.length !== files.length) {
    showMessage("Only .txt files are accepted.", true);
  }

  textFiles.forEach((file) => {
    const reader = new FileReader();

    reader.onload = () => {
      programs.push({
        id: crypto.randomUUID(),
        number: getProgramNumber(file.name) || programs.length + 1,
        fileName: file.name,
        title: makeTitleFromFileName(file.name),
        description: "Added from your device.",
        code: String(reader.result ?? ""),
        size: file.size,
      });

      renderPrograms();
      uploadStatus.textContent = `${programs.length} programs loaded`;
      showMessage(`${file.name} added successfully.`);
    };

    reader.onerror = () => {
      showMessage(`Could not read ${file.name}.`, true);
    };

    reader.readAsText(file);
  });
}

function renderPrograms() {
  programGrid.innerHTML = "";

  programs.forEach((program) => {
    const card = document.createElement("article");
    card.className = "program-card";

    const head = document.createElement("div");
    head.className = "card-head";

    const copyButton = document.createElement("button");
    copyButton.className = "copy-code";
    copyButton.type = "button";
    copyButton.textContent = "Copy code";
    copyButton.addEventListener("click", () => copyProgramCode(program.code, copyButton));

    const info = document.createElement("div");
    info.innerHTML = `
      <span class="program-tag">Program ${program.number}</span>
      <h2 class="card-title"></h2>
      <div class="card-meta">
        <span></span>
        <span></span>
      </div>
    `;

    info.querySelector(".card-title").textContent = program.title;
    const metaRows = info.querySelectorAll(".card-meta span");
    metaRows[0].textContent = program.description;
    metaRows[1].textContent = `${program.fileName} | ${formatFileSize(program.size)}`;

    const frame = document.createElement("div");
    frame.className = "code-frame";

    const pre = document.createElement("pre");
    pre.className = "line-numbers";

    const code = document.createElement("code");
    code.className = "language-python";
    code.textContent = program.code;

    pre.appendChild(code);
    frame.appendChild(pre);
    head.append(info, copyButton);
    card.append(head, frame);
    programGrid.appendChild(card);

    Prism.highlightElement(code);
  });
}

async function copyProgramCode(code, button) {
  try {
    await navigator.clipboard.writeText(code);
    showCopiedState(button);
  } catch {
    fallbackCopy(code, button);
  }
}

function fallbackCopy(code, button) {
  // Older or restricted browsers may not expose navigator.clipboard.
  const textarea = document.createElement("textarea");
  textarea.value = code;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.inset = "-9999px auto auto -9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (copied) {
    showCopiedState(button);
  } else {
    showMessage("Copy failed. Please try again.", true);
  }
}

function showCopiedState(button) {
  showMessage("Code copied successfully!");
  button.textContent = "Copied!";

  window.setTimeout(() => {
    button.textContent = "Copy code";
  }, 1600);
}

function formatFileSize(bytes) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const sizeIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** sizeIndex;
  return `${size.toFixed(size >= 10 || sizeIndex === 0 ? 0 : 1)} ${units[sizeIndex]}`;
}

function makeTitleFromFileName(name) {
  return name.replace(/\.txt$/i, "").replace(/[-_]+/g, " ");
}

function getProgramNumber(name) {
  const match = name.match(/pgm\s*(\d+)|program\s*(\d+)/i);
  return match ? Number(match[1] || match[2]) : null;
}

function showMessage(text, isError = false) {
  window.clearTimeout(messageTimer);
  message.textContent = text;
  message.classList.toggle("error", isError);

  messageTimer = window.setTimeout(() => {
    message.textContent = "";
    message.classList.remove("error");
  }, 3200);
}
