'use strict';

const { StatusCodes } = require(`http-status-codes`);

module.exports = (store) => (
    async (req, res, next) => {
        const { username, password } = req.body;
        const existsUser = await store.findByEmail(username);

        if (!existsUser) {
            res.status(StatusCodes.FORBIDDEN)
                .json({ message: `Пользователь не нацден`});

            return;
        }

        if (! await store.checkUser(existsUser, password)) {
            res.status(StatusCodes.FORBIDDEN)
                .json({message: `Неправильный пароль`});

            return;
        }

        res.locals.user = existsUser;
        next();
    }
);