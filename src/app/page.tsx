"use client";

import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  children: Todo[];
}

const initialTodos: Todo[] = [
  {
    id: 1,
    text: "Work",
    completed: false,
    children: [
      {
        id: 2,
        text: "Meeting with team",
        completed: false,
        children: [],
      },
      {
        id: 3,
        text: "Prepare presentation",
        completed: false,
        children: [
          {
            id: 4,
            text: "Collect data",
            completed: false,
            children: [],
          },
          {
            id: 5,
            text: "Design slides",
            completed: false,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    text: "Personal",
    completed: false,
    children: [
      {
        id: 7,
        text: "Grocery shopping",
        completed: false,
        children: [],
      },
      {
        id: 8,
        text: "Call mom",
        completed: false,
        children: [],
      },
    ],
  },
];

function TodoList({ todos, onToggle, onAddChild, onEdit }: { todos: Todo[]; onToggle: (id: number) => void; onAddChild: (id: number) => void; onEdit: (id: number, newText: string) => void }) {
  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id} className="ml-4">
          <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} className="mr-2" />
          <input type="text" value={todo.text} onChange={(e) => onEdit(todo.id, e.target.value)} className="mr-2" />
          <button onClick={() => onAddChild(todo.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
            Add Child
          </button>
          {todo.children.length > 0 && <TodoList todos={todo.children} onToggle={onToggle} onAddChild={onAddChild} onEdit={onEdit} />}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const handleToggle = (id: number) => {
    const toggleTodo = (todos: Todo[]): Todo[] => {
      return todos.map((todo) => {
        if (todo.id === id) {
          const newCompleted = !todo.completed;
          return {
            ...todo,
            completed: newCompleted,
            children: toggleTodo(todo.children),
          };
        } else {
          return {
            ...todo,
            children: toggleTodo(todo.children),
          };
        }
      });
    };

    setTodos(toggleTodo(todos));
  };

  const handleAddChild = (parentId: number) => {
    const newId = Date.now(); // Simple ID generation
    const addChild = (todos: Todo[]): Todo[] => {
      return todos.map((todo) => {
        if (todo.id === parentId) {
          return {
            ...todo,
            children: [...todo.children, { id: newId, text: "New Task", completed: false, children: [] }],
          };
        } else {
          return {
            ...todo,
            children: addChild(todo.children),
          };
        }
      });
    };

    setTodos(addChild(todos));
  };

  const handleEdit = (id: number, newText: string) => {
    const editTodo = (todos: Todo[]): Todo[] => {
      return todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            text: newText,
          };
        } else {
          return {
            ...todo,
            children: editTodo(todo.children),
          };
        }
      });
    };

    setTodos(editTodo(todos));
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Nested Todo List</h1>
      <TodoList todos={todos} onToggle={handleToggle} onAddChild={handleAddChild} onEdit={handleEdit} />
    </div>
  );
}
