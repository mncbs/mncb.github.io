// --- DOM Elements ---
const drawerTrigger = document.getElementById('drawerTrigger');
const drawerClose = document.getElementById('drawerClose');
const a11yDrawer = document.getElementById('a11yDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');

const lightThemeBtn = document.getElementById('lightThemeBtn');
const darkThemeBtn = document.getElementById('darkThemeBtn');

const fontDecrease = document.getElementById('fontDecrease');
const fontNormal = document.getElementById('fontNormal');
const fontIncrease = document.getElementById('fontIncrease');

const standardFontBtn = document.getElementById('standardFontBtn');
const dyslexicFontBtn = document.getElementById('dyslexicFontBtn');

let currentSize = 18;

// --- 0. Persistence Initialization (Load on Refresh) ---
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('site-theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        lightThemeBtn.classList.add('active');
        darkThemeBtn.classList.remove('active');
    } else {
        document.documentElement.removeAttribute('data-theme');
        darkThemeBtn.classList.add('active');
        lightThemeBtn.classList.remove('active');
    }

    const savedFont = localStorage.getItem('site-font');
    if (savedFont === 'dyslexic') {
        document.documentElement.setAttribute('data-font', 'dyslexic');
        dyslexicFontBtn.classList.add('active');
        standardFontBtn.classList.remove('active');
    } else {
        document.documentElement.removeAttribute('data-font');
        standardFontBtn.classList.add('active');
        dyslexicFontBtn.classList.remove('active');
    }

    const savedSize = localStorage.getItem('site-font-size');
    if (savedSize) {
        currentSize = parseInt(savedSize, 10);
        document.documentElement.style.setProperty('--base-font-size', `${currentSize}px`);
        
        [fontDecrease, fontNormal, fontIncrease].forEach(btn => btn.classList.remove('active'));
        if (currentSize === 15) fontDecrease.classList.add('active');
        if (currentSize === 18) fontNormal.classList.add('active');
        if (currentSize === 22) fontIncrease.classList.add('active');
    }
});

// --- 1. Side Drawer Navigation Engine ---
function openDrawer() {
    a11yDrawer.classList.add('open');
    drawerOverlay.classList.add('show');
    drawerTrigger.setAttribute('aria-expanded', 'true');
    a11yDrawer.setAttribute('aria-hidden', 'false');
    setTimeout(() => drawerClose.focus(), 100);
}

function closeDrawer() {
    a11yDrawer.classList.remove('open');
    drawerOverlay.classList.remove('show');
    drawerTrigger.setAttribute('aria-expanded', 'false');
    a11yDrawer.setAttribute('aria-hidden', 'true');
    drawerTrigger.focus();
}

if (drawerTrigger) drawerTrigger.addEventListener('click', openDrawer);
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && a11yDrawer.classList.contains('open')) {
        closeDrawer();
    }
});

// --- 2. Theme Logic ---
darkThemeBtn.addEventListener('click', () => {
    document.documentElement.removeAttribute('data-theme');
    darkThemeBtn.classList.add('active');
    lightThemeBtn.classList.remove('active');
    localStorage.setItem('site-theme', 'dark');
});

lightThemeBtn.addEventListener('click', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    lightThemeBtn.classList.add('active');
    darkThemeBtn.classList.remove('active');
    localStorage.setItem('site-theme', 'light');
});

// --- 3. Text Size Logic ---
function updateFontSize(size, activeBtn) {
    currentSize = size;
    document.documentElement.style.setProperty('--base-font-size', `${currentSize}px`);
    localStorage.setItem('site-font-size', currentSize);
    
    [fontDecrease, fontNormal, fontIncrease].forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

fontDecrease.addEventListener('click', () => updateFontSize(15, fontDecrease));
fontNormal.addEventListener('click', () => updateFontSize(18, fontNormal));
fontIncrease.addEventListener('click', () => updateFontSize(22, fontIncrease));

// --- 4. Font Style Logic ---
dyslexicFontBtn.addEventListener('click', () => {
    document.documentElement.setAttribute('data-font', 'dyslexic');
    dyslexicFontBtn.classList.add('active');
    standardFontBtn.classList.remove('active');
    localStorage.setItem('site-font', 'dyslexic');
});

standardFontBtn.addEventListener('click', () => {
    document.documentElement.removeAttribute('data-font');
    standardFontBtn.classList.add('active');
    dyslexicFontBtn.classList.remove('active');
    localStorage.setItem('site-font', 'standard');
});

// --- 5. Scroll Progress Bar ---
window.addEventListener('scroll', () => {
    const progressBarFill = document.querySelector('.progress-bar-fill');
    if (progressBarFill) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentProgress = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercentage = totalHeight > 0 ? (currentProgress / totalHeight) * 100 : 0;
        progressBarFill.style.width = `${scrollPercentage}%`;
    }
});

// --- 6. ScrollSpy for Mixed Elements ---
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('h1[id], section[id]');
    const outlineLinks = document.querySelectorAll('.outline-item');
    
    let currentActiveId = '';
    const targetLine = window.innerHeight * 0.3;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= targetLine) {
            currentActiveId = section.getAttribute('id');
        }
    });

    const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 15;
    if (isAtBottom && sections.length > 0) {
        currentActiveId = sections[sections.length - 1].getAttribute('id');
    }

    outlineLinks.forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('a');
        if (link && currentActiveId && link.getAttribute('href') === `#${currentActiveId}`) {
            item.classList.add('active');
        }
    });
});