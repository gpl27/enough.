/*!
 * Implements the settings
 * for popup.html and options.html
 */

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelectorAll('.switch').forEach((input) => {
    input.addEventListener('change', saveOption);
});
document.querySelector('#clear').addEventListener('click', clearData);
document.querySelector('#usage').addEventListener('click', openUsageReport);

/* Restores settings from storage.sync
 * from initial loading of popup/options.html
 */
async function restoreOptions() {
    const settings = await getSettings();
    document.querySelector('#advice').hidden = true;
    document.querySelectorAll('.switch').forEach((input) => {
        input.checked = settings[input.name];
    });
    await toggleDisable();
}

/* Saves setting to storage.sync */
async function saveOption(e) {
    let tmp = {};
    tmp[e.target.name] = e.target.checked;
    console.log("Saving Setting...");
    if (e.target.name === "trackUsage") {
        let msg = (e.target.checked) ? "ON" : "OFF";
        await browser.runtime.sendMessage(msg);
    }
    await browser.storage.sync.set(tmp);
    console.log("Saved!");
    document.querySelector('#advice').hidden = false;
    await toggleDisable();
}

/* Opens the Usage Report page */
async function openUsageReport() {
    await browser.tabs.create({
        url: "/views/usage.html"
    });
}

/* Implements settings logic */
async function toggleDisable() {
    // Disable Clear Data button if usageData is empty
    const usageData = await getUsageData();
    document.querySelector('#clear').disabled = (!usageData.length) ? true : false;

    // Other options
    if (!document.querySelector('#trackUsage').checked) {
        await browser.storage.sync.set({"showUsageOnHome": false})
        document.querySelector('#showUsageOnHome').checked = false;
        document.querySelector('#showUsageOnHome').disabled = true;
    } else if (!document.querySelector('#blockHome').checked) {
        await browser.storage.sync.set({"showUsageOnHome": false})
        document.querySelector('#showUsageOnHome').checked = false;
        document.querySelector('#showUsageOnHome').disabled = true;
    } else {
        document.querySelector('#showUsageOnHome').disabled = false;
    }
}
