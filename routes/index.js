const Router = require('express');
const userRouter = require('./userRouter');
const vacationRouter = require('./vacationRouter');

const router = new Router();

router.use('/user', userRouter);
router.use('/vacation', vacationRouter);

module.exports = router;
