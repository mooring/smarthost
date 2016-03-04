function setKey(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {}
    setCookie(key, value, 31);
}

function getKey(key) {
    var v = null;
    if (window.localStorage) {
        v = localStorage.getItem(key);
    }
    if (v != null) {
        return v;
    } else {
        return getCookie(key);
    }
}

function getCookie(key) {
    var cookie = document.cookie,
        mat = (new RegExp(key + '=([^;]+)')).exec(cookie);
    if (mat) {
        return mat[1];
    } else {
        return null;
    }
}

function setCookie(key, value, days){
    var d = new Date();
    d.setTime(d + 86400000 * days);
    document.cookie = key + '=; domain=' + document.domain + '; expires=' + d.toGMTString();
}

function delKey(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {}
    setCookie(key, '', -365);
}

function clearStore() {
    try {
        localStorage.clear();
    } catch (e) {}
}

function isIP(ipStr) {
    var secs = ipStr.replace(/[^\d\.]+/g, '').split('.');
    if (secs.length != 4) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        var sec = parseInt(secs[i]);
        if (isNaN(sec) || sec > 255 || sec < 0) {
            return false;
        }
    }
    return true;
}

function isMachine(name) {
    return /^\w[a-z0-9\-\_.]+$/i.test(name);
}

function isPort(port) {
    port = parseInt(port);
    if (isNaN(port) || port < 0 || port > 65535) {
        return false;
    }
    return true;
}

function restoreRemoteConfig() {
    var model = getKey('proxyModel');
    if (model == 'local' || model == 'remote' || model == '' || model == null) {
        var host = getKey('remoteHost') || '',
            port = getKey('remotePort') || '';
        $('#remoteHost').prop('name', 'remoteHost').val(host);
        $('#remotePort').prop('name', 'remotePort').val(port);
    }
}

function strToMap(str, sp1, sp2) {
    var arr = str.split(sp1 || '&'),
        obj = {};
    for (var i = 0, il = arr.length; i < il; i++) {
        var tmp = arr[i].split(sp2 || '=');
        if (tmp.length == 2 && tmp[0].length) {
            try {
                tmp[1] = decodeURIComponent(tmp[1]);
            } catch (e) {}
            obj[tmp[0].replace(/\s+/gi, '')] = tmp[1];
        }
    }
    return obj;
}
(function (win, doc) {
    win.gQuery = strToMap(location.search.substr(1));
    win.gHash = strToMap(location.hash.substr(1));
    win.gUA = navigator.userAgent;
    if (/MicroMessenger/i.test(gUA)) {
        doc.addEventListener('WeixinJSBridgeReady', function() {
            var wxbridge = WeixinJSBridge;
            wxbridge.on('menu:share:appmessage', function (argv) {
                return;
            });
            wxbridge.on('menu:share:timeline', function (argv) {
                return;
            });
            wxbridge.on('menu:share:weibo', function (argv) {
                return;
            });
            wxbridge.invoke('hideOptionMenu');
            wxbridge.invoke('hideToolbar');
        });
    }
})(window, document);