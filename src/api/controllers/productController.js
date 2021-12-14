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
            //get product
            const product = await productModel.findById(req.params.id);

            //check product exist
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            //get images and descriptions
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
            // check role of user
            if (req.accessTokenPayload.role !== "seller") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            
            req.body.is_sold = false;
            const row = await productModel.add(req.body);
            const id = row[0];

            // get product with id
            const product = await productModel.findById(id);
            return res.json(product);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    updateProduct: async (req, res) => {
        try {
            // get product with id
            const product = await productModel.findById(req.params.id);

            // check product exist
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            // check role
            if (req.accessTokenPayload.id !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // update product
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
            // get product by id
            const product = await productModel.findById(req.params.id);
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            // check role only admin can delete
            if (req.accessTokenPayload.role !== "admin") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // remove product
            const n = await productModel.removeProduct(req.params.id);
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
            // get product by id
            const product = await productModel.findById(req.params.id);

            // check product exist
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            // check product of this seller
            if (req.accessTokenPayload.id !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // create multer
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

            // upload with multer (async function)
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
                }
                const file = req.file;
                if (!file) {
                    return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_FILE);
                }
                
                // cut path file
                const index = file.path.indexOf('\\');
                const path = file.path.substring(index + 1);

                // use try catch because this is async function 
                try {
                    // update new avatar
                    const n = await productModel.patch(req.params.id, {
                        avatar: path
                    })

                    // not found this product
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
            // get product by id
            const product = await productModel.findById(req.params.id);

            // check product exist
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            // check product of this seller
            if (req.accessTokenPayload.id !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // create multer
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

            // upload with multer (async function)
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
                }
                const file = req.file;
                if (!file) {
                    return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_FILE);
                }

                // cut path file
                const index = file.path.indexOf('\\');
                const path = file.path.substring(index + 1);

                // use try catch because this is async function 
                try {
                    // add image to database
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
    addDescription : async (req, res) => {
        try {
             // get product by id
            const product = await productModel.findById(req.params.id);

            // check product exist
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            // check product of this seller
            if (req.accessTokenPayload.id !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // create entity
            const entity = {
                product_id:req.params.id,
                description:req.body.description,
                is_init:req.body.is_init
            }

            // add description
            await productModel.addDescription(entity)
            
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    }
}