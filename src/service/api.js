export class Api{
    constructor() {
    }

    async get(guid, url){
        const response = fetch(url, {
            method: 'GET',
            headers: {
                'X-CHALLENGER': guid,
                'Accept': ''
            },
            body: null
        })
        return response;
    }

    async getXml(guid, url){
        const response = fetch(url, {
            method: 'GET',
            headers: {
                'X-CHALLENGER': guid,
                'Accept': 'application/xml'
            },
            body: null
        })
        return response;
    }

    async getXmlPref(guid, url){
        const response = fetch(url, {
            method: 'GET',
            headers: {
                'X-CHALLENGER': guid,
                'Accept': 'application/xml, application/json'
            },
            body: null
        })
        return response;
    }

    async getJson(guid, url){
        const response = fetch(url, {
            method: 'GET',
            headers: {
                'X-CHALLENGER': guid,
                'Accept': 'application/json'
            },
            body: null
        })
        return response;
    }

    async getAny(guid, url){
        const response = fetch(url, {
            method: 'GET',
            headers: {
                'X-CHALLENGER': guid,
                'Accept': '*/*'
            },
            body: null
        })
        return response;
    }

    async getGzip(guid, url){
        const response = fetch(url, {
            method: 'GET',
            headers: {
                'X-CHALLENGER': guid,
                'Accept': 'application/gzip'
            },
            body: null
        })
        return response;
    }

    async head(guid, url){
        const response = fetch(url, {
            method: 'HEAD',
            headers: {
                'X-CHALLENGER': guid
            },
            body: null
        })
        return response;
    }

    async post(guid, url, payload){
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-CHALLENGER': guid,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        return response;
    }

    async postGuid(url){ // метод для запроса гуид
        return await fetch(url, {
            method: 'POST'
        })
    }

    async postXml(guid, url, payload){
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-CHALLENGER': guid,
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            },
            body: JSON.stringify(payload)
        })
        return response;
    }

    async postJson(guid, url, payload){
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-CHALLENGER': guid,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        return response;
    }

    async postXmlToJson(guid, url, payload){
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-CHALLENGER': guid,
                'Content-Type': 'application/xml',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        return response;
    }

    async postJsonToXml(guid, url, payload){
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-CHALLENGER': guid,
                'Content-Type': 'application/json',
                'Accept': 'application/xml'
            },
            body: JSON.stringify(payload)
        })
        return response;
    }

    async postGzip(guid, url, payload){
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-CHALLENGER': guid,
                'Content-Type': 'bob',
                'Accept': '*/*'
            },
            body: JSON.stringify(payload)
        })
        return response;
    }

    async put(guid, url, payload){
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'X-CHALLENGER': guid,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload) || null
        })
        return response;
    }

    async delete(guid, url){
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'X-CHALLENGER': guid,
            },
            body: null
        })
        return response;
    }

    async options(guid, url){
        const response = await fetch(url, {
            method: 'OPTIONS',
            headers: {
                'X-CHALLENGER': guid,
            },
            body: null
        })
        return response;
    }

    async patch(guid, url){
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'X-CHALLENGER': guid,
            },
            body: null
        })
        return response;
    }

    async trace(guid, url){
        const response = await fetch(url, {
            method: 'TRACE',
            headers: {
                'X-CHALLENGER': guid,
            },
            body: null
        })
        return response;
    }
}