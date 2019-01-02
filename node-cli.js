//自动构建项目工具
var projectData = {
    'name': 'ruoyan', //项目名称
    'fileData': [{
            'name': 'css',
            'type': 'dir'
        },
        {
            'name': 'js',
            'type': 'dir'
        },
        {
            'name': 'img',
            'type': 'dir'
        },
        {
            'name': 'index.html',
            'type': 'file',
            'content': '<html>\n\t<head>\n\t\t<title>title</title>\n\t</head>\n\t<body>\n\t\t<h1>hello, world</h1>\n\t</body>\n</html>'
        }
    ]
};

var fs = require('fs');

if (projectData.name) {
    // fs.mkdir() 以异步的方式创建文件目录。如果目录已存在，将抛出异常；
    //fs.mkdirSync是同步版的fs.mkdir()；
    //fs.mkdir(path, [mode], [callback(err)])
    //path          将创建的目录路径
    //mode          目录权限（读写权限），默认0777
    //callback      回调，传递异常参数err
    fs.mkdirSync(projectData.name);

    var fileData = projectData.fileData;

    if (fileData && fileData.forEach) {

        fileData.forEach(function(f) {

            f.path = projectData.name + '/' + f.name;

            f.content = f.content || '';

            switch (f.type) {

                case 'dir':
                    fs.mkdirSync(f.path);
                    break;

                case 'file':
                    fs.writeFileSync(f.path, f.content);
                    break;

                default:
                    break;

            }
        });
    }
}