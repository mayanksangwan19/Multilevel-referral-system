const User = require('../models/user');
const Earning = require('../models/Earning');

// Max 8 direct referrals
const MAX_DIRECT_REFERRALS = 8;

exports.registerUser = async (req, res) => {
  const { name, email, referredBy } = req.body;

  try {
    let referrer = null;

    if (referredBy) {
      referrer = await User.findById(referredBy);
      if (!referrer) return res.status(400).json({ message: 'Invalid referrer ID' });

      if (referrer.referrals.length >= MAX_DIRECT_REFERRALS) {
        return res.status(400).json({ message: 'Referrer already has 8 direct referrals' });
      }
    }

    const newUser = new User({ name, email, referredBy });
    const savedUser = await newUser.save();

    // Add to parent's referral list
    if (referrer) {
      referrer.referrals.push(savedUser._id);
      await referrer.save();
    }

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getReferralReport = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Get user's direct referrals
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const directReferrals = await User.find({ referredBy: userId }).lean();
    const directReferralIds = directReferrals.map(u => u._id.toString());

    // 2. Get Level 1 Earnings (5%)
    const level1Earnings = await Earning.find({
      user: userId,
      Level: 1
    }).lean();

    // 3. Get Level 2 Earnings (1%)
    const level2Earnings = await Earning.find({
      user: userId,
      Level: 2
    }).lean();

    res.json({
      userId,
      directReferrals: directReferrals.map(u => ({ _id: u._id, name: u.name })),
      totalEarnings: {
        level1: level1Earnings.reduce((sum, e) => sum + e.amount, 0),
        level2: level2Earnings.reduce((sum, e) => sum + e.amount, 0)
      },
      breakdown: {
        level1: level1Earnings,
        level2: level2Earnings
      }
    });

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
