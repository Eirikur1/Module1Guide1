class RandomVolumePlayer {
    constructor() {
        this.currentVolume = 50;
        this.isMusicPlaying = false;
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupAudioListeners();
        this.initVolumeSlider();
        this.initRainEffects();
    }

    setupElements() {
        this.elements = {
            volumeValue: document.getElementById('volume-value'),
            sliderThumb: document.getElementById('slider-thumb'),
            randomizeBtn: document.getElementById('randomize-btn'),
            playMusicBtn: document.getElementById('play-music-btn'),
            backgroundMusic: document.getElementById('background-music')
        };
    }

    setupEventListeners() {
        this.elements.randomizeBtn.addEventListener('click', () => {
            this.handleRandomizeClick();
        });

        this.elements.playMusicBtn.addEventListener('click', () => {
            this.handlePlayMusicClick();
        });
    }

    setupAudioListeners() {
        this.elements.backgroundMusic.addEventListener('canplaythrough', () => {
            console.log('Audio ready to play');
        });

        this.elements.backgroundMusic.addEventListener('error', () => {
            console.error('Audio failed to load');
        });
        
        this.elements.backgroundMusic.addEventListener('ended', () => {
            if (window.thunderstormManager) {
                window.thunderstormManager.stopThunderstorm();
            }
        });
    }

    initVolumeSlider() {
        this.updateVolumeDisplay();
        this.updateSliderThumb();
    }

    updateVolumeDisplay() {
        if (this.elements.volumeValue) {
            this.elements.volumeValue.textContent = this.currentVolume;
        }
    }

    updateSliderThumb() {
        if (this.elements.sliderThumb) {
            const maxLeft = 326;
            const leftPosition = (this.currentVolume / 100) * maxLeft;
            this.elements.sliderThumb.style.left = leftPosition + 'px';
        }
    }

    handleRandomizeClick() {
        this.randomizeVolume();
    }

    randomizeVolume() {
        this.currentVolume = Math.floor(Math.random() * 101);
        this.elements.backgroundMusic.volume = this.currentVolume / 100;
        
        this.updateVolumeDisplay();
        this.updateSliderThumb();
        
        this.elements.randomizeBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.elements.randomizeBtn.style.transform = 'scale(1)';
        }, 150);
    }

    initRainEffects() {
        this.createRainDrops();
    }

    createRainDrops() {
        const frontRow = document.querySelector('.rain.front-row');
        const backRow = document.querySelector('.rain.back-row');
        
        if (!frontRow || !backRow) return;

        frontRow.innerHTML = '';
        backRow.innerHTML = '';

        for (let i = 0; i < 100; i++) {
            const drop = this.createRainDrop();
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            frontRow.appendChild(drop);
        }

        for (let i = 0; i < 50; i++) {
            const drop = this.createRainDrop();
            drop.style.right = Math.random() * 100 + '%';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            backRow.appendChild(drop);
        }
    }

    createRainDrop() {
        const drop = document.createElement('div');
        drop.className = 'drop';
        
        const stem = document.createElement('div');
        stem.className = 'stem';
        
        const splat = document.createElement('div');
        splat.className = 'splat';
        
        drop.appendChild(stem);
        drop.appendChild(splat);
        
        return drop;
    }

    handlePlayMusicClick() {
        if (!this.isMusicPlaying) {
            this.startMusic();
        }
    }

    startMusic() {
        this.elements.backgroundMusic.volume = this.currentVolume / 100;
        this.elements.backgroundMusic.play().then(() => {
            this.isMusicPlaying = true;
            this.elements.playMusicBtn.textContent = '🎵 Music Playing 🎵';
            this.elements.playMusicBtn.disabled = true;
            this.elements.playMusicBtn.style.opacity = '0.7';
            this.elements.playMusicBtn.style.cursor = 'not-allowed';
            
            console.log('Music started, attempting to start thunderstorm...');
            if (window.thunderstormManager) {
                console.log('Thunderstorm manager found, starting...');
                window.thunderstormManager.startThunderstorm();
            } else {
                console.error('Thunderstorm manager not found!');
            }
        }).catch(error => {
            console.error('Failed to play music:', error);
        });
    }
}

