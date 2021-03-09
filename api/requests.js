const axios = require('axios');
const BASE_URL = require('../config').API_URL;

exports.getSpellInfo = function (spell) {
    const data = axios
        .get(`${BASE_URL}spells/${spell}`)
        .then(res => res.data)
        .catch(err => console.log(err.response.data));

    return data;
}
