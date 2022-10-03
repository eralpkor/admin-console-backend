const Customers = require("./auth-customer-model");

module.exports = async (req, res, next) => {
  const errors = [];

  function validateCustomer(user) {
    !user.firstName && errors.push({ firstName: "required" });
    !user.lastName && errors.push({ lastName: "required" });
    !user.email && errors.push({ email: "required" });
    // user.is_admin === 0 || user.is_admin === 1 && errors.push({ is_admin: "required" });

    //Validate Char Length
    Object.keys(user).map((x) => {
      if (x === "firstName" || x === "lastName" || x === "email") {
        const key = user[x].length;

        //Verify Length Min
        if (key < 2 && x) {
          errors.push({ [x]: "Must be a minimum of 5 chars" });
        }

        //Verify Length Max
        if (key > 50 && x) {
          errors.push({ [x]: "Must be a maximum of 50 chars" });
        }

        //Validate Email Pattern
        if (x === "email") {
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user[x]) &&
            errors.push({ error: "Unexpected Email Address" });
        }
      }
    });
  }

  validateCustomer(req.body);

  // Does user exist?
  if (!errors.length) {
    console.log("What is email ", req.body.email);
    await Customers.findByEmail(req.body.email).then(
      (email) => email && errors.push({ email: "Email Already Exist!" })
    );
  }
  // OK we are probably safe to move on send conflict error
  errors.length < 1 ? next() : res.status(409).json({ errors: errors });
};
