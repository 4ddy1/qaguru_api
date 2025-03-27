import {Api} from "../service";

export class Heartbeats {
    constructor(){
        this.api = new Api();
    }

    async getHeartbeats(guid){
        return await this.api.get(guid, `${process.env.BASEURL}heartbeat`);
    }

    async patchHeartbeats(guid){
        return await this.api.patch(guid, `${process.env.BASEURL}heartbeat`);
    }

    async deleteHeartbeats(guid){
        return await this.api.delete(guid, `${process.env.BASEURL}heartbeat`);
    }

}