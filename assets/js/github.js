// assets/js/github.js

const Github = {

    /*
    ====================================
    GET CONFIG
    ====================================
    */

    getConfig() {

        return {

            username:
                localStorage.getItem(
                    "github_username"
                ) || "",

            repository:
                localStorage.getItem(
                    "github_repository"
                ) || "",

            branch:
                localStorage.getItem(
                    "github_branch"
                ) || "main",

            token:
                localStorage.getItem(
                    "github_token"
                ) || ""

        };

    },

    /*
    ====================================
    SAVE CONFIG
    ====================================
    */

    saveConfig(config) {

        localStorage.setItem(
            "github_username",
            config.username
        );

        localStorage.setItem(
            "github_repository",
            config.repository
        );

        localStorage.setItem(
            "github_branch",
            config.branch
        );

        localStorage.setItem(
            "github_token",
            config.token
        );

    },

    /*
    ====================================
    CHECK CONFIG
    ====================================
    */

    hasConfig() {

        const cfg =
            this.getConfig();

        return (

            cfg.username &&
            cfg.repository &&
            cfg.branch &&
            cfg.token

        );

    },

    /*
    ====================================
    GET FILE
    ====================================
    */

    async getFile(path) {

        const cfg =
            this.getConfig();

        const url =
            `https://api.github.com/repos/${cfg.username}/${cfg.repository}/contents/${path}?ref=${cfg.branch}`;

        const response =
            await fetch(url, {

                headers: {

                    Authorization:
                        `Bearer ${cfg.token}`,

                    Accept:
                        "application/vnd.github+json"

                }

            });

        if (!response.ok) {

            throw new Error(
                `Gagal mengambil file: ${path}`
            );

        }

        const data =
            await response.json();

        const content =
            atob(
                data.content.replace(
                    /\n/g,
                    ""
                )
            );

        return {

            sha:
                data.sha,

            json:
                JSON.parse(
                    content
                )

        };

    },

    /*
    ====================================
    UPDATE FILE
    ====================================
    */

    async updateFile(
        path,
        jsonData,
        commitMessage
    ) {

        const cfg =
            this.getConfig();

        const file =
            await this.getFile(
                path
            );

        const url =
            `https://api.github.com/repos/${cfg.username}/${cfg.repository}/contents/${path}`;

        const payload = {

            message:
                commitMessage,

            content:
                btoa(
                    JSON.stringify(
                        jsonData,
                        null,
                        2
                    )
                ),

            sha:
                file.sha,

            branch:
                cfg.branch

        };

        const response =
            await fetch(url, {

                method: "PUT",

                headers: {

                    Authorization:
                        `Bearer ${cfg.token}`,

                    Accept:
                        "application/vnd.github+json",

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        payload
                    )

            });

        if (!response.ok) {

            const error =
                await response.text();

            console.error(
                error
            );

            throw new Error(
                "Commit Github Gagal"
            );

        }

        return await response.json();

    }

};

/*
====================================
LOAD FORM CONFIG
====================================
*/

function loadGithubConfig() {

    const cfg =
        Github.getConfig();

    const username =
        document.getElementById(
            "github-username"
        );

    const repository =
        document.getElementById(
            "github-repository"
        );

    const branch =
        document.getElementById(
            "github-branch"
        );

    const token =
        document.getElementById(
            "github-token"
        );

    if (username)
        username.value =
            cfg.username;

    if (repository)
        repository.value =
            cfg.repository;

    if (branch)
        branch.value =
            cfg.branch;

    if (token)
        token.value =
            cfg.token;

}

/*
====================================
SAVE FORM CONFIG
====================================
*/

function setupGithubForm() {

    const form =
        document.getElementById(
            "github-form"
        );

    if (!form) return;

    form.addEventListener(
        "submit",
        e => {

            e.preventDefault();

            Github.saveConfig({

                username:
                    document.getElementById(
                        "github-username"
                    ).value.trim(),

                repository:
                    document.getElementById(
                        "github-repository"
                    ).value.trim(),

                branch:
                    document.getElementById(
                        "github-branch"
                    ).value.trim(),

                token:
                    document.getElementById(
                        "github-token"
                    ).value.trim()

            });

            if (
                typeof toastSuccess ===
                "function"
            ) {

                toastSuccess(
                    "Konfigurasi Github Disimpan"
                );

            }

        }
    );

}

/*
====================================
SHOW / HIDE TOKEN
====================================
*/

function setupTokenToggle() {

    const button =
        document.getElementById(
            "show-token"
        );

    const token =
        document.getElementById(
            "github-token"
        );

    if (
        !button ||
        !token
    ) return;

    button.addEventListener(
        "click",
        () => {

            if (
                token.type ===
                "password"
            ) {

                token.type =
                    "text";

                button.textContent =
                    "🙈 Hide Token";

            } else {

                token.type =
                    "password";

                button.textContent =
                    "👁 Show Token";

            }

        }
    );

}

/*
====================================
INIT
====================================
*/

window.addEventListener(
    "load",
    () => {

        loadGithubConfig();

        setupGithubForm();

        setupTokenToggle();

    }
);