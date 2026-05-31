// assets/js/database.js

const DB = {

    /*
    ====================================
    ACCESS
    ====================================
    */

    async getAccess() {

        const data =
            await Github.getFile(
                "database/access.json"
            );

        return data.json;

    },

    async saveAccess(data) {

        return await Github.updateFile(

            "database/access.json",

            data,

            "Update Access Database"

        );

    },

    async addAccess(ip, role) {

        const access =
            await this.getAccess();

        access.push({

            ip,

            role,

            createdAt:
                new Date().toISOString()

        });

        await this.saveAccess(
            access
        );

        await this.addLog(

            "ADD_ACCESS",

            `${ip} (${role})`

        );

        return true;

    },

    /*
    ====================================
    SERVER
    ====================================
    */

    async getServers() {

        const data =
            await Github.getFile(
                "database/server.json"
            );

        return data.json;

    },

    async saveServers(data) {

        return await Github.updateFile(

            "database/server.json",

            data,

            "Update Server Database"

        );

    },

    async addServer(serverData) {

        const servers =
            await this.getServers();

        serverData.id =
            Date.now();

        serverData.createdAt =
            new Date().toISOString();

        servers.push(
            serverData
        );

        await this.saveServers(
            servers
        );

        await this.addLog(

            "ADD_SERVER",

            serverData.name

        );

        return true;

    },

    async deleteServer(id) {

        let servers =
            await this.getServers();

        servers =
            servers.filter(

                server =>
                    server.id != id

            );

        await this.saveServers(
            servers
        );

        await this.addLog(

            "DELETE_SERVER",

            id

        );

        return true;

    },

    async updateServer(
        id,
        newData
    ) {

        const servers =
            await this.getServers();

        const index =
            servers.findIndex(

                server =>
                    server.id == id

            );

        if (
            index === -1
        ) {

            throw new Error(
                "Server tidak ditemukan"
            );

        }

        servers[index] = {

            ...servers[index],

            ...newData,

            updatedAt:
                new Date()
                .toISOString()

        };

        await this.saveServers(
            servers
        );

        await this.addLog(

            "UPDATE_SERVER",

            id

        );

        return true;

    },

    /*
    ====================================
    PANEL
    ====================================
    */

    async getPanels() {

        const data =
            await Github.getFile(
                "database/panel.json"
            );

        return data.json;

    },

    async savePanels(data) {

        return await Github.updateFile(

            "database/panel.json",

            data,

            "Update Panel Database"

        );

    },

    async addPanel(panelData) {

        const panels =
            await this.getPanels();

        panelData.id =
            Date.now();

        panelData.createdAt =
            new Date().toISOString();

        panels.push(
            panelData
        );

        await this.savePanels(
            panels
        );

        await this.addLog(

            "CREATE_PANEL",

            panelData.username

        );

        return true;

    },

    /*
    ====================================
    LOGS
    ====================================
    */

    async getLogs() {

        const data =
            await Github.getFile(
                "database/logs.json"
            );

        return data.json;

    },

    async saveLogs(data) {

        return await Github.updateFile(

            "database/logs.json",

            data,

            "Update Logs Database"

        );

    },

    async addLog(
        action,
        target
    ) {

        const logs =
            await this.getLogs();

        logs.unshift({

            time:
                new Date()
                .toISOString(),

            action,

            target,

            ip:
                localStorage.getItem(
                    "current_ip"
                ),

            role:
                localStorage.getItem(
                    "current_role"
                )

        });

        await this.saveLogs(
            logs
        );

    }

};