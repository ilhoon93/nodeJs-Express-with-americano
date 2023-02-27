// express 인스턴스를 사용하겠다.
var express = require('express');

// express 프레임워크 라우터를 사용하기 위한 변수
var router = express.Router();

router.get('/', function(req, res, next){

    // view 파일을 렌더링 할 수 있다.
    res.render('form', {name: 'Form 테스트'});
});

router.post('/', function(req, res, next){
    res.json(req.body);
});

// 전역으로 해당 라우터를 사용하게 해준다.
module.exports = router;