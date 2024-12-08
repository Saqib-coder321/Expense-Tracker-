const expenseForm = document.querySelector('form:nth-of-type(1)');
const incomeForm = document.querySelector('form:nth-of-type(2)');
const list = document.querySelector('.list');
const incomeDisplay = document.querySelector('.inc-');
const expenseDisplay = document.querySelector('.exp-');
const balanceDisplay = document.querySelector('.div:nth-child(3) span');
const searchInput = document.getElementById('search');
const expenseButton = document.querySelector('.ctrl-panel button:nth-of-type(1)');
const incomeButton = document.querySelector('.ctrl-panel button:nth-of-type(2)');
const forms = document.querySelectorAll('form');

const transactions = [
    { id: 1, name: "Salary", amount: 3000 },
    { id: 2, name: "Rent", amount: -1200 },
    { id: 3, name: "Fuel", amount: -300 },
    { id: 4, name: "Car Repair", amount: -500 }
];

function updateTotals() {
    const totals = transactions.reduce((acc, transaction) => {
        if (transaction.amount > 0) {
            acc.income += transaction.amount;
        } else {
            acc.expense += Math.abs(transaction.amount);
        }
        return acc;
    }, { income: 0, expense: 0 });

    incomeDisplay.textContent = totals.income.toFixed(2);
    expenseDisplay.textContent = totals.expense.toFixed(2);
    balanceDisplay.textContent = (totals.income - totals.expense).toFixed(2);
}

function renderTransaction(transaction) {
    const li = document.createElement('li');
    li.className = transaction.amount < 0 ? 'minus' : 'plus';
    li.innerHTML = `
        <h4 class="title">${transaction.name}</h4>
        <h4 class="amount">${Math.abs(transaction.amount)}</h4>
        <div class="remove"><h5>Remove</h5></div>
    `;

    li.querySelector('.remove').onclick = () => {
        transactions.splice(transactions.findIndex(t => t.id === transaction.id), 1);
        updateTotals();
        renderTransactions();
    };

    list.appendChild(li);
}

function renderTransactions() {
    list.innerHTML = '';
    transactions.forEach(renderTransaction);
}

function handleFormSubmission(form, isExpense) {
    const name = form.querySelector('input[type="text"]').value;
    const amount = form.querySelector('input[type="number"]').value;
    
    if (name && amount) {
        const newTransaction = {
            id: Date.now(),
            name,
            amount: isExpense ? -parseFloat(amount) : parseFloat(amount)
        };
        
        transactions.push(newTransaction);
        renderTransactions();
        updateTotals();
        form.reset();
    }
}

expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmission(expenseForm, true);
});

incomeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmission(incomeForm, false);
});

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    list.innerHTML = '';
    transactions
        .filter(t => t.name.toLowerCase().includes(searchTerm))
        .forEach(renderTransaction);
});

function toggleForm(formIndex) {
    forms.forEach((form, index) => {
        if (index === formIndex) {
            form.classList.toggle('active');
        } else {
            form.classList.remove('active');
        }
    });
}

forms.forEach(form => {
    form.querySelector('h1').onclick = () => {
        form.classList.remove('active');
    };
});

expenseButton.onclick = () => toggleForm(0);
incomeButton.onclick = () => toggleForm(1);

renderTransactions();
updateTotals();