import {Api} from "./service/api";
import 'dotenv/config';
import {expect} from "@playwright/test";
import {faker} from "@faker-js/faker";

export class Utils{
    constructor() {
        this.todoPayload = {
            "title": `adil test${faker.number.int({max:9999999999999999})}`,
            "doneStatus": true,
            "description": ""
        }
    }

    async createTodos(guid, url, payload){
        const api = new Api();

        const response = await api.post(guid, url, payload || this.todoPayload);
        expect(response.status).toBe(201);
        return response;
    }
}