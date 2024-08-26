import React, { useState, useEffect, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TaskListManagement() {
  const [taskDescription, setTaskDescription] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [taskStatus, setTaskStatus] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState("All");
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTaskList(JSON.parse(savedTasks));
    }
  }, []);

  const updateLocalStorage = useCallback((updatedTasks) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }, []);

  const updateTaskList = useCallback(
    (title, description, status, date) => {
      let updatedTasks;
      if (editTaskIndex !== null) {
        updatedTasks = taskList.map((task, index) =>
          index === editTaskIndex
            ? { ...task, title, description, status, date }
            : task
        );
        setEditTaskIndex(null);
      } else {
        updatedTasks = [...taskList, { title, description, status, date }];
      }
      setTaskList(updatedTasks);
      updateLocalStorage(updatedTasks);
      resetForm();
    },
    [editTaskIndex, taskList, updateLocalStorage]
  );

  const saveTask = useCallback(() => {
    const title = taskTitle.trim();
    const description = taskDescription.trim();
    if (title && description) {
      updateTaskList(title, description, taskStatus, taskDate);
    }
  }, [taskTitle, taskDescription, taskStatus, taskDate, updateTaskList]);

  const clearTaskList = useCallback(() => {
    setTaskList([]);
    updateLocalStorage([]);
  }, [updateLocalStorage]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    if (name === "title") {
      setTaskTitle(value);
    } else if (name === "description") {
      setTaskDescription(value);
    }
  }, []);

  const handleStatusChange = useCallback((event) => {
    setTaskStatus(event.target.value);
  }, []);

  const handleTaskEdit = useCallback(
    (index) => {
      const task = taskList[index];
      setTaskTitle(task.title);
      setTaskDescription(task.description);
      setTaskStatus(task.status);
      setTaskDate(new Date(task.date)); // Set the date for editing
      setEditTaskIndex(index);
    },
    [taskList]
  );

  const handleTaskDelete = useCallback(
    (index) => {
      const updatedTasks = taskList.filter((_, i) => i !== index);
      setTaskList(updatedTasks);
      updateLocalStorage(updatedTasks);
    },
    [taskList, updateLocalStorage]
  );

  const handleFilterChange = useCallback((event) => {
    setFilterCriteria(event.target.value);
  }, []);

  const handleDateFilterChange = useCallback((startDate, endDate) => {
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
  }, []);

  const resetForm = useCallback(() => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("");
    setTaskDate(new Date()); // Reset the date
  }, []);

  const filteredTasks = useMemo(() => {
    return taskList.filter((task) => {
      const taskDate = new Date(task.date);
      const isStatusMatch =
        filterCriteria === "All" || task.status === filterCriteria;
      const isDateMatch =
        (!filterStartDate || taskDate >= filterStartDate) &&
        (!filterEndDate || taskDate <= filterEndDate);
      return isStatusMatch && isDateMatch;
    });
  }, [taskList, filterCriteria, filterStartDate, filterEndDate]);

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

      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-4">
        <label className="block text-gray-700 mb-2">Task Date</label>
        <DatePicker
          selected={taskDate}
          onChange={(date) => setTaskDate(date)}
          className="block w-full max-w-md sm:max-w-2xl mx-auto p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={saveTask}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-16 mt-6"
        >
          {editTaskIndex !== null ? "Update Task" : "Add Task"}
        </button>
        {hasTasks && (
          <>
            <select
              value={filterCriteria}
              onChange={handleFilterChange}
              className="ml-4 bg-green-500 text-white py-1 px-2 rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 h-16 mt-6"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 ml-4">
              <div className="flex flex-col">
                <label className="block text-gray-700 mb-2">Start Date</label>
                <DatePicker
                  selected={filterStartDate}
                  onChange={(date) =>
                    handleDateFilterChange(date, filterEndDate)
                  }
                  className="block w-full max-w-md sm:max-w-2xl mx-auto p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dateFormat="MMMM d, yyyy"
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 mb-2">End Date</label>
                <DatePicker
                  selected={filterEndDate}
                  onChange={(date) =>
                    handleDateFilterChange(filterStartDate, date)
                  }
                  className="block w-full max-w-md sm:max-w-2xl mx-auto p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dateFormat="MMMM d, yyyy"
                />
              </div>
            </div>
          </>
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
                <th className="border-b border-gray-300 p-3 w-40 sm:p-4 text-left bg-gray-100">
                  Date
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
                  <td className="border-b border-gray-300 p-3 sm:p-4">
                    {new Date(task.date).toLocaleDateString()}
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
