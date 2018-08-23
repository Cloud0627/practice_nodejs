const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");

//テンプレートファイルを読み込む
//変数 = fs.readFileSync("ファイル名","エンコーディング");
//readFileは非同期、readFileSyncは同期処理
const index_page = fs.readFileSync("./index.ejs", "utf8");
const other_page = fs.readFileSync("./other.ejs","utf8");
const style_css = fs.readFileSync("./style.css", "utf8");

var server = http.createServer(getFromClient);

server.listen(80);

//ここまでメインプログラム

//createServerの処理
function getFromClient(request, response) {
    var url_paths = url.parse(request.url);
    switch(url_paths.pathname){
        case "/":
            var content = ejs.render(index_page,{
                title:"Index",
                content:"これはテンプレートを使ったサンプルページです。",
            });
            response.writeHead(200, { "Context-Type": "text/html" });
            response.write(content);
            response.end();
            break;

        case "/other":
            var content = ejs.render(other_page, {
                title: "Other",
                content: "これはOtherページです。",
            });
            response.writeHead(200, { "Context-Type": "text/html" });
            response.write(content);
            response.end();
            break;

        case "/style.css":
            response.writeHead(200, { "Context-Type": "text/css" });
            response.write(style_css);
            response.end();
            break;

        default:
            response.writeHead(200, { "Context-Type": "text/plain" });
            response.write("no page...");
            break;
    }
    
    /*
    //ejs.render(レンダリングするデータ,オブジェクト);
    var content = ejs.render(index_page,{
        title:"Indexページ",
        content:"これはテンプレートを使ったサンプルページです。",
    });
    response.writeHead(200, { "Context-Type": "text/html" });
    response.write(content);
    response.end();
    */
};


/*
//readFile完了後の処理
function writeToResponse(error, data) {
    //変数detaには読み込んできたファイルのデータが格納される
    //変数 = テキスト.replace(検索テキスト,置換テキスト);
    var content = data.
        replace(/dummy_title/g, "タイトルです").
        replace(/dummy_content/g, "これがコンテンツです。");
    response.writeHead(200, { "Context-Type": "text/html" });
    response.write(content);
    response.end();

}
*/