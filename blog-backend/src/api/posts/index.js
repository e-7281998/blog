import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl.js'

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);
// posts.delete('/', postsCtrl.deleteAll);
posts.get('/:id', postsCtrl.checkObjectId, postsCtrl.read);
posts.delete('/:id', postsCtrl.checkObjectId, postsCtrl.remove);
posts.patch('/:id', postsCtrl.checkObjectId, postsCtrl.update);

export default posts;