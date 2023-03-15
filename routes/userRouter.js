const Router = require('express');
const UserController = require('../controllers/UserController');
const router = new Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

router.post('/createresume', UserController.createresume);
router.get('/listresume/:userId', UserController.getResume);

router.get('/profile/:id', UserController.getProfile);

router.put('/addInfo', UserController.addInfo);

module.exports = router;
