const {AdminApiBlogRouter} = require("./blog");
const {AdminApiCategoryRouter} = require("./category");
const {AdminApiProductRouter} = require("./product");

const router = require("express").Router();
/**
 * @swagger
 *  tags:
 *      -   name : Admin-Panel
 *          description : action of admin (add, remove, edit  and any do)
 *      -   name: Product(AdminPanel)
 *          description : management product routes
 *      -   name: Blog(AdminPanel)
 *          description: made blog managment admin panel
 *      -   name: Category(AdminPanel)
 *          description: all method and routes about category section
 */

router.use("/category", AdminApiCategoryRouter)
router.use("/blogs", AdminApiBlogRouter)
router.use("/products", AdminApiProductRouter)
module.exports = {
    AdminRoutes: router
}