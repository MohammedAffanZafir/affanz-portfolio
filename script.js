(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const dots = [...document.querySelectorAll(".dot")];
  const currentLabel = document.getElementById("currentSlide");
  const totalLabel = document.querySelector(".slide-count span:last-child");
  const progress = document.getElementById("progress");
  const prev = document.getElementById("prevSlide");
  const next = document.getElementById("nextSlide");
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menuToggle");
  const modal = document.getElementById("projectModal");
  let current = 0;
  let touchStartX = null;
  if (totalLabel) totalLabel.textContent = String(slides.length).padStart(2, "0");

  const projectDetails = {
    helmet: {
      kicker: "PROJECT 01 / COMPUTER VISION",
      title: "Two-Wheeler Helmet Detection",
      body: "A computer-vision project focused on detecting helmet usage in two-wheeler images and video. The workflow explores YOLOv8 and YOLO11, upload-based inference, confidence-threshold tuning, and comparing model outputs. Add your actual dataset, measured results, and GitHub repository link when ready.",
      tags: ["Python", "YOLOv8", "YOLO11", "OpenCV", "Video inference"]
    },
    road: {
      kicker: "PROJECT 02 / SMART INFRASTRUCTURE",
      title: "Road Surface Damage Detection",
      body: "A lightweight road-damage detection concept using YOLOv7 enhanced with ShuffleNetV2 and Scale Equalizing Pyramid Convolution (SEPC), with the RDD2022 India subset. The goal is to help identify surface damage from road imagery. Add verified metrics and your repository link when available.",
      tags: ["YOLOv7", "ShuffleNetV2", "SEPC", "RDD2022", "Python"]
    },
    intellicool: {
      kicker: "PROJECT 03 / IOT CONCEPT",
      title: "INTELLICOOL — Intelligent Cooling System",
      body: "A proposed sensor-driven evaporative cooling system that aims to regulate water flow based on temperature and humidity. The concept explores a microcontroller, sensors, a low-voltage pump, and water-efficient control while keeping electronics isolated from water for safety.",
      tags: ["Arduino", "Sensors", "Embedded systems", "Energy efficiency"]
    }
  };

  function showSlide(index, direction = 1) {
    const target = (index + slides.length) % slides.length;
    if (target === current && slides[current].classList.contains("active")) return;
    slides.forEach((slide, i) => {
      slide.classList.remove("exit-left");
      slide.classList.toggle("active", i === target);
      if (i === current && direction > 0) slide.classList.add("exit-left");
    });
    current = target;
    navLinks.forEach((link, i) => link.classList.toggle("active", i === current));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    currentLabel.textContent = String(current + 1).padStart(2, "0");
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
    history.replaceState(null, "", `#${slides[current].id}`);
    slides[current].scrollTop = 0;
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.title = `${slides[current].dataset.title} | Mohammed Affan Zafir`;
  }

  navLinks.forEach(link => link.addEventListener("click", () => {
    const target = Number(link.dataset.slide);
    showSlide(target, target > current ? 1 : -1);
  }));
  dots.forEach(dot => dot.addEventListener("click", () => {
    const target = Number(dot.dataset.slide);
    showSlide(target, target > current ? 1 : -1);
  }));
  document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => showSlide(Number(button.dataset.go), 1)));
  prev.addEventListener("click", () => showSlide(current - 1, -1));
  next.addEventListener("click", () => showSlide(current + 1, 1));
  menuToggle.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(opened));
  });

  document.addEventListener("keydown", event => {
    if (modal.classList.contains("open")) {
      if (event.key === "Escape") closeModal();
      return;
    }
    if (["ArrowRight", "PageDown"].includes(event.key)) { event.preventDefault(); showSlide(current + 1, 1); }
    if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); showSlide(current - 1, -1); }
    if (event.key === "Home") showSlide(0, -1);
    if (event.key === "End") showSlide(slides.length - 1, 1);
  });

  document.getElementById("deck").addEventListener("wheel", event => {
    if (window.innerWidth <= 700) return;
    if (Math.abs(event.deltaY) < 35) return;
    event.preventDefault();
    showSlide(current + (event.deltaY > 0 ? 1 : -1), event.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  document.getElementById("deck").addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  document.getElementById("deck").addEventListener("touchend", event => {
    if (touchStartX === null) return;
    const diff = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 65) showSlide(current + (diff < 0 ? 1 : -1), diff < 0 ? 1 : -1);
    touchStartX = null;
  }, { passive: true });

  document.querySelectorAll("[data-project]").forEach(card => card.addEventListener("click", () => openModal(projectDetails[card.dataset.project])));
  function openModal(project) {
    if (!project) return;
    document.getElementById("modalKicker").textContent = project.kicker;
    document.getElementById("modalTitle").textContent = project.title;
    document.getElementById("modalBody").textContent = project.body;
    const tags = document.getElementById("modalTags");
    tags.replaceChildren(...project.tags.map(tag => {
      const span = document.createElement("span"); span.textContent = tag; return span;
    }));
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    modal.querySelector(".modal-close").focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
  modal.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", closeModal));
  document.getElementById("year").textContent = new Date().getFullYear();

  const initialHash = location.hash.slice(1);
  const initialIndex = slides.findIndex(slide => slide.id === initialHash);
  if (initialIndex > 0) {
    slides.forEach((slide, i) => slide.classList.toggle("active", i === initialIndex));
    current = initialIndex;
    navLinks.forEach((link, i) => link.classList.toggle("active", i === current));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    currentLabel.textContent = String(current + 1).padStart(2, "0");
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
  } else {
    progress.style.width = `${100 / slides.length}%`;
  }
})();
