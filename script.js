let titleInput = document.getElementById("expenseTitle");
let amountInput = document.getElementById("expenseAmount");
let typeInput = document.getElementById("expenseType");
let categoryInput = document.getElementById("expenseCategory");
let addButton = document.getElementById("addEntryButton");
let transactionList = document.getElementById("transactionList");
let cancelButton = document.getElementById("cancelBtn");

let budgetTotal = document.getElementById("budgetTotal");
let expenseTotal = document.getElementById("expenseTotal");
let balanceTotal = document.getElementById("balanceTotal");
let editIndex = -1;
let transactions = [];

  function clearInput(){
    titleInput.value = "";
     amountInput.value = "";
    categoryInput.value = "";
  }

if (localStorage.getItem("transactions")) {
  transactions = JSON.parse(localStorage.getItem("transactions"));
} else {
  transactions = [];
}

renderTransactions();

addButton.addEventListener("click", function () {
  let title = titleInput.value;

  let amount = Number(amountInput.value);

  let type = typeInput.value;

  let category = categoryInput.value;

  if (title === "") {
    alert("fill the discription");
    return;
  }
  if (amount <= 0) {
    alert("fill the amount");
    return;
  }

  let transaction = {
    title: title,
    amount: amount,
    type: type,
    category: category,
  };
  if (editIndex === -1) {
    transactions.push(transaction);
  } else {
    transactions[editIndex] = transaction;
    editIndex = -1;
    cancelButton.style.display = "none"
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTransactions();

  clearInput()
});

function renderTransactions() {
  transactionList.innerHTML = "";
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(function (item, index) {
    // console.log(index);

    let transactionClass;

    if (item.type === "income") {
      transactionClass = "income";
      totalIncome += item.amount;
    } else {
      transactionClass = "expense";
      totalExpense += item.amount;
    }
    transactionList.innerHTML += ` 
    <div class="transaction-item ${transactionClass}">
    <h3>${item.title}</h3>
    <p class="amount">${item.amount}</p>
    <button class="edit-btn" data-index="${index}">Edit</button>
    <button class="delete-btn" data-index="${index}">Delete</button>
</div>
`;
  });

  let balance = totalIncome - totalExpense;
  console.log("Income:", totalIncome);
  budgetTotal.textContent = totalIncome;
  expenseTotal.textContent = totalExpense;
  balanceTotal.textContent = balance;

  let deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      
      let index = Number(button.getAttribute("data-index"));
      transactions.splice(index, 1);

      localStorage.setItem("transactions", JSON.stringify(transactions));

      renderTransactions();
    });
  });

  let editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      let index = Number(button.getAttribute("data-index"));
      editIndex = index;
      cancelButton.style.display = "block";
      let transaction = transactions[index];
      titleInput.value = transaction.title;
      amountInput.value = transaction.amount;
      typeInput.value = transaction.type;
      categoryInput.value = transaction.category;
    });
  });
    
  cancelButton.addEventListener("click" , function(){
    editIndex = -1
    cancelButton.style.display = "none"
    clearInput()
  })
}
