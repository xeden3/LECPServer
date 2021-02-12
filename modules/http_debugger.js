
$("[name='btn_page_http_debugger_send']").on("click", async function () {
    let url = $("[name='input_page_http_debugger_url']").val();
    let body_send = $("[name='input_page_http_debugger_body_send']").val();
    //判定输入值为空
    if (body_send == "") {
        alert("输入值为空！！！");
        return;
    } else {
        //解析下，是否是json结构
        let o = null;
        try {
            o = JSON.parse(body_send);
            body_send = JSON.stringify(o, null, 4);
            $("[name='input_page_http_debugger_body_send']").val(body_send);
        } catch (e) {
            alert("值非json格式");
            return;
        }

        try {
            let rp = await http_request_await(url, o);
            rp = JSON.parse(rp);
            rp = JSON.stringify(rp, null, 4)
            $("[name='input_page_http_debugger_response']").val(rp);
            // 保存到临时文件
            save_debugger_history_data(body_send);
            refresh_debugger_history_data();
        } catch (e) {
            alert(e);
            return;
        }
    }
});

$("[name='sel_page_http_debugger_history']").on("change", function () {
    let options = $("[name='sel_page_http_debugger_history'] option:selected");
    $("[name='input_page_http_debugger_body_send']").val(options.text());
});

let debugger_history_data = [];


// 读取调试历史命令
function load_debugger_history_data() {
    let s = JsProxyAPI.fileRead("./debugger_history_data.dat");
    if (s == "") {
        debugger_history_data = [];
        JsProxyAPI.fileWrite("./debugger_history_data.dat", JSON.stringify(debugger_history_data, null, "\t"));
    } else {
        try {
            debugger_history_data = JSON.parse(s);
        } catch (e) {
            alert(i18next.t('main.incorrect_format_of_file') + " debugger_history_data.dat:" + e);
        }
    }
}

function save_debugger_history_data(data) {
    debugger_history_data.push(data);
    // 保留最新1000个记录
    if (debugger_history_data.length > 50) {
        debugger_history_data.pop();
    }
    JsProxyAPI.fileWrite("./debugger_history_data.dat", JSON.stringify(debugger_history_data, null, "\t"));
}

function refresh_debugger_history_data() {
    let o = $("[name='sel_page_http_debugger_history']");
    o.empty();
    let l = deepCopy(debugger_history_data);
    l.reverse();
    o.append("<option></option>");
    for (let i in l) {
        o.append("<option>" + l[i] + "</option>");
    }
}


let ls_url = localStorage['input_page_debugger_url'];
if (ls_url == "" || ls_url == null) {
    ls_url = "http://127.0.0.1:8088";
    $("[name='input_page_http_debugger_url']").val(ls_url);
    localStorage['input_page_debugger_url'] = ls_url;
}else{
    $("[name='input_page_http_debugger_url']").val(ls_url);
}

$("[name='input_page_http_debugger_url']").on("input", function(){
    console.log($("[name='input_page_http_debugger_url']").val());
    localStorage['input_page_debugger_url'] = $("[name='input_page_http_debugger_url']").val();
});

load_debugger_history_data();
refresh_debugger_history_data();


//# sourceURL=http_debugger.js
