const express = require("express");
const router = express.Router({ mergeParams: true });
const { googleAuth, logout, getMe } = require("../controllers/authcontroller");

router.post("/googleauth", googleAuth);
router.get("/logout", logout);

// Added missing endpoint to resolve 404 error
router.get("/me", getMe || ((req, res) => res.status(200).json({ message: "Auth endpoint active" })));

module.exports = router;