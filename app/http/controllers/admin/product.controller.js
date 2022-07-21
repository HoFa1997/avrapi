const {ProductModel} = require("../../../models/products");
const {deleteFileInPublic, ListOfImagesFromRequest} = require("../../../utils/functions");
const path = require("path")
const {
    createProductSchema,
} = require("../../validators/admin/product.schema");
const Controller = require("../controller");
const {createBrotliCompress} = require("zlib");
const {ObjectIdValidator} = require("../../validators/public.validator");
const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");

class ProductController extends Controller {
    async addProduct(req, res, next) {
        try {
            const images = ListOfImagesFromRequest(req?.files || [], req.body.fileUploadPath)
            const productBody = await createProductSchema.validateAsync(req.body);
            const {
                title,
                text,
                short_text,
                category,
                tags,
                count,
                price,
                discount,
                type,
                width,
                height,
                weight,
                length,
                colors
            } = productBody;
            const supplier = req.user._id;

            let feture = {}
            feture.colors = colors;
            if (isNaN(width) || isNaN(height) || isNaN(weight) || isNaN(length)) {
                if (!width) feture.width = 0;
                else feture.width = width;
                if (!height) feture.height = 0;
                else feture.height = height;
                if (!weight) feture.weight = 0;
                else feture.weight = weight;
                if (!length) feture.length = 0;
                else feture.length = length;
            }

            const product = await ProductModel.create({
                title,
                text,
                short_text,
                category,
                tags,
                count,
                price,
                discount,
                images,
                feture,
                supplier,
                type
            })
            return res.json({
                data: {
                    statusCode: 201,
                    message: "ثبت محصول با موفقیت انجام شد"
                }
            });
        } catch (error) {
            deleteFileInPublic(req.body.image)
            next(error);
        }
    }

    editProduct(req, res, next) {
        try {
        } catch (error) {
            next(error);
        }
    }

    async removeProductById(req, res, next) {
        try {
            const {id} = req.params;
            const product = await this.findProductById(id);
            const removeProductResult = await ProductModel.deleteOne({_id: product._id});
            if (removeProductResult.deletedCount == 0) throw createError.InternalServerError();
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "حذف محصول با موفقیت انجام شد"
                }
            })
        } catch (error) {
            next(error);
        }
    }

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
            const product = await ProductModel.find({_id})
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

    async findProductById(productID) {
        const {id} = await ObjectIdValidator.validateAsync({id: productID});
        const product = await ProductModel.findById(id)
        if (!product) throw new createError.NotFound("محصولی یافت نشد")
        return product
    }
}

module.exports = {
    ProductController: new ProductController(),
};
