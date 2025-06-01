import express from "express";
import fetch from "node-fetch"; // ES module version
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const API_KEY = process.env.API_KEY;
const UNIVERSE_ID = process.env.UNIVERSE_ID;
const DATASTORE_NAME = "ALPHA1"; // Your Datastore name

const BASE_URL = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`;

app.get("/getPlayerData", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).send("Missing userId");

  const url = `${BASE_URL}?datastoreName=${DATASTORE_NAME}&entryKey=Player_${userId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).send("Failed to fetch: " + text);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).send("Proxy error");
  }
});

app.get("/", (_, res) => res.send("Roblox Datastore Proxy is running."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
