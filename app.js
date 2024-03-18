//initialize express app
const express = require("express");
//initialized teachablemachine package
const TeachableMachine = require("@sashido/teachablemachine-node");

const app = express();

//gets teachablemachine model using the modelurl from the project
const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/JG2cKYo5c/"
});

app.get("/", async (req, res) => {
  try {
    const predictions = await model.classify({
      //gives image url to the trained model
      imageUrl: "https://imageresizer.static9.net.au/7hupUTiuoadkTC7HIgZrPcyVO5c=/265x0:895x630/400x0/https%3A%2F%2Fprod.static9.net.au%2Ffs%2F3f2547d3-6c2a-46ff-b17e-07056c40910d",
    });
    //if prediction is successfull
    res.send(`<pre>${JSON.stringify(predictions, null, 2)}</pre>`); // Render predictions as JSON to html

  } catch (error) { //if something goes wrong/error it console.logs the error and returns and internal server error
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//initialize and listens to the port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});