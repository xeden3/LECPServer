
var plc_dev_apg_select = "";
var apg_dashboard = null;
var apg_last_val_of_length = "";

function init_apg_dashboard() {
    apg_dashboard = new AppendGrid({
        element: "dt_process_start_page_start_page",
        uiFramework: "default",
        // bootstrap4
        iconFramework: "fontawesome5",
        columns: [
            {
                name: "name",
                display: i18next.t('page_dashboard.name'),
                type: "text",
                cellClass: "form-control-input-mid"
            },
            {
                name: "addr",
                display: i18next.t('page_dashboard.addr'),
                type: "text",
                cellClass: "form-control-input-sm"
            },
            {
                name: "type",
                display: i18next.t('page_dashboard.type'),
                type: "select",
                ctrlOptions: {
                    "": "",
                    "Bool": "Bool",
                    "Byte": "Byte",
                    "Word": "Word",
                    "DWord": "DWord",
                    "String": "String",
                    "Float": "Float",
                    "Double": "Double"
                },
                cellClass: "form-control-input-sm",
                events: {
                    // Add change event
                    change: function (e) {
                        // console.log("e==>",e)
                        // 改变当前colum的颜色
                        if (e.target.value) {
                            // e.target.style.backgroundColor = g_process_start_data[e.target.value].color;
                        } else {
                            // e.target.style.backgroundColor = null;
                        }
                    },

                }
            },
            {
                name: "length",
                display: i18next.t('page_dashboard.length'),
                type: "number",
                ctrlAttr: {
                    min: 0,
                    max: 99999999
                },
                cellClass: "form-control-input-sm",
                // Add change event
                events: {
                    click: function (e) {
                        let rowIndex = apg_dashboard.getRowIndex(parseInt(e.uniqueIndex));
                        let type = apg_dashboard.getCtrlValue("type", rowIndex);
                        apg_last_val_of_length = e.target.value;
                    },
                    change: function (e) {
                        let rowIndex = apg_dashboard.getRowIndex(parseInt(e.uniqueIndex));
                        let type = apg_dashboard.getCtrlValue("type", rowIndex);
                        // 针对Byte类型，需要偶数
                        if (type === "Byte") {
                            if (parseInt(e.target.value) % 2 !== 0) {
                                // not odd
                                if(parseInt(apg_last_val_of_length) > parseInt(e.target.value)){
                                    // --
                                    e.target.value = parseInt(e.target.value) - 1;
                                }else{
                                    // ++
                                    e.target.value = parseInt(e.target.value) + 1;
                                }
                            }
                        }
                    }
                }
            },
            {
                name: "note",
                display: i18next.t('page_dashboard.note'),
                type: "text",
                cellClass: "form-control-input-mid"
            },
            {
                name: "value",
                display: i18next.t('page_dashboard.value'),
                type: "text",
                cellClass: "form-control-input-sm",
                events: {
                    change: function (e) {
                        if (e.target.value) {
                            e.target.style.backgroundColor = "#99FF99";
                            // 值的修改，修改后发送到PLC
                        } else {
                            e.target.style.backgroundColor = null;
                        }
                    }
                }
            },
            {
                name: "opt",
                display: i18next.t('page_dashboard.opt'),
                type: "custom",
                customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                    // Prepare input group which is a component of Bootstrap
                    let inputGroup = document.createElement("div");
                    inputGroup.classList.add("input-group");
                    parent.appendChild(inputGroup);

                    // Create the input elementt
                    let inputControl = document.createElement("button");
                    let copyControl = document.createElement("button");
                    let t_send = document.createTextNode(i18next.t('page_dashboard.send'));
                    let t_copy = document.createTextNode(i18next.t('page_dashboard.copy'));
                    inputControl.name = "btn_dashboard_page_value_send";
                    inputControl.setAttribute("data-tags", uniqueIndex);
                    inputControl.appendChild(t_send);
                    inputGroup.appendChild(inputControl);

                    copyControl.name = "btn_dashboard_page_row_copy";
                    copyControl.setAttribute("data-tags", uniqueIndex);
                    copyControl.appendChild(t_copy);
                    inputGroup.appendChild(copyControl);
                },
                customGetter: function (idPrefix, name, uniqueIndex) {
                    // Get the value of input element
                    // var controlId = idPrefix + "_" + name + "_" + uniqueIndex;
                    // return parseFloat(document.getElementById(controlId).value);
                },
                customSetter: function (idPrefix, name, uniqueIndex, value) {
                    // Set the value of input element
                    // var controlId = idPrefix + "_" + name + "_" + uniqueIndex;
                    // document.getElementById(controlId).value = value;
                }
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
            append: i18next.t('page_dashboard.append'),
            removeLast: i18next.t('page_dashboard.removeLast'),
            insert: i18next.t('page_dashboard.insert'),
            remove: i18next.t('page_dashboard.remove'),
            moveUp: i18next.t('page_dashboard.moveUp'),
            moveDown: i18next.t('page_dashboard.moveDown'),
            rowEmpty: i18next.t('page_dashboard.rowEmpty')
        },
        sizing: "small",
        // initData: [
        //  { station: "", time: "", current: "", voltage: "", stop_: "", memberSince: "", uid: "" }
        // ]
    });
}

