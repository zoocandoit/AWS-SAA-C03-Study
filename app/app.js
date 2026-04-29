const state = {
  bank: null,
  selectedSet: "all",
  searchTerm: "",
  revealAllAnswers: false,
  started: false,
  currentQuestionId: null,
};

const landingScreenEl = document.querySelector("#landing-screen");
const appScreenEl = document.querySelector("#app-screen");
const startButtonEl = document.querySelector("#start-button");
const setCountEl = document.querySelector("#set-count");
const questionCountEl = document.querySelector("#question-count");
const setFiltersEl = document.querySelector("#set-filters");
const questionListEl = document.querySelector("#question-list");
const resultsSummaryEl = document.querySelector("#results-summary");
const searchInputEl = document.querySelector("#search-input");
const randomButtonEl = document.querySelector("#random-button");
const restartButtonEl = document.querySelector("#restart-button");
const templateEl = document.querySelector("#question-template");

function parseAnswerNumbers(answer) {
  const matches = answer.match(/\d+/g) ?? [];
  return matches.map((value) => Number(value)).sort((a, b) => a - b);
}

function arraysEqual(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

function plainTextIncludes(text, term) {
  return text.toLowerCase().includes(term.toLowerCase());
}

function questionMatchesSearch(question, term) {
  if (!term) {
    return true;
  }

  const haystack = [
    question.title,
    question.prompt,
    question.answer,
    question.explanation,
    ...question.options,
    ...question.notes,
    ...question.keywords,
  ].join("\n");

  return plainTextIncludes(haystack, term);
}

function getVisibleQuestions() {
  const questions = state.bank?.questions ?? [];
  return questions.filter((question) => {
    const matchesSet = state.selectedSet === "all" || question.setId === state.selectedSet;
    return matchesSet && questionMatchesSearch(question, state.searchTerm);
  });
}

function pickRandomQuestion(excludedId = null) {
  const visibleQuestions = getVisibleQuestions();
  if (!visibleQuestions.length) {
    return null;
  }

  const pool = visibleQuestions.filter((question) => question.id !== excludedId);
  const source = pool.length ? pool : visibleQuestions;
  return source[Math.floor(Math.random() * source.length)];
}

function getCurrentQuestion() {
  const visibleQuestions = getVisibleQuestions();
  if (!visibleQuestions.length) {
    return null;
  }

  const found = visibleQuestions.find((question) => question.id === state.currentQuestionId);
  return found ?? visibleQuestions[0];
}

function renderFilters() {
  setFiltersEl.innerHTML = "";
  const allSets = [{ id: "all", label: "전체" }, ...(state.bank?.sets ?? []).map((setItem) => ({
    id: setItem.id,
    label: `${setItem.id} (${setItem.questionCount})`,
  }))];

  for (const item of allSets) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.textContent = item.label;
    if (item.id === state.selectedSet) {
      button.classList.add("is-active");
    }
    button.addEventListener("click", () => {
      state.selectedSet = item.id;
      const replacement = pickRandomQuestion();
      state.currentQuestionId = replacement?.id ?? null;
      render();
    });
    setFiltersEl.appendChild(button);
  }
}

function makeKeywordPills(keywords) {
  const fragment = document.createDocumentFragment();
  for (const keyword of keywords) {
    const pill = document.createElement("span");
    pill.className = "keyword-pill";
    pill.textContent = keyword;
    fragment.appendChild(pill);
  }
  return fragment;
}

