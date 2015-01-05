$.fn.center = function(){
	return this.each(function(){
		var de = document.documentElement, w = window, leftPos = (($.browser.opera ? de.clientWidth : $(w).width()) - $(this).outerWidth()) / 2 + $(w).scrollLeft(), topPos = (($.browser.opera ? de.clientHeight : $(w).height()) - $(this).outerHeight()) / 2 + $(w).scrollTop();
		leftPos = (leftPos < 0) ? 0 : leftPos;
		topPos = (topPos < 0) ? 0 : topPos;
		$(this).css({
			left: leftPos + 'px',
			top: topPos + 'px'
		});
	});
};
$.fn.applyRule = function(){
	var me = this;
	return me.click(function(){
		var checked = this.checked;
		checked && me.not(this).attr('checked', false).parent('label').removeClass('effective');
		$(this).parent('label')[checked ? 'addClass' : 'removeClass']('effective');
		saveDomToHost((checked ? 'Enable ' : 'Disable ') + 'Host');
	});
}
$.fn.modal = function(fnOK, fnCancel){
	var divLayout = $('<div class="layout"></div>').appendTo('body');
	divLayout.css({
		'opacity': 0.5,
		width: $('body').outerWidth(),
		height: $('body').outerHeight()
	});
	$('select').hide();
	var divDialog = this.appendTo('body').hide().center().fadeIn('fast');
	$('button:first', divDialog).click(function(){
		if (($.isFunction(fnOK) && fnOK.call(divDialog, this) == true) || !$.isFunction(fnOK)) cancel();
	});
	$('button:last', divDialog).click(function(){
		if (($.isFunction(fnCancel) && fnCancel.call(divDialog) == true) || !$.isFunction(fnCancel)) cancel();
	});
	function cancel(){
		divLayout.fadeOut('fast', function(){
			divLayout.remove();
		});
		divDialog.fadeOut('fast', function(){
			$('select').show();
			divDialog.remove();
		});
	}
	return divDialog;
}
$.extend(String.prototype, {
	_rTrim : /(^\s+)|(\s+$)/g,
	trim: function(r){
		return this.replace(r || String.prototype._rTrim, "");
	},
	empty: function(){
		return this.trim() == '';
	},
	lenW: function(){
		return this.replace(/[^\x00-\xff]/g, "**").length;
	},
	isRule: function(){
		return /(#?)[\f\t\v ]*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\f\t\v ]+(\S+)[\f\t\v ]*(#(.*))?/.test(this);
	},
	getFileText: function(){
        if( !fso.FileExists(this) ){ return ""; }
        var ts = fso.OpenTextFile(this, 1, true);
        var text = ts.AtEndOfStream ? "" : ts.ReadAll() ;
		ts.close();
		return text.trim();
	},
	setFileText: function(text){
		try {
			var ts = fso.OpenTextFile(this, 2);
			ts.write(text);
			ts.close();
			return true;
		} catch (e) {
			msg("Save\n" + this + "\nFailed");
			return false;
		}
	}
});
$.extend(Array.prototype, {
	unique: function(fn){
		var o = {}, arRet = [], me = this, len = me.length, fn = fn ||
		function(n){
			return n;
		};
		for (var i = 0; i < len; i++) {
			var k = fn(me[i]);
			if (o[k]) {
				me.splice(i--, 1);
				len--
			} else o[k] = true;
		}
		return me;
	}
});
