import axios from 'axios';

export function axiosCall(method, url, data, headers, func) {
    const apiUrl='http://localhost:8000';
    return axios({
        method,
        url: apiUrl + url,
        data,
        headers
    })
    .then(response => func(response.data))
    .catch(error => console.log(error))
}