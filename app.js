let people = [];
function addPerson() {
  const name = document.getElementById('name').value;
  const label = document.getElementById('label').value;
  const amount = parseFloat(document.getElementById('amount').value);
  if (name && label && amount) {
    people.push({ name, label, amount });
    document.getElementById('name').value = '';
    document.getElementById('label').value = '';
    document.getElementById('amount').value = '';
    displayPeople();
  }
}
function displayPeople() {
  const list = document.getElementById('peopleList');
  list.innerHTML = '';
  people.forEach((p, index) => {
    const li = document.createElement('li');
    li.textContent = `${p.name} spent ₹${p.amount} on ${p.label}`;
    list.appendChild(li);
  });
}
function calculateSplit() {
  const totalAmount = people.reduce((sum, p) => sum + p.amount, 0);
  const equalShare = totalAmount / people.length;
  const balances = people.map(p => ({
    name: p.name,
    balance: p.amount - equalShare
  }));
  const transactions = [];
  const creditors = balances.filter(b => b.balance > 0);
  const debtors = balances.filter(b => b.balance < 0);

  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => a.balance - b.balance);

  while (creditors.length && debtors.length) {
    const creditor = creditors[0];
    const debtor = debtors[0];
    const amount = Math.min(creditor.balance, -debtor.balance);

    transactions.push(`${debtor.name} pays ₹${amount.toFixed(2)} to ${creditor.name}`);
    creditor.balance -= amount;
    debtor.balance += amount;

    if (creditor.balance === 0) creditors.shift();
    if (debtor.balance === 0) debtors.shift();
  }

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<h2>Results</h2>';
  if (transactions.length === 0) {
    resultDiv.innerHTML += '<p>Everyone is settled up!</p>';
  } else {
    transactions.forEach(transaction => {
      const p = document.createElement('p');
      p.textContent = transaction;
      resultDiv.appendChild(p);
    });
  }
}
