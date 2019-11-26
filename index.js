var http = require('http')
var url = require('url')
var path = require('path')
var fs = require('fs')

var routes = {
    '/a': function(req, res){
        res.end(JSON.stringify(req.query))
    },
    '/b': function(req, res){
        res.end('match /b')
    },
    '/a/c': function(req, res){
        res.end('match /a/c')
    },
    '/search': function(req, res){
        res.end('username='+ req.body.username+',password=' + req.body.password)
    }
}

var server = http.createServer(function(req, res){
    routePath(req, res)
})
server.listen(8080)
console.log('visit http://localhost:8080')

function routePath(req, res){
    var pathObj = url.parse(req.url, true)
    var handleFn = routes[pathObj.pathname]
    if(handleFn){
        req.query = pathObj.query
        var body = ''
        req.on('data', function(chunk){
            body += chunk
        }).on('end', function(){
            req.body = parseBody(body)
            handleFn(req, res)
        })
    }else{
        staticRoot(path.resolve(__dirname, 'sample'), req, res)
    }
}

function staticRoot(staticPath, req, res){
    var pathObj = url.parse(req.url, true)
    if(pathObj.pathname === '/'){
        pathObj.pathname += 'test.html'
    }
    var filePath = path.join(staticPath, pathObj.pathname)

    // fs.readFileSync 是同步方法，直接返回结果，不接收回调函数，一开始这里犯错了，写成了同步，搞半天
    
    fs.readFile(filePath, 'binary', function(err, content){
        if(err){
            res.writeHead(404, 'not found')
            res.end('<h1>404 not found</h1>')
        }else{
            res.writeHead(200, 'OK')
            res.write(content, 'binary')
            res.end()
        }
    })
}
function parseBody(body){
    console.log(body)
    var obj = {}
    body.split('&').forEach(function(str){
      obj[str.split('=')[0]] = str.split('=')[1]
    })
    return obj
  }