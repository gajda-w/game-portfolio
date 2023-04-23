const startButton = document.getElementById("start-button");
const loginScreen = document.getElementsByClassName(
  "login-screen"
)[0] as unknown as HTMLElement;
startButton?.addEventListener("click", () => {
  const audio = new Audio("./audio/login-screen-music-pack.mp3");
  audio.loop = true;
  audio.autoplay = true;
  audio.controls = true;
  audio.volume = 0.5;
  audio.play();
  setTimeout(() => {
    loginScreen.style.display = "none";
  }, 1000);
});

const playRandomSound = (sounds: HTMLAudioElement[]) => {
  const randomIndex = Math.floor(Math.random() * sounds.length);
  const audio = sounds[randomIndex];
  audio.volume = 0.5;
  audio.play();
};

const femaleWarriorChoose = document.getElementById("female-warrior");
const femaleArcherChoose = document.getElementById("female-archer");
const maleWarriorChoose = document.getElementById("male-warrior");
const maleAssasinChoose = document.getElementById("male-assasin");

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

maleAssasinChoose?.addEventListener("click", () => {
  localStorage.setItem("character", "male-assasin");
  window.location.assign("game.html");
});

const orcSound1 = new Audio("./audio/orc/orc-sound1.mp3");
const orcSound2 = new Audio("./audio/orc/orc-sound2.mp3");
const orcSound3 = new Audio("./audio/orc/orc-sound3.mp3");
const orcSoundsArray = [orcSound1, orcSound2, orcSound3];

maleAssasinChoose?.addEventListener("mouseover", () => {
  playRandomSound(orcSoundsArray);
});

const maleWarriorSound1 = new Audio(
  "./audio/male-warrior/male-warrior-sound1.wav"
);
const maleWarriorSoundsArray = [maleWarriorSound1];

maleWarriorChoose?.addEventListener("mouseover", () => {
  playRandomSound(maleWarriorSoundsArray);
});

const femaleWarriorSound1 = new Audio(
  "./audio/female-warrior/female-warrior-sound1.mov"
);

femaleWarriorChoose?.addEventListener("mouseover", () => {
  playRandomSound([femaleWarriorSound1]);
});

const femaleArcherSound1 = new Audio(
  "./audio/female-archer/female-archer-sound1.mov"
);

femaleArcherChoose?.addEventListener("mouseover", () => {
  playRandomSound([femaleArcherSound1]);
});

const parchment = document.querySelectorAll(".parchment");
const parchmentAudio = new Audio("./audio/parchment-sound.mov");

parchment.forEach((elem) => {
  elem.addEventListener("mouseover", () => {
    parchmentAudio.play();
  });
});
