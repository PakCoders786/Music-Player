// Alan Walker playlist (add more as needed)
const songs = [
    {
        name: "Faded",
        artist: "Alan Walker",
        src: "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5e2.mp3",
        cover: "https://upload.wikimedia.org/wikipedia/en/7/7f/Alan_Walker_-_Faded.png"
    },
    {
        name: "Alone",
        artist: "Alan Walker",
        src: "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5e2.mp3",
        cover: "https://upload.wikimedia.org/wikipedia/en/2/2e/Alan_Walker_-_Alone.png"
    },
    {
        name: "Spectre",
        artist: "Alan Walker",
        src: "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5e2.mp3",
        cover: "https://upload.wikimedia.org/wikipedia/en/6/6b/Alan_Walker_-_The_Spectre.png"
    }
];

// DOM elements
const album = document.querySelector('.album');
const trackArt = document.querySelector('.track-art');
const title = document.querySelector('.title');
const artist = document.querySelector('.artist');
const slider = document.querySelector('.slider');
const currentTimeEl = document.querySelector('.current-time');
const totalDurationEl = document.querySelector('.total-duration');
const volumeSlider = document.querySelector('.volume-slider');
const playBtn = document.querySelector('.play-track');
const prevBtn = document.querySelector('.prev-track');
const nextBtn = document.querySelector('.next-track');
const randomBtn = document.querySelector('.random-track');
const repeatBtn = document.querySelector('.repeat-track');
const playlistDiv = document.getElementById('playlist');

// Create audio element
let audio = new Audio();
let currentSong = 0;
let isPlaying = false;
let isRandom = false;
let isRepeat = false;
let updateTimer;

// Render playlist
function renderPlaylist() {
    playlistDiv.innerHTML = "";
    songs.forEach((song, idx) => {
        const btn = document.createElement('button');
        btn.className = idx === currentSong ? "active" : "";
        btn.innerHTML = `
            <img src="${song.cover}" alt="cover">
            <div class="track-info">
                <div class="track-title">${song.name}</div>
                <div class="track-artist">${song.artist}</div>
            </div>
        `;
        btn.onclick = () => {
            loadTrack(idx);
            playTrack();
        };
        playlistDiv.appendChild(btn);
    });
}

// Load track and show cover in .track-art
function loadTrack(index) {
    clearInterval(updateTimer);
    resetValues();
    currentSong = index;
    audio.src = songs[index].src;
    audio.load();

    title.textContent = songs[index].name;
    artist.textContent = songs[index].artist;
    album.textContent = `Playing ${index + 1} of ${songs.length}`;
    trackArt.innerHTML = `<img src="${songs[index].cover}" alt="cover">`;
    document.getElementById('cd-cover').src = songs[index].cover;
    renderPlaylist();

    updateTimer = setInterval(seekUpdate, 500);

    audio.onended = nextTrackAuto;
    audio.onloadedmetadata = () => {
        totalDurationEl.textContent = formatTime(audio.duration);
    };
}

// Reset
function resetValues() {
    currentTimeEl.textContent = "00:00";
    totalDurationEl.textContent = "00:00";
    slider.value = 0;
}

// Play
function playTrack() {
    audio.play().catch(() => {});
    isPlaying = true;
    playBtn.innerHTML = '<i class="ri-pause-circle-fill"></i>';
    document.getElementById('wave').classList.add('playing');
    volumeSlider.value = audio.volume * 100;
    animateCD();
}

// Pause
function pauseTrack() {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '<i class="ri-play-circle-fill"></i>';
    document.getElementById('wave').classList.remove('playing');
    cancelAnimationFrame(cdAnimationFrame);
}

// Play/Pause toggle
playBtn.onclick = function() {
    isPlaying ? pauseTrack() : playTrack();
};

// Next
function nextTrack() {
    if (isRandom) {
        let rand = Math.floor(Math.random() * songs.length);
        while (rand === currentSong && songs.length > 1) rand = Math.floor(Math.random() * songs.length);
        loadTrack(rand);
    } else {
        currentSong = (currentSong + 1) % songs.length;
        loadTrack(currentSong);
    }
    playTrack();
}
nextBtn.onclick = nextTrack;

// Previous
function prevTrack() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadTrack(currentSong);
    playTrack();
}
prevBtn.onclick = prevTrack;

// Random
randomBtn.onclick = function() {
    isRandom = !isRandom;
    randomBtn.classList.toggle("active", isRandom);
};

// Repeat
repeatBtn.onclick = function() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle("active", isRepeat);
};

// Auto next or repeat
function nextTrackAuto() {
    if (isRepeat) {
        loadTrack(currentSong);
        playTrack();
    } else {
        nextTrack();
    }
}

// Seek
slider.oninput = function() {
    if (audio.duration) {
        audio.currentTime = (slider.value / 100) * audio.duration;
    }
};

// Update seek bar
function seekUpdate() {
    if (audio.duration) {
        let seekPosition = (audio.currentTime / audio.duration) * 100;
        slider.value = seekPosition;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalDurationEl.textContent = formatTime(audio.duration);
    }
}

// Format time
function formatTime(sec) {
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

// Volume
function setvolume() {
    audio.volume = volumeSlider.value / 100;
}
volumeSlider.oninput = setvolume;

// Keyboard shortcuts (optional)
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        isPlaying ? pauseTrack() : playTrack();
    } else if (e.code === 'ArrowRight') {
        nextTrack();
    } else if (e.code === 'ArrowLeft') {
        prevTrack();
    }
});

// Initial
window.onload = function() {
    slider.min = 0;
    slider.max = 100;
    slider.value = 0;
    loadTrack(currentSong);
    setvolume();
    renderPlaylist();
};

// Animate wave when playing
const wave = document.getElementById('wave');
if (wave) {
    const animate = () => {
        if (isPlaying) {
            Array.from(wave.children).forEach((span) => {
                span.style.height = (10 + Math.random() * 30) + "px";
            });
        } else {
            Array.from(wave.children).forEach((span) => {
                span.style.height = "10px";
            });
        }
        requestAnimationFrame(animate);
    };
    animate();
}

// CD animation
let cd = document.getElementById('cd');
let rotation = 0;
let cdAnimationFrame;

function animateCD() {
    if (isPlaying) {
        rotation = (rotation + 0.5) % 360;
        cd.style.transform = `rotate(${rotation}deg)`;
        cdAnimationFrame = requestAnimationFrame(animateCD);
    }
}