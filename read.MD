## 理解NodeJS路由
<p>1. 路由中间件</p>
<pre>
  var express = require('express');
  var app = express();
  // 监听3000的端口
  app.listen(3000,function(){
    // 告诉用户监听完成
    console.log("learn is listening at port 3000");
  });
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
</pre>
<p>
  上面的代码一个路由有两个处理器；当我们在浏览器访问 http://localhost:3000/foo 的时候，如果随机数小于
  0.5的话，那么处理器会往下传递，会执行第二个，如果随机数大于0.5，就会执行第一个；
</p>
<p>2. 支持路由路径和正则表达式</p>
<p>
  路由中指定的路径(比如/foo)最终会被express转换成一个正则表达式，某些正则表
  达式中的元字符可以用在路由路径中：+,?,*,(和)；比如如下一个路由处理/user和
  /username两个URL；
</p>
<pre>
  app.get('/user(name)?',function(req,res){
    res.send('hello world');
  });
</pre>
<p>3. 理解路由参数</p>
<pre>
  var staff = {
    'zhangsan': {bio:'aa'},
    'lisi': {bio:'bb'},
    'wangwu': {bio:'cc'}
  };
  app.get('/staff/:name',function(req,res,next){
    var info = staff[req.params.name];
    if(!info) {
      return next();
    }
    res.send(info);
  });
</pre>
<p>
  上面我们在路由中使用:name;它会跟任何字符串匹配(不包括反斜杠)，并将其跟键name
  一起放到 req.params对象中。比如上面的 当我们访问：
  http://localhost:3000/staff/zhangsan 会在浏览器中打印 {"bio":"aa"}
</p>
<p>
  路由中可以有多个参数，比如说我们现在把"张三,李四，王五"这三个人分在不同的城市
  里面去，把张三和李四分在上海，王五分在北京；因此我们在路由添加多个参数；代码
  如下：
</p>
<pre>
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
</pre>
<p>
  当我们在浏览器中访问 http://localhost:3000/staff/shanghai/lisi 这个的
  时候，我们可以打印出 {"bio":"bb"}到；
</p>
### 下面使用nodeJS中的路由语法实现图片占位符的效果；
<p>
  在本地创建一个服务器，然后在浏览器中这样访问一下；http://localhost:3000/100x100 在页面上会显示
  一张图片；长100px;宽100px；背景颜色有默认的颜色；当然我们可以随意的改变图片的宽度和高度；看自己的
  需求了；还有一种形式可以设置背景颜色和文字颜色，及文案显示；比如如下：
  http://localhost:3000/200x200/ef1212/eee?text=200x200 这样访问的时候，在页面会显示一张
  长200px和宽200px的图片，背景颜色为红色；字体的颜色为eee; 然后在图片上显示的文案是200x200；都是
  可自定义的；
  代码如下：
</p>
<pre>
  var express = require('express');
  var app = express();
  // 监听3000的端口
  app.listen(3000,function(){
    // 告诉用户监听完成
    console.log("learn is listening at port 3000");
  });
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
</pre>