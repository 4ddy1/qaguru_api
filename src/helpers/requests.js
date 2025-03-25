import {Api} from "../service";

export class Requests{
    constructor(){
        this.api = new Api();
    }

    async getChallenges(guid){
        return await this.api.get(guid, `${process.env.BASEURL}challenges`);
    }

    async getTodos(guid){
        return await this.api.get(guid, `${process.env.BASEURL}todos`);
    }

    async getTodo(guid){
        return await this.api.get(guid, `${process.env.BASEURL}todo`);
    }

    async getTodosId(guid){
        return await this.api.get(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`);
    }
}