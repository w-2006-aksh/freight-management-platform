const {handleSignUp} = require('../../controllers/clientControllers/signUp');
const {handleLogin} = require('../../controllers/clientControllers/login');
const formDataValidator = require('../../middleware/formDataValidator')
const {clientloginSchema} = require('../../formDataValidate/client/login')
const {clientSignUpSchema} = require('../../formDataValidate/client/signUp')

const express = require("express");
const router = express.Router();

router.post('/signup',formDataValidator(clientSignUpSchema) ,handleSignUp);

router.post('/login',formDataValidator(clientloginSchema),handleLogin);

module.exports = router;