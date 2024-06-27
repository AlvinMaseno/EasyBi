const mongoose = require("mongoose");

const PricingSchema = mongoose.Schema({
    WeeklyPrice:Number,
    MonthlyPrice:Number,
    Date:Date
});
const Pricing = mongoose.model("Pricing", PricingSchema);

module.exports = Pricing;
