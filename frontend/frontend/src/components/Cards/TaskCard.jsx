import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo = [],
  attachmentCount = 0,
  completedTodoCount = 0,
  todoChecklist = [],
  onClick
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-600 bg-cyan-100 border border-cyan-200";
      case "Completed":
        return "text-lime-600 bg-lime-100 border border-lime-200";
      default:
        return "text-violet-600 bg-violet-100 border border-violet-200";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-600 bg-emerald-100 border border-emerald-200";
      case "Medium":
        return "text-amber-600 bg-amber-100 border border-amber-200";
      default:
        return "text-rose-600 bg-rose-100 border border-rose-200";
    }
  };

  return (
    <div
      className="bg-white rounded-2xl py-5 px-5 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Status & Priority Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusTagColor()}`}
        >
          {status}
        </span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityTagColor()}`}
        >
          {priority} Priority
        </span>
      </div>

      {/* Title & Description */}
      <div
        className={`border-l-4 pl-4 mb-4 ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-indigo-500"
            : "border-violet-500"
        }`}
      >
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Checklist Progress */}
      <div className="mb-2">
        <p className="text-sm text-gray-700 mb-1 font-medium">
          Task Done:{" "}
          <span className="font-semibold text-gray-800">
            {completedTodoCount} / {todoChecklist.length || 0}
          </span>
        </p>
        <Progress progress={progress} status={status} />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
        <div>
          <p className="text-xs text-gray-500">Start Date</p>
          <p className="font-medium">
            {moment(createdAt).format("Do MMM YYYY")}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Due Date</p>
          <p className="font-medium">
            {moment(dueDate).format("Do MMM YYYY")}
          </p>
        </div>
      </div>

      {/* Footer Row: Avatars & Attachments */}
      <div className="flex items-center justify-between mt-5">
        <AvatarGroup avatars={assignedTo || []} />
        {attachmentCount > 0 && (
          <div className="flex items-center gap-1.5 bg-blue-100 px-3 py-1.5 rounded-md">
            <LuPaperclip className="text-blue-600 text-lg" />
            <span className="text-sm font-medium text-gray-800">
              {attachmentCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
