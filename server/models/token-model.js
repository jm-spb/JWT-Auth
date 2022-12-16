const { Schema, model } = require('mongoose');

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
  createdAt: {
    type: Date,    
    default: Date.now,
    expires: '30d',
  },
});

module.exports = model('Token', TokenSchema);
