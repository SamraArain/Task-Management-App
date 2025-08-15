import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-500 border border-green-200';
    case 'Pending': return 'bg-purple-100 text-purple-500 border border-purple-200';
    case 'In Progress': return 'bg-cyan-100 text-cyan-500 border border-cyan-200';
    default: return 'bg-gray-100 text-gray-500 border border-gray-200';
  }
};

const getPriorityBadgeColor = (priority) => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-500 border border-red-200';
    case 'Medium': return 'bg-orange-100 text-orange-500 border border-orange-200';
    case 'Low': return 'bg-green-100 text-green-500 border border-green-200';
    default: return 'bg-gray-100 text-gray-500 border border-gray-200';
  }
};

const TaskListTable = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:8000/api/tasks', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        if (Array.isArray(data)) setTableData(data);
        else if (Array.isArray(data.tasks)) setTableData(data.tasks);
        else setTableData([]);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <p className="p-4 text-gray-500">Loading tasks...</p>;

  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">Name</th>
          <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">Status</th>
          <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">Priority</th>
          <th className="py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell">Created On</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(tableData) && tableData.length > 0 ? (
          tableData.map((task) => (
            <tr key={task._id} className="border-t border-gray-200">
              <td
                className="my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden cursor-pointer text-blue-500 hover:underline"
                onClick={() => navigate(`/tasks/${task._id}`)}
              >
                {task.title}
              </td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(task.priority)}`}>
                  {task.priority}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">
                {task.createdAt ? moment(task.createdAt).format('Do MMM YYYY') : 'N/A'}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="p-4 text-center text-gray-500">
              No tasks found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TaskListTable;
