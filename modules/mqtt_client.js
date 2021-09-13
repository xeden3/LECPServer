
var mqtt_dev_apg_select = "";
var apg_mqtt_client = null;
var apg_mqtt_last_val_of_length = "";

function init_apg_mqtt_client() {
    apg_mqtt_client = new AppendGrid({
        element: "dt_mqtt_client_item_list",
        uiFramework: "default",
        // bootstrap4
        iconFramework: "fontawesome5",
        columns: [
            {
                name: "name",
                display: i18next.t('page_mqtt_client.name'),
                type: "text",
                cellClass: "form-control-input-mid form-control-input-readonly"
            },
            {
                name: "state",
                display: i18next.t('page_mqtt_client.state'),
                type: "checkbox",
                cellClass: "form-control-input-sm"
            },
            {
                name: "type",
                display: i18next.t('page_mqtt_client.type'),
                type: "text",
                cellClass: "form-control-input-sm form-control-input-readonly"
            },
            {
                name: "last_value",
                display: i18next.t('page_mqtt_client.last_value'),
                type: "text",
                cellClass: "form-control-input-sm form-control-input-readonly"
            },
            {
                name: "send_every_scan",
                display: i18next.t('page_mqtt_client.send_every_scan'),
                type: "checkbox",
                cellClass: "form-control-input-mid"
            },
            {
                name: "deadband",
                display: i18next.t('page_mqtt_client.deadband'),
                type: "number",
                ctrlAttr: {
                    min: 0,
                    max: 99
                },
                cellClass: "form-control-input-mid"
            }
        ],
        // Optional CSS classes, to make table slimmer!
        sectionClasses: {
            table: "table-sm",
            control: "form-control-sm",
            buttonGroup: "btn-group-sm",
            button: "btn-sm",
        },
        // 按键中文化
        i18n: {
            append: i18next.t('page_mqtt_client.append'),
            removeLast: i18next.t('page_mqtt_client.removeLast'),
            insert: i18next.t('page_mqtt_client.insert'),
            remove: i18next.t('page_mqtt_client.remove'),
            moveUp: i18next.t('page_mqtt_client.moveUp'),
            moveDown: i18next.t('page_mqtt_client.moveDown'),
            rowEmpty: i18next.t('page_mqtt_client.rowEmpty')
        },
        hideButtons: {
            // Hide the move up and move down button on each row
            append: true,
            removeLast: true
        },
        sizing: "small",
        // initData: [
        //  { station: "", time: "", current: "", voltage: "", stop_: "", memberSince: "", uid: "" }
        // ]
    });
}

init_apg_mqtt_client();


function apg_mqtt_data_clear() {
    let c = apg_mqtt_client.getRowCount();
    for (let i = 0; i < c; i++) {
        apg_mqtt_client.removeRow(0);
    }
}

function apg_mqtt_data_refresh(dev) {
    let data = g_mqtt_client_data['NODES'][dev];
    let key = null;
    if (data == null) {
        return;
    }
    if (data.length == 0) {
        return;
    }
    // 显示当前设备的 node 配置
    apg_mqtt_client.load(data);
}

// 选择设备，并且显示设备的配置和点位配置
$("[name='page_mqtt_client_device_list']").on("click", "a", function () {
    // 清除过滤的内容
    $("[name='txt_mqtt_client_page_filter']").val("");
    // 将所有的a标签去掉active
    $("[name='page_mqtt_client_device_list'] a").removeClass("active");
    // 选择当前的设备
    $(this).addClass("active");
    // console.log(this);
    // 刷新当前设备数据到apg_mqtt_client内

    apg_mqtt_data_clear();

    // $("[name='page_mqtt_client_device_settings']").html("");

    let dev = $(this).attr("data-tags");

    mqtt_dev_apg_select = dev;

    // 显示当前设备的 dev 配置
    addnew_mqtt_client_page_input_settings(g_mqtt_client_data['DEVS'][dev]);

    apg_mqtt_data_refresh(dev);

});

