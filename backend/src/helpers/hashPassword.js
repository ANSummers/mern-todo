import bcrypt from "bcryptjs";

const saltRounds = 10;

function hashPassword(password) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      throw err;
    } else {
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          throw err;
        } else {
          console.log(hash);
        }
      });
    }
  });

  return password;
}
