var express = require('express'),
    Host = require('../models/Host'),
    User = require('../models/User'),
    Reserv = require('../models/Reserv');
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
  var title = form.title || "";
  var simpleInfo = form.simpleInfo || "";
  var city = form.city || "";
  var address = form.address || "";
  var cost = form.cost || "";
  var useful = form.useful || "";
  var rule = form.rule || "";

  title = title.trim();
  city = city.trim();
  address = address.trim();

  if (!title) { return '제목을 입력해주세요.'; }
  if (!simpleInfo) { return '설명을 입력해주세요.'; }
  if (!city) { return '도시를 입력해주세요.'; }
  if (!address) { return '주소를 입력해주세요.'; }
  if (!cost) { return '가격을 입력해주세요.'; }

  return null;
}

/* GET hosts listing. */
router.get('/', function(req, res, next) {
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

router.get('/:id/reserv', function(req, res, next) {
  Host.findById(req.params.id, function(err, host) {
    if (err) {
      return next(err);
    }
    res.render('hosts/reserv', {host: host});
  });
});

router.get('/:id', function(req, res, next) {
  Host.findById(req.params.id, function(err, host) {
    if (err) {
      return next(err);
    }

    res.render('hosts/show', {user: req.session.user, host: host});
  });
});

router.get('/:id/edit', function(req, res, next) {
  Host.findById(req.params.id, function(err, host) {
    if (err) {
      return next(err);
    }
    res.render('hosts/edit', {host: host});
  });
});

router.get('/:id/show', function(req, res, next) {
  Host.findById(req.params.id, function(err, host) {
    if (err) {
      return next(err);
    }
    res.render('hosts/show', {user: req.session.user, host: host});
  });
});

router.post('/', needAuth, function(req, res, next) {
  var area = req.body.area.trim();
  // 조건에 맞는 목록을 찾아서 전달해줘야 한다.
  Host.find({}, function(err, hosts) {
    if (err) {
      return next(err);
    }
    res.render('hosts/index', {hosts: hosts});
  });
});

router.post('/new', function(req, res, next) {
  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  var newHosting = new Host({
      title: req.body.title,
      hostName: req.session.user.name,
      simpleInfo: req.body.simpleInfo,
      city: req.body.city,
      address: req.body.address,
      cost: req.body.cost,
      useful: req.body.useful,
      rule: req.body.rule,
  });

  newHosting.save(function(err) {
    if (err) {
      return next(err);
    } else {
      User.update({_id: req.session.user},
         {$push: { hostList : newHosting._id }}, function(err, user) {
           console.log(user);
      });

      req.flash('success', '호스팅이 완료되었습니다.');
      res.redirect('/');
    }
  });
});

router.post('/:id/reserv', function(req, res, next) {
  var reserv = new Reserv({
    checkin: req.body.checkin,
    checkout: req.body.checkout,
    people: req.body.people,
    isReserv: false,
  });

  reserv.save(function(err) {
    if (err) {
      return next(err);
    } else {
      User.update({_id: req.session.user}, {$push: { reservList : reserv._id }}, function(err, user) {
        console.log(user);
      });
      Host.update({_id: req.params.id}, {$push: { reservList : reserv._id }}, function(err, host) {
        console.log(host);
      });
    }
    req.flash('success', '예약이 완료되었습니다.');
    res.redirect('/hosts');
  })
});

router.put('/:id', function(req, res, next) {
  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  Host.findById({_id: req.params.id}, function(err, host) {
    if (err) {
      return next(err);
    }
    if (!host) {
      req.flash('danger', '잘못된 접근입니다.');
      return res.redirect('back');
    }

    host.title = req.body.title;
    host.simpleInfo = req.body.simpleInfo;
    host.city = req.body.city;
    host.address = req.body.address;
    host.cost = req.body.cost;
    host.useful = req.body.useful;
    host.rule = req.body.rule;

    host.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '호스팅 정보가 변경되었습니다.');
      res.redirect('/');
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Host.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success', '사용자 계정이 삭제되었습니다.');
    res.redirect('/users');
  });
});

module.exports = router;
