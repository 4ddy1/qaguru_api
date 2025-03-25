import {Api} from "../service";

export class Challenges {
    constructor(){
        this.api = new Api();
    }

    async getChallenges(guid){
        return await this.api.get(guid, `${process.env.BASEURL}challenges`);
    }

    async getChallengesGuid(guid){
        return await this.api.get(guid, `${process.env.BASEURL}challenger/${guid}`);
    }

    async getChallengerDatabase(guid){
        return await this.api.get(guid, `${process.env.BASEURL}challenger/database/${guid}`);
    }

    async putChallengesGuid(guid, challengerJson){
        return await this.api.put(guid, `${process.env.BASEURL}challenger/${challengerJson.xChallenger}`, challengerJson);
    }

}