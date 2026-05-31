const CONFIG = {

    SUPER_ADMIN_IP: "157.20.244.153",

    DATABASE: {
        ACCESS: "./database/access.json",
        SERVER: "./database/server.json",
        PANEL: "./database/panel.json",
        LOGS: "./database/logs.json"
    },

    ROLES: {

        "Super Admin": [
            "dashboard",
            "panel",
            "vps",
            "access",
            "users",
            "logs",
            "github"
        ],

        "Admin": [
            "dashboard",
            "panel",
            "vps",
            "access"
        ],

        "User": [
            "dashboard",
            "panel"
        ]

    }

};