// @ts-check
import { test, expect } from '@playwright/test';
import { BaseTest, Api } from "../src/service/index";
import {Builder} from "../src/helpers/builder";
import 'dotenv/config';
import { faker } from '@faker-js/faker';

test.describe.serial('has description', async () => {

    const baseTest = new BaseTest();
    const api = new Api();
    const utils = new Builder();
    let guid;

    test.beforeAll(async () => {
        const response = await baseTest.auth(`${process.env.BASEURL}challenger`);
        guid = response.guid;
    });

    test('GET /challenges',
        {tag: '@get'},
        async () => {
        const response = await api.get(guid, `${process.env.BASEURL}challenges`);
        const responseBody = await response.json(); // Парсим тело ответа в JSON

        if (responseBody.length !== 0){
            expect(responseBody.challenges[0]).toHaveProperty('id');
            expect(responseBody.challenges[0]).toHaveProperty('name');
            expect(responseBody.challenges[0]).toHaveProperty('description');
            expect(responseBody.challenges[0]).toHaveProperty('status');
        }
        expect(response.status).toBe(200);
        
    });

    test('GET /todos (200)',
        {tag: '@get'},
        async () => {
        const response = await api.get(guid, `${process.env.BASEURL}todos`);
        const responseBody = await response.json(); // Парсим тело ответа в JSON

        if (responseBody.length !== 0){
            expect(responseBody.todos[0]).toHaveProperty('id');
            expect(responseBody.todos[0]).toHaveProperty('title');
            expect(responseBody.todos[0]).toHaveProperty('doneStatus');
            expect(responseBody.todos[0]).toHaveProperty('description');
        }
        expect(response.status).toBe(200);
        
    });

    test('GET /todo (404) not plural',
        {tag: '@get'},
        async () => {
        const response = await api.get(guid, `${process.env.BASEURL}todo`);
        expect(response.status).toBe(404);
    });

    test('GET /todos/{id} (200)',
        {tag: '@get'},
        async () => {
        const todoId = await api.get(guid, `${process.env.BASEURL}todos`) // запрос тудушек
        const id = await todoId.json(); // парсинг в json
        await utils.createTodos(guid, `${process.env.BASEURL}todos`); // создать тудушку в done

        const response = await api.get(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`);
        const responseBody = await response.json(); // Парсим тело ответа в JSON

        if (responseBody.todos.length !== 0){
            expect(responseBody.todos[0]).toHaveProperty('id');
            expect(responseBody.todos[0]).toHaveProperty('title');
            expect(responseBody.todos[0]).toHaveProperty('doneStatus');
            expect(responseBody.todos[0]).toHaveProperty('description');
        }
        expect(response.status).toBe(200);
        
    });

    test('GET /todos/{id} (404)',
        {tag: '@get'},
        async () => {
        const response = await api.get(guid, `${process.env.BASEURL}todos/4dasd5`); // несуществующий id
        expect(response.status).toBe(404);
    });

    test('GET /todos (200) ?filter',
        {tag: '@get'},
        async () => {
        await utils.createTodos(guid, `${process.env.BASEURL}todos`); // создать тудушку в done

        const response = await api.get(guid, `${process.env.BASEURL}todos?doneStatus=true`);
        const responseBody = await response.json(); // Парсим тело ответа в JSON

        if (responseBody.todos.length !== 0){
            expect(responseBody.todos[0]).toHaveProperty('id');
            expect(responseBody.todos[0]).toHaveProperty('title');
            expect(responseBody.todos[0]).toHaveProperty('doneStatus');
            expect(responseBody.todos[0]).toHaveProperty('description');
        }
        expect(response.status).toBe(200);
        
    });

    test('HEAD /todos (200)',
        {tag: '@head'},
        async () => {
        const response = await api.head(guid, `${process.env.BASEURL}todos`);
        expect(response.status).toBe(200);
    });

    test('POST /todos (201)',
        {tag: '@post'},
        async () => {
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": true,
                "description": ""
            }
            const response = await api.post(guid, `${process.env.BASEURL}todos`, payload);
            const responseBody = await response.json(); // Парсим тело ответа в JSON

            expect(responseBody).toHaveProperty('id');
            expect(responseBody).toHaveProperty('title');
            expect(responseBody).toHaveProperty('doneStatus');
            expect(responseBody).toHaveProperty('description');
            expect(response.status).toBe(201);
            
        });

    test('POST /todos (400) doneStatus',
        {tag: '@post'},
        async () => {
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": 'adil',
                "description": ""
            }
            const response = await api.post(guid, `${process.env.BASEURL}todos`, payload);
            expect(response.status).toBe(400);
        });

    test('POST /todos (400) title too long',
        {tag: '@post'},
        async () => {
            const payload = {
                "title": `adil test${faker.string.sample(50)}`,
                "doneStatus": true,
                "description": ""
            }
            const response = await api.post(guid, `${process.env.BASEURL}todos`, payload);
            expect(response.status).toBe(400);
        });

    test('POST /todos (400) description too long',
        {tag: '@post'},
        async () => {
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": true,
                "description": `${faker.string.sample(500)}`
            }
            const response = await api.post(guid, `${process.env.BASEURL}todos`, payload);
            expect(response.status).toBe(400);
        });

    test('POST /todos (201) max out content',
        {tag: '@post'},
        async () => {
            const payload = {
                "title": `${faker.string.sample(50)}`,
                "doneStatus": true,
                "description": `${faker.string.sample(200)}`
            }
            const response = await api.post(guid, `${process.env.BASEURL}todos`, payload);
            const responseBody = await response.json(); // Парсим тело ответа в JSON

            expect(responseBody).toHaveProperty('id');
            expect(responseBody).toHaveProperty('title');
            expect(responseBody).toHaveProperty('doneStatus');
            expect(responseBody).toHaveProperty('description');
            expect(response.status).toBe(201);
            
        });

    test('POST /todos (413) content too long',
        {tag: '@post'},
        async () => {
            const payload = {
                "title": `${faker.string.sample(5000)}`,
                "doneStatus": true,
                "description": `${faker.string.sample(5000)}`
            }
            const response = await api.post(guid, `${process.env.BASEURL}todos`, payload);
            expect(response.status).toBe(413);
        });

    test('POST /todos (400) extra',
        {tag: '@post'},
        async () => {
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": true,
                "description": "",
                "priority": "extra"
            }
            const response = await api.post(guid, `${process.env.BASEURL}todos`, payload);
            expect(response.status).toBe(400);
        });

    test('PUT /todos/{id} (400)',
        {tag: '@put'},
        async () => {
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": true,
                "description": "",
            }

            const response = await api.put(guid, `${process.env.BASEURL}todos/00`, payload);
            expect(response.status).toBe(400);
        });

    test('POST /todos/{id} (200)',
        {tag: '@post'},
        async () => {
            const todoId = await api.get(guid, `${process.env.BASEURL}todos`) // запрос тудушек
            const id = await todoId.json(); // парсинг в json
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": true,
                "description": "",
            }
            const response = await api.post(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`, payload);
            const responseBody = await response.json(); // Парсим тело ответа в JSON

            expect(responseBody).toHaveProperty('id');
            expect(responseBody).toHaveProperty('title');
            expect(responseBody).toHaveProperty('doneStatus');
            expect(responseBody).toHaveProperty('description');
            expect(response.status).toBe(200);
            
        });

    test('POST /todos/{id} (404)',
        {tag: '@post'},
        async () => {
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": true,
                "description": "",
            }
            const response = await api.post(guid, `${process.env.BASEURL}todos/00`, payload);
            expect(response.status).toBe(404);
        });

    test('PUT /todos/{id} full (200)',
        {tag: '@put'},
        async () => {
            const todoId = await api.get(guid, `${process.env.BASEURL}todos`) // запрос тудушек
            const id = await todoId.json(); // парсинг в json
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": true,
                "description": "",
            }

            const response = await api.put(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`, payload);
            const responseBody = await response.json(); // Парсим тело ответа в JSON

            expect(responseBody).toHaveProperty('id');
            expect(responseBody).toHaveProperty('title');
            expect(responseBody).toHaveProperty('doneStatus');
            expect(responseBody).toHaveProperty('description');
            expect(response.status).toBe(200);
            
        });

    test('PUT /todos/{id} partial (200)',
        {tag: '@put'},
        async () => {
            const todoId = await api.get(guid, `${process.env.BASEURL}todos`) // запрос тудушек
            const id = await todoId.json(); // парсинг в json
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
            }

            const response = await api.put(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`, payload);
            const responseBody = await response.json(); // Парсим тело ответа в JSON

            expect(responseBody).toHaveProperty('id');
            expect(responseBody).toHaveProperty('title');
            expect(responseBody).toHaveProperty('doneStatus');
            expect(responseBody).toHaveProperty('description');
            expect(response.status).toBe(200);
            
        });

    test('PUT /todos/{id} no title (400)',
        {tag: '@put'},
        async () => {
            const todoId = await api.get(guid, `${process.env.BASEURL}todos`) // запрос тудушек
            const id = await todoId.json(); // парсинг в json
            const payload = {
                "doneStatus": true,
                "description": "",
            }

            const response = await api.put(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`, payload);
            expect(response.status).toBe(400);
        });

    test('PUT /todos/{id} no amend id (400)',
        {tag: '@put'},
        async () => {
            const todoId = await api.get(guid, `${process.env.BASEURL}todos`) // запрос тудушек
            const id = await todoId.json(); // парсинг в json
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": true,
                "description": "",
                "id": 10
            }

            const response = await api.put(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`, payload);
            expect(response.status).toBe(400);
        });

    test('DELETE /todos/{id} (200)',
        {tag: '@delete'},
        async () => {
            const todoId = await api.get(guid, `${process.env.BASEURL}todos`) // запрос тудушек
            const id = await todoId.json(); // парсинг в json

            const response = await api.delete(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`); // удалить
            expect(response.status).toBe(200);

            const getTodo = await api.get(guid, `${process.env.BASEURL}todos/${id.todos[0].id}`) // запросить для проверки удаления
            expect(getTodo.status).toBe(404)
        });

    test('OPTIONS /todos (200)',
        {tag: '@options'},
        async () => {
            const response = await api.options(guid, `${process.env.BASEURL}todos`);
            
            expect(response.status).toBe(200);
        });

    test('GET /todos (200) XML',
        {tag: '@get'},
        async () => {
            const response = await api.getXml(guid, `${process.env.BASEURL}todos`);
            expect(response.status).toBe(200);
            console.log(await response.text());
        });

    test('GET /todos (200) JSON',
        {tag: '@get'},
        async () => {
            const response = await api.getJson(guid, `${process.env.BASEURL}todos`);
            const responseBody = await response.json(); // Парсим тело ответа в JSON

            if (responseBody.todos.length !== 0){
                expect(responseBody.todos[0]).toHaveProperty('id');
                expect(responseBody.todos[0]).toHaveProperty('title');
                expect(responseBody.todos[0]).toHaveProperty('doneStatus');
                expect(responseBody.todos[0]).toHaveProperty('description');
            }
            expect(response.status).toBe(200);
            
        });

    test('GET /todos (200) ANY',
        {tag: '@get'},
        async () => {
            const response = await api.getAny(guid, `${process.env.BASEURL}todos`);
            expect(response.status).toBe(200);
            
        });

    test('GET /todos (200) XML pref',
        {tag: '@get'},
        async () => {
            const response = await api.getXmlPref(guid, `${process.env.BASEURL}todos`);
            expect(response.status).toBe(200);
            console.log(await response.text());
        });

    test('GET /todos (200) no accept',
        {tag: '@get'},
        async () => {
            const response = await api.get(guid, `${process.env.BASEURL}todos`);
            expect(response.status).toBe(200);
            
        });

    test('GET /todos (406)',
        {tag: '@get'},
        async () => {
            const response = await api.getGzip(guid, `${process.env.BASEURL}todos`);
            expect(response.status).toBe(406);
            
        });

    test('POST /todos XML',
        {tag: '@post'},
        async () => {
            const payload =
                `<doneStatus>true</doneStatus>
                <description/>
                <title>adil test${faker.number.int({max: 9999999999999999})}</title>`

            const response = await api.postXml(guid, `${process.env.BASEURL}todos`, payload);
            console.log(await response.text());
            expect(response.status).toBe(201);
        });

    test('POST /todos JSON',
        {tag: '@post'},
        async () => {
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": true,
                "description": "",
            }

            const response = await api.postJson(guid, `${process.env.BASEURL}todos`, payload);
            
            expect(response.status).toBe(201);
        });

    test('POST /todos (415)',
        {tag: '@post'},
        async () => {
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": true,
                "description": "",
            }

            const response = await api.postGzip(guid, `${process.env.BASEURL}todos`, payload);
            
            expect(response.status).toBe(415);
        });

    test('GET /challenger/guid (existing X-CHALLENGER)',
        {tag: '@get'},
        async () => {
            const response = await api.get(guid, `${process.env.BASEURL}challenger/${guid}`);
            expect(response.status).toBe(200);
            
        });

    test('PUT /challenger/guid RESTORE',
        {tag: '@put'},
        async () => {
            const challengerResponse = await api.get(guid, `${process.env.BASEURL}challenger/${guid}`);
            const challengerJson = await challengerResponse.json();

            const response = await api.put(guid, `${process.env.BASEURL}challenger/${challengerJson.xChallenger}`, challengerJson);
            
            expect(response.status).toBe(200);
        });

    test('GET /challenger/database/guid (200)',
        {tag: '@get'},
        async () => {
            const response = await api.get(guid, `${process.env.BASEURL}challenger/database/${guid}`);
            expect(response.status).toBe(200);
        });

    test('POST /todos XML to JSON',
        {tag: '@post'},
        async () => {
            const payload =
                `<doneStatus>true</doneStatus>
                <description/>
                <title>adil test${faker.number.int({max: 9999999999999999})}</title>`

            const response = await api.postXmlToJson(guid, `${process.env.BASEURL}todos`, payload);
            expect(response.status).toBe(201);
        });

    test('POST /todos JSON to XML',
        {tag: '@post'},
        async () => {
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": true,
                "description": ""
            }
            const response = await api.postJsonToXml(guid, `${process.env.BASEURL}todos`, payload);
            expect(response.status).toBe(201);
        });

    test('DELETE /heartbeat (405)',
        {tag: '@delete'},
        async () => {
            const response = await api.delete(guid, `${process.env.BASEURL}heartbeat`);
            expect(response.status).toBe(405);
        });

    test('PATCH /heartbeat (500)',
        {tag: '@patch'},
        async () => {
            const response = await api.patch(guid, `${process.env.BASEURL}heartbeat`);
            expect(response.status).toBe(500);
        });

    test('GET /heartbeat (204)',
        {tag: '@get'},
        async () => {
            const response = await api.get(guid, `${process.env.BASEURL}heartbeat`);
            expect(response.status).toBe(204);
        });
})