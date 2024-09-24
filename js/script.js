// Cache commonly accessed elements
const menu = document.getElementById("addMenu");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const dateInput = document.querySelector(".date-input");
const tradeDate = document.querySelector(".trade-date");
const tradesContainer = document.querySelector(".trades");
const addtradeTitle = document.querySelector(".trade-pair");
const addprofitAmount = document.querySelector(".profit-amount");
const addtradeFrom = document.querySelector(".trade-time-from");
const addtradeTo = document.querySelector(".trade-time-to");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let tradesArr = JSON.parse(localStorage.getItem("trades")) || [];

function openAddTradeMenu() {
  menu.style.height = "330px";
  calculateTotalProfitForSelectedDay();
}

function closeAddTradeMenu() {
  menu.style.height = "0";
}

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const day = firstDay.getDay();
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = `${months[month]} ${year}`;

  let daysHTML = "";

  // Add days of previous month
  for (let x = day; x > 0; x--) {
    daysHTML += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  // Add current month days
  for (let i = 1; i <= lastDate; i++) {
    const isToday =
      i === today.getDate() &&
      year === today.getFullYear() &&
      month === today.getMonth();
    const trade = tradesArr.some(
      (tradeObj) =>
        tradeObj.day === i &&
        tradeObj.month === month + 1 &&
        tradeObj.year === year
    );

    let dayClass = "day";
    if (isToday) {
      activeDay = i;
      getActiveDay(i);
      updatetrades(i);
      dayClass += " today active";
    }
    if (trade) dayClass += " trade";

    daysHTML += `<div class="${dayClass}">${i}</div>`;
  }

  // Add next month days
  for (let j = 1; j <= nextDays; j++) {
    daysHTML += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = daysHTML;
  addDayListeners();
}

function changeMonth(increment) {
  month += increment;
  if (month > 11) {
    month = 0;
    year++;
  }
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

prev.addEventListener("click", () => changeMonth(-1));
next.addEventListener("click", () => changeMonth(1));

initCalendar();

function addDayListeners() {
  document.querySelectorAll(".day").forEach((day) => {
    day.addEventListener("click", (e) => {
      const targetDay = Number(e.target.innerHTML);
      if (e.target.classList.contains("prev-date")) changeMonth(-1);
      if (e.target.classList.contains("next-date")) changeMonth(1);

      activeDay = targetDay;
      getActiveDay(targetDay);
      updatetrades(targetDay);

      document
        .querySelectorAll(".day")
        .forEach((d) => d.classList.remove("active"));
      setTimeout(() => {
        document.querySelectorAll(".day").forEach((d) => {
          if (
            d.innerHTML == targetDay &&
            !d.classList.contains("prev-date") &&
            !d.classList.contains("next-date")
          ) {
            d.classList.add("active");
          }
        });
      }, 100);
    });
  });
}

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "").slice(0, 7);
  if (dateInput.value.length === 2 && e.inputType !== "deleteContentBackward")
    dateInput.value += "/";
});

function goToDateFunc() {
  const dateArr = dateInput.value.split("/");
  if (
    dateArr.length === 2 &&
    dateArr[0] > 0 &&
    dateArr[0] < 13 &&
    dateArr[1].length === 4
  ) {
    month = dateArr[0] - 1;
    year = dateArr[1];
    initCalendar();
  } else {
    alert("Invalid Date");
  }
}

function getActiveDay(date) {
  tradeDate.innerHTML = `${date} ${months[month]} ${year}`;
}

