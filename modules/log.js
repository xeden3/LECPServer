//alert("aaaa");
/*
let data = [];

for (var i = 0; i < 93; i++) {
    data.push([i, i, i, i, i]);
}
*/

$('[name="page_log_selector_type"]').on( 'change', function () {
    let v = $(this).val();
    if(v=="ALL")
        v = "";
    $('#dt_log').DataTable().column( 2 ).search( v ).draw();
} );


function get_log_data(){
    let rt = JsProxyAPI.loggerRead();
    rt = JSON.parse(rt);
    console.log(rt);
    return rt;
}

let dt = $('#dt_log').DataTable({
    dom: 'Bfrtip',
    buttons: [
        'copy', 'excel', 'csv', 'pdf', 
        {
            text: i18next.t('page_log.reload'),
            action: function (e, dt, node, config) {
                dt.clear().rows.add(get_log_data()).draw(false);
                //dt.data = get_log_data();
                //dt.data.refresh;
                //dt.draw();
            }
        }
    ],
    data: get_log_data(),
    deferRender: true,
    scrollY: 390,
    scrollCollapse: true,
    scroller: true
});


//# sourceURL=log.js

