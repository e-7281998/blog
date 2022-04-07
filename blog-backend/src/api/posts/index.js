import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl.js'
import checkLoggedIn from '../../lib/checkLoggedIn.js';

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);

// posts.delete('/', postsCtrl.deleteAll);

posts.get('/:id', postsCtrl.getPostById, postsCtrl.read);
posts.delete('/:id', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove);
posts.patch('/:id', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);

export default posts;
