import Joi from 'joi';
import User from '../../models/user.js';

/*
    POST /api/auth/register
    {
        username: 'shshsha',
        password: 'mypass123',
    }
*/
/*
export const all = async ctx => {
    try {
        const users = await User.find().exec();
        ctx.body = users.map(user => user.toJSON()).map(user => ({
            ...user,

        }))
    } catch (e) {
        console.log(e);
    }
}
*/

export const register = async ctx => {
    //회원가입
    //Request Body 검증하기
    const schema = Joi.object().keys({
        username: Joi.string()
            .alphanum() //알파벳만 입력받도록
            .min(3)
            .max(20)
            .required(),
        password: Joi.string().required(),
    });
    const result = schema.validate(ctx.request.body);
    if (!result) {
        ctx.status = 404;
        ctx.body = result.error;
        return;
    }

    const { username, password } = ctx.request.body;
    try {
        //username이 이미 존재하는지 확인
        const exists = await User.findByUsername(username);
        if (exists) {
            ctx.status = 400;
            return;
        }
        const user = new User({
            username,
        });
        await user.setPassword(password);   //비밀번호 설정
        await user.save();  //데이터베이스에 저장

        //응답할 데이터에서 hashedPassword 필드 제거
        ctx.body = user.serialize();
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const login = async ctx => {
    //로그인
};
export const check = async ctx => {
    //로그인 상태 확인
};
export const logout = async ctx => {
    //로그아웃
}