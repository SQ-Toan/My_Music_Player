const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "Avocado_Player";

// Elements
const container = $(".container");
const menuBtn = $(".menu-btn");
const coverImage = $(".cover-image");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const playlist = $("#playlist");
const info = $(".info");
const currentSongTitle = $(".current-song-title");
const favourite = $("#favourite");
const playPauseBtn = $("#playpause");
const nextBtn = $("#next");
const prevBtn = $("#prev");
const shuffleBtn = $("#shuffle");
const repeatBtn = $("#repeat");
const progressBar = $(".bar");
const progressDot = $(".dot");
const currentTimeEl = $(".current-time");
const durationEl = $(".duration");
const audio = $("#audio");
const increaseVolumeBtn = $(".increase-volume");
const decreaseVolumeBtn = $(".decrease-volume");
const volumeBar = $(".volume-bar--color");
const volumeValue = $(".volume-value");
const mainVolumeBar = $(".volume-bar");

// Variables
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const songs = [
    {
        title: "Đừng làm trái tim anh đau",
        singer: "Sơn Tùng-MTP",
        image: "assets/imgs/sontung.webp",
        src: "assets/audio/dung_lam_trai_tim_anh_dau.mp3",
    },
    {
        title: "Đi tìm tình yêu",
        singer: "MONO",
        image: "assets/imgs/mono.jpg",
        src: "assets/audio/di_tim_tinh_yeu.mp3",
    },
    {
        title: "Bạn đời",
        singer: "KARIK ft. GDUCKY",
        image: "assets/imgs/karik_gducky.jpg",
        src: "assets/audio/ban_doi.mp3",
    },
    {
        title: "Cô gái m52",
        singer: "HUYR",
        image: "assets/imgs/huyr.jpg",
        src: "assets/audio/co_gai_m52.mp3",
    },
    {
        title: "Hit me up",
        singer: "Binz",
        image: "assets/imgs/binz.jpg",
        src: "assets/audio/hit_me_up.mp3",
    },
    {
        title: "Thằng điên",
        singer: "Justatee ft. Phương Ly",
        image: "assets/imgs/crazyman.jpg",
        src: "assets/audio/thang_dien.mp3",
    },
    {
        title: "This way",
        singer: "Cara",
        image: "assets/imgs/cara.jpg",
        src: "assets/audio/this_way.mp3",
    },
    {
        title: "Tuý âm",
        singer: "Xesi",
        image: "assets/imgs/xesi.jpg",
        src: "assets/audio/tuy_am.mp3",
    },
    {
        title: "Yêu một người có lẽ",
        singer: "Lou Hoàng ft. Miu Lê",
        image: "assets/imgs/yeumotnguoicole.jpg",
        src: "assets/audio/yeu_mot_nguoi_co_le.mp3",
    },
];
// App
const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    favourites: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    randomSongs: [],
    songs,
    handleEvents() {
        const _this = this;
        // Làm Menu Button
        menuBtn.addEventListener("click", () => {
            $(".container").classList.toggle("active");
            if ($(".container.active")) {
                cd.style.visibility = "hidden";
                setTimeout(() => {
                    coverImage.style.background = `url(${
                        _this.songs[_this.currentIndex].image
                    }) no-repeat`;
                    coverImage.style.backgroundSize = "cover";
                    coverImage.style.backgroundPosition = "center";
                }, 100);
            } else {
                setTimeout(() => {
                    cd.style.visibility = "visible";
                }, 180);
                coverImage.style.background =
                    "linear-gradient(to top, rgba(255, 0, 0, 0), rgba(109, 213, 237, .4))";
            }
        });

        // Làm chức năng play pause bài hát
        playPauseBtn.addEventListener("click", () => {
            if (_this.isPlaying) {
                // pause if already playing
                playPauseBtn.classList.replace("fa-pause", "fa-play");
                _this.isPlaying = false;
                audio.pause();
            } else {
                playPauseBtn.classList.replace("fa-play", "fa-pause");
                _this.isPlaying = true;
                audio.play();
            }
        });

        // Làm chức năng next, prev bài hát
        nextBtn.addEventListener("click", _this.nextSong.bind(_this));
        prevBtn.addEventListener("click", _this.prevSong.bind(_this));

        // Làm chức năng nhấn vào list bài hát, nhấn vào bài hát muốn phát
        playlist.addEventListener("click", (e) => {
            const tableListElement = e.target.closest("#playlist");
            const songElement = e.target.closest(".song");
            const heartElement = e.target.closest(".heart-beat");
            const item = e.target.closest(".song");
            const indexElements = $$(".song");

            // Kiểm tra nếu không click vào song thì không làm gì cả
            if (!item) return;

            // Lấy index của item
            const index = Array.from(indexElements).indexOf(item);

            // Array.from(indexElements).forEach((item, index) => {
            //     // Xử lý để khi click vào lấy ra index tương ứng
            //     item.onclick = function () { //cách duyệt mảng gây lag web

            // Kiểm tra nếu click vào 1 trong ba element trên thì không chuyển bài
            if (!tableListElement || !songElement || !heartElement) {
                _this.currentIndex = index;

                // fix lại coverImage khi chuyển nhạc
                setTimeout(() => {
                    coverImage.style.background = `url(${
                        _this.songs[_this.currentIndex].image
                    }) no-repeat`;
                    coverImage.style.backgroundSize = "cover";
                    coverImage.style.backgroundPosition = "center";
                }, 100);

                // Làm audio "chơi" ngay khi chuyển bài
                playPauseBtn.classList.replace("fa-play", "fa-pause");
                _this.loadSong();
                audio.play();
                _this.isPlaying = true;
            }

            // Chức năng thêm bài hát vào mục yêu thích
            if (e.target === item.lastChild.lastElementChild) {
                if (
                    item.lastChild.lastElementChild.classList.contains(
                        "fa-heart"
                    )
                ) {
                    _this.addToFavourites(index);
                    return;
                }
            }
            //     };
            // });
        });

        // Làm chức năng thêm vào yêu thích trên giao diện
        favourite.addEventListener("click", () => {
            favourite.classList.toggle("active");

            _this.addToFavouritesOnScreen(_this.currentIndex);
        });

        // Làm chức năng random bài hát
        shuffleBtn.addEventListener("click", () => {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            shuffleBtn.classList.toggle("active");
        });

        // Làm chức năng repeat bài hát
        repeatBtn.addEventListener("click", () => {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active");

            _this.repeatSong();
        });

        // Tự động chuyển bài khi bài nhạc hết
        audio.addEventListener("ended", () => {
            if (_this.isRepeat) {
                _this.loadSong();
                audio.play();
            } else {
                _this.nextSong();
            }
        });

        // Cập nhập progress bar theo event timeupdate có trong audio
        audio.addEventListener("timeupdate", _this.progress.bind(_this));

        // Thay đổi progress khi click on bar
        progressBar.addEventListener("click", (e) => {
            let width = progressBar.clientWidth;
            let clickX = e.offsetX;
            let duration = audio.duration;
            audio.currentTime = (clickX / width) * duration;
        });

        // Làm hiệu ứng beat Effect cho CD Thumb
        audio.addEventListener("play", () => {
            if (audioContext.state === "suspended") {
                audioContext.resume();
            }
            _this.animateThumb();
        });

        // Làm nút tăng/giảm âm lượng
        increaseVolumeBtn.addEventListener("click", () => {
            if (audio.volume < 1) {
                _this.increaseVolume();
            } else {
                return;
            }
        });

        decreaseVolumeBtn.addEventListener("click", () => {
            if (audio.volume > 0) {
                _this.decreaseVolume();
            } else {
                return;
            }
        });

        // Chọn mức âm lượng bằng cách nhấn vào thanh bar
        mainVolumeBar.addEventListener("click", (e) => {
            let width = mainVolumeBar.clientWidth;
            let clickX = e.offsetX;
            volumeBar.style.right = `${100 - (clickX / width) * 100}%`;
            audio.volume = (clickX / width).toFixed(2);
            volumeValue.innerHTML = ((clickX / width) * 100).toFixed(0);
        });
    },

    // Update danh sách nhạc hiện có
    updateSongs() {
        // Loại bỏ các elements đang tồn tại
        playlist.innerHTML = "";

        this.songs.forEach((song, index) => {
            // extract dữ liệu từ song
            const { title, src } = song;

            // Kiểm tra xem bài hát có trong array favourites không
            const isFavourite = this.favourites.includes(index);

            // Tạo 1 tr element
            const tr = document.createElement("tr");
            tr.classList.add("song");
            tr.innerHTML = `<td class="no">
                             <h4>${index + 1}</h4>
                         </td>
 
                         <td class="title">
                             <h4>${title}</h4>
                         </td>
 
                         <td class="length">
                             <h4></h4>
                         </td>
 
                         <td>
                             <i class="fa-solid fa-heart heart-beat ${
                                 isFavourite ? "active" : ""
                             }"></i>
                         </td>`;
            playlist.appendChild(tr);

            // Định dạng thời lượng audio theo form 1:15
            const audioForDuration = new Audio(src);
            audioForDuration.addEventListener("loadedmetadata", () => {
                const duration = audioForDuration.duration;
                let songDuration = formatTime(duration); // Tạo hàm format thời lượng audio
                tr.querySelector(".length h4").innerText = songDuration;
            });
        });
    },

    // Tải thông tin bài hát hiện tại
    loadSong() {
        // Cập nhập tên ca sĩ và tựa đề bài hát lên info
        info.innerHTML = `<h2>${this.songs[this.currentIndex].title}</h2>
                <h3>${this.songs[this.currentIndex].singer}</h3>`;

        currentSongTitle.innerHTML = this.songs[this.currentIndex].title;
        // Cập nhập phần cover Image và cd
        cdThumb.style.background = `url(${
            this.songs[this.currentIndex].image
        }) no-repeat`;

        cdThumb.style.backgroundSize = "cover";
        cdThumb.style.backgroundPosition = "center";

        if ($(".container.active")) {
            cd.style.visibility = "hidden";
            setTimeout(() => {
                coverImage.style.background = `url(${
                    this.songs[this.currentIndex].image
                }) no-repeat`;
                coverImage.style.backgroundSize = "cover";
                coverImage.style.backgroundPosition = "center";
            }, 100);
        }
        // Thêm src của bài hát hiện tại vào audio
        audio.src = `${this.songs[this.currentIndex].src}`;

        // Kiểm tra bài hát có trong danh sách yêu thích hay không để thêm class active vào heart
        if (this.favourites.includes(this.currentIndex)) {
            favourite.classList.add("active");
        } else {
            favourite.classList.remove("active");
        }

        // Hiện thị thanh volume
        let currentVolume = (audio.volume * 100).toFixed(0);
        volumeBar.style.right = `calc(100% - ${currentVolume}%)`;
    },

    // Tạo hàm next,prev bài hát
    nextSong() {
        const length = this.songs.length;
        if (this.isRandom) {
            this.handleShuffleSong();
            this.loadSong();
        } else {
            if (this.currentIndex < length - 1) {
                this.currentIndex++;
                console.log(this.currentIndex);
            } else {
                this.currentIndex = 0;
            }
            this.loadSong();
        }

        if (this.isPlaying) {
            audio.play();
        } else {
            progressDot.style.transform = `translateX(0)`;
        }

        this.setConfig("currentIndex", this.currentIndex);
    },

    prevSong() {
        const length = this.songs.length;
        if (this.isRandom) {
            this.handleShuffleSong();
            this.loadSong();
        } else {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                console.log(this.currentIndex);
            } else {
                this.currentIndex = length - 1;
            }
            this.loadSong();
        }

        if (this.isPlaying) {
            audio.play();
        } else {
            progressDot.style.transform = `translateX(0)`;
        }

        this.setConfig("currentIndex", this.currentIndex);
    },
    // Tạo hàm random bài hát
    shuffleSong() {
        if (this.isRandom) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.songs.length);
            } while (newIndex === this.currentIndex);
            this.currentIndex = newIndex;
        }
    },

    // Tạo hàm xử lý việc bị lặp 1 bài hát nhiều lần khi random
    handleShuffleSong() {
        // Thêm bài hát hiện tại vào danh sách randomSongs nếu chưa có
        if (!this.randomSongs.includes(this.currentIndex)) {
            this.randomSongs.push(this.currentIndex);
        }

        // Nếu danh sách lặp đã đầy, khôi phục lại danh sách lặp và lặp lại từ đầu
        if (this.randomSongs.length === this.songs.length) {
            this.randomSongs = [];
        }

        // Kiểm tra nếu bài hát random đã được lặp thì chọn bài hát mới
        do {
            this.shuffleSong();
        } while (this.randomSongs.includes(this.currentIndex));
    },

    //
    // Tạo hàm repeat bài hát
    repeatSong() {
        if (this.isRepeat) {
            this.currentIndex = this.currentIndex;
        }
    },

    // Xử lý việc thêm, xoá bài hát ở mục yêu thích trong menu bar
    addToFavourites(index) {
        const indexElements = $$(".song");
        const item = indexElements[index];
        const heartIcon = item.lastChild.lastElementChild;
        // Nếu bài hát đã yêu thích thì remove
        if (this.favourites.includes(index)) {
            // Xoá khỏi danh sách yêu thích
            this.favourites = this.favourites.filter((item) => item !== index);
            heartIcon.classList.remove("active");

            // Nếu bài hát hiện tại đang phát, cập nhập nút yêu thích
            if (index === this.currentIndex) {
                favourite.classList.remove("active");
            }
            this.setConfig("favourites", this.favourites);
        } else {
            // Nếu bài hát chưa yêu thích thì add
            this.favourites.push(index);
            // Cập nhập lại giao diện
            heartIcon.classList.add("active");

            // Check xem nếu bài hát yêu thích đang là bài hát đang phát thì active heart lên giao diện
            if (index === this.currentIndex) {
                favourite.classList.add("active");
            }
            this.setConfig("favourites", this.favourites);
        }

        console.log(this.favourites);
    },

    // Xử lý thêm/ xoá yêu thích ở giao diện
    addToFavouritesOnScreen(currentIndexSong) {
        const indexElements = $$(".song");
        const item = indexElements[currentIndexSong];
        const index = Array.from(indexElements).indexOf(item);

        this.addToFavourites(index);
    },

    // Xử lý việc cập nhập thời gian trên thanh progress bar
    progress() {
        let { duration, currentTime } = audio;

        isNaN(duration) ? (duration = 0) : duration;
        isNaN(currentTime) ? (currentTime = 0) : currentTime;

        // Cập nhập Elements
        currentTimeEl.innerHTML = formatTime(currentTime);
        durationEl.innerHTML = formatTime(duration);

        // Cập nhập di chuyển progress dot
        let progressPercentage = (currentTime / duration) * 100;
        let progressMeter =
            progressPercentage * (progressBar.offsetWidth / 100);

        progressDot.style.transform = `translateX(${progressMeter}px)`;
    },

    // Xử lý hiệu ứng beat effect
    animateThumb() {
        requestAnimationFrame(this.animateThumb.bind(this));
        analyser.getByteFrequencyData(dataArray);
        const avgFrequency =
            dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        const scale = 1 + avgFrequency / 256;
        cdThumb.style.transform = `scale(${scale})`;
    },

    // Xử lý giá trị âm thanh
    increaseVolume() {
        let currentVolume = audio.volume * 100 + 1;
        audio.volume = (currentVolume / 100).toFixed(2);

        // Cập nhập lên trên volumeValue
        volumeValue.innerHTML = currentVolume.toFixed(0);

        // Cập nhập volumeBar
        volumeBar.style.right = `calc(100% - ${currentVolume}%)`;
    },
    decreaseVolume() {
        let currentVolume = audio.volume * 100 - 1;
        audio.volume = (currentVolume / 100).toFixed(2);

        // Cập nhập lên trên volumeValue
        volumeValue.innerHTML = currentVolume.toFixed(0);

        // Cập nhập volumeBar
        volumeBar.style.right = `calc(100% - ${currentVolume}%)`;
    },

    // Load config trên localStorage
    loadConfig() {
        this.isRandom = this.config["isRandom"];
        this.isRepeat = this.config["isRepeat"];
        this.favourites = this.config["favourites"]
            ? this.config["favourites"]
            : [];

        this.currentIndex = this.config["currentIndex"]
            ? this.config["currentIndex"]
            : 0;
    },

    // Hiển thị các chức năng đã lưu dựa trên config
    loadFunctionBaseOnConfig() {
        this.isRepeat && repeatBtn.classList.toggle("active");
        this.isRandom && shuffleBtn.classList.toggle("active");
    },
    start() {
        // Load config cho ứng dụng
        this.loadConfig();
        this.loadFunctionBaseOnConfig();
        // Xử lý các events có trong chương trình
        this.handleEvents();

        // Cập nhập danh sách nhạc hiện có
        this.updateSongs();

        // Tải thông tin bài nhạc đang phát lên giao diện
        this.loadSong();
    },
};

app.start();

// Xử lý việc chuyển đổi thời gian video sang phút
function formatTime(time) {
    // format like 1:15
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);

    let times =
        seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;

    return times;
}
