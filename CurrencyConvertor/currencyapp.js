const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// ✅ Set default values: "USD" to "INR"
fromCurr.value = "USD";
toCurr.value = "INR";

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// ✅ Function to fetch and update exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // ✅ Correct API endpoint
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    let data = await response.json();
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

    if (rate) {
      let finalAmount = (amtVal * rate).toFixed(2);
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } else {
      msg.innerText = "Invalid currency selection!";
    }
  } catch (error) {
    console.error("API Error:", error);
    msg.innerText = "Failed to fetch exchange rate!";
  }
};


const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// ✅ Event listeners
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// ✅ Automatically fetch 1 USD to INR when page loads
window.addEventListener("load", () => {
  updateExchangeRate();
});
