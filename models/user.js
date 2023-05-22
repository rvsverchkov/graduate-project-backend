const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Пользователь',
  },
  courses: {
    type: Object,
    default: {
      office: {
        userValue: 0,
        resultValue: 5
      },
      email: {
        userValue: 0,
        resultValue: 10
      },
      phishing: {
        userValue: 0,
        resultValue: 12
      }
    }
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Начинающий в области',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.])([\/\w\.-]*)*\/?$/.test(v);
      },
    },
    required: false,
    default: 'https://cdn.dribbble.com/users/1770290/screenshots/6158205/bg_75.gif',
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
