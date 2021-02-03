'use strict';

const { StatusCodes } = require(`http-status-codes`);
const userService = require("../services/user-service");

module.exports = async (req, res, next) => {
    console.log(111);
    const { username, password } = req.body;
    const existsUser = await userService.findByEmail(username);

    if (!existsUser) {
        res.status(StatusCodes.FORBIDDEN)
            .json({ message: `Пользователь не найден` });

        return;
    }

    if (! await userService.checkUser(existsUser, password)) {
        res.status(StatusCodes.FORBIDDEN)
            .json({ message: `Неправильный пароль` });

        return;
    }

    res.locals.user = existsUser;
    next();
}