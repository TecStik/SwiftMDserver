const mongoose = require("mongoose");
const { dbURI } = require("../core/index");
const { Schema } = mongoose;

/////////////////////////////////////////////////////////////////////////////////////////////////

// let dbURI = 'mongodb://localhost:27017/abc-database';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function () {
  //connected
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////

//  PatientSchema Start
var PatientSchema = mongoose.Schema({
  PatientMRNumber: String,
  PatientName: String,
  PatientDOB: String,
  PatientCnic: String,
  BelongsTo: String,
  PatientGender: String,
  PatientNumber: String,
  BelongsTo: String,
  createdOn: { type: Date, default: Date.now },
});

var Patient = mongoose.model("Patients", PatientSchema);

//  PatientSchema End

// Clinic Data Start
var ClinicSchema = mongoose.Schema({
  ClinicId: String,
  ActiveClinicId: String,
  ClinicDoctorName: String,
  ClinicCNIC: String,
  ClinicLocation: String,
  ClinicCurrentNo: String,
  ClinicAVGTime: String,
  BelongsTo: String,
  Coordinates: String,
  Status: String,
  AssistedBy: String,
  ClinicLastIssueNum: String,
  ClinicStartingTime: String,
  ClinicEndTime: String,
  Appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointments" }],
  createdOn: { type: Date, default: Date.now },
});

var Clinic = mongoose.model("Clinics", ClinicSchema);

var AppointmentSchema = mongoose.Schema({
  Appointment: String,
  AppointmentName: String,
  AppointmentEmail: String,
  AppointmentMRNum: String, //
  AppointmentNumber: String,
  AppointmentUserObjectID: String,
  AppointmentClinicObjID: String, //
  CollectedAmount: Number,
  DischargedAt: Date,
  AttendedAt: Date,
  Status: String,
  LeftAt: Date,
  createdOn: { type: Date, default: Date.now },
});

var Appointment = mongoose.model("Appointments", AppointmentSchema);

// Appointment Data End

var UserSchema = mongoose.Schema({
  Role: String,
  loginId: String,
  UserName: String,
  createdBy: String,
  UserEmail: String,
  UserNumber: String,
  UserPassword: String,
  ScendryContact: String,
  createdOn: { type: Date, default: Date.now },
});
// Update
var User = mongoose.model("Users", UserSchema);

var SummarySchema = mongoose.Schema({
  SClinicId: String,
  SClinicName: String,
  SClinicOpenTime: String,
  SClinicCloseTime: String,
  SClinicTotalPatient: String,
  SClinicCollection: String,
  SActiveClinicId: String,
  SClinicBelonTo: String,
  SClinicDate: String,
  createdOn: { type: Date, default: Date.now },
});
// Update
var Summary = mongoose.model("Summarys", SummarySchema);

// Client Data
module.exports = {
  User: User,
  Clinic: Clinic,
  Patient: Patient,
  Summary: Summary,
  Appointment: Appointment,
};
