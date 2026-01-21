
const revealTargets = document.querySelectorAll(".reveal");

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);

revealTargets.forEach((el) => io.observe(el));


const cards = document.getElementById("cards");
const btnLeft = document.querySelector(".scroll-btn.left");
const btnRight = document.querySelector(".scroll-btn.right");

function scrollCards(dir) {
  if (!cards) return;
  const amount = 320; // px
  cards.scrollBy({ left: dir * amount, behavior: "smooth" });
}

btnLeft?.addEventListener("click", () => scrollCards(-1));
btnRight?.addEventListener("click", () => scrollCards(1));
