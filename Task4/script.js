// SONG LIST

const songs = [
    {
        title: "Morning Breeze",
        artist: "Benjamin Tissot",
        src: "music/song1.mp3",
        image: "images/song1.jpg"
    },
    {
        title: "Ocean Waves",
        artist: "Luna Ray",
        src: "music/song2.mp3",
        image: "images/song2.jpg"
    },
    {
        title: "Lost in the Clouds",
        artist: "Ryan Bloom",
        src: "music/song3.mp3",
        image: "images/song3.jpg"
    },
    {
        title: "Moonlight Dreams",
        artist: "Luna Ray",
        src: "music/song4.mp3",
        image: "images/song4.jpg"
    },
    {
        title: "Golden Sunrise",
        artist: "Ethan Sky",
        src: "music/song5.mp3",
        image: "images/song5.jpg"
    },
    {
        title: "Dancing Lights",
        artist: "Mia Rose",
        src: "music/song6.mp3",
        image: "images/song6.jpg"
    }
];


// GET HTML ELEMENTS

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const albumImage = document.getElementById("albumImage");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const progressBar = document.getElementById("progressBar");
const volumeControl = document.getElementById("volumeControl");
const muteBtn = document.getElementById("muteBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const playlist = document.getElementById("playlist");
const albumContainer = document.querySelector(".album-container");


// VARIABLES

let currentSong = 0;
let shuffleMode = false;
let repeatMode = false;

// FORMAT TIME

function formatTime(time) {
    if (isNaN(time)) {
        return "0:00";
    }
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);

    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
}

// LOAD SONG

function loadSong(song) {
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumImage.src = song.image;
    audio.src = song.src;
    audio.currentTime = 0;
    currentTime.textContent = "0:00";
    progressBar.value = 0;

    // Keep repeat mode when changing songs
    audio.loop = repeatMode;

    // Update active playlist item
    const playlistItems = playlist.querySelectorAll("li");

    playlistItems.forEach((item, index) => {
        item.classList.toggle(
            "active",
            index === currentSong
        );
    });
    // Remove album rotation
    albumContainer.classList.remove("playing");
}

function playSong() {
    audio.play()
        .then(() => {
            playBtn.textContent = "⏸";
            albumContainer.classList.add("playing");
        })
        .catch((error) => {
            console.log("Unable to play audio:", error);
        });

}


// PAUSE SONG

function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
    albumContainer.classList.remove("playing");
}


// PLAY / PAUSE BUTTON

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();

    }

});



// GET RANDOM SONG


function getRandomSong() {
    let randomSong;
    do {
        randomSong =
            Math.floor(Math.random() * songs.length);
    } while (
        randomSong === currentSong &&
        songs.length > 1
    );
    return randomSong;
}



// NEXT SONG


nextBtn.addEventListener("click", () => {
    if (shuffleMode) {
        // SHUFFLE ON
        currentSong = getRandomSong();
    } else {
        // NORMAL ORDER
        currentSong++;
        if (currentSong >= songs.length) {
            currentSong = 0;

        }
    }

    loadSong(songs[currentSong]);
    playSong();

});

// PREVIOUS SONG

previousBtn.addEventListener("click", () => {
    currentSong--;
    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(songs[currentSong]);
    playSong();

});

// SONG DURATION


audio.addEventListener("loadedmetadata", () => {
    duration.textContent =
        formatTime(audio.duration);
});



// UPDATE CURRENT TIME


audio.addEventListener("timeupdate", () => {
    currentTime.textContent =
        formatTime(audio.currentTime);

    // Update progress bar

    if (audio.duration) {
        progressBar.value =
            (audio.currentTime / audio.duration) * 100;
    }

});



// PROGRESS BAR

progressBar.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime =
            (progressBar.value / 100) *
            audio.duration;
    }

});



// VOLUME

volumeControl.addEventListener("input", () => {
    audio.volume = volumeControl.value;
    audio.muted = false;
    muteBtn.textContent = "🔊";

});



// MUTE BUTTON

muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    if (audio.muted) {
        muteBtn.textContent = "🔇";
    } else {
        muteBtn.textContent = "🔊";
    }

});


// SHUFFLE BUTTON

shuffleBtn.addEventListener("click", () => {
    shuffleMode = !shuffleMode;
    shuffleBtn.classList.toggle(
        "active",
        shuffleMode
    );

});



// REPEAT BUTTON

repeatBtn.addEventListener("click", () => {
    repeatMode = !repeatMode;
    audio.loop = repeatMode;
    repeatBtn.classList.toggle(
        "active",
        repeatMode
    );
});


// CREATE PLAYLIST

songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="track-info">
            <span class="track-number">
                ${String(index + 1).padStart(2, "0")}
            </span>
            <div class="track-details">
                <strong>${song.title}</strong>
                <small>${song.artist}</small>
            </div>
        </div>`;
    li.addEventListener("click", () => {
        currentSong = index;
        loadSong(songs[currentSong]);
        playSong();
    });
    playlist.appendChild(li);
});


// WHEN SONG ENDS


audio.addEventListener("ended", () => {
    // If repeat is ON,
    // browser handles looping automatically.

    if (repeatMode) {
        return;
    }

    // If shuffle is ON

    if (shuffleMode) {
        currentSong = getRandomSong();
    } else {

        // Normal order

        currentSong++;
        if (currentSong >= songs.length) {
            currentSong = 0;
        }

    }


    loadSong(songs[currentSong]);
    playSong();
});

// KEYBOARD CONTROLS


document.addEventListener("keydown", (event) => {
    // Space=Play/Pause
    if (event.code === "Space") {
        event.preventDefault();
        playBtn.click();
    }


    // Right Arrow= Next
    if (event.code === "ArrowRight") {
        nextBtn.click();

    }


    // Left Arrow = Previous
    if (event.code === "ArrowLeft") {
        previousBtn.click();

    }

});

// LOAD FIRST SONG
loadSong(songs[currentSong]);

// Set initial volume
audio.volume = volumeControl.value;