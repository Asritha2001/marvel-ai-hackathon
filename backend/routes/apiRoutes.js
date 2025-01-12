const express = require('express');
const router = express.Router();
const userController = require('../controllers/User')
const promptController = require('../controllers/Prompt')
router.post('/signup',userController.signup)
router.post('/login',userController.login)
router.get('/getUserData/:id',userController.getUserData)
router.put('/updateUserData/:id',userController.updateUserData)


router.post(
  "/processUserDataWithOpenAI/:id",
  userController.processUserDataWithOpenAI,
);
router.get("/getPromptResponses/:id", userController.getPromptResponsesByUser);

router.post('/createPromptResponse/:id',promptController.createPromptResponse)
router.put('/updatePromptResponse/:id',promptController.updatePromptResponse)




module.exports = router;