// 保存当前修改
$("[name='btn_mqtt_client_page_apply']").on("click", async function () {
    // 获取 mqtt_client_page_input_settings 所有值，保存到 dev 里面
    // 
    // 清空之前的配置
    if (typeof (mqtt_dev_apg_select) == "undefined")
        return;

    g_mqtt_client_data['DEVS'][mqtt_dev_apg_select] = {};
    $("[name='mqtt_client_page_input_settings']").each(function () {
        let key = $(this).attr('data-tags');
        let val = $(this).val();
        g_mqtt_client_data['DEVS'][mqtt_dev_apg_select][key] = val;
    });

    // 获取所有节点内容，然后保存到 nodes 里面
    let obj = {};
    let data = apg_mqtt_client.getAllValue();

    g_mqtt_client_data['NODES'][mqtt_dev_apg_select] = data;

    JsProxyAPI.fileWrite("mqtt.conf", JSON.stringify(g_mqtt_client_data, null, "\t"));

    toastr.success('', '设备 [' + mqtt_dev_apg_select + '] 设定值保存成功!');

    // toastr.success('', '设备 [' + mqtt_dev_apg_select + '] 初始化成功!');

    // 重新加载nodes页面
    apg_mqtt_data_clear();
    apg_mqtt_data_refresh(mqtt_dev_apg_select);

});

// 添加新设备按键
$("[name='btn_mqtt_client_page_new_device']").on("click", function () {
    // 添加新设备
    swal({
        title: i18next.t('alert.new_device'),
        text: i18next.t('alert.enter_device_name'),
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: i18next.t('alert.yes_add_it'),
        cancelButtonText: i18next.t('alert.cancel'),
        inputPlaceholder: ""
    }, function (inputValue) {
        if (inputValue === false) return false;
        if (inputValue === "") {
            swal.showInputError(i18next.t('alert.You_need_to_write_something'));
            return false;
        }
        // 判定是否存在这个设备
        for (dev in g_mqtt_client_data['DEVS']) {
            if (dev == inputValue) {
                swal({
                    title: i18next.t('alert.the_device_already_exists'),
                    text: ' ',
                    type: "error"
                });
                return false;
            }
        }
        // 添加新设备
        g_mqtt_client_data['NODES'][inputValue] = [];
        g_mqtt_client_data['DEVS'][inputValue] = {};
        g_mqtt_client_data['DEVS'][inputValue]['MQTT_DRIVER'] = "";
        JsProxyAPI.fileWrite("mqtt.conf", JSON.stringify(g_mqtt_client_data, null, "\t"));
        init_mqtt_device_list();
        swal({
            title: i18next.t('alert.new_device') + ' [' + inputValue + '] ' + i18next.t('alert.added_successfully') + " !",
            text: ' ',
            type: "success"
        });
    });
});


function addnew_mqtt_client_page_input_settings(objs) {
    if (typeof (objs) == "undefined") return;

    let html = "";
    let client_id = "";
    let ip = "";
    let port = "";
    let username = "";
    let password = "";
    let topic = "";
    let scan_rate = "";
    let last_scan = 0;

    $("[name='mqtt_client_page_input_settings']").each(function () {
        if ($(this).attr('data-tags') != "MQTT_DRIVER") {
            $(this).val("");
        }
    });

    client_id = objs['ClIENT_ID'];
    ip = objs['IP'];
    port = objs['PORT'];
    username = objs['USERNAME'];
    password = objs['PASSWORD'];
    topic = objs['TOPIC'];
    scan_rate = objs['SCAN_RATE'];
    last_scan = 0;
    if (typeof (scan_rate) == "undefined") scan_rate = 2000;
    if (typeof (ip) == "undefined") ip = "127.0.0.1";
    if (typeof (port) == "undefined") port = "1883";
    // $("[name='page_mqtt_client_device_settings']").html(html);

    $("[name='mqtt_client_page_input_settings']").each(function () {
        if ($(this).attr('data-tags') == "ClIENT_ID") {
            $(this).val(client_id);
        }
        if ($(this).attr('data-tags') == "IP") {
            $(this).val(ip);
        }
        if ($(this).attr('data-tags') == "PORT") {
            $(this).val(port);
        }
        if ($(this).attr('data-tags') == "USERNAME") {
            $(this).val(username);
        }
        if ($(this).attr('data-tags') == "PASSWORD") {
            $(this).val(password);
        }
        if ($(this).attr('data-tags') == "TOPIC") {
            $(this).val(topic);
        }
        if ($(this).attr('data-tags') == "SCAN_RATE") {
            $(this).val(scan_rate);
        }
        if ($(this).attr('data-tags') == "LAST_SCAN") {
            $(this).val(last_scan);
        }
    });
}

