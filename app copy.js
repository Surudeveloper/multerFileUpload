const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json()) 
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// function Func(req, file, cb){
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
// }

// var obj={
//     destination: './uploads/',
//     filename: Func
// };

// const storage = multer.diskStorage(obj)

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('myFile');

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Route for uploading file
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send({ message: err });
    } else {
      if (req.file == undefined) {
        res.send({ message: 'No file selected!' });
      } else {
        res.send({
          message: 'File uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));