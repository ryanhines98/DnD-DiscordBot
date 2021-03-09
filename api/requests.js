const axios = require('axios');
const BASE_URL = require('../config').API_URL;

module.exports = function getMonster(monster) {
    const data = axios
        .get(`${BASE_URL}monsters/${monster}`)
        .then(res => res.data)
        .catch(err => console.log(err.response.data));

    return data;
}
