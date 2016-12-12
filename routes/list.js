var express = require('express'),
    Host = require('../models/Host'),
    User = require('../models/Host');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
}

function validateForm(form) {
  var area = form.area || "";
  var people = form.people || "1";
  area = area.trim();
  people = people.trim();

  if (!area) {
    return '지역을 입력해주세요.';
  }

  if (!people) {
    return '사람 수를 입력해주세요.';
  }

  return null;
}

/* GET users listing. */
router.post('/', needAuth, function(req, res, next) {
  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  Host.find({}, function(err, hosts) {
    if (err) {
      return next(err);
    }
    res.render('hosts/index', {hosts: hosts});
  });
});

router.get('/new', function(req, res, next) {
  res.render('hosts/new', {messages: req.flash()});
});

router.get('/:id/edit', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    res.render('users/edit', {user: user});
  });
});

router.put('/:id', function(req, res, next) {
  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  User.findById({_id: req.params.id}, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('danger', '존재하지 않는 사용자입니다.');
      return res.redirect('back');
    }

    if (user.password !== req.body.current_password) {
      req.flash('danger', '현재 비밀번호가 일치하지 않습니다.');
      return res.redirect('back');
    }

    user.name = req.body.name;
    user.email = req.body.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '사용자 정보가 변경되었습니다.');
      res.redirect('/users');
    });
  });
});

router.delete('/:id', function(req, res, next) {
  User.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success', '사용자 계정이 삭제되었습니다.');
    res.redirect('/users');
  });
});

router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    res.render('users/show', {user: user});
  });
});

module.exports = router;
