const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const nodemailer = require('nodemailer');
const http = require("http");
const app = express()


const { PORT } = require("./core/index")
const { Patient, Clinic, Appointment, Summary } = require('./dbase/module')
const authRoutes = require("./auth");
const APIKey = 'f51c3293f9caacc25126cfc70764ccfd';
const sender = '8583';

dotenv.config();


app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json())
app.use(morgan('short'))
app.use("/auth", authRoutes)


const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    auth: {
        user: 'info@tecstik.com',
        pass: 'anostrat'
    }
});

// Random Number

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

//Post All Api with PatientData 

app.post("/PatientData", (req, res, next) => {

    if (!req.body.PatientNumber) {

        res.status(409).send(`
                    Please send PatientMRNum  in json body
                    e.g:
                    "PatientMRNum":"12345",
                `)
        return;
    } else {
        //     const PatientMRNumber = Math.floor(getRandomArbitrary(11111, 99999))

        const newPatient = new Patient({
            PatientMRNumber: req.body.PatientMRNumber,
            PatientName: req.body.PatientName,
            PatientDOB: req.body.PatientDOB,
            PatientCnic: req.body.PatientCnic,
            BelongsTo: req.body.BelongsTo,
            PatientGender: req.body.PatientGender,
            PatientNumber: req.body.PatientNumber,
            BelongsTp: req.body.BelongsTo
        })

        newPatient.save().then((data) => {
            res.send(data);

        }).catch((err) => {
            res.status(500).send({
                message: "an error occured : " + err,
            })
        });
    }
})

//Post Check Number with PatientData 

app.post("/PatientNumber", (req, res) => {
    Patient.findOne({ PatientNumber: req.body.PatientNumber },
        (err, data) => {
            if (!err) {
                res.send(data);
            } else {
                res.send({
                    status: 403,
                    isFound: false,
                });
            }
        });
});


//Get All Api with PatientData 
app.get('/PatientData', (req, res, next) => {
    Patient.find({}, (err, data) => {
        if (!err) {

            res.send({
                Data: data,
            });
        }
        else {
            res.status(500).send("error");
        }
    })
})


//Post All Api with ClinictData 
app.post("/ClinictData", (req, res, next) => {

    if (!req.body.ClinicId) {

        res.status(409).send(`
                    Please send ClinicID  in json body
                    e.g:
                    "ClinicId":"123",
                `)
        return;
    } else {

        const newClinic = new Clinic({
            ClinicId: req.body.ClinicId,
            ClinicDoctorName: req.body.ClinicDoctorName,
            ClinicCurrentNo: req.body.ClinicCurrentNo,
            ClinicLocation: req.body.ClinicLocation,
            Status: req.body.status,
            BelongsTo: req.body.BelongsTo,
            ClinicStartingTime: req.body.ClinicStartingTime,
            ClinicEndTime: req.body.ClinicEndTime,
            Coordinates: req.body.coordinates,
            ClinicAVGTime: req.body.ClinicAVGTime,
            ClinicLastIssueNum: req.body.ClinicLastIssueNum
        })

        newClinic.save().then((data) => {
            res.send(data)

        }).catch((err) => {
            res.status(500).send({
                message: "an error occured : " + err,
            })
        });
    }
})


// update filtered  appointments
app.put('/UpdateFilteredAppointment', (req, res, next) => {
    if (!req.body.filter || !req.body.update) {
        res.status(409).send(`
        Please send filter and update in json body
        e.g:
        "filter":"{}",
        "update":"{}"
    `)
    } else {
        Appointment.findOneAndUpdate(req.body.filter, req.body.update,
            (err, doc) => {

                if (doc) {
                    res.send(doc)
                } else {
                    res.send(err, "ERROR")
                }

            });
    }
})


// update filtered  clinic
app.put('/UpdateFilteredClinic', (req, res, next) => {
    if (!req.body.filter || !req.body.update) {
        res.status(409).send(`
        Please send filter and update in json body
        e.g:
        "filter":"{}",
        "update":"{}"
    `)
    } else {
        Clinic.findOneAndUpdate(req.body.filter, req.body.update,
            (err, doc) => {

                if (doc) {
                    res.send(doc)
                } else {
                    res.send(err, "ERROR")
                }

            });
    }
})


