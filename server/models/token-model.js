const { Schema, model } = require('mongoose');

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

/* 
! For testing purposes time to delete token from DB is set to 60sec
* in order to change "expireAfterSeconds" in prod also need: 
* https://stackoverflow.com/questions/64830437/document-not-expiring-in-mongodb-using-mongoose
* + delete/rename collection in DB
*/

/* if the user has not been logged in for 60 seconds (the refresh token has not been updated), then delete that token instance from the DB.
This reduces the size of tokens collection in the DB (if the user has not been logged in for a while).
*/
TokenSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 });

module.exports = model('Token', TokenSchema);
