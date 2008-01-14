/**
 * DOM utilities
 * @TODO
 */
TB.dom = {
	
	/**
	 * insertAfter
	 * @param {Object} node
	 * @param {Object} refNode
	 * @deprecated use YAHOO.util.Dom.insertAfter
	 */
	insertAfter: function(node, refNode) {
		return $D.insertAfter(node, refNode);
	},
	
	/**
	 * ����tagName��ȡ���һ�����Ƚڵ�
	 * @param {Object} el
	 * @param {Object} tag
	 * @deprecated use YAHOO.util.Dom.getAncestorByTagName
	 */
	getAncestorByTagName: function(el, tag) {
		return $D.getAncestorByTagName(el, tag);
	},
	
	/**
	 * ����class��ȡ�����һ�����Ƚڵ�
	 * @param {Object} el
	 * @param {Object} cls
	 * @deprecated use YAHOO.util.Dom.getAncestorByClassName
	 */
	getAncestorByClassName: function(el, cls) {
		return $D.getAncestorByClassName(el, cls);
	}, 
	
	/** 
	 * ��ȡ֮����ֵܽڵ�
	 * @param {Object} node
	 * @deprecated use YAHOO.util.Dom.getNextSibling
	 */	
	getNextSibling: function(node) {
		return $D.getNextSibling(node);
	},
	
	/** 
	 * ��ȡ֮ǰ���ֵܽڵ�
	 * @param {Object} node
	 * @deprecated use YAHOO.util.Dom.getPreviousSibling
	 */
	getPreviousSibling: function(node) {
		return $D.getPreviousSibling(node);	
	},
	
	/**
	 * ��ȡ�����label
	 * @param {Object} el
	 * @param {Object} parent
	 */
	getFieldLabelHtml: function(el, parent) {
		var input = $(el), labels = (parent || input.parentNode).getElementsByTagName('label');
		for (var i = 0; i < labels.length; i++) {
			var forAttr = labels[i].htmlFor || labels[i].getAttribute('for')
			if (forAttr == input.id)
				return labels[i].innerHTML;
		}
		return null;
	},
	
	/**
	 * ��ȡiframe��document
	 * @param {Object} el
	 */
	getIframeDocument: function(el) {
		var iframe = $(el);
		return iframe.contentWindow? iframe.contentWindow.document : iframe.contentDocument;
	},

	/**
	 * ���ñ���action���ԣ�������а���ͬ����fieldʱ�����
	 * @param {Object} form  form ����
	 * @param {Object} url  action url
	 */
	setFormAction: function(form, url) {
		form = $(form);
	    var actionInput = form.elements['action'];
	    var postSet;
	    if (actionInput) {
	        var ai = form.removeChild(actionInput);
	        postSet = function() {
	            form.appendChild(ai);
			}
	    }
	    form.action = url;
	    if (postSet)
	        postSet();
	    return true;
	},
	
	/**
	 * �����ʽ�ı�
	 * @param {Object} cssText
	 * @param {Object} doc
	 */
	addCSS: function(cssText, doc) {
		doc = doc || document;
		var styleEl = doc.createElement('style');
		styleEl.type = "text/css";
		if (styleEl.styleSheet) {
			styleEl.styleSheet.cssText = cssText;
		} else {
			styleEl.appendChild(doc.createTextNode(cssText));
		}
		doc.getElementsByTagName('head')[0].appendChild(styleEl);
	},
	
	/**
	 * ���ݽű����֣�ȡ�ýű�����
	 * @param {Object}||{RegExp}||{String} script
	 */
	getScriptParams: function(script) {
		var p = /\?(.*?)($|\.js)/;
		var m;
		//����� <script> tag
		if (YAHOO.lang.isObject(script) && script.tagName && script.tagName.toLowerCase()=='script') {
			if (script.src && (m = script.src.match(p))) {
				console.debug(m);
				return m[1].toQueryParams();  
			}
		} else {
			//����� string�� ת�� regexp
			if (YAHOO.lang.isString(script)) {
				script = new RegExp(script, 'i');
			}	
			var scripts = document.getElementsByTagName("script");
			var matchs, ssrc;
			for (var i = 0; i < scripts.length; ++i) {
				ssrc = scripts[i].src;
				if (ssrc && script.test(ssrc) && (m = ssrc.match(p))) {
					return m[1].toQueryParams(); 
				}
			}
		}
	}	
	
}