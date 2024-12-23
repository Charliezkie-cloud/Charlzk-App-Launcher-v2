import anime from "animejs";

const duration = 1000;

document.addEventListener("DOMContentLoaded", () => {
  anime({
    targets: ".animate-to-top",
    top: ["150px", 0],
    opacity: "100%",
    duration: duration,
    easing: "easeOutQuint",
    delay: anime.stagger(100)
  });

  anime({
    targets: ".animate-to-bottom",
    top: ["-150px", 0],
    opacity: "100%",
    duration: duration,
    easing: "easeOutQuint",
    delay: anime.stagger(100)
  });

  anime({
    targets: ".animate-to-right",
    left: ["-150px", 0],
    opacity: "100%",
    duration: duration,
    easing: "easeOutQuint",
    delay: anime.stagger(100)
  });
});