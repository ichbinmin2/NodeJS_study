const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// user model 생성

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },

  email: {
    type: String,
    trim: true,
    unique: 1,
  },

  password: {
    type: String,
    minlength: 5,
  },

  lastname: {
    type: String,
    maxlength: 50,
  },

  role: {
    type: Number,
    default: 0,
  },

  image: String,

  token: {
    type: String,
  },

  tokenExp: {
    type: Number,
  },
});

// pre는 mongoose의 메소드이며,
// 지정한 파라미터를 하기 전에~ 작업할 수 있도록 해준다.
// 비밀번호를 저장 전에 암호화 시킨다.
userSchema.pre("save", function (next) {
  // this 는 userSchema 자체를 지칭.
  let user = this;

  // * 조건식 추가
  // 정보를 바꿀 때마다 비밀번호를 암호화하는 것은 불필요한 작업이므로,
  // 조건식을 추가함으로서 비밀번호를 변경했을 때에만 암호화할 수 있도록 한다.
  if (user.isModified("password")) {
    // * salt 생성
    bcrypt.genSalt(saltRounds, function (err, salt) {
      // * 실패하면, 회원가입 라우트 내의 err 존으로 바로 이동
      if (err) return next(err);

      // * 성공하면, 암호화 진행.
      // 클라이언트에서 작성한 순수 비밀번호를 hash 메소드의 첫번쨰 파라미터로,
      // salt를 두번째 파라미터로,
      // 마지막 파라미터로 콜백 함수를 넣어준다.
      bcrypt.hash(user.password, salt, function (err, hash) {
        // * 실패하면, 회원가입 라우트 내의 err 존으로 바로 이동
        if (err) return next(err);

        // * 성공하면, 순수 비밀번호를 hash(암호화)된 비밀번호로 바꿔준다.
        user.password = hash;
        // 바로 그 다음 로직 실행
        next();
      });
    });
  }
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
