const express = require('express');
const router = express.Router();
const userController = require('../controllers/User')
const promptController = require('../controllers/Prompt')
router.post('/signup',userController.signup)
router.post('/login',userController.login)
router.get('/getUserData/:id',userController.getUserData)
router.put('/updateUserData/:id',userController.updateUserData)

router.post('/createPromptResponse/:id',promptController.createPromptResponse)
router.get('/getPromptResponse/:id',promptController.getPromptResponsesByUserId)
router.put('/updatePromptResponse/:id',promptController.updatePromptResponse)



module.exports = router;