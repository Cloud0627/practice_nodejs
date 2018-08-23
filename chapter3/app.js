const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");
const qs = require("querystring"); //QueryStringモジュールはクエリテキストを処理するための機能がある

//テンプレートファイルを読み込む
//変数 = fs.readFileSync("ファイル名","エンコーディング");
//readFileは非同期、readFileSyncは同期処理
const index_page = fs.readFileSync("./index.ejs", "utf8");
const other_page = fs.readFileSync("./other.ejs","utf8");
const style_css = fs.readFileSync("./style.css", "utf8");

var server = http.createServer(getFromClient);

server.listen(80);
console.log("Server start");

//ここまでメインプログラム

//createServerの処理
function getFromClient(request, response) {
    var url_paths = url.parse(request.url, true);
    //trueにすることでクエリパラメータとして追加されている部分もパース処理されるようになる。
    switch(url_paths.pathname){
        case "/":
            response_index(request,response);
            break;

        case "/other":
            response_other(request,response);
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

//追加するデータ用変数
var data = {
    msg:"no message..."
};

//indexアクセス処理
function response_index(request,response){
    //POSTアクセス時の処理
    if(request.method=="POST"){
        var body="";

        //データ受信のイベント処理
        request.on("data",(data)=>{
            body+=data;
        });

        //データ受信終了のイベント処理
        request.on("end",()=>{
            data = qs.parse(body); //データのパース
            write_index(request,response);
        });
    }else{
        write_index(request,response);
    }
}

//indexの表示の作成
function write_index(request,response){
    var msg = "※伝言を表示します。"
    var content = ejs.render(index_page, {
        title: "Index",
        content: msg,
        data: data,
    })
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(content);
    response.end();
}

//otherアクセス処理
function response_other(request, response) {
    var msg = "これはOtherページです。"
    //POSTアクセス時の処理
    if(request.method == "POST"){
        var body = "";

        //データ受信のイベント処理
        //オブジェクト.on(イベント名,関数);
        request.on("data",(data)=>{
            body += data;
        });

        //データ受信終了のイベント処理
        request.on("end",() =>{
            var post_data = qs.parse(body); //データのパース
            msg += "あなたは、「" + post_data.msg + "」と書きました。";
            var content = ejs.render(other_page,{
                title:"Other",
                content:msg,
            })
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write(content);
            response.end();
        });
    
    //GETアクセス時の処理
    }else{
        var msg = "ページがありません。"
        var content = ejs.render(other_page,{
            title:"Other",
            content:msg,
        });
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(content);
        response.end();
    }
}



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