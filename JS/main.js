// ===== عناصر HTML =====
const fullname = document.getElementById("Fullname");
const nid = document.getElementById("National-ID");
const ageInput = document.getElementById("Age");
const accountType = document.getElementById("Account-type");
const deposit = document.getElementById("Intial-Deposit_Amount");
const btn = document.getElementById("logbtn");

const errMess = document.getElementById("errMess");
const succMess = document.getElementById("succMess");

// ===== بيانات الحساب =====
let bankAccount = null;

// ===== إنشاء رقم حساب عشوائي =====
function generateAccountNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

// ===== إنشاء الحساب =====
btn.addEventListener("click", function (e) {
    e.preventDefault();

    const userAge = parseInt(ageInput.value);

    // تحقق من العمر
    if (userAge < 18) {
        errMess.classList.remove("d-none");
        succMess.classList.add("d-none");
        return;
    }

    errMess.classList.add("d-none");
    succMess.classList.remove("d-none");

    // إنشاء الحساب
    bankAccount = {
        number: generateAccountNumber(),
        name: fullname.value,
        ID: nid.value,
        age: userAge,
        type: accountType.value,
        balance: Number(deposit.value) || 0,
        history: [],
        active: true
    };

    alert("Account created successfully!\nAccount Number: " + bankAccount.number);

    // عرض قائمة البنك
    showBankMenu();
});

// ===== قائمة البنك =====
function showBankMenu() {
    if (!bankAccount) return;

    let exit = false;

    while (!exit) {
        let choice = prompt(
            `Hello ${bankAccount.name}\n` +
            `Balance: $${bankAccount.balance}\n\n` +
            `Choose an option:\n` +
            `1 - Deposit\n` +
            `2 - Withdraw\n` +
            `3 - Check Balance\n` +
            `4 - Calculate Yearly Interest\n` +
            `5 - Transaction History\n` +
            `6 - Close Account\n` +
            `7 - Exit`
        );

        if (bankAccount.active === false && (choice === "1" || choice === "2")) {
            alert("Account is closed!");
            continue;
        }

        switch (choice) {
            case "1":
                depositMoney();
                break;
            case "2":
                withdrawMoney();
                break;
            case "3":
                alert(`Your current balance is $${bankAccount.balance}`);
                break;
            case "4":
                calculateInterest();
                break;
            case "5":
                showHistory();
                break;
            case "6":
                closeAccount();
                break;
            case "7":
                exit = true;
                console.log("Final Account Summary:", bankAccount);
                break;
            default:
                if (choice !== null) alert("Invalid selection!");
                else exit = true;
        }
    }
}

// ===== دالة الإيداع =====
function depositMoney() {
    let amount = Number(prompt("Enter deposit amount:"));

    if (!amount || amount <= 0) {
        alert("Invalid amount!");
        return;
    }

    bankAccount.balance += amount;
    bankAccount.history.push({
        action: "Deposit",
        amount: amount,
        date: new Date().toLocaleString()
    });

    alert(`$${amount} deposited successfully!`);
}

// ===== دالة السحب =====
function withdrawMoney() {
    let amount = Number(prompt("Enter withdrawal amount:"));

    if (!amount || amount <= 0) {
        alert("Invalid amount!");
        return;
    }

    if (amount > bankAccount.balance) {
        alert("Insufficient balance!");
        return;
    }

    bankAccount.balance -= amount;
    bankAccount.history.push({
        action: "Withdraw",
        amount: amount,
        date: new Date().toLocaleString()
    });

    alert(`$${amount} withdrawn successfully!`);
}

// ===== حساب الفائدة =====
function calculateInterest() {
    let rate = 0.05; // Current account default

    if (bankAccount.type === "1") rate = 0.10; // Saving
    else if (bankAccount.type === "3") rate = 0.15; // Business

    let interest = bankAccount.balance * rate;

    alert(`Expected yearly interest: $${interest.toFixed(2)}`);
}

// ===== عرض سجل العمليات =====
function showHistory() {
    if (bankAccount.history.length === 0) {
        alert("No transactions found.");
        return;
    }

    let log = bankAccount.history.map(item => `${item.date} - ${item.action}: $${item.amount}`).join("\n");
    alert(log);
}

// ===== إغلاق الحساب =====
function closeAccount() {
    if (confirm("Are you sure you want to close your account?")) {
        bankAccount.active = false;
        alert("Account closed successfully!");
    }
}