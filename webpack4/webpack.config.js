const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const PurifyCssWebpack = require('purifycss-webpack');
const glob = require('glob');
const CopyWebPackPlugin = require('copy-webpack-plugin');
/*
const cssExtract = new ExtractTextWebpackPlugin('css/index.css');
const LessExtract = new ExtractTextWebpackPlugin('css/style.less');
*/
module.exports = {
    entry: {
        index: "./src/index.js"
    }, //入口文件
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve('./dist') //路径必须是绝对路径
    }, //出口
    devServer: { //开发服务器
        contentBase: './dist',
        port: 8090,
        compress: true, //服务器压缩
        open: true, //浏览器自动打开
        hot: true, //自动开启浏览器
    },
    module: {
        //模块配置
        rules: [
            //将css和less单独抽离出来文件
            /*    
                        {
                        test: /\.css$/,
                        use: cssExtract.extract({
                            use: [
                                //         { loader: 'style-loader' },
                                { loader: 'css-loader' }
                            ]
                        })
                    }, 
                        */
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [
                        //         { loader: 'style-loader' },
                        { loader: 'css-loader' },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require("autoprefixer")
                                ]
                            }
                        }
                    ]
                })
            }, {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [
                        //       { loader: 'style-loader' },
                        { loader: 'css-loader' },
                        { loader: 'less-loader' },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require("autoprefixer")
                                ]
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(gif|png|jpg|woff|svg|ttf|eot)$/, //图片的处理
                use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 500, //当图片小于这个值他会生成一个图片的url 如果是一个大于的他会生成一个base64的图片在js里展示
                            outputPath: 'img/', // 指定打包后的图片位置
                            publicPath: '../img',
                            name: '[name].[ext]?[hash]', //name:'[path][name].[ext]
                            //publicPath:output,

                        }
                    },
                    /*{
                        loader: 'file-loader',
                        options: {
                            limit:50,
                            name: '[name].[ext]?[hash]',
                            outputPath: 'img/',
                        }

                    }*/
                ]
            }
        ]
    },
    plugins: [ //插件
        /*
        LessExtract
        cssExtract
        */
        new CopyWebPackPlugin([{
            //拷贝文件插件
            from: './src/doc',
            to: 'doc'
        }]),
        new ExtractTextWebpackPlugin({
            //抽离css文件
            filename: 'css/index.css'
        }),
        new webpack.HotModuleReplacementPlugin(), //热更新
        new CleanWebpackPugin(['./build']),
        new HtmlWebpackPlugin({ //封包html
            filename: 'index.html',
            template: './src/index.html',
            title: '我是标题',
            hash: true,
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
            },
            chunks: ['index'], //对应index.html文件
        }),
        new PurifyCssWebpack({ //没用的css消除掉
            paths: glob.sync(path.resolve('src/*.html')),
        }),
    ],
    mode: 'development', //可以更改模式
    resolve: {
        //配置解析
    },
}