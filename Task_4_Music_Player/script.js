const songs = [
  {
    title: "SoundHelix Song 1",
    artist: "Demo Artist",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "SoundHelix Song 2",
    artist: "Demo Artist",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "SoundHelix Song 3",
    artist: "Demo Artist",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const currentEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const playlistEl = document.getElementById("playlist");
const autoplay = document.getElementById("autoplay");

let currentIndex = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

function renderPlaylist() {
  playlistEl.innerHTML = songs.map((song, index) => `
    <div class="track ${index === currentIndex ? "active" : ""}" data-index="${index}">
      <span class="track-number">${index + 1}</span>
      <div class="track-info">
        <strong>${song.title}</strong>
        <small>${song.artist}</small>
      </div>
    </div>
  `).join("");
}

function loadSong(index, autoPlay = false) {
  currentIndex = (index + songs.length) % songs.length;
  const song = songs[currentIndex];

  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.url;
  progress.value = 0;
  currentEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  renderPlaylist();

  if (autoPlay) {
    audio.play().catch(() => {});
  }
}

function togglePlay() {
  if (audio.paused) {
    audio.play().catch(() => {
      alert("The demo audio could not be loaded. Check your internet connection or replace the MP3 URL in script.js.");
    });
  } else {
    audio.pause();
  }
}

audio.addEventListener("play", () => playBtn.textContent = "❚❚");
audio.addEventListener("pause", () => playBtn.textContent = "▶");

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentEl.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener("ended", () => {
  if (autoplay.checked) loadSong(currentIndex + 1, true);
  else playBtn.textContent = "▶";
});

progress.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

document.getElementById("prev").addEventListener("click", () => loadSong(currentIndex - 1, true));
document.getElementById("next").addEventListener("click", () => loadSong(currentIndex + 1, true));
playBtn.addEventListener("click", togglePlay);

playlistEl.addEventListener("click", (e) => {
  const track = e.target.closest(".track");
  if (track) loadSong(Number(track.dataset.index), true);
});

audio.volume = volume.value;
loadSong(0);