import ErrorRoutes from './errorRoutes';
import authRoute from './authRoutes'
import { AUTH } from '../helpers/constants/routes';

export default function configure(app) {
    app.use(AUTH,authRoute)
    // Default error route
    app.use(ErrorRoutes);
}