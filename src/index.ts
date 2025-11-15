import "dotenv/config";
import express from "express";
import { analyzeTransaction } from "./analyzer";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/analyze-tx", async (req, res) => {
  try {
    const { extrinsic, caller, network } = req.body;

    const result = await analyzeTransaction({ extrinsic, caller, network });
    res.json(result);
  } catch (error: any) {
    console.error("Error in /analyze-tx endpoint:", error?.message || error);
    res.status(500).json({
      error: "Failed to analyze transaction",
      message: error?.message || "Unknown error occurred"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});