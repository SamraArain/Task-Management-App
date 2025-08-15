import React from 'react';

const UserCard = ({ userInfo }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full hover:shadow-lg transition-shadow">
      {/* Avatar, Name & Email */}
      <div className="flex items-center gap-4">
        <img
          src={userInfo?.profileImageUrl}
          alt="Avatar"
          className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover"
        />
        <div>
          <p className="text-base font-semibold text-gray-800">
            {userInfo?.name}
          </p>
          <p className="text-sm text-gray-500">{userInfo?.email}</p>
        </div>
      </div>

      {/* Task Stats */}
      <div className="flex gap-4 mt-6">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case 'In Progress':
        return 'bg-cyan-100 text-cyan-700';
      case 'Completed':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-violet-100 text-violet-700';
    }
  };

  return (
    <div
      className={`flex-1 text-center px-4 py-3 rounded-lg ${getStatusTagColor()} shadow-sm`}
    >
      <p className="text-lg font-bold">{count}</p>
      <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
    </div>
  );
};
