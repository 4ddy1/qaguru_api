import { Api } from "./index";

export class BaseTest{
    constructor(){}

    async auth(url){
        const api = new Api();

        const response = await api.postGuid(url);
        const guid = (await response).headers.get('x-challenger')
        console.log(guid);

        return {status: (await response).status, guid: guid};
    }
}

