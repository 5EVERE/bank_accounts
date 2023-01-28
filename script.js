'use strict';

// Simply Bank App

const account1 = {
  userName: 'Cecil Ireland',
  transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
  interest: 1.5,
  pin: 1111,
};

const account2 = {
  userName: 'Amani Salt',
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  interest: 1.3,
  pin: 2222,
};

const account3 = {
  userName: 'Corey Martinez',
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  interest: 0.8,
  pin: 3333,
};

const account4 = {
  userName: 'Kamile Searle',
  transactions: [530, 1300, 500, 40, 190],
  interest: 1,
  pin: 4444,
};

const account5 = {
  userName: 'Oliver Avila',
  transactions: [630, 800, 300, 50, 120],
  interest: 1.1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.total__value--in');
const labelSumOut = document.querySelector('.total__value--out');
const labelSumInterest = document.querySelector('.total__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const accountNick = function (account) {
  account.forEach(acc => {
    acc.nick = acc.userName
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
accountNick(accounts);
const displayCurrentTrans = function (account) {
  containerTransactions.innerHTML = '';
  account.transactions.forEach((trans, index) => {
    const typeTrans = trans > 0 ? 'deposit' : 'withdrawal';
    const transaction = `
    <div class="transactions__row">
      <div class="transactions__type transactions__type--${typeTrans}">
        ${index + 1} ${typeTrans}
      </div>
      <div class="transactions__date">Колись</div>
      <div class="transactions__value">${trans}$</div>
    </div>
    `;
    containerTransactions.insertAdjacentHTML('afterbegin', transaction);
  });
};
const displayTotal = function (account) {
  const totalValue = account.transactions.reduce(
    (acc, value) => acc + value,
    0
  );
  account.balance = account.transactions.reduce((acc, value) => acc + value, 0);
  labelBalance.textContent = `${totalValue}$`;
};
const displayBallanceValue = function (account) {
  const InValue = account.transactions
    .filter(value => value > 0)
    .reduce((acc, value) => acc + value, 0);

  const OutValue = account.transactions
    .filter(value => value < 0)
    .reduce((acc, value) => acc + value, 0);

  const interestTotal = account.transactions
    .filter(trans => trans > 0)
    .map(depos => (depos * account.interest) / 100)
    .filter((interest, index, arr) => {
      return interest >= 5;
    })
    .reduce((acc, interest) => acc + interest, 0);
  labelSumIn.textContent = `${InValue}$`;
  labelSumOut.textContent = `${OutValue}$`;
  labelSumInterest.textContent = `${interestTotal}$`;
};
const currentUI = function (account) {
  displayCurrentTrans(account);
  displayTotal(account);
  displayBallanceValue(account);
};
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(acc => inputLoginUsername.value === acc.nick);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    currentUI(currentAccount);
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Вітаємо ${currentAccount.userName}!`;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amountTransfer = Number(inputTransferAmount.value);
  const transferAccount = accounts.find(
    acc => inputTransferTo.value === acc.nick
  );
  if (
    amountTransfer > 0 &&
    amountTransfer <= currentAccount.balance &&
    currentAccount.nick !== inputTransferTo.value
  ) {
    currentAccount.transactions.push(-amountTransfer);
    transferAccount.transactions.push(amountTransfer);
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    currentUI(currentAccount);
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount <= 1000) {
    setTimeout(function () {
      inputLoanAmount.value = '';
      currentAccount.transactions.push(loanAmount);
      currentUI(currentAccount);
    }, 5000);
  }
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const currentAccountIndex = accounts.findIndex(
    account => account.pin === currentAccount.pin
  );
  console.log(currentAccountIndex);
  if (
    inputCloseUsername.value === currentAccount.nick &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    accounts.splice(currentAccountIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Ввійдіть в свій аккаунт';
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});
