const express = require("express");
const TeachableMachine = require("@sashido/teachablemachine-node");

const app = express();

const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/JG2cKYo5c/"
});

app.get("/", async (req, res) => {
  try {
    const predictions = await model.classify({
      imageUrl: `${imageVariable}`,
    });
    res.send(`<pre>${JSON.stringify(predictions, null, 2)}</pre>`); // Render predictions as JSON
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});