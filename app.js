const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const mysql = require('./mysql_config.js')
var bodyParser=require("body-parser");


// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
//============================upload&check====================================================
// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 100000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

//==============================================================

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));


// init
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//============================reder page==============================
app.get('/', (req, res) => res.render('login'));
app.get('/index', (req, res) => res.render('index'));
app.get('/upload', (req, res) => res.render('upload'));
app.get('/sign-up', (req, res) => res.render('sign-up'));
//===========================post upload===================================
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('upload', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('upload', {
          msg: 'Error: No File Selected!'
        });
      } else {
        var date = new Date();   
        var time = date.toISOString().slice(0, 19).replace('T', ' ');
        console.log(date)
        console.log(time)
        var photo_id = '5';
        let sql ="INSERT INTO `Image`(`time`,`input_path`,`output_path`,`resut`, `user_id`) VALUES ('" + time + "','" + 'uploads/'+req.file.filename+ "','" + '-' + "','" + 'processing' + "','" + 1+ "')";
        console.log(sql)
        return mysql.connect(sql)
        res.render('index.ejs');

      }
    }
  });
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));

//============================sign up======================================
app.post('/sign-up', (req, res) => {
      
      var name= req.body.user_name;
      var pass= req.body.password;
      var fname= req.body.first_name;
      var lname= req.body.last_name;
      var mob= req.body.mob_no;
      var email= req.body.Email;

      var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`username`, `password`,`email`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "','" + email + "')";
      console.log(sql)
      return mysql.connect(sql)
      res.render('login.ejs');
});


//========================================================================