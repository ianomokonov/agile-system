const dbConnection = require("./db-connection");

class UserRepository {
    constructor() {
        dbConnection.query(
            'SELECT * FROM `user`',
            function (err, results) {
                console.log(results);
            }
        );
    }
}

module.exports = new UserRepository();