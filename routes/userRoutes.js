const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/') // A pasta onde você deseja que os arquivos sejam salvos
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname) // O nome original do arquivo
  }
});

const upload = multer({ storage: storage });

router.post('/register', upload.single('identityPhoto'), userController.register);
router.post('/login', userController.login);
router.post('/recover', userController.recover);
router.post('/reset', userController.resetPassword);
router.post('/send/code-verification', userController.sendVerificationCode)
router.post('/validate/verification-code', userController.validateVerificationCode)

module.exports = router;
