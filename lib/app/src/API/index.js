module.exports = {
  getUser: '/api/get_user',
  setUser: '/api/set_user', // 设置用户信息
  checkUser: user => user ? `/api/user/${user}` : '/api/user/:user',
  checkRep: (user, repo) => user ? `/api/user/${user}/repo/${repo}` : '/api/user/:user/repo/:repo',
  getStars: user => user ? `/api/user/${user}/get_stars` : '/api/user/:user/get_stars',
  getTips: user => user ? `/api/user/${user}/tips` : '/api/user/:user/tips', // get
  addTip: user => user ? `/api/user/${user}/tip` : '/api/user/:user/tip', // post
  setTip: (user, tipId) => user ? `/api/user/${user}/tip_id/${tipId}` : '/api/user/:user/tip_id/:tipId',
  delTip: (user, tipId) => user ? `/api/user/${user}/tip_id/${tipId}` : '/api/user/:user/tip_id/:tipId',
  setItem: (user, itemId) => user ? `/api/user/${user}/item_id/${itemId}` : '/api/user/:user/item_id/:itemId'
}