init_apg_dashboard();

// 复制当前设定值
$("#dt_process_start_page_start_page").on("click", "button[name='btn_dashboard_page_row_copy']", async function () {
    let uidx = parseInt($(this).attr("data-tags"));
    let v = apg_dashboard.getCtrlValue("value", apg_dashboard.getRowIndex(uidx));
    let name = apg_dashboard.getCtrlValue("name", apg_dashboard.getRowIndex(uidx));
    let type = apg_dashboard.getCtrlValue("type", apg_dashboard.getRowIndex(uidx));
    let length = apg_dashboard.getCtrlValue("length", apg_dashboard.getRowIndex(uidx));
    let note = apg_dashboard.getCtrlValue("note", apg_dashboard.getRowIndex(uidx));
    let addr = apg_dashboard.getCtrlValue("addr", apg_dashboard.getRowIndex(uidx));

    //判定有没有这个新的name，如果没有则添加，如果有则再累计
    let c = 1;
    let new_name = name + "_" + c;
    while (1) {
        for (key in g_plc_data['NODES'][plc_dev_apg_select]) {
            if (key == new_name) {
                c++;
                new_name = name + "_" + c;
                continue;
            }
        }
        break;
    }

    g_plc_data['NODES'][plc_dev_apg_select][new_name] = {};
    g_plc_data['NODES'][plc_dev_apg_select][new_name]['addr'] = addr;
    g_plc_data['NODES'][plc_dev_apg_select][new_name]['type'] = type;
    g_plc_data['NODES'][plc_dev_apg_select][new_name]['length'] = length;
    g_plc_data['NODES'][plc_dev_apg_select][new_name]['note'] = note;

    // 重新加载nodes页面
    apg_data_clear();
    apg_data_refresh(plc_dev_apg_select);
});


// 发送当前设定值
$("#dt_process_start_page_start_page").on("click", "button[name='btn_dashboard_page_value_send']", async function () {
    // 弹出发送提示框valueg_plc_data[]
    let uidx = parseInt($(this).attr("data-tags"));
    let v = apg_dashboard.getCtrlValue("value", apg_dashboard.getRowIndex(uidx));
    let name = apg_dashboard.getCtrlValue("name", apg_dashboard.getRowIndex(uidx));
    let type = apg_dashboard.getCtrlValue("type", apg_dashboard.getRowIndex(uidx));
    let length = apg_dashboard.getCtrlValue("length", apg_dashboard.getRowIndex(uidx));
    let rsp = window.prompt("更新 node [" + name + "] type [" + type + "]", v);
    let buff = [];

    if (rsp == null)
        return;

    length = parseInt(length);

    if (type != "String") {
        let a = rsp.split(",");
        let max = length;
        if (type != "Byte") {
            if (a.length < length) {
                max = a.length
            }
        }
        for (i = 0; i < max; i++) {
            buff.push(a[i]);
        }
    } else {
        buff = rsp;
    }

    let rt = await http_request_await("http://localhost:" + g_plc_data['WEBAPI']['PORT'], { "action": "plc_write_node", "node": "NODES." + plc_dev_apg_select + "." + name, "value": buff });
    rt = JSON.parse(rt);
    if (rt['errcode'] != 0) {
        alert(rt['errmsg']);
    }
});


