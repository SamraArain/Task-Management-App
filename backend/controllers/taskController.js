const Task = require("../models/Task");

// @desc get all tasks (Admin: all, user: only assigned tasks)
// @route GET /api/tasks
// @access Private
const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
        } else {
            tasks =await Task.find({ ...filter, assignedTo: req.user._id }).populate("assignedTo", "name email profileImageUrl");
        }

        //Add completed todoChecklist count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completeCount = task.todoChecklist.filter(
                    (item) => item.completed
                ).length;
                return { ...task._doc, completedTodoCount: completeCount };
            })

        );
        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });
const allTasks = tasks.length;
        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc get task by id
// @route GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => { 
    try {
const task = await Task.findById(req.params.id).populate(
    "assignedTo",
    "name email proileImageUrl"
);
if (!task) return res.status(404).json({ message: "Task not found" });

res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }};

// @desc create task (Admin only)
// @route POST /api/tasks
// @access Private/Admin
const createTask = async (req, res) => { 
    try {
const {
    title,
    description,
    priority,
    dueDate,
    assignedTo,
    attachments,
    todoChecklist,
} = req.body;

if (!Array.isArray(assignedTo)) {
    return res.status(400).json({message: "AssignedTo must be an array of user IDs"});
}

const task = await Task.create({
    title, 
    description,
    priority,
    dueDate,
    assignedTo,
    createdBy: req.user._id,
    todoChecklist,
    attachments,
});
res.status(201).json({ message: "Task created seccessfully", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }};

// @desc update task details
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => { 
    try {
const task = await Task.findById(req.params.id);
if (!task) return res.status(404).json({ message: "Task not found" });

task.title = req.body.title || task.title;
task.description = req.body.description || task.description;
task.priority = req.body.priority || task.priority;
task.dueDate = req.body.dueDate || task.dueDate;
task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
task.attachments = req.body.attachments || task.attachments;

if (req.body.assignedTo) {
    if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
    }
    task.assignedTo = req.body.assignedTo;
}

const updatedTask = await task.save();
res.json({ message: "Task updated successfully", updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }};

// @desc delete task (Admin only)
// @route DELETE /api/tasks/:id
// @access Private/Admin
const deleteTask = async (req, res) => { 
    try {
const task = await Task.findById(req.params.id);

if (!task) return res.status(404).json({ message: "Task not found" });

await task.deleteOne();
res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }};

// @desc update task status
// @route PUT /api/tasks/:id/status
// @access Private
const updateTaskStatus = async (req, res) => { 
    try {
const task = await Task.findById(req.params.id);
if (!task) return res.status(404).json({ message: "Task not found" });

const isAssigned = task.assignedTo.some(
    (userId) => userId.toString() === req.user._id.toString()

);

if (!isAssigned && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
}

task.status = req.body.status || task.status;

if (task.status === "Completed") {
    task.todoChecklist.forEach((item) => (item.completed = true));
    task.progress = 100;
}

await task.save();
res.json({ message: "Task status updated", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }};

// @desc update task checklist
// @route PUT /api/tasks/:id/todo
// @access Private
const updateTaskChecklist = async (req, res) => { 
    try {
const { todoChecklist } = req.body;
const task = await Task.findById(req.params.id);

if (!task) return res.status(404).json({ message: "Task not found" });

if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin" ) {
    return res.status(403).json({ message: "Not authorized" });
}

task.todoChecklist = todoChecklist; //Replace with updated checklist

// Auto-mark task as completed if all checklist items are done

if (task.progress === 100) {
    task.status = "Completed";
} else if (task.progress > 0) {
    task.status = "In progress";
} else {
    task.status = "Pending";
}

await task.save();
const updatedTask = await Task.findById(req.params.id).populate(
    "assignedTo",
    "name email profileImageUrl"
);
res.json({ message: "Task checklist updated", task:updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }};

// @desc get dashboard data (Admin)
// @route GET /api/tasks/dashboard-data
// @access Private/Admin
const getDashboardData = async (req, res) => { 
    try {
// fetch statistics
const totalTasks = await Task.countDocuments();
const pendingTasks = await Task.countDocuments({ status: "Pending" });
const completedTasks = await Task.countDocuments({ status: "Completed" });
const overdueTasks = await Task.countDocuments({ 
    status: { $ne: "Completed" },
    dueDate: { $lt: new Date() },
 });

 // ensure all possible statuses are included 

 const taskStatuses = ["Pending", "In Progress", "Completed"];
 const taskDistributionRaw = await Task.aggregate([
    { 
        $group: {
            _id: "$status",
            count: { $sum: 1 },
        },
    },
 ]);

 const taskDistribution = taskStatuses.reduce((acc, status) => {
    const formattedKey = status.replace(/\s+/g, ""); //remove spaces for response keys
    acc[formattedKey] = 
    taskDistributionRaw.find((item) => item._id === status)?.count || 0;
    return acc;
 }, {});
 taskDistribution["All"] = totalTasks; //add total count to taskDistribution

 //ensure all priority levels are included

 const taskPriorities = ["Low", "Medium", "High"];
 const taskPriorityLevelsRaw = await Task.aggregate([
    {
        $group: {
            _id: "$priority",
            count: { $sum: 1 },
        },
    },
 ]);
 const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
    acc[priority] =
    taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
    return acc;
 }, {});

 //fetch recent 10 tasks
 const recentTasks = await Task.find()
 .sort({ createdAt: -1 })
 .limit(10)
 .select("title status priority dueDate createdAt");

 res.status(200).json({
    statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
    },
    charts: {
        taskDistribution,
        taskPriorityLevels,
    },
    recentTasks
 });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }};

// @desc get user dashboard data (User-specific)
// @route GET /api/tasks/user-dashboard-data
// @access Private
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id; // Ensure this comes from protect middleware

        // Statistics
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });

        // Task distribution by status
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const key = status.replace(/\s+/g, "");
            acc[key] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        // Task distribution by priority
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // Recent 10 tasks
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks
        });

    } catch (error) {
        console.error("User Dashboard Data Error:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
};