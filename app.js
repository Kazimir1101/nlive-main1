
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



/* =================================
   CATEGORY MODAL
================================= */

// Подкатегории главных категорий

const categoryData = {

    "Elanlar": [
        "Nəqliyyat",
        "Daşınmaz əmlak",
        "Elektronika",
        "Geyim və aksesuarlar",
        "Ev və bağ",
        "Kənd məhsulları",
        "Uşaq aləmi",
        "Digər elanlar"
    ],

    "Məkanlar": [
        "Kirayə evlər",
        "Restoranlar",
        "Otellər",
        "Fast Food",
        "Coffee Shop",
        "Gözəllik salonları",
        "Kişi salonları",
        "Əyləncə məkanları"
        
    ],

    "Xidmətlər": [
        "Təmir və tikinti",
        "Avtoservislər",
        "Təhsil və kurslar",
        "Təmizlik xidmətləri",
        "Mebel xidmətləri",
        "Yükdaşınma və logistika",
        "Biznes xidmətləri",
        "Həyət və bağ"
    ],

    "Fürsətlər": [
        "Mağazalar",
        "Aksiyalar",
        "Vakansiyalar",
        "İcarə",
        "Yol yoldaşı",
        "Günlük işlər",
        "İtirilmiş əşyalar",
        "Havayı apar"
    ]

};


// DOM ELEMENTS

const categoryModal = document.getElementById("categoryModal");

const modalTitle = document.getElementById("categoryModalTitle");

const subcategoryList = document.getElementById("subcategoryList");

const closeModalBtn = document.querySelector(".category-modal__close");

const modalOverlay = document.querySelector(".category-modal__overlay");

const categoryCards = document.querySelectorAll(".category-card");


// OPEN MODAL

function openCategoryModal(category) {

    const subcategories = categoryData[category];

    if (!subcategories) return;

    // Заголовок
    modalTitle.textContent = category;

    // Очищаем предыдущий список
    subcategoryList.innerHTML = "";

    // Создаём подкатегории
    subcategories.forEach(subcategory => {

        const item = document.createElement("button");

        item.type = "button";
        item.className = "subcategory-item";

        const name = document.createElement("span");
        name.textContent = subcategory;

        const arrow = document.createElement("span");
        arrow.className = "subcategory-item__arrow";
        arrow.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

        item.appendChild(name);
        item.appendChild(arrow);

        // Переход в подкатегорию
        item.addEventListener("click", () => {

            goToSubcategory(category, subcategory);

        });

        subcategoryList.appendChild(item);

    });

    // Показываем модальное окно
    categoryModal.hidden = false;

    document.body.classList.add("modal-open");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            categoryModal.classList.add("is-open");
        });
    });

    closeModalBtn.focus();
}


// CLOSE MODAL

function closeCategoryModal() {

    if (categoryModal.hidden) return;

    categoryModal.classList.remove("is-open");

    document.body.classList.remove("modal-open");

}


// Скрываем после завершения анимации

categoryModal.querySelector(".category-modal__panel")
    .addEventListener("transitionend", function(event) {

        if (
            event.propertyName === "transform" &&
            !categoryModal.classList.contains("is-open")
        ) {
            categoryModal.hidden = true;
        }

    });


// CLICK ON MAIN CATEGORIES

categoryCards.forEach(card => {

    card.addEventListener("click", () => {

        const category = card.dataset.category;

        // Обновляем активную категорию
        categoryCards.forEach(item => {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

        // Открываем модальное окно
        openCategoryModal(category);

    });

});


// CLOSE BUTTON

closeModalBtn.addEventListener("click", closeCategoryModal);


// CLICK ON OVERLAY

modalOverlay.addEventListener("click", closeCategoryModal);


// ESC KEY

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeCategoryModal();
    }

});


// SUBCATEGORY NAVIGATION (PLACEHOLDER)

function goToSubcategory(category, subcategory) {

    console.log("Selected category:", category);

    console.log("Selected subcategory:", subcategory);

    // Здесь позже добавим реальный переход.
    // Например:
    // window.location.href = "/category/" + slug;

}
