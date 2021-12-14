import ErrorRoutes from './errorRoutes';
import authRoute from './authRoutes';
import productRoute from './productRoutes';
import publicRoute from './publicRoutes';
import { AUTH, PRODUCT } from '../helpers/constants/routes';
import auth from '../middlewares/auth'

export default function configure(app) {
    app.use(AUTH,authRoute)
    app.use(PRODUCT,publicRoute)
    app.use(PRODUCT,auth,productRoute)
    // Default error route
    app.use(ErrorRoutes);
}