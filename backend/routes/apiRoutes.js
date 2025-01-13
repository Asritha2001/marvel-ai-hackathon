const express = require('express');
const router = express.Router();
const userController = require('../controllers/User')
const promptController = require('../controllers/Prompt')
const HistoryController = require('../controllers/History')

router.post('/signup',userController.signup)
router.post('/login',userController.login)
router.get('/getUserData/:id',userController.getUserData)
router.put('/updateUserData/:id',userController.updateUserData)


router.post(
  "/processUserDataWithGeminiAI/:id",
  promptController.processUserDataWithGemini,
);
router.get("/getPromptResponses/:id", promptController.getPromptResponsesByUser);

router.post('/createSession/:id', HistoryController.createSession); 
router.get('/getSessionbyID/:id', HistoryController.getSessionByID);




module.exports = router;