const express = require('express');
const router = express.Router();
const userController = require('../controllers/User')

router.post('/signup',userController.signup)
router.post('/login',userController.login)
router.get('/getUserData/:id',userController.getUserData)
router.put('/updateUserData/:id',userController.updateUserData)

module.exports = router;