function apg_data_clear() {
    let c = apg_dashboard.getRowCount();
    for (let i = 0; i < c; i++) {
        apg_dashboard.removeRow(0);
    }
}

function apg_data_refresh(dev) {
    let node = g_plc_data['NODES'][dev];
    let key = null;
    if (node == null) {
        return;
    }
    // 显示当前设备的 node 配置
    for (key in node) {
        apg_dashboard.appendRow([
            {
                name: key,
                addr: node[key]['addr'],
                type: node[key]['type'],
                length: node[key]['length'],
                note: node[key]['note'],
                value: node[key]['value'],
            }
        ]);
    }
}

// 选择设备，并且显示设备的配置和点位配置
$("[name='page_dashboard_device_list']").on("click", "a", function () {
    // 将所有的a标签去掉active
    $("[name='page_dashboard_device_list'] a").removeClass("active");
    // 选择当前的设备
    $(this).addClass("active");
    // console.log(this);
    // 刷新当前设备数据到apg_dashboard内

    apg_data_clear();

    $("[name='page_dashboard_device_settings']").html("");

    let dev = $(this).attr("data-tags");

    plc_dev_apg_select = dev;

    // 显示当前设备的 dev 配置
    addnew_dashboard_page_input_settings(g_plc_data['DEVS'][dev]);

    apg_data_refresh(dev);

});

// 保存当前修改
$("[name='btn_dashboard_page_apply']").on("click", async function () {
    // 获取 dashboard_page_input_settings 所有值，保存到 dev 里面
    // 
    // 清空之前的配置
    if (typeof (plc_dev_apg_select) == "undefined")
        return;

    g_plc_data['DEVS'][plc_dev_apg_select] = {};
    $("[name='dashboard_page_input_settings']").each(function () {
        let key = $(this).attr('data-tags');
        let val = $(this).val();
        g_plc_data['DEVS'][plc_dev_apg_select][key] = val;
    });

    // 获取所有节点内容，然后保存到 nodes 里面
    let obj = {};
    let data = apg_dashboard.getAllValue();
    for (i in data) {
        console.log(data[i]);
        obj[data[i]['name']] = {};
        obj[data[i]['name']]['addr'] = data[i]['addr'];
        obj[data[i]['name']]['type'] = data[i]['type'];
        obj[data[i]['name']]['length'] = data[i]['length'];
        obj[data[i]['name']]['note'] = data[i]['note'];
    }
    g_plc_data['NODES'][plc_dev_apg_select] = obj;

    JsProxyAPI.fileWrite("plc.conf", JSON.stringify(g_plc_data, null, "\t"));

    toastr.success('', '设备 [' + plc_dev_apg_select + '] 设定值保存成功!');

    // 重新加载设备
    if (g_handler_plc[plc_dev_apg_select] != "")
        plc_close(g_handler_plc[plc_dev_apg_select]);

    try {
        let rt = await init_plc_device(plc_dev_apg_select);
        g_handler_plc[plc_dev_apg_select] = rt;
    } catch (e) {
        alert("初始化PLC失败，请重试:" + plc_dev_apg_select + " -- " + e)
    }

    toastr.success('', '设备 [' + plc_dev_apg_select + '] 初始化成功!');

    // 重新加载nodes页面
    apg_data_clear();
    apg_data_refresh(plc_dev_apg_select);

});

// 添加新设备按键
$("[name='btn_dashboard_page_new_device']").on("click", function () {
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
        for (dev in g_plc_data['DEVS']) {
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
        g_plc_data['NODES'][inputValue] = {};
        g_plc_data['DEVS'][inputValue] = {};
        g_plc_data['DEVS'][inputValue]['PLC_DRIVER'] = "";
        JsProxyAPI.fileWrite("plc.conf", JSON.stringify(g_plc_data, null, "\t"));
        init_device_list();
        swal({
            title: i18next.t('alert.new_device') + ' [' + inputValue + '] ' + i18next.t('alert.added_successfully') + " !",
            text: ' ',
            type: "success"
        });
    });
});


