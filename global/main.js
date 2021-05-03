// global value
var g_version = "v1.0.23";
$("[name='lb_version']").html("2020 &copy; LECPServer By Leanboard Tech Ltd &nbsp;|&nbsp; " + g_version + "  &nbsp;");
JsProxyAPI.setTitle("LECPServer " + g_version)
JsProxyAPI.setNotifyIcon("logo.ico");
JsProxyAPI.setNotifyTitle("LECPServer");

var g_plc_data = null; // plc当前数据
var g_user_login = ""; // 当前登陆用户
var g_handler_plc = {};
var g_handler_db = null;
var g_modules_conf = null;
var g_settings_conf = null;
var g_sync_worker_lock = null;

// PLC的返回状态，包括入口和出口，可以分别进行报警和显示
// Online和Offline只看入口即可
var g_plc_status = {}



// 读取 settings.conf 配置信息
function load_settings_conf() {
    let s = JsProxyAPI.fileRead("./settings.conf");
    if (s == "") {
        alert("settings.conf " + i18next.t('main.does_not_exist'));
        return false;
    }
    try {
        g_settings_conf = JSON.parse(s);
        return true;
    } catch (e) {
        alert(i18next.t('main.incorrect_format_of_file') + " settings.conf:" + e);
        return false;
    }
}



// 读取 modules.conf 配置信息
function load_modules_conf() {
    let s = JsProxyAPI.fileRead("./modules.conf");
    if (s == "") {
        alert("modules.conf " + i18next.t('main.does_not_exist'));
        return false;
    }
    try {
        g_modules_conf = JSON.parse(s);
        return true;
    } catch (e) {
        alert(i18next.t('main.incorrect_format_of_file') + " modules.conf:" + e);
        return false;
    }
}



// 读取 plc.conf 配置信息
function load_plc_conf() {
    let s = JsProxyAPI.fileRead("./plc.conf");
    if (s == "") {
        alert("plc.conf " + i18next.t('main.does_not_exist'));
        g_plc_data = { "NODES": {}, "DEVS": {}, "WEBAPI": { "PORT": 8088 } }
        JsProxyAPI.fileWrite("plc.conf", JSON.stringify(g_plc_data, null, "\t"));
        return false;
    }

    try {
        g_plc_data = JSON.parse(s);
        return true;
    } catch (e) {
        alert(i18next.t('main.incorrect_format_of_file') + " plc.conf:" + e);
        return false;
    }
}

function deepCopy(target) {
    let copyed_objs = [];//此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象 
    function _deepCopy(target) {
        if ((typeof target !== 'object') || !target) { return target; }
        for (let i = 0; i < copyed_objs.length; i++) {
            if (copyed_objs[i].target === target) {
                return copyed_objs[i].copyTarget;
            }
        }
        let obj = {};
        if (Array.isArray(target)) {
            obj = [];//处理target是数组的情况 
        }
        copyed_objs.push({ target: target, copyTarget: obj })
        Object.keys(target).forEach(key => {
            if (obj[key]) { return; }
            obj[key] = _deepCopy(target[key]);
        });
        return obj;
    }
    return _deepCopy(target);
}

// 队列对象
function Queue() {
    var items = [];

    this.enqueue = function (element) {
        items.push(element);
    };
    this.dequeue = function () {
        return items.shift();
    };
    this.front = function () {
        return items[0];
    };
    this.end = function () {
        return items[items.length - 1];
    };
    this.clear = function () {
        items = [];
    };
    this.isEmpty = function () {
        return items.length == 0;
    };
    this.size = function () {
        return items.length;
    };
    this.print = function () {
        console.log(items.toString());
    };
    this.toJson = function () {
        // JSON.stringify(g_tray_data_entry, null, "\t")
        return JSON.stringify(items, null, "\t");
    };
    this.load = function (t) {
        items = JSON.parse(t);
    }
    this.getItems = function () {
        return items;
    }
}

function get_guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
// =======================================================================
// =======================================================================
// =====================  全局函数们  =====================================
// =======================================================================
// =======================================================================

