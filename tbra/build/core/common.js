/**
 * TB Common function
 */
TB.common = {
	/**
	 * �Ƴ�����ǰ��Ŀհ��ַ�
	 * 
	 * @method trim
	 * @param {String} str 
	 * @deprecated ʹ��String.prototpye.trim()�����
	 */
	trim: function(str) {
		return str.replace(/(^\s*)|(\s*$)/g,''); 
	},

	/**
	 * ����HTML (from prototype framework 1.4)
	 * @method escapeHTML
	 * @param {Object} str
	 */
	escapeHTML: function(str) {
		var div = document.createElement('div');
		var text = document.createTextNode(str);
		div.appendChild(text);
		return div.innerHTML;
	},

	/**
	 * ����HTML (from prototype framework 1.4)
	 * @method unescapeHTML
	 * @param {Object} str
	 */
	unescapeHTML: function(str) {
		var div = document.createElement('div');
		div.innerHTML = str.replace(/<\/?[^>]+>/gi, '');
		return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
	},
	
	/**
	 * ɾ���ַ����е�(x)html�еı�ǩ��Ϣ
	 * @method stripTags
	 * @param {Object} str
	 */
	stripTags: function(str) {
    	return str.replace(/<\/?[^>]+>/gi, '');
  	},

	/**
	 * ת�� NodeList ���� arguments Ϊ����
	 * @method toArray
	 * @param {Object} list
	 * @param {Object} start
	 * @return {Array} ת��������飬���start����list�����������ؿ�����
	 */
	toArray : function(list, start) {
		var array = [];
		for (var i = start || 0; i < list.length; i++) {
			array[array.length] = list[i];
		}
		return array;
	},

	/**
	 * �����������Ը�ĳ������������Ѵ��ڸ����ã������и���
	 * @param {Object} obj Ŀ����� 
	 * @param {Object} config ��������/���� ����
	 */	
	applyIf: function(obj, config) {
    	if(obj && config && typeof config == 'object'){
        	for(var p in config) {
				if (!YAHOO.lang.hasOwnProperty(obj, p))
            		obj[p] = config[p];
			}
    	}
    	return obj;
	},

	/**
	 * �����������Ը�ĳ������������Ѵ��ڸ����ã���������Ϊ������
	 * @param {Object} obj Ŀ����� 
	 * @param {Object} config ��������/���� ����
	 */		
	apply: function(obj, config) {
    	if(obj && config && typeof config == 'object'){
        	for(var p in config)
				obj[p] = config[p];
		}
		return obj;
	},
	
	/**
	 * ��ʽ���ַ���
	 * eg:
	 * 	TB.common.formatMessage('{0}����{1}��Сʱ', [1, 24]) 
	 *  or
	 *  TB.common.formatMessage('{day}����{hour}��Сʱ', {day:1, hour:24}}
	 * @param {Object} msg
	 * @param {Object} values
	 */
	formatMessage: function(msg, values, filter) {
		var pattern = /\{([\w-]+)?\}/g;
		return function(msg, values, filter) {
			return msg.replace(pattern, function(match, key) {
				return filter?filter(values[key], key):values[key];
			});	
		}
	}(),
	
	/**
	 * ����URI
	 */
	parseUri: (function() {
		var keys = ['source', 'prePath', 'scheme', 'username', 'password', 'host', 'port', 'path', 'dir', 'file', 'query', 'fragment'];
		var re = /^((?:([^:\/?#.]+):)?(?:\/\/)?(?:([^:@]*):?([^:@]*)?@)?([^:\/?#]*)(?::(\d*))?)((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?/;	
		return function(sourceUri) {
			var uri = {};
			var uriParts = re.exec(sourceUri);
			for(var i = 0; i < uriParts.length; ++i){
				uri[keys[i]] = (uriParts[i] ? uriParts[i] : '');
			}
			return uri;
		}
	})()
};

TB.applyIf = TB.common.applyIf;
TB.apply = TB.common.apply;