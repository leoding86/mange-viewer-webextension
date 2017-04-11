import Message from './modules/Message';
import SubscribeParser from 'modules/SubscribeParser';
import Subscribe from './models/Subscribe';

const msg = new Message();
const subscribe = new Subscribe();
const subscribeParser = new SubscribeParser();
let subscribeParserInstances = {};
let syncing = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'sync_now':
            processes.syncNow();
            break;
        default:
            throw('Unkown message type');
    }
});

let subscribeInfos = [];
let updatedSubscribeInfos = [];
let progressCounter = 0;
let subscribeCount = 0;

const processes = {

    syncNow: function () {
        if (syncing) {
            msg.type = 'syncing', msg.msg = null;
            chrome.runtime.sendMessage(msg);
        } else {
            syncing = true;
            subscribe.init().then((infos) => {
                subscribeInfos = infos; // store subscribe infos
                updatedSubscribeInfos = [];
                progressCounter = 0;
                subscribeCount = subscribeInfos.length;
                this.startSync();
            });
        }
    },

    startSync () {
        if (subscribeInfos.length > 0) {
            let subscribeInfo = subscribeInfos.shift(); // Pick one subscribe info
            subscribeParser.getParser(subscribeInfo.parserName).then((parserInstance) => {
                msg.type = 'sync_progress', msg.msg = (++progressCounter) + ' / ' + subscribeCount;
                chrome.runtime.sendMessage(msg); // send progress message
                parserInstance.id = subscribeInfo.mangaId; // set id !important!

                parserInstance.sync().then((info) => {
                    updatedSubscribeInfos.push(info);

                    msg.type = 'sync_complete', msg.msg = info;
                    chrome.runtime.sendMessage(msg);
                    this.startSync(); // When current sync task done, start next
                });
            }).catch(() => {
                msg.type = 'sync_error', msg.msg = subscribeInfo;
                chrome.runtime.sendMessage(msg);
            });
        } else {
            if (updatedSubscribeInfos.length > 0) {
                /* restore subscribe infos */
                subscribe.update(updatedSubscribeInfos).then(() => {
                    msg.type = 'sync_done', msg.msg = null;
                    chrome.runtime.sendMessage(msg);
                }).catch((err) => {
                    msg.type = 'sync_error', msg.msg = err;
                    chrome.runtime.sendMessage(msg);
                });
            }

            msg.type = 'sync_finished', msg.msg = null;
            chrome.runtime.sendMessage(msg);
            syncing = false;
        }
    }
}


let autoSync = setInterval(() => {
    processes.syncNow();
}, 7200 * 1000);