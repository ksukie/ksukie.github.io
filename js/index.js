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

document.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || link.getAttribute("aria-disabled") === "true") return;

  link.target = "_blank";
  link.relList.add("noopener");
});

document.addEventListener("click", (event) => {
  document.querySelectorAll(".cv-menu[open]").forEach((menu) => {
    if (!menu.contains(event.target)) menu.open = false;
  });
});
