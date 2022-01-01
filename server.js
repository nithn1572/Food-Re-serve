var express = require('express');
var app = express();
var mongoose= require('mongoose');
var passport = require('passport');
const sgMail = require("@sendgrid/mail");
var expressFileUpload = require('express-fileupload')
const config = require("./backend/config");
sgMail.setApiKey(config.SendgridAPIKey);
var path = require('path');
var ejs = require('ejs')
var apis= require('./backend/api/allapiroutes.js');
var uis= require('./backend/ui/alluiroutes.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(expressFileUpload())

// app.set('views',path.join(__dirname,'views'))
// app.set('view engine','ejs')
// app.use(express.static(__dirname + '/views'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


//DataBase Connection
var Connection_String=config.dbURI;
var options={useUnifiedTopology: true, useNewUrlParser: true };
mongoose.connect(Connection_String,options);
mongoose.connection.on('connected', function()
{ console.log("GetCertified DataBase Connected");})



// var userauth= require("./backend/api/userauth");
// app.use("/api/auth",userauth);

app.use(express.static(__dirname+'/frontend'));

app.use('/api',apis);
app.use('/',uis);


var port= process.env.PORT  || 3000;
app.listen(port,function cb()
{console.log("http://localhost:"+port)
});


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
  });
