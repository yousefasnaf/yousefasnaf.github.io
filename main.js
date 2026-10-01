

// DROPDOWN SYSTEM


let opened = null;


function openMenu(id){


let box=document.getElementById(id);



if(opened && opened!==box){

opened.classList.remove("show");

}



if(box.classList.contains("show")){


box.classList.remove("show");

opened=null;


}

else{


box.classList.add("show");

opened=box;

if(id === 'games') {
    const container = document.getElementById("sections-container");
    if (container && container.children.length === 0) {
        loadAllGamesScript();
    }
}


}



}





// BACKGROUND MODAL & CHANGER LOGIC


const bgModal = document.getElementById("bgModal");
const picker = document.getElementById("bgPicker");

function openBgModal() {
    bgModal.classList.add("show");
}

function closeBgModal() {
    bgModal.classList.remove("show");
}

function triggerCustomUpload() {
    closeBgModal();
    picker.click();
}

function applyBackground(url, isVideo = false) {
    let oldVideo = document.querySelector("video");
    if (oldVideo) oldVideo.remove();

    if (isVideo) {
        let video = document.createElement("video");
        video.src = url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.style.position = "fixed";
        video.style.top = "0";
        video.style.left = "0";
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover";
        video.style.zIndex = "-1";
        document.body.appendChild(video);
        document.body.style.backgroundImage = "none";
    } else {
        document.body.style.backgroundImage = `url(${url})`;
    }

    localStorage.setItem("joseBackground", url);
    localStorage.setItem("joseBackgroundType", isVideo ? "video" : "image");
}

function setPresetBackground(url) {
    applyBackground(url, false);
    closeBgModal();
}


picker.onchange = function() {
    let file = this.files[0];
    if (!file) return;

    let url = URL.createObjectURL(file);
    let isVideo = file.type.startsWith("video");
    applyBackground(url, isVideo);
};


// LOAD SAVED BACKGROUND ON STARTUP (WITH SPACE AS DEFAULT)

const defaultSpaceBg = "wallpapers/space.png";

let saved = localStorage.getItem("joseBackground") || defaultSpaceBg;
let savedType = localStorage.getItem("joseBackgroundType") || "image";

if (savedType === "video") {
    applyBackground(saved, true);
} else {
    applyBackground(saved, false);
}

function loadAllGamesScript() {
    const existingScript = document.getElementById('ugs-dynamic-script');
    if (existingScript) {
        existingScript.remove();
    }
    const script = document.createElement('script');
    script.id = 'ugs-dynamic-script';
    script.src = 'https://cdn.jsdelivr.net/gh/bubbls/ugs-singlefile@latest/games.js';
    document.body.appendChild(script);

    setTimeout(setupSidebarJump, 1000);
}

// Function to handle clicking sidebar letters/numbers to jump to section
function setupSidebarJump() {
    const sidebarButtons = document.querySelectorAll(".ugs-sidebar-btn");
    sidebarButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener("click", () => {
            const targetLetter = newBtn.textContent.trim().toUpperCase();
            const headers = document.querySelectorAll(".ugs-letter-header");
            const mainContainer = document.getElementById("ugsMainContent");

            for (let header of headers) {
                if (header.textContent.trim().toUpperCase().includes(targetLetter)) {
                    if (mainContainer) {
                        mainContainer.scrollTo({
                            top: header.offsetTop - mainContainer.offsetTop,
                            behavior: "smooth"
                        });
                    }
                    break;
                }
            }
        });
    });
}

// Robust Search Filter function
function performSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase().trim();
    const sectionsContainer = document.getElementById("sections-container");
    if (!sectionsContainer) return;

    const buttons = sectionsContainer.querySelectorAll(".ugs-btn");
    const headers = sectionsContainer.querySelectorAll(".ugs-letter-header");

    buttons.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (text.includes(query) || query === "") {
            btn.style.display = "";
        } else {
            btn.style.display = "none";
        }
    });

    headers.forEach(header => {
        let nextEl = header.nextElementSibling;
        let hasVisible = false;
        while (nextEl && !nextEl.classList.contains("ugs-letter-header")) {
            if (nextEl.style.display !== "none") {
                hasVisible = true;
                break;
            }
            nextEl = nextEl.nextElementSibling;
        }
        if (query === "") {
            header.style.display = "";
        } else {
            header.style.display = hasVisible ? "" : "none";
        }
    });
}


// LAUNCH IFRAME BROWSER VIEW
function launchIframe(url) {
    const homeView = document.getElementById("homeView");
    const frameView = document.getElementById("frameView");
    const appIframe = document.getElementById("appIframe");
    const urlDisplay = document.getElementById("urlDisplay");

    appIframe.src = url;
    urlDisplay.textContent = "https://josephasn.com/search.html";

    homeView.style.display = "none";
    frameView.style.display = "flex";
}

// RETURN BACK TO NORMAL JOSEPHASN HOME
function goHome() {
    const homeView = document.getElementById("homeView");
    const frameView = document.getElementById("frameView");
    const appIframe = document.getElementById("appIframe");

    appIframe.src = "about:blank"; // Unload iframe
    frameView.style.display = "none";
    homeView.style.display = "flex";

    // Clear search bar input
    const mainSearch = document.getElementById("mainSearch");
    if (mainSearch) mainSearch.value = "";
}


// Attach live search listener & Enter key handler
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", performSearch);
        searchInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                performSearch();
                searchInput.blur();
            }
        });
    }

    // MAIN SEARCH BAR: Open iframe view on Enter key
    const mainSearch = document.getElementById("mainSearch");
    if (mainSearch) {
        mainSearch.addEventListener("keydown", function(e) {
            if (e.key === "Enter" && this.value.trim() !== "") {
                launchIframe("gust.html");
            }
        });
    }

    const observer = new MutationObserver(() => {
        setupSidebarJump();
    });
    const container = document.getElementById("sections-container");
    if (container) {
        observer.observe(container, { childList: true, subtree: true });
    }
});
