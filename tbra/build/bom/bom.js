/**
 * @author zexin.zhaozx
 */

(function() {
	var ua = navigator.userAgent.toLowerCase();
	var _isOpera = ua.indexOf('opera') != -1,
		_isSafari = ua.indexOf('safari') != -1,
		_isGecko = !_isOpera && !_isSafari && ua.indexOf('gecko') > -1,
		_isIE = !_isOpera && ua.indexOf('msie') != -1, 
		_isIE6 = !_isOpera && ua.indexOf('msie 6') != -1,
		_isIE7 = !_isOpera && ua.indexOf('msie 7') != -1;
	TB.bom = {
		isOpera: _isOpera,
		isSafari: _isSafari,
		isGecko: _isGecko,
		isIE: _isIE,
		isIE6: _isIE6,
		isIE7: _isIE7,
		/**
	     * ��ȡcookie
	     * @method getCookie
	     * @param {String} name cookie����
	     * @return {String} cookie ��ֵ���߿��ַ���
	     */	
		getCookie: function(name) {
			var value = document.cookie.match('(?:^|;)\\s*'+name+'=([^;]*)');
			return value ? unescape(value[1]) : '';
		},
	
	    /**
	     * ����cookie
	     * @method setCookie
	     * @param {String} name cookie����
		 * @param {String} value cookie��ֵ
	     * @return {String} cookie ��ֵ���߿��ַ���
	     */	
		setCookie: function(name, value, expire, domain, path) {
			value = escape(value);
			value += (domain) ? '; domain=' + domain : '';
			value += (path) ? "; path=" + path : '';
			if (expire){
				var date = new Date();
				date.setTime(date.getTime() + (expire * 86400000));
				value += "; expires=" + date.toGMTString();
			}
			document.cookie = name + "=" + value;
		},
	
		/**
		 * ɾ��cookie
		 * @method removeCookie
		 * @param {Object} name
		 */
		removeCookie: function(name) {
			setCookie(name, '', -1);
		},
	
		/**
		 * ��ȡ��ǰhostname��domain.domain;
		 * Ĭ�Ϸ��ص�ǰhostname�ĵ�һ�㸸������ www.xyx.taobao.com -> xyz.taoboa.com��store.taobao.com - > taobao.com
		 * �ɴ���һ������n��ָ��ȡn���ĸ�������n=2, ��www.xyx.taobao.com -> taoboa.com
		 * ���hostname����ֻ�ж����򣬻����n���������Ƿ��ض�����
		 * 
		 * ע�⣺����sina.com.cn���������������������������
		 * 
		 * @method pickDocumentDomain
		 * @return expected document.domain value
		 */
		pickDocumentDomain: function() {
			var da = location.hostname.split('.'), len = da.length;
			var deep = arguments[0]|| (len<3?0:1);
			if (deep>=len || len-deep<2)
				deep = len-2;
			return da.slice(deep).join('.');
		}
	}
})();