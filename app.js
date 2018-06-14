(function init() {
  // Get all UI vars
  function getUIElms() {
    const containerEl = document.querySelector(".container");
    const heading = document.querySelector(".heading");
    const loanFormEl = document.querySelector(".loan-form");
    const loanAmountEl = document.querySelector(".loan-amount");
    const interestRateEl = document.querySelector(".interest-rate");
    const totalYearsEl = document.querySelector(".total-years");
    const monthlyPaymentEl = document.querySelector(".monthly-payment");
    const totalPaymentEl = document.querySelector(".total-payment");
    const totalInterestEl = document.querySelector(".total-interest");
    const resultsBoxEl = document.querySelector(".results-box");

    return {
      containerEl,
      heading,
      loanFormEl,
      loanAmountEl,
      interestRateEl,
      totalYearsEl,
      monthlyPaymentEl,
      totalPaymentEl,
      totalInterestEl,
      resultsBoxEl
    };
  }

  // Only show results after clicking the calculate btn

  getUIElms().resultsBoxEl.classList.add("hide-results");

  // Load all EventListeners
  loadAllEventListeners();

  function loadAllEventListeners() {
    getUIElms().loanFormEl.addEventListener("submit", loanFormSubmitHandler);
  }

  function loanFormSubmitHandler(e) {
    e.preventDefault();

    const { loanAmountEl, interestRateEl, totalYearsEl } = getUIElms();

    const loanAmountElVal = loanAmountEl.value,
      interestRateElVal = interestRateEl.value,
      totalYearsElVal = totalYearsEl.value;

    if (validate(null, loanAmountElVal, interestRateEl, totalYearsElVal)) {
      const {
        totalAmtToPay,
        monthlyAmtToPay,
        totalInterestAtEnd
      } = computeResults(loanAmountElVal, interestRateElVal, totalYearsElVal);

      if (
        validate(
          "computedVals",
          totalAmtToPay,
          monthlyAmtToPay,
          totalInterestAtEnd
        )
      ) {
        displayComputedResults(
          totalAmtToPay,
          monthlyAmtToPay,
          totalInterestAtEnd
        );
      } else {
        showAlert("Please check your numbers");
      }
    } else {
      showAlert("Please fill in all fields");
    }
  }

  function computeResults(loanAmount, interestRate, years) {
    /* Compound Interest
     I = P (1 + r / n) ^ nt
    */

    // Compunding yearly, so n = 1;

    const totalAmtToPay = loanAmount * Math.pow(1 + interestRate / 100, years);

    const monthlyAmtToPay = totalAmtToPay / (years * 12);

    const totalInterestAtEnd = totalAmtToPay - loanAmount;

    return {
      totalAmtToPay,
      monthlyAmtToPay,
      totalInterestAtEnd
    };
  }

  function validate(typeOfVals, ...vals) {
    if (typeOfVals === "computedVals") {
      return vals.every(function(result) {
        return isFinite(result);
      });
    } else {
      return vals.every(function(val) {
        return val !== "";
      });
    }
  }

  function displayComputedResults(
    totalAmtToPay,
    monthlyAmtToPay,
    totalInterestAtEnd
  ) {
    const { monthlyPaymentEl, totalPaymentEl, totalInterestEl } = getUIElms();

    monthlyPaymentEl.value = monthlyAmtToPay;
    totalPaymentEl.value = totalAmtToPay;
    totalInterestEl.value = totalInterestAtEnd;

    showLoader();
  }

  function showLoader() {
    const loadingMsg = document.createElement("h3");
    loadingMsg.className = "loading-msg";
    loadingMsg.appendChild(
      document.createTextNode("Computing your results...")
    );

    getUIElms().containerEl.appendChild(loadingMsg);

    setTimeout(function showResults() {
      loadingMsg.remove();
      getUIElms().resultsBoxEl.classList.remove("hide-results");
    }, 500);
  }

  function showAlert(msg) {
    if (!document.querySelector(".error")) {
      const { containerEl, heading } = getUIElms();
      const errorDiv = document.createElement("div");
      errorDiv.className = "error";
      errorDiv.appendChild(document.createTextNode(msg));

      containerEl.insertBefore(errorDiv, heading);

      setTimeout(function removeErrorDiv() {
        errorDiv.remove();
      }, 2000);
    }
  }
})();
