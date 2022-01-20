import sendEmail from '../helpers/classes/sendEmail';
import { ProductModel, UserModel } from '../models';

export default async function checkWon() {
	try {
		const list = await ProductModel.getAllProductEnd();
		list.forEach(async (product) => {
			// update field product end
			await ProductModel.patch(product.product_id, { is_sold: 1 });
			// find seller and bidder
			const seller = await UserModel.findById(product.seller_id);
			const bidder = await UserModel.findById(product.buyer_id);
			// mail message to seller
			let mailSellerOptions = {
				from: 'norely@gmail.com',
				to: seller.email,
				subject: 'Product end',
				text: `Your product name ${product.name} has end`,
			};
			sendEmail(mailSellerOptions);

			if (bidder !== null) {
				// mail message to bidder
				let mailBidderOptions = {
					from: 'norely@gmail.com',
					to: bidder.email,
					subject: 'Won product',
					text: `You won product name ${product.name}`,
				};
				sendEmail(mailBidderOptions);
			}
		});
	} catch (err) {
		console.log(err);
	}
	setTimeout(checkWon, 2000);
}
