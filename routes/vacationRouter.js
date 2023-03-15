const Router = require('express');
const VacantionController = require('../controllers/VacantionController');
const router = new Router();

router.post('/create', VacantionController.createVacation);

router.get('/list', VacantionController.getAllVacation);
router.get('/list-user/:userId', VacantionController.getVacation);
router.get('/item-edit/:id', VacantionController.getVacationEditItem);
router.get('/item/:id', VacantionController.getVacationEditItem);

router.put('/edit/:id', VacantionController.updateVacation);

router.delete('/delete/:id', VacantionController.delete);

module.exports = router;
