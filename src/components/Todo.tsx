import React, { useEffect, useState } from 'react';

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<{ id: number; taskName: string }[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Function to fetch todos from the API
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) {
         setTodos([])      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      setTodos([]) 
    }
  };

  //add new todo
  const addTodo = async () => {
    if (!newTodo) return; // Prevent submit empty todo

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskName: newTodo }), //this Send newTodo in request body
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const addedTodo = await response.json(); // Get added todo from response
      setTodos((prev) => [...prev, addedTodo]); // Update the state with new todo
      setNewTodo(''); // Clear the input field
    } catch (error) {
      console.error('Error adding TODO: ', error); // Log the error for debugging
    }
  };

  // F for delete todo
  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setTodos((prev) => prev.filter((todo) => todo.id !== id)); // Remove the deleted todo from state
    } catch (error) {
      console.error('Error deleting TODO: ', error); // Log error for debugging
    }
  };

  // F handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update the search term
  };

  // Effect to fetch todos component mount
  useEffect(() => {
    fetchTodos(); // Fetch todos when component mounts
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-200">
      <div className="bg-gray-100 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">TODO App</h1>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search TODOs..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 mb-6 w-full rounded"
        />
        
        {/* Input and Submit Button */}
        <div className="flex mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new TODO..."
            className="border p-2 flex-grow mr-2 rounded"
          />
          <button
            onClick={addTodo}
            className="bg-blue-400 text-white px-5 rounded hover:bg-blue-600 transition duration-200"
          >
            Add
          </button>
        </div>

        {/* TODO List */}
        <ul className="list-disc pl-5">
          {todos
            .filter((todo) => todo.taskName.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((todo) => (
              <li key={todo.id} className="flex justify-between items-center mb-4">
                <span>{todo.taskName}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="bg-gray-500 text-white px-3 rounded hover:bg-gray-600 transition duration-200"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