// update current clinic
app.put('/UpdateCurrentClinic', (req, res, next) => {

    Clinic.findOneAndUpdate({ _id: req.body.id }, { ClinicCurrentNo: req.body.ClinicCurrentNo },
        (err, doc) => {

            if (doc) {
                res.send(doc)
            } else {
                res.send(err, "ERROR")
            }

        });
})


// Post  AppoitmentNumber Update
app.put('/ApoimentUpdate', (req, res, next) => {

    Clinic.findOneAndUpdate({ _id: req.body.id }, { ClinicLastIssueNum: req.body.ClinicLastIssueNum },
        (err, doc) => {

            if (doc) {
                res.send(doc)
            } else {
                res.send(err, "ERROR")
            }

        });
})


//Get All Api with ClinictData 
app.get('/ClinictData', (req, res, next) => {
    Clinic.find({}, (err, data) => {
        if (!err) {

            res.send({
                Data: data,
            });
        }
        else {
            res.status(500).send("error");
        }
    })
})


app.post('/BelongsTo', (req, res, next) => {
    if (!req.body.createdBy) {
        res.status(409).send(`
        Please send createdBy in json body
        e.g:
        "createdBy":"createdBy",
    `)
    } else {
        Clinic.find({ BelongsTo: req.body.createdBy }, (err, doc) => {
            if (!err) {
                res.send(doc)
            } else {
                res.send(err)
            }
        })
    }
})


//Post All Api with AppointmentData 
app.post("/AppointmentData", (req, res, next) => {

    if (!req.body.AppointmentNumber) {

        res.status(409).send(`
                    Please send AppointmentMRNum  in json body
                    e.g:
                    "AppointmentMRNum":"1200",
                `)
        return;
    } else {

        const newAppointment = new Appointment({
            AppointmentName: req.body.AppointmentName,
            AppointmentNumber: req.body.AppointmentNumber,
            AppointmentMRNum: req.body.AppointmentMRNum,
            Appointment: req.body.Appointment,
            Status: req.body.appointmentStatus,
            AppointmentClinicObjID: req.body.Clinic_ID
        })

        const Appoint = newAppointment.save()
        Clinic.findOne({ PatientNumber: req.body.PatientNumber }, (err, data) => {
            if (err) {
                console.log(err, "error");
            } else {
                const Appoint = data.Appointment.push(newAppointment)
                data.save()
                res.send(data)
            }
        }
        )
    }
})


//API to receive filter and return filtered clinics
app.post('/filteredClinic', (req, res, next) => {
    if (!req.body.filter) {
        res.status(409).send(`
        Please send filter in json body
        e.g:
        "filter":"{}",
    `)
    } else {
        Clinic.find(req.body.filter, (err, doc) => {
            if (!err) {
                res.send(doc)
            } else {
                res.send(err)
            }
        })
    }
})


//API to receive filter and return filtered appointments
app.post('/filteredAppointments', (req, res, next) => {
    if (!req.body.filter) {
        res.status(409).send(`
        Please send filter in json body
        e.g:
        "filter":"{}",
    `)
    } else {
        Appointment.find(req.body.filter, (err, doc) => {
            if (!err) {
                res.send(doc)
            } else {
                res.send(err)
            }
        })
    }
})


//API to receive filter and return filtered patients
app.post('/filteredPatients', (req, res, next) => {
    if (!req.body.filter) {
        res.status(409).send(`
        Please send filter in json body
        e.g:
        "filter":"{}",
    `)
    } else {
        Patient.find(req.body.filter, (err, doc) => {
            if (!err) {
                res.send(doc)
            } else {
                res.send(err)
            }
        })
    }
})


// API to take appointment, update last issued clinic number and sends the newly created appointment to user
app.post("/takeAppointment", (req, res, next) => {
    var newNumber = 0;
    if (!req.body.Clinic_ID) {

        res.status(409).send(`
                    Please send ClinicId  in json body
                    e.g:
                    "AppointmentMRNum":"1200",
                `)
        return;
    } else {
        Clinic.findOne({ ActiveClinicId: req.body.Clinic_ID }, (err, data) => {
            if (err) {
                console.log(err, "error");
            } else {
                newNumber = parseInt(data.ClinicLastIssueNum) + 1;
                data.ClinicLastIssueNum = newNumber;
                const newAppointment = new Appointment({
                    AppointmentName: req.body.AppointmentName,
                    AppointmentNumber: req.body.AppointmentNumber,
                    AppointmentMRNum: req.body.AppointmentMRNum,
                    Status: req.body.status,
                    Appointment: newNumber,
                    AppointmentClinicObjID: req.body.Clinic_ID
                })

                const Appoint = newAppointment.save()
                data.save();
                res.send(newAppointment);

            }
        }
        )


    }
})


