var port = process.env.PORT || 5000
const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyparser = require('body-parser')
app.use(bodyparser.json())
const path = require('path')
const cors = require('cors')
app.use(cors())

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


app.post('/registrationdata', (req, res) => {

    if (!req.body.hasOwnProperty('FirstName') && !req.body.hasOwnProperty('LastName') && !req.body.hasOwnProperty('Gender') && !req.body.hasOwnProperty('UserName') && !req.body.hasOwnProperty('Password') && !req.body.hasOwnProperty('ConfirmPassword') && !req.body.hasOwnProperty('phoneno') && !req.body.hasOwnProperty('role')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    } else {

        connection.query('Insert into registrationdata (FirstName,LastName,Gender,UserName,Password,ConfirmPassword,phoneno,role) values(?,?,?,?,?,?,?,?)',
            [req.body.FirstName, req.body.LastName, req.body.Gender, req.body.UserName, req.body.Password, req.body.ConfirmPassword, req.body.phoneno, req.body.role], (err, row) => {
                if (err) {
                    res.status(500).send({ "Status": 500, "Info": "Registration unsuccessfull " })
                }
                else {

                    res.status(200).send({ 'id': row.insertId, 'Info': 'Registeration  Successfull' })
                }



            })
    }
})


app.post('/login', function (req, res) {

    if (!req.body.hasOwnProperty('UserName') && !req.body.hasOwnProperty('Password')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    }
    else {

        connection.query("SELECT * FROM registrationdata", [req.body.UserName, req.body.Password], (err, result) => {
            if (err) {
                res.status(500).send({ "Status": 500, "Info": "Internal server error :" + err })
            };
            if (result.length > 0) {
                let userData;
                for (var i = 0; i < result.length; i++) {
                    if ((result[i].UserName === req.body.UserName) && (result[i].Password === req.body.Password)) {
                        userData = result[i]
                    }

                }
                if (userData) {

                    res.status(200).send({ "Status": 200, "FirstName": userData.FirstName, "LastName": userData.LastName, "Gender": userData.Gender, "phoneno": userData.phoneno, "role": userData.role, "ID": userData.ID })

                } else {
                    res.status(401).send({ "Status": 401, "Info": "Invalid crediantals" })
                }
            }
            else {
                res.status(404).send({ "Status": 404, "Info": "user not found" })

            }
        });
    }
});


app.put('/update', (req, res) => {
    if (!req.body.hasOwnProperty('FirstName') && !req.body.hasOwnProperty('LastName') && !req.body.hasOwnProperty('Gender') && !req.body.hasOwnProperty('Password') && !req.body.hasOwnProperty(ConfirmPassword) && !req.body.hasOwnProperty('role')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    } else {
        connection.query('update registrationdata set FirstName=?,LastName=?,Gender=?,Password=?,ConfirmPassword=?,phoneno=?,role=? where ID=?',
            [req.body.FirstName, req.body.LastName, req.body.Gender, req.body.Password, req.body.ConfirmPassword, req.body.phoneno, req.body.role, req.body.ID], (err, data) => {
                if (err) {
                    res.status(500).send({ "Status": 500, "Info": "Internal server error " })
                }
                else {
                    connection.query(`select FirstName,LastName,Gender,PhoneNo,role from registrationdata where ID=${req.body.ID}`, (error, result) => {
                        if (!error) {
                            res.status(200).send({"Status" : 200, result, "Info": "updated successfully" })


                        }
                    })
                }


            })
    }
})

// app.delete('/registrationdata', (req, res) => {
//     connection.query('delete from registrationdata where ID=?', [req.body.ID], (err, data) => {
//         if (!err)
//             res.send(data)
//         else
//             res.send(err)
//     })
// })


//userpost table 


