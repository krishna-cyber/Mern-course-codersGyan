import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Email should be a valid email address",
    },
  },

  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
});
