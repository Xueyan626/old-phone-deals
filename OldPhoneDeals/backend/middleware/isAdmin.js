const User = require('../models/user');

//Protect admin api will be only accessed by admin account. Responsible for the routing layer
module.exports = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};