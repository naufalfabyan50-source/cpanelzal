// assets/js/dashboard.js

const Dashboard = {

    /*
    ====================================
    LOAD DASHBOARD
    ====================================
    */
    async load() {

        try {

            const servers =
                await DB.getServers() || [];

            const users =
                await DB.getAccess() || [];

            const panels =
                await DB.getPanels() || [];

            const logs =
                await DB.getLogs() || [];

            this.renderCards({
                servers,
                users,
                panels,
                logs
            });

        } catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );

            if (
                typeof toastError === "function"
            ) {
                toastError(
                    "Gagal memuat dashboard"
                );
            }

        }

    },

    /*
    ====================================
    RENDER CARD DATA
    ====================================
    */
    renderCards(data) {

        const {
            servers,
            users,
            panels,
            logs
        } = data;

        const totalVps =
            servers.length;

        const totalUsers =
            users.length;

        const totalPanels =
            panels.length;

        const todayActivity =
            this.countTodayLogs(logs);

        const vpsElement =
            document.getElementById(
                "total-vps"
            );

        const userElement =
            document.getElementById(
                "total-user"
            );

        const panelElement =
            document.getElementById(
                "total-panel"
            );

        const activityElement =
            document.getElementById(
                "activity-today"
            );

        if (vpsElement)
            vpsElement.textContent =
                totalVps;

        if (userElement)
            userElement.textContent =
                totalUsers;

        if (panelElement)
            panelElement.textContent =
                totalPanels;

        if (activityElement)
            activityElement.textContent =
                todayActivity;

    },

    /*
    ====================================
    HITUNG AKTIVITAS HARI INI
    ====================================
    */
    countTodayLogs(logs) {

        const today =
            new Date()
            .toDateString();

        return logs.filter(log => {

            if (!log.time)
                return false;

            const logDate =
                new Date(
                    log.time
                ).toDateString();

            return (
                logDate === today
            );

        }).length;

    }

};

/*
====================================
LOAD PERTAMA
====================================
*/
document.addEventListener(
    "DOMContentLoaded",
    () => {

        Dashboard.load();

    }
);

/*
====================================
AUTO REFRESH
====================================
*/
setInterval(() => {

    const dashboardPage =
        document.getElementById(
            "dashboard-page"
        );

    if (
        dashboardPage &&
        dashboardPage.classList.contains(
            "active-page"
        )
    ) {

        Dashboard.load();

    }

}, 30000);