$("[name='page_mqtt_client_device_settings']").on("change", "[name='mqtt_client_page_input_settings']", function () {
    // 修改设备型号, * 不存在设备型号的变化
    if ($(this).attr("data-tags") != "MQTT_DRIVER")
        return;
});

$("[name='btn_mqtt_client_page_delete_device']").on("click", function () {
    //删除设备
    swal({
        title: i18next.t('alert.yes_delete_it'),
        text: i18next.t('alert.delete_device') + " [" + mqtt_dev_apg_select + "] ," + i18next.t('alert.operation_will_not_be_recoverable'),
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: i18next.t('alert.yes_delete_it'),
        cancelButtonText: i18next.t('alert.cancel'),
        closeOnConfirm: false
    }, function () {
        // 删除设备
        delete g_mqtt_client_data['NODES'][mqtt_dev_apg_select];
        delete g_mqtt_client_data['DEVS'][mqtt_dev_apg_select];

        let last_device_select = mqtt_dev_apg_select;

        JsProxyAPI.fileWrite("mqtt.conf", JSON.stringify(g_mqtt_client_data, null, "\t"));

        init_mqtt_device_list();
        mqtt_client_close_all();
        // 重新加载所有设备
        // plc_close_all();
        // init_plc();
        // unload_sync_workers();
        //  load_sync_workers();
        swal({
            title: i18next.t('alert.device') + ' [' + last_device_select + '] ' + i18next.t('alert.delete_successfully') + " !",
            text: ' ',
            type: "success"
        });
    });
});


// 重启服务的按键
$("[name='btn_mqtt_client_page_restart_server']").on("click", function () {
    // 是否确认重启服务
    swal({
        title: i18next.t('alert.sure_to_restart'),
        text: i18next.t('alert.the_server_will_stop_after_you_restart'),
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: i18next.t('alert.yes_restart_it'),
        cancelButtonText: i18next.t('alert.cancel'),
        closeOnConfirm: false
    }, function () {

        init_mqtt_device_list();
        // 重新加载所有设备
        // plc_close_all();
        mqtt_client_close_all();
        // init_plc();
        // init_mqtt_client();
        // unload_sync_workers();
        // load_sync_workers();
        swal({
            title: i18next.t('alert.restart_successfully') + " !",
            text: ' ',
            type: "success"
        });
    });
});

$("[name='txt_mqtt_client_page_filter']").on("keyup", function () {
    let filter = $("[name='txt_mqtt_client_page_filter']").val();
    // 显示全部
    $('tr[id^="dt_mqtt_client_item_list_$row_"]').show();
    if (filter == "") return;

    for (let r = 0; r < apg_mqtt_client.getRowCount(); r++) {
        let name = apg_mqtt_client.getCtrlValue("name", r);
        if (name.indexOf(filter) == -1) {
            // 如果key不匹配，则不显示当前行
            let unique = apg_mqtt_client.getUniqueIndex(r);
            try {
                $('tr[data-unique-index=' + unique + ']').hide();
            } catch (e) { }
        }
    }
});


//初始化所有设备
function init_mqtt_device_list() {
    $("[name='page_mqtt_client_device_list']").html("");
    let html = "";
    for (let key in g_mqtt_client_data['DEVS']) {
        let dev = g_mqtt_client_data['DEVS'][key];
        html += "<li><a href=\"javascript:;\" data-tags=\"" + key + "\">" + key + "</a><span data-dev=\"mqtt\" data-tags=\"" + key + "\" class=\"span-offline\"></span></li>";
    }
    $("[name='page_mqtt_client_device_list']").html(html);

    // 初始化后，如果有设备，默认打开第一个
    let a = $("[name='page_mqtt_client_device_list'] a").first();
    // 将所有的a标签去掉active
    $("[name='page_mqtt_client_device_list'] a").removeClass("active");
    // 选择当前的设备
    a.addClass("active");
    // console.log(this);
    // 刷新当前设备数据到apg_mqtt_client内

    apg_mqtt_data_clear();

    // $("[name='page_mqtt_client_device_settings']").html("");

    let dev = a.attr("data-tags");

    mqtt_dev_apg_select = dev;

    // 显示当前设备的 dev 配置
    addnew_mqtt_client_page_input_settings(g_mqtt_client_data['DEVS'][dev]);

    apg_mqtt_data_refresh(dev);
}

