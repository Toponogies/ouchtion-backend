import httpStatus from 'http-status-codes';
import path from 'path';
import multer from 'multer';
import { NOT_FOUND_FILE, NOT_FOUND_PRODUCT, NOT_PERMISSION, UNEXPECTED_ERROR } from '../helpers/constants/Errors';
import { productModel } from "../models";
export default {
    getAllProduct: async (req, res) => {
        try {
            const products = await productModel.findAll();
            return res.json(products);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getAllProductBySellerId: async (req, res) => {
        try {
            const products = await productModel.findBySellerId(req.body.seller_id);
            return res.json(products);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getProduct: async (req, res) => {
        try {
            const product = await productModel.findById(req.params.id);
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            product.images = await productModel.getImages(product.product_id);
            product.descriptions = await productModel.getDescriptions(product.product_id);
            return res.json(product);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    addProduct: async (req, res) => {
        try {
            req.body.is_sold = false;
            const row = await productModel.add(req.body);
            const id = row[0];

            const product = await productModel.findById(id);
            return res.json(product);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    updateProduct: async (req, res) => {
        try {
            const product = await productModel.findById(req.params.id);
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            if (req.accessTokenPayload.id !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const n = await productModel.patch(req.params.id, req.body);
            if (n === 0) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const product = await productModel.findById(req.params.id);
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            if (req.accessTokenPayload.role !== "admin") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            const n = await productModel.removeById(req.params.id);
            if (n === 0) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    uploadAvatar: async (req, res) => {
        try {
            const product = await productModel.findById(req.params.id);
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            if (req.accessTokenPayload.id !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, 'localdata/product_avatar');
                },
                filename: function (req, file, cb) {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                    cb(null, uniqueSuffix + path.extname(file.originalname))
                }
            });
            var upload = multer({ storage: storage }).single('file');
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
                }
                const file = req.file;
                if (!file) {
                    return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_FILE);
                }
                const index = file.path.indexOf('\\');
                const path = file.path.substring(index + 1);
                try {
                    const n = await productModel.patch(req.params.id, {
                        avatar: path
                    })
                    if (n === 0) {
                        return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
                    }
                }
                catch (err) {
                    console.log(err);
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
                }
                return res.status(httpStatus.NO_CONTENT).send();
            });
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    uploadImage: async (req, res) => {
        try {
            const product = await productModel.findById(req.params.id);
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            if (req.accessTokenPayload.id !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, `localdata/product_image/${req.params.id}`);
                },
                filename: function (req, file, cb) {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                    cb(null, uniqueSuffix + path.extname(file.originalname))
                }
            });
            var upload = multer({ storage: storage }).single('file');
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
                }
                const file = req.file;
                if (!file) {
                    return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_FILE);
                }
                const index = file.path.indexOf('\\');
                const path = file.path.substring(index + 1);
                try {
                   await productModel.addImage(req.params.id,path,req.query.is_primary)
                }
                catch (err) {
                    console.log(err);
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
                }
                return res.status(httpStatus.NO_CONTENT).send();
            });
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    uploadDescription : async (req, res) => {
        try {
            const product = await productModel.findById(req.params.id);
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            if (req.accessTokenPayload.id !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const entity = {
                product_id:req.params.id,
                description:req.body.description,
                is_init:req.body.is_init
            }

            await productModel.addDescription(entity)
            
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    updateDescription: async (req, res) => {
        try {
            const product = await productModel.findById(req.params.id);
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            if (req.accessTokenPayload.id !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const n = productModel.updateDescription(req.params.id,req.body)
            if (n === 0) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    }
}