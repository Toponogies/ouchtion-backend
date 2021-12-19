import httpStatus from 'http-status-codes';
import { NOT_FOUND_FILE, NOT_FOUND_IMAGE, NOT_FOUND_PRODUCT, NOT_PERMISSION, UNEXPECTED_ERROR } from '../helpers/constants/Errors';
import { formatDate } from '../helpers/constants/ISOtoDate';
import removeFile from '../helpers/constants/removeFile';
import { productModel } from "../models";



export default {
    getAllProduct: async (req, res) => {
        try {
            const products = await productModel.search(req.query.query,req.query.sort,req.query.page,req.query.category);
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
    getProduct: async (req, res, next) => {
        try {
            if (isNaN(req.params.id))
            {
                return next();
            }
            //get product
            const product = await productModel.getProduct(req.params.id);

            //check product exist
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

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
        
            const file = req.file;
            if (!file) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_FILE);
            }
            
            // cut path file
            const index = file.path.indexOf('\\');
            const path = file.path.substring(index + 1);

            req.body.avatar = path
            req.body.end_at = formatDate(new Date(req.body.end_at))

            // add product
            const row = await productModel.add(req.body);
            const product_id = row[0];

            const product = await productModel.findById(product_id);
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
            if (req.accessTokenPayload.userId !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const file = req.file;
            if (file) {
                // cut path file
                const index = file.path.indexOf('\\');
                const path = file.path.substring(index + 1);
                if (product.avatar)
                {
                    removeFile(process.env.PATH_FOLDER_PUBLIC + product.avatar);
                }
                req.body.avatar = path
            }
            

            req.body.end_at = formatDate(new Date(req.body.end_at))

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

            const inBidding = await productModel.isInBidding(req.params.id)
            if (inBidding === true)
            {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // remove all image 
            const images = await productModel.getImages(req.params.id);
            images.forEach(image => {
                removeFile(process.env.PATH_FOLDER_PUBLIC + image.path);
            });

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
    uploadImage: async (req, res) => {
        try {
            // get product by id
            const product = await productModel.findById(req.params.id);

            // check product exist
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            // check product of this seller
            if (req.accessTokenPayload.userId !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // upload with multer (async function)
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
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getDescriptions : async (req, res) => {
        try{
            const descriptions = await productModel.getDescriptions(req.params.id);
            return res.json(descriptions)
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getImages : async (req, res) => {
        try{
            const images = await productModel.getImages(req.params.id);
            return res.json(images)
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
            if (req.accessTokenPayload.userId !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // create entity
            const entity = {
                product_id:req.params.id,
                description:req.body.description,
            }

            // add description
            await productModel.addDescription(entity)
            
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    deleteDescription : async (req, res) => {
        try {
            const product_id = req.params.id;
            const description_id = req.params.descriptionId;

            // get product by id
            const product = await productModel.findById(product_id);

            // check product exist
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            // check product of this seller
            if (req.accessTokenPayload.userId !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const n = await productModel.deleteDescription(product_id,description_id);
            // not found this product
            if (n === 0) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    deleteImage : async (req, res) => {
        try {
            const product_id = req.params.id;
            const image_id = req.params.imageId;

            // get product by id
            const product = await productModel.findById(product_id);
            // get image
            const image = await productModel.findImage(product_id,image_id);

            // check product exist
            if (product === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            // check image exist
            if (image === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_IMAGE);
            }

            // check product of this seller
            if (req.accessTokenPayload.userId !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            removeFile(process.env.PATH_FOLDER_PUBLIC + image.path)
            const n = await productModel.deleteImage(product_id,image_id);
            // not found this product
            if (n === 0) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    productsWon: async (req, res) => {
        try {
            // check role bidder
            if (req.accessTokenPayload.role !== "bidder") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            console.log(req.accessTokenPayload)

            const products = await productModel.productsWon(req.accessTokenPayload.userId);
            return res.json(products);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    productsBidding: async (req, res) => {
        try {
            // check role bidder
            if (req.accessTokenPayload.role !== "bidder") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const products = await productModel.productsBidding(req.accessTokenPayload.userId);
            return res.json(products);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    productsActive: async (req, res) => {
        try {
            // check role seller
            if (req.accessTokenPayload.role !== "seller") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const products = await productModel.productsActive(req.accessTokenPayload.userId);
            return res.json(products);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    productsInActive: async (req, res) => {
        try {
            // check role seller
            if (req.accessTokenPayload.role !== "seller") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const products = await productModel.productsInActive(req.accessTokenPayload.userId);
            return res.json(products);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getAllBidding: async (req, res) => {
        try {
            const biddings = await productModel.getAllBidding(req.params.id);
            return res.json(biddings);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    }
}