init_mqtt_device_list();


$("[name='btn_mqtt_client_page_addnew']").on("click", function () {
    // 刷新所有设备列表到 sel_page_mqtt_device_select
    $("[name='sel_page_mqtt_device_select']").empty();
    $("[name='sel_page_mqtt_nodes_select']").empty();
    let c = 0;
    for (let dev in g_plc_data['DEVS']) {
        $("[name='sel_page_mqtt_device_select']").append("<option value='" + dev + "'>" + dev + "</option>");
        c++
    }
    $("[name='sel_page_mqtt_device_select']").attr("size", c);
    $("#dlg_page_mqtt_addnew").modal("show");
});



$("[name='sel_page_mqtt_device_select']").on("click", function () {
    let opt = $("[name='sel_page_mqtt_device_select']").val();
    $("[name='sel_page_mqtt_nodes_select']").empty();
    for (let node in g_plc_data['NODES'][opt]) {
        $("[name='sel_page_mqtt_nodes_select']").append("<option value='" + node + "'>" + node + "</option>");
    }
    // let v = opt[opt.length-1];
    // $("[name='sel_page_mqtt_device_select']").val(v);
});

$("[name='btn_page_mqtt_apply']").on("click", function () {
    // 添加节点到mqtt客户端作为发布使用
    let dev = $("[name='sel_page_mqtt_device_select']").val();
    let nodes = $("[name='sel_page_mqtt_nodes_select']").val();
    let data = apg_mqtt_client.getAllValue();
    console.log(dev, nodes);
    for (let i in nodes) {
        let node = nodes[i];
        data.push({ name: dev + "." + node, state: true, type: g_plc_data['NODES'][dev][node]['type'], last_value: "", send_every_scan: true, deadband: 0 });
    }
    apg_mqtt_client.load(data);
    console.log(mqtt_dev_apg_select);
    g_mqtt_client_data['NODES'][mqtt_dev_apg_select] = data;
    JsProxyAPI.fileWrite("mqtt.conf", JSON.stringify(g_mqtt_client_data, null, "\t"));
});


// 初始化MQTT客户端
async function init_mqtt_client_device(dev) {
    let d = g_mqtt_client_data['DEVS'][dev]
    if (Object.keys(d).length == 0)
        return;
    if (d['MQTT_DRIVER'] == "")
        return;
    return new Promise((resolve, reject) => {
        // 对 MQTT Server 进行连接
        JsProxyAPI.mqttClientOpen(d['ClIENT_ID'], d['IP'], parseInt(d['PORT']),
            function (success, handler) {
                console.log(success, handler);
                if (success == true) {
                    $("span[data-dev='mqtt'][data-tags='" + dev + "']").attr("class", "span-online");
                    g_handler_mqtt_client[dev] = handler;
                    // 订阅当前topic
                    JsProxyAPI.mqttSubscribeMessage(handler, d['TOPIC']);
                    resolve(handler)
                } else {
                    $("span[data-dev='mqtt'][data-tags='" + dev + "']").attr("class", "span-offline");
                    reject(handler)
                }
            },
            async function (topic, payload) {
                // Client获取订阅事件
                console.log(topic, payload);
                // 如果value有变化，则更新本机value
                try {
                    payload = JSON.parse(payload);
                    for (let key in payload) {
                        for (let i in g_mqtt_client_data['NODES'][dev]) {
                            let name = g_mqtt_client_data['NODES'][dev][i]['name'];
                            if (key == name) {
                                if (g_mqtt_client_data['NODES'][dev][i]['last_value'].length == payload[key].length) {
                                    if (!equar(g_mqtt_client_data['NODES'][dev][i]['last_value'], payload[key])) {
                                        console.log("payload value update");
                                        let rt = await http_request_await("http://localhost:" + g_plc_data['WEBAPI']['PORT'], { "action": "plc_write_node", "node": "NODES." + key, "value": payload[key] });
                                        rt = JSON.parse(rt);
                                        if (rt['errcode'] != 0) {
                                            // alert(rt['errmsg']);
                                            console.log("payload value update ERR " + rt['errmsg']);
                                        }
                                    }
                                }
                            }
                        }
                    };
                } catch (e) {
                    console.log(e);
                }

            },
            async function () {
                // 网络异常事件
                console.log("Network Error");
                $("span[data-dev='mqtt'][data-tags='" + dev + "']").attr("class", "span-offline");
                while (1 && g_handler_mqtt_client[dev]) {
                    await sleep(5000);
                    let r = JsProxyAPI.mqttReconnect(g_handler_mqtt_client[dev]);
                    if (r == true) {
                        JsProxyAPI.mqttSubscribeMessage(g_handler_mqtt_client[dev], d['TOPIC']);
                        $("span[data-dev='mqtt'][data-tags='" + dev + "']").attr("class", "span-online");
                        break;
                    }
                }
                console.log("Network Error Break");
            });
    });
}

