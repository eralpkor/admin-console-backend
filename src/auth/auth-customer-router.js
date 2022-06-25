const router = require("express").Router();
require("dotenv").config();
const Customers = require("./auth-customer-model");

router.get("/customers", (req, res) => {
  Customers.find()
    .then((customers) => {
      res.status(200).json({ customers: customers });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Cannot get customers..." });
    });
});

module.exports = router;
