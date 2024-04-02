//initialize express app
const express = require("express");

//initialized teachablemachine package
const TeachableMachine = require("@sashido/teachablemachine-node");

const FormData = require('form-data');
const multer = require('multer');

const path = require('path');
const app = express();

app.use(express.static(__dirname + '/public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define the directory for views
app.set('views', path.join(__dirname, 'views'));


// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//gets teachablemachine model using the modelurl from the project
const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/JG2cKYo5c/"
});

app.get("/", (req, res) => {
  
  res.render('index', { message: 'Hello, World!' });
})

// app.get("/", (req, res) => {
//   // try {
//   //   const predictions = await model.classify({
//   //     //gives image url to the trained model
//   //     imageUrl: "https://peoplaid.com/wp-content/uploads/2019/02/Kathryn-Bernardo.jpg",
//   //   });
//   //   //if prediction is successfull
//   //   res.send(`<pre>${JSON.stringify(predictions, null, 2)}</pre>`); // Render predictions as JSON to html

//   // } catch (error) { //if something goes wrong/error it console.logs the error and returns and internal server error
//   //   console.error("Error:", error);
//   //   res.status(500).send("Internal Server Error");
//   // }
//   res.send(
//     `<div>
//       <form action="/upload" method="post" enctype="multipart/form-data">
//         <input type="file" name="image" filename="photo.jpg"/>
//         <button type="submit">Submit</button>
//       </form>
//     </div>`
//   );
// });

app.post("/upload", upload.single('image'), async (req, res) => {
  const sampleKey = "42039efd6f0e27cab389b7de387c3faf"; // Replace this with your actual ImgBB API key
  const form = new FormData(); // Creates empty form
  
  form.append("image", req.file.buffer, "fileName"); //uploads the file uploaded buffer into the empty form

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${sampleKey}`, { // submits the created form to the imgbb api
    method: "POST",
    body: form,
  });
  
  const data = await response.json();
  const url = data.data.url

  const predictions = await model.classify({
    //gives image url to the trained model
    imageUrl: url,
  });
  
  console.log(predictions)

  const predictionData = []
  
  //prediction data with proper percentage value
  for(const data of predictions){
    predictionData.push(
      {
        class: data.class,
        score: (Math.round(data.score * 100)).toFixed(0)
      }
    )
  }
  
  //getting the highest shape
  const highestShapePercentage = predictions.reduce((prev, current) => {
    return (prev.score > current.score) ? prev : current;
  });

  //setting outline image based on highest shape percentage
  let shapeOutline
  switch(highestShapePercentage.class) {
    case "Oblong":
      shapeOutline = "images/oblong.png";
      break;
    case "Square":
      shapeOutline = "images/square.png";
      break;
    case "Round":
      shapeOutline = "images/round.png";
      break;
    case "Oval":
      shapeOutline = "images/oval.png";
      break;
    case "Heart":
      shapeOutline = "images/heart.png";
      break;
  }

  // res.send(`<p>${JSON.stringify(predictions, null, 2)}`);
  console.log(predictions)
  res.render('upload', 
    { predictions:predictionData,
      imageUrl: url ,
      highestShapePercentage: highestShapePercentage.class,   
      shapeOutline,
    });
});

//change
//initialize and listens to the port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//sample