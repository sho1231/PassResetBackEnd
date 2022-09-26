const routes = require('express').Router();
const { register, login, checkEmail, verify, reset } = require('../services/user.services');

routes.post("/register", register);
routes.post("/login", login);
routes.post("/sendmail", checkEmail);
routes.get("/verify", verify)
routes.post("/reset", reset);
module.exports = routes;
