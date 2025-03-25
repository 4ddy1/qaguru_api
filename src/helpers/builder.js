import {Api} from "../service/api";
import 'dotenv/config';
import {faker} from "@faker-js/faker";

export class Builder {
    constructor() {
        this.todoPayload = {
            "title": `adil test${faker.number.int({max:9999999999999999})}`,
            "doneStatus": true,
            "description": ""
        }
    }

    async createTodos(guid, payload){
        const api = new Api();

        return await api.post(guid, `${process.env.BASEURL}todos`, payload || this.todoPayload);
    }
}