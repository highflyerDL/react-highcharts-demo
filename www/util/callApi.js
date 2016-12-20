import fetch from 'isomorphic-fetch';

const api_url = "https://wu7okcxesg.execute-api.eu-west-1.amazonaws.com/prod/temperature";

function callJsonApi(api, body, method = "get") {
    return fetch(api_url + api, {
            headers: { 'content-type': 'application/json', 'x-api-key': "hackweekhackweekhackweek" },
            method,
            body: JSON.stringify(body)
        })
        .then(response => response.json().then(json => ({ json, response })))
        .then(({ json, response }) => {
            if (!response.ok) {
                return Promise.reject(json);
            }

            return json;
        });
}

function callQueryParamsApi(api, params, method = "get") {
    var keys = Object.keys(params);
    var paramsObject = {};
    keys.map((key) => {
        if (params[key] != null) {
            paramsObject[key] = params[key];
        }
    });
    keys = Object.keys(paramsObject);
    var esc = encodeURIComponent;
    if (keys.length > 0) {
        var query = keys
            .map(k => esc(k) + '=' + esc(paramsObject[k]))
            .join('&');
        api += "?" + query;
    }
    return fetch(api_url + api, {
            headers: {'x-api-key': "hackweekhackweekhackweek"},
            method
        })
        .then(response => response.json().then(json => ({ json, response })))
        .then(({ json, response }) => {
            if (!response.ok) {
                return Promise.reject(json);
            }

            return json;
        });
}

function callFormDataApi(api, body, method = "get") {
    return fetch(api_url + api, {
            headers: {
                "Authorization": getItemLocalStorage("token")
            },
            method,
            body: body
        })
        .then(response => response.json().then(json => ({ json, response })))
        .then(({ json, response }) => {
            if (!response.ok) {
                return Promise.reject(json);
            }

            return json;
        });
}

export { callJsonApi, callQueryParamsApi, callFormDataApi, api_url };