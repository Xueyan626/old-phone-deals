const User = require('../models/user');
const Phone = require('../models/phone');
const Log = require('../models/log');

exports.addToCart = async (req, res) => {
  try {
    const { phoneId, quantity } = req.body;

    const user = await User.findById(req.user.id);
    if (!user.cart) user.cart = [];

    const existing = user.cart.find(item => item.phoneId.toString() === phoneId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ phoneId, quantity });
    }

    await user.save();
    res.json({ success: true, message: 'Added to cart', cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Add to cart failed', error: err.message });
  }
};


exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.phoneId');
    res.json({ success: true, data: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get cart', error: err.message });
  }
};

// exports.checkout = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate('cart.phoneId');
//     if (!user.cart || user.cart.length === 0)
//       return res.status(400).json({ success: false, message: 'Cart is empty' });

//     // traverse all item and reduce the number of item
//     for (let item of user.cart) {
//       const phone = await Phone.findById(item.phoneId._id);
//       if (!phone || phone.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Not enough stock for ${phone.title}` });
//       }
//       phone.stock -= item.quantity;
//       phone.sold = (phone.sold || 0) + item.quantity;
//       await phone.save();
//     }

//     // clear cart
//     user.cart = [];
//     await user.save();

//     // log part
//     console.log(`[Order] User ${user.email} placed order for ${user.cart.length} items`);

//     res.json({ success: true, message: 'Checkout successful. Order confirmed.' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Checkout failed', error: err.message });
//   }
// };


// exports.checkout = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user.cart || user.cart.length === 0)
//       return res.status(400).json({ success: false, message: 'Cart is empty' });

//     let total = 0;
//     const items = [];

//     for (let item of user.cart) {
//       const phone = await Phone.findById(item.phoneId);
//       if (!phone || phone.stock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Not enough stock for ${phone.title}` });
//       }
//       phone.stock -= item.quantity;
//       phone.sold = (phone.sold || 0) + item.quantity;
//       await phone.save();

//       total += phone.price * item.quantity;
//       items.push({ phoneId: phone._id, title: phone.title, quantity: item.quantity, price: phone.price });
//     }

//     // record log in db
//     await Log.create({
//       type: 'order',
//       action: 'CONFIRMED_ORDER',
//       actor: user._id,
//       metadata: {
//         items,
//         totalAmount: total
//       }
//     });

//     user.cart = [];
//     await user.save();

//     res.json({ success: true, message: 'Checkout successful. Order confirmed.' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Checkout failed', error: err.message });
//   }
// };

exports.checkout = async (req, res) => {
  try {
    const items = req.body.items;
    const buyerId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in cart' });
    }

    let total = 0;
    const phonesPurchased = [];

    // traverse items
    for (let item of items) {
      const phone = await Phone.findById(item.phoneId);

      if (!phone) {
        return res.status(404).json({ success: false, message: `Phone not found: ${item.phoneId}` });
      }

      if (phone.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${phone.title}` });
      }

      //reduce stock
      phone.stock -= item.quantity;
      await phone.save();

      //get total
      total += phone.price * item.quantity;

      //get buyer info
      phonesPurchased.push({
        phoneId: phone._id,
        title: phone.title,
        quantity: item.quantity,
        unitPrice: phone.price
      });
    }

    //log
    await Log.create({
      type: 'order',
      action: 'CONFIRMED_ORDER',
      actor: buyerId,
      metadata: {
        totalAmount: total,
        items: phonesPurchased
      }
    });

    res.status(200).json({
      success: true,
      message: 'Checkout successful',
      totalAmount: total,
      items: phonesPurchased
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Checkout failed', error: err.message });
  }
};