const populate = async (value, currency) => {
  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error");
  const outputEl = document.querySelector(".output");
  
  try {
    loadingEl.style.display = "block";
    errorEl.style.display = "none";
    errorEl.textContent = "";

    const response = await fetch(`/api/convert?baseCurrency=${currency}`);
    
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
        <td>${(rJson["data"][key]["value"] * value).toFixed(2)}</td>
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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".converter-form");
  const quantityInput = document.querySelector("input[name='quantity']");
  const currencySelect = document.querySelector("select[name='currency']");
  const errorEl = document.getElementById("error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const value = quantityInput.value.trim();
    const currency = currencySelect.value;
    
    if (!value || value <= 0) {
      errorEl.textContent = "Please enter a valid quantity";
      errorEl.style.display = "block";
      document.querySelector(".output").style.display = "none";
      return;
    }
    
    populate(parseInt(value), currency);
  });
});
