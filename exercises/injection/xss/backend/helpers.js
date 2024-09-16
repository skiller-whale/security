const userLink = (review) => {
  return `by&nbsp;<a href="/users/${review.user_id}">${review.user_name}</a>`
}

export {userLink}