app.post("/getAppointment", (req, res) => {

    var newNumber = 0;

    if (!req.body.ClinicObjectId) {

        res.status(409).send(`Please Slect Clinic And get Object ID`)

    } else {

        Clinic.findById({ _id: req.body.ClinicObjectId },
            (err, doc) => {
                if (!err) {

                    newNumber = parseInt(doc.ClinicLastIssueNum) + 1;
                    doc.ClinicLastIssueNum = newNumber;

                    const newAppointment = new Appointment({
                        AppointmentName: req.body.AppointmentName,
                        AppointmentNumber: req.body.AppointmentNumber,
                        AppointmentMRNum: req.body.AppointmentMRNum,
                        Appointment: newNumber,
                        AppointmentUserObjectID: req.body.AppointmentUserObjectID,
                        AppointmentClinicObjID: req.body.ClinicObjectId
                    })

                    newAppointment.save()
                    doc.Appointments.push(newAppointment._id)
                    doc.save()
                    res.send(doc)

                } else {
                    res.send(err)

                }
            })

    }


})


app.post('/getAppointmentData', (req, res) => {
    // console.log(req.params.id);
    Appointment.find({ AppointmentClinicObjID: req.body.ClinicObjectId },

        (err, data) => {
            if (!err) {

                res.send(data);
            }
            else {
                res.status(500).send("error");
            }
        }

    )

})


//Get All Api with AppointmentData 
app.get('/AppointmentData', (req, res, next) => {
    Appointment.find({}, (err, data) => {
        if (!err) {

            res.send({
                Data: data,
            });
        }
        else {
            res.status(500).send("error");
        }
    })
})


//Get All Api with CurrentAppointment 
app.get('/CurrentAppointment', (req, res, next) => {

    Appointment.findOne({ Appointment: { $gte: 0 } }, (err, doc) => {
        if (doc) {
            res.send(doc)
        } else {
            res.send(err)
        }
    })
})


//Get Find All Patient  
app.post("/PatientFindAppointment", (req, res) => {

    Appointment.find({ AppointmentNumber: req.body.PatientNumber },
        (err, data) => {
            if (!err) {
                res.send(data);
            } else {
                res.send({
                    status: 403,
                    isFound: false,
                });
            }
        });
});


//delete  Api with AppointmentDelete 
app.delete('/AppointmentDelete/:id', (req, res, next) => {

    Appointment.findByIdAndRemove({ _id: req.params.id }, (err, doc) => {
        if (!err) {
            res.send("Appointment hase been deleted")
        } else {
            res.status(500).send("error happened")
        }

    })
})


//Post Find  ClinicObjectIdData  
app.post("/ClinicObjectIdData", (req, res) => {

    Clinic.find({ _id: req.body.ClinicObjectId },
        (err, data) => {
            if (!err) {
                res.send(data);
            } else {
                res.send({
                    status: 403,
                    isFound: false,
                });
            }
        });
});


//Post Find  PatientObjectIdData  
app.post("/PatientObjectIdData", (req, res) => {

    Patient.find({ _id: req.body.PatientObjectId },
        (err, data) => {
            if (!err) {
                res.send(data);
            } else {
                res.send({
                    status: 403,
                    isFound: false,
                });
            }
        });
});


//Post Find  AppointmentObjIdData  
app.post("/AppointmentObjIdData", (req, res) => {

    Appointment.find({ _id: req.body.AppointmentObjIdData },
        (err, data) => {
            if (!err) {
                res.send(data);
            } else {
                res.send({
                    status: 403,
                    isFound: false,
                });
            }
        });
});


//Post Find  MRNumClinincObjId  
app.post("/MRNumClinicObjId", (req, res) => {
    let criteria = {};
    if (req.body.AppointmentNum) {
        criteria.AppointmentMRNum = req.body.AppointmentNum;
    }
    if (req.body.AppointmentClinincObjID) {
        criteria.AppointmentClinicObjID = req.body.AppointmentClinincObjID;
    }

    console.log("CRITERIA1", criteria)
    Appointment.find(criteria,
        (err, data) => {
            if (!err) {
                console.log("CRITERIA", criteria)
                res.send(data);
            } else {
                res.send({
                    status: 403,
                    isFound: false,
                });
            }
        });
});


