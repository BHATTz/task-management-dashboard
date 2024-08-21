import React, { useState } from "react";

export default function TaskListManagement() {
  const [text, setText] = useState(""); // Initialize with an empty string
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(""); // State for selected option

  const updateHistory = (newText, option) => {
    setHistory([...history, { text: newText, option }]);
    setText(""); // Clear text field after saving
    setSelectedOption(""); // Clear selected option
  };

  const saveB = () => {
    const newText = text.toLowerCase();
    updateHistory(newText, selectedOption);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const changes = (event) => {
    setText(event.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
        Task List Management Dashboard
      </h1>

      <textarea
        id="message"
        name="message"
        placeholder="Add your task here."
        value={text}
        onChange={changes}
        rows="4"
        className="block w-full max-w-md sm:max-w-2xl mx-auto p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>

      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-4">
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

      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={saveB}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Task
        </button>
      </div>

      <h3 className="text-xl sm:text-2xl font-semibold text-center mt-6 mb-4 text-gray-800">
        Task Dashboard
      </h3>
      {history.length === 0 ? (
        <p className="text-center text-gray-500">No history available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 border border-gray-200 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-3 w-96 sm:p-4 text-left bg-gray-100">
                  Task
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
              {history.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-b border-gray-300 p-3 sm:p-3 max-h-20 overflow-y-auto">
                    <div className="max-h-10 overflow-y-auto">{item.text}</div>
                  </td>
                  <td className="border-b border-gray-300 p-3 sm:p-4 max-h-20 overflow-y-auto">
                    <div className="max-h-10 overflow-y-auto">
                      {item.option}
                    </div>
                  </td>
                  <td className="border-b border-gray-300 p-3 sm:p-4  flex gap-2">
                    <button className="bg-yellow-500 text-white py-1 px-2 rounded-lg shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                      Edit Task
                    </button>
                    <button className="bg-red-500 text-white py-1 px-2 rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                      Delete Task
                    </button>
                    <button className="bg-green-500 text-white py-1 px-2 rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                      Filter Task
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
