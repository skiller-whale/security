import { Router } from 'express';
import {pool} from '../db.js'
const router = Router();

/* update user details */
router.post('/', async function(req, res, next) {
  try {
    if(req.session.userId) {
      await pool.query("update users set name=$1 where id=$2", [req.body.name, req.session.userId])
      req.session.message = "Name updated"
    }
    else {
      const result = await pool.query("insert into users (name) values($1) returning *", [req.body.name])
      req.session.userId = result.rows[0].id
      req.session.message = "User created"
    }
    res.redirect(302, '/')
  } catch (err){
    next(err)
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    const user = (await pool.query("select * from users where id = $1", [req.params.id])).rows[0]
    res.render('users/show', {user});
  } catch (err){
    next(err)
  }
});

export default router;