// post Appoiment data get in Clinic Object ID
app.post('/clinicIdgetAppointment', (req, res) => {

    if (!req.body.AppointmentClinicObjID) {

        res.status(403).send(
            `please send Clinic Object get appointment data  in json body.
            e.g:
             {
            "AppointmentClinicObjID": "AppointmentClinicObjID"
         }`)
        return;
    } else {

        Appointment.find({ AppointmentClinicObjID: req.body.AppointmentClinicObjID }, (err, doc) => {
            if (!err) {

                res.send(doc)
            } else {

                res.send(err)

            }
        })
    }

})


// Check Appointment And Create Appointment
app.post('/checkAppointmentAndCreateAppoint', (req, res) => {

    if (!req.body.ClinicObjectId) {
        res.status(409).send(`
        SEnd Clinic Objext Id
`)
        return
    } else {

        Clinic.findOne({ _id: req.body.ClinicObjectId })
            .populate("Appointments")
            // .exec()
            .then((doc) => {
                doc.Appointments.forEach((item, index) => {
                    if (item.AppointmentUserObjectID === req.body.AppointmentUserObjectID) {

                        res.send("YOur Appointment Has been Alerdy Create")

                    } else {
                        Clinic.findById({ _id: req.body.ClinicObjectId }, (err, doc) => {

                            if (!err) {

                                newNumber = parseInt(doc.ClinicLastIssueNum) + 1;
                                doc.ClinicLastIssueNum = newNumber;

                                const newAppointment = new Appointment({
                                    AppointmentName: req.body.AppointmentName,
                                    AppointmentNumber: req.body.AppointmentNumber,
                                    AppointmentMRNum: req.body.AppointmentMRNum,
                                    Appointment: newNumber,
                                    AppointmentUserObjectID: req.body.AppointmentUserObjectID,
                                    AppointmentClinicObjID: req.body.ClinicObjectId
                                })

                                newAppointment.save()
                                doc.Appointments.push(newAppointment._id)
                                doc.save()
                                res.send(doc)

                            } else {
                                res.send(err)

                            }
                        })
                    }
                });

            })
    }
})


//  Delet Appointment And Update Appointment
app.post('/deletAppointmentCraeteNewApp', (req, res) => {

    var newNumber = 0
    if (!req.body.ClinicObjectId || !req.body.AppointmentUserObjectID) {
        res.status(409).send(` 
        SEnd Clinic Objext Id
        and AppointmentUserObjectID
        `)
        return
    } else {

        Clinic.findOne({ _id: req.body.ClinicObjectId }).populate("Appointments")
            .exec()
            .then((doc) => {

                doc.Appointments.forEach((item, index) => {

                    if (item.AppointmentUserObjectID === req.body.AppointmentUserObjectID) {

                        Appointment.findOneAndRemove({ AppointmentUserObjectID: req.body.AppointmentUserObjectID }, (err, data) => {

                            if (!err) {

                                Clinic.findById({ _id: req.body.ClinicObjectId }, (err, doc) => {

                                    if (!err) {

                                        newNumber = parseInt(doc.ClinicLastIssueNum) + 1;
                                        doc.ClinicLastIssueNum = newNumber;

                                        const newAppointment = new Appointment({
                                            AppointmentName: req.body.AppointmentName,
                                            AppointmentNumber: req.body.AppointmentNumber,
                                            AppointmentMRNum: req.body.AppointmentMRNum,
                                            Appointment: newNumber,
                                            AppointmentUserObjectID: req.body.AppointmentUserObjectID,
                                            AppointmentClinicObjID: req.body.ClinicObjectId
                                        })

                                        newAppointment.save()
                                        doc.Appointments.push(newAppointment._id)
                                        doc.save()
                                        res.send(doc)

                                    } else { res.send(err) }
                                })
                            } else { res.send("error") }
                        })

                    } else {
                        res.send("eror")
                        console.log("error");
                    }
                });

            })
    }
})


