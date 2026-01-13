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

    // --- Lanyard API (Discord Status via WebSocket) ---
    const lanyardId = document.body.dataset.lanyardId;

    if (lanyardId) {
        const statusDotSmall = document.querySelector('.status-dot');
        const statusTextSmall = document.querySelector('.status-text');
        const statusDotCard = document.getElementById('avatar-status-dot');
        const avatarImg = document.getElementById('discord-avatar');
        const customStatusEl = document.getElementById('discord-custom-status');
        const activityContainer = document.getElementById('discord-activity');

        let socket = new WebSocket('wss://api.lanyard.rest/socket');

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.op === 1) {
                setInterval(() => socket.send(JSON.stringify({ op: 3 })), data.d.heartbeat_interval);
                socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: lanyardId } }));
            }

            if (data.op === 0) {
                const presence = data.d;
                const status = presence.discord_status;
                const user = presence.discord_user;
                
                // 1. Update Status Dots
                const statusClass = `avatar-status-dot ${status}`;
                if (statusDotCard) statusDotCard.className = statusClass;
                if (statusDotSmall) statusDotSmall.className = `status-dot ${status}`;

                // 2. Update Avatar (Discord PFP)
                if (avatarImg && user.avatar) {
                    const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=128`;
                    avatarImg.src = avatarUrl;
                }

                // 3. Update Custom Status
                const customStatus = presence.activities.find(a => a.type === 4);
                if (customStatusEl) customStatusEl.textContent = customStatus ? customStatus.state : "";

                // 4. Update Game/App Activity
                const game = presence.activities.find(a => a.type === 0);
                if (activityContainer) {
                    if (game) {
                        let iconUrl = 'resources/Viperisuseful-LOGO.png';
                        if (game.assets && game.assets.large_image) {
                            if (game.assets.large_image.startsWith('mp:external')) {
                                iconUrl = game.assets.large_image.replace(/mp:external\/([^\/]+)\/https\/(.*)/, 'https://$2');
                            } else {
                                iconUrl = `https://cdn.discordapp.com/app-assets/${game.application_id}/${game.assets.large_image}.png`;
                            }
                        }
                        
                        activityContainer.innerHTML = `
                            <div class="activity-item">
                                <img class="activity-icon" src="${iconUrl}" alt="Game Icon">
                                <div class="activity-details">
                                    <span class="activity-name">${game.name}</span>
                                    <span class="activity-state">${game.details || ""}</span>
                                    <span class="activity-state">${game.state || ""}</span>
                                </div>
                            </div>
                        `;
                    } else {
                        activityContainer.innerHTML = `<span class="activity-state">No current activity</span>`;
                    }
                }

                // 5. Update small text (if it exists)
                if (statusTextSmall) {
                    const statusMap = { 'online': 'Online', 'idle': 'Away', 'dnd': 'Busy', 'offline': 'Offline' };
                    statusTextSmall.textContent = game ? game.name : (customStatus ? customStatus.state : statusMap[status]);
                }
            }
        };

        socket.onclose = () => {
            if (statusDotCard) statusDotCard.className = 'avatar-status-dot offline';
        };
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
