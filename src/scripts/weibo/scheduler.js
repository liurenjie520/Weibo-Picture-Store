/*
 * Copyright (c) 2018 The Weibo-Picture-Store Authors. All rights reserved.
 * Use of this source code is governed by a MIT-style license that can be
 * found in the LICENSE file.
 */

import {Utils} from "../sharre/utils.js";
import {requestSignIn} from "./author.js";

const authorAlarmName = `author_alarm_${Utils.randomString(6)}`;
const periodInMinutes = 3 * 60; // 3h

/**
 * @desc alarms' callback
 */
function alarmCallback(alarm) {
    if (alarm.name === authorAlarmName) {
        requestSignIn(false)
            .catch(Utils.noop);
    }
}

/**
 * @public
 */
export function startUserStatusSchedule() {
    if (chrome.alarms.onAlarm.hasListener(alarmCallback)) {
        chrome.alarms.onAlarm.removeListener(alarmCallback);
    }
    chrome.alarms.onAlarm.addListener(alarmCallback);
    chrome.alarms.create(authorAlarmName, {periodInMinutes});
    console.log("Started: scheduler");
}

/**
 * @public
 */
export function closeUserStatusSchedule() {
    if (chrome.alarms.onAlarm.hasListener(alarmCallback)) {
        chrome.alarms.onAlarm.removeListener(alarmCallback);
    }
    chrome.alarms.clear(authorAlarmName, wasCleared => {
        if (!wasCleared) {
            console.warn("The alarm has not been cleared");
        } else {
            console.log("Closed: scheduler");
        }
    });
}