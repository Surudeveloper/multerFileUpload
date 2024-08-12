const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname + '/uploads'))
app.set('view engine', 'ejs') 

// app.use(express.urlencoded({ extended: false }))
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


{/* <form action="/profile" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" />
</form> */}

app.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
})
  
app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
})
  
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
    // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
    //
    // e.g.
    //  req.files['avatar'][0] -> File
    //  req.files['gallery'] -> Array
    //
    // req.body will contain the text fields, if there were any
})

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
