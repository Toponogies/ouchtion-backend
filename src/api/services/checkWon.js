import sendMail from "../helpers/constants/sendEmail";
import { productModel, userModel } from "../models";

export default async function checkWon(){
    try {
        const list = await productModel.getAllProductEnd();
        list.forEach(async product => {
            await productModel.patch(product.product_id, { is_sold: 1 })
            const seller = await userModel.findById(product.seller_id);
            const bidder = await userModel.findById(product.buyer_id);
            let mailSellerOptions = {
                from: 'norely@gmail.com',
                to: seller.email,
                subject: 'Product end',
                text: `Your product name ${product.name} has end`
            };
            sendMail(mailSellerOptions)
            if (bidder !== null) {
                let mailBidderOptions = {
                    from: 'norely@gmail.com',
                    to: bidder.email,
                    subject: 'Won product',
                    text: `You won product name ${product.name}`
                };
                sendMail(mailBidderOptions)
            }
        });
    }
    catch (err) {
        console.log(err);
    }
    setTimeout(checkWon, 2000);
}
