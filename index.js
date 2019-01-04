#!/usr/bin/env node
// commander.js，可以自动的解析命令和参数，用于处理用户输入的命令。

// download-git-repo，下载并提取 git 仓库，用于下载项目模板。

// Inquirer.js，通用的命令行用户界面集合，用于和用户进行交互。

// handlebars.js，模板引擎，将用户提交的信息动态填充到文件中。

// ora，下载过程久的话，可以用于显示下载中的动画效果。

// chalk，可以给终端的字体加上颜色。

// log-symbols，可以在终端上显示出 √ 或 × 等的图标。
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
        if (!fs.existsSync(name)) {
            inquirer.prompt([{
                    name: 'description',
                    message: 'Project description'
                },
                {
                    name: 'author',
                    message: 'Author'
                }
            ]).then((answers) => {
                const spinner = ora('正在下载模板...');
                spinner.start();
                download('https://github.com:weixin3046/template', name, { clone: true }, (err) => {
                    if (err) {
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    } else {
                        spinner.succeed();
                        const fileName = `${name}/package.json`;
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        }
                        if (fs.existsSync(fileName)) {
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
                        }
                        console.log(symbols.success, chalk.green('项目初始化完成'));
                    }
                })
            })
        } else {
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('项目已存在'));
        }
    })
program.parse(process.argv);
