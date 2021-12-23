import db from '../helpers/constants/db.js';
import sendMail from '../helpers/constants/sendEmail.js';
import generate from './generic.model.js';
import productModel from './productModel.js';
import userModel from './userModel.js';

let biddingModel = generate('biddings', 'bidding_id');

// add one bidding
biddingModel.addBidding= async function (body) {
    const checkBiddingPermission = await biddingModel.isBiddingPermission(body);
    if (checkBiddingPermission === false){
        return false;
    }

    const product = await productModel.getProductUseAutoBidding(body.product_id);

    // get bidding id bidding add
    var biddingId = await biddingModel.add(body);
    biddingId = biddingId[0];

    // update time product end
    await productModel.updateTimeWhenBidding(product.product_id);

    product.current_max_price = product.current_max_price > product.current_price ? product.current_max_price : product.current_price;
    if (product.current_max_price < body.bid_price)
    {
        await productModel.patch(product.product_id,{
            buyer_id:body.user_id,
            current_price:body.bid_price
        });
    }
    if (product !== null){
        // find seller and bidder 
        const seller = await userModel.findById(product.seller_id);
        const price_hoder = await userModel.findById(product.buyer_id);
        const bidder = await userModel.findById(body.user_id);

        let mailSellerOptions = { // mail to seller
            from: 'norely@gmail.com',
            to: seller.email,
            subject: 'Product have new bidding',
            text: `Your product name ${product.name} has new bidding from user id ${body.user_id}`
        };
        sendMail(mailSellerOptions);

        let mailBidderOptions = { // mail to bidding's bidder
            from: 'norely@gmail.com',
            to: bidder.email,
            subject: 'Bidding success',
            text: `Your bididng of product name ${product.name} has success`
        };
        sendMail(mailBidderOptions)

        let mailPriceHoderOptions = { // mail to current price buyer
            from: 'norely@gmail.com',
            to: price_hoder.email,
            subject: 'Product have new bidding',
            text: `Product name ${product.name} has new bidding`
        };
        sendMail(mailPriceHoderOptions)
    }
    return true;
}

biddingModel.isHaveBiddingRequest= async function (body) {
    const list = await db("bidding_approval_requests").where("user_id", body.user_id).andWhere("product_id",body.product_id);
    if (list.length === 0)
      return false;

    return true;
}

biddingModel.isBiddingPermission= async function (body) {
    const product = await productModel.getProduct(body.product_id);
    if (product.is_sold !== 0){
        return false;
    }

    // check bid_price with step price and current price, excluding autobidding
    if (!body.max_price && body.bid_price < product.step_price + product.current_price)
    {
        return false;
    }

    const list = await db("bidding_permissions").where("user_id", body.user_id).andWhere("product_id",body.product_id);
    if (list.length === 0)
    {
        const {full_name,point} = await userModel.getPoint(body.user_id);
        if (point > 80)
            return true
        return false;
    }
    if (list[0].type === "APPROVE")
        return true;
    return false;
}

biddingModel.addBiddingRequest= async function (body) {
    body.is_processed = true;
    await db("bidding_approval_requests").insert(body);
}

biddingModel.getBiddingRequests= async function (seller_id) {
    return await db("bidding_approval_requests")
    .join('products',"products.product_id","bidding_approval_requests.product_id")
    .where("seller_id", seller_id).andWhere("is_processed",1)
    .select("bidding_approval_requests.*");
}

biddingModel.permissionBidding= async function (body) {
    try{
        await db("bidding_permissions").insert(body);
    }
    catch(err){
        await db("bidding_permissions").where("user_id", body.user_id).andWhere("product_id",body.product_id).update(body);
    }
    await db("bidding_approval_requests").where("user_id", body.user_id).andWhere("product_id",body.product_id).update({is_processed:0})
}

biddingModel.notAllowBidding= async function (body) {
    await db("bidding_approval_requests").where("user_id", body.user_id).andWhere("product_id",body.product_id).update({is_processed:0})
}

biddingModel.getAllAutoBiddingValid= async function(){
    return await db("biddings").whereRaw("max_price IS NOT NULL").andWhere("is_auto_process",1).andWhere("is_valid",1).orderBy("time","desc");
}

biddingModel.disableOneAutoBidding = async function(bidding_id){
    await db("biddings").where("bidding_id", bidding_id).update({
        is_auto_process:0
    })
}

biddingModel.disableAutoBiddingWithUserId = async function(user_id){
    await db("biddings").where("user_id", user_id).update({
        is_auto_process:0
    })
}

biddingModel.secondBidding = async function(product_id){
    const list = await db("biddings").where("product_id", product_id)
    .andWhere("is_valid",1)
    .orderBy("bid_price","desc").limit(1);
    if (list.length === 0)
        return null;

    return list[0];
}

biddingModel.rejectBidding = async function(bidding_id){
    const bidding = await biddingModel.findById(bidding_id)
    const product = await productModel.getProduct(bidding.product_id);
    if (product.is_sold === 1)
    {
        return false;
    }
    const user = await userModel.findById(bidding.user_id);
    await db("biddings").where("user_id", bidding.user_id).update({
        is_valid:0
    })

    let mailBidderOptions = { // mail to bidding's bidder have reject
        from: 'norely@gmail.com',
        to: user.email,
        subject: 'Bidding reject',
        text: `All your bididng of product name ${product.name} has deny, you can't bidding in this product`
    };
    sendMail(mailBidderOptions)

    if (product.buyer_id === bidding.user_id)
    {
        //disable autobidding with userid
        await biddingModel.disableAutoBiddingWithUserId(bidding.user_id);

        const secondBidding = await biddingModel.secondBidding(product.product_id)
        //if not have second bidding
        if (secondBidding === null)
        {
            await productModel.patch(product.product_id,{
                buyer_id:null,
                current_price:0,
            })
            return true;
        }
        // if have second bidding
        await productModel.patch(product.product_id,{
            buyer_id:secondBidding.user_id,
            current_price:secondBidding.bid_price,
        })

        const body = {
            type:"DENY",
            user_id: bidding.user_id,
            product_id: product.product_id,
            reason: "Deny bidding this product"
        }
    
        try{
            await db("bidding_permissions").insert(body);
        }
        catch(err){
            await db("bidding_permissions").where("user_id", body.user_id).andWhere("product_id",body.product_id).update(body);
        }
    }

    return true;
}

export default biddingModel;