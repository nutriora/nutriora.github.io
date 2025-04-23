const scriptURL =
  "https://script.google.com/macros/s/AKfycbx3T0F4dQPl5yo2nB2axIVzKTK-O7-s4PM_WPPGRIN9NPZoYH1vAq0dGSTsS4i10cK-2Q/exec";
function getHeightInFeet() {
  const heightInPixels = window.innerHeight;
  const dpi = window.devicePixelRatio * 96; // Standard CSS DPI is 96
  const heightInInches = heightInPixels / dpi;
  const heightInFeet = heightInInches / 12;

  console.log(heightInFeet.toFixed(2));
  return heightInFeet;
}

document
  .getElementById("clientForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitText = submitBtn.querySelector(".submit-text");
    const spinner = submitBtn.querySelector(".spinner-border");

    // Show loading state
    submitText.textContent = "Submitting...";
    spinner.classList.remove("d-none");
    submitBtn.disabled = true;

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        showToast("Registration successful! We will contact you soon.");
        form.reset();
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      showToast("Error submitting form. Please try again.", "error");
      console.error("Form submission error:", error);
    } finally {
      submitText.textContent = "Register Now";
      spinner.classList.add("d-none");
      submitBtn.disabled = false;
    }
  });

// Toast notification function
function showToast(message, type = "success") {
  const toastEl = document.querySelector(".toast");
  const toastBody = toastEl.querySelector(".toast-body");

  toastBody.className = `toast-body bg-${
    type === "success" ? "success" : "danger"
  } text-white`;

  toastBody.textContent = message;

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
