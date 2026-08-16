const { z } = require("zod");

const nameSchema = z.string().min(20).max(60);
const addressSchema = z.string().max(400);
const passwordSchema = z.string().min(8).max(16)
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character");
const emailSchema = z.string().email();

const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
});

module.exports = { signupSchema, nameSchema, addressSchema, passwordSchema, emailSchema };