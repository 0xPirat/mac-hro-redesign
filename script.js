document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress span");
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".main-nav");
const form = document.querySelector("#contact-form");
const { services, clients, rotatingWords } = window.MAC_HRO_CONTENT;

const updateScrollUI = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
};
updateScrollUI();
window.addEventListener("scroll", updateScrollUI, { passive: true });

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

const tabs = document.querySelector("#service-tabs");
const panel = document.querySelector("#service-panel");

const renderService = (serviceId, focusPanel = false) => {
  const item = services.find((service) => service.id === serviceId) || services[0];
  tabs.querySelectorAll("button").forEach((button) => {
    const active = button.dataset.service === item.id;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });
  panel.innerHTML = `
    <p class="panel-kicker">${item.kicker}</p>
    <h3>${item.title}</h3>
    <p class="panel-intro">${item.intro}</p>
    <div class="panel-groups">
      ${item.groups.map((group, index) => `
        <section class="panel-group" style="--delay:${index * 55}ms">
          <span>0${index + 1}</span>
          <h4>${group.title}</h4>
          <ul>${group.items.map((entry) => `<li>${entry}</li>`).join("")}</ul>
        </section>
      `).join("")}
    </div>`;
  panel.dataset.active = item.id;
  if (focusPanel) panel.focus({ preventScroll: true });
};

services.forEach((service, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.role = "tab";
  button.dataset.service = service.id;
  button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span>${service.label}<i aria-hidden="true">↗</i>`;
  button.addEventListener("click", () => renderService(service.id));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return;
    event.preventDefault();
    const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
    const next = (index + direction + services.length) % services.length;
    tabs.children[next].focus();
    renderService(services[next].id);
  });
  tabs.append(button);
});
renderService(services[0].id);

document.querySelector("#client-cloud").innerHTML = clients.map((client, index) =>
  `<span style="--i:${index}">${client}</span>`
).join("");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const word = document.querySelector(".word-cycle");
let wordIndex = 0;
if (!prefersReducedMotion.matches) {
  window.setInterval(() => {
    word.classList.add("changing");
    window.setTimeout(() => {
      wordIndex = (wordIndex + 1) % rotatingWords.length;
      word.textContent = rotatingWords[wordIndex];
      word.classList.remove("changing");
    }, 230);
  }, 2600);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -50px" });
document.querySelectorAll(".reveal, .service-card, .process-steps li").forEach((item) => revealObserver.observe(item));

if (!prefersReducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  document.querySelector(".hero").addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    document.documentElement.style.setProperty("--pointer-x", `${x * 24}px`);
    document.documentElement.style.setProperty("--pointer-y", `${y * 24}px`);
  });
}

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
