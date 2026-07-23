const toast = document.querySelector("#placeholder-toast");
let toastTimer;

document.querySelectorAll("[data-toggle-block]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const block = document.getElementById(link.dataset.toggleBlock);
    if (!block) return;

    block.hidden = !block.hidden;
    link.setAttribute("aria-expanded", String(!block.hidden));
  });
});

document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (!toast) return;

    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  });
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
