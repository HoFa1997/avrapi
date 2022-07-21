const {UserApiProductRouter} = require("./product");
const router = require("express").Router();

router.use("/products",UserApiProductRouter)

module.exports = {
    UserRoutes: router
}