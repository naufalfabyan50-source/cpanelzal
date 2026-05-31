// assets/js/vps.js

const VPS = {

    /*
    ====================================
    LOAD VPS
    ====================================
    */

    async load() {

        try {

            const servers =
                await DB.getServers();

            this.render(
                servers
            );

            this.updatePanelServerList(
                servers
            );

        }

        catch(error) {

            console.error(error);

            toastError(
                "Gagal memuat VPS"
            );

        }

    },

    /*
    ====================================
    RENDER VPS
    ====================================
    */

    render(servers) {

        const container =
            document.getElementById(
                "server-list"
            );

        if(!container) return;

        container.innerHTML = "";

        if(
            servers.length === 0
        ) {

            container.innerHTML = `

            <div class="server-card">

                Belum ada VPS

            </div>

            `;

            return;

        }

        servers.forEach(server => {

            container.innerHTML += `

            <div class="server-card">

                <h3>
                    ${server.name}
                </h3>

                <p>
                    Domain :
                    ${server.hostname}
                </p>

                <p>
                    PLTA :
                    ${server.plta}
                </p>

                <p>
                    PLTC :
                    ${server.pltc}
                </p>

                <p>
                    Status :
                    ${server.status}
                </p>

                <br>

                <button
                onclick="VPS.edit('${server.id}')">

                    Edit

                </button>

                <button
                onclick="VPS.remove('${server.id}')">

                    Hapus

                </button>

            </div>

            `;

        });

    },

    /*
    ====================================
    ADD VPS
    ====================================
    */

    async add(formData) {

        try {

            showLoading(
                "Menyimpan VPS..."
            );

            await DB.addServer({

                name:
                    formData.name,

                hostname:
                    formData.hostname,

                plta:
                    formData.plta,

                pltc:
                    formData.pltc,

                status:
                    formData.status

            });

            hideLoading();

            toastSuccess(
                "VPS berhasil ditambahkan"
            );

            await this.load();

            await Dashboard.load();

            document
            .getElementById(
                "vps-form"
            )
            .reset();

        }

        catch(error) {

            hideLoading();

            console.error(
                error
            );

            toastError(
                "Gagal menambahkan VPS"
            );

        }

    },

    /*
    ====================================
    DELETE VPS
    ====================================
    */

    async remove(id) {

        if(
            !confirmDelete(
                "Hapus VPS ini?"
            )
        ) {
            return;
        }

        try {

            showLoading(
                "Menghapus VPS..."
            );

            await DB.deleteServer(
                id
            );

            hideLoading();

            toastSuccess(
                "VPS berhasil dihapus"
            );

            await this.load();

            await Dashboard.load();

        }

        catch(error) {

            hideLoading();

            console.error(
                error
            );

            toastError(
                "Gagal menghapus VPS"
            );

        }

    },

    /*
    ====================================
    EDIT VPS
    ====================================
    */

    async edit(id) {

        try {

            const servers =
                await DB.getServers();

            const server =
                servers.find(
                    s =>
                    s.id == id
                );

            if(!server) {

                toastError(
                    "Server tidak ditemukan"
                );

                return;

            }

            showModal(

                "Edit VPS",

                `

                <input
                id="edit-name"
                value="${server.name}">

                <br><br>

                <input
                id="edit-hostname"
                value="${server.hostname}">

                <br><br>

                <input
                id="edit-plta"
                value="${server.plta}">

                <br><br>

                <input
                id="edit-pltc"
                value="${server.pltc}">

                <br><br>

                <select
                id="edit-status">

                    <option
                    ${server.status === "Aktif" ? "selected" : ""}>

                    Aktif

                    </option>

                    <option
                    ${server.status === "Nonaktif" ? "selected" : ""}>

                    Nonaktif

                    </option>

                </select>

                <br><br>

                <button
                onclick="VPS.update('${id}')">

                    Simpan Perubahan

                </button>

                `
            );

        }

        catch(error) {

            console.error(
                error
            );

        }

    },

    /*
    ====================================
    UPDATE VPS
    ====================================
    */

    async update(id) {

        try {

            showLoading(
                "Memperbarui VPS..."
            );

            await DB.updateServer(

                id,

                {

                    name:
                        document
                        .getElementById(
                            "edit-name"
                        ).value,

                    hostname:
                        document
                        .getElementById(
                            "edit-hostname"
                        ).value,

                    plta:
                        document
                        .getElementById(
                            "edit-plta"
                        ).value,

                    pltc:
                        document
                        .getElementById(
                            "edit-pltc"
                        ).value,

                    status:
                        document
                        .getElementById(
                            "edit-status"
                        ).value

                }

            );

            hideLoading();

            hideModal();

            toastSuccess(
                "VPS berhasil diperbarui"
            );

            await this.load();

            await Dashboard.load();

        }

        catch(error) {

            hideLoading();

            console.error(
                error
            );

            toastError(
                "Gagal update VPS"
            );

        }

    },

    /*
    ====================================
    PANEL SERVER DROPDOWN
    ====================================
    */

    updatePanelServerList(
        servers
    ) {

        const dropdown =
            document.getElementById(
                "panel-server"
            );

        if(!dropdown) return;

        dropdown.innerHTML = "";

        const activeServers =
            servers.filter(

                server =>
                server.status ===
                "Aktif"

            );

        activeServers.forEach(
            server => {

            dropdown.innerHTML += `

            <option
            value="${server.name}">

                ${server.name}

            </option>

            `;

        });

    }

};

/*
====================================
VPS FORM
====================================
*/

document
.getElementById(
    "vps-form"
)
?.addEventListener(
    "submit",
    async e => {

        e.preventDefault();

        await VPS.add({

            name:
                document
                .getElementById(
                    "server-name"
                ).value,

            hostname:
                document
                .getElementById(
                    "server-domain"
                ).value,

            plta:
                document
                .getElementById(
                    "server-plta"
                ).value,

            pltc:
                document
                .getElementById(
                    "server-pltc"
                ).value,

            status:
                document
                .getElementById(
                    "server-status"
                ).value

        });

    }
);