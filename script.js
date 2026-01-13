document.addEventListener('DOMContentLoaded', () => {
    // --- Starfield Background ---
    const canvas = document.getElementById('starfield');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        const starCount = 150;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        }

        function initStars() {
            stars = [];
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.5,
                    opacity: Math.random(),
                    speed: Math.random() * 0.05 + 0.02
                });
            }
        }

        function drawStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            
            stars.forEach(star => {
                ctx.globalAlpha = star.opacity;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Gentel movement
                star.y -= star.speed;
                if (star.y < 0) star.y = canvas.height;
                
                // Twinkle
                star.opacity += (Math.random() - 0.5) * 0.05;
                if (star.opacity < 0.1) star.opacity = 0.1;
                if (star.opacity > 1) star.opacity = 1;
            });
            
            requestAnimationFrame(drawStars);
        }

        window.addEventListener('resize', resize);
        resize();
        drawStars();
    }

    // --- Lanyard API (Discord Status) ---
    const lanyardId = document.body.dataset.lanyardId;
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');

    if (lanyardId && statusDot && statusText) {
        async function updateStatus() {
            try {
                const response = await fetch(`https://api.lanyard.rest/v1/users/${lanyardId}`);
                const data = await response.json();
                
                if (data.success) {
                    const status = data.data.discord_status;
                    statusDot.className = 'status-dot ' + status;
                    
                    const statusMap = {
                        'online': 'Online',
                        'idle': 'Away',
                        'dnd': 'Busy',
                        'offline': 'Offline'
                    };
                    
                    // Check for active activity (Game/Code)
                    const activity = data.data.activities.find(a => a.type === 0);
                    if (activity) {
                        statusText.textContent = activity.name;
                    } else {
                        statusText.textContent = statusMap[status] || 'Offline';
                    }
                }
            } catch (err) {
                console.error('Lanyard Error:', err);
                statusText.textContent = 'Status Hidden';
            }
        }
        
        updateStatus();
        setInterval(updateStatus, 30000); // Update every 30s
    }

    const loader = document.getElementById('loading-bar');
    if (loader) {
        void loader.offsetWidth;
        loader.style.width = '100%';
        const target = document.body.dataset.redirect;
        if (target) {
            setTimeout(() => {
                window.location.href = target;
            }, 1000);
        }
    }

    const sparkContainer = document.getElementById('spark-lottie');
    if (sparkContainer && window.lottie) {
        lottie.loadAnimation({
            container: sparkContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'resources/icons8-sparkling.json'
        });
    }

    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    const navToggle = document.querySelector('.nav-toggle');
    const navDrawer = document.querySelector('.nav-drawer');
    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', () => {
            const open = navDrawer.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open);
        });

        navDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navDrawer.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});
