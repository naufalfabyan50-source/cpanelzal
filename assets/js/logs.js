// assets/js/logs.js

const Logs = {

    /*
    ====================================
    LOAD LOGS
    ====================================
    */

    async load() {

        try {

            const logs =
                await DB.getLogs();

            this.render(
                logs
            );

        }

        catch(error) {

            console.error(
                error
            );

            toastError(
                "Gagal memuat logs"
            );

        }

    },

    /*
    ====================================
    RENDER
    ====================================
    */

    render(logs) {

        const tbody =
            document.getElementById(
                "logs-body"
            );

        if(!tbody) return;

        tbody.innerHTML = "";

        if(
            logs.length === 0
        ) {

            tbody.innerHTML = `

            <tr>

                <td
                colspan="5">

                    Belum ada aktivitas

                </td>

            </tr>

            `;

            return;

        }

        logs.forEach(log => {

            tbody.innerHTML += `

            <tr>

                <td>

                    ${this.formatDate(
                        log.time
                    )}

                </td>

                <td>

                    ${log.action || "-"}

                </td>

                <td>

                    ${log.target || "-"}

                </td>

                <td>

                    ${log.ip || "-"}

                </td>

                <td>

                    ${log.role || "-"}

                </td>

            </tr>

            `;

        });

    },

    /*
    ====================================
    FORMAT DATE
    ====================================
    */

    formatDate(date) {

        return new Date(
            date
        ).toLocaleString(

            "id-ID",

            {

                year: "numeric",

                month: "long",

                day: "numeric",

                hour: "2-digit",

                minute: "2-digit",

                second: "2-digit"

            }

        );

    }

};

/*
====================================
AUTO REFRESH
====================================
*/

setInterval(

    async () => {

        const page =
            document.getElementById(
                "logs-page"
            );

        if(
            page &&
            page.classList.contains(
                "active-page"
            )
        ) {

            await Logs.load();

        }

    },

    30000

);