function addnew_dashboard_page_input_settings(objs) {
    let html = "";
    let data_format = "";
    let plc_driver = "";
    let string_reverse = "";
    let data_bits = "";
    let stop_bits = "";
    let parity = "";

    for (key in objs) {
        console.log(key);
        html += '<div class="col-lg-4 col-xs-4 col-sm-4" style="padding-left: 0px;padding-right: 0px; padding-bottom: 5px;">' +
            '<label class="col-md-5 control-label">' +
            key +
            '</label>' +
            '<div class="col-md-7">';
        if (key == "STRING_REVERSE") {
            // 使用下拉选择框
            html += '<select class="form-control" name="dashboard_page_input_settings" data-tags="' + key + '">' +
                '<option value="true">true</option>' +
                '<option value="false">false</option>' +
                '</select>';
            string_reverse = objs[key];
        } else if (key == "DATAFORMAT") {
            // 使用下拉选择框
            html += '<select class="form-control" name="dashboard_page_input_settings" data-tags="' + key + '">' +
                '<option value="CDAB">CDAB</option>' +
                '<option value="ABCD">ABCD</option>' +
                '<option value="BADC">BADC</option>' +
                '<option value="DCBA">DCBA</option>' +
                '</select>';
            data_format = objs[key];
        } else if (key == "DATA_BITS") {
            // 使用下拉选择框
            html += '<select class="form-control" name="dashboard_page_input_settings" data-tags="' + key + '">' +
                '<option value="5">5</option>' +
                '<option value="6">6</option>' +
                '<option value="7">7</option>' +
                '<option value="8">8</option>' +
                '</select>';
            data_bits = objs[key];
        } else if (key == "STOP_BITS") {
            // 使用下拉选择框
            html += '<select class="form-control" name="dashboard_page_input_settings" data-tags="' + key + '">' +
                '<option value="1">1</option>' +
                '<option value="1.5">1.5</option>' +
                '<option value="2">2</option>' +
                '</select>';
            stop_bits = objs[key];
        } else if (key == "PARITY") {
            // 使用下拉选择框
            html += '<select class="form-control" name="dashboard_page_input_settings" data-tags="' + key + '">' +
                '<option value="NONE">NONE</option>' +
                '<option value="EVEN">EVEN</option>' +
                '<option value="ODD">ODD</option>' +
                '<option value="MARK">MARK</option>' +
                '<option value="SPACE">SPACE</option>' +
                '</select>';
            parity = objs[key];
        } else if (key == "PLC_DRIVER") {
            // 驱动选择，用下拉选择框
            html += '<select class="form-control" name="dashboard_page_input_settings" data-tags="' + key + '">';
            for (dev in g_modules_conf) {
                html += '<option value="' + dev + '">' + dev + '</option>';
            }
            html += '<option value="simulation">simulation</option>' +
                '</select>';
            plc_driver = objs[key];
        } else {
            html += '<input type="text" name="dashboard_page_input_settings" data-tags="' + key + '" class="form-control" placeholder="' + key + '" value="' + objs[key] + '">';
        }
        html += '</div></div>';

    }

    $("[name='page_dashboard_device_settings']").html(html);

    $("[name='dashboard_page_input_settings']").each(function () {
        if ($(this).attr('data-tags') == "STRING_REVERSE") {
            $(this).val(string_reverse);
        }
        if ($(this).attr('data-tags') == "DATAFORMAT") {
            $(this).val(data_format);
        }
        if ($(this).attr('data-tags') == "DATA_BITS") {
            $(this).val(data_bits);
        }
        if ($(this).attr('data-tags') == "STOP_BITS") {
            $(this).val(stop_bits);
        }
        if ($(this).attr('data-tags') == "PARITY") {
            $(this).val(parity);
        }
        if ($(this).attr('data-tags') == "PLC_DRIVER") {
            $(this).val(plc_driver);
        }
    });
}

