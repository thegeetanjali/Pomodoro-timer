const router = require("express").Router();
const { body } = require("express-validator");
const { register, login, getMe, updateMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);

module.exports = router;
