import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2";
import multer from "multer";
import fileUpload from "express-fileupload";
import path from "path";
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
// const port = 8000;
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  queueLimit: 0
});


db.getConnection((err, conn) => {
  if(err) console.log(err)
  console.log("Connected successfully")
  // connection.end();
})


export default db.promise()

const PORT = 3306

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.resolve("static")));

app.get("/api/get", (req, res) => {
  console.log('get api')

  const sqlGet = "SELECT * FROM cars";
  db.query(sqlGet, (error, result) => {
    res.send(result);
  });
});

// app.get("/api/get/:id", (req, res) => {
//   const { id } = req.params;
//   const sqlGet = "SELECT * FROM car_db WHERE id = ?";
//   db.query(sqlGet, id, (error, result) => {
//     if (error) {
//       console.log(error);
//     }
//     res.send(result);
//   });
// });

app.get("/api/get/:id", (req, res) => {
  console.log(req.params)

  const { id } = req.params;
  const sqlGet = "SELECT * FROM cars WHERE id = ?";
  db.query(sqlGet, id, (error, result) => {
    if (error) {
      console.log(error, id);
    }
    res.send(result);
  });

});

app.put("/api/update/:id", (req, res) => {
  const { id } = req.params;
  const {
    name,
    year,
    color,
    price,
    driving,
    image,
    mainimage,
    secondimage,
    thirdimage,
    country,
    mileage,
    description,
    equipment,
  } = req.body;
  const sqlUpdate =
    "UPDATE cars SET name = ?, year = ?, color = ?, price = ?, driving = ?, image = ? WHERE id = ?,mainimage = ?, secondimage = ?, thirdimage = ?, country = ?, mileage = ?, description = ?, equipment = ?";
  db.query(
    sqlUpdate,
    [
      name,
      year,
      color,
      price,
      driving,
      image,
      id,
      mainimage,
      secondimage,
      thirdimage,
      country,
      mileage,
      description,
      equipment,
    ],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      res.send(result);
    }
  );
});

app.delete("/api/remove/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM cars WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

// app.post("/api/post", (req, res) => {
//   const {
//     name,
//     year,
//     color,
//     price,
//     driving,
//     image,
//     mainimage,
//     secondimage,
//     thirdimage,
//     country,
//     mileage,
//     description,
//     equipment,
//   } = req.body;
//   const sqlInsert =
//     "INSERT INTO car_db (name, year, color, price, driving, image, mainimage, secondimage, thirdimage, country, mileage, description, equipment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
//   db.query(
//     sqlInsert,
//     [
//       name,
//       year,
//       color,
//       price,
//       driving,
//       image,
//       mainimage,
//       secondimage,
//       thirdimage,
//       country,
//       mileage,
//       description,
//       equipment,
//     ],
//     (error, result) => {
//       if (error) {
//         console.log(error);
//       }
//     }
//   );
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

app.post("/api/post", (req, res) => {
  const {
    name,
    year,
    color,
    price,
    driving,
    mainimage,
    secondimage,
    thirdimage,
    country,
    mileage,
    description,
    equipment,
  } = req.body;
  const { image, secondimage: secImageFile, thirdimage: thirdImageFile, mainimage: mainImageFile } = req.files;

  if (!image) {
    res.status(400).json({ error: "No file was uploaded" });
    return;
  }
  
  let fileName = crypto.randomUUID() + "." + image.mimetype.split("/")[1];

  image.mv(path.resolve("static", fileName));

    let secFileName = crypto.randomUUID() + "." + secImageFile.mimetype.split("/")[1]
    let thirdFileName = crypto.randomUUID() + "." + thirdImageFile.mimetype.split("/")[1]
    let mainFileName = crypto.randomUUID() + "." + mainImageFile.mimetype.split("/")[1]


    secImageFile.mv(path.resolve("static", secFileName));
    thirdImageFile.mv(path.resolve("static", thirdFileName));
    mainImageFile.mv(path.resolve("static", mainFileName));



  const sqlInsert =
    "INSERT INTO cars (name, year, color, price, driving, image, mainimage, secondimage, thirdimage, country, mileage, description, equipment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sqlInsert,
    [
      name,
      year,
      color,
      price,
      driving,
      fileName,
      mainFileName,
      secFileName,
      thirdFileName,
      country,
      mileage,
      description,
      equipment,
    ],
    (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to insert data into database" });
      } else {
        res.status(200).json({ message: "Data inserted successfully" });
      }
    }
  );
});
app.get("/", (req, res) => {
  console.log('hi')
});

app.listen(PORT, () =>
  console.log(`server is listening on port: http://localhost:${PORT}`)
);