// Collected Amount
app.put('/CollectedAmountApi', (req, res) => {

    if (!req.body.AppointmentObjId || !req.body.amount || !req.body.Status) {
        res.send("Invalid amount")

    } else {

        Appointment.findByIdAndUpdate({ _id: req.body.AppointmentObjId }, {
            $set: {
                "CollectedAmount": req.body.amount,
                "Status": req.body.Status,
                "AppointmentEmail": req.body.AppointmentEmail,
                "AppointmentNumber": req.body.AppointmentNumber,
            }
        },
            (err, data) => {
                if (!err) {

                    let receiver = data.AppointmentNumber
                    let receiverEmail = data.AppointmentEmail
                    console.log(receiver, receiverEmail, data, "reeoe");

                    let textmessage = `Thank you, your payment of Rs ${data.CollectedAmount} is received`;

                    let options = {
                        host: 'api.veevotech.com',
                        path: "/sendsms?hash=" + APIKey + "&receivenum=" + receiver + "&sendernum=" + encodeURIComponent(sender) + "&textmessage=" + encodeURIComponent(textmessage),
                        method: 'GET',
                        setTimeout: 30000
                    };
                    // let req = http.request(options, (res) => {
                    //     res.setEncoding('utf8');
                    //     res.on('data', (chunk) => { console.log(chunk.toString()) });
                    //     console.log('STATUS: ' + res.statusCode);
                    // });
                    // req.on('error', function (e) {
                    //     console.log('problem with request: ' + e.message);
                    // });

                    console.log(options, "options");
                    console.log(receiver, "receiver");
                    req.end();


                    // Send OTP with Email
                    var mailOptions = {
                        from: 'info@tecstik.com',
                        to: receiverEmail,
                        subject: 'Payment verify OTP',
                        html: `<h1>Thank you, your payment of Rs.${data.CollectedAmount} is received</h1>`
                    }


                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log("error=>", error);
                        } else {
                            console.log('Email sent: =>' + info.response);
                        }
                    });

                    res.send("collected amount didn't recived!")
                } else {
                    res.send(err)
                }

            })
    }

})


// Collected Summary
app.post('/summaryData', (req, res) => {

    if (!req.body.ClinicObjectId) {

    } else {
        let TotalAmount = 0;
        let TotalPatient = 0;

        Appointment.find({ AppointmentClinicObjID: req.body.ClinicObjectId }, (err, data) => {
console.log("req.body.ClinicObjectId",req.body.ClinicObjectId);
            for (let i = 0; i < data.length; i++) {
                TotalAmount += data[i].CollectedAmount;
                TotalPatient = data.length
                console.log(data, "data");
            }

            Clinic.findOne({ ActiveClinicId: req.body.ClinicObjectId }, (error, doc) => {

                if (!err&& doc) {
                    // res.send({
                    //     ClinicData: doc,
                    //     TotalAmount: TotalAmount,
                    //     TotalPatient: TotalPatient,
                    // })
console.log("doc in summary",doc);
                    const newSummary = new Summary({
                        SClinicId: doc._id,
                        SClinicName: doc.ClinicDoctorName,
                        SClinicOpenTime: doc.ClinicStartingTime,
                        SClinicCloseTime: doc.ClinicEndTime,
                        SClinicDate: doc.createdOn,
                        SActiveClinicId: doc.ActiveClinicId,
                        SClinicTotalPatient: TotalPatient,
                        SClinicCollection: TotalAmount,
                        SClinicBelonTo: doc.BelongsTo
                    })

                    newSummary.save().then((data) => {
                        res.send(data);

                    }).catch((err) => {
                        res.status(500).send({
                            message: "an error occured : " + err,
                        })
                    });

                } else { res.status(409).send("error in finding clinic "+err) }
            })
            console.log(TotalPatient, TotalAmount, "addAmount");
        })
    }
})


//API to receive filter and return multi filtered Data
app.post('/filteredSummary', (req, res, next) => {
    if (!req.body.filter) {
        res.status(409).send(`
        Please send filter in json body
        e.g:
        "filter":"{}",
    `)
    } else {
        Summary.find(req.body.filter, (err, doc) => {
            // Summary.find({ SClinicId: req.body.filter }, (err, doc) => {
            if (!err) {
                res.send(doc)
            } else {
                res.send(err)
            }
        })
    }
})



app.listen(PORT, () => {
    console.log("start server....", `http://localhost:${PORT}`)
});