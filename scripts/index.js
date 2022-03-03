const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    createElements: true,
    speed: 5000,
    autoplay: {
        delay: 0,
    },
    slidesPerView: 'auto'
});

const wallpapers = new Swiper('.wallpapers', {
    // Optional parameters
    direction: 'horizontal',
    effect: 'cards',
    creativeEffect: {
        prev: {
            translate: [0, 0, 0],
        },
        next: {
            translate: [-500, 0, 0],
        }
    }
});

function appendLoadingBackground() {
    wallpapers.appendSlide(
        `<div class="loading swiper-slide rounded-md bg-gray-700 flex flex-col gap-5 items-center justify-center">
            <h1 class="text-white text-xl font-bold">Loading...</h1>
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>`
    );
}

function updateBackground() {
    if ($(".background-image").attr("src") != wallpapers.slides[wallpapers.activeIndex].getAttribute("src")) {
        $(".background-image").addClass("to-delete");
        $(".to-delete").css("opacity", 0)
        setTimeout(() => {
            $(".to-delete").remove();
        }, 500)

        let img = $("<img>");
        img.attr("src", wallpapers.slides[wallpapers.activeIndex].getAttribute("src"));
        img.addClass("background-image");

        $("body").prepend(img);
    }
}

wallpapers.on('slideChange', async function (change) {
    let length = wallpapers.slides.length
    if (length > 0) {
        updateBackground();

        if (length - 1 == wallpapers.activeIndex || length == wallpapers.activeIndex) {
            //appendLoadingBackground();

            updateNewPictures(lastData.slice(count, count + 5));
            $(".loading").remove();

        }
    }
});

wallpapers.on('slideChangeTransitionEnd', async function (change) {
    let length = wallpapers.slides.length
    console.log("ok2")
    if (length > 0) {
        if (change.previousIndex < change.activeIndex && length > 10 && change.activeIndex > 10) {
            wallpapers.removeSlide([0, 1, 2, 3, 4]);
        }
    }
});

let hide = false;
let count = 0;
let lastData = [];

function animation() {
    hide = true;
    $("#search").blur(); 

    $(".swiper").css({
        "opacity": 0,
        "bottom": "0px"
    });

    $(".search").css({
        "padding-top": "50px",
        "padding-bottom": "50px"
    });

    $(".backgrounds").css("opacity", 1);

    $(".logo").fadeOut();

    setTimeout(() => {
        $(".swiper").hide();
    }, 500);
}

async function grabPictures() {
    return await $.post( "/search", { screen: window.innerWidth > window.innerHeight ? "pc" : "mobile", count: count, q: $("#search").val() });
}

function updateNewPictures(data) {
    data.forEach(element => {
        wallpapers.appendSlide($("<img class='swiper-slide' src='" + element + "'>"));
    });

    $(".wallpapers img").on("error", function() {
        wallpapers.removeSlide($(this).index());
    });

    count += data.length;
}

async function search() {
    $(".spinBtn").removeClass("hidden");

    count = 0;
    let data = await grabPictures();
    lastData = data;
    $(".spinBtn").addClass("hidden");

    $(".errorSearch").addClass("hidden");

    if (data.length > 0) {
        $(".wallpapers").removeClass("hidden");

        wallpapers.removeAllSlides();
        updateNewPictures(data.slice(0, 5));
    
        updateBackground();
    
        if (!hide)
            animation()
    } else {
        $(".errorSearch").html("No results.").removeClass("hidden");
    }
}

$("#search").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        search()
    }
});

function download() {
    var link = document.createElement('a');
    var filePath = wallpapers.slides[wallpapers.activeIndex].getAttribute("src");
    link.target = "_blank";
    link.href = filePath;
    link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}