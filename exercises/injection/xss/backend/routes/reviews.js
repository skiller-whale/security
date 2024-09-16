import { Router } from 'express';
import {pool} from '../db.js'
const router = Router();

/* create reviews details */
router.post('/', async function(req, res, next) {
  try {
    if(req.session.userId) {
      await pool.query("insert into reviews (title, body, user_id, created_at) VALUES($1,$2,$3, NOW())", [req.body.title, req.body.body, req.session.userId])
      req.session.message = "Review Created"
    }
    else {
      req.session.message = "You must be logged in to add a review"
    }
    res.redirect(302, '/')
  } catch (err){
    next(err)
  }
});

router.post('/:id/delete', async function(req, res, next) {
  try {
    const result = await pool.query("delete from reviews where id = $1 and user_id = $2", [req.params.id, req.session.userId])

    if(result.rowCount>0){
      req.session.message = "Review deleted"
    }
    res.redirect(302, '/')
  } catch (err){
    next(err)
  }
});

export default router;
