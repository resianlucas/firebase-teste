import { Bling } from "./bling.js";

export class BaseClass extends Bling {
    buildQueryString(params) {
        var queryString = '';
        var usedKeys = {};
        for (var key in params) {
            if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== undefined && params[key] !== '') {
                var value = params[key];
                if (Array.isArray(value)) {
                    // Serialize array values with square brackets in the key
                    for (var i = 0; i < value.length; i++) {
                        if (!usedKeys.hasOwnProperty(key)) {
                            if (queryString.length > 0) {
                                queryString += '&';
                            }
                            queryString += encodeURIComponent(key) + '%5B%5D=' + encodeURIComponent(value[i]);
                            usedKeys[key] = true;
                        } else {
                            if (queryString.length > 0) {
                                queryString += '&';
                            }
                            queryString += encodeURIComponent(key) + '%5B%5D=' + encodeURIComponent(value[i]);
                        }
                    }
                } else {
                    // Handle non-array values
                    if (!usedKeys.hasOwnProperty(key)) {
                        if (queryString.length > 0) {
                            queryString += '&';
                        }
                        queryString += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                        usedKeys[key] = true;
                    }
                }
            }
        }
        return queryString;
    }
}

