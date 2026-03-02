const express = require('express')
const userController = require('../controllers/userController')
const decisionController = require('../controllers/decisionController')
const jwtMiddleware = require('../middleware/jwtMiddleware')


const route = express.Router()

route.post('/api/register',userController.userRegister)

route.post('/api/login',userController.userLogin)

route.post('/api/google-login',userController.googleLogin)

route.post('/api/add_decision',jwtMiddleware,decisionController.createDecision)

route.get('/api/get_latest_decision', jwtMiddleware, decisionController.getLatestDecision);

route.put('/api/update_decision/:id', jwtMiddleware, decisionController.updateDecision)

route.get('/api/get_user_decisions', jwtMiddleware, decisionController.getUserDecisions)

module.exports = route