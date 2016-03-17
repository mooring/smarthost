function loadConfig() {
    $.ajax({
        url : 'Configs/' + gQuery.oid.replace(/[^a-z0-9]+/g,'') + '.txt?' + ('' + Math.random()).substr(-5),
        dataType : 'text',
        type : 'GET',
        success : restoreHost
    });
}
function restoreHost(postStr) {
    var obj = strToMap(postStr),
        j = 0,
        rlist = ['oid', 'remoteHost', 'remotePort', 'proxyModel'],
        ldiv = $('#localContent');
    if (obj.proxyModel == 'local' || obj.proxyModel == 'remote') {
        $('#proxyModel').val(obj.proxyModel);
        for (var i in rlist) {
            if (rlist[i]in obj) {
                delete obj[rlist[i]];
            }
        }
        for (var key in obj) {
            key = ('' + key).replace(/[<>\"\']+/g, '');
            var val = ('' + obj[key]).replace(/[^a-z0-9\-.~_:]+/gi, ''),
                item = ldiv.find('select[name="'+key+'"]');
            if(item.length>0){
                item.val(val);
            }else{
                if (j == 0) {
                    $('input[key="key"]', cloneDOM.parentNode).val(key);
                    $('input[key="val"]', cloneDOM.parentNode).val(val);
					$('input[type="hidden"]', cloneDOM.parentNode).attr('name',key).val(val);
                } else {
                    CloneHost(key, val);
                }
                j++;
            }
        }
        SelectModel();
    }
}

function CloneHost(key, val) {
    var div = cloneDOM.cloneNode(true);
    cloneBTN.parentNode.parentNode.appendChild(div);
    $('input', div).removeClass('invalid').val('')[0].focus();
    $('button', div).html('Del Pair').removeAttr('id').attr('class', 'delBtn dark').click(function () {
        $(this).parent().remove();
    });
    if (key && val) {
        $('input[key="key"]', div).val(key);
        $('input[key="val"]', div).val(val);
		$('input[type="hidden"]',div).attr('name',key).val(val);
    }else{
		$('input[type="hidden"]',div).attr('name','').val('');
	}
}

function checkForm() {
    var model = $('#proxyModel').val().trim();
    UpdateFormFields();
    setKey('proxyModel', model||'');
    if (model == 'local') { 
        checkHosts();
    } else if (model == 'remote') {
        checkRemote();
    } else {
        qqAjax();
    }
    return false;
}

function UpdateFormFields() {
    var list = $('#localContent div.info'),
        formData = [];
    for (var i = 0, il = list.length; i < il; i++) {
        var $hide = $('input[type="hidden"]', list[i]),
            $name = $('input[key="key"]', list[i]),
            $val = $('input[key="val"]', list[i]),
            name = $name.val().replace(/[<>\"\']+/gi, ''),
            val = $val.val().replace(/[^a-z0-9\-.~_:]+/gi, '');
        if (name.length > 0) {
            $hide.prop('name', name).val(val);
            formData.push(name + '=' + val);
        }else{
			$hide.prop('name', '').val('');
		}
    }
    return formData.join('&');
}

function checkHosts() {
    UpdateFormFields();
    var hosts = $('div.info input[type="hidden"]'),
        selects = $('div.select'),
        validNum = 0;
    for (var i = 0, il = hosts.length; i < il; i++) {
        var host = hosts[i],
            valid = true;
        if (host.value.length > 0 && (!isIP(host.value) && !isMachine(host.value))) {
            $('input[key="val"]', host.parentNode).addClass('invalid');
        } else {
            $('input[key="val"]', host.parentNode).removeClass('invalid');
        }
        if (host.name.length < 3 || !/^[\w\.]+\w+$/i.test(host.name)) {
            $('input[key="key"]', host.parentNode).addClass('invalid');
            valid = false;
        } else {
            $('input[key="key"]', host.parentNode).removeClass('invalid');
        }
        if (valid) {
            $('input[key]', host.parentNode).removeClass('invalid');
            validNum++;
        }
    }
    if (validNum > 0 || selects.length > 0) {
        qqAjax();
    }
    return false;
}

function qqAjax() {
    var tform = $('#selectForm').serialize();
    $.ajax({
        url : '/?oid=' + (gQuery.oid||'') + '&' + (new Date().getTime()),
        type : 'POST',
        data : tform,
        success : function (xhr, res) {
            alert("Done");
        },
        error : function (xhr) {
            if (xhr.readyState == 4) {
                alert("Done");
            }else{
                alert("Error");
            }
        }
    });
}

function checkRemote() {
    var $host = $('#remoteHost'),
        host  = $host.val(),
        $port = $('#remotePort'),
        port = $port.val(),
        valid = true;
    if (!isIP(host) && !isMachine(host)) {
        $host.addClass('invalid');
        valid = false;
    } else {
        $host.removeClass('invalid');
    }
    if (!isPort(port)) {
        $port.addClass('invalid');
        valid = false;
    } else {
        $port.removeClass('invalid');
    }
    if (valid) {
        var oid = gQuery.oid || host.replace(/[^\d]+/g, '');
        setKey('oid', oid);
        setKey('remoteHost', host);
        setKey('remotePort', port);
        qqAjax();
    }
    return false;
}

function SelectModel() {
    var model = $('#proxyModel').val().trim();
    if (model == 'local' || model == 'remote') {
        $('#' + model + 'Content').show();
        $('#' + (model == 'local' ? 'remote' : 'local') + 'Content,#cleanContent').hide();
    } else {
        $('#localContent,#remoteContent').hide();
        $('#cleanContent').show();
    }
}

function initEvents(win) {
    win.cloneDOM = $('div.info')[0];
    win.cloneBTN = $('#addBtnOne')[0];
    cloneBTN.onclick = CloneHost;
    $('#proxyModel').change(SelectModel);
}
$(document).ready(function () {
    initEvents(window);
    var oid = gQuery.oid || getKey('oid') || '';
    restoreRemoteConfig();
    if (oid) {
        gQuery.oid = oid.replace(/[^a-z0-9]+/gi, '');
        $('#oid').prop('name', 'oid').val(gQuery.oid);
        loadConfig();
    }
});
