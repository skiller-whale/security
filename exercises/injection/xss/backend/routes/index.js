import { Router } from 'express';
import {pool} from '../db.js'
const router = Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    let userId = req.session.userId
    const message = req.session.message
    const user = userId ? (await pool.query("select * from users where id = $1 limit 1", [userId])).rows[0] : null

    const reviews = (await pool.query("select reviews.*, users.name as user_name from reviews inner join users on users.id = user_id order by created_at desc")).rows

    let new_review = undefined

    if(req.query.review_title || req.query.review_body){
      new_review = {
        title: req.query.review_title || '',
        body: req.query.review_body || ''
      }
    }

    req.session.message = undefined

    res.render('index', {user, message, reviews, new_review });
  } catch(err){
    next(err)
  }
});

export default router;
