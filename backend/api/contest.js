var express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");


var item= require('../itemlib');
var User= require('../models/user');
var Contest= require('../models/contest');
var Participants= require('../models/participants');


router.post("/add/:userid", async (req,res)=>
{
    console.log(req.params.userid);
    // console.log(req.body);

    var data= {
        _id: new mongoose.Types.ObjectId(),
        contestname : req.body.contestname,
        userId: req.params.userid ,
        userName: req.body.username,
        creationtime:  new Date().getTime(),
        isDeleted: false,
        organisation: req.body.organisation,
        description: req.body.description,
        contact: req.body.contact,
        address: req.body.address
    }
    item.createitem(data,Contest, (err, data)=>
    {if (err) { res.status(400).json({ error: err,});
    } else { res.status(200).json({ message: "created" }) }
   })

})

router.get('/user/:userid', async(req, res) => {
    console.log(req.params.userid);
    item.getItemByQuery({ userId: req.params.userid }, Contest, (err, data) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        } else {
            res.status(200).json({ result: data })
        }
    })
})

router.get('/details/:id', async(req, res) => {
    console.log(req.params.id);
    item.getItemByQuery({ _id: req.params.id }, Contest, (err, data) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        } else {
            res.status(200).json({ result: data })
        }
    })
})


// router.get('/addmembers/:contestid', async(req, res) => {
//     console.log((req.body.participants).length);

//     var query={ _id: req.params.contestid };
//     item.getItemByQuery(query, Contest, (err, data) => {
//         if (err) {
//             res.status(400).json({
//                 error: err,
//             });
//         } else {  if(data.length==0) res.status(400).json( {error: "Contest Doesnot Exist"} );
//                   var update= {participants:req.body.participants};
//                   item.updateItem(update,Contest,(err, result)=>
//                   {
//                       if(err)  res.status(400).json({
//                                       error: err,
//                                    });
//                       else  res.status(200).json({ message : result});
//                   })
                  
//                }
//     })
// })

module.exports=router;