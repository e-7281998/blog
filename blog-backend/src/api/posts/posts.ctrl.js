import Post from '../../models/post.js';
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

export const checkOwnPost = async (ctx, next) => {
    const { user } = ctx.state;
    const { id } = ctx.params;
    const post = await Post.findById(id).exec();
    if (post.user._id.toString() !== user._id) {
        ctx.status = 403;
        return;
    }
    return next();
}

export const getPostById = async (ctx, next) => {
    const { id } = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400;   //bad request
        return;
    }
    try {
        const post = await Post.findById(id);
        //포스트가 존재하지 않을 때
        if (!post) {
            ctx.status = 404;   //not found
            return;
        }
        ctx.state.post = post;
        return next();
    } catch (e) {
        ctx.throw(500, e);
    }
    return next();
}

export const write = async ctx => {
    const schema = Joi.object().keys({
        //객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(), //required()가 있으면 필수 항목
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required() //문자열로 이루어진 배열
    });

    //검증하고 나서 검증 실패인 경우 에러처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { title, body, tags } = ctx.request.body;
    // console.log(ctx.state);
    const post = new Post({
        title,
        body,
        tags,
        user: ctx.state.user,
    });
    try {
        await post.save();
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};
export const list = async ctx => {
    //query는 문자열이기 때문에 숫자로 변환해 주어야 한다.
    //값이 주어지지 않았다면 1을 기본으로 사용한다.
    //parseInt 사용 시 두번째 인자를 넣지 않는다면
    //parseInt("08") 사용 시 0으로 인식해 8진수로 가정하여 결과가 0이 나오게 된다.
    const page = parseInt(ctx.query.page || '1', 10);
    if (page < 1) {
        ctx.status = 404;
        return;
    }
    const { tag, username } = ctx.query;
    //tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음.
    const query = {
        ...(username ? { 'user.username': username } : {}),
        ...(tag ? { tags: tag } : {}),
    };

    try {
        const posts = await Post.find(query)
            .sort({ _id: -1 })
            .limit(10)
            .skip((page - 1) * 10)
            .exec();
        const postCount = await Post.countDocuments(query).exec();
        ctx.set('Last-Page', Math.ceil(postCount / 10));
        ctx.body = posts.map(post => post.toJSON()).map(post => ({
            ...post,
            body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`
        }));
    } catch (e) {
        console.log(e);
    }
};
export const read = async ctx => {
    ctx.body = ctx.state.post;
};
export const remove = async ctx => {
    const { id } = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;   //no content : 성공했지만 응답할 데이터는 없음
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const deleteAll = async ctx => {
    try {
        await Post.remove({});
        ctx.status = 204;   //no content : 성공했지만 응답할 데이터는 없음
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const update = async ctx => {
    const { id } = ctx.params;
    //write에서 사용한 schema와 비슷한데, required()가 없다.
    const schema = Joi.object().keys({
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()),
    });

    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }


    try {
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true, //이 값을 설정하면 업데이트 된 데이터 반환
            //false라면 업데이트 되기 전의 데이터를 반환
        }).exec();
        if (!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};