app.post('/createpost', (req, res) => {
    if (!req.body.hasOwnProperty('FirstName') && !req.body.hasOwnProperty('LastName') && !req.body.hasOwnProperty('role') && !req.body.hasOwnProperty('post') && !req.body.hasOwnProperty('post') && !req.body.hasOwnProperty('postedOn')
        && !req.body.hasOwnProperty('status') && !req.body.hasOwnProperty('title') && !req.body.hasOwnProperty('ID')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    }
    else {
        connection.query('INSERT into userpost(FirstName,LastName,role,post,postedOn,status,title,ID) values(?,?,?,?,?,?,?,?)',
            [req.body.FirstName, req.body.LastName, req.body.role, req.body.post, req.body.postedOn, req.body.status, req.body.title, req.body.ID], (err, data) => {
                if (err) {
                    res.status(500).send({ "Status": 500, "Info": "Internal server error " })
                }
                else
                    res.status(200).send({ "Status": 200, "Info": "posted alert data successfully" })
            })
    }
})



app.get('/home', (req, res) => {
    if (!req.body.hasOwnProperty('ID')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    }
    connection.query((`SELECt * from userpost where status=1 AND ID=${req.body.ID}`), (err, result) => {
        if (err) {
            res.status(500).send({ "Status": 500, "Info": "Internal server error :" + err })
        }
        if (result.length > 0) {
            res.status(200).send({"Status" : 200, "Info" : result})

        }
        else
            res.status(404).send({"Status" : 404, "Info" : "can not fetch the userpost data"})

    })
})

app.get('/mypost/:ID', (req, res) => {
    if (!req.params.hasOwnProperty('ID')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    }
    connection.query(`SELECT * from userpost WHERE ID=${req.params.ID}`, (err, data) => {
        if (err) {
            res.status(500).send({ "Status": 500, "Info": "Internal server error :" + err })
        }
        if (data.length > 0) {
            res.status(200).send({"Status" : 200, "Info" : data})
        }
        else
            res.status(404).send({"Status" : 200, "Info" : "unable to get the data"})
    })
})



app.get('/request', (req, res) => {
    connection.query(("SELECt * from userpost where status=0 "), (err, result) => {
        if (err) {
            res.status(500).send({ "Status": 500, "Info": "Internal server error :" + err })
        }
        if (result.length > 0) {
            res.status(200).send({"Status" : 200, "Info" : result})
        }

        else
        res.status(404).send({"Status" : 404, "Info" : "unable to fetch the request data"})
    })
})


app.put('/approve', (req, res) => {
    if (!req.body.hasOwnProperty('pid')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    } else {
        connection.query(`update userpost set status=1 where pid=${req.body.pid}`, (err, data) => {
            if (err) {
                res.status(500).send({ "Status": 500, "Info": "Internal server error" })
            }
            
            if (data) {
                res.status(200).send({"Status" : 200, "Info" : data})
            }
            else {
                res.status(404).send({"Status" : 404, "Info" : "could not approve the data"})
            }
        })
    }
})

app.put('/reject', (req, res) => {
    if (!req.body.hasOwnProperty('pid')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    } else {
        connection.query(`update userpost set status=2 where pid=${req.body.pid}`, (err, data) => {
            if (err) {
                res.status(500).send({ "Status": 500, "Info": "Internal server error " })
            }
            if(data) {
            
                res.status(200).send({ "Status": 200, "Info": "post rejected" })
            }
            else {
                res.status(404).send({"Status" : 404, "Info" : "could not reject the data"})
            }

        })
    }
})

app.get('/rejected', (req, res) => {
    connection.query(("SELECt * from userpost where status=2 "), (err, result) => {
        if (err) {
            res.status(500).send({ "Status": 500, "Info": "Internal server error :" + err })
        }
        if (result.length > 0) {
            res.status(200).send({"Status" :200, "Info" :result})
        }

        else
            res.status(404).send({"Status": 404, "Info" : "can not get the rejected data"})
    })
})

app.get('/adminhome', (req, res) => {
    connection.query(("SELECt * from userpost where status=1 "), (err, result) => {
        if (err) {
            res.status(500).send({ "Status": 500, "Info": "Internal server error :" + err })
        }
        if (result.length > 0) {
            res.status(200).send({"Status" :200, "Info" :result})
        }

        else
        res.status(404).send({"Status": 404, "Info" : "can not get the home data"})
    })
})


