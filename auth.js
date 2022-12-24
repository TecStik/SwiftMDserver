const express = require("express");
const { User, Patient, Clinic, Appointment } = require("./dbase/module");


var app = express.Router()


//  Create User

app.post('/User', (req, res, next) => {

    if (!req.body.email || !req.body.password) {

        res.status(403).send(
            `please send email and passwod in json body.
            e.g:
             {
            "email": "Razamalik@gmail.com",
            "password": "abc",
         }`)
        return;
    } else {

        User.findOne({ UserEmail: req.body.email }, (err, doc) => {

            if (!err && !doc) {
                var UserCreate = new User({
                    UserName: req.body.name,
                    UserNumber: req.body.number,
                    UserEmail: req.body.email,
                    UserPassword: req.body.password,
                    createdBy: req.body.createdBy,
                    Role: req.body.Role
                })

                UserCreate.save((err, doc) => {
                    if (!err) {
                        res.send({ message: "Employee created", doc })
                    } else {
                        res.status(500).send("user create error, " + err)
                    }
                })
            } else {
                res.status(409).send({
                    message: "employee alredy exist"
                })
            }
        }

        )
    }
})


// User Login

app.post('/login', (req, res, next) => {

    if (!req.body.email || !req.body.password) {

        res.status(403).send(
            `please send email and passwod in json body.
            e.g:
             {
            "email": "Razamalik@gmail.com",
            "password": "abc",
         }`)
        return;
    }
    User.findOne({ UserEmail: req.body.email }, (err, doc) => {

        if (!doc) {

            res.status(403).send({
                message: "Empolyee not found"
            });

        } else {

            if (req.body.password === doc.UserPassword) {

                res.send(doc);

            } else {

                res.status(403).send({
                    message: "Password does not match"
                });

            }
        }
    })
})

// change password
app.post("/ChangePassword", (req, res, next) => {
    console.log(req.body.userPassword);
    if (!req.body.userObjectId) {
  res.send("userObjectId is required")
    } else {
        User.findById({ _id: req.body.userObjectId }, (err, doc) => {
            if (!err) {
                console.log("doc ",doc);
                if (req.body.userPassword === doc.UserPassword) {
                    doc.update({ UserPassword: req.body.newPassword }, {}, function (err, data) {
                        console.log("password updated");
                        res.send("Password has been Change Successfull")
                    })
                } else {
                   res.send("Please Correct the Password");
                  }
                } else {
              res.send("Empolyee not found");
            }
        })
    }
  })


  // forget password
app.post("/forgetPassword", (req, res, next) => {
    
    if (!req.body.userId) {
  res.send("userId is  required")
    } else {
        User.findOne({ UserEmail: req.body.userId}, (err, doc) => {
            if (!err) {
                console.log("doc ",doc);
                let newPassword= getRandomArbitrary(100, 1000);
                console.log("New password",newPassword)
               
                    doc.update({ UserPassword: newPassword }, {}, function (err, data) {
                        console.log("password updated",);
                        res.send("temporary password is sent "+newPassword);
                    })
               
                } else {
              res.send("Empolyee not found");
            }
        })
    }
  })
  function getRandomArbitrary(min, max) {
    return Math.floor( Math.random() * (max - min) + min);
}
// =======================export
module.exports = app





