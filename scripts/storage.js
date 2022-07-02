/*!
 * storage.js
 * Handles operations to
 * storage.sync
 */

/* 
 * Get settings from storage.sync
 */
async function getSettings() {
    const blockHome = await browser.storage.sync.get('blockHome');
    const blockRelated = await browser.storage.sync.get('blockRelated');
    const trackUsage = await browser.storage.sync.get('trackUsage');
    const showUsageOnHome = await browser.storage.sync.get('showUsageOnHome');
    const settings = {
        "blockHome": blockHome.blockHome,
        "blockRelated": blockRelated.blockRelated,
        "trackUsage": trackUsage.trackUsage,
        "showUsageOnHome": showUsageOnHome.showUsageOnHome
    }
    return settings;
}

/* Get usageData array from storage.sync */
async function getUsageData() {
    const usageData = await browser.storage.sync.get('usageData');
    return usageData.usageData;
}

/* Set usageData array on storage.sync */
async function setUsageData(newUsageData) {
    await browser.storage.sync.set({"usageData": newUsageData});
}

/* Clears usageData array from storage.sync */
async function clearData() {
    console.log("Clearing data...");
    await browser.storage.sync.set({"usageData": []});
    console.log("Data cleared");
    toggleDisable();
}

/* Generates sample usageData array */
function genDates(n, timeLimit, start) {
    let sample = [];
    let startDate = new Date(start);
    for (let i = 0; i < n; i++) {
        let tmp = {};
        tmp[startDate.toDateString()] = (timeLimit !== null) ? Math.floor(Math.random() * timeLimit) : null;
        sample.unshift(tmp);
        startDate.setDate(startDate.getDate() - 1);
    }
    return sample;
}