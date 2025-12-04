import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Create task
  const createTask = async () => {
    try {
      const token = localStorage.getItem("token");
      await axiosClient.post(
        "/tasks",
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Start Edit
  const startEdit = (task) => {
    setEditMode(true);
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  // Update task
  const updateTask = async () => {
    try {
      const token = localStorage.getItem("token");
      await axiosClient.put(
        `/tasks/${editId}`,
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditMode(false);
      setEditId(null);
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axiosClient.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 w-full min-h-screen bg-gray-100">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-600">Dashboard</h1>

        <div className="flex gap-3">
          <button
            onClick={() => (window.location.href = "/profile")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Profile
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mt-4 flex gap-2">
        <input
          className="border p-2 rounded w-1/4"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 rounded w-1/2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={editMode ? updateTask : createTask}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          {editMode ? "Update" : "Add"}
        </button>
      </div>

      {/* SEARCH BAR */}
      <input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mt-4 w-full"
        style={{ maxWidth: "400px" }}
      />

      <div className="mt-5 space-y-3">
        {tasks
          .filter((task) =>
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description.toLowerCase().includes(search.toLowerCase())
          )
          .map((task) => (
            <div
              key={task._id}
              className="p-3 bg-white rounded shadow flex justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(task)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dashboard;
