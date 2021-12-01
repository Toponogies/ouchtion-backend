const router = require('express').Router();
import { ExampleController } from '../controllers';

router.get('', ExampleController.getExamples);

export default router;