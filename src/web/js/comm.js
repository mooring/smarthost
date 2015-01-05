function setKey(key, value) {
	try{localStorage.setItem(key,value);}catch(e){}
	var d = new Date();
	d.setTime(d.getTime()+86400000*31);
	document.cookie = key +'='+value+'; domain='+document.domain +'; expires='+d.toGMTString();
}
function getKey(key){
	var v = null;
	if(window.localStorage){
		v = localStorage.getItem(key);
	}
	if(v != null){
		return v;
	}else{
		return getCookie(key);
	}
}
function getCookie(key){
	var cookie = document.cookie,
		mat = (new RegExp(key+'=([^;]+)')).exec(document.cookie);
	if(mat){
		return mat[1];
	}else{
		return null;
	}
}
function delKey( key )
{
	try{
		localStorage.removeItem(key);
	}catch(e){}
	var d = new Date();
	d.setTime(d-86400000*365);
	document.cookie = key +'=; domain='+document.domain +'; expires='+d.toGMTString();
}
function clearStore()
{
	try{
		localStorage.clear();
	}catch(e){}
}
function restoreRemoteConfig(restoreHost){
	var model = getKey('proxyModel');
	if(model=='local'||model=='remote'||model==''||model==null){
		var host=getKey('remoteHost')||'',
			port=getKey('remotePort')||'';
		restoreHost('proxyModel='+(model||'')+'&remoteHost='+host+'&remotePort='+port);
	}
}
function strToMap(str, sp1, sp2)
{
	var arr = str.split(sp1||'&'),
		obj = {};
	for(var i=0,il=arr.length;i<il;i++){
		var tmp = arr[i].split(sp2||'=');
		if(tmp.length==2&&tmp[0].length){
			try{ tmp[1] = decodeURIComponent(tmp[1]); }catch(e){}
			obj[tmp[0].replace(/\s+/gi,'')] = tmp[1];
		}
	}
	return obj;
}
(function(){
	window.gQuery = strToMap(location.search.substr(1));
	window.gHash  = strToMap(location.hash.substr(1));
	window.gUA = navigator.userAgent;
    if (/MicroMessenger/i.test(gUA)){
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            WeixinJSBridge.on('menu:share:appmessage', function (argv) {return;});
            WeixinJSBridge.on('menu:share:timeline', function (argv) {return;});
            WeixinJSBridge.on('menu:share:weibo', function (argv) {return;});
			WeixinJSBridge.invoke('hideOptionMenu');
			WeixinJSBridge.invoke('hideToolbar');
		});
	}
})();
