const {ProductModel} = require("../../../models/products");
const Controller = require("../controller");
const createError = require("http-errors");

class ProductController extends Controller {
    async getAllProducts(req, res, next) {
        try {
            const products = await ProductModel.find({})
            return res.status(200).json({
                data: {
                    statusCode: 200,
                    products
                }
            })
        } catch (error) {
            next(error);
        }
    }

    async getOneProduct(req, res, next) {
        try {
            const {id} = req.params;
            const product = await this.findProduct(id);
            return res.status(200).json({
                data: {
                    statusCode: 200,
                    product
                }
            })
        } catch (error) {
            next(error);
        }
    }

    async findProduct(id) {
        const product = await ProductModel.findById(id);
        if (!product) throw createError.NotFound("محصولی یافت نشد");
        delete product.category.children
        return product
    }

}

module.exports = {
    ProductController: new ProductController(),
};
