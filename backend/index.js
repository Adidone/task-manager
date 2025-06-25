import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


app.post("/generate", async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Give me exactly 5 beginner-friendly learning steps to accomplish the goal: "${topic}". 
Respond only with a numbered list, each step on a new line, and no extra explanation.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const tasks = text
      .split("\n")
      .map((line) => line.replace(/^\d+[\).:-]?\s*/, "").trim())
      .filter((line) => line.length > 0)
      .slice(0, 5);

    res.json({ tasks });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Failed to generate tasks" });
  }
});


app.post("/tasks", async (req, res) => {
  const { title, userId } = req.body;
  if (!title || !userId) {
    return res.status(400).json({ error: "Title and userId are required" });
  }

  try {
    const task = await prisma.task.create({
      data: { title, userId },
    });
    res.json(task);
  } catch (err) {
    console.error("Task Save Error:", err);
    res.status(500).json({ error: "Failed to save task" });
  }
});


app.get("/tasks/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (err) {
    console.error("Fetch Tasks Error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
      },
    });
    res.json(updatedTask);
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});


app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
