import ErrorRoutes from './errorRoutes';
import authRoute from './authRoutes';
import biddingRoute from './biddingRoutes';
import publicProductRoutes from './publicProductRoutes';
import categoryRoute from './categoryRoutes';
import productRoute from './productRoutes';
import userRoute from './userRoutes';
import publicUserRoute from './publicUserRoute';
import { AUTH, BIDDING, PRODUCT, CATEGORY, USER } from '../helpers/constants/routes';
import auth from '../middlewares/auth';

export default function configure(app) {
    app.use(AUTH,authRoute);

    app.use(PRODUCT,publicProductRoutes);
    app.use(PRODUCT,auth,productRoute);

    app.use(BIDDING,auth,biddingRoute);
    app.use(CATEGORY,categoryRoute);

    app.use(USER,publicUserRoute);
    app.use(USER,auth,userRoute);
    // Default error route
    app.use(ErrorRoutes);
}