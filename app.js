
$(document).ready(function () {

    // ==============================
    // BANNER / PROMO SLIDER
    // ==============================

    const $slides = $(".promo-slide");
    const $dots = $(".dot");

    const AUTO_INTERVAL = 5000;

    let currentSlide = 0;
    let slideTimer = null;


    function goToSlide(index) {

        if (!$slides.length) return;

        $slides.eq(currentSlide).removeClass("active");
        $dots.eq(currentSlide).removeClass("active");

        currentSlide = (index + $slides.length) % $slides.length;

        $slides.eq(currentSlide).addClass("active");
        $dots.eq(currentSlide).addClass("active");

    }


    function startAutoSlide() {

        clearInterval(slideTimer);

        if ($slides.length > 1) {

            slideTimer = setInterval(function () {

                goToSlide(currentSlide + 1);

            }, AUTO_INTERVAL);

        }

    }


    // Dot clicks

    $dots.each(function (index) {

        $(this).on("click", function () {

            if (!$slides.length || index >= $slides.length) return;

            goToSlide(index);

            startAutoSlide();

            showToast(`${index + 1}-ci reklam seçildi`);

        });

    });


    // Start slider

    if ($slides.length > 1) {

        startAutoSlide();

    }


    // Stop slider when tab is hidden

    $(document).on("visibilitychange", function () {

        if (document.hidden) {

            clearInterval(slideTimer);

        } else if ($slides.length > 1) {

            startAutoSlide();

        }

    });



    // ==============================
    // CATEGORY DATA
    // ==============================

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



    // ==============================
    // CATEGORY MODAL
    // ==============================

    const $categoryModal = $("#categoryModal");

    const $modalTitle = $("#categoryModalTitle");

    const $subcategoryList = $("#subcategoryList");

    const $closeModalBtn = $(".category-modal__close");

    const $modalOverlay = $(".category-modal__overlay");

    const $categoryPanel = $(".category-modal__panel");

    const $categoryCards = $(".category-card");



    // OPEN MODAL

    function openCategoryModal(category) {

        const subcategories = categoryData[category];

        if (!subcategories || !$categoryModal.length) return;


        // Set modal title

        $modalTitle.text(category);


        // Clear previous list

        $subcategoryList.empty();


        // Create subcategories

        subcategories.forEach(function (subcategory) {

            const $item = $("<button>", {
                type: "button",
                class: "subcategory-item"
            });

            const $name = $("<span>").text(subcategory);

            const $arrow = $("<span>", {
                class: "subcategory-item__arrow"
            }).html('<i class="fa-solid fa-chevron-right"></i>');


            $item.append($name, $arrow);


            // Subcategory click

            $item.on("click", function () {

                goToSubcategory(category, subcategory);

            });


            $subcategoryList.append($item);

        });


        // Show modal

        $categoryModal.prop("hidden", false);

        $("body").addClass("modal-open");


        // Start CSS transition

        requestAnimationFrame(function () {

            requestAnimationFrame(function () {

                $categoryModal.addClass("is-open");

            });

        });


        // Focus close button

        $closeModalBtn.trigger("focus");

    }



    // CLOSE MODAL

    function closeCategoryModal() {

        if (!$categoryModal.length) return;

        if ($categoryModal.prop("hidden")) return;


        $categoryModal.removeClass("is-open");

        $("body").removeClass("modal-open");

    }



    // Hide modal after transition

    $categoryPanel.on("transitionend", function (event) {

        if (
            event.originalEvent.propertyName === "transform" &&
            !$categoryModal.hasClass("is-open")
        ) {

            $categoryModal.prop("hidden", true);

        }

    });



    // MAIN CATEGORY CLICK

    $categoryCards.on("click", function () {

        const category = $(this).data("category");


        // Update selected category

        $categoryCards.removeClass("selected");

        $(this).addClass("selected");


        // Show notification

        showToast(`${category} seçildi`);


        // Open modal

        openCategoryModal(category);

    });



    // CLOSE BUTTON

    $closeModalBtn.on("click", function () {

        closeCategoryModal();

    });



    // CLICK ON OVERLAY

    $modalOverlay.on("click", function () {

        closeCategoryModal();

    });



    // ESC KEY

    $(document).on("keydown", function (event) {

        if (event.key === "Escape") {

            closeCategoryModal();

        }

    });



    // ==============================
    // SUBCATEGORY NAVIGATION
    // ==============================

    function goToSubcategory(category, subcategory) {

        console.log("Selected category:", category);

        console.log("Selected subcategory:", subcategory);


        // Burada daha sonra real keçid əlavə edəcəyik.
        // Məsələn:
        // window.location.href = "/category/" + slug;

    }



    // ==============================
    // FAVORITES
    // ==============================

    $(".favorite").on("click", function () {

        const $button = $(this);

        const active = $button.attr("aria-pressed") !== "true";


        $button.attr("aria-pressed", String(active));

        $button.text(active ? "♥" : "♡");


        showToast(

            active
                ? "Elan seçilmişlərə əlavə edildi"
                : "Elan seçilmişlərdən çıxarıldı"

        );

    });



    // ==============================
    // SEARCH INPUT
    // ==============================

    const $searchInput = $("#searchInput");


    // Only Azerbaijani and Latin letters

    $searchInput.on("input", function () {

        let value = $(this).val();


        // Remove numbers, spaces and special characters

        value = value.replace(/[^a-zA-ZəƏıİöÖüÜğĞşŞçÇ]/g, "");


        // Maximum 15 characters

        value = value.slice(0, 15);


        $(this).val(value);

    });



    // ==============================
    // SEARCH FORM
    // ==============================

    $("#searchForm").on("submit", function (event) {

        event.preventDefault();


        const value = $searchInput.val().trim();


        // if (value) {

        //     showToast(`"${value}" üzrə axtarış hazırlanır`);

        // } else {

        //     showToast("Axtarış üçün söz daxil et");

        // }

    });



});
