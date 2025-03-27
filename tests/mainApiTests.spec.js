// @ts-check
import { test, expect } from '@playwright/test';
import { BaseTest, Api } from "../src/service/index";
import { Builder } from "../src/helpers/index";
import { Challenges, Todos, Heartbeats } from "../src/controllers/index";
import 'dotenv/config';
import { faker } from '@faker-js/faker';
import {todo} from "node:test";

test.describe.serial('has description', async () => {

    const baseTest = new BaseTest();
    const api = new Api();
    const utils = new Builder();
    const todos = new Todos();
    const challenges = new Challenges();
    const heartbeats = new Heartbeats();
    let guid;

    test.beforeAll(async () => {
        const response = await baseTest.auth(`${process.env.BASEURL}challenger`);
        guid = response.guid;
    });

    test('GET /challenges',
        {tag: '@get'},
        async () => {
        const response = await challenges.getChallenges(guid);
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
        const response = await todos.getTodos(guid);
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
        const response = await todos.getTodo(guid);
        expect(response.status).toBe(404);
    });

    test('GET /todos/{id} (200)',
        {tag: '@get'},
        async () => {
        const todoId = await todos.getTodos(guid); // запрос тудушек
        const id = await todoId.json(); // парсинг в json
        await utils.createTodos(guid); // создать тудушку в done

        const response = await todos.getTodosId(guid, id);
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
        const response = await todos.getTodosInvalidId(guid); // несуществующий id
        expect(response.status).toBe(404);
    });

    test('GET /todos (200) ?filter',
        {tag: '@get'},
        async () => {
        await utils.createTodos(guid); // создать тудушку в done

        const response = await todos.getTodosDone();
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
        const response = await todos.headTodos(guid);
        expect(response.status).toBe(200);
    });

    test('POST /todos (201)',
        {tag: '@post'},
        async () => {
            const response = await todos.postTodos(guid);
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
            const response = await todos.postTodos(guid, payload);
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
            const response = await todos.postTodos(guid, payload);
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
            const response = await todos.postTodos(guid, payload);
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
            const response = await todos.postTodos(guid, payload);
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
            const response = await todos.postTodos(guid, payload);
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
            const response = await todos.postTodos(guid, payload);
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

            const response = await todos.putTodos(guid, payload);
            expect(response.status).toBe(400);
        });

    test('POST /todos/{id} (200)',
        {tag: '@post'},
        async () => {
            const todoId = await todos.getTodos(); // запрос тудушек
            const id = await todoId.json(); // парсинг в json

            const response = await todos.postTodosId(guid, id);
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

            const response = await todos.postTodosInvalidId(guid);
            expect(response.status).toBe(404);
        });

    test('PUT /todos/{id} full (200)',
        {tag: '@put'},
        async () => {
            const todoId = await todos.getTodos(); // запрос тудушек
            const id = await todoId.json(); // парсинг в json

            const response = await todos.putTodosId(guid, id);
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
            const todoId = await todos.getTodos(); // запрос тудушек
            const id = await todoId.json(); // парсинг в json
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
            }

            const response = await todos.putTodosId(guid, id, payload);
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
            const todoId = await todos.getTodos(); // запрос тудушек
            const id = await todoId.json(); // парсинг в json
            const payload = {
                "doneStatus": true,
                "description": "",
            }

            const response = await todos.putTodosId(guid, id, payload);
            expect(response.status).toBe(400);
        });

    test('PUT /todos/{id} no amend id (400)',
        {tag: '@put'},
        async () => {
            const todoId = await todos.getTodos(); // запрос тудушек
            const id = await todoId.json(); // парсинг в json
            const payload = {
                "title": `adil test${faker.number.int({max:9999999999999999})}`,
                "doneStatus": true,
                "description": "",
                "id": 10
            }

            const response = await todos.putTodosId(guid, id, payload);
            expect(response.status).toBe(400);
        });

    test('DELETE /todos/{id} (200)',
        {tag: '@delete'},
        async () => {
            const todoId = await todos.getTodos(); // запрос тудушек
            const id = await todoId.json(); // парсинг в json

            const response = await todos.deleteTodosId(guid, id); // удалить
            expect(response.status).toBe(200);

            const getTodo = await todos.getTodosId(guid, id); // запросить для проверки удаления
            expect(getTodo.status).toBe(404)
        });

    test('OPTIONS /todos (200)',
        {tag: '@options'},
        async () => {
            const response = await todos.optionsTodos(guid);
            
            expect(response.status).toBe(200);
        });

    test('GET /todos (200) XML',
        {tag: '@get'},
        async () => {
            const response = await todos.getTodosXml(guid);
            expect(response.status).toBe(200);
            console.log(await response.text());
        });

    test('GET /todos (200) JSON',
        {tag: '@get'},
        async () => {
            const response = await todos.getTodosJson(guid);
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
            const response = await todos.getTodosAny(guid);
            expect(response.status).toBe(200);
            
        });

    test('GET /todos (200) XML pref',
        {tag: '@get'},
        async () => {
            const response = await todos.getTodosXmlPref(guid);
            expect(response.status).toBe(200);
            console.log(await response.text());
        });

    test('GET /todos (200) no accept',
        {tag: '@get'},
        async () => {
            const response = await todos.getTodos(guid);
            expect(response.status).toBe(200);
            
        });

    test('GET /todos (406)',
        {tag: '@get'},
        async () => {
            const response = await todos.getTodosGzip(guid);
            expect(response.status).toBe(406);
            
        });

    test('POST /todos XML',
        {tag: '@post'},
        async () => {
            const payload =
                `<doneStatus>true</doneStatus>
                <description/>
                <title>adil test${faker.number.int({max: 9999999999999999})}</title>`

            const response = await todos.postTodosXml(guid, payload);
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

            const response = await todos.postTodosJson(guid, payload);
            
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

            const response = await todos.postTodosGzip(guid, payload);
            
            expect(response.status).toBe(415);
        });

    test('GET /challenger/guid (existing X-CHALLENGER)',
        {tag: '@get'},
        async () => {
            const response = await challenges.getChallengesGuid(guid)
            expect(response.status).toBe(200);
            
        });

    test('PUT /challenger/guid RESTORE',
        {tag: '@put'},
        async () => {
            const challengerResponse = await challenges.getChallengesGuid(guid)
            const challengerJson = await challengerResponse.json();

            const response = await challenges.putChallengesGuid(guid, challengerJson);
            
            expect(response.status).toBe(200);
        });

    test('GET /challenger/database/guid (200)',
        {tag: '@get'},
        async () => {
            const response = await challenges.getChallengerDatabase(guid)
            expect(response.status).toBe(200);
        });

    test('POST /todos XML to JSON',
        {tag: '@post'},
        async () => {
            const payload =
                `<doneStatus>true</doneStatus>
                <description/>
                <title>adil test${faker.number.int({max: 9999999999999999})}</title>`

            const response = await todos.postTodosXmlToJson(guid, payload);
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
            const response = await todos.postTodosJsonToXml(guid, payload);
            expect(response.status).toBe(201);
        });

    test('DELETE /heartbeat (405)',
        {tag: '@delete'},
        async () => {
            const response = await heartbeats.deleteHeartbeats(guid);
            expect(response.status).toBe(405);
        });

    test('PATCH /heartbeat (500)',
        {tag: '@patch'},
        async () => {
            const response = await heartbeats.patchHeartbeats(guid);
            expect(response.status).toBe(500);
        });

    test('GET /heartbeat (204)',
        {tag: '@get'},
        async () => {
            const response = await heartbeats.getHeartbeats(guid);
            expect(response.status).toBe(204);
        });
})