app.put('/editpost', (req, res) => {
    if (!req.body.hasOwnProperty('pid')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    } else {
        connection.query(`update userpost set post=?,postedOn=?,title=? where pid=${req.body.pid}`,
            [req.body.post, req.body.postedOn, req.body.title], (err, data) => {
                if (err) {
                    res.status(500).send({ "Status": 500, "Info": "Internal server error " })
                }
                if(data) {
                    res.status(200).send({ "Status": 200, "Info": data })
                }
                else 
                {
                    res.status(404).send({"Status": 404, "Info" : "could not updated the post data"})
                }
            })
    }
})




app.delete('/deletepost/:pid', (req, res) => {
    if (!req.params.hasOwnProperty('pid')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    } else {
        connection.query('delete from userpost where pid=?', [req.params.pid], (err, data) => {
            if (err) {
                res.status(500).send({ "Status": 500, "Info": "Internal server error " })
            }

            if (data){
                res.status(200).send({ "Status": 200, "Info": "Post deleted Successfully" })
            }
            else {
                res.status(404).send({ "Status": 404, "Info": "unable to delete post" })
            }
        })
    }
})


//alert table

app.post('/createalert', (req, res) => {
    if (!req.body.hasOwnProperty('sno') && !req.body.hasOwnProperty('name') && !req.body.hasOwnProperty('link') && !req.body.hasOwnProperty('createdOn') && !req.body.hasOwnProperty('statusAction')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    }
    else {
        connection.query('INSERT into alert(sno,name,link,createdOn,statusAction) values(?,?,?,?,?)',
            [req.body.sno, req.body.name, req.body.link, req.body.createdOn, req.body.statusAction], (err, data) => {
                if (err) {
                    res.status(500).send({ "Status": 500, "Info": "Internal server error " })
                }
                else
                    res.status(200).send({ "Status": 200, "Info": "posted alert data successfully" })

            })
    }
})


app.get('/alerthome', (req, res) => {

    connection.query(("SELECt * from alert"), (err, result) => {
        if (err) {
            res.status(500).send({ "Status": 500, "Info": "Internal server error :" + err })
        }
        if (result.length > 0) {
            res.status(200).send({"Status" : 200, "Info": result})
        }

        else
            res.status(404).send({"Status": 404, "Info": "can't get the alert home data" })
    })
})



app.put('/updatealert', (req, res) => {
    if (!req.body.hasOwnProperty('name') && !req.body.hasOwnProperty('link') && !req.body.hasOwnProperty('createdOn') && !req.body.hasOwnProperty('statusAction')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    } else {
        connection.query(`update alert set name=?,link=?,createdOn=?,statusAction=? where sno=${req.body.sno}`,
            [req.body.name, req.body.link, req.body.createdOn, req.body.statusAction], (err, data) => {
                if (err) {
                    res.status(500).send({ "Status": 500, "Info": "Internal server error " })
                }
                if(data){
                    res.status(200).send({ "Status": 200, "Info": "update alert data successfully" })
                }
                else{
                    res.status(404).send({"Status" : 404, "Info" : "can't update the alert data"})
                }
            })
    }
})


app.delete('/deletealert/:sno', (req, res) => {
    if (!req.params.hasOwnProperty('sno')) {
        res.status(400).send({ "Status": 400, "Info": "Bad request" })
    } else {
        connection.query('delete from alert where sno=?', [req.params.sno], (err, data) => {
            if (err) {
                res.status(500).send({ "Status": 500, "Info": "Internal server error " })
            }
            if (data){
                res.status(200).send({ "Status": 200, "Info": "alert deleted successfully" })
            }
            else {
                res.status(404).send({ "Status": 404, "Info": "unable to delete alert data" })
            }
               
        })
    }
})


app.get('/alertstatus', (req, res) => {
    connection.query('select * from alert where statusAction=1', (err, data) => {
        if (err) {
            res.status(500).send({ "Status": 500, "Info": "Internal server error :" + err })
        }
        if (data.length > 0) {
            res.status(200).send({"Status": 200, "Info": data})
        }
        else
            res.status(404).send({"Status" : 404, "Info" : "can't fetch the alert status"})
    })
})



app.listen(port, () => console.log(`server is running on port no: ${port}`))