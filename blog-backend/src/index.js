// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api/index.js';

import jwtMiddleware from './lib/jwtMiddleware.js';

// import createFakeData from './createFakeData.js';

const { PORT, MONGO_URI } = process.env;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('connected to mongoDB');
        // createFakeData();
    })
    .catch(e => {
        console.error(e);
    });


const app = new Koa();
const router = new Router();

//라우터 설정
router.use('/api', api.routes());  //api 라우트 적용

//라우터 적용 전에 bodyparser 적용
app.use(bodyParser());
app.use(jwtMiddleware)

//app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
    console.log('listening to port %d', port);
});