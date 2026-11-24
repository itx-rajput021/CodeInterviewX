const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/interviewController');

router.use(auth);
router.post('/interviews', controller.create);
router.get('/interviews', controller.list);
router.get('/interviews/:id', controller.get);
router.patch('/interviews/:id', controller.update);
router.post('/interviews/:id/cancel', controller.cancel);

module.exports = router;
