const dbConnection = require("./db-connection");

class UserRepository {
    constructor(){
        this.getUsers();
    }
    async getUsers() {
        const [result,] = await dbConnection.query(
            'SELECT * FROM `user`',
        );
        console.log(result);
    }
}

module.exports = new UserRepository();