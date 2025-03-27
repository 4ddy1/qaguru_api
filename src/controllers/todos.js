import {Api} from "../service";
import {faker} from "@faker-js/faker";

export class Todos {
    constructor(){
        this.api = new Api();
        this.todo = {
            "title": `adil test${faker.number.int({max:9999999999999999})}`,
            "doneStatus": true,
            "description": ""
        }
    }

    async getTodos(guid){
        return await this.api.get(guid, `${process.env.BASEURL}todos`);
    }

    async getTodosXml(guid){
        return await this.api.getXml(guid, `${process.env.BASEURL}todos`);
    }

    async getTodosXmlPref(guid){
        return await this.api.getXmlPref(guid, `${process.env.BASEURL}todos`);
    }

    async getTodosJson(guid){
        return await this.api.getJson(guid, `${process.env.BASEURL}todos`);
    }

    async getTodosAny(guid){
        return await this.api.getAny(guid, `${process.env.BASEURL}todos`);
    }

    async getTodosGzip(guid){
        return await this.api.getGzip(guid, `${process.env.BASEURL}todos`);
    }

    async getTodosDone(guid){
        return await this.api.get(guid, `${process.env.BASEURL}todos?doneStatus=true`);
    }

    async getTodo(guid){
        return await this.api.get(guid, `${process.env.BASEURL}todo`);
    }

    async getTodosId(guid, id){
        return await this.api.get(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`);
    }

    async getTodosInvalidId(guid){
        return await this.api.get(guid, `${process.env.BASEURL}todos/4dasd5`);
    }

    async headTodos(guid){
        return await this.api.head(guid, `${process.env.BASEURL}todos`);
    }

    async postTodos(guid, payload){
        return await this.api.post(guid, `${process.env.BASEURL}todos`, payload || this.todo);
    }

    async postTodosXml(guid, payload){
        return await this.api.postXml(guid, `${process.env.BASEURL}todos`, payload);
    }

    async postTodosJson(guid, payload){
        return await this.api.postJson(guid, `${process.env.BASEURL}todos`, payload);
    }

    async postTodosGzip(guid, payload){
        return await this.api.postGzip(guid, `${process.env.BASEURL}todos`, payload);
    }

    async postTodosXmlToJson(guid, payload){
        return await this.api.postXmlToJson(guid, `${process.env.BASEURL}todos`, payload);
    }

    async postTodosJsonToXml(guid, payload){
        return await this.api.postJsonToXml(guid, `${process.env.BASEURL}todos`, payload);
    }

    async postTodosId(guid, id, payload){
        return await this.api.post(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`, payload || this.todo);
    }

    async postTodosInvalidId(guid, id, payload){
        return await this.api.post(guid, `${process.env.BASEURL}todos/00`, payload || this.todo);
    }

    async putTodos(guid, payload){
        return await this.api.put(guid, `${process.env.BASEURL}todos/00`, payload || this.todo);
    }

    async putTodosId(guid, id, payload){
        return await this.api.put(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`, payload || this.todo);
    }

    async deleteTodosId(guid, id){
        return await this.api.delete(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`);
    }

    async optionsTodos(guid){
        return await this.api.options(guid, `${process.env.BASEURL}todos`);
    }
}