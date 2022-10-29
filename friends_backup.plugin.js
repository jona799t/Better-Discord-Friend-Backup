/**
 * @name FriendsBackup
 * @author Jonathan#0008
 * @description Backup all your friends with a click of a button
 * @version 0.0.2
 */

const fs = require('fs')

function refreshConfig() {
    var directory = module.filename.split("/")
    directory = module.filename.replace(directory[directory.length - 1], "")

    try {
        window.friends_backup_config = JSON.parse(fs.readFileSync(`${directory}friends_backup.config.json`));
        if (window.friends_backup_config.save_folder === undefined) {
            throw new Error('config file is wrong')
        }
        console.log("Config folder:", window.friends_backup_config)
    }
    catch(err) {
        window.friends_backup_config = {
            save_folder: `${directory}`,
            backup_on_startup: true
        }
        fs.writeFile(`${directory}friends_backup.config.json`, JSON.stringify(window.friends_backup_config), (err) => {
            if (err) throw err;
            console.log('Saved friends_backup.config.json!');
        });
        console.log("Config folder:", window.friends_backup_config)
    }
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function friendBackup() {
    refreshConfig()

    const tabs = getElementByXpath("//*[@id=\"app-mount\"]/div[2]/div/div[1]/div/div[2]/div/div[1]/div/div/main/section/div[1]/div[4]").childNodes

    var tab = null
    tabs.forEach((_tab) => {
        if (_tab.getAttribute("aria-selected") == "true") {
            tab = _tab
        }
    })

    getElementByXpath("//*[@id=\"app-mount\"]/div[2]/div/div[1]/div/div[2]/div/div[1]/div/div/main/section/div[1]/div[4]/div[2]").click()

    var friendsBackedup = []
    const friends = getElementByXpath("//*[@id=\"all-tab\"]/div[3]/div[1]")
    for (let i = 0; i < friends.childNodes.length; i++) {
        friendsBackedup.push({
            username: getElementByXpath(`//*[@id="all-tab"]/div[3]/div[1]/div[${i+1}]/div/div[1]/div[2]/div[1]/span[1]`).textContent + getElementByXpath(`//*[@id="all-tab"]/div[3]/div[1]/div[${i+1}]/div/div[1]/div[2]/div[1]/span[2]`).textContent,
            user_id: getElementByXpath(`//*[@id="all-tab"]/div[3]/div[1]/div[${i+1}]`).getAttribute("data-list-item-id").replace("people___", "")
        })
    }
    fs.writeFile(`${window.friends_backup_config.save_folder}/friends.json`, JSON.stringify(friendsBackedup), err => {
        if (err) {
            BdApi.showToast("An error occurred trying to back up your friends", {type: "error"})
        } else {
            if (friendsBackedup.length == 1) {
                BdApi.showToast(`${friendsBackedup.length} friend were saved to: ${window.friends_backup_config.save_folder}/friends.json`, {type: "success"})
            } else {
                BdApi.showToast(`${friendsBackedup.length} friends were saved to: ${window.friends_backup_config.save_folder}/friends.json`, {type: "success"})
            }
        }
    })

    tab.click()
}

module.exports = class FriendBackup {
    start() {
        refreshConfig()
        if (window.friends_backup_config.backup_on_startup && window.location.href.includes("channels/@me")) {
            try {
                friendBackup()
            }
            catch(err) {
                BdApi.showToast("An error occurred trying to back up your friends", {type: "error"})
            }
        }
        if (window.location.href.includes("channels/@me") && !window.location.href.includes("channels/@me/")) {
            const friendBackupBtn = document.createElement("div");
            friendBackupBtn.className = getElementByXpath('//*[@id="app-mount"]/div[2]/div/div[1]/div/div[2]/div/div[1]/div/div/main/section/div[1]/div[4]/div[6]').getAttribute("class");
            friendBackupBtn.textContent = "Friend Backup";
            friendBackupBtn.addEventListener("click", friendBackup);
            const friendBar = document.querySelector("#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div.container-1eFtFS > div > div > main > section > div.children-3xh0VB > div.tabBar-ra-EuL.topPill-3DJJNV");
            friendBar.append(friendBackupBtn);

            BdApi.onRemoved(friendBackupBtn, () => {
                friendBar.append(friendBackupBtn);
            });
        }
    }

    onSwitch() {
        if (window.location.href.includes("channels/@me") && !window.location.href.includes("channels/@me/")) {
            refreshConfig()
            const friendBackupBtn = document.createElement("div");
            friendBackupBtn.className = getElementByXpath('//*[@id="app-mount"]/div[2]/div/div[1]/div/div[2]/div/div[1]/div/div/main/section/div[1]/div[4]/div[6]').getAttribute("class");
            friendBackupBtn.textContent = "Friend Backup";
            friendBackupBtn.addEventListener("click", friendBackup);
            const friendBar = document.querySelector("#app-mount > div.appDevToolsWrapper-1QxdQf > div > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div.container-1eFtFS > div > div > main > section > div.children-3xh0VB > div.tabBar-ra-EuL.topPill-3DJJNV");
            friendBar.append(friendBackupBtn);

            BdApi.onRemoved(friendBackupBtn, () => {
                friendBar.append(friendBackupBtn);
            });
        }
    }

    getSettingsPanel() {
        refreshConfig()

        var directory = module.filename.split("/")
        directory = module.filename.replace(directory[directory.length - 1], "")

        const mySettingsPanel = document.createElement("div");
        mySettingsPanel.id = "my-settings";



        BdApi.injectCSS("FriendBackup", ``);

        BdApi.injectCSS("FriendBackup", `
        .text {
            color: white;
        }
        
        .selectFolderButton {
            padding-top: 10px;
            padding-bottom: 10px;
            padding-right: 20px;
            padding-left: 20px;
            border-radius: 3px;
            
            background: black;
            color: white;
            background-color: #5865F2;
        }
        .selectFolderButton:hover {
            padding-top: 10px;
            padding-bottom: 10px;
            padding-right: 20px;
            padding-left: 20px;
            border-radius: 3px;
            
            background: black;
            color: white;
            background-color: #4752C4;
        }
        
        .inputDiv {
            display:none;
        }
        `);

        const inputDiv = document.createElement("div");
        inputDiv.className = "inputDiv"

        const currentFolder = document.createElement("p")
        currentFolder.textContent = "Current folder: " + window.friends_backup_config.save_folder
        currentFolder.className = "text"

        const selectFolderBtn = document.createElement("button")
        selectFolderBtn.textContent = "Select folder"
        selectFolderBtn.className = "selectFolderButton"
        selectFolderBtn.addEventListener("click", () => {
            //BdApi.showConfirmationModal("Important", "Do to some limitations, the folder you select has to contain at least 1 file");
            BdApi.showConfirmationModal(
                "Important", "Do to some limitations, the folder you select has to contain at least 1 file",
                //<div/>,
                {
                    confirmText: "Select your folder",
                    cancelText: "Nevermind",
                    onConfirm: (() => {
                        inputDiv.innerHTML = "<input type=\"file\" id=\"folder-opener\" webkitdirectory />"
                        const input = document.getElementById('folder-opener')
                        input.addEventListener('change', function(event) {
                            if (event.target.files.length > 0) {
                                var folder = event.target.files[0].webkitRelativePath.split("/")[0]
                                folder = event.target.files[0].path.split(folder + "/")[0] + folder
                                window.friends_backup_config.save_folder = folder
                                fs.writeFile(`${directory}friends_backup.config.json`, JSON.stringify(window.friends_backup_config), (err) => {
                                    if (err) BDApi.error(err);
                                    console.log('Saved friends_backup.config.json!');
                                });
                                currentFolder.textContent = "Current folder: " + window.friends_backup_config.save_folder
                            }
                        });
                        input.click()
                    }),
                    onCancel: () => console.log("Pressed 'Nevermind' or escape")
                }
                );
        })

        const backupOnStartUpSetting = document.createElement("div");
        backupOnStartUpSetting.classList.add("setting");

        const space = document.createElement("br")

        const backupOnStartUpLabel = document.createElement("span")
        backupOnStartUpLabel.textContent = "Backup on start up?";
        backupOnStartUpLabel.className = "text";

        const backupOnStartUpInput = document.createElement("input");
        backupOnStartUpInput.type = "checkbox";
        if (window.friends_backup_config.backup_on_startup) {
            backupOnStartUpInput.checked = true;
        }
        backupOnStartUpInput.name = "backupOnStartUp";
        backupOnStartUpInput.addEventListener("click", () => {
            window.friends_backup_config.backup_on_startup = !window.friends_backup_config.backup_on_startup
            fs.writeFile(`${directory}friends_backup.config.json`, JSON.stringify(window.friends_backup_config), (err) => {
                if (err) BDApi.error(err);
                console.log('Saved friends_backup.config.json!');
            });
        })

        backupOnStartUpSetting.append(space, backupOnStartUpLabel, backupOnStartUpInput);

        mySettingsPanel.append(currentFolder, selectFolderBtn, backupOnStartUpSetting, inputDiv);

        return mySettingsPanel;
    }

    stop() {

    }
}
