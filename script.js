const playlistElement = document.getElementById("playlist");
const addSongButton = document.getElementById("add-song-btn");
const resetPlaylistButton = document.getElementById("reset-playlist-btn");
const musicPlayerElement = document.getElementById("music-player");

let songs = []; // song data
let currentSongIndex = -1; // track the current song index
let audio = new Audio(); // create an audio object

// add song functionality
addSongButton.addEventListener("click", () => {
  const songTitle = prompt("Enter song title:");
  const songArtist = prompt("Enter song artist:");
  if (songTitle && songArtist) {
    const song = { title: songTitle, artist: songArtist };
    songs.push(song);
    updatePlaylist();
  } else {
    alert("Song title and artist cannot be empty.");
  }
});

// delete song functionality
function deleteSong(index) {
  songs.splice(index, 1); // remove the song at the specified index
  updatePlaylist();
}

// reset playlist functionality
resetPlaylistButton.addEventListener("click", () => {
  songs = [];
  updatePlaylist();
});

// update playlist functionality
function updatePlaylist() {
  playlistElement.innerHTML = "";
  songs.forEach((song, index) => {
    const songElement = document.createElement("li");
    songElement.textContent = `${song.title} by ${song.artist}`;

    // Create delete button for each song
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteSong(index); // bind delete function
    songElement.appendChild(deleteButton);

    // Create play button for each song
    const playButton = document.createElement("button");
    playButton.textContent = "Play";
    playButton.onclick = () => {
      currentSongIndex = index; // update current song index
      loadSong(currentSongIndex); // load the selected song
    };
    songElement.appendChild(playButton);

    playlistElement.appendChild(songElement);
  });
  resetPlaylistButton.style.display = songs.length === 0 ? "none" : "block";

  // Stop playing music if the playlist is empty
  if (songs.length === 0) {
    stopPlaying(); // Stop the audio
  } else if (currentSongIndex === -1) {
    currentSongIndex = 0; // set current song index to 0
    loadSong(currentSongIndex); // load the first song
  }
}

// Load a song into the audio player
function loadSong(index) {
  if (index < songs.length) {
    const song = songs[index];
    // For demonstration purposes, this will assume the audio file is named the same as the title
    audio.src = `path/to/your/music/${song.title}.mp3`; // Replace with the correct path or URL to your music file
    audio.load(); // Load the audio
    audio.play(); // Automatically play the loaded song
    displayCurrentSong(song.title, song.artist); // Display the current song title and artist
  }
}

// Display the current song title and artist
function displayCurrentSong(title, artist) {
  musicPlayerElement.innerHTML = `
        <h3>Now Playing:</h3>
        <p>${title} by ${artist}</p>
        <button id="play-pause-btn" aria-label="Play/Pause">Pause</button>
        <button id="next-btn" aria-label="Next Song">Next</button>
    `;
}

// Play or pause the current song
function playPauseSong() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

// Next song functionality
function nextSong() {
  currentSongIndex++;
  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0; // loop back to the start
  }
  loadSong(currentSongIndex);
}

// Stop playing the audio
function stopPlaying() {
  audio.pause(); // Pause the audio
  audio.currentTime = 0; // Reset the audio position to the start
  musicPlayerElement.innerHTML =
    "<h3>Now Playing:</h3><p>No song is playing.</p>"; // Reset the music player display
}

// Add event listeners for buttons
musicPlayerElement.addEventListener("click", (e) => {
  if (e.target.id === "play-pause-btn") {
    playPauseSong();
    e.target.textContent = audio.paused ? "Play" : "Pause";
  } else if (e.target.id === "next-btn") {
    nextSong();
  }
});

// Update audio state when the song ends
audio.addEventListener("ended", () => {
  nextSong();
});
