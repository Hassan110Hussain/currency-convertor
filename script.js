console.log("Curr Conv");

const populate = async (value, currency) => {
  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error");
  const outputEl = document.querySelector(".output");
  
  try {
    loadingEl.style.display = "block";
    errorEl.style.display = "none";
    errorEl.textContent = "";

    const apiKey = import.meta.env.VITE_CURRENCY_API_KEY;
    const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${currency}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch currency data");
    }

    const rJson = await response.json();
    
    if (!rJson.data) {
      throw new Error("Invalid API response");
    }

    let myStr = "";
    for (let key of Object.keys(rJson["data"])) {
      myStr += `<tr>
        <td>${key}</td>
        <td>${rJson["data"][key]["code"]}</td>
        <td>${Math.round(rJson["data"][key]["value"] * value)}</td>
      </tr>`;
    }

    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = myStr;
    outputEl.style.display = "block";
    
  } catch (error) {
    console.error("Error:", error);
    errorEl.textContent = `Error: ${error.message}. Please try again.`;
    errorEl.style.display = "block";
    outputEl.style.display = "none";
  } finally {
    loadingEl.style.display = "none";
  }
};

const btn = document.querySelector(".btn");
const quantityInput = document.querySelector("input[name='quantity']");
const currencySelect = document.querySelector("select[name='currency']");

btn.addEventListener("click", (e) => {
  e.preventDefault();
  
  const value = quantityInput.value.trim();
  const currency = currencySelect.value;
  
  // Validation
  if (!value || value <= 0) {
    document.getElementById("error").textContent = "Please enter a valid quantity";
    document.getElementById("error").style.display = "block";
    document.querySelector(".output").style.display = "none";
    return;
  }
  
  populate(parseInt(value), currency);
});
