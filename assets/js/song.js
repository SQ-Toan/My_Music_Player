const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Elements
const menuBtn = $(".menu-btn");
const coverImage = $(".cover-image");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const playlist = $("#playlist");
const info = $(".info");
const currentSongTitle = $(".current-song-title");
const favourite = $("#favourite");

// App
const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    favourites: [],
    audio: new Audio(),
    songs: [
        {
            title: "Đừng làm trái tim anh đau",
            singer: "Sơn Tùng-MTP",
            image: "/assets/imgs/sontung.webp",
            src: "/assets/audio/dung_lam_trai_tim_anh_dau.mp3",
        },
        {
            title: "Đi tìm tình yêu",
            singer: "MONO",
            image: "/assets/imgs/mono.jpg",
            src: "/assets/audio/di_tim_tinh_yeu.mp3",
        },
        {
            title: "Bạn đời",
            singer: "KARIK ft. GDUCKY",
            image: "/assets/imgs/karik_gducky.jpg",
            src: "/assets/audio/ban_doi.mp3",
        },
        {
            title: "Cô gái m52",
            singer: "HUYR",
            image: "/assets/imgs/huyr.jpg",
            src: "/assets/audio/co_gai_m52.mp3",
        },
        {
            title: "Hit me up",
            singer: "Binz",
            image: "/assets/imgs/binz.jpg",
            src: "/assets/audio/hit_me_up.mp3",
        },
        {
            title: "Thằng điên",
            singer: "Justatee ft. Phương Ly",
            image: "/assets/imgs/crazyman.jpg",
            src: "/assets/audio/thang_dien.mp3",
        },
        {
            title: "This way",
            singer: "Cara",
            image: "/assets/imgs/cara.jpg",
            src: "/assets/audio/this_way.mp3",
        },
        {
            title: "Tuý âm",
            singer: "Xesi",
            image: "/assets/imgs/xesi.jpg",
            src: "/assets/audio/tuy_am.mp3",
        },
        {
            title: "Yêu một người có lẽ",
            singer: "Lou Hoàng ft. Miu Lê",
            image: "/assets/imgs/yeumotnguoicole.jpg",
            src: "/assets/audio/yeu_mot_nguoi_co_le.mp3",
        },
    ],
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
                    "linear-gradient(to top, rgba(255, 0, 0, 0), rgba(109, 213, 237, .7))";
            }
        });
    },

    // Update danh sách nhạc hiện có
    updateSongs() {
        // Loại bỏ các elements đang tồn tại
        playlist.innerHTMl = "";

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
                             <h4>2:03</h4>
                         </td>
 
                         <td>
                             <i class="fa-solid fa-heart ${
                                 isFavourite ? "active" : ""
                             }"></i>
                         </td>`;
            playlist.appendChild(tr);

            // Định dạng thời lượng audio theo form 1:15
            const audioForDuration = new Audio(src);
            audioForDuration.addEventListener("loadedmetadata", () => {
                const duration = audioForDuration.duration;
                let songDuration = this.formatTime(duration);
                tr.querySelector(".length h4").innerText = songDuration;
            });
        });
    },

    // Xử lý việc chuyển đổi thời gian video sang phút
    formatTime(time) {
        // format like 1:15
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        return `${minutes}:${seconds}`;
    },

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

        if (this.favourites.includes(this.currentIndex)) {
            favourite.classList.add("active");
        } else {
            favourite.classList.remove("active");
        }
    },
    start() {
        // Xử lý các events có trong chương trình
        this.handleEvents();

        // Cập nhập danh sách nhạc hiện có
        this.updateSongs();

        // Tải thông tin bài nhạc đang phát lên giao diện
        this.loadSong();
    },
};

app.start();
