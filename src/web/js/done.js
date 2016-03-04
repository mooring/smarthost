function loadConfig() {
    $.ajax({
        url: 'Configs/' + gQuery.oid + '.txt?' + ('' + Math.random()).substr(-5),
        dataType: 'text',
        method: 'GET',
        success: restoreHost
    });
}

function restoreHost(postStr) {
    var obj = strToMap(postStr),
        model = obj.proxyModel;
    if (model == '' || model == null) {
        $('#localContent,#remoteContent').hide();
        $('#cleanContent').show();
        return;
    }
    if (model == 'local' || model == 'remote') {
        if (model == 'remote') {
            $('#remoteContent').html([
                'All HTTP requests will be sent to ',
                obj.remoteHost, ':', (obj.remotePort || '')
            ].join(''));
        }
        $('#' + (model == 'local' ? 'remote' : 'local') + 'Content,#cleanContent').hide();
        $('#' + model + 'Content').show();
    } else {
        $('#localContent,#cleanContent').hide();
        $('#remoteContent').html('Unknown Error founds, Please try again').show();
    }
}

function backToConfig() {
    location.replace(location.protocol + '//' + document.domain + '/' + location.search);
}

function initEvents() {
    window.backBTN = $('button.blue')[0];
    backBTN.onclick = backToConfig;
}

$(document).ready(function () {
    initEvents();
    var oid = gQuery.oid || getKey('oid') || '';
    if (oid) {
        gQuery.oid = oid.replace(/[^a-z0-9]+/gi, '');
        loadConfig();
    } else {
        restoreHost('');
    }
});