function updatetrades(day) {
  let tradesHTML = "";
  const daytrades = tradesArr.find(
    (trade) =>
      trade.day === day && trade.month === month + 1 && trade.year === year
  );

  if (daytrades) {
    daytrades.trades.forEach((trade) => {
      if (trade.profit >= 0) {
        tradesHTML += `
        <div class="trade">
          <div class="singleTradeContent">
            <div class="title">
              <i style="color: #3cb043" class="fa-solid fa-circle"></i>
              <p class="trade-title">${trade.title}</p>
              <div class="trade-time">
                <span class="trade-time">${trade.time}</span>
              </div>
            </div>
            <div class="tradeProfit">
              <p class="trade-profit">+${trade.profit}$</p>
            </div>
          </div>
          <div class="singleTradeDel">
            <button class="delBtn" onclick="delTradeFunc()"><i class="fa-solid fa-trash-can-undo"></i></button>
          </div>
        </div>`;
      } else {
        tradesHTML += `
        <div class="trade">
          <div class="singleTradeContent">
            <div class="title">
              <i style="color: #d0312D" class="fa-solid fa-circle"></i>
              <p class="trade-title">${trade.title}</p>
              <div class="trade-time">
                <span class="trade-time">${trade.time}</span>
              </div>
            </div>
            <div class="tradeProfit">
              <p class="trade-profit">${trade.profit}$</p>
            </div>
          </div>
          <div class="singleTradeDel">
            <button class="delBtn" onclick="delTradeFunc()"><i class="fa-solid fa-trash-can-undo"></i></button>
          </div>
        </div>`;
      }
    });
  } else {
    tradesHTML = `<div class="no-trade"><p>No trades</p></div>`;
  }

  tradesContainer.innerHTML = tradesHTML;
  localStorage.setItem("trades", JSON.stringify(tradesArr));
}

addtradeTitle.addEventListener("input", () => {
  addtradeTitle.value = addtradeTitle.value.slice(0, 60);
});

function handleTimeInput(inputElement) {
  inputElement.addEventListener("input", () => {
    inputElement.value = inputElement.value.replace(/[^0-9:]/g, "").slice(0, 5);
    if (inputElement.value.length === 2) inputElement.value += ":";
  });
}

function handleProfitInput(inputElement) {
  inputElement.addEventListener("input", () => {
    inputElement.value = inputElement.value
      .replace(/[^0-9.-]/g, "")
      .slice(0, 10);
  });
}

handleTimeInput(addtradeFrom);
handleTimeInput(addtradeTo);
handleProfitInput(addprofitAmount);

function addTradeSumbit() {
  const tradeTitle = addtradeTitle.value.trim();
  const profitAmount = addprofitAmount.value;
  const tradeTimeFrom = addtradeFrom.value;
  const tradeTimeTo = addtradeTo.value;

  if (!tradeTitle || !tradeTimeFrom || !tradeTimeTo || !profitAmount) {
    return alert("Please fill all fields");
  }

  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(tradeTimeFrom) || !timeRegex.test(tradeTimeTo)) {
    return alert("Invalid Time Format");
  }

  const profitRegex = /^[0-9.-]*$/;
  if (!profitRegex.test(profitAmount)) {
    return alert("Invalid Profit Format");
  }

  const newtrade = {
    title: tradeTitle,
    profit: profitAmount,
    time: `${tradeTimeFrom} - ${tradeTimeTo}`,
  };

  let daytrades = tradesArr.find(
    (trade) =>
      trade.day === activeDay &&
      trade.month === month + 1 &&
      trade.year === year
  );

  if (daytrades) {
    daytrades.trades.push(newtrade);
  } else {
    tradesArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      trades: [newtrade],
    });
  }

  closeAddTradeMenu();
  addtradeTitle.value = "";
  addprofitAmount.value = "";
  addtradeFrom.value = "";
  addtradeTo.value = "";
  updatetrades(activeDay);

  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("trade")) {
    activeDayEl.classList.add("trade");
  }
}

function delTradeFunc() {
  const tradeTitle = document.querySelector(".trade-title").textContent;
  const daytrades = tradesArr.find(
    (trade) =>
      trade.day === activeDay &&
      trade.month === month + 1 &&
      trade.year === year
  );

  if (daytrades) {
    daytrades.trades = daytrades.trades.filter(
      (trade) => trade.title !== tradeTitle
    );
    if (!daytrades.trades.length) {
      tradesArr = tradesArr.filter((trade) => trade !== daytrades);
    }
    updatetrades(activeDay);
  }
}

function calculateTotalProfitForSelectedDay() {
  let totalProfit = 0;
  let tradeUnderLine = document.querySelector(".trade");

  const daytrades = tradesArr.find(
    (trade) =>
      trade.day === activeDay &&
      trade.month === month + 1 &&
      trade.year === year
  );

  if (daytrades) {
    daytrades.trades.forEach((trade) => {
      totalProfit += parseFloat(trade.profit);
    });
  }

  if (totalProfit >= 0) {
    tradeUnderLine.style.setProperty("--afterBack", "#3cb043");
  } else {
    tradeUnderLine.style.setProperty("--afterBack", "#d0312D");
  }
}
