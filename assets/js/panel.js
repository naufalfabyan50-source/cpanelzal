// assets/js/panel.js

const Panel = {

    /*
    ====================================
    LOAD SERVER DROPDOWN
    ====================================
    */

    async loadServers() {

        try {

            const servers =
                await DB.getServers();

            const activeServers =
                servers.filter(

                    server =>
                    server.status ===
                    "Aktif"

                );

            const dropdown =
                document.getElementById(
                    "panel-server"
                );

            if(!dropdown) return;

            dropdown.innerHTML = "";

            if(
                activeServers.length === 0
            ) {

                dropdown.innerHTML = `

                <option>

                    Tidak Ada Server Aktif

                </option>

                `;

                return;

            }

            activeServers.forEach(
                server => {

                dropdown.innerHTML += `

                <option
                value="${server.id}">

                    ${server.name}

                </option>

                `;

            });

        }

        catch(error) {

            console.error(
                error
            );

            toastError(
                "Gagal memuat server"
            );

        }

    },

    /*
    ====================================
    CREATE PANEL
    ====================================
    */

    async create(data) {

        try {

            showLoading(
                "Membuat Panel..."
            );

            const servers =
                await DB.getServers();

            const server =
                servers.find(

                    item =>
                    item.id ==
                    data.serverId

                );

            if(!server) {

                hideLoading();

                toastError(
                    "Server tidak ditemukan"
                );

                return;

            }

            const panelData = {

                username:
                    data.username,

                password:
                    data.password,

                storage:
                    data.storage,

                server:
                    server.name,

                login:
                    server.hostname

            };

            await DB.addPanel(
                panelData
            );

            hideLoading();

            this.showResult(
                panelData
            );

            toastSuccess(
                "Panel berhasil dibuat"
            );

            await Dashboard.load();

            document
            .getElementById(
                "create-panel-form"
            )
            .reset();

        }

        catch(error) {

            hideLoading();

            console.error(
                error
            );

            toastError(
                "Gagal membuat panel"
            );

        }

    },

    /*
    ====================================
    SHOW RESULT
    ====================================
    */

    showResult(data) {

        const result =
            document.getElementById(
                "panel-result"
            );

        if(!result) return;

        const panelText =

`Panel Berhasil Dibuat 🐦‍🔥

Username : ${data.username}
Password : ${data.password}
Link Login : ${data.login}
Server : ${data.server}
Spesifikasi : ${data.storage}

⚠️ Jangan sebarkan domain login ke publik.`;

        result.innerHTML = `

        <div class="success-box">

            <h2>

                Panel Berhasil Dibuat 🐦‍🔥

            </h2>

            <pre>

${panelText}

            </pre>

            <button
            onclick="Panel.copy()">

                COPY DATA

            </button>

        </div>

        `;

        this.lastCopyData =
            panelText;

    },

    /*
    ====================================
    COPY
    ====================================
    */

    async copy() {

        if(
            !this.lastCopyData
        ) {

            return;

        }

        await copyToClipboard(

            this.lastCopyData

        );

    }

};

/*
====================================
FORM CREATE PANEL
====================================
*/

document
.getElementById(
    "create-panel-form"
)
?.addEventListener(
    "submit",
    async e => {

        e.preventDefault();

        const username =
            document
            .getElementById(
                "panel-username"
            )
            .value
            .trim();

        const password =
            document
            .getElementById(
                "panel-password"
            )
            .value
            .trim();

        const storage =
            document
            .getElementById(
                "panel-storage"
            )
            .value;

        const serverId =
            document
            .getElementById(
                "panel-server"
            )
            .value;

        if(
            !username ||
            !password
        ) {

            toastWarning(
                "Lengkapi semua form"
            );

            return;

        }

        await Panel.create({

            username,
            password,
            storage,
            serverId

        });

    }
);