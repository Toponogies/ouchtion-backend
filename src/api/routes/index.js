import ExampleRoutes from './exampleRoutes';
import ErrorRoutes from './errorRoutes';
import { EXAMPLE } from '../helpers/constants/Routes';

export default function configure(app) {
    // Other routes
    app.use(EXAMPLE, ExampleRoutes);
    // Default error route
    app.use(ErrorRoutes);
}