// 延时函数
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function get_datatime_by_hhmmss() {
    let d = new Date();
    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

// WORD ARRAY 到 BOOLEAN ARRAY的转换
function word_array_to_boolean_array(values) {
    let d = [];
    for (i in values) {
        let v = values[i];
        let b = v.toString(2);
        b = ('000000000000000000' + b).slice(-16).split("");
        let p = 0;
        a = [];
        for (i = b.length - 1; i >= 0; i--) {
            a[p] = b[i];
            p++;
        }
        d = d.concat(a);
    }
    return d;
}

// BOOLEAN ARRAY 到 WORD ARRAY 的转换
function boolean_array_to_word_array(values) {
    // 先确认这个word占用多少个，取最大的idx
    let wl = values.length / 16
    // 如果是boolean的值，则先转为int数组
    if (typeof (values[values.length - 1]) == "boolean") {
        for (i = 0; i < values.length; i++) {
            if (values[i] == true) values[i] = 1;
            if (values[i] == false) values[i] = 0;
        }
    }
    let d = [];
    for (i = 0; i < wl; i++) {
        let s = "";
        for (c = 16 - 1; c >= 0; c--) {
            s += values[i * 16 + c].toString();
        }
        d[i] = parseIntInt(s, 2);
    }
    return d;
}

// WORD ARRAY 到 STRING ARRAY的转换
function word_array_to_string_array(values) {
    let ds = []
    for (i in values) {
        let ws = values[i];
        let d = [];
        for (c in values[i]) {
            let w = values[i][c];
            let hexs = w.toString(16);
            // 将每个word转为两个byte
            hexs = ('0000' + hexs).slice(-4);
            //取高低位
            let h = hexs.substring(0, 2);
            let l = hexs.substring(2, 4);
            // 放入数组内
            d = d.concat([l, h]);
        }
        let s = "";
        for (let k = 0; k < d.length; k++) {
            s += String.fromCharCode(parseInt(d[k], 16));
        }
        // 转为字符串
        ds[i] = s.replace(/\0/g, '');
    }
    return ds;
}

// STRING ARRAY 到 WORD ARRAY 的转换 length_of_words 参数是WORD的长度
// 譬如["AAA","BBB"] 转为 WORD ARRAY
// string_array_to_word_array(["AAA","BBB"], 16)
// 返回
// [
//    [16705, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//    [16962, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// ]
// 然后可以用该值作为二维数组发送到OPCUA
function string_array_to_word_array(values, length_of_words) {
    let ds = []
    for (i in values) {
        let s = values[i];
        // 字符串拆分成byte
        let ss = s.split("");
        let p = 0;
        let d = [];
        for (c = 0; c < length_of_words; c++) {
            if (ss[p] == null && ss[p + 1] == null) {
                d.push(0);
            } else if (ss[p] != null && ss[p + 1] == null) {
                let h = ss[p].charCodeAt(0);
                d.push(h * 256);
                p += 2;
            } else {
                let h = ss[p + 1].charCodeAt(0);
                let l = ss[p].charCodeAt(0);
                p += 2;
                d.push(h * 256 + l);
            }
        }
        ds.push(d)
    }
    return ds;
}

// 插入dashboard日志记录
// entry select pick_01 pick_02 exits
function insert_dashboard_data(msg, type = "default", zone = "entry") {
    // label-success 完成一组工作  label-default 中间信息 label-danger 报警信息
    let t = "label-" + type;
    let html = '<li><div class="col1"><div class="cont"><div class="cont-col1"><div class="label label-sm ' + t + '"><i class="fa fa-bullhorn"></i></div></div>' +
        '<div class="cont-col2"><div class="desc"> ' + msg + ' </div></div></div></div><div class="col2">' +
        '<div class="date"> ' + get_datatime_by_hhmmss() + ' </div></div></li>';
    $("[name='msg_dashboard_page_" + zone + "']").prepend(html);
    if ($("[name='msg_dashboard_page_" + zone + "']").children('li').length > 500) {
        // 删掉后面一个元素
        $("[name='msg_dashboard_page_" + zone + "']").children('li:last-child').remove();
    }
}

// =======================================================================
// =======================================================================
// =====================  主要通讯函数 ====================================
// =======================================================================
// =======================================================================


// 初始化 WebAPI 服务器
function init_webapi_server() {
    // 获取点位的值
    function plc_read_node(key, plc_data, ch_node = "value") {
        // 查询key是否存在
        try {
            element = plc_data;
            // 递推每个节点名称
            (key + "." + ch_node).split(".").forEach(function (x) {
                // 获取节点数据
                element = element[x];
            });
            // 如果拿不到东西
            if (typeof (element) == "undefined")
                return null;
            return element;
        } catch (e) {
            return null;
        }
    }

    function plc_get_node_dev(key, plc_data) {
        // 查询key是否存在
        let dev = "";
        try {
            element = plc_data;
            // 递推每个节点名称
            (key).split(".").forEach(function (x) {
                // 获取节点数据
                if (dev == "" && x !== "NODES")
                    dev = x;
                element = element[x];
            });
            // 如果拿不到东西
            if (typeof (element) == "undefined")
                return null;
            return dev;
        } catch (e) {
            return null;
        }
    }

    let r = JsProxyAPI.webAPIStart(g_plc_data['WEBAPI']['PORT'],
        function (success, handler) {
            console.log(success, handler);
        },
        function (msg) {
            console.log(msg);
            // 将msg转为json结构
            let j = null;
            try {
                j = JSON.parse(msg);
            } catch (e) {
                return JSON.stringify({ "errcode": 4001, "errmsg": "JSON parsing error" });
            }
            // 判断 action 是否存在
            // action 的名称有 plc_read_node / plc_write_node / plc_read_nodes / plc_write_nodes  
            if (!j.hasOwnProperty("action")) {
                return JSON.stringify({ "errcode": 4002, "errmsg": "Key action is not exist" });
            }

            if (j['action'] != "plc_read_node" && j['action'] != "plc_write_node" && j['action'] != "plc_read_nodes" && j['action'] != "plc_write_nodes") {
                return JSON.stringify({ "errcode": 4003, "errmsg": "Key action is not in plc_read_node / plc_write_node / plc_read_nodes / plc_write_nodes" });
            }

            if (!j.hasOwnProperty("node")) {
                return JSON.stringify({ "errcode": 4002, "errmsg": "Key node is not exist" });
            }

            // 如果PLC离线则返回异常
            if (j['action'] == "plc_read_node") {

            }

            if (j['action'] == "plc_read_nodes") {

            }

            // 处理 plc_read_node
            if (j['action'] == "plc_read_node") {
                console.time("A");
                
                let dev = plc_get_node_dev(j['node'], g_plc_data);
                if (dev == null || typeof (g_plc_status[dev]) == "undefined") {
                    return JSON.stringify({ "errcode": 4012, "errmsg": "Device " + dev + " is not exist" });
                }
                if (g_plc_status[dev]['online'] == false) {
                    return JSON.stringify({ "errcode": 4013, "errmsg": "Device " + dev + " is offline" });
                }
                dev = null;

                let rt = plc_read_node(j['node'], g_plc_data);
                if (rt == null) {
                    return JSON.stringify({ "errcode": 4055, "errmsg": "Node is not correct", "rtval": null });
                }
                console.timeEnd("A");
                return JSON.stringify({ "errcode": 0, "errmsg": "", "rtval": rt });
            }

            // 处理 plc_read_nodes
            if (j['action'] == "plc_read_nodes") {
                // j['node'] = [node1, node2, node3, node4, node5 ... ]
                // 判断有无节点参数
                if (!j.hasOwnProperty("node")) {
                    return JSON.stringify({ "errcode": 4007, "errmsg": "Key node is not exist" });
                }
                if (!Array.isArray(j['node'])) {
                    return JSON.stringify({ "errcode": 4009, "errmsg": "Key node is not array" });
                }

                let rts = [];
                for (let i in j['node'])
                    rts.push(null);

                for (let i in j['node']) {
                    let node = j['node'][i];

                    // 如果PLC离线则返回异常
                    let dev;
                    for (let n in j['node']) {
                        dev = plc_get_node_dev(node, g_plc_data);
                        break;
                    }
                    if (dev == null || typeof (g_plc_status[dev]) == "undefined") {
                        return JSON.stringify({ "errcode": 4012, "errmsg": "Device " + dev + " is not exist" });
                    }
                    if (g_plc_status[dev]['online'] == false) {
                        return JSON.stringify({ "errcode": 4013, "errmsg": "Device " + dev + " is offline" });
                    }
                    dev = null;

                    let rt = plc_read_node(node, g_plc_data);
                    if (rt == null) {
                        rts[i] = null;
                        return JSON.stringify({ "errcode": 4055, "errmsg": "Node [" + node + "] is not exists", "rtval": rts });
                    }
                    rts[i] = rt;
                }
                return JSON.stringify({ "errcode": 0, "errmsg": "", "rtval": rts });
            }

            // 处理 plc_write_node
            if (j['action'] == "plc_write_node") {
                /*
                // 先判断有没有 type 这个关键字
                if(!j.hasOwnProperty("type")){
                    return JSON.stringify({"errcode":4006, "errmsg":"Key type is not exist"});
                }
                */
                // 判断有无值参数
                if (!j.hasOwnProperty("value")) {
                    return JSON.stringify({ "errcode": 4007, "errmsg": "Key value is not exist" });
                }
                // 判断有无节点参数
                if (!j.hasOwnProperty("node")) {
                    return JSON.stringify({ "errcode": 4007, "errmsg": "Key node is not exist" });
                }

                let node = j['node'];

                let type = plc_read_node(node, g_plc_data, "type");
                let dev = plc_get_node_dev(node, g_plc_data);
                let done = 0;

                // 如果是模拟驱动模式，直接写入本buffer值
                if (g_plc_data['DEVS'][dev]['PLC_DRIVER'] == "simulation") {
                    let rt = plc_read_node(node, g_plc_data, "addr");
                    if (rt == null) {
                        return JSON.stringify({ "errcode": 4057, "errmsg": "Node [" + node + "] is not exists", "rtval": rt });
                    }
                    let a = node.split(".");
                    g_plc_data['NODES'][dev][a[a.length - 1]]['value'] = j['value'];
                    return JSON.stringify({ "errcode": 0, "errmsg": "" });
                }

                if (type == null || dev == null) {
                    return JSON.stringify({ "errcode": 4059, "errmsg": "Node [" + node + "] is not exists", "rtval": null });
                }
                let protocol = "";
                if (g_modules_conf[g_plc_data['DEVS'][dev]['PLC_DRIVER']]['TYPE'].startsWith("MODBUS")) {
                    protocol = "modbus";
                }

                try {
                    let done = false;
                    let rtval = null;
                    if (type == "String") {
                        if (protocol == "modbus") {
                            let addr = plc_read_node(node, g_plc_data, "addr");
                            addr = addr.toLowerCase();
                            if (addr.startsWith("holding") || addr.startsWith("h")) {
                                addr = addr.replace("holding", "");
                                addr = addr.replace("h", "");
                                done = JsProxyAPI.plcWriteStringBlocking(g_handler_plc[dev], addr, j['value']);
                            } else if (addr.startsWith("input") || addr.startsWith("i")) {
                                return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support input register writing", "rtval": null });
                            } else {
                                addr = addr;
                                done = JsProxyAPI.plcWriteStringBlocking(g_handler_plc[dev], addr, j['value']);
                            }
                        } else {
                            done = JsProxyAPI.plcWriteStringBlocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), j['value']);
                        }
                        if (done[0] == true) {
                            return JSON.stringify({ "errcode": 0, "errmsg": "" });
                        } else {
                            return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err " + done[1], "rtval": null });
                        }
                    } else if (type == "Bool") {
                        if (protocol == "modbus") {
                            let addr = plc_read_node(node, g_plc_data, "addr");
                            addr = addr.toLowerCase();
                            if (addr.startsWith("coil") || addr.startsWith("c")) {
                                addr = addr.replace("coil", "");
                                addr = addr.replace("c", "");
                                done = JsProxyAPI.plcWriteBoolBlocking(g_handler_plc[dev], addr, j['value']);
                            } else if (addr.startsWith("discrete") || addr.startsWith("d")) {
                                return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support discrete register writing", "rtval": null });
                            } else {
                                addr = addr;
                                done = JsProxyAPI.plcWriteBoolBlocking(g_handler_plc[dev], addr, j['value']);
                            }
                        } else {
                            done = JsProxyAPI.plcWriteBoolBlocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), j['value']);
                        }
                        if (done[0] == true) {
                            return JSON.stringify({ "errcode": 0, "errmsg": "" });
                        } else {
                            return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err " + done[1], "rtval": null });
                        }
                    } else if (type == "Byte") {
                        if (protocol == "modbus") {
                            let addr = plc_read_node(node, g_plc_data, "addr");
                            addr = addr.toLowerCase();
                            if (addr.startsWith("holding") || addr.startsWith("h")) {
                                addr = addr.replace("holding", "");
                                addr = addr.replace("h", "");
                                done = JsProxyAPI.plcWriteBlocking(g_handler_plc[dev], addr, j['value']);
                            } else if (addr.startsWith("input") || addr.startsWith("i")) {
                                return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support input register writing", "rtval": null });
                            } else {
                                addr = addr;
                                done = JsProxyAPI.plcWriteBlocking(g_handler_plc[dev], addr, j['value']);
                            }
                        } else {
                            done = JsProxyAPI.plcWriteBlocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), j['value']);
                        }
                        if (done[0] == true) {
                            return JSON.stringify({ "errcode": 0, "errmsg": "" });
                        } else {
                            return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err " + done[1], "rtval": null });
                        }
                    } else if (type == "Word") {
                        if (protocol == "modbus") {
                            let addr = plc_read_node(node, g_plc_data, "addr");
                            addr = addr.toLowerCase();
                            if (addr.startsWith("holding") || addr.startsWith("h")) {
                                addr = addr.replace("holding", "");
                                addr = addr.replace("h", "");
                                done = JsProxyAPI.plcWriteUInt16Blocking(g_handler_plc[dev], addr, j['value']);
                            } else if (addr.startsWith("input") || addr.startsWith("i")) {
                                return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support input register writing", "rtval": null });
                            } else {
                                addr = addr;
                                done = JsProxyAPI.plcWriteUInt16Blocking(g_handler_plc[dev], addr, j['value']);
                            }
                        } else {
                            done = JsProxyAPI.plcWriteUInt16Blocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), j['value']);
                        }
                        if (done[0] == true) {
                            return JSON.stringify({ "errcode": 0, "errmsg": "" });
                        } else {
                            return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err " + done[1], "rtval": null });
                        }
                    } else if (type == "DWord") {
                        if (protocol == "modbus") {
                            let addr = plc_read_node(node, g_plc_data, "addr");
                            addr = addr.toLowerCase();
                            if (addr.startsWith("holding") || addr.startsWith("h")) {
                                addr = addr.replace("holding", "");
                                addr = addr.replace("h", "");
                                done = JsProxyAPI.plcWriteUInt32Blocking(g_handler_plc[dev], addr, j['value']);
                            } else if (addr.startsWith("input") || addr.startsWith("i")) {
                                return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support input register writing", "rtval": null });
                            } else {
                                addr = addr;
                                done = JsProxyAPI.plcWriteUInt32Blocking(g_handler_plc[dev], addr, j['value']);
                            }
                        } else {
                            done = JsProxyAPI.plcWriteUInt32Blocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), j['value']);
                        }
                        if (done[0] == true) {
                            return JSON.stringify({ "errcode": 0, "errmsg": "" });
                        } else {
                            return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err " + done[1], "rtval": null });
                        }

                    } else if (type == "Float") {
                        if (protocol == "modbus") {
                            let addr = plc_read_node(node, g_plc_data, "addr");
                            addr = addr.toLowerCase();
                            if (addr.startsWith("holding") || addr.startsWith("h")) {
                                addr = addr.replace("holding", "");
                                addr = addr.replace("h", "");
                                done = JsProxyAPI.plcWriteFloatBlocking(g_handler_plc[dev], addr, j['value']);
                            } else if (addr.startsWith("input") || addr.startsWith("i")) {
                                return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support input register writing", "rtval": null });
                            } else {
                                addr = addr;
                                done = JsProxyAPI.plcWriteFloatBlocking(g_handler_plc[dev], addr, j['value']);
                            }
                        } else {
                            done = JsProxyAPI.plcWriteFloatBlocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), j['value']);
                        }
                        if (done[0] == true) {
                            return JSON.stringify({ "errcode": 0, "errmsg": "" });
                        } else {
                            return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err " + done[1], "rtval": null });
                        }
                    } else if (type == "Double") {
                        if (protocol == "modbus") {
                            let addr = plc_read_node(node, g_plc_data, "addr");
                            addr = addr.toLowerCase();
                            if (addr.startsWith("holding") || addr.startsWith("h")) {
                                addr = addr.replace("holding", "");
                                addr = addr.replace("h", "");
                                done = JsProxyAPI.plcWriteDoubleBlocking(g_handler_plc[dev], addr, j['value']);
                            } else if (addr.startsWith("input") || addr.startsWith("i")) {
                                return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support input register writing", "rtval": null });
                            } else {
                                addr = addr;
                                done = JsProxyAPI.plcWriteDoubleBlocking(g_handler_plc[dev], addr, j['value']);
                            }
                        } else {
                            done = JsProxyAPI.plcWriteDoubleBlocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), j['value']);
                        }
                        if (done[0] == true) {
                            return JSON.stringify({ "errcode": 0, "errmsg": "" });
                        } else {
                            return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err " + done[1], "rtval": null });
                        }
                    } else {
                        return JSON.stringify({ "errcode": 4007, "errmsg": "Key type is not in Byte / Word / DWord /Bool / String / Float / Double" });
                    }
                } catch (e) {
                    return JSON.stringify({ "errcode": 4056, "errmsg": "plc_write_node err:" + e, "rtval": null });
                }
                /*
                if(rt==false){
                    return JSON.stringify({"errcode":4057, "errmsg":"plc_write_node err", "rtval":null});
                }
                return JSON.stringify({"errcode":0, "errmsg":"", "rtval":rt});
                */
            }

            if (j['action'] == "plc_write_nodes") {
                // 判断有无值参数
                if (!j.hasOwnProperty("value")) {
                    return JSON.stringify({ "errcode": 4007, "errmsg": "Key value is not exist" });
                }
                // 判断有无节点参数
                if (!j.hasOwnProperty("node")) {
                    return JSON.stringify({ "errcode": 4007, "errmsg": "Key node is not exist" });
                }

                //判断节点和值参数是否是数组
                if (!Array.isArray(j['value'])) {
                    return JSON.stringify({ "errcode": 4009, "errmsg": "Key value is not array" });
                }

                if (!Array.isArray(j['node'])) {
                    return JSON.stringify({ "errcode": 4009, "errmsg": "Key node is not array" });
                }

                let nodes = j['node'];
                let i = 0;
                for (i in nodes) {
                    let node = nodes[i];
                    let type = plc_read_node(node, g_plc_data, "type");
                    let dev = plc_get_node_dev(node, g_plc_data);
                    let done = 0;

                    // 如果是模拟驱动模式，直接写入本buffer值
                    if (g_plc_data['DEVS'][dev]['PLC_DRIVER'] == "simulation") {
                        let rt = plc_read_node(node, g_plc_data, "addr");
                        if (rt == null) {
                            return JSON.stringify({ "errcode": 4057, "errmsg": "Node [" + node + "] is not exists", "rtval": rt });
                        }
                        let a = node.split(".");
                        g_plc_data['NODES'][dev][a[a.length - 1]]['value'] = j['value'][i];
                        return JSON.stringify({ "errcode": 0, "errmsg": "" });
                    }

                    if (type == null || dev == null) {
                        return JSON.stringify({ "errcode": 4059, "errmsg": "Node [" + node + "] is not exists", "rtval": null });
                    }

                    let protocol = "";
                    if (g_modules_conf[g_plc_data['DEVS'][dev]['PLC_DRIVER']]['TYPE'].startsWith("MODBUS")) {
                        protocol = "modbus";
                    }

                    try {
                        let done = false;
                        let rtval = null;
                        let v = j['value'][i];
                        if (type == "String") {
                            if (protocol == "modbus") {
                                let addr = plc_read_node(node, g_plc_data, "addr");
                                addr = addr.toLowerCase();
                                if (addr.startsWith("holding") || addr.startsWith("h")) {
                                    addr = addr.replace("holding", "");
                                    addr = addr.replace("h", "");
                                    done = JsProxyAPI.plcWriteStringBlocking(g_handler_plc[dev], addr, v);
                                } else if (addr.startsWith("input") || addr.startsWith("i")) {
                                    return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support input register writing", "rtval": null });
                                } else {
                                    addr = addr;
                                    done = JsProxyAPI.plcWriteStringBlocking(g_handler_plc[dev], addr, v);
                                }
                            } else {
                                done = JsProxyAPI.plcWriteStringBlocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), v);
                            }
                            if (done[0] == true) {
                                // return JSON.stringify({ "errcode": 0, "errmsg": "" });
                            } else {
                                return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err [" + node + "] [" + v + "]" + done[1], "rtval": null });
                            }
                        } else if (type == "Bool") {
                            if (protocol == "modbus") {
                                let addr = plc_read_node(node, g_plc_data, "addr");
                                addr = addr.toLowerCase();
                                if (addr.startsWith("coil") || addr.startsWith("c")) {
                                    addr = addr.replace("coil", "");
                                    addr = addr.replace("c", "");
                                    done = JsProxyAPI.plcWriteBoolBlocking(g_handler_plc[dev], addr, v);
                                } else if (addr.startsWith("discrete") || addr.startsWith("d")) {
                                    return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support discrete register writing", "rtval": null });
                                } else {
                                    addr = addr;
                                    done = JsProxyAPI.plcWriteBoolBlocking(g_handler_plc[dev], addr, v);
                                }
                            } else {
                                done = JsProxyAPI.plcWriteBoolBlocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), v);
                            }
                            if (done[0] == true) {
                                // return JSON.stringify({ "errcode": 0, "errmsg": "" });
                            } else {
                                return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err [" + node + "] [" + v + "]" + done[1], "rtval": null });
                            }
                        } else if (type == "Byte") {
                            if (protocol == "modbus") {
                                let addr = plc_read_node(node, g_plc_data, "addr");
                                addr = addr.toLowerCase();
                                if (addr.startsWith("holding") || addr.startsWith("h")) {
                                    addr = addr.replace("holding", "");
                                    addr = addr.replace("h", "");
                                    done = JsProxyAPI.plcWriteBlocking(g_handler_plc[dev], addr, v);
                                } else if (addr.startsWith("input") || addr.startsWith("i")) {
                                    return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support input register writing", "rtval": null });
                                } else {
                                    addr = addr;
                                    done = JsProxyAPI.plcWriteBlocking(g_handler_plc[dev], addr, v);
                                }
                            } else {
                                done = JsProxyAPI.plcWriteBlocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), v);
                            }
                            if (done[0] == true) {
                                // return JSON.stringify({ "errcode": 0, "errmsg": "" });
                            } else {
                                return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err [" + node + "] [" + v + "]" + done[1], "rtval": null });
                            }
                        } else if (type == "Word") {
                            if (protocol == "modbus") {
                                let addr = plc_read_node(node, g_plc_data, "addr");
                                addr = addr.toLowerCase();
                                if (addr.startsWith("holding") || addr.startsWith("h")) {
                                    addr = addr.replace("holding", "");
                                    addr = addr.replace("h", "");
                                    done = JsProxyAPI.plcWriteUInt16Blocking(g_handler_plc[dev], addr, v);
                                } else if (addr.startsWith("input") || addr.startsWith("i")) {
                                    return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support input register writing", "rtval": null });
                                } else {
                                    addr = addr;
                                    done = JsProxyAPI.plcWriteUInt16Blocking(g_handler_plc[dev], addr, v);
                                }
                            } else {
                                done = JsProxyAPI.plcWriteUInt16Blocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), v);
                            }
                            if (done[0] == true) {
                                // return JSON.stringify({ "errcode": 0, "errmsg": "" });
                            } else {
                                return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err [" + node + "] [" + v + "]" + done[1], "rtval": null });
                            }
                        } else if (type == "DWord") {
                            if (protocol == "modbus") {
                                let addr = plc_read_node(node, g_plc_data, "addr");
                                addr = addr.toLowerCase();
                                if (addr.startsWith("holding") || addr.startsWith("h")) {
                                    addr = addr.replace("holding", "");
                                    addr = addr.replace("h", "");
                                    done = JsProxyAPI.plcWriteUInt32Blocking(g_handler_plc[dev], addr, v);
                                } else if (addr.startsWith("input") || addr.startsWith("i")) {
                                    return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support input register writing", "rtval": null });
                                } else {
                                    addr = addr;
                                    done = JsProxyAPI.plcWriteUInt32Blocking(g_handler_plc[dev], addr, v);
                                }
                            } else {
                                done = JsProxyAPI.plcWriteUInt32Blocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), v);
                            }
                            if (done[0] == true) {
                                // return JSON.stringify({ "errcode": 0, "errmsg": "" });
                            } else {
                                return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err [" + node + "] [" + v + "]" + done[1], "rtval": null });
                            }
                        } else if (type == "Float") {
                            if (protocol == "modbus") {
                                let addr = plc_read_node(node, g_plc_data, "addr");
                                addr = addr.toLowerCase();
                                if (addr.startsWith("holding") || addr.startsWith("h")) {
                                    addr = addr.replace("holding", "");
                                    addr = addr.replace("h", "");
                                    done = JsProxyAPI.plcWriteFloatBlocking(g_handler_plc[dev], addr, v);
                                } else if (addr.startsWith("input") || addr.startsWith("i")) {
                                    return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support input register writing", "rtval": null });
                                } else {
                                    addr = addr;
                                    done = JsProxyAPI.plcWriteFloatBlocking(g_handler_plc[dev], addr, v);
                                }
                            } else {
                                done = JsProxyAPI.plcWriteFloatBlocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), v);
                            }
                            if (done[0] == true) {
                                // return JSON.stringify({ "errcode": 0, "errmsg": "" });
                            } else {
                                return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err [" + node + "] [" + v + "]" + done[1], "rtval": null });
                            }
                        } else if (type == "Double") {
                            if (protocol == "modbus") {
                                let addr = plc_read_node(node, g_plc_data, "addr");
                                addr = addr.toLowerCase();
                                if (addr.startsWith("holding") || addr.startsWith("h")) {
                                    addr = addr.replace("holding", "");
                                    addr = addr.replace("h", "");
                                    done = JsProxyAPI.plcWriteDoubleBlocking(g_handler_plc[dev], addr, v);
                                } else if (addr.startsWith("input") || addr.startsWith("i")) {
                                    return JSON.stringify({ "errcode": 4058, "errmsg": "modbus does not support input register writing", "rtval": null });
                                } else {
                                    addr = addr;
                                    done = JsProxyAPI.plcWriteDoubleBlocking(g_handler_plc[dev], addr, v);
                                }
                            } else {
                                done = JsProxyAPI.plcWriteDoubleBlocking(g_handler_plc[dev], plc_read_node(node, g_plc_data, "addr"), v);
                            }
                            if (done[0] == true) {
                                // return JSON.stringify({ "errcode": 0, "errmsg": "" });
                            } else {
                                return JSON.stringify({ "errcode": 4057, "errmsg": "plc_write_node err [" + node + "] [" + v + "]" + done[1], "rtval": null });
                            }
                        } else {
                            return JSON.stringify({ "errcode": 4007, "errmsg": "Key type is not in Byte / Word / DWord /Bool / String / Float / Double" });
                        }
                    } catch (e) {
                        return JSON.stringify({ "errcode": 4056, "errmsg": "plc_write_node err [" + node + "] " + e, "rtval": null });
                    }
                    i++;
                }

                return JSON.stringify({ "errcode": 0, "errmsg": "" });

            }

            return "AAAA";
        }
    );
}

