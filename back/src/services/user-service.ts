'use strict';

const bcrypt = require(`bcrypt`);
const { nanoid } = require(`nanoid`);
const userRepository = require("../repositories/user.repository");

const saltRounds = 10;

class UserService {
    constructor() {
        this.add('vanika', '111');
    }

    async add(username: string, password: string) {
        const hash = await bcrypt.hash(password, saltRounds);
        const id = nanoid();
    }

    async findByEmail() {
    }

    async checkUser(user: { email: string, password: string }, password: string) {
        const match = await bcrypt.compare(password, user.password);
        return match;
    }
}

module.exports = new UserService();