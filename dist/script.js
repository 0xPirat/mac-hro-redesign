const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".main-nav");
const form = document.querySelector("#contact-form");

const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menu.classList.toggle("open", !open);
  document.body.classList.toggle("menu-open", !open);
});

menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuButton.setAttribute("aria-expanded", "false");
  menu.classList.remove("open");
  document.body.classList.remove("menu-open");
}));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent(`Anfrage: ${data.get("thema")}`);
  const body = encodeURIComponent(
    `Moin Christof,\n\n${data.get("nachricht")}\n\nViele Grüße\n${data.get("vorname")} ${data.get("nachname")}\n${data.get("email")}`
  );
  window.location.href = `mailto:info@mac-hro.de?subject=${subject}&body=${body}`;
});

document.querySelector("#year").textContent = new Date().getFullYear();
