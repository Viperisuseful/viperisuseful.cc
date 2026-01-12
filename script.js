document.addEventListener('DOMContentLoaded', () => {
    // 1. Redirect logic (Discord/Quickrun/Turtle pages)
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

    // 2. Lottie Initialization for Index page
    const sparkContainer = document.getElementById('spark-lottie');
    if (sparkContainer) {
        lottie.loadAnimation({
            container: sparkContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'resources/icons8-sparkling.json'
        });
    }

    // 3. Scroll Progress Indicator Logic
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }
});