$(function() {
    console.log('Thunderstorm system initializing...');
    
    if (typeof $ === 'undefined') {
        console.error('jQuery not loaded! Thunderstorm will not work.');
        return;
    }
    
    if (!$('#can').length) {
        console.error('Canvas element #can not found! Thunderstorm will not work.');
        return;
    }
    
    console.log('jQuery loaded successfully, canvas found, starting thunderstorm system...');
    
    class Vector {
        constructor(value) {
            this.value = value;
            this.prev = null;
            this.next = null;
        }
    }

    class List {
        constructor() {
            this.first = null;
            this.current = null;
            this.last = null;
            this.length = 0;
        }

        unbind(vector) {
            if (vector.prev && vector.next) {
                vector.prev.next = vector.next;
                vector.next.prev = vector.prev;
            } else if (vector.prev) {
                vector.prev.next = null;
                this.last = vector.prev;
            } else if (vector.next) {
                vector.next.prev = null;
                this.first = vector.next;
            }

            if (this.first && this.current === vector) {
                this.current = this.first;
            }

            this.length--;
        }

        remove(value, range) {
            if (range && (range > 1 || range < -1)) {
                const rcb = this.getRangeCb(range);
                let current = value;

                do {
                    this.unbind(current);
                } while (current = rcb(current))
            } else {
                this.unbind(value);
            }
        }

        getRangeCb(range) {
            const stepMax = Math.abs(range);
            let step = 1;
            const key = range > 1 ? 'next' : 'prev';

            return (current) => {
                if (step < stepMax && current[key]) {
                    step++;
                    return current[key];
                }
                return false;
            }
        }

        each(cb) {
            if (this.first) {
                let current = this.first;

                do {
                    this.current = current;
                    if (cb(current) === false) {
                        break;
                    }
                } while (current = current.next)
            }
            return this;
        }

        add(value) {
            const vector = new Vector(value);

            if (!this.first) {
                this.first = this.last = this.current = vector;
            } else {
                vector.prev = this.last;
                this.last = this.last.next = vector;
            }

            this.length++;
            return this;
        }
    }

    class Branch {
        constructor(manager, chance, x, y) {
            this.manager = manager;
            this.chance = chance;
            this.path = [{
                x: x,
                y: y,
                endX: (0.5 - Math.random()) * (manager.h / 10) + x,
                endY: (0.7 - Math.random()) * (manager.w / 20) + y
            }];

            this.size = parseInt(chance) + parseInt(Math.random() * 10);
            this.subBranches = [];
        }

        process() {
            let ready = true;

            if (this.path.length < this.size) {
                for (let i = 0; i < 3; i++) {
                    this.path.push({
                        x: this.path[this.path.length - 1].endX,
                        y: this.path[this.path.length - 1].endY,
                        endX: (0.5 - Math.random()) * (this.manager.h / 10) + this.path[this.path.length - 1].endX,
                        endY: Math.random() * (this.manager.w / 30) + this.path[this.path.length - 1].endY
                    });

                    if (Math.random() < this.chance / 10) {
                        this.subBranches.push(new Branch(this.manager, this.chance / 2, this.path[this.path.length - 1].x, this.path[this.path.length - 1].y));
                    }
                }
                ready = false;
            }

            for (let i = 0; i < this.path.length; i++) {
                this.manager.can.beginPath();
                this.manager.can.lineWidth = this.chance * 0.2;
                this.manager.can.moveTo(this.path[i].x, this.path[i].y);
                this.manager.can.lineTo(this.path[i].endX, this.path[i].endY);
                this.manager.can.stroke();
                this.manager.can.closePath();
            }

            for (let i = 0; i < this.subBranches.length; i++) {
                this.subBranches[i].process();
            }

            return ready;
        }
    }

    class Bolt {
        constructor(manager) {
            this.manager = manager;
            this.opacity = 1;
            this.opacityDown = 0.1 - (Math.random() / 15);
            this.mainBranch = new Branch(manager, 5, Math.random() * manager.w, -50);
        }

        process() {
            this.manager.can.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
            this.manager.can.fillStyle = this.manager.can.strokeStyle;

            if (this.mainBranch.process()) {
                this.opacity -= this.opacityDown;
            }

            return this.opacity > 0;
        }
    }

    class BoltManager {
        constructor() {
            this.bgColor = 'rgba(15, 15, 35, 0.1)';
            this.isActive = false;
            this.rainList = new List();
            this.bolts = new List();

            this.$can = $('#can');
            this.can = this.$can.get(0).getContext('2d');
            this.w = window.innerWidth;
            this.h = window.innerHeight;
        }

        startThunderstorm() {
            console.log('Starting thunderstorm...');
            this.isActive = true;
            this.clear();
            this.run();
        }

        stopThunderstorm() {
            console.log('Stopping thunderstorm...');
            this.isActive = false;
            this.clear();
        }

        run() {
            this.init();
        }

        startAnimation() {
            if (!this.isActive) return;
            
            this.clear();

            if (Math.random() < 0.05) {
                this.bolts.add(new Bolt(this));
                const ranColor = parseInt(Math.random() * 10);
                this.bgColor = `rgba(${ranColor}, ${ranColor}, ${ranColor + 30}, 0.1)`;
            }

            this.bolts.each((bolt) => {
                if (!bolt.process()) {
                    this.bolts.remove(bolt);
                }
            });

            this.rain();

            setTimeout(() => this.startAnimation(), 1000 / 30);
        }

        rain() {
            if (!this.isActive) return;
            
            for (let i = 0; i < 5; i++) {
                const speed = Math.random() * 10;
                const color = `rgba(${parseInt(150 - speed * 8)}, ${parseInt(150 - speed * 8)}, ${parseInt(150 - speed * 8)}, 0.3)`;

                this.rainList.add({
                    x: Math.random() * this.w,
                    y: -50,
                    speed: speed,
                    color: color,
                    size: parseInt(Math.random() * 20 + 3)
                });
            }

            this.can.lineWidth = 1;

            this.rainList.each((rain) => {
                rain.y += 15 + rain.speed;

                if (rain.y > this.h + 10) {
                    this.rainList.remove(rain);
                } else {
                    this.can.strokeStyle = rain.color;
                    this.can.beginPath();
                    this.can.moveTo(rain.x, rain.y);
                    this.can.lineTo(rain.x, rain.y + rain.size);
                    this.can.stroke();
                }
            });
        }

        init() {
            this.$can.prop({
                width: this.w,
                height: this.h
            }).css({
                width: this.w,
                height: this.h
            });

            this.clear();
        }

        clear() {
            this.can.fillStyle = this.bgColor;
            this.can.fillRect(0, 0, this.w, this.h);
        }
    }

    const thunderstormManager = new BoltManager();
    thunderstormManager.run();
    
    console.log('Thunderstorm manager created and ready:', thunderstormManager);
    console.log('Canvas dimensions:', thunderstormManager.w, 'x', thunderstormManager.h);

    window.thunderstormManager = thunderstormManager;

    $(window).on('resize', function() {
        thunderstormManager.w = window.innerWidth;
        thunderstormManager.h = window.innerHeight;
        thunderstormManager.$can.prop({
            width: thunderstormManager.w,
            height: thunderstormManager.h
        }).css({
            width: thunderstormManager.w,
            height: thunderstormManager.h
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    new RandomVolumePlayer();
});

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
