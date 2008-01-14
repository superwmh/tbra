/**
 * @author xiaoma<xiaoma@taobao.com>
 */

/**
	config ����˵��

	position: {String} [left|right|top|bottom]
	autoFit: {Boolean} �Ƿ�����Ӧ����
	width: {Number} popup width 
	height: {Number} popup height
	offset: {Array} offset
	eventType: {String} [mouse|click] ����ƶ��������ǵ������
	disableClick: {Boolean}
	delay: {Number} ����ƶ�����ʱ���ӳ�
	onShow: {function} ��ʾ�ص�����
	onHide: {Function} ���ػص�����
 */
	
TB.widget.SimplePopup = new function() {
	var Y = YAHOO.util;
	var popupShowTimeId, popupHideTimeId;

	var defConfig = {
		position: 'right',
		autoFit: true,
		eventType: 'mouse',
		delay: 0.2,
		disableClick: true,  /* stopEvent when eventType = mouse */
		width: 200,
		height: 200		
	};
	
	/** �ж�p�Ƿ����c **/
	var checkContains = function(p, c) {
		if (p.contains && c!=null)
			return p.contains(c);
		else {
			while (c) {
				if (c == p) return true;
				c = c.parentNode;
			}
			return false;
		}
	}
	
	/**
	 * �¼�������
	 * scope is handle
	 * @param {Object} ev
	 */	
	var triggerClickHandler = function(ev) {
		var target = $E.getTarget(ev);
		if (triggerClickHandler._target == target) {
			this.popup.style.display == 'block'? this.hide() : this.show();
		} else {
			this.show();
		}
		$E.preventDefault(ev);
		triggerClickHandler._target = target;
	}
	var triggerMouseOverHandler = function(ev) {
		clearTimeout(popupHideTimeId);
		var self = this;
		popupShowTimeId = setTimeout(function(){
			self.show();
		}, this.config.delay * 1000);
		if (this.config.disableClick && !this.trigger.onclick) {
			this.trigger.onclick = function(e) {
				$E.preventDefault($E.getEvent(e));
			};
		}			
	}
	
	var popupMouseOverHandler = function(ev) {
		clearTimeout(popupHideTimeId);
		$E.preventDefault(ev);		
	}

	var mouseOutHandler = function(ev) {
		clearTimeout(popupShowTimeId);
		$E.preventDefault(ev);
		if (!checkContains(this.popup, $E.getRelatedTarget(ev))){
			this.delayHide();
		}
	}
	
	this.decorate = function(trigger, popup, config) {
		if (YAHOO.lang.isArray(trigger) || (YAHOO.lang.isObject(trigger) && trigger.length)) {
			/* batch����ʱ���ڼ򵥿��ǣ�������handle object */
			for (var i = 0; i < trigger.length; i++) {
				this.decorate(trigger[i], popup, config);
			}
			return;
		}
		
		trigger = $(trigger);
		popup = $(popup);
		if (!trigger || !popup) return;
		config = TB.applyIf(config||{}, defConfig);
		/* ���ظ������ߵĿ�������ֻ�����Ե����߿ɼ��ķ���/���� */		
		var handle = {};		

		var onShowEvent = new Y.CustomEvent("onShow", handle, false, Y.CustomEvent.FLAT);
		if (config.onShow) {
			onShowEvent.subscribe(config.onShow);	
		}
		var onHideEvent = new Y.CustomEvent("onHide", handle, false, Y.CustomEvent.FLAT);
		if (config.onHide) {
			onHideEvent.subscribe(config.onHide);	
		}			

		if (config.eventType == 'mouse') {
			$E.on(trigger, 'mouseover', triggerMouseOverHandler, handle, true);
			$E.on(trigger, 'mouseout', mouseOutHandler, handle, true);
			/* batch ����ʱ��Popup ������¼�ֻע��һ�� */
			if (!$E.getListeners(popup, 'mouseover')) {
				$E.on(popup, 'mouseover', popupMouseOverHandler);
			}
			if (!$E.getListeners(popup, 'mouseout')) {
				$E.on(popup, 'mouseout', mouseOutHandler, handle, true);
			}		
		}
		else if (config.eventType == 'click') {
			$E.on(trigger, 'click', triggerClickHandler, handle, true);
		}

		TB.apply(handle, {
			popup: popup,
			trigger: trigger,
			config: config,
			show: function() {
				this.hide();
				var pos = $D.getXY(this.trigger);
				if (YAHOO.lang.isArray(this.config.offset)) {
					pos[0] += parseInt(this.config.offset[0]);
					pos[1] += parseInt(this.config.offset[1]);
				}
				var tw = this.trigger.offsetWidth, th = this.trigger.offsetHeight;
				var pw = config.width, ph = config.height;
				var dw = $D.getViewportWidth(), dh = $D.getViewportHeight();
                var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
				var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
				
				var l = pos[0], t = pos[1];
				if (config.position == 'left') {
					l = pos[0]-pw;
				}
				else if (config.position == 'right') {
					l = pos[0]+tw;
				} else if (config.position == 'bottom') {
					t = t+th;
				} else if (config.position == 'top') {
					t = t-ph;
					if (t < 0) t = 0;
				}
				
				if(this.config.autoFit) {
					if (t-st+ph > dh) {
						t = dh-ph+st-2; /* 2px ƫ�� */
						if (t < 0) {
							t = 0;
						}
					}
				}
					
				this.popup.style.position = 'absolute';
				this.popup.style.top = t + 'px';
				this.popup.style.left = l + 'px';
				if (this.config.effect) {
					if (this.config.effect == 'fade') {
						this.popup.style.display = 'block';
						$D.setStyle(this.popup, 'opacity', 0);
						var anim = new Y.Anim(this.popup, { opacity: {to: 1} }, 0.4);
						anim.animate();
					}
				} else {
					this.popup.style.display = 'block';
				}
				onShowEvent.fire();					
			},
			hide: function() {
				this.popup.style.display = 'none';
				onHideEvent.fire();
			},
			delayHide: function() {
				var self = this;
		        popupHideTimeId = setTimeout(function(){
					self.hide();
				}, this.config.delay*1000);
			}			
		});
		
		$D.setStyle(popup, 'display', 'none');

		return handle;		
	}
}
	
