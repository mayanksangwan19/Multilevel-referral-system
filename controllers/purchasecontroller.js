const User = require('../models/user');
const Purchase = require('../models/Purchase');
const Earning = require('../models/Earning');

exports.makePurchase = async (req, res) => {
  const { userId, amount } = req.body;

  if (amount < 1000) {
    return res.status(400).json({ message: 'Purchase must be at least ₹1000' });
  }

  try {
    const user = await User.findById(userId).populate('referredBy');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const purchase = await Purchase.create({ user: user._id, amount });

    // Level 1: Parent
    if (user.referredBy) {
      const parent = user.referredBy;
      const level1Amount = amount * 0.05;

      await Earning.create({
        user: parent._id,
        sourceUser: user._id,
        level: 1,
        amount: level1Amount,
        purchase: purchase._id
      });

      // Emit real-time update to parent
      io.to(parent._id.toString()).emit('earning', {
        amount: level1Amount,
        from: user.name,
        level: 1,
        time: new Date()
      });

      // Level 2: Grandparent
      if (parent.referredBy) {
        const grandParent = await User.findById(parent.referredBy);
        const level2Amount = amount * 0.01;

        await Earning.create({
          user: grandParent._id,
          sourceUser: user._id,
          level: 2,
          amount: level2Amount,
          purchase: purchase._id
        });

        // Emit real-time update to grandparent
        io.to(grandParent._id.toString()).emit('earning', {
          amount: level2Amount,
          from: user.name,
          level: 2,
          time: new Date()
        });
      }
    }

    res.status(201).json({ message: 'Purchase successful', purchaseId: purchase._id });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

