import axios from "axios";
// import BrowserInfo from "browser-info";
const { detect } = require('detect-browser');
const browser = detect();

const transport = axios.create({ withCredentials: true });

// New axios methods, all methods should be migrated to axios
export const getDetails = async (url, accessToken,level,ObjID,detail,headers) => new Promise((resolve, reject) => {
    transport.get(url,{
        params: detail,
        headers: {
            "Authorization": `Bearer ${ accessToken}`,
            "content-type": "application/json",
            "Level": level,
            "Objid": ObjID,
            "operating-system" : browser.os,
            "Browser" : browser.name,
            ...headers
        }
    }).then((response) => {
        resolve(response.data);
    })
        .catch((error) => {
            reject(error);
        });
});

export const createDetails = async (url, accessToken,level,ObjID,detail, headers) => new Promise((resolve, reject) => {
    transport.post(url, detail, {
        headers: {
            "Authorization": `Bearer ${ accessToken}`,
            "content-type": "application/json",
            "Level": level,
            "Objid": ObjID,
            "operating-system" : browser.os,
            "Browser" : browser.name,
            ...headers
        },
        withCredentials: true
    }).then((response) => {
        resolve(response.data);
    })
        .catch((error) => {
            reject(error);
        });
});

export const updateDetails = async (url, accessToken, detail, headers) => new Promise((resolve, reject) => {
    transport.put(url, detail, {
        headers: {
            "Authorization": `Bearer ${ accessToken}`,
            "content-type": "application/json",
            ...headers,
        }
    }).then((respone) => {
        resolve(respone.data);
    })
        .catch((error) => {
            reject(error);
        });
});

export const deleteDetails = async (url, accessToken,level,ObjId, detail, headers) => new Promise((resolve, reject) => {
    transport.delete(url, {
        data: detail,
        headers: {
            "Authorization": `Bearer ${ accessToken}`,
            "content-type": "application/json",
            "Level" : level,
            "Objid" : ObjId,
            ...headers,
        }
    }).then((respone) => {
        resolve(respone.data);
    })
        .catch((error) => {
            reject(error);
        });
});
