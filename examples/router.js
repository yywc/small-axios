const Router = require('express').Router

const router = Router()

router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
})

module.exports = router
