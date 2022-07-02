/*!
 * background.js
 * Handles installation, updates, startup
 * YouTube time tracking
 */

browser.runtime.onInstalled.addListener(onInstall);
browser.runtime.onStartup.addListener(onStartup);
browser.windows.onRemoved.addListener(onClosing);
browser.runtime.onMessage.addListener(onTracking);

async function onInstall(details) {
    console.log(details);
    switch (details.reason) {
        case 'install':
            if (details.temporary) {
                await setDevSettings();
            } else {
                await setDefaultSettings();
                browser.runtime.openOptionsPage();
            }
            break;
        default:
            if (details.temporary) {
                await setDevSettings();
            }
    }
    const settings = await getSettings();
    if (settings.trackUsage) {
        await fillGaps();
        browser.tabs.onActivated.addListener(currTabListener);
    }
}

async function onStartup() {
    console.log("Starting up...");
    const settings = await getSettings();
    if (settings.trackUsage) {
        await fillGaps();
        browser.tabs.onActivated.addListener(currTabListener);
    }
}

async function onClosing() {
    await toggleTimer(false);
}

async function onTracking(message) {
    switch (message) {
        case "ON":
            await fillGaps();
            browser.tabs.onUpdated.addListener(currTabUpdtListener);
            browser.tabs.onActivated.addListener(currTabListener);
            break;
        case "OFF":
            await toggleTimer(false);
            browser.tabs.onUpdated.removeListener(currTabUpdtListener);
            browser.tabs.onActivated.removeListener(currTabListener);
            break;
        default:
            console.log("Unknown message: ", message);
    }
}

/* Applies the default settings */
async function setDefaultSettings() {
    await browser.storage.sync.set({
        "blockHome": true,
        "blockRelated": true,
        "trackUsage": false,
        "showUsageOnHome": false,
        "usageData": []
    });
    console.log("Default Settings Applied!");
}
/* Applies development settings */
async function setDevSettings() {
    await browser.storage.sync.set({
        "blockHome": true,
        "blockRelated": true,
        "trackUsage": true,
        "showUsageOnHome": true,
        "usageData": genDates(20, 7200, new Date("Fri Jul 01 2022"))
    });
    console.log("Development Settings Applied!");
}

/* Fills in gaps from not using YouTube one+ days */
async function fillGaps() {
    const usageData = await getUsageData();
    if (!usageData.length) {
        let tmp = {};
        tmp[new Date().toDateString()] = 0;
        await setUsageData([tmp]);
        return;
    }
    const lastEntryKey = Object.keys(usageData[usageData.length - 1])[0];
    if (lastEntryKey !== new Date().toDateString()) {
        const n = Math.floor((new Date().getTime() - new Date(lastEntryKey).getTime()) / (1000 * 3600 * 24));
        const newUsageData = usageData.concat(genDates(n, 0, new Date()));
        await setUsageData(newUsageData);
    }
}