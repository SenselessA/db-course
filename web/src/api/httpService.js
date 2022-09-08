const axios = require("axios");

export const httpService = axios.create({
    baseURL: 'http://localhost:5000/',
    timeout: 2000,
});