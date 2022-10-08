const { default: mongoose } = require("mongoose");
const secrets = require("./db.secrets.json");

//singleton pattern

class MongoDbConnection {
  constructor(connectionString) {
    this.databaseConnection = connectionString;
  }

  getDbConnection() {
    return mongoose.connect(
      `mongodb+srv://${secrets.mongousername}:${secrets.mongopass}@${secrets.mongourl}/procsupport`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true,
      }
    );
  }
}

module.exports = new MongoDbConnection();
