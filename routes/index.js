var fs = require('fs'),
path = require('path'),
config = require('../config');

function geFileList(dir) {
    var filesList = [];
    readFile(dir, filesList);
    return filesList;
}

//遍历读取文件
function readFile(dir, filesList) {
    files = fs.readdirSync(dir); //需要用到同步读取
    files.forEach(walk);

    function walk(file) {
        states = fs.statSync(path.join(dir, file));
        var obj = new Object();
        if (states.isDirectory()) {
            obj.name = file; //文件名
            obj.type = 1; // 文件类型
            obj.path = path.relative(dir, path.join(dir, file)) //文件绝对路径
            filesList.push(obj);
        } else {
            //创建一个对象保存信息
            obj.name = file; //文件名
            obj.type = 2;
            obj.path = path.relative(dir, path.join(dir, file)); //文件绝对路径
            filesList.push(obj);
        }
    }
}


function sortHandler(a, b) {
    if (a.type < b.type)
        return -1;
    else if (a.type > b.type) return 1
    return 0;
}

exports.sendJson = function(req, res, next) {
    'use strict';
    var jsonDir = req.params[0], jsonName = req.params[1];
    res.set('Content-type', 'application/json');
    res.sendfile(path.join(config.location, req.path));
};

exports.listFiles = function (req, res, next) {
    var filesList = geFileList(path.join(config.location, req.path));
    filesList.sort(sortHandler);
    var html = '<!DOCTYPE HTML><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>文件列表</title></head><body><div><a href=".." style="text-decoration: none;color: black;font-size:18px;margin-bottom: 10px;"><i style="display: inline-block;width: 20px;height: 22px;background: url(http://baixuexiyang.github.io/artEditor/img/forward.png);vertical-align: bottom;"></i>返回上一层</a></div>'
        for(var i = 0; i < filesList.length; i++) {
            html+= '<div>';
            if(filesList[i].type == 1) {
                html+= '<a href="'+filesList[i].path+'" style="text-decoration: none;color: black;font-size:18px;margin-bottom: 10px;"><i style="display: inline-block;width: 20px;height: 22px;background: url(http://baixuexiyang.github.io/artEditor/img/dir.png);margin-right: 5px;"></i>'+filesList[i].name+'</a>';
            } else {
                html+= '<a href="'+filesList[i].path+'" style="text-decoration: none;color: black;font-size:18px;margin-bottom: 10px;"><i style="display: inline-block;width: 20px;height: 22px;background: url(http://baixuexiyang.github.io/artEditor/img/f.png);margin-right: 5px;"></i>'+filesList[i].name+'</a>'
            }
            html+= '</div></body></html>';
        }
        
    res.writeHead(200, {'Content-type' : 'text/html'});
    res.write(html);
    res.end();
};

exports.getHtml = function (req, res, next) {
    'use strict';
    var recursive = function (typeIdx) {
        var shownTypes = ['html', 'shtml', 'php', 'ejs', 'jade', 'htm'];
        var filename = req.params[1] ? req.params[0] + req.params[1] : req.params[0] + '.' + shownTypes[typeIdx], filepath = path.join('.', 'views', filename);
        if (typeIdx < shownTypes.length) {
            fs.exists(filepath, function (exists) {
                if (exists) {
                    res.render(filename, {
                        title: req.params[0]
                    });
                } else {
                    recursive(typeIdx + 1);
                }
            });
        } else {
            next();
        }
    };
    recursive(0);
};