// 初始化数据库
async function init_db() {
    let r = JsProxyAPI.dbConnect("Data Source=./database/sql.db;Pooling=true;FailIfMissing=false", "SQLITE", function (success, handler) {
        console.log(success, handler);
        g_handler_db = handler;
    });
}

// 执行sql语句，包括 insert into / delete / update
async function excute_non_query(handler, sql) {
    return new Promise((resolve, reject) => {
        let r = JsProxyAPI.dbExcuteNonQuery(handler, sql, function (success, dt) {
            console.log(success, dt);
            if (success) {
                resolve(dt);
            } else {
                reject(dt);
            }
        });
    });
}


// 执行sql语句，并返回结果，针对select语句
async function excute_query(handler, sql) {
    return new Promise((resolve, reject) => {
        let r = JsProxyAPI.dbExcuteQuery(handler, sql, function (success, dt) {
            console.log(success, dt);
            if (success) {
                resolve(dt);
            } else {
                reject(dt);
            }
        });
    });
}

// 关闭数据库
function close_db() {
    if (g_handler_db != null)
        if (g_handler_db != "")
            JsProxyAPI.dbClose(g_handler_db);
}

// 初始化PLC
async function init_plc_device(dev) {
    let d = g_plc_data['DEVS'][dev]
    if (Object.keys(d).length == 0)
        return;

    if (d['PLC_DRIVER'] == "")
        return;

    if (d['PLC_DRIVER'] == "simulation")
        return;

    return new Promise((resolve, reject) => {
        // 欧姆龙fins协议
        let dd = g_modules_conf[d['PLC_DRIVER']];
        let type = dd['TYPE'];
        let string_reverse = false;
        if (d['STRING_REVERSE'] === "true") {
            string_reverse = true;
        } else {
            string_reverse = false;
        }
        if (type == "TCP" || type == "MODBUSTCP") {
            let s = dd['FUNCTION'] + ',function(success,handler){console.log(success,handler);if(success){resolve(handler)}else{reject(handler)}},' + Number(d['RECV_TIMEOUT']) + ',"' + d['DATAFORMAT'] + '",' + Boolean(string_reverse) + ',true);';
            eval(s);
        }
        if (type == "UDP" || type == "MODBUSUDP") {
            let s = dd['FUNCTION'] + ',function(success,handler){console.log(success,handler);if(success){resolve(handler)}else{reject(handler)}},"' + d['DATAFORMAT'] + '",' + Boolean(string_reverse) + ');';
            eval(s);
        }
        if (type == "SERIAL" || type == "MODBUSSERIAL") {
            let s = dd['FUNCTION'] + ',function(success,handler){console.log(success,handler);if(success){resolve(handler)}else{reject(handler)}},"' + d['DATAFORMAT'] + '",' + Boolean(string_reverse) + ');';
            eval(s);
        }
    });
}

