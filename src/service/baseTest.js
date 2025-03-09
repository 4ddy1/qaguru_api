export class BaseTest{
    constructor(){}

    async auth(url){
        const response = fetch(url, {
            method: 'POST',
            /*headers: {
                'Content-Type': 'X-CHALLENGER'
            },
            body: null*/
        })
        const guid = (await response).headers.get('x-challenger')
        console.log(guid);

        return {status: (await response).status, guid: guid};
    }
}

