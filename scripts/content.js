/*!
 * content.js
 * Alters the view of YouTube pages
 * according to current settings
 */

init();
async function init() {
    const settings = await getSettings();
    document.addEventListener('yt-navigate-finish', processPage(settings))
}

/* 
 * Applies settings to YT page
 * uses currying to pass the
 * settings variable to the 
 * event handler
 */
function processPage(settings) {
    return function process(e) {
        switch (document.location.pathname) {
            case "/":
                if (settings.blockHome) {
                    console.log("Removing Recommendations...");
                    document.getElementsByTagName('ytd-browse').item(0).style.display = "none";
                }
                if (settings.showUsageOnHome && !Chart.getChart('reportUsage')) {
                    let canvasNode = document.createElement("canvas");
                    canvasNode.setAttribute("id", "reportUsage");
                    canvasNode.setAttribute("style", "margin: 10px 20px 10px 20px");
                    document.getElementById("page-manager").insertAdjacentElement("afterbegin", canvasNode);
                    chartUsage();
                }
                break;
            case "/watch":
                if (settings.blockRelated) {
                    console.log("Removing related content...");
                    document.getElementById('secondary-inner').style.display = "none";
                }
                break;
            default:
                console.log("Nothing to alter...");
        }
    }
}