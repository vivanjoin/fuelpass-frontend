import './stimulus_bootstrap.js';
import './styles/app.css';

document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const menu = document.querySelector('[data-mobile-menu]');
const videoModal = document.querySelector('[data-video-modal]');
const videoFrame = document.querySelector('[data-video-frame]');
const videoUrl = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1';

function setHeaderState() {
    if (!header) {
        return;
    }

    header.classList.toggle('is-scrolled', window.scrollY > 20);
}

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

function scrollToSection(hash, behavior = 'smooth') {
    if (!hash || hash === '#') {
        return false;
    }

    const target = document.querySelector(hash);
    if (!target) {
        return false;
    }

    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 22;

    window.scrollTo({
        top: Math.max(0, targetTop),
        behavior,
    });

    return true;
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!scrollToSection(href)) {
            return;
        }

        event.preventDefault();

        menu?.classList.remove('is-open');
        menu?.setAttribute('aria-hidden', 'true');

        history.pushState(null, '', href);
    });
});

if (window.location.hash) {
    window.setTimeout(() => {
        scrollToSection(window.location.hash, 'auto');
    }, 80);
}

document.querySelector('[data-menu-open]')?.addEventListener('click', () => {
    menu?.classList.add('is-open');
    menu?.setAttribute('aria-hidden', 'false');
});

document.querySelector('[data-menu-close]')?.addEventListener('click', () => {
    menu?.classList.remove('is-open');
    menu?.setAttribute('aria-hidden', 'true');
});

menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
    });
});

function closeVideo() {
    videoModal?.classList.remove('is-open');
    videoModal?.setAttribute('aria-hidden', 'true');
    if (videoFrame) {
        videoFrame.removeAttribute('src');
    }
}

document.querySelectorAll('[data-video-open]').forEach((button) => {
    button.addEventListener('click', () => {
        if (videoFrame) {
            videoFrame.setAttribute('src', videoUrl);
        }
        videoModal?.classList.add('is-open');
        videoModal?.setAttribute('aria-hidden', 'false');
    });
});

document.querySelectorAll('[data-phone-slider]').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.phone-slide'));
    const dots = Array.from(slider.closest('.phone-screen')?.querySelectorAll('[data-phone-dots] button') ?? []);
    let active = 0;

    if (slides.length < 2) {
        return;
    }

    function showSlide(next) {
        const currentSlide = slides[active];
        const nextSlide = slides[next];

        currentSlide.classList.add('is-exiting');
        currentSlide.classList.remove('is-active');
        nextSlide.classList.add('is-active');

        dots[active]?.classList.remove('is-active');
        dots[next]?.classList.add('is-active');

        window.setTimeout(() => currentSlide.classList.remove('is-exiting'), 520);
        active = next;
    }

    const interval = window.setInterval(() => {
        showSlide((active + 1) % slides.length);
    }, 3200);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== active) {
                showSlide(index);
            }
        });
    });
});

document.querySelector('[data-video-close]')?.addEventListener('click', closeVideo);
videoModal?.addEventListener('click', (event) => {
    if (event.target === videoModal) {
        closeVideo();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeVideo();
        menu?.classList.remove('is-open');
        menu?.setAttribute('aria-hidden', 'true');
    }
});

document.querySelectorAll('.step-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
        const parent = card.closest('.steps');
        parent?.querySelectorAll('.step-card').forEach((s) => s.classList.remove('is-active'));
        card.classList.add('is-active');
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => {
    revealObserver.observe(element);
});
