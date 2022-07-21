const {
  ProductController,
} = require('../../http/controllers/user/product.controller');

const router = require('express').Router();

/**
 * @swagger
 *  /user/products/list:
 *      get:
 *          tags: [Product(UserPanel)]
 *          summary: get all products
 *          responses:
 *              200:
 *                  description: success
 */
router.get('/list', ProductController.getAllProducts);

/**
 * @swagger
 *  /user/products/{id}:
 *      get:
 *          tags: [Product(UserPanel)]
 *          summary: find category by object-id
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required : true
 *          responses:
 *              200:
 *                  description: success
 */
router.get('/:id', ProductController.getOneProduct);
module.exports = {
  UserApiProductRouter: router,
};
