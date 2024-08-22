import React, { useState, useEffect, useMemo } from "react";

export default function TaskListManagement() {
  // State variables
  const [taskDescription, setTaskDescription] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [taskStatus, setTaskStatus] = useState("");
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState("All");

  // Effect to load tasks from local storage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTaskList(JSON.parse(savedTasks));
    }
  }, []);

  // Function to handle task updates (add or edit)
  function updateTaskList(title, description, status) {
    if (editTaskIndex !== null) {
      setTaskList((prevTaskList) =>
        prevTaskList.map((task, index) =>
          index === editTaskIndex
            ? { ...task, title, description, status }
            : task
        )
      );
      setEditTaskIndex(null);
    } else {
      setTaskList((prevTaskList) => [
        ...prevTaskList,
        { title, description, status },
      ]);
    }
    resetForm();
  }

  // Function to save a new or updated task
  function saveTask() {
    const title = taskTitle.trim();
    const description = taskDescription.trim();
    if (title && description) {
      updateTaskList(title, description, taskStatus);
    }
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }

  // Function to clear all tasks
  function clearTaskList() {
    setTaskList([]);
    // localStorage("tasks");
  }

  // Function to handle input changes
  function handleInputChange(event) {
    const { name, value } = event.target;
    if (name === "title") {
      setTaskTitle(value);
    } else if (name === "description") {
      setTaskDescription(value);
    }
  }

  // Function to handle status changes
  function handleStatusChange(event) {
    setTaskStatus(event.target.value);
  }

  // Function to handle task editing
  function handleTaskEdit(index) {
    const task = taskList[index];
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskStatus(task.status);
    setEditTaskIndex(index);
  }

  // Function to handle task deletion
  function handleTaskDelete(index) {
    setTaskList((prevTaskList) => prevTaskList.filter((_, i) => i !== index));
  }

  // Function to handle filter criteria changes
  function handleFilterChange(event) {
    setFilterCriteria(event.target.value);
  }

  // Function to reset form fields
  function resetForm() {
    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("");
  }

  // Filter tasks based on the selected criteria
  const filteredTasks = useMemo(() => {
    if (filterCriteria === "All") return taskList;
    return taskList.filter((task) => task.status === filterCriteria);
  }, [taskList, filterCriteria]);

  // Check if there are any tasks to display
  const hasTasks = filteredTasks.length > 0;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
        Task List Management Dashboard
      </h1>

      <input
        name="title"
        placeholder="Task title"
        value={taskTitle}
        onChange={handleInputChange}
        className="block w-full max-w-md sm:max-w-2xl mx-auto p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <textarea
        name="description"
        placeholder="Add your task description here."
        value={taskDescription}
        onChange={handleInputChange}
        rows="4"
        className="block w-full max-w-md sm:max-w-2xl mx-auto p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      ></textarea>

      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="Pending"
            checked={taskStatus === "Pending"}
            onChange={handleStatusChange}
            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Pending</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="In Progress"
            checked={taskStatus === "In Progress"}
            onChange={handleStatusChange}
            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">In Progress</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="Completed"
            checked={taskStatus === "Completed"}
            onChange={handleStatusChange}
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
          {editTaskIndex !== null ? "Update Task" : "Add Task"}
        </button>
        {hasTasks && (
          <select
            value={filterCriteria}
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
      {filteredTasks.length === 0 ? (
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
              {filteredTasks.map((task, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-b border-gray-300 p-3 sm:p-3">
                    {task.title}
                  </td>
                  <td className="border-b border-gray-300 p-3 sm:p-3 max-h-20 overflow-y-auto">
                    {task.description}
                  </td>
                  <td className="border-b border-gray-300 p-3 sm:p-4">
                    {task.status}
                  </td>
                  <td className="border-b border-gray-300 p-3 sm:p-4 flex gap-2">
                    <button
                      onClick={() => handleTaskEdit(index)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded-lg shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      Edit Task
                    </button>
                    <button
                      onClick={() => handleTaskDelete(index)}
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
          onClick={clearTaskList}
          className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
