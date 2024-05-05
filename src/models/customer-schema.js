const customerSchema = {
  name: String,
  email: String,
  password: String,
  cart: Object,
  totalPayment: Number,
  wallet: Number,
};

module.exports = customerSchema;
