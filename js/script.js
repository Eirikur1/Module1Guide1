// Random Volume Player
class RandomVolumePlayer {
    constructor() {
        this.currentVolume = 50;
        this.isMusicPlaying = false;
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupAudioListeners();
        this.initVolumeSlider();
        this.initRainEffects();
    }

    // Cache DOM elements
    cacheElements() {
        this.elements = {
            volumeValue: document.getElementById('volume-value'),
            sliderThumb: document.getElementById('slider-thumb'),
            randomizeBtn: document.getElementById('randomize-btn'),
            playMusicBtn: document.getElementById('play-music-btn'),
            backgroundMusic: document.getElementById('background-music')
        };
    }

    // Setup event listeners
    setupEventListeners() {
        this.elements.randomizeBtn.addEventListener('click', () => {
            this.handleRandomizeClick();
        });

        this.elements.playMusicBtn.addEventListener('click', () => {
            this.handlePlayMusicClick();
        });
    }

    // Setup audio event listeners
    setupAudioListeners() {
        this.elements.backgroundMusic.addEventListener('canplaythrough', () => {
            console.log('Audio ready to play');
        });

        this.elements.backgroundMusic.addEventListener('error', () => {
            console.error('Audio failed to load');
        });
        
        // Stop thunderstorm when music ends
        this.elements.backgroundMusic.addEventListener('ended', () => {
            if (window.thunderstormManager) {
                window.thunderstormManager.stopThunderstorm();
            }
        });
    }

    // Initialize volume slider
    initVolumeSlider() {
        this.updateVolumeDisplay();
        this.updateSliderThumb();
    }

    // Update volume display
    updateVolumeDisplay() {
        if (this.elements.volumeValue) {
            this.elements.volumeValue.textContent = this.currentVolume;
        }
    }

    // Update slider thumb position
    updateSliderThumb() {
        if (this.elements.sliderThumb) {
            const maxLeft = 326; // Maximum left position for slider thumb
            const leftPosition = (this.currentVolume / 100) * maxLeft;
            this.elements.sliderThumb.style.left = leftPosition + 'px';
        }
    }

    // Handle randomize button click
    handleRandomizeClick() {
        this.randomizeVolume();
    }

