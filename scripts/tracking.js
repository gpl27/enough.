/*!
 * Implements YouTube time tracking
 */

var startTime = null;

async function currTabListener(activeInfo) {
    browser.tabs.onUpdated.removeListener(currTabUpdtListener);
    const currTab = await browser.tabs.get(activeInfo.tabId);
    browser.tabs.onUpdated.addListener(currTabUpdtListener, {
        properties: ["url"],
        tabId: currTab.id
    })
    const state = (currTab.url.includes('.youtube.')) ? true : false;
    await toggleTimer(state);
}

async function currTabUpdtListener(tabId, changeInfo, tab) {
    const state = (tab.url.includes('.youtube.')) ? true : false;
    await toggleTimer(state);
}

async function toggleTimer(state) {
    console.log("On YT?", state);
    if (state && !startTime) {
        startTime = Date.now();
    } else if (state){
        if (Date.now() - startTime > (5 * 60 * 1000)) {
            await saveTime();
            startTime = Date.now();
        }
    } else {
        if (startTime !== null) {
            await saveTime();
            startTime = null;
        }
    }
}

async function saveTime() {
    let timeSpent = Math.round((Date.now() - startTime) / 1000);
    const usgData = await getUsageData();
    let newUsgData = [];
    let tmp = {};
    const key = new Date().toDateString();
    tmp[key] = timeSpent;

    if (usgData.length && Object.hasOwn(usgData[usgData.length - 1], key)) {
        tmp[key] += usgData[usgData.length - 1][key]
        newUsgData = usgData.slice(0, usgData.length - 1)
                                    .concat(tmp);
    } else {
        newUsgData = usgData.concat(tmp);
    }

    console.log("Saving time entry...");
    await setUsageData(newUsgData);
    console.log("Saved!");
    console.log(`You spent ${timeSpent}s on the last YT Session`);
}