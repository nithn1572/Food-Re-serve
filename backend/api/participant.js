var express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
var csvToJson = require('convert-csv-to-json')
const fs = require('fs')

const config=require("../config");
const emailTemplates = require("../email");


var item= require('../itemlib');
var User= require('../models/user');
var Contest= require('../models/contest');
var Participants= require('../models/participants');
var templates = require('../certificateTemplate')



router.post("/uploadCSV",(req,res)=>{
    fs.writeFileSync("temp.csv",req.body.data)
    var json = csvToJson.getJsonFromCsv("temp.csv");
    console.log(json)
    res.json(json)
})


router.post("/add/:contestname/:contestid", async (req,res)=>
{
    console.log(req.body)
    console.log(req.params.contestid);
    
    var data= {
        _id: new mongoose.Types.ObjectId(),
        contestName : req.params.contestname,
        ContestId: req.params.contestid ,
        name: req.body.name,
        passkey: shortid.generate(),
        email: req.body.email,
        rank: req.body.rank,
        emailsent: false,
        certified: false
    }
    // console.log(data)
    item.createitem(data,Participants, (err, data)=>
    {if (err) { res.status(400).json({ error: err,});
    } else { res.status(200).json({ message: "created" }) }
    })
})

router.post('/delete/:id', async(req, res) => {
    console.log(req.params.userid);
    item.deleteItem({ _id: req.params.id }, false, Participants, (err, data) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        } else {
            res.status(200).json({ message:"Participant dropped" })
        }
    })
})

router.patch("/makecertified", async(req, res, next) => {
    console.log(req.body)
    var query={passkey: req.body.passkey, ContestId: req.body.ContestId};

    item.getItemByQuery(query, Participants, (err, data) => {
        if (err) {
            console.log("err");
            res.status(500).json({
                error: err,
            });
        } else {
            if (data.length == 0) {
                res.status(409).json({
                    message: "Participant Doesnot Exist",
                });
            } else {
                if(data[0].certified==true) res.status(200).json({message : "Already Certified", response:data});
                else {
                var update={certified:true, name:req.body.name};
                item.updateItemField(query,update,Participants,(err, result)=>
                {  if (err) {
                    console.log("err");
                    res.status(400).json({
                        error: err,
                    });}
                    else res.status(200).json({message : "updated"});

                })
                }
            }
        }
    })

});

router.get('/contest/:contestid', async(req, res) => {
    console.log(req.params.contestid);
    item.getItemByQuery({ ContestId: req.params.contestid }, Participants, (err, data) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        } else {
            res.status(200).json({ result: data })
        }
    })
})

router.get('/sendmail/:contestid', async(req, res) => {
    console.log(req.params.contestid);
    item.getItemByQuery({ ContestId: req.params.contestid }, Participants, (err, data) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        } else {
            console.log(data);
            //res.status(200).json({ result: data })
             //send mail code begins here-------

            var l=data.length
            for(var i=0;i<l;i++)
            {   
                if(data[i].certified == true)continue;

                participantdata={name:data[i].name,
                                 passkey:data[i].passkey,
                                 contestname:data[i].contestName,
                                 URL:"https://get-certified.herokuapp.com/getcertified/"+data[i].ContestId+"/"+data[i]._id //change to deploy
                                }
                const msg = {
                    to: data[i].email,
                    from: config.sendgridEmail,
                    subject: "Get Certified:" + data[i].contestName ,
                    text: " ",
                    html: emailTemplates.CERTIFY_EMAIL(participantdata),
                };

                sgMail
                    .send(msg)
                    .then((result) => {
                        console.log("Email sent to participant");
                    })
                    .catch((err) => {
                        console.log(err.toString());
                        res.status(500).json({
                            // message: "something went wrong1",
                            error: err,
                        });
                    });
                    var query={passkey: data[i].passKey}
                        Participants.updateOne(query, {emailsent: true}, (err,updateddata)=>
                        {
                         if(err) console.log("failed");
                             else console.log("Updated the field $emailsent$");
                                 
                        });
            }
            // SENDMAIL Code ends here-----------------

        }
    })
})

router.get('/getCertificate',(req,res)=>{
    res.json(templates)
})

router.get('/:participantID', async(req, res) => {
    console.log(req.params.participantID);
    item.getItemByQuery({ _id: req.params.participantID }, Participants, (err, data) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        } else {
            console.log(data)
            res.status(200).json({ result: data })
        }
    })
})

router.get('/passkey/:key', async(req, res) => {
    console.log(req.params.key);
    item.getItemByQuery({ passkey: req.params.key }, Participants, (err, data) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        } else {
            console.log(data)
            res.status(200).json({ result: data })
        }
    })
})

module.exports=router;
