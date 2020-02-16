
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var mob= post.mob_no;
      var email= post.Email;

      var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`username`, `password`,`email`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "','" + email + "')";

      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
     
      var sql="SELECT id, first_name, last_name, username FROM `users` WHERE `username`='"+name+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
  

exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }
   
   else {
      var sql="SELECT * FROM `Image` WHERE `user_id`='"+userId+"'";
   

      db.query(sql, function(err, result){
         res.render('dashboard.ejs', {data:result});    
      });
   }
   
       
};




//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";        
   db.query(sql, function(err, results){ 
      if(results.length){
      res.render('profile.ejs',{data:results});
      }
      else{
         res.render('profile.ejs',{data:null});
      }
   });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
   if(req.method == "POST"){
         var post  = req.body;
         var userId = req.session.userId;;
         var time =Date.now();
         var output ="-";
         var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
      
        if (!req.files)
               return res.status(400).send('No files were uploaded.');
      
         var file = req.files.uploaded_image;
         var img_name=file.name;
      
            if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                    
                 file.mv('public/images/upload_images/'+file.name, function(err) {
                                
                    if (err)
      
                      return res.status(500).send(err);
                        var sql1 = "INSERT INTO `Image`(`time`,`input_path`,`user_id`, `output_path` ,`result`) VALUES ('" + time+ "','" +'public/images/upload_images/'+file.name  + "','" + userId + "','" + output + "','" + 'processing' + "')";
      
                         var query = db.query(sql1, function(err, result) {
                           db.query(sql, function(err, result){
                              res.render('dashboard.ejs', {data:result});    
                           });
                         });
                     });
             } else {
               message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
               res.render('index.ejs',{message: message});
             }
      } else {
         db.query(sql, function(err, result){
            res.render('dashboard.ejs', {data:result});    
         });
      }

   // var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   // db.query(sql, function(err, results){
   //    res.render('edit_profile.ejs',{data:results});
   // });
};

//-----------------------------upload photo data in local web and to mysql ---------------------------

exports.upload = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var mob= post.mob_no;
      var email= post.Email;

      var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`username`, `password`,`email`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "','" + email + "')";

      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('index.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};


//------------------------------------------------------------------------------------------