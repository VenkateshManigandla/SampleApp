const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyparser = require('body-parser')
app.use(bodyparser.json())
const path = require('path')

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
    connection.query('Insert into registrationdata(FirstName,LastName,Gender,UserName,Password,ConformPassword,phoneno) values(?,?,?,?,?,?,?)',
        [req.body.FirstName, req.body.LastName, req.body.Gender, req.body.UserName, req.body.Password, req.body.ConformPassword, req.body.phoneno], (err, row) => {
         
            if (!err)
                res.send({ 'id': row.insertId, 'info': 'Registeration  Successfull' })
               
                else
                res.send({ 'info': 'Registration unsuccessfull' })
      

        })
})


app.post('/login', function (req, res) {

    connection.query("SELECT * FROM registrationdata", [req.body.UserName, req.body.Password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            let userData;
            for (var i = 0; i < result.length; i++) {
                if ((result[i].UserName === req.body.UserName) && (result[i].Password === req.body.Password)) {
                    userData = result[i]
                }

            }
            if (userData) {
                console.log(userData)
                //res.send({"Status":200,"Info":userData.UserName +" Your Login Successfull"})
                res.send({ "FirstName": userData.FirstName, "LastName": userData.LastName, "Gender": userData.Gender, "phoneno": userData.phoneno })

            } else {
                res.send('Invalid Credentials')
            }
        }
        else {
            res.send('User not found')

        }


    });
});


app.put('/update/:ID', (req, res) => {
    connection.query('update registrationdata set FirstName=? where ID=?', [req.body.FirstName, req.params.ID], (err, data) => {
        if (!err)
            res.send('Data updated successfully')
        else
            console.log(err)

    })
})

app.get('/registrationdata/:id', (req, res) => {
    connection.query('select * from  registrationdata where id=?', [req.params.id], (err, data) => {
        if (!err)
            res.send('Successfully fetched the data')
        else
            console.log(err)

    })
})

app.delete('/registrationdata/:id', (req, res) => {
    connection.query('delete from registrationdata where id=?', [req.params.id], (err, data) => {
        if (!err)
            res.send('Data deleted successfully')
        else
            res.send(err)
    })
})


//post table 

app.get('/home', (req, res) => {
    connection.query((`SELECt * from post where status=1 AND ID=${req.body.ID}`), (err, result) => {
        if (!err)
            res.send(result)
        //console.log(result)
        else
            res.send(error)
    })
})

app.post('/createpost', (req, res) => {
    connection.query('INSERT into post(userName,role,post,postedOn,ID) values(?,?,?,?,?)',
        [req.body.userName, req.body.role, req.body.post, req.body.postedOn,req.body.ID], (err, data) => {
            if (!err)
                res.send('posted data successfully')
            else
                res.send(err)
        })
})

app.get('/mypost', (req, res) => {
    connection.query(`SELECT * from post WHERE ID=${req.body.ID}`,  (err, data) => {
        if (!err)
            res.send(data)
        else
            res.send(err)
    })
})



app.get('/request', (req, res) => {
    connection.query(("SELECt * from post where status=0 "), (err, result) => {
        if (!err)
            res.send(result)
        //console.log(result)
        else
            res.send(error)
    })
})


app.put('/approve/:pid', (req, res) => {
    connection.query('update post set status=1 where pid=?', [req.params.pid], (err, data) => {
        if (!err)
            res.send(data)
        else
            console.log(err)

    })
})


app.put('/reject/:pid', (req, res) => {
    connection.query('update post set status=2 where pid=?', [req.params.pid], (err, data) => {
        if (!err)
            res.send(data)
        else
            console.log(err)

    })
})

app.get('/adminhome', (req, res) => {
    connection.query(("SELECt * from post where status=1 "), (err, result) => {
        if (!err)
            res.send(result)
        //console.log(result)
        else
            res.send(error)
    })
})
app.listen(3000, () => console.log('server is running on port no: 3000'))