import ErrorRoutes from './errorRoutes';
import authRoute from './authRoutes';
import biddingRoute from './biddingRoutes';
import publicProductRoutes from './publicProductRoutes';
import productRoute from './productRoutes';
import { AUTH, BIDDING, PRODUCT } from '../helpers/constants/routes';
import auth from '../middlewares/auth'

export default function configure(app) {
    app.use(AUTH,authRoute)

    app.use(PRODUCT,publicProductRoutes)
    app.use(PRODUCT,auth,productRoute)

    app.use(BIDDING,auth,biddingRoute)

    // Default error route
    app.use(ErrorRoutes);
}