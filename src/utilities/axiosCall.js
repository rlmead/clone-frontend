import axios from 'axios';

const postHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  }

export function axiosCall(method, url, func, data = {}, headers = postHeaders) {
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