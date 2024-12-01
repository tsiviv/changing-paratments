import {User} from './models/users'
const user = await User.findByPk(2);
if (user) {
  user.updatedAt = new Date();  // עדכון ידני
  await user.save();
  console.log("Updated user:", user.updatedAt);
}