// 启动时候先将PLC点位清空
async function init_plc() {
    for (let dev in g_plc_data['DEVS']) {
        try {
            let rt = await init_plc_device(dev);
            g_handler_plc[dev] = rt;
        } catch (e) {
            alert("初始化PLC失败，请重试:" + dev + " -- " + e)
        }
    }

}

// 读取PLC信息 Byte
function plc_read_await(handler, addr, length) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcRead(handler, addr, length, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}

// 写入PLC信息 Byte
function plc_write_await(handler, addr, data) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcWrite(handler, addr, data, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}

// 读取PLC信息 WORD
function plc_read_uint16_await(handler, addr, length) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcReadUInt16(handler, addr, length, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}

// 写入PLC信息 WORD
function plc_write_uint16_await(handler, addr, data) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcWriteUInt16(handler, addr, data, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}

// 写入PLC信息 DWORD
function plc_write_uint32_await(handler, addr, data) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcWriteUInt32(handler, addr, data, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}

// 读取PLC信息 DWORD
function plc_read_uint32_await(handler, addr, length) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcReadUInt32(handler, addr, length, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}


// 读取PLC信息 String
function plc_read_string_await(handler, addr, length) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcReadString(handler, addr, length, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}

// 写入PLC信息 STRING
function plc_write_string_await(handler, addr, data) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcWriteString(handler, addr, data, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}

