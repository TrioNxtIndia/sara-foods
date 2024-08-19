import express from 'express'
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.route('/register-admin').post(userController.admin);
router.route('/register-user').post(userController.user);
router.route('/login').post(userController.login);

export default router;