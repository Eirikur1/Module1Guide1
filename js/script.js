// ========================================
// TERRIBLE VOLUME SLIDER WEBSITE
// ========================================
// This website demonstrates intentionally bad UX design
// featuring a volume control that only works randomly
// and music that never stops once started.

// Initialize the 3D circular text effect
// This creates the rotating "Random Volume Slider" text
function setupCircularText() {
    const circle = document.querySelector('.circle');
    if (circle) {
        // Get the text content and clear the element
        const text = circle.textContent || circle.innerText;
        circle.innerHTML = '';
        
        // Set CSS variable for number of characters
        circle.style.setProperty('--numchs', text.length);
        
        // Create individual character elements positioned in 3D space
        for (let i = 0; i < text.length; i++) {
            const charDiv = document.createElement('div');
            charDiv.className = 'char';
            charDiv.style.setProperty('--char-index', i);
            charDiv.textContent = text.charAt(i);
            circle.appendChild(charDiv);
        }
    }
}

// ========================================
// RAIN SYSTEM FUNCTIONALITY
// ========================================
// Creates dynamic rain effects in the background
// with front and back layers for depth

var makeItRain = function() {
    // Clear existing rain elements
    $('.rain').empty();

    var increment = 0;
    var drops = "";
    var backDrops = "";

    // Generate 100 raindrops with randomized properties
    while (increment < 100) {
        // Random number between 98 and 1 for animation timing
        var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
        // Random number between 5 and 2 for positioning
        var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
        increment += randoFiver;
        
        // Create front layer raindrop with stem and splash effects
        drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
        
        // Create back layer raindrop (mirrored for depth)
        backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
    }

    // Add raindrops to the DOM
    $('.rain.front-row').append(drops);
    $('.rain.back-row').append(backDrops);
}

// Initialize rain system when page loads
makeItRain();

// ========================================
// TERRIBLE VOLUME SLIDER FUNCTIONALITY
// ========================================
// This is intentionally bad UX design - the volume
// can only be changed randomly, not manually

document.addEventListener('DOMContentLoaded', function() {
    // Setup the 3D circular text effect
    setupCircularText();
    
    // Get DOM elements for volume control
    const volumeValue = document.getElementById('volume-value');
    const sliderThumb = document.getElementById('slider-thumb');
    const randomizeBtn = document.getElementById('randomize-btn');
    const playMusicBtn = document.getElementById('play-music-btn');
    const backgroundMusic = document.getElementById('background-music');
    
    // Initialize volume state
    let currentVolume = 50;
    let isMusicStarted = false;
    
    // ========================================
    // RANDOMIZE VOLUME FUNCTION
    // ========================================
    // This is the ONLY way to change volume - completely random!
    // Demonstrates terrible UX design principles
    
    function randomizeVolume() {
        // Generate random volume between 0-100
        const newVolume = Math.floor(Math.random() * 101);
        currentVolume = newVolume;
        
        // Update the volume display
        volumeValue.textContent = newVolume;
        
        // Move the fake slider thumb (completely useless!)
        const thumbPosition = (newVolume / 100) * 100;
        sliderThumb.style.left = thumbPosition + '%';
        
        // Update the actual audio volume
        backgroundMusic.volume = newVolume / 100;
        
        // Add terrible visual feedback (scaling effect)
        volumeValue.style.color = newVolume > 50 ? '#4a90e2' : '#4ecdc4';
        volumeValue.style.transform = 'scale(1.2)';
        setTimeout(() => {
            volumeValue.style.transform = 'scale(1)';
        }, 200);
    }
    
    // ========================================
    // FAKE SLIDER INTERACTION
    // ========================================
    // The slider looks real but does nothing
    // This is intentionally frustrating UX design
    
    const fakeSlider = document.querySelector('.fake-slider');
    fakeSlider.addEventListener('click', function(e) {
        e.preventDefault();
        // Show error message when user tries to use the slider
        volumeValue.textContent = 'Cant change it :P';
        volumeValue.style.color = '#ff0000';
        setTimeout(() => {
            volumeValue.textContent = currentVolume;
            volumeValue.style.color = currentVolume > 50 ? '#4a90e2' : '#4ecdc4';
        }, 1000);
    });
    
    // Connect randomize button to the randomize function
    randomizeBtn.addEventListener('click', randomizeVolume);
    
    // ========================================
    // MUSIC CONTROL SYSTEM
    // ========================================
    // Music can only be started, never stopped
    // Another example of terrible UX design
    
    playMusicBtn.addEventListener('click', function() {
        if (!isMusicStarted) {
            // Try to start the music
            backgroundMusic.play().then(() => {
                // Music started successfully
                isMusicStarted = true;
                playMusicBtn.textContent = '🎵 Music Playing Forever 🎵';
                playMusicBtn.classList.add('playing');
                playMusicBtn.disabled = true; // Disable the button
                playMusicBtn.style.opacity = '0.6';
                playMusicBtn.style.cursor = 'not-allowed';
                
                // Start the beat animation on the 3D circular text
                const circle = document.querySelector('.circle');
                if (circle) {
                    circle.classList.add('music-playing');
                }
            }).catch(error => {
                console.log('Music start failed:', error);
            });
        }
        // If music is already playing, clicking does nothing
    });
    
    // ========================================
    // MUSIC PERSISTENCE SYSTEM
    // ========================================
    // Ensure music keeps playing no matter what
    // This is intentionally annoying UX design
    
    // Auto-resume if music gets paused
    backgroundMusic.addEventListener('pause', function() {
        if (isMusicStarted) {
            backgroundMusic.play().catch(error => {
                console.log('Auto-resume failed:', error);
            });
        }
    });
    
    // Auto-restart if music ends
    backgroundMusic.addEventListener('ended', function() {
        if (isMusicStarted) {
            backgroundMusic.play().catch(error => {
                console.log('Auto-restart failed:', error);
            });
        }
    });
    
    // Handle audio loading errors
    backgroundMusic.addEventListener('error', function(e) {
        console.log('Audio error:', e);
        playMusicBtn.textContent = '🔇 Audio Error - Click to Retry';
        playMusicBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
        isMusicStarted = false;
    });
    
    // Handle successful audio loading
    backgroundMusic.addEventListener('canplaythrough', function() {
        console.log('Audio loaded successfully');
        playMusicBtn.textContent = '🎵 Play Music 🎵';
        playMusicBtn.style.background = 'linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)';
    });
    
    // Initialize with random volume
    randomizeVolume();
    
    // ========================================
    // AUTOMATIC VOLUME CHANGES
    // ========================================
    // Sometimes change volume randomly (because why not?)
    // This adds to the terrible user experience
    
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
            randomizeVolume();
        }
    }, 10000); // Every 10 seconds
});
