const player = document.getElementById("player");
const videoList = document.getElementById("videoList");
const nowPlaying = document.getElementById("nowPlaying");

async function load() {
  const res = await fetch("library.json");
  const data = await res.json();

  videoList.innerHTML = "";

  data.tracks.forEach((track, index) => {
    const div = document.createElement("div");
    div.className = "video-item";
    div.textContent = track.title;

    div.onclick = () => {
      play(track.id, track.title);
    };

    videoList.appendChild(div);

    if (index === 0) {
      play(track.id, track.title);
    }
  });
}

function play(id, title) {
  player.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
  nowPlaying.textContent = title;
}

load();
