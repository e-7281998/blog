import mongoose from "mongoose";
import bcrypt from 'bcrypt';

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

const User = mongoose.model('User', UserSchema);
export default User;