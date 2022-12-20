const PORT = process.env.PORT || 5000;
const dbURI = process.env.dbURI || "mongodb+srv://tecstik:Pakvip123@swiftmdcluster0.r7z21tp.mongodb.net/?retryWrites=true&w=majority";//"mongodb+srv://medical:2468@cluster0.z0q9h.mongodb.net/?retryWrites=true&w=majority";

module.exports = {
    PORT: PORT,
    dbURI: dbURI,
}