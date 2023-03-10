var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

router.get('/page/:page', function(req, res, next){
    var page = req.params.page;
    var sql = "SELECT * FROM board";
    conn.query(sql, function(err, rows){
        if(err) console.error("err : " + err);
        res.render('page', {title:'게시판 리스트', rows:rows, page:page, length:rows-1, page_num:10, pass:true});
        console.log(rows.length-1);
    })
})

router.post('/delete', function(req, res, next){
    var idx = req.body.idx;
    var passwd = req.body.passwd;
    var datas = [idx, passwd];
    var sql = "DELETE FROM board WHERE idx = ? AND passwd = ?";
    conn.query(sql, datas, function(err, result){
        if(err) console.error(err);
        if(result.affectedRows == 0){
            res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
        } else{
            res.redirect('/board/list');
        }
    });

});

router.post('/update', function(req, res, next){
    var idx = req.body.idx;
    var name = req.body.name;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [name, title, content, idx, passwd];

    var sql = "UPDATE board SET name = ?, title =?, content =?, modidate=now() WHERE idx=? AND passwd =?";
    conn.query(sql, datas, function(err, result){
        if(err) console.error(err);
        if(result.affectedRows == 0){
            res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
        }else{
            res.redirect('/board/read/'+idx);
        }
    });
});

router.get('/read/:idx', function(req, res, next){
    var idx = req.params.idx;
    var sql = "SELECT * FROM board WHERE idx=?";
    conn.query(sql, [idx], function(err, rows){
        if(err) console.err("err : "+err);
        res.render('read', {title:'글 상세', row:rows[0]});
    });
});

router.get('/list/:page', function(req, res, next){
    var page = req.params.page;
    var sql = "SELECT * FROM board";
    conn.query(sql,function (err, rows){
        if(err){
            console.error("err :"+err);
        }
        res.render('list', {title:'게시판 리스트', rows:rows});
    });
});

router.get('/list', function(req, res, next){
    res.redirect('/board/list/1');
});

router.get('/write', function(req, res, next){
    res.render('write', {title:"게시판 글 쓰기"});
});

router.post('/write', function(req, res, next){
    var name = req.body.name;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [name, title, content, passwd];

    var sql= "INSERT INTO board(name, title, content, regdate, modidate, passwd, hit) VALUES (?,?,?,now(),now(),?,0)";
    conn.query(sql, datas, function(err, rows){
        if (err) console.error("err :"+err);
        res.redirect('/board/list');
    });
});


module.exports = router;