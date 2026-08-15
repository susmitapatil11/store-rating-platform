const { Rating, Store } = require('../models');
const { validateRating } = require('../utils/validators');

// normal user submits a rating for a store
exports.submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { value } = req.body;
    const userId = req.user.id;

    const ratingErr = validateRating(value);
    if (ratingErr) {
      return res.status(400).json({ message: ratingErr });
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const [rating, created] = await Rating.findOrCreate({
      where: { userId, storeId },
      defaults: { value },
    });

    if (!created) {
      rating.value = value;
      await rating.save();
    }

    res.status(created ? 201 : 200).json(rating);
  } catch (err) {
    console.error('submitRating error:', err);
    res.status(500).json({ message: 'Could not submit rating' });
  }
};
