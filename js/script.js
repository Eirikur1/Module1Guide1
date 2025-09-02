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
        }).catch(error => {
            console.error('Failed to play music:', error);
        });
    }
}

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
