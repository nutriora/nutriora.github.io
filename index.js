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
// Nutrition Facts Infographics
document.addEventListener("DOMContentLoaded", function () {
  // Macronutrients Chart
  const macroCtx = document.getElementById("macroChart").getContext("2d");
  const macroChart = new Chart(macroCtx, {
    type: "doughnut",
    data: {
      labels: ["Carbohydrates", "Proteins", "Fats"],
      datasets: [
        {
          data: [55, 25, 20],
          backgroundColor: [
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 99, 132, 0.8)",
            "rgba(255, 206, 86, 0.8)",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw}%`;
            },
          },
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    },
  });

  // Water Intake Chart
  const waterCtx = document.getElementById("waterChart").getContext("2d");
  const waterChart = new Chart(waterCtx, {
    type: "bar",
    data: {
      labels: ["Men", "Women"],
      datasets: [
        {
          label: "Liters per day",
          data: [3.7, 2.7],
          backgroundColor: [
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ],
          borderWidth: 0,
          borderRadius: 10,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 4,
          ticks: {
            callback: function (value) {
              return value + "L";
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.raw}L per day`;
            },
          },
        },
      },
      animation: {
        delay: function (context) {
          return context.dataIndex * 300;
        },
      },
    },
  });

  // Vitamin Animation
  const vitaminItems = document.querySelectorAll(".vitamin-item");
  let currentVitamin = 0;

  function showNextVitamin() {
    vitaminItems.forEach((item) => item.classList.remove("active"));

    vitaminItems[currentVitamin].classList.add("active");
    currentVitamin = (currentVitamin + 1) % vitaminItems.length;
  }

  // Show first vitamin immediately
  setTimeout(showNextVitamin, 500);

  // Set interval for rotation
  let vitaminInterval = setInterval(showNextVitamin, 3000);

  // Manual control
  document
    .getElementById("animateVitamins")
    .addEventListener("click", function () {
      showNextVitamin();
    });

  // Pause animation on hover
  const vitaminContainer = document.querySelector(".vitamin-animation");
  vitaminContainer.addEventListener("mouseenter", function () {
    clearInterval(vitaminInterval);
  });

  vitaminContainer.addEventListener("mouseleave", function () {
    vitaminInterval = setInterval(showNextVitamin, 3000);
  });
});
// ==================================
// STATS SECTION - ANIMATED COUNTERS
// ==================================

function animateStats() {
  const statItems = document.querySelectorAll(".stat-item");
  let animated = false;

  return function () {
    const statsSection = document.querySelector(".stats-section");
    if (!statsSection) return;

    const sectionPosition = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionPosition < windowHeight - 100 && !animated) {
      animated = true;

      statItems.forEach((item) => {
        const numberElement = item.querySelector(".stat-number");
        const target = parseInt(numberElement.getAttribute("data-count"));
        const duration = 2000; // Animation duration in ms
        const startTime = performance.now();

        const formatNumber = (num) => {
          return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num;
        };

        const updateNumber = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const currentNumber = Math.floor(progress * target);

          numberElement.textContent = formatNumber(currentNumber);

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            numberElement.textContent = formatNumber(target);
          }
        };

        requestAnimationFrame(updateNumber);
      });
    }
  };
}

// Initialize on load and scroll
document.addEventListener("DOMContentLoaded", function () {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats()();
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
});

// Fallback for older browsers
window.addEventListener("scroll", animateStats());
// Enhanced counter animation with #2ECC71 color sync
function animateStats() {
  const statItems = document.querySelectorAll(".stat-item");
  let animated = false;

  return function () {
    const statsSection = document.querySelector(".stats-section");
    if (!statsSection) return;

    const sectionPosition = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionPosition < windowHeight - 150 && !animated) {
      animated = true;

      // Add pulse animation to container
      statsSection.style.boxShadow = "0 0 0 0 rgba(46, 204, 113, 0.7)";
      statsSection.offsetHeight; // Trigger reflow
      statsSection.style.transition = "box-shadow 1s ease-out";
      statsSection.style.boxShadow = "0 0 0 20px rgba(46, 204, 113, 0)";

      statItems.forEach((item, index) => {
        const numberElement = item.querySelector(".stat-number");
        const target = parseInt(numberElement.getAttribute("data-count"));
        const duration = 1800 + index * 200; // Staggered timing

        const startAnimation = () => {
          let start = 0;
          const increment = target / (duration / 16);

          const updateCounter = () => {
            start += increment;
            if (start < target) {
              numberElement.textContent = Math.ceil(start);
              requestAnimationFrame(updateCounter);
            } else {
              numberElement.textContent = target;
              // Pulse animation on complete
              item.style.transform = "scale(1.05)";
              setTimeout(() => {
                item.style.transform = "scale(1)";
              }, 300);
            }
          };

          updateCounter();
        };

        // Delay each counter slightly
        setTimeout(startAnimation, index * 150);
      });
    }
  };
}

// Initialize with improved detection
document.addEventListener("DOMContentLoaded", function () {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats()();
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector(".stats-section");
  if (statsSection) statsObserver.observe(statsSection);
});
// Back to Top Button Functionality
const backToTopBtn = document.querySelector(".back-to-top");

window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("visible");
  } else {
    backToTopBtn.classList.remove("visible");
  }
});

backToTopBtn.addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  // Add click animation
  this.classList.add("clicked");
  setTimeout(() => {
    this.classList.remove("clicked");
  }, 300);
});
// Animated Counter
document.addEventListener("DOMContentLoaded", function () {
  const statCards = document.querySelectorAll(".stat-card");

  const animateCount = (element, target) => {
    let current = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const update = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    };
    update();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const numberEl = entry.target.querySelector(".stat-number");
          const target = parseInt(numberEl.getAttribute("data-count"));
          animateCount(numberEl, target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statCards.forEach((card) => observer.observe(card));
});
