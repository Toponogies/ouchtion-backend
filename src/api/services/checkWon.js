import sendMail from '../helpers/constants/sendEmail';
import { productModel, userModel } from '../models';

export default async function checkWon(){
    try {
        const list = await productModel.getAllProductEnd();
        list.forEach(async product => {
            // update field product end
            await productModel.patch(product.product_id, { is_sold: 1 });
            // find seller and bidder 
            const seller = await userModel.findById(product.seller_id);
            const bidder = await userModel.findById(product.buyer_id);
            // mail message to seller
            let mailSellerOptions = {
                from: 'norely@gmail.com',
                to: seller.email,
                subject: 'Product end',
                text: `Your product name ${product.name} has end`
            };
            sendMail(mailSellerOptions);


            if (bidder !== null) {
                // mail message to bidder
                let mailBidderOptions = {
                    from: 'norely@gmail.com',
                    to: bidder.email,
                    subject: 'Won product',
                    text: `You won product name ${product.name}`
                };
                sendMail(mailBidderOptions);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
    setTimeout(checkWon, 2000);
}
