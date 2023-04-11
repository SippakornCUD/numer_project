const express = require('express');
const cors = require('cors');
const app = express()
const port = 3001
const mysql = require('mysql');
const bodyParser = require('body-parser');
const swaggerui = require('swagger-ui-express');
const jwt = require('jsonwebtoken')
const options2 = require('./option.json');


app.use(cors())
app.use(bodyParser())


let con = mysql.createPool({
    host:"db" || process.env.DB_HOST,
    port:"3306" || process.env.DB_PORT,
    user:"root" || process.env.DB_USER,
    password:"Folk_password1311" || process.env.DB_PASSWORD,
    database:"numer_project_veryfun" || process.env.DB_NAME
});

con.getConnection(()=>{
    console.log("Databse Connected!!");
});

app.get('/createtoken/:admin',(req,res)=>{
    let date = new Date().toISOString().split('T')[0];
    
    let secretKey = date.replace(/-/g,'')
    console.log("secretKey : ",secretKey);
    console.log("admin : ",req.params.admin);
    let token;
    con.query(`SELECT * FROM admin WHERE name='${req.params.admin}'`,(err,result)=>{
        console.log();
        try{
        if(result.length!==0){
            token = jwt.sign({admin : req.params.admin},secretKey);
            res.send(token)
        }else{
            res.send('You don\'t have Admin Permission')
        }
        }catch{
            res.send('!!ERROR!!')
        }
    })
})

function authen(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    console.log("authHeader : ",token);
    if(token === undefined) res.send('Undefined Token');

    let date = new Date().toISOString().split('T')[0];
    let secretKey = date.replace(/-/g,'')
    try{
    let decode = jwt.verify(token,secretKey)

    con.query(`SELECT * FROM admin WHERE name='${decode.admin}'`,(err,result)=>{
        if(err) throw err
        if(result.length!==0){
            console.log("---------------------");
            next()
        }else{
            res.send('You don\'t have Admin Permission')
        }
    })
    }catch{
        res.send("Token don't Correct");
    }
}

app.post('/get',(req,res)=>{
    let name = req.body.name;
    let id = req.body.RanNum;
    console.log("GET PATH : ",req.body);
    // console.log('axios suscess');
    con.query(`SELECT * FROM ${name} WHERE id = ${id}`, function (err, result) {
        if (err) throw err;
        // console.log("res",result);
        // console.log("res",result[0].equation);
        res.send(result[0])
    });
})

app.post('/update',authen ,(req,res)=>{
    console.log("UPDATE PATH : ",req.body);
    console.log("UPDATE PATH : ",req.params);
    console.log("UPDATE PATH : ",req);
    con.query(`SELECT * FROM ${req.body.name} ORDER BY date LIMIT 1`,(err,result)=>{
        if (err) throw err;
        // console.log(res);
        let id = result[0].id;
        console.log(req.body.queryStr+` WHERE id = ${id}`);
        // res.send('')
        con.query(req.body.queryStr+` WHERE id = ${id}`,(err)=>{
            if(err) throw err
            res.send("UPDATE Success")
        })
    })
})

app.post('/getMat',(req,res)=>{
    let name = req.body.name;
    let size = req.body.size;
    let index = req.body.RanNum;
    console.log("GETMAT PATH : ",req.body);
    // console.log('axios suscess');
    con.query(`SELECT * FROM ${name} WHERE size = ${size}`, function (err, result) {
        if (err) throw err;
        console.log("res",result[index]);
        res.send(result[index])
    });
})
app.post('/updateMat',authen ,(req,res)=>{
    console.log("UPDATE PATH : ",req.body);
    con.query(`SELECT id FROM ${req.body.name} WHERE matrix='${req.body.json}'`,(err,result)=>{
        if (err) throw err;
        console.log(req.body.json);
        console.log(req.body.queryStr);
        if(result.length===0){
            con.query(`SELECT id FROM ${req.body.name} WHERE size=${req.body.size} ORDER BY date LIMIT 1`,(err,result)=>{
                if(err) throw err
                console.log(req.body.queryStr+` WHERE id=${result[0].id}`);
                con.query(req.body.queryStr+` WHERE id=${result[0].id}`,(err)=>{
                    if(err) throw err
                    res.send("UPDATE Success")
                })
            })   
        }
    })
})

app.get('/gentoken/:name',(req,res)=>{
    let date = new Date().toISOString().split('T')[0];
    
    let secretKey = date.replace(/-/g,'')
    let token = jwt.sign({name : req.params.name},secretKey);
    res.send(token)
})

app.use(
  "/api-docs",
  swaggerui.serve,
  swaggerui.setup(options2)
);

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})

module.exports = app