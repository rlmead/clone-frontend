import axios from "axios";

const defaultHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json; charset=utf-8"
}

// export function axiosCall(method, url, func, data = {}, headers = defaultHeaders, apiUrl = "http://localhost:8000") {
export function axiosCall(method, url, func, data = {}, headers = defaultHeaders, apiUrl = "https://cors-anywhere.herokuapp.com/https://iiddeeaa.herokuapp.com/") {
  return axios({
    method,
    url: apiUrl + url,
    data,
    headers
  })
    .then(response => func(response.data))
    .catch(error => {return error})
}