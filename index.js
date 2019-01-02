#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
program.version('1.0.0', '-v, --version')
    .command('init <name>')
    .action((name) => {
        if(!fs.existsSync(name)){
            inquirer.prompt([
                {
                    name: 'description',
                    message: '请输入项目描述'
                },
                {
                    name: 'author',
                    message: '请输入作者名称'
                }
            ]).then((answers) => {
                const spinner = ora('正在下载模板...');
                spinner.start();
                download('git@github.com:weixin3046/template.git', name, {clone: true}, (err) => {
                    if(err){
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    }else{
                        spinner.succeed();
                        const fileName = `${name}/package.json`;
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        }
                        if(fs.existsSync(fileName)){
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
                        }
                        console.log(symbols.success, chalk.green('项目初始化完成'));
                    }
                })
            })
        }else{
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('项目已存在'));
        }
    })
program.parse(process.argv);




//自动构建项目工具
// var projectData = {
//     'name': 'ruoyan', //项目名称
//     'fileData': [{
//             'name': 'css',
//             'type': 'dir'
//         },
//         {
//             'name': 'js',
//             'type': 'dir'
//         },
//         {
//             'name': 'img',
//             'type': 'dir'
//         },
//         {
//             'name': 'index.html',
//             'type': 'file',
//             'content': '<html>\n\t<head>\n\t\t<title>title</title>\n\t</head>\n\t<body>\n\t\t<h1>hello, world</h1>\n\t</body>\n</html>'
//         }
//     ]
// };

// var fs = require('fs');

// if (projectData.name) {
//     // fs.mkdir() 以异步的方式创建文件目录。如果目录已存在，将抛出异常；
//     //fs.mkdirSync是同步版的fs.mkdir()；
//     //fs.mkdir(path, [mode], [callback(err)])
//     //path          将创建的目录路径
//     //mode          目录权限（读写权限），默认0777
//     //callback      回调，传递异常参数err
//     fs.mkdirSync(projectData.name);

//     var fileData = projectData.fileData;

//     if (fileData && fileData.forEach) {

//         fileData.forEach(function(f) {

//             f.path = projectData.name + '/' + f.name;

//             f.content = f.content || '';

//             switch (f.type) {

//                 case 'dir':
//                     fs.mkdirSync(f.path);
//                     break;

//                 case 'file':
//                     fs.writeFileSync(f.path, f.content);
//                     break;

//                 default:
//                     break;

//             }
//         });
//     }
// }