export default function (string: string) {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId(string);
}
