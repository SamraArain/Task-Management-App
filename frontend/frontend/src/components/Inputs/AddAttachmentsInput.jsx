import React, { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    setAttachments(attachments.filter((_, idx) => idx !== index));
  };

  return (
    <div className="mt-4">

      {/* Attachment List */}
      {attachments.length > 0 ? (
        attachments.map((item, index) => (
          <div
            key={item}
            className="flex justify-between items-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-md mb-2"
          >
            <div className="flex-1 flex items-center gap-2">
              <LuPaperclip className="text-gray-400" />
              <p className="text-xs text-black break-all">{item}</p>
            </div>
            <button
              className="cursor-pointer"
              onClick={() => handleDeleteOption(index)}
            >
              <HiOutlineTrash className="text-lg text-red-500" />
            </button>
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-400 mb-3">No attachments yet.</p>
      )}

      {/* Add Attachment Input */}
      <div className="flex gap-3 mt-2">
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-md px-3">
          <LuPaperclip className="text-gray-400" />
          <input
            type="text"
            placeholder="Add File Link"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-xs text-black outline-none bg-gray py-2"
          />
        </div>
        <button
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded-md"
          onClick={handleAddOption}
        >
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;