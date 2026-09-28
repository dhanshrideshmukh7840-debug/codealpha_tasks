const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

let expression = "";
let justCalculated = false;

function updateDisplay() {
  expressionEl.textContent = expression || "0";
}

function calculate() {
  if (!expression) return;

  try {
    // Convert percentage into decimal before evaluating simple arithmetic.
    const safeExpression = expression.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
    if (!/^[0-9+\-*/().\s]+$/.test(safeExpression)) throw new Error();

    const answer = Function('"use strict"; return (' + safeExpression + ')')();

    if (!Number.isFinite(answer)) throw new Error();

    resultEl.textContent = Number.isInteger(answer)
      ? answer
      : Number(answer.toFixed(10));

    justCalculated = true;
  } catch {
    resultEl.textContent = "Error";
  }
}

function addValue(value) {
  if (justCalculated && /[0-9.]/.test(value)) {
    expression = "";
    resultEl.textContent = "0";
  }
  justCalculated = false;

  const operators = "+-*/";
  const last = expression.slice(-1);

  if (operators.includes(value)) {
    if (!expression && value !== "-") return;
    if (operators.includes(last)) expression = expression.slice(0, -1);
  }

  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/]/).pop();
    if (currentNumber.includes(".")) return;
  }

  expression += value;
  updateDisplay();
}

function clearAll() {
  expression = "";
  resultEl.textContent = "0";
  justCalculated = false;
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  resultEl.textContent = expression ? resultEl.textContent : "0";
  updateDisplay();
}

document.querySelector(".keys").addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (value !== undefined) addValue(value);
  if (action === "clear") clearAll();
  if (action === "delete") deleteLast();
  if (action === "calculate") calculate();
});

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (/^[0-9.]$/.test(key)) addValue(key);
  else if ("+-*/%".includes(key)) addValue(key);
  else if (key === "Enter" || key === "=") calculate();
  else if (key === "Backspace") deleteLast();
  else if (key === "Escape") clearAll();
});

updateDisplay();