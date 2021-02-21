'use strict';


/*
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(typeof message);
    if(typeof message === 'object' && message.type === 'showPageAction') {
        chrome.pageAction.show(sender.tab.id);
    }
});
*/
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.insertCSS(tab.id, {file: "game/game.css"});
   chrome.tabs.insertCSS(tab.id, {file: "styles.css"});
   chrome.tabs.executeScript({file: "game.js"});
   //console.log("HEREE222");
 });

// chrome.runtime.sendMessage({type: "showPageAction"});
