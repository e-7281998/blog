import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: String,
    hashedPassword: String,
});

UserSchema.methods.setPassword = async function (password) {
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash; //this는 문서 인스턴스 가기킴
};
UserSchema.methods.checkPassword = async function (password) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result;  //true, false;
};

UserSchema.methods.serialize = function () {
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
};

UserSchema.statics.findByUsername = function (username) {
    return this.findOne({ username });    //this는 모델 가리킴
}

//토큰 발급
UserSchema.methods.generateToken = function () {
    const token = jwt.sign(
        //첫번째 파라미터에는 토큰 안에 지어넣고 싶은 데이터를 넣는다.
        {
            _id: this.id,
            username: this.username,
        },
        //두번째 파라미터에는 JWT 암호를 넣어준다.
        process.env.JWT_SECRET,
        {
            //7일 동안만 유효함
            expiresIn: '7d',
        },
    );

    return token;
};

const User = mongoose.model('User', UserSchema);
export default User;