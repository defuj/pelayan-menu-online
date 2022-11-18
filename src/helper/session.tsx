import AccountModel from "../models/AccountModel";
import HistoryModel from "../models/HistoryModel";

const storageAvailable = (type : any) => {
    let storage : any;
    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

export const setAccount = (data : AccountModel) => {
    if (storageAvailable('localStorage')) {
        localStorage.setItem('account', JSON.stringify(data));
    }
}

export const getAccount = () => {
    if (storageAvailable('localStorage')) {
        return JSON.parse(localStorage.getItem('account') || null || '');
    }
    return null;
}

export const deleteAccount = () => {
    if (storageAvailable('localStorage')) {
        // localStorage.clear();
        localStorage.removeItem('account');
    }
}

export const setHistory = (data : HistoryModel[]) => {
    if (storageAvailable('localStorage')) {
        localStorage.setItem('history', JSON.stringify(data));
    }
}

export const getHistory = () : HistoryModel[] => {
    if (storageAvailable('localStorage')) {
        return localStorage.getItem('history') !== null ? JSON.parse(localStorage.getItem('history') || "null") : [];
    }
    return [];
}

export const checkDeffTime = (time1 : string, time2 : string) => {
    var date1 = new Date(time1);
    var date2 = new Date(time2);
    var diff = date2.getTime() - date1.getTime();
    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    return mm;
}

export const checkAccount = () => {
    if (storageAvailable('localStorage')) {
        if(localStorage.getItem('account') !== null){
            var user = getAccount();
            try {
                if(user.lasttime !== null && user.lasttime !== undefined){
                    var now = new Date().getTime();
                    var lasttime = user.lasttime;
                    var diff = now - lasttime;
                    var msec = diff;
                    var hh = Math.floor(msec / 1000 / 60 / 60);
                    msec -= hh * 1000 * 60 * 60;
                    var mm = Math.floor(msec / 1000 / 60);
    
                    if(mm < 15){
                        user.lasttime = now;
                        localStorage.setItem('account', JSON.stringify(user));
                        return true;
                    }else{
                        deleteAccount();
                        return false;
                    }
                }else{
                    const time = new Date().getTime();
                    const newUser = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        image: user.image,
                        lasttime: time
                    };
                    localStorage.setItem('account', JSON.stringify(newUser));
                    return true;
                }   
            } catch (error) {
                return false;
            }
        }
        return localStorage.getItem('account') !== null;
    }
    return false;
}
