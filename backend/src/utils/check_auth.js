let jwt = require('jsonwebtoken');
require('dotenv').config();
let userController = require('../controllers/authController');

module.exports = {
    CheckAuth: async function (req, res, next) {
        if (req.headers && req.headers.authorization) {
            let authorization = req.headers.authorization;
            if (authorization.startsWith("Bearer")) {
                let token = authorization.split(" ")[1];
                try {
                    let result = jwt.verify(token, process.env.SECRET_KEY);
                    let user = await userController.GetUserByID(result.id);
                    if (!user) {
                        throw new Error("User không tồn tại");
                    }
                    req.user = user;
                    next();
                } catch (error) {
                    throw new Error("Token không hợp lệ");
                }
            } else {
                throw new Error("Chưa đăng nhập");
            }
        } else {
            throw new Error("Chưa đăng nhập");
        }
    },
    CheckRole: function (roles) {
        return async function (req, res, next) {
            try {
                let roleOfUser = req.user.role;
                if (roles.includes(roleOfUser)) {
                    next();
                } else {
                    throw new Error("Không có quyền truy cập");
                }
            } catch (error) {
                next(error);
            }
        };
    }
};