    // Randomize volume
    randomizeVolume() {
        this.currentVolume = Math.floor(Math.random() * 101); // 0-100
        this.elements.backgroundMusic.volume = this.currentVolume / 100;
        
        this.updateVolumeDisplay();
        this.updateSliderThumb();
        
        // Add visual feedback
        this.elements.randomizeBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.elements.randomizeBtn.style.transform = 'scale(1)';
        }, 150);
    }

    // Initialize rain effects
    initRainEffects() {
        this.createRainDrops();
    }

    // Create rain drops
    createRainDrops() {
        const frontRow = document.querySelector('.rain.front-row');
        const backRow = document.querySelector('.rain.back-row');
        
        if (!frontRow || !backRow) return;

        // Clear existing drops
        frontRow.innerHTML = '';
        backRow.innerHTML = '';

        // Create front row drops
        for (let i = 0; i < 100; i++) {
            const drop = this.createRainDrop();
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            frontRow.appendChild(drop);
        }

        // Create back row drops
        for (let i = 0; i < 50; i++) {
            const drop = this.createRainDrop();
            drop.style.right = Math.random() * 100 + '%';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            backRow.appendChild(drop);
        }
    }

    // Create individual rain drop
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

    // Handle play music button click
    handlePlayMusicClick() {
        if (!this.isMusicPlaying) {
            this.startMusic();
        }
    }

    // Start music
    startMusic() {
        this.elements.backgroundMusic.volume = this.currentVolume / 100;
        this.elements.backgroundMusic.play().then(() => {
            this.isMusicPlaying = true;
            this.elements.playMusicBtn.textContent = '🎵 Music Playing 🎵';
            this.elements.playMusicBtn.disabled = true;
            this.elements.playMusicBtn.style.opacity = '0.7';
            this.elements.playMusicBtn.style.cursor = 'not-allowed';
            
            // Start the thunderstorm when music begins
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

// Thunderstorm Background Animation System
$(function() {
    console.log('Thunderstorm system initializing...');
    
    // Check if jQuery is loaded
    if (typeof $ === 'undefined') {
        console.error('jQuery not loaded! Thunderstorm will not work.');
        return;
    }
    
    // Check if canvas element exists
    if (!$('#can').length) {
        console.error('Canvas element #can not found! Thunderstorm will not work.');
        return;
    }
    
    console.log('jQuery loaded successfully, canvas found, starting thunderstorm system...');
    
    // Vector class for linked list
    var Vector = function(value) {
        this.value = value;
        this.prev = null;
        this.next = null;
    }

    // List class for managing objects
    var List = function() {
        var me = this;
        var first = null;
        var current = null;
        var last = null;
        this.length = 0;

        var unbind = function(vector) {
            if (vector.prev && vector.next) {
                vector.prev.next = vector.next;
                vector.next.prev = vector.prev;
            } else if (vector.prev) {
                vector.prev.next = null;
                last = vector.prev;
            } else if (vector.next) {
                vector.next.prev = null;
                first = vector.next;
            }

            if (first && current === vector) {
                current = first;
            }

            me.length--;
        }

        var remove = function(vector, range) {
            if (range && (range > 1 || range < -1)) {
                var rcb = getRangeCb(range);
                var current = vector;

                do {
                    unbind(current);
                } while (current = rcb(current))
            } else {
                unbind(vector);
            }
        }

        var getRangeCb = function(range) {
            var stepMax = Math.abs(range);
            var step = 1;
            var key = 'prev';

            if (range > 1) {
                key = 'next';
            }

            return function(current) {
                if (step < stepMax && current[key]) {
                    step++;
                    return current[key];
                }
                return false;
            }
        }

        var each = function(cb) {
            if (first) {
                var debugCurrent = first;

                do {
                    current = debugCurrent;
                    if (cb(debugCurrent) === false) {
                        break;
                    }
                } while (debugCurrent = debugCurrent.next)
            }
            return this;
        }

        this.each = function(cb) {
            each(function(vector) {
                cb.call(vector, vector.value);
            });
            return this;
        }

        this.add = function(value) {
            var vector = new Vector(value);

            if (!first) {
                first = last = current = vector;
            } else {
                vector.prev = last;
                last = last.next = vector;
            }

            this.length++;
            return this;
        }

        this.remove = function(value, range) {
            if (current === value) {
                remove(current, range);
            } else {
                each(function(vector) {
                    if (vector.value === value) {
                        remove(vector, range);
                        return false;
                    }
                });
            }
            return this;
        }
    }

    // Branch class for lightning
    var Branch = function(manager, chance, x, y) {
        var me = this;
        var path = [{
            x: x,
            y: y,
            endX: (0.5 - Math.random()) * (manager.h / 10) + x,
            endY: (0.7 - Math.random()) * (manager.w / 20) + y
        }];

        var size = parseInt(chance) + parseInt(Math.random() * 10);
        var subBranches = [];

        this.process = function() {
            var rdy = true;

            if (path.length < size) {
                for (var i = 0; i < 3; i++) {
                    path.push({
                        x: path[path.length - 1].endX,
                        y: path[path.length - 1].endY,
                        endX: (0.5 - Math.random()) * (manager.h / 10) + path[path.length - 1].endX,
                        endY: Math.random() * (manager.w / 30) + path[path.length - 1].endY
                    });

                    if (Math.random() < chance / 10) {
                        subBranches.push(new Branch(manager, chance / 2, path[path.length - 1].x, path[path.length - 1].y));
                    }
                }
                rdy = false;
            }

            for (var i = 0; i < path.length; i++) {
                manager.can.beginPath();
                manager.can.lineWidth = chance * 0.2;
                manager.can.moveTo(path[i].x, path[i].y);
                manager.can.lineTo(path[i].endX, path[i].endY);
                manager.can.stroke();
                manager.can.closePath();
            }

            for (var i = 0; i < subBranches.length; i++) {
                subBranches[i].process();
            }

            return rdy;
        }
    }

    // Bolt class for lightning bolts
    var Bolt = function(manager) {
        var me = this;
        var opa = 1;
        var opaDown = 0.1 - (Math.random() / 15);
        var mainBranch = new Branch(manager, 5, Math.random() * manager.w, -50);

        this.process = function() {
            manager.can.strokeStyle = 'rgba(255, 255, 255, ' + opa + ')';
            manager.can.fillStyle = manager.can.strokeStyle;

            if (mainBranch.process()) {
                opa -= opaDown;
            }

            return opa > 0;
        }
    }

    // BoltManager class for managing the animation
    var BoltManager = function() {
        var bgColor = 'rgba(15, 15, 35, 0.1)'; // Very transparent to not interfere with content
        var me = this;
        var rainList = new List();
        var isActive = false; // Control flag for thunderstorm

        this.$can = $('#can');
        this.can = this.$can.get(0).getContext('2d');

        this.w = window.innerWidth;
        this.h = window.innerHeight;

        var bolts = new List();

        // Method to start the thunderstorm
        this.startThunderstorm = function() {
            console.log('Starting thunderstorm...');
            isActive = true;
            // Clear the canvas and start the animation
            clear();
            run();
        }

        // Method to stop the thunderstorm
        this.stopThunderstorm = function() {
            console.log('Stopping thunderstorm...');
            isActive = false;
            // Clear the canvas
            clear();
        }

        this.run = function() {
            init();
            // Don't start running immediately - wait for startThunderstorm to be called
        }

        var run = function() {
            if (!isActive) return; // Only run if thunderstorm is active
            
            clear();

            if (Math.random() < 0.05) {
                bolts.add(new Bolt(me));
                var ranColor = parseInt(Math.random() * 10);
                bgColor = 'rgba(' + ranColor + ',' + ranColor + ',' + (ranColor + 30) + ', 0.1)';
            }

            bolts.each(function(bolt) {
                if (!bolt.process()) {
                    bolts.remove(this);
                }
            });

            rain();

            setTimeout(run, 1000 / 30);
        }

        var rain = function() {
            if (!isActive) return; // Only rain if thunderstorm is active
            
            for (var i = 0; i < 5; i++) {
                var speed = Math.random() * 10;
                var color = 'rgba(' + parseInt(150 - speed * 8) + ',' + parseInt(150 - speed * 8) + ',' + parseInt(150 - speed * 8) + ', 0.3)';

                rainList.add({
                    x: Math.random() * me.w,
                    y: -50,
                    speed: speed,
                    color: color,
                    size: parseInt(Math.random() * 20 + 3)
                });
            }

            me.can.lineWidth = 1;

            rainList.each(function(rain) {
                rain.y += 15 + rain.speed;

                if (rain.y > me.h + 10) {
                    rainList.remove(this);
                } else {
                    me.can.strokeStyle = rain.color;
                    me.can.beginPath();
                    me.can.moveTo(rain.x, rain.y);
                    me.can.lineTo(rain.x, rain.y + rain.size);
                    me.can.stroke();
                }
            });
        }

        var init = function() {
            me.$can.prop({
                width: me.w,
                height: me.h
            }).css({
                width: me.w,
                height: me.h
            });

            clear();
        }

        var clear = function() {
            me.can.fillStyle = bgColor;
            me.can.fillRect(0, 0, me.w, me.h);
        }
    }

    // Initialize the thunderstorm manager (but don't start it yet)
    var thunderstormManager = new BoltManager();
    thunderstormManager.run();

    // Make the thunderstorm manager globally accessible so the music player can control it
    window.thunderstormManager = thunderstormManager;
    
    console.log('Thunderstorm manager created and ready:', thunderstormManager);
    console.log('Canvas dimensions:', thunderstormManager.w, 'x', thunderstormManager.h);

    // Handle window resize
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RandomVolumePlayer();
});

// Smooth scrolling for navigation links
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
