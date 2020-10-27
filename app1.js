var port = process.env.PORT || 5000
const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyparser = require('body-parser')
app.use(bodyparser.json())
const path = require('path')
const cors = require('cors')
app.use(cors())
const nodemailer = require('nodemailer')
const creds = require("./config")
const fileUpload = require("express-fileupload")
require('dotenv').config()
var moment = require('moment')


const multer = require("multer")
const AWS = require('aws-sdk')
const uuid = require('uuid/v4')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
})

const storage = multer.memoryStorage({
   destination: function (req, file, cb) {
            cb(null, '')
        }
  })

  const upload = multer({ storage }).single('file');

// const storage = multer.diskStorage({
//     // destination: function (req, file, cb) {
//     //     cb(null, './uploads/')
//     // },
//     file: function (req, file) {
//         return new Promise((resolve, reject) => {
//             var i = file.originalname
//             const fileInfo = {
//                 filename: i
               

//             };
//             resolve(fileInfo)

//             // cb(null, new Date().toISOString() + file.originalname)
//         })

//     }

// })



// const fileFilter = (req,file, cb) => {
//     //reject a file
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
//         cb(null, true)
//     } else{
//         cb(null, false)

//     }

// }



var swaggerUi = require('swagger-ui-express'),
    YAML = require('yamljs'),
    swaggerDocument = YAML.load(path.join(__dirname + '/swagger .yaml'));
var options = {
    swaggerOptions: {
        docExpansion: 'none'
    }
};
app.use('/apiSpec', swaggerUi.serve);
app.get('/apiSpec', swaggerUi.setup(swaggerDocument, options));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'miracle'
})
connection.connect((err) => {
    if (!err)
        console.log('DB connected successfully')
    else
        console.log('DB connection failed \n Error :' + JSON.stringify(err, undefined, 2))
})


/* app.post("/upload",upload.single("photo"),(req,res)=>{
    console.log(req.file.filename)
    console.log(req.body.name)
    res.send(req.file.filename)
}
) */


app.post('/registrationdata', (req, res) => {

    upload(req, res, function (err) {
        //if (request.body.hasOwnProperty('sessionid')) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
        } else if (err) {
            // An unknown error occurred when uploading.
           // resolve(err)
           res.send(err)
        }

        var transport = {
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: creds.USER,
                pass: creds.PASS
            }
        }
        var transporter = nodemailer.createTransport(transport)

        transporter.verify((error, success) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take messages');
            }
        });


        console.log(req.file,req,  "fileUpload")
        connection.query('Insert into registrationdata (FirstName,LastName,Gender,UserName,Password,ConfirmPassword,phoneno,role,image) values(?,?,?,?,?,?,?,?,?)',
            [req.body.FirstName, req.body.LastName, req.body.Gender, req.body.UserName, req.body.Password, req.body.ConfirmPassword, req.body.phoneno, req.body.role, req.file], (err, row) => {
                const toEmail = req.body.UserName
                const subject = "Account Created"
                var mail = {
                    from: "Venkatesh",
                    to: toEmail,
                    subject: subject,
                    html: `
                    
                    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <title>Registration Successful Message Example</title>
    <meta name="author" content="Codeconvey" />
   <style>
     body {
  background: gray;
}
#card {
  position: relative;
  width: 320px;
  display: block;
  margin: 40px auto;
  text-align: center;
  font-family: 'Source Sans Pro', sans-serif;
}
#upper-side {
  padding: 2em;
  background-color: #2e69d9;;
  display: block;
  color: #fff;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
}
#checkmark {
  font-weight: lighter;
  fill: #fff;
  margin: -3.5em auto auto 20px;
}
#status {
  font-weight: lighter;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1em;
  margin-top: -.2em;
  margin-bottom: 0;
}
#lower-side {
  padding: 2em 2em 5em 2em;
  background: #e1e4eb;
  display: block;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
}
#message {
  margin-top: -.5em;
  color: #000;
  letter-spacing: 1px;
}
#contBtn {
  position: relative;
  top: 1.5em;
  text-decoration: none;
  background: #2e69d9;;
  color: #fff;
  margin: auto;
  padding: .8em 3em;
  -webkit-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.21);
  -moz-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.21);
  box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.21);
  border-radius: 25px;
  -webkit-transition: all .4s ease;
		-moz-transition: all .4s ease;
		-o-transition: all .4s ease;
		transition: all .4s ease;
}
#contBtn:hover {
  -webkit-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.41);
  -moz-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.41);
  box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.41);
  -webkit-transition: all .4s ease;
		-moz-transition: all .4s ease;
		-o-transition: all .4s ease;
		transition: all .4s ease;
}
   </style>
	
</head>
<body>
<section>
    <div class="rt-container">
          <div class="col-rt-12">
              <div class="Scriptcontent">
              
<div id='card' class="animated fadeIn">
  <div id='upper-side'>
    <?xml version="1.0" encoding="utf-8"?>
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg version="1.1" id="checkmark" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" xml:space="preserve">
        <path d="M131.583,92.152l-0.026-0.041c-0.713-1.118-2.197-1.447-3.316-0.734l-31.782,20.257l-4.74-12.65
	c-0.483-1.29-1.882-1.958-3.124-1.493l-0.045,0.017c-1.242,0.465-1.857,1.888-1.374,3.178l5.763,15.382
	c0.131,0.351,0.334,0.65,0.579,0.898c0.028,0.029,0.06,0.052,0.089,0.08c0.08,0.073,0.159,0.147,0.246,0.209
	c0.071,0.051,0.147,0.091,0.222,0.133c0.058,0.033,0.115,0.069,0.175,0.097c0.081,0.037,0.165,0.063,0.249,0.091
	c0.065,0.022,0.128,0.047,0.195,0.063c0.079,0.019,0.159,0.026,0.239,0.037c0.074,0.01,0.147,0.024,0.221,0.027
	c0.097,0.004,0.194-0.006,0.292-0.014c0.055-0.005,0.109-0.003,0.163-0.012c0.323-0.048,0.641-0.16,0.933-0.346l34.305-21.865
	C131.967,94.755,132.296,93.271,131.583,92.152z" />
        <circle fill="none" stroke="#ffffff" stroke-width="5" stroke-miterlimit="10" cx="109.486" cy="104.353" r="32.53" />
      </svg>
      <h3 id='status'>
      Success
    </h3>
  </div>
  <div id='lower-side'>
    <p id='message'>
      Hello ${req.body.FirstName}
      Congratulations, your account has been successfully created.
    </p>
    <a href="https://www.google.com/" id="contBtn">Continue To LogIn</a>
  </div>
</div>
<!-- partial -->
    		
           
    		</div>
		</div>
    </div>
</section>
     
    <!-- Analytics -->
	</body>
</html>
                    
                `

                }

                transporter.sendMail(mail, (err, info) => {


                    if (err) {

                        res.status(500).send({ "Status": 500, "Info": "Registration unsuccessfull " })

                    }
                    else {

                        res.status(200).send({ 'id': row.insertId, 'Info': 'Registeration  Successfull' })
                    }

                })

            })
    })

})




app.listen(port, () => console.log(`server is running on port no: ${port}`))