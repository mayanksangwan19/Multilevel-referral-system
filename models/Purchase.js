const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