function renderQuestionCard(question) {
  const fragment = templateEl.content.cloneNode(true);
  const card = fragment.querySelector(".question-card");
  const meta = fragment.querySelector(".question-meta");
  const title = fragment.querySelector(".question-title");
  const prompt = fragment.querySelector(".question-prompt");
  const optionList = fragment.querySelector(".option-list");
  const answerPanel = fragment.querySelector(".answer-panel");
  const answerText = fragment.querySelector(".answer-text");
  const explanationText = fragment.querySelector(".explanation-text");
  const noteList = fragment.querySelector(".note-list");
  const keywordRow = fragment.querySelector(".keyword-row");
  const revealButton = fragment.querySelector(".reveal-button");
  const checkAnswerButton = fragment.querySelector(".check-answer-button");
  const retryButton = fragment.querySelector(".retry-button");
  const feedbackBanner = fragment.querySelector(".feedback-banner");

  let revealed = state.revealAllAnswers;
  let submitted = false;
  const answerNumbers = parseAnswerNumbers(question.answer);
  const optionInputs = [];

  meta.textContent = `${question.setId} · 문제 ${question.questionNumber}`;
  title.textContent = question.title;
  prompt.textContent = question.prompt;
  answerText.textContent = question.answer;
  explanationText.textContent = question.explanation;

  for (const [index, option] of question.options.entries()) {
    const li = document.createElement("li");
    li.className = "option-item";
    const label = document.createElement("label");
    label.className = "option-label";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "option-checkbox";
    input.value = String(index + 1);
    const text = document.createElement("span");
    text.className = "option-text";
    text.textContent = option;

    input.addEventListener("change", () => {
      const selectedCount = optionInputs.filter((item) => item.checked).length;
      checkAnswerButton.disabled = selectedCount === 0;
    });

    optionInputs.push(input);
    label.append(input, text);
    li.appendChild(label);
    optionList.appendChild(li);
  }

  for (const note of question.notes) {
    const li = document.createElement("li");
    li.textContent = note;
    noteList.appendChild(li);
  }

  keywordRow.appendChild(makeKeywordPills(question.keywords));

  const syncRevealState = () => {
    answerPanel.classList.toggle("is-hidden", !revealed);
    revealButton.textContent = revealed ? "정답 숨기기" : "정답 보기";
    revealButton.disabled = !submitted;
  };

  const syncOptionState = () => {
    for (const input of optionInputs) {
      input.disabled = submitted;
    }
    retryButton.classList.toggle("is-hidden", !submitted);
  };

  const showFeedback = (isCorrect) => {
    feedbackBanner.classList.remove("is-hidden", "is-correct", "is-wrong");
    if (isCorrect) {
      feedbackBanner.textContent = "정답입니다. 잘 풀었어요.";
      feedbackBanner.classList.add("is-correct");
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("fanfare");
      window.setTimeout(() => card.classList.remove("fanfare"), 1100);
    } else {
      feedbackBanner.textContent = "틀렸습니다. 해설과 정답을 확인해보세요.";
      feedbackBanner.classList.add("is-wrong");
      card.classList.remove("fanfare", "shake");
      void card.offsetWidth;
      card.classList.add("shake");
      window.setTimeout(() => card.classList.remove("shake"), 520);
    }
  };

  const markOptions = (selectedNumbers, correctNumbers) => {
    for (const [index, input] of optionInputs.entries()) {
      const optionNumber = index + 1;
      const optionItem = input.closest(".option-item");
      const selected = selectedNumbers.includes(optionNumber);
      const correct = correctNumbers.includes(optionNumber);

      optionItem.classList.remove("is-selected", "is-correct", "is-wrong");
      if (selected) {
        optionItem.classList.add("is-selected");
      }
      if (correct) {
        optionItem.classList.add("is-correct");
      }
      if (selected && !correct) {
        optionItem.classList.add("is-wrong");
      }
    }
  };

  revealButton.addEventListener("click", () => {
    revealed = !revealed;
    syncRevealState();
  });

  checkAnswerButton.addEventListener("click", () => {
    const selectedNumbers = optionInputs
      .filter((input) => input.checked)
      .map((input) => Number(input.value))
      .sort((a, b) => a - b);

    if (!selectedNumbers.length) {
      checkAnswerButton.disabled = true;
      return;
    }

    submitted = true;
    const isCorrect = arraysEqual(selectedNumbers, answerNumbers);
    revealed = true;
    syncRevealState();
    syncOptionState();
    markOptions(selectedNumbers, answerNumbers);
    showFeedback(isCorrect);
  });

  retryButton.addEventListener("click", () => {
    submitted = false;
    revealed = false;
    feedbackBanner.classList.add("is-hidden");
    feedbackBanner.classList.remove("is-correct", "is-wrong");
    checkAnswerButton.disabled = true;

    for (const input of optionInputs) {
      input.checked = false;
      const optionItem = input.closest(".option-item");
      optionItem.classList.remove("is-selected", "is-correct", "is-wrong");
    }

    syncRevealState();
    syncOptionState();
  });

  syncRevealState();
  syncOptionState();
  questionListEl.appendChild(card);
}

function renderQuestions() {
  questionListEl.innerHTML = "";
  const question = getCurrentQuestion();

  if (!question) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "조건에 맞는 문제가 없습니다. 검색어나 세트 필터를 바꿔보세요.";
    questionListEl.appendChild(empty);
    return;
  }

  renderQuestionCard(question);
}

function renderSummary() {
  const visibleCount = getVisibleQuestions().length;
  const totalCount = state.bank?.questionCount ?? 0;
  const setLabel = state.selectedSet === "all" ? "전체 세트" : state.selectedSet;
  resultsSummaryEl.textContent = `${setLabel} · 후보 ${visibleCount}문제 · 현재 랜덤 1문제 표시 중`;
  if (!visibleCount) {
    resultsSummaryEl.textContent = `${setLabel} · 0 / ${totalCount} 문제`;
  }
}

function renderStats() {
  setCountEl.textContent = state.bank?.setCount ?? 0;
  questionCountEl.textContent = state.bank?.questionCount ?? 0;
}

function syncScreenState() {
  landingScreenEl.classList.toggle("is-hidden", state.started);
  appScreenEl.classList.toggle("is-hidden", !state.started);
}

function render() {
  syncScreenState();
  if (!state.started) {
    return;
  }

  renderStats();
  renderFilters();
  renderSummary();
  renderQuestions();
}

async function loadQuestions() {
  const response = await fetch("/api/questions");
  if (!response.ok) {
    throw new Error("문제 데이터를 불러오지 못했습니다.");
  }
  state.bank = await response.json();
  render();
}

function startReview() {
  state.started = true;
  state.currentQuestionId = pickRandomQuestion()?.id ?? null;
  render();
}

searchInputEl.addEventListener("input", (event) => {
  state.searchTerm = event.target.value.trim();
  const replacement = pickRandomQuestion();
  state.currentQuestionId = replacement?.id ?? null;
  render();
});

randomButtonEl.addEventListener("click", () => {
  const replacement = pickRandomQuestion(state.currentQuestionId);
  state.currentQuestionId = replacement?.id ?? state.currentQuestionId;
  render();
});

restartButtonEl.addEventListener("click", () => {
  state.started = false;
  state.revealAllAnswers = false;
  state.currentQuestionId = null;
  render();
});

startButtonEl.addEventListener("click", () => {
  startReview();
});

loadQuestions().catch((error) => {
  state.started = true;
  syncScreenState();
  questionListEl.innerHTML = `<div class="empty-state">${error.message}</div>`;
});
