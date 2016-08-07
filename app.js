
var express = require('express');

var app = express();

// 监听3000的端口
app.listen(3000,function(){
  // 告诉用户监听完成
  console.log("learn is listening at port 3000");
});
/*
app.get('/foo',function(req,res,next){
  console.log(Math.random());
  if(Math.random() < 0.5) {
    return next();
  }
  res.send('hello world');
});

app.get('/foo',function(req,res){
  res.send('hello world 2');
});
*/
/*
var staff = {
  'shanghai': {
    'zhangsan': {bio:'aa'},
    'lisi': {bio:'bb'}
  },
  'hangzhou': {
    'wangwu': {bio:'cc'}
  }
};
app.get('/staff/:city/:name',function(req,res,next){
  var info = staff[req.params.city][req.params.name];
  if(!info) {
    return next();
  }
  res.send(info);
});
*/
app.get('/',function(req,res){
  res.send('welcome to image-holder');
});
app.get('/:widthHeight',function(req,res,next){
  var width = req.params.widthHeight.split('x')[0];
  var height = req.params.widthHeight.split('x')[1];
  if(width && height) {
    var svgXml = createSvgXml({
      width:width,
      height:height
    });
    res.type('image/svg+xml');
    res.send(svgXml);
    res.end();
  }else {
    next();
  }
});
app.get('/:widthHeight/:bgColor/:fColor',function(req,res){
  var width = req.params.widthHeight.split('x')[0];
  var height = req.params.widthHeight.split('x')[1];
  var bgColor = req.params.bgColor;
  var fColor = req.params.fColor;
  var text = req.query.text;
  var svgXml = createSvgXml({
    width:width,
    height:height,
    bgColor:'#' + bgColor,
    fColor: '#' + fColor,
    text:text
  });
  res.type('image/svg+xml');
  res.send(svgXml);
  res.end();
});
function createSvgXml(obj) {
  var width = obj.width || '100';
  var height = obj.height || '100';
  var bgColor = obj.bgColor || '#ff0000';
  var fColor = obj.fColor || '#fff';
  var text = obj.text || '暂无文字';
  var textVar = '<svg xmlns="http://www.w3.org/2000/svg" height = "'+height+'" width="'+width+'">'+
                  '<rect width="'+width+'" height="'+height+'" style="fill:'+bgColor+'"/>'+
                  '<text x="50%" y="50%" font-size="20" dy=".3em" fill="'+fColor+'" text-anchor="middle">'+text+'</text>'+
                '</svg>';

  var textNoVar = '<svg xmlns = "http://www.w3.org/2000/svg" height="'+height+'" width="'+width+'">'+
                    '<rect width="'+width+'" height="'+height+'" style="fill:"+bgColor+""/>'+
                    '<text x="50%" y="50%" font-size="20" dy=".3em" "fill:'+bgColor+'" text-anchor="middle">"'+width+'"x"'+height+'"</text>'+
                  '</svg>';
  if(text) {
    return textVar;
  }else {
    return textNoVar;
  }
}