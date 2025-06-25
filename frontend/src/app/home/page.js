"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchSavedTasks(user.uid);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!topic || !userId) return;
    setLoading(true);
    try {
      const response = await api.post("/generate", { topic });
      setTasks(response.data.tasks.map((title) => ({ title })));
      setSaved(false);
    } catch (err) {
      console.error(err);
      alert("Failed to generate tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToDatabase = async () => {
    try {
      await Promise.all(
        tasks.map((task) =>
          api.post("/tasks", {
            title: task.title,
            userId,
          })
        )
      );
      setSaved(true);
      alert("Tasks saved successfully!");
      fetchSavedTasks(userId);
    } catch (err) {
      console.error(err);
      alert("Error saving tasks.");
    }
  };

  const fetchSavedTasks = async (uid) => {
    try {
      const response = await api.get(`/tasks/${uid}`);
      setTasks(response.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const handleToggleCompleted = async (taskId, current) => {
    try {
      await api.put(`/tasks/${taskId}`, { completed: !current });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !current } : task
        )
      );
    } catch (err) {
      console.error("Update error", err);
      alert("Failed to update task");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete task");
    }
  };

  const handleEditSave = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, { title: editedTitle });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, title: editedTitle } : task
        )
      );
      setEditingTaskId(null);
      setEditedTitle("");
    } catch (err) {
      console.error("Edit error", err);
      alert("Failed to update task title");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      alert("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">🎯 Task Generator</h1>



      <div className="flex gap-2 mb-4 items-center">
        <input
          style={{height:40}}
          type="text"
          placeholder="Enter a topic (e.g. Learn Python)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="h-12 w-full max-w-md px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
        />
        <button
        style={{height:30}}
          onClick={handleGenerate}
          disabled={loading}
          className="h-12 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>


      {tasks.length > 0 && !saved && tasks[0]?.id === undefined && (
        <Button
          onClick={handleAddToDatabase}
          className="mb-6 mt-6"
          variant="secondary"
        >
          Add All Tasks to Database
        </Button>
      )}

      <div className="space-y-3">
        {tasks.map((task, i) => (
          <Card
            key={task.id || i}
            className={`p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border rounded-xl shadow-sm ${task.completed ? "bg-green-50" : "bg-white"
              }`}
          >
            <div className="flex items-center gap-3 w-full">
              {"id" in task && (
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-blue-500"
                  checked={task.completed}
                  onChange={() =>
                    handleToggleCompleted(task.id, task.completed)
                  }
                />

              )}

              {editingTaskId === task.id ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-1"
                />
              ) : (
                <span
                  className={`flex-1 text-base ${task.completed ? "line-through text-gray-500" : "text-black"
                    }`}
                >
                  {task.title}
                </span>
              )}
            </div>

            {"id" in task && (
              <div className="flex gap-2 ml-auto">
                {editingTaskId === task.id ? (
                  <Button size="sm" onClick={() => handleEditSave(task.id)}>
                    Save
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setEditedTitle(task.title);
                    }}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-100"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-center mb-6">
        <button
          style={{ height: 30, width: 80 }}
          onClick={handleLogout} variant="destructive">
          Logout
        </button>
      </div>
    </div>

  );
}
