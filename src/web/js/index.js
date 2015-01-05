function loadConfig(){
	$.ajax({
		url:'Configs/'+gQuery.oid+'.txt?'+(''+Math.random()).substr(-5),
		dataType:'text',
		type:'GET',
		success: restoreHost
	});
}
function restoreHost(postStr){
	var obj = strToMap(postStr), j=0;
	$('#remoteHost').prop('name','remoteHost').val(obj.remoteHost);
	$('#remotePort').prop('name','remotePort').val(obj.remotePort);
	if(obj.proxyModel == 'local' || obj.proxyModel == 'remote'){
		$('#proxyModel').val(obj.proxyModel);
		for(var i in ['oid','remoteHost','remotePort','proxyModel']){
			if(i in obj){ delete obj[i]; }
		}
		for(var i in obj){
			i = (''+i).replace(/[<>\"\']+/g,'');
			if($('select[name="'+i+'"]').length==0 && $('input[name="'+i+'"]').length==0){
				var val = (''+obj[i]).replace(/[^<>\"\']+/gi,'');
				if(j==0){
					$('input[key="key"]',cloneDOM.parentNode).val(i);
					$('input[key="val"]',cloneDOM.parentNode).val(val);
				}else{
					CloneHost(i,val);
				}
				j++;
			}
		}
		SelectModel();
	}
}
function CloneHost(key,val){
	var div = cloneDOM.cloneNode(true);
	cloneBTN.parentNode.parentNode.appendChild(div);
	$('input',div).removeClass('invalid').val('')[0].focus();
	$('button',div).html('Del Pair').removeAttr('id').attr('class','delBtn dark').click(function(){
		$(this).parent().remove();
	});
	if(key){
		$('input[key="key"]',div).val(key);
		$('input[key="val"]',div).val(val||'');
	}
	return false;
}
function checkForm(){
	var model = $('#proxyModel').val().trim();
	if( model == 'local'){
		setKey('proxyModel','local');
		return checkHosts();
	}else if(model =='remote'){
		setKey('proxyModel','remote');
		return checkRemote();
	}else{
		setKey('proxyModel','');
		$('#selectForm')[0].submit();
	}
}
function UpdateFormFields(){
	var list = $('div.info'),formData = [];
	for(var i=0,il=list.length;i<il;i++){
		var $hide = $('input[type="hidden"]',list[i]),
			$name = $('input[key="key"]',list[i]),
			$val  = $('input[key="val"]',list[i]),
			name = $name.val().replace(/[<>\"\']+/gi,''),
			val = $val.val().replace(/[^\d\.]+/gi,'');
		if(name.length>0){
			$hide.prop('name',name);
			$hide[0].setAttribute('name',name);
			$hide.val(val);
			formData.push(name+'='+val);
		}
	}
	return formData.join('&');
}
function checkHosts(){
	UpdateFormFields();
	var hosts = $('div.info input[type="hidden"]'),
		selects = $('div.select'),
		validNum = 0;
	for(var i=0,il=hosts.length;i<il;i++){
		var host = hosts[i], valid = true;
		if(host.value.length>0 && !/^[0-i]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(host.value)){
			$('input[key="val"]',host.parentNode).addClass('invalid');
		}else{
			$('input[key="val"]',host.parentNode).removeClass('invalid');
		}
		if(host.name.length<3 || !/^[\w+\.]+\w+$/i.test(host.name)) {
			$('input[key="key"]',host.parentNode).addClass('invalid');
			valid = false;
		}else{
			$('input[key="key"]',host.parentNode).removeClass('invalid');
		}
		if(valid){
			$('input[key]',host.parentNode).removeClass('invalid');
			validNum++;
		}
	}
	if(validNum>0 || selects.length>0){
		$('#remoteContent').remove();
		qqAjax();
	}
	return false;
}
function qqAjax(){
	var tform = $('#selectForm').serialize();
	$.ajax({
		url:'/?'+(new Date().getTime()),
		type:'POST',
		data: tform,
		success:function(xhr,res){
			location.href = "/done.html?oid="+gQuery.oid+'&'+new Date().getTime()
		},
		error:function(res){
			console.error(res);
		}
	});
}
function checkRemote(){
	var $host = $('#remoteHost'),
		host = $host.val(), 
		$port = $('#remotePort'),
		port=$port.val(),
		valid = true;
	if(!/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(host)){
		$host.addClass('invalid');
		valid = false;
	}else{
		$host.removeClass('invalid');
	}
	if(!/^[1-9][0-9]+$/.test(port)){
		$port.addClass('invalid');
		valid = false;
	}else{
		$port.removeClass('invalid');
	}
	if(valid){
		if(!('oid' in gQuery)){
			setKey('oid',host.replace(/[^\d]+/g,''));
		}
		setKey('remoteHost',host);setKey('remotePort',port);
		UpdateFormFields();
		$('#localContent').remove();
		qqAjax();
	}
	return false;
}
function SelectModel(){
	var model = $('#proxyModel').val().trim();
	if(model =='local' || model == 'remote'){
		$('#'+model+'Content').show();
		$('#'+(model=='local'?'remote':'local')+'Content,#cleanContent').hide();
	}else{
		$('#localContent,#remoteContent').hide();
		$('#cleanContent').show();
	}
}

function initEvents(){
	window.cloneDOM = $('div.info')[0];
	window.cloneBTN = $('#addBtnOne')[0];
	cloneBTN.onclick= function(){CloneHost();return false;};
	$('#proxyModel').change(SelectModel);
}
$(document).ready(function(){
	initEvents();
	var oid = gQuery.oid || getKey('oid') || '';
	restoreRemoteConfig(restoreHost);
	if(oid){
		gQuery.oid = oid.replace(/[^a-z0-9]+/gi,'');
		$('#oid').prop('name','oid').val(gQuery.oid);
		loadConfig();
	}
});
