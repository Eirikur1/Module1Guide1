// Custom 3D Circular Text Setup
function setupCircularText() {
    const circle = document.querySelector('.circle');
    if (circle) {
        const text = circle.textContent || circle.innerText;
        circle.innerHTML = '';
        circle.style.setProperty('--numchs', text.length);
        
        for (let i = 0; i < text.length; i++) {
            const charDiv = document.createElement('div');
            charDiv.className = 'char';
            charDiv.style.setProperty('--char-index', i);
            charDiv.textContent = text.charAt(i);
            circle.appendChild(charDiv);
        }
    }
}

// Rain System Functionality
var makeItRain = function() {
    //clear out everything
    $('.rain').empty();

    var increment = 0;
    var drops = "";
    var backDrops = "";

    while (increment < 100) {
        //couple random numbers to use for various randomizations
        //random number between 98 and 1
        var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
        //random number between 5 and 2
        var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
        //increment
        increment += randoFiver;
        //add in a new raindrop with various randomizations to certain CSS properties
        drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
        backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
    }

    $('.rain.front-row').append(drops);
    $('.rain.back-row').append(backDrops);
}

// Initialize rain with both effects enabled
makeItRain();

// Terrible Volume Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Setup the 3D circular text
    setupCircularText();
    
    const volumeValue = document.getElementById('volume-value');
    const sliderThumb = document.getElementById('slider-thumb');
    const randomizeBtn = document.getElementById('randomize-btn');
    const playMusicBtn = document.getElementById('play-music-btn');
    const backgroundMusic = document.getElementById('background-music');
    
    let currentVolume = 50;
    let isMusicStarted = false;
    
    // Randomize volume function
    function randomizeVolume() {
        const newVolume = Math.floor(Math.random() * 101); // 0-100
        currentVolume = newVolume;
        
        // Update display
        volumeValue.textContent = newVolume;
        
        // Move fake slider thumb (completely useless!)
        const thumbPosition = (newVolume / 100) * 100;
        sliderThumb.style.left = thumbPosition + '%';
        
        // Update audio volume
        backgroundMusic.volume = newVolume / 100;
        
        // Add some terrible visual feedback
        volumeValue.style.color = newVolume > 50 ? '#4a90e2' : '#4ecdc4';
        volumeValue.style.transform = 'scale(1.2)';
        setTimeout(() => {
            volumeValue.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Make the fake slider completely useless
    const fakeSlider = document.querySelector('.fake-slider');
    fakeSlider.addEventListener('click', function(e) {
        e.preventDefault();
        // Show error message
        volumeValue.textContent = 'Cant change it :P';
        volumeValue.style.color = '#ff0000';
        setTimeout(() => {
            volumeValue.textContent = currentVolume;
            volumeValue.style.color = currentVolume > 50 ? '#4a90e2' : '#4ecdc4';
        }, 1000);
    });
    
    // Randomize button
    randomizeBtn.addEventListener('click', randomizeVolume);
    
    // Music can only be started, never stopped
    playMusicBtn.addEventListener('click', function() {
        if (!isMusicStarted) {
            backgroundMusic.play().then(() => {
                // Music started successfully
                isMusicStarted = true;
                playMusicBtn.textContent = '🎵 Music Playing Forever 🎵';
                playMusicBtn.classList.add('playing');
                playMusicBtn.disabled = true; // Disable the button
                playMusicBtn.style.opacity = '0.6';
                playMusicBtn.style.cursor = 'not-allowed';
                
                // Start the beat animation on the circle header
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
    
    // Ensure music keeps playing if it gets paused
    backgroundMusic.addEventListener('pause', function() {
        // Only auto-resume if music was started by user
        if (isMusicStarted) {
            backgroundMusic.play().catch(error => {
                console.log('Auto-resume failed:', error);
            });
        }
    });
    
    // Ensure music restarts if it ends
    backgroundMusic.addEventListener('ended', function() {
        // Only auto-restart if music was started by user
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
    
    // Handle audio loading
    backgroundMusic.addEventListener('canplaythrough', function() {
        console.log('Audio loaded successfully');
        playMusicBtn.textContent = '🎵 Play Music 🎵';
        playMusicBtn.style.background = 'linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)';
    });
    
    // Initialize with random volume
    randomizeVolume();
    
    // Sometimes change volume randomly (because why not?)
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
            randomizeVolume();
        }
    }, 10000); // Every 10 seconds
});
