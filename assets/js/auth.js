// assets/js/auth.js

const PAGE_MAP = {
    dashboard: "dashboard-page",
    panel: "panel-page",
    vps: "vps-page",
    access: "access-page",
    users: "users-page",
    logs: "logs-page",
    github: "github-page"
};

/*
=================================
LOADING TEXT
=================================
*/

function setLoadingText(text) {
    const loadingText = document.getElementById("loading-text");

    if (loadingText) {
        loadingText.textContent = text;
    }
}

async function loadConfig() {
    const response = await fetch("./config.json");
    const cfg = await response.json();

    localStorage.setItem("github_username", cfg.github_username);
    localStorage.setItem("github_repository", cfg.github_repository);
    localStorage.setItem("github_branch", cfg.github_branch);
    localStorage.setItem("github_token", cfg.github_token);
}

/*
=================================
GET PUBLIC IP
=================================
*/

async function getPublicIP() {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
}
/*
=================================
GET ACCESS DATABASE
=================================
*/

async function getAccessDatabase() {

    const response = await fetch(
        CONFIG.DATABASE.ACCESS
    );

    return await response.json();
}

/*
=================================
SAVE SESSION
=================================
*/

function saveSession(user) {

    localStorage.setItem(
        "current_ip",
        user.ip
    );

    localStorage.setItem(
        "current_role",
        user.role
    );

}

/*
=================================
ACCESS DENIED
=================================
*/

function showAccessDenied() {

    document
        .getElementById("loading-screen")
        ?.classList.add("hidden");

    document
        .getElementById("app")
        ?.classList.add("hidden");

    document
        .getElementById("access-denied")
        ?.classList.remove("hidden");

}

/*
=================================
SHOW DASHBOARD
=================================
*/

function showDashboard() {

    document
        .getElementById("loading-screen")
        ?.classList.add("hidden");

    document
        .getElementById("app")
        ?.classList.remove("hidden");

}

/*
=================================
GENERATE SIDEBAR
=================================
*/

function generateMenu(role) {

    const sidebar =
        document.getElementById(
            "sidebar-menu"
        );

    if (!sidebar) return;

    sidebar.innerHTML = "";

    const menus =
        CONFIG.ROLES[role] || [];

    menus.forEach(menu => {

        const item =
            document.createElement("div");

        item.className =
            "menu-item";

        item.dataset.page =
            menu;

        item.textContent =
            menu
                .replace(/-/g, " ")
                .toUpperCase();

        sidebar.appendChild(item);

    });

}

/*
=================================
NAVIGATION
=================================
*/

function setupNavigation() {

    const menuItems =
        document.querySelectorAll(
            ".menu-item"
        );

    menuItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".page")
                    .forEach(page => {

                        page.classList.remove(
                            "active-page"
                        );

                    });

                document
                    .querySelectorAll(".menu-item")
                    .forEach(menu => {

                        menu.classList.remove(
                            "active"
                        );

                    });

                item.classList.add(
                    "active"
                );

                const pageId =
                    PAGE_MAP[
                        item.dataset.page
                    ];

                const page =
                    document.getElementById(
                        pageId
                    );

                if (page) {
                    page.classList.add(
                        "active-page"
                    );
                }

                const sidebar =
                    document.getElementById(
                        "sidebar"
                    );

                const overlay =
                    document.getElementById(
                        "sidebar-overlay"
                    );

                sidebar?.classList.remove(
                    "show"
                );

                overlay?.classList.remove(
                    "show"
                );

            }
        );

    });

}

/*
=================================
SET DEFAULT PAGE
=================================
*/

function setDefaultPage() {

    const firstMenu =
        document.querySelector(
            ".menu-item"
        );

    if (firstMenu) {

        firstMenu.classList.add(
            "active"
        );

    }

}

/*
=================================
MOBILE SIDEBAR
=================================
*/

function setupMobileSidebar() {

    const menuToggle =
        document.getElementById(
            "menu-toggle"
        );

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const overlay =
        document.getElementById(
            "sidebar-overlay"
        );

    if (menuToggle) {

        menuToggle.onclick = () => {

            sidebar?.classList.add(
                "show"
            );

            overlay?.classList.add(
                "show"
            );

        };

    }

    if (overlay) {

        overlay.onclick = () => {

            sidebar?.classList.remove(
                "show"
            );

            overlay?.classList.remove(
                "show"
            );

        };

    }

}

/*
=================================
VERIFY ACCESS
=================================
*/

async function verifyAccess() {

    try {

        setLoadingText(
            "Checking IP..."
        );

        const ip =
            await getPublicIP();

        console.log(
            "IP USER:",
            ip
        );

        setLoadingText(
            "Checking Access..."
        );

        const accessList =
            await getAccessDatabase();

        const user =
            accessList.find(
                item =>
                    item.ip === ip
            );

        if (!user) {

            showAccessDenied();

            return;

        }

        saveSession(user);

        setLoadingText(
            "Loading Dashboard..."
        );

        generateMenu(
            user.role
        );

        setupNavigation();

        setupMobileSidebar();

        setDefaultPage();

        setTimeout(() => {

            showDashboard();

        }, 1000);

    }

    catch (error) {

    alert(
        "AUTH ERROR:\n" +
        error.message
    );

    console.error(
        "AUTH ERROR:",
        error
    );

    showAccessDenied();

}

/*
=================================
START
=================================
*/

window.addEventListener("load", async () => {
    await loadConfig();
    await verifyAccess();
});
);