$("[name='page_dashboard_device_settings']").on("change", "[name='dashboard_page_input_settings']", function () {
    // 修改设备型号
    if ($(this).attr("data-tags") != "PLC_DRIVER")
        return;
    let plc_dev = $(this).val();
    console.log($(this).val());
    // 模拟类型的驱动
    if (plc_dev == "simulation") {
        let objs = {
            "PLC_DRIVER": "simulation",
        };
        addnew_dashboard_page_input_settings(objs);
    } else {
        let objs = deepCopy(g_modules_conf[plc_dev]);
        delete objs['FUNCTION'];
        delete objs['TYPE'];
        addnew_dashboard_page_input_settings(objs);
    }
});

$("[name='btn_dashboard_page_delete_device']").on("click", function () {
    //删除设备
    swal({
        title: i18next.t('alert.yes_delete_it'),
        text: i18next.t('alert.delete_device') + " [" + plc_dev_apg_select + "] ," + i18next.t('alert.operation_will_not_be_recoverable'),
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: i18next.t('alert.yes_delete_it'),
        cancelButtonText: i18next.t('alert.cancel'),
        closeOnConfirm: false
    }, function () {
        // 删除设备
        delete g_plc_data['NODES'][plc_dev_apg_select];
        delete g_plc_data['DEVS'][plc_dev_apg_select];

        let last_device_select = plc_dev_apg_select;

        JsProxyAPI.fileWrite("plc.conf", JSON.stringify(g_plc_data, null, "\t"));

        init_device_list();
        // 重新加载所有设备
        plc_close_all();
        init_plc();

        swal({
            title: i18next.t('alert.device') + ' [' + last_device_select + '] ' + i18next.t('alert.delete_successfully') + " !",
            text: ' ',
            type: "success"
        });
    });
});


// 重启服务的按键
$("[name='btn_dashboard_page_restart_server']").on("click", function () {
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

        init_device_list();
        // 重新加载所有设备
        plc_close_all();
        init_plc();

        swal({
            title: i18next.t('alert.restart_successfully') + " !",
            text: ' ',
            type: "success"
        });
    });
});


//初始化所有设备
function init_device_list() {
    $("[name='page_dashboard_device_list']").html("");
    let html = "";
    for (let key in g_plc_data['DEVS']) {
        let dev = g_plc_data['DEVS'][key];
        html += "<li><a href=\"javascript:;\" data-tags=\"" + key + "\">" + key + "</a><span data-tags=\"" + key + "\" class=\"span-offline\"></span></li>";
    }
    $("[name='page_dashboard_device_list']").html(html);

    // 初始化后，如果有设备，默认打开第一个
    let a = $("[name='page_dashboard_device_list'] a").first();
    // 将所有的a标签去掉active
    $("[name='page_dashboard_device_list'] a").removeClass("active");
    // 选择当前的设备
    a.addClass("active");
    // console.log(this);
    // 刷新当前设备数据到apg_dashboard内

    apg_data_clear();

    $("[name='page_dashboard_device_settings']").html("");

    let dev = a.attr("data-tags");

    plc_dev_apg_select = dev;

    // 显示当前设备的 dev 配置
    addnew_dashboard_page_input_settings(g_plc_data['DEVS'][dev]);

    apg_data_refresh(dev);
}

init_device_list();


// 没1s刷新一次状态显示
setInterval(function () {
    let c = 0;
    // 显示所有设备状态
    for (let dev in g_plc_data['NODES']) {
        if (dev == "")
            continue;
        if (typeof (g_plc_status[dev]) == "undefined")
            return;

        console.log(g_plc_status[dev]);
        if (g_plc_status[dev]['online']) {
            $("span[data-tags='" + dev + "']").attr("class", "span-online");
        } else {
            $("span[data-tags='" + dev + "']").attr("class", "span-offline");
        }

    }

    for (let key in g_plc_data['NODES'][plc_dev_apg_select]) {
        // 找到 key 对应的行
        for (let r = 0; r < apg_dashboard.getRowCount(); r++) {
            name = apg_dashboard.getCtrlValue("name", r);
            if (name == key) {
                let v = g_plc_data['NODES'][plc_dev_apg_select][key]['value'];
                apg_dashboard.setCtrlValue("value", r, v);
                break;
            }
        }
    }
}, 1000);

//# sourceURL=dashboard.js