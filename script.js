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
        const statusDotCard = document.getElementById('avatar-status-dot');
        const avatarImg = document.getElementById('discord-avatar');
        const decorationImg = document.getElementById('discord-decoration');
        const bannerEl = document.getElementById('discord-banner');
        const customStatusEl = document.getElementById('discord-custom-status');
        const activityContainer = document.getElementById('discord-activity');
        const badgesContainer = document.getElementById('discord-badges');
        const usernameEl = document.querySelector('.profile-username');
        const clanTagEl = document.getElementById('discord-clan-tag');
        const primaryBadgeEl = document.getElementById('discord-primary-badge');
        const serverBadgeEl = document.getElementById('discord-server-badge');
        const serverBadgeEl2 = document.getElementById('discord-server-badge-2');

        /**
         * NOTE:
         * - Lanyard presence endpoint does NOT require an API key.
         * - Lanyard API keys are ONLY for KV operations (PUT/PATCH/DELETE on /kv).
         *   Never ship those in frontend JS.
         */

        function escapeHtml(value) {
            return String(value ?? '')
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')
                .replaceAll("'", '&#39;');
        }

        function getActivityTypeLabel(type) {
            switch (type) {
                case 0: return 'Playing';
                case 1: return 'Streaming';
                case 2: return 'Listening to';
                case 3: return 'Watching';
                case 4: return 'Custom Status';
                default: return 'Activity';
            }
        }

        function getDiscordCdnAssetUrl(activity) {
            if (!activity) return null;
            const assets = activity.assets;
            if (!assets || !assets.large_image) return null;

            const large = assets.large_image;

            // External images sometimes come through like: mp:external/<...>/https/<host>/<path>
            if (large.startsWith('mp:external')) {
                return large.replace(/mp:external\/([^\/]+)\/https\/(.*)/, 'https://$2');
            }

            // Spotify uses spotify: identifiers; we use the nicer album_art_url from presence.spotify instead.
            if (large.startsWith('spotify:')) return null;

            if (activity.application_id) {
                return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${large}.png`;
            }

            return null;
        }

        function formatSpotifyLine(spotify) {
            if (!spotify) return '';
            const song = spotify.song ? escapeHtml(spotify.song) : '';
            const artist = spotify.artist ? escapeHtml(spotify.artist) : '';
            if (song && artist) return `${song} — ${artist}`;
            return song || artist || '';
        }

        function getKvBannerUrl(kv) {
            if (!kv || typeof kv !== 'object') return null;
            const raw = kv.banner_url || kv.banner || kv.profile_banner || null;
            if (!raw) return null;
            const value = String(raw).trim();
            // allow http(s) or relative/site-relative paths
            if (/^https?:\/\//i.test(value)) return value;
            if (value.startsWith('/') || value.startsWith('resources/') || value.startsWith('./')) return value;
            return null;
        }

        function getKvString(kv, key) {
            if (!kv || typeof kv !== 'object') return null;
            const raw = kv[key];
            if (raw === undefined || raw === null) return null;
            const value = String(raw).trim();
            return value ? value : null;
        }

        function getKvAssetRef(kv, key) {
            const value = getKvString(kv, key);
            if (!value) return null;

            // allow http(s) URLs
            if (/^https?:\/\//i.test(value)) return value;

            // allow site-relative or relative paths (useful for your own hosted assets)
            // examples: /resources/badge.svg, resources/badge.svg, ./resources/badge.svg
            if (value.startsWith('/') || value.startsWith('resources/') || value.startsWith('./')) {
                return value;
            }

            return null;
        }

        function renderPresence(presence) {
            if (!presence) return;

            const status = presence.discord_status || 'offline';
            const user = presence.discord_user;
            const activities = Array.isArray(presence.activities) ? presence.activities : [];

            // 1. Update Status Dot
            if (statusDotCard) {
                statusDotCard.className = `avatar-status-dot ${status}`;
            }

            // 2. Update Avatar, Decoration & Banner (only if those fields exist)
            if (user) {
                // Name
                if (usernameEl) {
                    usernameEl.textContent = user.global_name || user.username || 'Discord User';
                }

                // Clan Tag (non-standard; only render if present)
                if (clanTagEl) {
                    if (user.clan) {
                        const clanBadgeUrl = `https://cdn.discordapp.com/clan-badges/${user.clan.identity_guild_id || user.clan.guild_id}/${user.clan.badge}.png`;
                        const clanBadge = user.clan.badge ? `<img class="clan-badge-icon" src="${clanBadgeUrl}" onerror="this.style.display='none'">` : '';
                        clanTagEl.innerHTML = `${clanBadge}<span>${escapeHtml(user.clan.tag)}</span>`;
                        clanTagEl.style.display = 'flex';
                    } else {
                        clanTagEl.style.display = 'none';
                    }
                }

                // Avatar
                if (avatarImg && user.avatar) {
                    const ext = String(user.avatar).startsWith('a_') ? 'gif' : 'png';
                    avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=160`;
                }

                // Decoration (usually NOT present in Lanyard payload; keep safe)
                if (decorationImg) {
                    if (user.avatar_decoration_data && user.avatar_decoration_data.asset) {
                        decorationImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png`;
                        decorationImg.style.display = 'block';
                    } else if (user.avatar_decoration) {
                        decorationImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration}.png`;
                        decorationImg.style.display = 'block';
                    } else {
                        decorationImg.style.display = 'none';
                    }
                }

                // Banner / Accent: show KV banner if provided, else user banner, else accent color fallback
                if (bannerEl) {
                    const kvBanner = getKvBannerUrl(presence.kv);
                    bannerEl.style.display = 'block';

                    if (kvBanner) {
                        bannerEl.style.backgroundImage = `url(${kvBanner})`;
                        bannerEl.style.backgroundColor = '';
                    } else if (user.banner) {
                        const ext = String(user.banner).startsWith('a_') ? 'gif' : 'png';
                        bannerEl.style.backgroundImage = `url(https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${ext}?size=600)`;
                        bannerEl.style.backgroundColor = '';
                    } else if (user.accent_color) {
                        const hex = user.accent_color.toString(16).padStart(6, '0');
                        bannerEl.style.backgroundImage = 'none';
                        bannerEl.style.backgroundColor = `#${hex}`;
                    } else {
                        bannerEl.style.backgroundImage = 'none';
                        bannerEl.style.backgroundColor = '#111214';
                    }
                }

                // Server badge pills (KV-driven, because Lanyard doesn't include guild/server tags)
                // Set these in Lanyard KV:
                // - server_badge_text: "TRTL"
                // - server_badge_icon_url: "resources/badge-leaf.svg" (or https://...)
                // - server_badge_secondary_icon_url: "resources/badge-purple.svg" (or https://...)
                if (serverBadgeEl) {
                    const badgeText =
                        getKvString(presence.kv, 'server_badge_text') ||
                        getKvString(presence.kv, 'server_tag') ||
                        'TRTL';

                    const badgeIconUrl = getKvAssetRef(presence.kv, 'server_badge_icon_url') || 'resources/badge-leaf.svg';

                    if (badgeText) {
                        const iconHtml = badgeIconUrl ? `<img src="${badgeIconUrl}" alt="" onerror="this.style.display='none'">` : '';
                        serverBadgeEl.innerHTML = `${iconHtml}${escapeHtml(badgeText)}`;
                        serverBadgeEl.style.display = 'inline-flex';
                    } else {
                        serverBadgeEl.style.display = 'none';
                    }
                }

                if (serverBadgeEl2) {
                    const secondaryIconUrl = getKvAssetRef(presence.kv, 'server_badge_secondary_icon_url') || 'resources/badge-purple.svg';
                    if (secondaryIconUrl) {
                        serverBadgeEl2.innerHTML = `<img src="${secondaryIconUrl}" alt="" onerror="this.style.display='none'">`;
                        serverBadgeEl2.style.display = 'inline-flex';
                    } else {
                        serverBadgeEl2.style.display = 'none';
                    }
                }

                // Badges
                if (badgesContainer) {
                    let badgesHtml = '';
                    const flags = user.public_flags || 0;

                    // Only show a primary text badge if explicitly provided (prevents random shifting/wrapping)
                    if (primaryBadgeEl) {
                        const customPrimary = getKvString(presence.kv, 'primary_badge_text');
                        if (customPrimary) {
                            primaryBadgeEl.textContent = customPrimary;
                            primaryBadgeEl.style.display = 'inline';
                        } else {
                            primaryBadgeEl.style.display = 'none';
                        }
                    }

                    const badgeMap = [
                        { bit: 1, img: 'https://cdn.jsdelivr.net/gh/mezotv/discord-badges@main/assets/discordstaff.svg', title: 'Discord Staff' },
                        { bit: 2, img: 'https://cdn.jsdelivr.net/gh/mezotv/discord-badges@main/assets/discordpartner.svg', title: 'Partnered Server Owner' },
                        { bit: 4, img: 'https://cdn.jsdelivr.net/gh/mezotv/discord-badges@main/assets/hypesquad_events.svg', title: 'HypeSquad Events' },
                        { bit: 64, img: 'https://cdn.jsdelivr.net/gh/mezotv/discord-badges@main/assets/hypesquad_bravery.svg', title: 'HypeSquad Bravery' },
                        { bit: 128, img: 'https://cdn.jsdelivr.net/gh/mezotv/discord-badges@main/assets/hypesquad_brilliance.svg', title: 'HypeSquad Brilliance' },
                        { bit: 256, img: 'https://cdn.jsdelivr.net/gh/mezotv/discord-badges@main/assets/hypesquad_balance.svg', title: 'HypeSquad Balance' },
                        { bit: 512, img: 'https://cdn.jsdelivr.net/gh/mezotv/discord-badges@main/assets/earlysupporter.svg', title: 'Early Supporter' },
                        { bit: 16384, img: 'https://cdn.jsdelivr.net/gh/mezotv/discord-badges@main/assets/discordcertifiedmoderator.svg', title: 'Discord Certified Moderator' },
                        { bit: 131072, img: 'https://cdn.jsdelivr.net/gh/mezotv/discord-badges@main/assets/activedeveloper.svg', title: 'Active Developer' }
                    ];

                    badgeMap.forEach(b => {
                        if (flags & b.bit) {
                            badgesHtml += `<img class="badge-icon" src="${b.img}" title="${escapeHtml(b.title)}" alt="${escapeHtml(b.title)}" onerror="this.style.display='none'">`;
                        }
                    });

                    badgesContainer.innerHTML = badgesHtml;
                    badgesContainer.style.display = badgesHtml ? 'flex' : 'none';
                }
            }

            // 3. Custom Status
            const customStatus = activities.find(a => a && a.type === 4);
            if (customStatusEl) {
                if (customStatus && (customStatus.state || customStatus.emoji)) {
                    let emojiHtml = '';
                    if (customStatus.emoji) {
                        if (customStatus.emoji.id) {
                            const ext = customStatus.emoji.animated ? 'gif' : 'png';
                            emojiHtml = `<img class="status-emoji" src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${ext}" alt="emoji">`;
                        } else if (customStatus.emoji.name) {
                            emojiHtml = `<span class="status-emoji-text">${escapeHtml(customStatus.emoji.name)}</span>`;
                        }
                    }
                    customStatusEl.innerHTML = `${emojiHtml} <span class="status-text">${escapeHtml(customStatus.state || "")}</span>`;
                    customStatusEl.style.display = 'flex';
                } else {
                    customStatusEl.style.display = 'none';
                }
            }

            // 4. Activities (Spotify + everything else)
            if (activityContainer) {
                const spotify = presence.listening_to_spotify ? presence.spotify : null;

                // Prefer a "game" style activity card like the screenshot.
                // Priority: game (type 0, not Spotify) -> Spotify -> first non-custom activity.
                const game = activities.find(a => a && a.type === 0 && a.name && a.name !== 'Spotify');
                const nonCustom = activities.filter(a => a && a.type !== 4);
                const fallbackActivity = nonCustom[0] || null;

                let card = null;
                if (game) {
                    card = {
                        icon: getDiscordCdnAssetUrl(game) || 'resources/Viperisuseful-LOGO.png',
                        name: game.name,
                        line1: game.details || '',
                        line2: game.state || ''
                    };
                } else if (spotify) {
                    card = {
                        icon: spotify.album_art_url || 'resources/Viperisuseful-LOGO.png',
                        name: spotify.song || 'Spotify',
                        line1: spotify.artist || '',
                        line2: spotify.album || ''
                    };
                } else if (fallbackActivity) {
                    card = {
                        icon: getDiscordCdnAssetUrl(fallbackActivity) || 'resources/Viperisuseful-LOGO.png',
                        name: fallbackActivity.name || 'Activity',
                        line1: fallbackActivity.details || '',
                        line2: fallbackActivity.state || ''
                    };
                }

                if (!card) {
                    activityContainer.innerHTML = `<span class="no-activity">No current activity</span>`;
                    activityContainer.style.display = 'block';
                    return;
                }

                activityContainer.innerHTML = `
                    <div class="activity-item">
                        <img class="activity-icon" src="${escapeHtml(card.icon)}" onerror="this.src='resources/Viperisuseful-LOGO.png'" alt="Activity">
                        <div class="activity-details">
                            <span class="activity-name">${escapeHtml(card.name)}</span>
                            ${card.line1 ? `<span class="activity-state">${escapeHtml(card.line1)}</span>` : ''}
                            ${card.line2 ? `<span class="activity-state">${escapeHtml(card.line2)}</span>` : ''}
                        </div>
                    </div>
                `;
                activityContainer.style.display = 'block';
            }
        }

        function extractPresenceFromSocketPayload(payload) {
            if (!payload || payload.op !== 0) return null;

            // INIT_STATE: payload.d is a map { [userId]: presence }
            if (payload.t === 'INIT_STATE' && payload.d && typeof payload.d === 'object') {
                return payload.d[lanyardId] || null;
            }

            // PRESENCE_UPDATE: payload.d is the presence object with an extra user_id
            if (payload.t === 'PRESENCE_UPDATE' && payload.d && typeof payload.d === 'object') {
                if (!payload.d.user_id || String(payload.d.user_id) === String(lanyardId)) {
                    return payload.d;
                }
                return null;
            }

            // Fallback: some clients may only provide payload.d as presence
            if (payload.d && payload.d.discord_status) return payload.d;

            return null;
        }

        // Initial REST fetch (fast first paint, and works even if WS is blocked)
        fetch(`https://api.lanyard.rest/v1/users/${lanyardId}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(json => {
                if (json && json.success) {
                    renderPresence(json.data);
                }
            })
            .catch(err => console.error('Lanyard Fetch Error:', err));

        // WebSocket for Live Updates (correct INIT_STATE/PRESENCE_UPDATE handling)
        let socket;
        let heartbeatTimer;
        let reconnectTimer;
        let reconnectAttempt = 0;

        function cleanupSocket() {
            if (heartbeatTimer) {
                clearInterval(heartbeatTimer);
                heartbeatTimer = null;
            }
            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
                reconnectTimer = null;
            }
            if (socket) {
                const oldSocket = socket;
                socket = null;
                try { oldSocket.close(); } catch { /* noop */ }
            }
        }

        function scheduleReconnect() {
            // exponential backoff with a cap
            const delay = Math.min(15000, 500 * Math.pow(2, reconnectAttempt++));
            reconnectTimer = setTimeout(connectSocket, delay);
        }

        function connectSocket() {
            cleanupSocket();

            const ws = new WebSocket('wss://api.lanyard.rest/socket');
            socket = ws;

            ws.onmessage = (event) => {
                if (ws !== socket) return;
                let payload;
                try {
                    payload = JSON.parse(event.data);
                } catch {
                    return;
                }

                if (payload.op === 1 && payload.d && payload.d.heartbeat_interval) {
                    // Heartbeat
                    heartbeatTimer = setInterval(() => {
                        try {
                            ws.send(JSON.stringify({ op: 3 }));
                        } catch {
                            // If send fails, we'll reconnect via onclose.
                        }
                    }, payload.d.heartbeat_interval);

                    // Initialize subscription
                    ws.send(JSON.stringify({
                        op: 2,
                        d: { subscribe_to_id: lanyardId }
                    }));
                    return;
                }

                if (payload.op === 0) {
                    const presence = extractPresenceFromSocketPayload(payload);
                    if (presence) {
                        reconnectAttempt = 0;
                        renderPresence(presence);
                    }
                }
            };

            ws.onerror = () => {
                if (ws !== socket) return;
                try { ws.close(); } catch { /* noop */ }
            };

            ws.onclose = () => {
                if (ws !== socket) return;
                if (heartbeatTimer) {
                    clearInterval(heartbeatTimer);
                    heartbeatTimer = null;
                }
                scheduleReconnect();
            };
        }

        connectSocket();
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
