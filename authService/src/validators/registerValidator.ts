import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    isEmail: {
      errorMessage: "Invalid email address",
    },
    notEmpty: {
      errorMessage: "Email must be required",
    },
  },
});
