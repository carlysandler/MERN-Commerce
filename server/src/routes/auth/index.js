const router = require("express").Router()
require("../../passport/index");


router.use('/google', require("./google"));
// router.use('/facebook', facebookRoutes);
// router.use('/apple', appleRoutes);
// router.use('/', localRoutes)

module.exports = router;
