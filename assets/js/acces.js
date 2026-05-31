// assets/js/access.js

const Access = {

    /*
    ====================================
    LOAD ACCESS
    ====================================
    */

    async load() {

        try {

            const access =
                await DB.getAccess();

            this.render(
                access
            );

        }

        catch(error) {

            console.error(
                error
            );

            toastError(
                "Gagal memuat data access"
            );

        }

    },

    /*
    ====================================
    RENDER ACCESS
    ====================================
    */

    render(accessList) {

        const container =
            document.getElementById(
                "access-list"
            );

        if(!container) return;

        container.innerHTML = "";

        if(
            accessList.length === 0
        ) {

            container.innerHTML = `

            <div class="access-card">

                Tidak ada data access

            </div>

            `;

            return;

        }

        accessList.forEach(item => {

            const isDefaultSuperAdmin =
                item.ip ===
                "157.20.244.153";

            container.innerHTML += `

            <div class="access-card">

                <h3>

                    ${item.ip}

                </h3>

                <p>

                    Role :
                    ${item.role}

                </p>

                <p>

                    Created :
                    ${
                        item.createdAt
                        ?
                        formatDate(
                            item.createdAt
                        )
                        :
                        "-"
                    }

                </p>

                <br>

                ${
                    isDefaultSuperAdmin
                    ?
                    `
                    <button disabled>
                        Protected
                    </button>
                    `
                    :
                    `
                    <button
                    onclick="Access.remove('${item.ip}')">

                        Hapus

                    </button>
                    `
                }

            </div>

            `;

        });

    },

    /*
    ====================================
    ADD ACCESS
    ====================================
    */

    async add(ip, role) {

        try {

            if(!ip) {

                toastWarning(
                    "IP wajib diisi"
                );

                return;

            }

            showLoading(
                "Menambahkan Access..."
            );

            const access =
                await DB.getAccess();

            const exists =
                access.find(

                    item =>
                    item.ip === ip

                );

            if(exists) {

                hideLoading();

                toastWarning(
                    "IP sudah terdaftar"
                );

                return;

            }

            await DB.addAccess(
                ip,
                role
            );

            hideLoading();

            toastSuccess(
                "IP berhasil ditambahkan"
            );

            document
            .getElementById(
                "access-form"
            )
            .reset();

            await this.load();

            await Dashboard.load();

        }

        catch(error) {

            hideLoading();

            console.error(
                error
            );

            toastError(
                "Gagal menambahkan IP"
            );

        }

    },

    /*
    ====================================
    DELETE ACCESS
    ====================================
    */

    async remove(ip) {

        try {

            if(
                !confirmDelete(
                    `Hapus akses ${ip}?`
                )
            ) {

                return;

            }

            showLoading(
                "Menghapus Access..."
            );

            const access =
                await DB.getAccess();

            const filtered =
                access.filter(

                    item =>
                    item.ip !== ip

                );

            await DB.saveAccess(
                filtered
            );

            await DB.addLog(

                "DELETE_ACCESS",

                ip

            );

            hideLoading();

            toastSuccess(
                "Access berhasil dihapus"
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
                "Gagal menghapus access"
            );

        }

    }

};

/*
====================================
ACCESS FORM
====================================
*/

document
.getElementById(
    "access-form"
)
?.addEventListener(
    "submit",
    async e => {

        e.preventDefault();

        const ip =
            document
            .getElementById(
                "access-ip"
            )
            .value
            .trim();

        const role =
            document
            .getElementById(
                "access-role"
            )
            .value;

        await Access.add(
            ip,
            role
        );

    }
);
