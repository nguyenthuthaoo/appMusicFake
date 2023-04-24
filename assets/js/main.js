/**
1. render song
2. scroll top
3. play/ pause/ seek
4. CD rotate
5. Next/prev
6. random
7. Next/repeat when ended
8. Active song
9. Scroll active song into view
10. Play song when click
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'FAKE_PLAYER'

const player = $('.player')
const cd = $('.cd')
const cdWidth = cd.offsetWidth
const header = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const progress = $('#progress')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const playlist = $('.playlist')
const durationSong = $('.duration-song')
const timimgSong = $('.timming-song')
let progressVolume = $('.line-volume')
const volumeIcon = $('.volume__icon')
const volumeUp = $('.fa-volume-up')
const volumeMute = $('.fa-volume-mute')
const volumeChange = $('.volume-change__icon')


const app = {
    currentIndex: 0,
    currentVolume: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [{
            name: 'Có hẹn với thanh xuân',
            singer: 'GREY D, Monstar',
            path: './assets/music/CoHenVoiThanhXuan.mp3',
            image: './assets/img/img01.png',
        },
        {
            name: 'Đừng chờ anh nữa',
            singer: 'Tăng Phúc',
            path: './assets/music/Dung-Cho-Anh-Nua-Tang-Phuc.mp3',
            image: './assets/img/img02.png',
        },
        {
            name: 'Mơ',
            singer: 'Vũ Cát Tường',
            path: './assets/music/Mo-OrangeDucPhuc.mp3',
            image: './assets/img/img03.png',
        },
        {
            name: 'Một mình có buồn không',
            singer: 'Thiều Bảo Trâm',
            path: './assets/music/MotMinhCoBuonKhong.mp3',
            image: './assets/img/img04.png',
        },
        {
            name: 'Một mình vẫn vui',
            singer: 'Lê Ngọc Châu Anh',
            path: './assets/music/MotMinhVanVui.mp3',
            image: './assets/img/img05.png',
        },
        {
            name: 'Trà sữa',
            singer: 'Anh Tú - Lyly',
            path: './assets/music/TraSua-AnhTuLyly.mp3',
            image: './assets/img/img06.png',
        },
    ],
    // render list song 
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
<div class="thumb" style="background-image: url('${song.image}')">
</div>
<div class="body">
<h3 class="title">${song.name}</h3>
<p class="author">${song.singer}</p>
</div>
<div class="option">
<i class="fas fa-ellipsis-h"></i>
</div>
</div>`
        });
        $('.playlist').innerHTML = htmls.join('\n');
        this.activeSong();
    },
    //định nghĩa property
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const _this = this;
        // xử lý CD quay/ dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: "rotate(360deg)" }
        ], {
            duration: 10000,
            iterations: Infinity //quay vô hạn
        })
        cdThumbAnimate.pause();

        //xử lý phóng to thu nhỏ thumb
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        };
        //xử lý khi play/pause
        playBtn.onclick = function() {
                if (_this.isPlaying) {
                    audio.pause()

                } else {
                    audio.play()

                }
            }
            // xử lý khi song được play 
        audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            // xử lý khi song được pause
        audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }
            // xử lý khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const currentTime = audio.currentTime
                const duration = audio.duration
                const percent = Math.floor((currentTime / duration) * 100)
                progress.value = percent;
            }
            timimgSong.innerText = _this.timeFormatter(this.currentTime)
        }
        audio.onloadedmetadata = function() {
                durationSong.innerText = _this.timeFormatter(this.currentTime);
                durationSong.innerText = _this.timeFormatter(this.duration);
            }
            // xử lý khi song được seek
        progress.oninput = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }
            // xử lý tăng giảm volume 
        progressVolume.onchange = function(e) {
            var progressPersonVolume = e.target.value;
            audio.volume = progressPersonVolume;
            _this.setConfig('volume', progressPersonVolume);

        }
        audio.onvolumechange = function() {
                if (this.volume === 0) {
                    volumeUp.style.display = 'none'
                    volumeMute.style.display = 'block'
                } else {
                    volumeUp.style.display = 'block'
                    volumeMute.style.display = 'none'
                }
            }
            // Event click to mute
            // volumeChange.onclick = function(e) {
            //     audio.muted = !audio.muted;
            //     if (audio.muted) {
            //         progressVolume.style.width = 0;
            //     } else {
            //         progressVolume.style.width = audio.volume * volumeBar.offsetWidth + "px";
            //     }
            // }

        // xử lý khi song được next
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.activeSong()
            _this.scrollIntoView()
        }

        // xử lý khi song được prev
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.activeSong()
            _this.scrollIntoView()
        }

        // xử lý bật tắt khi song được random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)

        }

        //xử lý khi song được repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // xử lý khi song end 
        audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play()
                } else {
                    nextBtn.click()
                    audio.play()
                }
            }
            // xử lý khi click song trong playlist
        playlist.onclick = function(e) {

            const songNode = e.target.closest('.song:not(.active')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.activeSong()
                } else if (e.target.closest('.option')) {
                    console.log(e.target.closest('.option'))
                }
            }
        }
    },

    activeSong: function() {
        const songItems = $$('.song')
        songItems.forEach((song, index) => {
            if (index === this.currentIndex) {
                song.classList.add('active')
            } else {
                song.classList.remove('active')
            }
        })
    },

    scrollIntoView: function() {
        const song = $('.song.active')
        setTimeout(() => {
            song.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
        }, 300)
    },

    loadConfig: function() {
        if (this.config.isRandom === true) {
            this.isRandom = this.config.isRandom;

        } else {
            this.isRandom = false;
        }
        if (this.config.isRepeat === true) {
            this.isRepeat = this.config.isRepeat;
        } else {
            this.isRepeat = false;
        }
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
        progressVolume.value = this.config.volume;
    },

    loadCurrentSong: function() {
        header.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = 'url(' + this.currentSong.image + ')'
        audio.src = this.currentSong.path
    },

    prevSong: function() {
        this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
        this.loadCurrentSong()
    },

    nextSong: function() {
        this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    timeFormatter: function(time) {
        const timeFloor = Math.floor(time)
        const minutes = Math.floor(timeFloor / 60)
        const seconds = Math.floor(timeFloor % 60)
        return `${minutes>=10 ? minutes + '' : '0' + minutes } : ${seconds>=10 ? seconds + '' : '0' + seconds }`;
    },

    start: function() {
        //gán cấu hình từ config vào ứng dụng
        this.loadConfig()
            //Định nghĩa thuộc tính 
        this.defineProperties()
            //Load bài hát đầu tiên
        this.loadCurrentSong()
            // lắng nghe xử lý các sự kiện (Dom Event)
        this.handleEvent();

        // render playlist
        this.render();
    }

}
app.start();