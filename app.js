//initialize express app
const express = require("express");

//initialized teachablemachine package
const TeachableMachine = require("@sashido/teachablemachine-node");

const FormData = require('form-data');
const multer = require('multer');

const app = express();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//gets teachablemachine model using the modelurl from the project
const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/JG2cKYo5c/"
});


app.get("/", (req, res) => {
  // try {
  //   const predictions = await model.classify({
  //     //gives image url to the trained model
  //     imageUrl: "https://peoplaid.com/wp-content/uploads/2019/02/Kathryn-Bernardo.jpg",
  //   });
  //   //if prediction is successfull
  //   res.send(`<pre>${JSON.stringify(predictions, null, 2)}</pre>`); // Render predictions as JSON to html

  // } catch (error) { //if something goes wrong/error it console.logs the error and returns and internal server error
  //   console.error("Error:", error);
  //   res.status(500).send("Internal Server Error");
  // }
  res.send(
    `<div>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="image" filename="photo.jpg"/>
        <button type="submit">Submit</button>
      </form>
    </div>`
  );
});

app.post("/upload", upload.single('image'), async (req, res) => {
  const sampleKey = "eab0739d80f71a3ed7e2ab03742b57e5"; // Replace this with your actual ImgBB API key
  const form = new FormData(); // Creates empty form
  
  form.append("image", req.file.buffer, "fileName"); //uploads the file uploaded buffer into the empty form

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${sampleKey}`, { // submits the created form to the imgbb api
    method: "POST",
    body: form,
  });

  console.log("res: ", response);
  const data = await response.json();
  const url = data.data.url
  
  const predictions = await model.classify({
    //gives image url to the trained model
    imageUrl: url,
  });
  
  console.log(predictions)

  const array = [] 
  
  for(const data of predictions){
    console.log(`${Math.round(data.score * 100)} % , ${data.class}`)
  }

  res.send(`<p>${JSON.stringify(predictions, null, 2)}`);
  
});

//change
//initialize and listens to the port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//sample