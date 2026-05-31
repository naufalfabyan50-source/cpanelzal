// assets/js/app.js

const App = {

    async init() {

        try {

            showLoading(
                "Memuat Sistem..."
            );

            await Dashboard.load();

            await VPS.load();

            await Access.load();

            await Panel.loadServers();

            await Logs.load();

            hideLoading();

            console.log(
                "Panel Management Ready"
            );

        }

        catch(error) {

            hideLoading();

            console.error(
                error
            );

            toastError(
                "Gagal memuat aplikasi"
            );

        }

    }

};

/*
====================================
START APP
====================================
*/

window.addEventListener(

    "load",

    async () => {

        setTimeout(

            async () => {

                if(
                    localStorage.getItem(
                        "current_role"
                    )
                ) {

                    await App.init();

                }

            },

            1500

        );

    }

);