export const safeString = (content : String) : String => {
    return content.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export const slugify = (str : String) : String =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const searchQuery = (str : String) : String =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '+')
    .replace(/^-+|-+$/g, '');

export const getNumberInFirstString = (str : String) : String => {
    return str.replace(/(^\d+)(.+$)/i,'$1');
}

export const imageUrlToBase64 = async (url : String, callback : any) => {
    const axios = require('axios');
    await axios.get(url, {
        mode : 'no-cors',
        responseType: 'arraybuffer',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    })
    .then((response:any) => {
        let raw = Buffer.from(response.data).toString('base64');
        let base64 = `data:${response.headers["content-type"]};base64,${raw}`;
        callback(base64);
    })
    .catch(() => callback('https://img.kpopmap.com/2018/07/mbc-rebel.jpg'));
}

export const validateEmail = (email : String) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex);
}

export const validatePhone = (phone : String) : any => {
    var validRegex = /^[0-9]*$/; // without +
    var validRegex2 = /^\+[0-9]*$/; // with +
    return phone.match(validRegex) || phone.match(validRegex2);
}

export const formatMoney = (money : Number) : String => {
    return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const getNumber = (str : String) : Number => {
    return Number(str.replace(/[^0-9]/g, ''));
}