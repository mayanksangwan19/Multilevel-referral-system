const Earning = require('../models/Earning');
const User = require('../models/user');

async function distributeProfit(userId, purchaseAmount) {
  if (purchaseAmount < 1000) return;

  const buyer = await User.findById(userId);
  if (!buyer || !buyer.referredBy) return;

  const level1 = await User.findById(buyer.referredBy);
  if (level1) {
    const amount = purchaseAmount * 0.05;
    await Earning.create({
      user: level1._id,
      sourceUser: buyer._id,
      amount,
      level: 1
    });
    global.io.to(level1._id.toString()).emit('earnings-update', { amount, level: 1 });
  }

  if (level1?.referredBy) {
    const level2 = await User.findById(level1.referredBy);
    if (level2) {
      const amount = purchaseAmount * 0.01;
      await Earning.create({
        user: level2._id,
        sourceUser: buyer._id,
        amount,
        level: 2
      });
      global.io.to(level2._id.toString()).emit('earnings-update', { amount, level: 2 });
    }
  }
}

module.exports = distributeProfit;
