let transactions = JSON.parse(localStorage.getItem("data")) || [];
let editIndex = null;

function save() {
  localStorage.setItem("data", JSON.stringify(transactions));
}

function addTransaction() {
  let type = document.getElementById("type").value;
  let amount = parseFloat(document.getElementById("amount").value);
  let category = document.getElementById("category").value;
  let date = document.getElementById("date").value;

  if (!amount || !category || !date) return alert("Fill all");

  transactions.push({ type, amount, category, date });
  save();
  updateUI();
}

function editTransaction(i) {
  let t = transactions[i];
  document.getElementById("type").value = t.type;
  document.getElementById("amount").value = t.amount;
  document.getElementById("category").value = t.category;
  document.getElementById("date").value = t.date;

  editIndex = i;
  document.getElementById("updateBtn").style.display = "inline";
}

function updateTransaction() {
  let type = document.getElementById("type").value;
  let amount = parseFloat(document.getElementById("amount").value);
  let category = document.getElementById("category").value;
  let date = document.getElementById("date").value;

  transactions[editIndex] = { type, amount, category, date };
  save();
  editIndex = null;
  document.getElementById("updateBtn").style.display = "none";
  updateUI();
}

function deleteTransaction(i) {
  transactions.splice(i, 1);
  save();
  updateUI();
}

function getFiltered() {
  let type = document.getElementById("filterType").value;
  let month = document.getElementById("monthFilter").value;
  let year = document.getElementById("yearFilter").value;

  return transactions.filter(t => {
    let d = new Date(t.date);

    if (type === "monthly" && month) return t.date.startsWith(month);
    if (type === "yearly" && year) return d.getFullYear() == year;

    return true;
  });
}

function updateUI() {
  let data = getFiltered();

  let list = document.getElementById("list");
  list.innerHTML = "";

  let income = 0, expense = 0;

  data.forEach((t, i) => {
    let li = document.createElement("li");
    li.innerHTML = `
      ${t.category} ₹${t.amount}
      <span>
        <button onclick="editTransaction(${i})">Edit</button>
        <button onclick="deleteTransaction(${i})">Delete</button>
      </span>
    `;
    list.appendChild(li);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = income - expense;

  drawCharts(data);
}

let pie, line;

function drawCharts(data) {
  let categories = {};
  let dates = {};

  data.forEach(t => {
    if (t.type === "expense") {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
      dates[t.date] = (dates[t.date] || 0) + t.amount;
    }
  });

  if (pie) pie.destroy();
  if (line) line.destroy();

  pie = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [{ data: Object.values(categories) }]
    }
  });

  line = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: Object.keys(dates),
      datasets: [{ data: Object.values(dates) }]
    }
  });
}

updateUI();
