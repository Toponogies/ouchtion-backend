import ErrorRoutes from './errorRoutes';
import authRoute from './authRoutes';
import userRoute from './userRoutes';
import publicUserRoute from './publicUserRoute';
import { AUTH,  USER } from '../helpers/constants/routes';
import auth from '../middlewares/auth'

export default function configure(app) {
    app.use(AUTH,authRoute)

    app.use(USER,publicUserRoute)
    app.use(USER,auth,userRoute)
    // Default error route
    app.use(ErrorRoutes);
}