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

    if (lanyardId) {
        const apiKey = '3e242dc130603b07d6fc649cd150301d';
        const statusDotCard = document.getElementById('avatar-status-dot');
        const avatarImg = document.getElementById('discord-avatar');
        const decorationImg = document.getElementById('discord-decoration');
        const bannerEl = document.getElementById('discord-banner');
        const customStatusEl = document.getElementById('discord-custom-status');
        const activityContainer = document.getElementById('discord-activity');
        const badgesContainer = document.getElementById('discord-badges');
        const usernameEl = document.querySelector('.profile-username');

        function updateUI(presence) {
            if (!presence) return;
            
            const status = presence.discord_status || 'offline';
            const user = presence.discord_user;
            
            // 1. Update Status Dot
            if (statusDotCard) {
                statusDotCard.className = `avatar-status-dot ${status}`;
            }

            // 2. Update Avatar, Decoration & Banner
            if (user) {
                // Name
                if (usernameEl) {
                    usernameEl.textContent = user.global_name || user.username;
                }

                // Avatar
                if (avatarImg && user.avatar) {
                    const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
                    avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=160`;
                }

                // Decoration
                if (decorationImg) {
                    if (user.avatar_decoration_data) {
                        const asset = user.avatar_decoration_data.asset;
                        decorationImg.src = `https://cdn.discordapp.com/avatar-decorations/${asset}.png`;
                        decorationImg.style.display = 'block';
                    } else if (user.avatar_decoration) { 
                        decorationImg.src = `https://cdn.discordapp.com/avatar-decorations/${user.avatar_decoration}.png`;
                        decorationImg.style.display = 'block';
                    } else {
                        decorationImg.style.display = 'none';
                    }
                }

                // Banner
                if (bannerEl) {
                    if (user.banner) {
                        const ext = user.banner.startsWith('a_') ? 'gif' : 'png';
                        bannerEl.style.backgroundImage = `url(https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${ext}?size=600)`;
                    } else if (user.accent_color) {
                        const hex = user.accent_color.toString(16).padStart(6, '0');
                        bannerEl.style.backgroundImage = 'none';
                        bannerEl.style.backgroundColor = `#${hex}`;
                    } else {
                        bannerEl.style.backgroundImage = 'none';
                        bannerEl.style.backgroundColor = '#5562ea';
                    }
                }

                // Badges (Comprehensive mapping)
                if (badgesContainer) {
                    let badgesHtml = '';
                    const flags = user.public_flags || 0;
                    
                    const badgeMap = [
                        { bit: 1, img: 'https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordstaff.svg', title: 'Discord Staff' },
                        { bit: 2, img: 'https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordpartner.svg', title: 'Partnered Server Owner' },
                        { bit: 4, img: 'https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquad_events.svg', title: 'HypeSquad Events' },
                        { bit: 64, img: 'https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquad_bravery.svg', title: 'HypeSquad Bravery' },
                        { bit: 128, img: 'https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquad_brilliance.svg', title: 'HypeSquad Brilliance' },
                        { bit: 256, img: 'https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquad_balance.svg', title: 'HypeSquad Balance' },
                        { bit: 512, img: 'https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/earlysupporter.svg', title: 'Early Supporter' },
                        { bit: 16384, img: 'https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordcertifiedmoderator.svg', title: 'Discord Certified Moderator' },
                        { bit: 131072, img: 'https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/activedeveloper.svg', title: 'Active Developer' }
                    ];

                    badgeMap.forEach(b => {
                        if (flags & b.bit) {
                            badgesHtml += `<img class="badge-icon" src="${b.img}" title="${b.title}" alt="${b.title}">`;
                        }
                    });
                    
                    badgesContainer.innerHTML = badgesHtml;
                    badgesContainer.style.display = badgesHtml ? 'flex' : 'none';
                }
            }

            // 3. Update Custom Status with Emoji
            const customStatus = presence.activities.find(a => a.type === 4);
            if (customStatusEl) {
                if (customStatus && (customStatus.state || customStatus.emoji)) {
                    let emojiHtml = '';
                    if (customStatus.emoji) {
                        if (customStatus.emoji.id) {
                            const ext = customStatus.emoji.animated ? 'gif' : 'png';
                            emojiHtml = `<img class="status-emoji" src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${ext}" alt="emoji">`;
                        } else if (customStatus.emoji.name) {
                            emojiHtml = `<span class="status-emoji-text">${customStatus.emoji.name}</span>`;
                        }
                    }
                    customStatusEl.innerHTML = `${emojiHtml} <span class="status-text">${customStatus.state || ""}</span>`;
                    customStatusEl.style.display = 'flex';
                } else {
                    customStatusEl.style.display = 'none';
                }
            }

            // 4. Update Game/Activity
            if (activityContainer) {
                const game = presence.activities.find(a => a.type === 0);
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
                        <div class="activity-header">Playing a game</div>
                        <div class="activity-item">
                            <img class="activity-icon" src="${iconUrl}" onerror="this.src='resources/Viperisuseful-LOGO.png'" alt="Activity">
                            <div class="activity-details">
                                <span class="activity-name">${game.name}</span>
                                <span class="activity-state">${game.details || ""}</span>
                                <span class="activity-state">${game.state || ""}</span>
                            </div>
                        </div>
                    `;
                    activityContainer.style.display = 'block';
                } else {
                    activityContainer.innerHTML = `<span class="no-activity">No current activity</span>`;
                }
            }
        }

        // Initial Fetch with API Key
        fetch(`https://api.lanyard.rest/v1/users/${lanyardId}`, {
            headers: { 'Authorization': apiKey }
        })
            .then(res => res.json())
            .then(json => { if (json.success) updateUI(json.data); })
            .catch(err => console.error('Lanyard Fetch Error:', err));

        // WebSocket for Live Updates
        let socket = new WebSocket('wss://api.lanyard.rest/socket');
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.op === 1) {
                setInterval(() => socket.send(JSON.stringify({ op: 3 })), data.d.heartbeat_interval);
                socket.send(JSON.stringify({ 
                    op: 2, 
                    d: { 
                        subscribe_to_id: lanyardId,
                        api_key: apiKey 
                    } 
                }));
            }
            if (data.op === 0) {
                updateUI(data.d);
            }
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
