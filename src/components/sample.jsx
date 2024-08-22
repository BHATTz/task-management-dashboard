import React, { useState, useEffect, useMemo, useCallback } from "react";

export default function TaskListManagement() {
  const [text, setText] = useState(""); // Description of the task
  const [title, setTitle] = useState(""); // Title of the task
  const [history, setHistory] = useState([]); // List of tasks
  const [selectedOption, setSelectedOption] = useState(""); // State for selected option
  const [editIndex, setEditIndex] = useState(null); // Index of the task being edited
  const [filter, setFilter] = useState("All"); // State for filter criteria

  // Load tasks from local storage when the component mounts
  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem("tasks")) || [];
      setHistory(savedHistory);
    } catch (error) {
      console.error("Error loading tasks from local storage:", error);
    }
  }, []);

  // Save tasks to local storage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(history));
    } catch (error) {
      console.error("Error saving tasks to local storage:", error);
    }
  }, [history]);

  // Memoized function to update the history (add or edit tasks)
  const updateHistory = useCallback(
    (newTitle, newText, option) => {
      if (editIndex !== null) {
        // Update existing task
        const updatedHistory = history.map((item, index) =>
          index === editIndex
            ? { ...item, title: newTitle, text: newText, option }
            : item
        );
        setHistory(updatedHistory);
        setEditIndex(null); // Reset editIndex after saving
      } else {
        // Add new task
        setHistory([...history, { title: newTitle, text: newText, option }]);
      }
      // Clear input fields
      setTitle("");
      setText("");
      setSelectedOption("");
    },
    [editIndex, history]
  );

  // Save task function using the updateHistory callback
  const saveTask = useCallback(() => {
    const newTitle = title.trim();
    const newText = text.trim().toLowerCase();
    if (newTitle && newText) {
      updateHistory(newTitle, newText, selectedOption);
    }
  }, [title, text, selectedOption, updateHistory]);

  // Memoized function to clear all tasks
  const clearHistory = useCallback(() => {
    setHistory([]);
    // localStorage.removeItem("tasks"); // Clear local storage
  }, []);

  // Handle input changes
  const handleChange = useCallback((event) => {
    if (event.target.name === "title") {
      setTitle(event.target.value);
    } else if (event.target.name === "text") {
      setText(event.target.value);
    }
  }, []);

  // Handle option change
  const handleOptionChange = useCallback((event) => {
    setSelectedOption(event.target.value);
  }, []);

  // Handle task edit
  const handleEdit = useCallback(
    (index) => {
      const task = history[index];
      setTitle(task.title);
      setText(task.text);
      setSelectedOption(task.option);
      setEditIndex(index);
    },
    [history]
  );

  // Handle task delete
  const handleDelete = useCallback(
    (index) => {
      const updatedHistory = history.filter((_, i) => i !== index);
      setHistory(updatedHistory);
    },
    [history]
  );

  // Handle filter change
  const handleFilterChange = useCallback((event) => {
    setFilter(event.target.value);
  }, []);

  // Filter tasks based on the selected filter option
  const filteredHistory = useMemo(() => {
    if (filter === "All") return history;
    return history.filter((task) => task.option === filter);
  }, [history, filter]);

  const hasTasks = filteredHistory.length > 0;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
        Task List Management Dashboard
      </h1>

      <input
        name="title"
        placeholder="Task title"
        value={title}
        onChange={handleChange}
        className="block w-full max-w-md sm:max-w-2xl mx-auto p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <textarea
        name="text"
        placeholder="Add your task description here."
        value={text}
        onChange={handleChange}
        rows="4"
        className="block w-full max-w-md sm:max-w-2xl mx-auto p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      ></textarea>

      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="Pending"
            checked={selectedOption === "Pending"}
            onChange={handleOptionChange}
            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Pending</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="In Progress"
            checked={selectedOption === "In Progress"}
            onChange={handleOptionChange}
            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">In Progress</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="Completed"
            checked={selectedOption === "Completed"}
            onChange={handleOptionChange}
            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Completed</span>
        </label>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={saveTask}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {editIndex !== null ? "Update Task" : "Add Task"}
        </button>
        {hasTasks && (
          <select
            value={filter}
            onChange={handleFilterChange}
            className="ml-4 bg-green-500 text-white py-1 px-2 rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        )}
      </div>

      <h3 className="text-xl sm:text-2xl font-semibold text-center mt-6 mb-4 text-gray-800">
        Task Dashboard
      </h3>
      {filteredHistory.length === 0 ? (
        <p className="text-center text-gray-500">No tasks available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 border border-gray-200 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-3 w-64 sm:p-4 text-left bg-gray-100">
                  Title
                </th>
                <th className="border-b border-gray-300 p-3 w-96 sm:p-4 text-left bg-gray-100">
                  Description
                </th>
                <th className="border-b border-gray-300 p-3 w-32 sm:p-4 text-left bg-gray-100">
                  Status
                </th>
                <th className="border-b border-gray-300 p-3 w-52 sm:p-4 text-left bg-gray-100">
                  Operations
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-b border-gray-300 p-3 sm:p-3">
                    {item.title}
                  </td>
                  <td className="border-b border-gray-300 p-3 sm:p-3 max-h-20 overflow-y-auto">
                    {item.text}
                  </td>
                  <td className="border-b border-gray-300 p-3 sm:p-4">
                    {item.option}
                  </td>
                  <td className="border-b border-gray-300 p-3 sm:p-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded-lg shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      Edit Task
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white py-1 px-2 rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete Task
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={clearHistory}
          className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
