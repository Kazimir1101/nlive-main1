// ==============================
// MOBILE MENU
// ==============================

const menuButton = document.querySelector(".menu-toggle");
const desktopNav = document.querySelector(".desktop-nav");

menuButton?.addEventListener("click", () => {
    const isOpen = desktopNav.classList.toggle("mobile-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
});


// ==============================
// TOAST NOTIFICATION
// ==============================

const toastEl = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
    if (!toastEl) return;

    toastEl.textContent = message;
    toastEl.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastEl.classList.remove("show");
    }, 2200);
}


// ==============================
// BANNER / PROMO SLIDER (5s auto-rotate)
// ==============================

const slides = document.querySelectorAll(".promo-slide");
const dots = document.querySelectorAll(".dot");
const AUTO_INTERVAL = 5000; // 5 saniyə

let currentSlide = 0;
let slideTimer = null;

function goToSlide(index) {
    if (!slides.length) return;

    slides[currentSlide].classList.remove("active");
    if (dots[currentSlide]) dots[currentSlide].classList.remove("active");

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add("active");
    if (dots[currentSlide]) dots[currentSlide].classList.add("active");
}

function startAutoSlide() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, AUTO_INTERVAL);
}

// Dot klikləri
dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        goToSlide(index);
        startAutoSlide(); // timer-i sıfırla
        showToast(`${index + 1}-ci reklam seçildi`);
    });
});

// Avtomatik başlat
if (slides.length > 1) {
    startAutoSlide();
}

// İstifadəçi tabı dəyişəndə animasiyanı dayandır (performans üçün)
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        clearInterval(slideTimer);
    } else if (slides.length > 1) {
        startAutoSlide();
    }
});


// ==============================
// CATEGORY SELECTION
// ==============================

document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".category-card").forEach((item) => {
            item.classList.remove("selected");
        });

        card.classList.add("selected");
        showToast(`${card.dataset.category} seçildi`);
    });
});


// ==============================
// FAVORITES
// ==============================

document.querySelectorAll(".favorite").forEach((button) => {
    button.addEventListener("click", () => {
        const active = button.getAttribute("aria-pressed") !== "true";

        button.setAttribute("aria-pressed", String(active));
        button.textContent = active ? "♥" : "♡";

        showToast(
            active
                ? "Elan seçilmişlərə əlavə edildi"
                : "Elan seçilmişlərdən çıxarıldı"
        );
    });
});


// ==============================
// SEARCH
// ==============================

document.querySelector("#searchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = document.querySelector("#searchInput").value.trim();

    if (value) {
        showToast(`"${value}" üzrə axtarış hazırlanır`);
    } else {
        showToast("Axtarış üçün söz daxil et");
    }
});
