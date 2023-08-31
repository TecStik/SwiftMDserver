const express = require("express");
const { User, Patient, Clinic, Appointment } = require("./dbase/module");
let nodemailer = require("nodemailer");


let app = express.Router();


let http = require("http");
let APIKey = "f51c3293f9caacc25126cfc70764ccfd";
let sender = "8583";

const transporter = nodemailer.createTransport({
  host: "mail.tecstik.com",
  port: 465,
  auth: {
    user: "appSupport@tecstik.com",
    pass: "TecstikApps#123",
  },
});


//  Create User
app.post("/User", (req, res, next) => {
  if (!req.body.loginId || !req.body.password) {
    res.status(403).send(
      `please send email and passwod in json body.
            e.g:
             {
            "email": "Razamalik@gmail.com",
            "password": "abc",
         }`
    );
    return;
  } else {
    User.findOne({ loginId: req.body.loginId }, (err, doc) => {
      if (!err && !doc) {
        let UserCreate = new User({
          UserName: req.body.name,
          UserNumber: req.body.number,
          UserEmail: req.body.email,
          UserPassword: req.body.password,
          loginId: req.body.loginId,
          createdBy: req.body.createdBy,
          Role: req.body.Role,
        });

        UserCreate.save((err, doc) => {
          if (!err) {
            res.send({ message: "Employee created", doc });
          } else {
            res.status(500).send("user create error, " + err);
          }
        });
      } else {
        res.status(409).send({
          message: "employee alredy exist",
        });
      }
    });
  }
});


// User Login
app.post("/login", (req, res, next) => {
  if (!req.body.loginId || !req.body.password) {
    res.status(403).send(
      `please send loginId and passwod in json body.
            e.g:
             {
            "loginId": "03022639133",
            "password": "abc",
         }`
    );
    return;
  }
  User.findOne({ loginId: req.body.loginId }, (err, doc) => {
    if (!doc) {
      res.status(403).send({
        message: "Empolyee not found",
      });
    } else {
      if (req.body.password === doc.UserPassword) {
        res.send(doc);
      } else {
        res.status(403).send({
          message: "Password does not match",
        });
      }
    }
  });
});

let newPassword = getRandomArbitrary(100, 1000);
console.log("New password", newPassword);


// sendSMS
function sendSMS(data) {
  let receiver = data.UserNumber;
  console.log(receiver, data, "reeoe");

  let textmessage = `forget password snd otp ${newPassword}`;

  let options = {
    host: "api.veevotech.com",
    path:
      "/sendsms?hash=" +
      APIKey +
      "&receivenum=" +
      receiver +
      "&sendernum=" +
      encodeURIComponent(sender) +
      "&textmessage=" +
      encodeURIComponent(textmessage),
    method: "GET",
    setTimeout: 30000,
  };

  //   let req = http.request(options, (res) => {
  //     res.setEncoding("utf8");
  //     res.on("data", (chunk) => {
  //       console.log(chunk.toString());
  //     });
  //     console.log("STATUS: " + res.statusCode);
  //   });
  //   req.on("error", function (e) {
  //     console.log("problem with request: " + e.message);
  //   });

  console.log(options, "options");
  console.log(receiver, "receiver");
  // req.send();
}

// sendEmail

function sendEmail(data) {
  console.log(data);

  let receiverEmail = data.UserEmail;

  let mailOptions = {
    from: "appSupport@tecstik.com",
    to: receiverEmail,
    subject: "Payment verify OTP",
    html: `<h1> forget password snd otp ${newPassword}</h1>`,
  };

  //   transporter.sendMail(mailOptions, function (error, info) {
  //     if (error) {
  //       console.log("error=>", error);
  //     } else {
  //       console.log("Email sent: =>" + info.response);
  //     }
  //   });
}

// change password
app.post("/ChangePassword", (req, res, next) => {
  console.log(req.body.userPassword);
  if (!req.body.userObjectId) {
    res.send("userObjectId is required");
  } else {
    User.findById({ _id: req.body.userObjectId }, (err, doc) => {
      if (!err) {
        console.log("doc ", doc);
        if (req.body.userPassword === doc.UserPassword) {
          doc.update(
            { UserPassword: req.body.newPassword },
            {},
            function (err, data) {
              console.log("password updated");
              res.send("Password has been Change Successfull");
            }
          );
        } else {
          res.send("Please Correct the Password");
        }
      } else {
        res.send("Empolyee not found");
      }
    });
  }
});

// forget password
app.post("/forgetPassword", (req, res, next) => {
  if (!req.body.userId) {
    res.send("userId is  required");
  } else {
    User.findOne({ _id: req.body.userId }, (err, doc) => {
      if (!err) {
        console.log("doc ", doc);

        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)
          ? sendEmail(doc)
          : sendSMS(doc);
        // doc.update({ UserPassword: newPassword }, {}, function (err, data) {
        //   //
        //   console.log("password updated");
        //   res.send("temporary password is sent " + newPassword);
        // });
      } else {
        res.send("Empolyee not found");
      }
    });
  }
});


app.post("/UpdateEmpolyee", (req, res, next) => {
  if (!req.body.filter || !req.body.Update) {
    res.status(409).send(`
          Please send filter in json body
          e.g:
          "filter":"{}",
      `);
  } else {
    User.findOneAndUpdate(req.body.filter, req.body.Update, (err, data) => {
      if (!err) {
        res.send({
          data: data,
          message: "Empolyee Update",
          status: 200,
        });
      } else {
        res.status(500).send("error");
      }
    });
  }
});

app.post("/filteredEmployee", (req, res, next) => {
  if (!req.body.filter) {
    res.status(409).send(`
        Please send filter in json body
        e.g:
        "filter":"{}",
    `);
  } else {
    User.find(req.body.filter, (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        res.send(err);
      }
    });
  }
});

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// =======================export
module.exports = app;
