const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname + '/uploads')) //know this later
app.set('view engine', 'ejs')                   //know this later

// app.use(express.urlencoded({ extended: false })) //know this later
app.use(express.json())

// const upload = multer({dest:"uploads/"})      // not use now

const storage = multer.diskStorage({
    destination: (req,file, fn)=>{
        return fn(null, "./uploads")
    },
    filename:(req, file, fn)=>{
        return fn(null, file.originalname)
    }
})

const upload = multer({storage}).single('upldFile')

app.get('/', (req, res) => {
    res.render('index')
})

// Route for uploading file with upload as a middleware
// app.post('/upload', upload, (req, res) => {
//     // console.log(req.body);
//     // console.log(req.file);
    
//     const image = req.file.originalname
//     const name = req.body.upldFileName
//     res.render('display', { title: name, image:image})
// });

// Route for uploading file with error handling
app.post('/upload', (req, res) => {
    upload(req,res, (err)=>{
        if(!err){
            if (req.file == undefined) {
                res.send({ message: 'No file selected!' });
            } else {
                const image = req.file?.originalname
                const name = req.body?.upldFileName
                res.render('display', { title: name, image:image})
            }
        } else{
            res.send({ message: err });
        }
    })
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
