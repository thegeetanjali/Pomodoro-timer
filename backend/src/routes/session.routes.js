const router = require("express").Router();
const { createSession, getSessions, deleteSession } = require("../controllers/session.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect); // all session routes require auth

router.route("/").get(getSessions).post(createSession);
router.delete("/:id", deleteSession);

module.exports = router;
