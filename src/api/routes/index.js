import ErrorRoutes from './errorRoutes';
import AuthRoute from './authRoutes';
import BiddingRoute from './biddingRoutes';
import PublicProductRoutes from './publicProductRoutes';
import PublicCategoryRoute from './publicCategoryRoutes';
import CategoryRoute from './categoryRoutes';
import ProductRoute from './productRoutes';
import UserRoute from './userRoutes';
import PublicUserRoute from './publicUserRoute';
import { AUTH, BIDDING, PRODUCT, CATEGORY, USER } from '../helpers/constants/routes';
import auth from '../middlewares/auth';

export default function configure(app) {
	app.use(AUTH, AuthRoute);
	app.use(CATEGORY, PublicCategoryRoute);
	app.use(CATEGORY, auth, CategoryRoute);
	app.use(PRODUCT, PublicProductRoutes);
	app.use(PRODUCT, auth, ProductRoute);
	app.use(BIDDING, auth, BiddingRoute);
	app.use(USER, PublicUserRoute);
	app.use(USER, auth, UserRoute);
	// Default error route
	app.use(ErrorRoutes);
}
