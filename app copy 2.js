const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname + '/uploads'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

// const upload = multer({dest:"uploads/"})                             // not use now
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        return cb(null, `${file.originalname}`)
        // return cb(null, `${Date.now()}-${file.originalname}`)
    },
});

const upload = multer({storage})

app.get('/', (req, res) => {
    res.render('index')
})

// Route for uploading file
app.post('/upload', upload.single('upldFile'), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    
    const image = req.file
    const name = req.body.upldFileName
    res.render('display', { title: name, image:image.originalname})
    // res.render('display', { title: name, image:image.name})
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));