// 关闭MQTT客户端
function mqtt_client_close_all() {
    for (dev in g_handler_mqtt_client) {
        mqttClose(g_handler_mqtt_client[dev]);
        delete g_handler_mqtt_client[dev];
    }
}


function mqttClose(handler) {
    if (handler == "")
        return;
    try {
        JsProxyAPI.mqttClose(handler);
    } catch (e) {
        console.log(e);
    }
}


// 循环发布线程
async function process_loop_mqtt_client_publish() {
    let c = 0;
    while (1) {
        await sleep(50);
        for (let dev in g_mqtt_client_data['DEVS']) {
            try {
                let timestamp = Date.now();
                if ((timestamp - parseInt(g_mqtt_client_data['DEVS'][dev]['LAST_SCAN'])) <= parseInt(g_mqtt_client_data['DEVS'][dev]['SCAN_RATE'])) {
                    continue;
                }
                g_mqtt_client_data['DEVS'][dev]['LAST_SCAN'] = timestamp;
                if (typeof (g_handler_mqtt_client[dev]) == "undefined") break;

                // 刷新当前时间戳
                $("[data-tags='LAST_SCAN']").val(timestamp);

                let handler = g_handler_mqtt_client[dev];
                let topic = g_mqtt_client_data['DEVS'][dev]['TOPIC'];
                let nodes = g_mqtt_client_data['NODES'][dev];
                let o = {};
                for (let i in nodes) {
                    let plc_dev = nodes[i]['name'].split('.')[0];
                    let plc_addr = nodes[i]['name'].replace(plc_dev + ".", "");
                    let v = g_plc_data['NODES'][plc_dev][plc_addr]['value'];
                    nodes[i]['last_value'] = v;
                    o[nodes[i]['name']] = nodes[i]['last_value'];
                }
                JsProxyAPI.mqttPublishMessage(handler, topic, JSON.stringify(o));
            } catch (e) {
                console.log(e);
                JsProxyAPI.loggerWrite("process_loop_mqtt_client_publish: [" + e.toString().replace(/[\r\n]/g, "").replace(/\\/g, "\\\\") + "] ", "COMM", g_user_login);
            }
        }
        c++;
        if (c > 100) {
            c = 0;
            apg_mqtt_data_refresh(mqtt_dev_apg_select);
        }

    }
}

// 客户端创建和连接服务器线程
async function process_loop_mqtt_client_create_and_connect() {
    while (1) {
        await sleep(500);
        for (let dev in g_mqtt_client_data['DEVS']) {
            try {
                // 如果没有 handler ，则创建客户端，并进行连接
                if (typeof (g_handler_mqtt_client[dev]) != "undefined") break;

                let rt = await init_mqtt_client_device(dev);
                g_handler_mqtt_client[dev] = rt;

            } catch (e) {
                // alert("初始化MQTT失败，请重试:" + dev + " -- " + e)
                console.log("初始化MQTT失败，请重试:" + dev + " -- " + e);
                JsProxyAPI.loggerWrite("初始化MQTT失败，请重试: [" + dev + "][" + e.toString().replace(/[\r\n]/g, "").replace(/\\/g, "\\\\") + "] ", "COMM", g_user_login);
                await sleep(30000);
            }
        }
    }
}



process_loop_mqtt_client_publish();
process_loop_mqtt_client_create_and_connect();

//# sourceURL=mqtt_client.js