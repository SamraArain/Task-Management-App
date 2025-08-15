import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  // Add task
  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  // Delete task
  const handleDeleteOption = (index) => {
    setTodoList(todoList.filter((_, idx) => idx !== index));
  };

  return (
    <div className="w-full max-w-md mx-auto">
     
      {/* Input Section */}
      <div className="flex items-center gap-4 mb-8 bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="w-full text-xs text-black outline-none bg-gray py-2"
        />
        <button
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded-md"
                  onClick={handleAddOption}
                >
                  <HiMiniPlus className="text-lg" /> Add
                </button>
      </div>

      {/* Tasks Section */}
      <div className="space-y-7">
        {todoList.length === 0 ? (
          <p className="text-gray-400 text-center text-sm">No tasks yet.</p>
        ) : (
          <AnimatePresence>
            {todoList.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center hover:bg-white hover:shadow-md transition"
              >
                <p className="text-base text-black">
                  <span className="text-gray-400 font-semibold mr-2">
                    {index < 9 ? `0${index + 1}` : index + 1}
                  </span>
                  {item}
                </p>
                <button onClick={() => handleDeleteOption(index)}>
                  <HiOutlineTrash className="text-xl text-red-500" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TodoListInput;