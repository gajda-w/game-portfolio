const startButton = document.getElementById("start-button");
const loginScreen = document.getElementsByClassName(
  "login-screen"
)[0] as unknown as HTMLElement;
startButton?.addEventListener("click", () => {
  loginScreen.style.display = "none";
  const audio = new Audio("./audio/login-screen-music-pack.mp3");
  audio.play();
  console.log(audio);
  audio.loop = true;
  audio.autoplay = true;
  audio.controls = true;
  audio.volume = 0.5;
});

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
