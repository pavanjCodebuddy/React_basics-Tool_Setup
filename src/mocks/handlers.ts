import { http, HttpResponse } from 'msw';

let nextId = 1; // Initialize a variable to keep track of the next ID
let todoList: { id: number; taskName: string }[] = []; // Initialize an empty array for todos


export const handlers = [
  // Create new todo
  http.post('/api/todos', async ({request}) => {
    const requestBody= await request.json(); // Parse the JSON from the request body
    console.log(requestBody);          //clg
    const { taskName} = requestBody; // Destructure taskName from the request body
    console.log(taskName);           //clg

    const newTodo = { id: nextId++, taskName }; // Create new todo object
    todoList.push(newTodo); // Add the new todo to the list

    return HttpResponse.json(newTodo, { status: 201 }); // Respond with created todo and a 201 status
  }),

  // Get all todos
  http.get('/api/todos', () => {
    return HttpResponse.json(todoList, { status: 200 }); // Respond with todo list and a 200 status
  }),

  // Delete a todo by ID
  http.delete('/api/todos/:id', ({ params }) => {
    const id = params.id; // Get id from request parameters
    todoList = todoList.filter((todo) => todo.id !== Number(id)); // Filter out todo with specified id

    return HttpResponse.json(todoList, { status: 200 }); // Respond with no content and a 200 status
  }),
];
