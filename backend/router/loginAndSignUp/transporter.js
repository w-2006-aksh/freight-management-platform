const express = require("express");
const router = express.Router();
const {handleSignUp}=require('../../controllers/transporterControllers/signUp')
const {handleLogin} = require('../../controllers/transporterControllers/login')
const formDataValidator = require('../../middleware/formDataValidator')
const {transporterloginSchema} = require('../../formDataValidate/transporter/login')
const {transporterSignUpSchema} = require('../../formDataValidate/transporter/signUp')



router.post('/signup',formDataValidator(transporterSignUpSchema) ,handleSignUp)
      
router.post('/login',formDataValidator(transporterloginSchema),handleLogin)


module.exports=router;