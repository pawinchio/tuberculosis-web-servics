const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
var mysql      = require('mysql');
var bodyParser=require("body-parser");
var connection = mysql.createConnection({
              host     : '85.10.205.173',
              user     : 'tb_admin',
              password : '0805025529',
              database : 'tbofficeai'
            });
            connection.connect();
 
            global.db = connection;

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
//============================reder page==============================
app.get('/', (req, res) => res.render('login'));
app.get('/index', (req, res) => res.render('index'));
app.get('/upload', (req, res) => res.render('upload'));

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
        var sql ="INSERT INTO `Image`(`time`,`input_path`,`output_path`,`resut`, `user_id`) VALUES ('" + '2020-02-1515.10.05' + "','" + 'uploads/'+ "','" + '-' + "','" + 'processing' + "','" + 2 + "')";
        var query = db.query(sql, function(err, result) {

          message = "File Uploaded!";
          res.render('index.ejs',{message: message});
       });
        
          // res.render('upload', {
        //   msg: 'File Uploaded!',
        //   file: `uploads/${req.file.filename}`
        // });

      }
    }
  });
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
