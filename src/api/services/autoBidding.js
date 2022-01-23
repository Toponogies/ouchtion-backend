import { BiddingModel, ProductModel } from '../models';
import { getIO } from '../helpers/constants/socketIO';
import userModel from '../models/userModel';
import sendEmail from '../helpers/classes/sendEmail';
import { BIDDING_ADD_AUTO } from '../helpers/constants/keyConstant';

export default async function autoBidding() {
	try {
		const list = await BiddingModel.getAllAutoBiddingValid();
		list.forEach(async (autoBidding) => {
			var product = await ProductModel.getProductUseAutoBidding(autoBidding.product_id, autoBidding.bidding_id);
			if (product === null) {
				product = await ProductModel.findById(autoBidding.product_id);
			}
			if (product.is_sold == 1) {
				await BiddingModel.disableOneAutoBidding(autoBidding.bidding_id);
				return;
			}
			// max all autobidding
			product.current_max_price =
				product.current_max_price && product.current_max_price !== null ? product.current_max_price : 0;
			// get max current_max_price and current_price
			product.current_max_price =
				product.current_max_price > product.current_price ? product.current_max_price : product.current_price;
			// plus 1 if step price = 0
			product.step_price = product.step_price !== 0 ? product.step_price : 1;
			if (product.buyer_id !== autoBidding.user_id) {
				// case if have other autobidding
				const price_need = product.current_max_price + product.step_price;
				if (autoBidding.max_price > price_need) {
					// update buyer_id and current_price
					await ProductModel.patch(autoBidding.product_id, {
						buyer_id: autoBidding.user_id,
						current_price: price_need,
					});
					await BiddingModel.patch(autoBidding.bidding_id, {
						bid_price: price_need,
					});
					// update time product end
					await ProductModel.updateTimeWhenBidding(product.product_id);

					// get list user bidding this product
					const users = await BiddingModel.findAllUserId(product.product_id);

					// socket emit
					getIO().emit(BIDDING_ADD_AUTO, {
						product_id:product.product_id,
						users:users,
					});

					//send email
					if (product !== null) {
						// find seller and bidder
						const seller = await userModel.findById(product.seller_id);
						const price_holder = await userModel.findById(product.buyer_id);
						const bidder = await userModel.findById(autoBidding.user_id);

						let mailSellerOptions = {
							// mail to seller
							from: 'norely@gmail.com',
							to: seller.email,
							subject: 'Product have new bidding',
							text: `Your product name ${product.name} has new bidding from user id ${autoBidding.user_id}`,
						};
						await sendEmail(mailSellerOptions);

						let mailBidderOptions = {
							// mail to bidding's bidder
							from: 'norely@gmail.com',
							to: bidder.email,
							subject: 'Bidding success',
							text: `Your bidding of product name ${product.name} has success`,
						};
						await sendEmail(mailBidderOptions);
						if (price_holder) {
							let mailPriceHolderOptions = {
								// mail to current price buyer
								from: 'norely@gmail.com',
								to: price_holder.email,
								subject: 'Product have new bidding',
								text: `Product name ${product.name} has new bidding`,
							};
							await sendEmail(mailPriceHolderOptions);
						}
					}
				} else {
					await BiddingModel.disableOneAutoBidding(autoBidding.bidding_id);
				}
			} else {
				// case with normal bidding
				const price_need = product.current_max_bid_price + product.step_price;
				if (price_need < autoBidding.max_price && product.current_max_bid_price > product.current_price) {
					// update current_price
					await ProductModel.patch(autoBidding.product_id, {
						current_price: price_need,
					});
					await BiddingModel.patch(autoBidding.bidding_id, {
						bid_price: price_need,
					});
					// update time product end
					await ProductModel.updateTimeWhenBidding(product.product_id);

					// get list user bidding this product
					const users = await BiddingModel.findAllUserId(product.product_id);

					// socket emit
					getIO().emit(BIDDING_ADD_AUTO, {
						product_id:product.product_id,
						users:users,
					});

					//send email
					if (product !== null) {
						// find seller and bidder
						const seller = await userModel.findById(product.seller_id);
						const price_holder = await userModel.findById(product.buyer_id);
						const bidder = await userModel.findById(autoBidding.user_id);

						let mailSellerOptions = {
							// mail to seller
							from: 'norely@gmail.com',
							to: seller.email,
							subject: 'Product have new bidding',
							text: `Your product name ${product.name} has new bidding from user id ${autoBidding.user_id}`,
						};
						await sendEmail(mailSellerOptions);

						let mailBidderOptions = {
							// mail to bidding's bidder
							from: 'norely@gmail.com',
							to: bidder.email,
							subject: 'Bidding success',
							text: `Your bidding of product name ${product.name} has success`,
						};
						await sendEmail(mailBidderOptions);
						if (price_holder) {
							let mailPriceHolderOptions = {
								// mail to current price buyer
								from: 'norely@gmail.com',
								to: price_holder.email,
								subject: 'Product have new bidding',
								text: `Product name ${product.name} has new bidding`,
							};
							await sendEmail(mailPriceHolderOptions);
						}
					}
				}
			}
		});
	} catch (err) {
		console.log(err);
	}
	setTimeout(autoBidding, 1000);
}