// 读取PLC信息 Bool
function plc_read_bool_await(handler, addr, length) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcReadBool(handler, addr, length, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}

// 写入PLC信息 Bool
function plc_write_bool_await(handler, addr, data) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcWriteBool(handler, addr, data, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}


// 读取PLC信息 Float
function plc_read_float_await(handler, addr, length) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcReadFloat(handler, addr, length, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}

// 写入PLC信息 Float
function plc_write_float_await(handler, addr, data) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcWriteFloat(handler, addr, data, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}

// 读取PLC信息 Double
function plc_read_double_await(handler, addr, length) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcReadDouble(handler, addr, length, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}

// 写入PLC信息 Double
function plc_write_double_await(handler, addr, data) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.plcWriteDouble(handler, addr, data, function (success, value) {
            if (success) {
                resolve(value);
            } else {
                reject(value);
            }
        });
    });
}



// 关闭所有plc连接
function plc_close_all() {
    for (dev in g_handler_plc) {
        plc_close(g_handler_plc[dev]);
        delete g_handler_plc[dev];
    }
}

// 关闭PLC连接
function plc_close(handler) {
    if (handler == "")
        return;
    try {
        JsProxyAPI.plcConnectClose(handler);
    } catch (e) {
        console.log(e);
    }
}

// Http 通讯
function http_request_await(url, data) {
    return new Promise((resolve, reject) => {
        JsProxyAPI.loggerWrite("http_request: [" + url + "] " + JSON.stringify(data).replace(/\\/g, "").replace(/\"/g, "\'"), "COMM", g_user_login);
        $.ajax({
            url: url,
            data: JSON.stringify(data),
            contentType: "application/x-www-form-urlencoded",
            type: 'POST',
            timeout: 2000,
            success: function (response) {
                JsProxyAPI.loggerWrite("http_request response: [" + url + "] " + JSON.stringify(response).replace(/\\/g, "").replace(/\"/g, "\'"), "COMM", g_user_login);
                resolve(response);
            },
            error: function (x, t, m) {
                JsProxyAPI.loggerWrite("http_request response Err: [" + url + "] " + JSON.stringify(data).replace(/\\/g, "").replace(/\"/g, "\'") + " ERR" + t, "COMM", g_user_login);
                if (t === "timeout") {
                    reject(t);
                } else {
                    reject(t);
                }
            }
        });
    });
}

// 同步Input Output数据（入口PLC）
async function sync_plc_nodes_await(dev) {
    // 查找全部节点
    // console.time("a");
    let key = null;
    // let dev = null;
    // for (dev in g_plc_data['NODES']) {
    // }
    if (dev == "")
        return;

    // 如果是模拟驱动的方式，不做点位同步，默认在线
    if (g_plc_data['DEVS'][dev]['PLC_DRIVER'] == "simulation") {
        g_plc_status[dev] = { "online": true, "errcode": 0, "errmsg": "" };
        // 如果values没有初始化，那给他初始化的值
        try {
            for (key in g_plc_data['NODES'][dev]) {
                if (!g_plc_data['NODES'][dev][key].hasOwnProperty("value")) {
                    if (g_plc_data['NODES'][dev][key]['type'] == "String") {
                        g_plc_data['NODES'][dev][key]['value'] = "";
                    } else if (g_plc_data['NODES'][dev][key]['type'] == "Bool") {
                        let c = parseInt(g_plc_data['NODES'][dev][key]['length']);
                        g_plc_data['NODES'][dev][key]['value'] = new Array(c).fill(false);
                    } else if (g_plc_data['NODES'][dev][key]['type'] == "Byte") {
                        let c = parseInt(g_plc_data['NODES'][dev][key]['length']);
                        g_plc_data['NODES'][dev][key]['value'] = new Array(c).fill(0);
                    } else if (g_plc_data['NODES'][dev][key]['type'] == "Word") {
                        let c = parseInt(g_plc_data['NODES'][dev][key]['length']);
                        g_plc_data['NODES'][dev][key]['value'] = new Array(c).fill(0);
                    } else if (g_plc_data['NODES'][dev][key]['type'] == "DWord") {
                        let c = parseInt(g_plc_data['NODES'][dev][key]['length']);
                        g_plc_data['NODES'][dev][key]['value'] = new Array(c).fill(0);
                    } else {
                        let c = parseInt(g_plc_data['NODES'][dev][key]['length']);
                        g_plc_data['NODES'][dev][key]['value'] = new Array(c).fill(0);
                    }
                }
            }
        } catch (e) {
            g_plc_status[dev]['online'] = false;
            g_plc_status[dev]['errmsg'] = e.toString();
            JsProxyAPI.loggerWrite("sync_plc_nodes simulation : [" + dev + "] " + "[" + key + "] " + e.toString().replace(/[\r\n]/g, "").replace(/\\/g, "\\\\"), "COMM", g_user_login);
        }
        return;
    }

    // 如果状态量没初始化的，初始化他
    if (g_plc_status[dev] == null) {
        g_plc_status[dev] = { "online": false, "errcode": 0, "errmsg": "" };

    }
    if (Object.keys(g_plc_data['NODES'][dev]).length == 0) {
        g_plc_status[dev]['online'] = false;
        return;
    }
    let addr_src = "";
    let addr = "";
    try {
        for (key in g_plc_data['NODES'][dev]) {
            let rt = null;
            let protocol = "";
            if (g_modules_conf[g_plc_data['DEVS'][dev]['PLC_DRIVER']]['TYPE'].startsWith("MODBUS")) {
                protocol = "modbus";
            }
            addr_src = g_plc_data['NODES'][dev][key]['addr'];
            if (g_plc_data['NODES'][dev][key]['type'] == "String") {
                if (protocol == "modbus") {
                    // modbus类型的PLC读取String
                    // modbus Word 类型的地址结构有三种 holdingN inputN N
                    // 如 001 holding001 input001 分别代表 保持寄存器001 保持寄存器001 和输入寄存器001
                    // 默认使用保持寄存器
                    addr = addr_src.toLowerCase();
                    if (addr.startsWith("holding") || addr.startsWith("h")) {
                        addr = addr.replace("holding", "");
                        addr = addr.replace("h", "");
                        rt = await plc_read_string_await(g_handler_plc[dev], "x=3;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    } else if (addr.startsWith("input") || addr.startsWith("i")) {
                        addr = addr.replace("input", "");
                        addr = addr.replace("i", "");
                        rt = await plc_read_string_await(g_handler_plc[dev], "x=4;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    } else {
                        addr = addr;
                        rt = await plc_read_string_await(g_handler_plc[dev], "x=3;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    }
                } else {
                    // 其他类型的PLC读取String
                    rt = await plc_read_string_await(g_handler_plc[dev], g_plc_data['NODES'][dev][key]['addr'], parseInt(g_plc_data['NODES'][dev][key]['length']));
                }
            } else if (g_plc_data['NODES'][dev][key]['type'] == "Bool") {
                if (protocol == "modbus") {
                    // modbus类型的PLC读取Bool
                    // modbus Bool 类型的地址结构有三种 coilN discreteN N
                    // 如 001 coil001 discrete001 分别代表 线圈的001 线圈001 和离散寄存器001
                    // 默认使用线圈
                    addr = addr_src.toLowerCase();
                    if (addr.startsWith("coil") || addr.startsWith("c")) {
                        addr = addr.replace("coil", "");
                        addr = addr.replace("c", "");
                        rt = await plc_read_bool_await(g_handler_plc[dev], "x=1;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    } else if (addr.startsWith("discrete") || addr.startsWith("d")) {
                        addr = addr.replace("discrete", "");
                        addr = addr.replace("d", "");
                        rt = await plc_read_bool_await(g_handler_plc[dev], "x=2;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    } else {
                        addr = addr;
                        rt = await plc_read_bool_await(g_handler_plc[dev], "x=1;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    }
                } else {
                    // 其他类型的PLC读取Bool
                    rt = await plc_read_bool_await(g_handler_plc[dev], g_plc_data['NODES'][dev][key]['addr'], parseInt(g_plc_data['NODES'][dev][key]['length']));
                }


            } else if (g_plc_data['NODES'][dev][key]['type'] == "Byte") {
                if (protocol == "modbus") {
                    // modbus类型的PLC读取Byte
                    // modbus Byte 类型的地址结构有三种 holdingN inputN N
                    // 如 001 holding001 input001 分别代表 保持寄存器001 保持寄存器001 和输入寄存器001
                    // 默认使用保持寄存器
                    addr = addr_src.toLowerCase();
                    if (addr.startsWith("holding") || addr.startsWith("h")) {
                        addr = addr.replace("holding", "");
                        addr = addr.replace("h", "");
                        rt = await plc_read_await(g_handler_plc[dev], "x=3;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']) );
                    } else if (addr.startsWith("input") || addr.startsWith("i")) {
                        addr = addr.replace("input", "");
                        addr = addr.replace("i", "");
                        rt = await plc_read_await(g_handler_plc[dev], "x=4;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']) );
                    } else {
                        addr = addr;
                        rt = await plc_read_await(g_handler_plc[dev], "x=3;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']) );
                    }
                } else {
                    // 其他类型的PLC读取Byte
                    rt = await plc_read_await(g_handler_plc[dev], g_plc_data['NODES'][dev][key]['addr'], parseInt(g_plc_data['NODES'][dev][key]['length']) );
                }

            } else if (g_plc_data['NODES'][dev][key]['type'] == "Word") {
                if (protocol == "modbus") {
                    // modbus类型的PLC读取Word
                    // modbus Word 类型的地址结构有三种 holdingN inputN N
                    // 如 001 holding001 input001 分别代表 保持寄存器001 保持寄存器001 和输入寄存器001
                    // 默认使用保持寄存器
                    addr = addr_src.toLowerCase();
                    if (addr.startsWith("holding") || addr.startsWith("h")) {
                        addr = addr.replace("holding", "");
                        addr = addr.replace("h", "");
                        rt = await plc_read_uint16_await(g_handler_plc[dev], "x=3;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    } else if (addr.startsWith("input") || addr.startsWith("i")) {
                        addr = addr.replace("input", "");
                        addr = addr.replace("i", "");
                        rt = await plc_read_uint16_await(g_handler_plc[dev], "x=4;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    } else {
                        addr = addr;
                        rt = await plc_read_uint16_await(g_handler_plc[dev], "x=3;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    }
                } else {
                    // 其他类型的PLC读取Word
                    rt = await plc_read_uint16_await(g_handler_plc[dev], g_plc_data['NODES'][dev][key]['addr'], parseInt(g_plc_data['NODES'][dev][key]['length']));
                }

            } else if (g_plc_data['NODES'][dev][key]['type'] == "DWord") {
                if (protocol == "modbus") {
                    // modbus类型的PLC读取DWord
                    // modbus DWord 类型的地址结构有三种 holdingN inputN N
                    // 如 001 holding001 input001 分别代表 保持寄存器001 保持寄存器001 和输入寄存器001
                    // 默认使用保持寄存器
                    addr = addr_src.toLowerCase();
                    if (addr.startsWith("holding") || addr.startsWith("h")) {
                        addr = addr.replace("holding", "");
                        addr = addr.replace("h", "");
                        rt = await plc_read_uint32_await(g_handler_plc[dev], "x=3;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    } else if (addr.startsWith("input") || addr.startsWith("i")) {
                        addr = addr.replace("input", "");
                        addr = addr.replace("i", "");
                        rt = await plc_read_uint32_await(g_handler_plc[dev], "x=4;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    } else {
                        addr = addr;
                        rt = await plc_read_uint32_await(g_handler_plc[dev], "x=3;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    }
                } else {
                    // 其他类型的PLC读取DWord
                    rt = await plc_read_uint32_await(g_handler_plc[dev], g_plc_data['NODES'][dev][key]['addr'], parseInt(g_plc_data['NODES'][dev][key]['length']));
                }

            } else if (g_plc_data['NODES'][dev][key]['type'] == "Float") {
                if (protocol == "modbus") {
                    // modbus类型的PLC读取Float
                    // modbus Word 类型的地址结构有三种 holdingN inputN N
                    // 如 001 holding001 input001 分别代表 保持寄存器001 保持寄存器001 和输入寄存器001
                    // 默认使用保持寄存器
                    addr = addr_src.toLowerCase();
                    if (addr.startsWith("holding") || addr.startsWith("h")) {
                        addr = addr.replace("holding", "");
                        addr = addr.replace("h", "");
                        rt = await plc_read_float_await(g_handler_plc[dev], "x=3;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    } else if (addr.startsWith("input") || addr.startsWith("i")) {
                        addr = addr.replace("input", "");
                        addr = addr.replace("i", "");
                        rt = await plc_read_float_await(g_handler_plc[dev], "x=4;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    } else {
                        addr = addr;
                        rt = await plc_read_float_await(g_handler_plc[dev], "x=3;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    }
                } else {
                    // 其他类型的PLC读取Float
                    rt = await plc_read_float_await(g_handler_plc[dev], g_plc_data['NODES'][dev][key]['addr'], parseInt(g_plc_data['NODES'][dev][key]['length']));
                }
            } else if (g_plc_data['NODES'][dev][key]['type'] == "Double") {
                if (protocol == "modbus") {
                    // modbus类型的PLC读取Double
                    // modbus Word 类型的地址结构有三种 holdingN inputN N
                    // 如 001 holding001 input001 分别代表 保持寄存器001 保持寄存器001 和输入寄存器001
                    // 默认使用保持寄存器
                    addr = addr_src.toLowerCase();
                    if (addr.startsWith("holding") || addr.startsWith("h")) {
                        addr = addr.replace("holding", "");
                        addr = addr.replace("h", "");
                        rt = await plc_read_double_await(g_handler_plc[dev], "x=3;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    } else if (addr.startsWith("input") || addr.startsWith("i")) {
                        addr = addr.replace("input", "");
                        addr = addr.replace("i", "");
                        rt = await plc_read_double_await(g_handler_plc[dev], "x=4;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    } else {
                        addr = addr;
                        rt = await plc_read_double_await(g_handler_plc[dev], "x=3;" + addr, parseInt(g_plc_data['NODES'][dev][key]['length']));
                    }
                } else {
                    // 其他类型的PLC读取Double
                    rt = await plc_read_double_await(g_handler_plc[dev], g_plc_data['NODES'][dev][key]['addr'], parseInt(g_plc_data['NODES'][dev][key]['length']));
                }
            }
            g_plc_data['NODES'][dev][key]['value'] = rt;
        }

        g_plc_status[dev]['online'] = true;
    } catch (e) {
        g_plc_status[dev]['online'] = false;
        g_plc_status[dev]['errmsg'] = e.toString();
        JsProxyAPI.loggerWrite("sync_plc_nodes: [" + dev + "] " + "[" + addr_src + "] " + e.toString().replace(/[\r\n]/g, "").replace(/\\/g, "\\\\"), "COMM", g_user_login);
    }

}

// =======================================================================
// =======================================================================
// =====================  主要逻辑函数 ====================================
// =======================================================================
// =======================================================================

// PLC同步线程逻辑
// 同步入口PLC数据
// 异常状态给到 g_plc_status
// 1 读取所有点位，包括PLC的IN和OUT的状态量

/*
async function process_loop_plc_data_sync() {
    while (1) {
        await sleep(100);
        // 读取所有的opcua点位状态
        await sync_plc_nodes_await();
    }
}
*/

async function process_loop_plc_data_sync(dev, guid) {
    while (1) {
        await sleep(100);
        // 读取所有的opcua点位状态
        if (g_sync_worker_lock[guid]['running'] == false) break;
        await sync_plc_nodes_await(dev);
    }
}

function load_sync_workers() {
    let dev;
    let guid = "";
    g_sync_worker_lock = {};
    for (dev in g_plc_data['DEVS']) {
        guid = get_guid();
        g_sync_worker_lock[guid] = {};
        g_sync_worker_lock[guid]['dev'] = dev;
        g_sync_worker_lock[guid]['running'] = true;
        process_loop_plc_data_sync(dev, guid);
    }
}

function unload_sync_workers() {
    let guid
    for (guid in g_sync_worker_lock) {
        g_sync_worker_lock[guid]['running'] = false;
    }
}

// 加载模块配置
if (!load_modules_conf()) {
    alert("模块配置文件异常，无法启动程序!");
} else {
    // 读取settings配置
    load_settings_conf();
    // 启动系统
    load_plc_conf();
    // 初始化PLC连接
    init_plc();
    // 初始化数据库
    init_db();

    //初始化WebApi服务器
    init_webapi_server()

    if (g_settings_conf != null) {
        let s = g_settings_conf['DISPLAY_SCREEN'];
        if (s == 0 || s == 1) {
            JsProxyAPI.setDesktopBounds(s);
        }
    }
    // JsProxyAPI.setDesktopBounds(0);
    // process_loop_plc_data_sync();
    load_sync_workers();
    // let pp = {};
    // pp['AAA'] = "KKKKK";
    // let f = Function('JsProxyAPI.showMessage(pp["AAA"]);')
    // eval('JsProxyAPI.showMessage(pp["AAA"]);');
    //f();
}

//# sourceURL=main.js