const femaleWarriorChoose = document.getElementById("female-warrior");
const femaleArcherChoose = document.getElementById("female-archer");
const maleWarriorChoose = document.getElementById("male-warrior");
const maleArcherChoose = document.getElementById("male-assasin");

femaleWarriorChoose?.addEventListener("click", () => {
  localStorage.setItem("character", "female-warrior");
  window.location.assign("game.html");
});

femaleArcherChoose?.addEventListener("click", () => {
  localStorage.setItem("character", "female-archer");
  window.location.assign("game.html");
});

maleWarriorChoose?.addEventListener("click", () => {
  localStorage.setItem("character", "male-warrior");
  window.location.assign("game.html");
});

maleArcherChoose?.addEventListener("click", () => {
  localStorage.setItem("character", "male-assasin");
  window.location.assign("game.html");
});
