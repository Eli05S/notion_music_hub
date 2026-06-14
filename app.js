const params = new URLSearchParams(window.location.search);
const playlistId = params.get("list");

const player = document.getElementById("player");
const videoList = document.getElementById("videoList");
const nowPlaying = document.getElementById("nowPlaying");

if (!playlistId) {
  videoList.innerHTML = "❌ No playlist provided (?list=...)";
} else {
  init();
}

async function init() {
  try {
    videoList.innerHTML = "Loading playlist... 🎵";

    // This endpoint is MUCH more stable than scraping YouTube HTML
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/playlist?list=${playlistId}&format=json`);

    // IMPORTANT: oEmbed does NOT give videos — just validates playlist exists
    // So we switch to a reliable workaround: YouTube playlist feed via RSS

    const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;

    const rssRes = await fetch(rssUrl);
    const text = await rssRes.text();

    const videoIds = [...text.matchAll(/<yt:videoId>(.*?)<\/yt:videoId>/g)]
      .map(m => m[1]);

    if (!videoIds.length) {
      videoList.innerHTML = "❌ Could not load videos (playlist may be private or restricted)";
      return;
    }

    videoList.innerHTML = "";

    videoIds.forEach((id, index) => {
      const div = document.createElement("div");
      div.className = "video-item";
      div.textContent = `Track ${index + 1}`;

      div.onclick = () => playVideo(id);

      videoList.appendChild(div);

      if (index === 0) {
        playVideo(id);
      }
    });

  } catch (err) {
    console.error(err);
    videoList.innerHTML = "❌ Error loading playlist";
  }
}

function playVideo(videoId) {
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  nowPlaying.textContent = `Now playing: ${videoId}`;
}
