/* ��Tab�л� */
TB.widget.SimpleTab = new function() {
	var Y = YAHOO.util;
	var defConfig = {
		eventType: 'click',
		currentClass: 'Current',  /* li ��ǰѡ��״̬ʱ��className */
		tabClass: '',  /* ��Ϊ tab ��element�� className */
		autoSwitchToFirst: true,  /* �Ƿ�Ĭ��ѡ�е�һ��tab */
		stopEvent: true,  /* ֹͣ�¼����� */
		delay: 0.2  /* available when eventType=mouse */
	};
	var getImmediateDescendants = function(p) {
		var ret = [];
		if (!p) return ret;
		for (var i = 0, c = p.childNodes; i < c.length; i++) {
			if (c[i].nodeType == 1)
				ret[ret.length] = c[i];
		}
		return ret;	
	};
	this.decorate = function(container, config) {
		container = $(container);
		config = TB.applyIf(config||{}, defConfig);
		/* ���ظ������ߵĿ�������ֻ�����Ե����߿ɼ��ķ���/���� */		
		var handle = {};
	
		var tabPanels = getImmediateDescendants(container);
		var tab = tabPanels.shift(0);
		var tabTriggerBoxs  = tab.getElementsByTagName('li');
		var tabTriggers, delayTimeId;
		if (config.tabClass) {
			tabTriggers = $D.getElementsByClassName(config.tabClass, '*', container);
		} else {
			tabTriggers = TB.common.toArray(tab.getElementsByTagName('a')); /* Ĭ��ȡtab�µ�<a> */
		}
		var onSwitchEvent = new Y.CustomEvent("onSwitch", null, false, Y.CustomEvent.FLAT);
		if (config.onSwitch) {
			onSwitchEvent.subscribe(config.onSwitch);
		}

		var focusHandler = function(ev) {
			if (delayTimeId)
				cacelHandler();
			var idx = tabTriggers.indexOf(this);
			handle.switchTab(idx);
			onSwitchEvent.fire(idx);
			if (config.stopEvent) {
				try {
					$E.stopEvent(ev);
				}catch (e) {
					/* ignore */
				}
			}
			return !config.stopEvent;
		}
		var delayHandler = function(ev) {
			var target = this;
			delayTimeId = setTimeout(function(){
				focusHandler.call(target, ev);
			}, config.delay*1000);
			if (config.stopEvent)
				$E.stopEvent(ev);
			return !config.stopEvent;
		}
		var cacelHandler = function() {
			clearTimeout(delayTimeId);
		}		
		for (var i = 0; i < tabTriggers.length; i++) {
			$E.on(tabTriggers[i], 'focus', focusHandler);
			if (config.eventType == 'mouse') {
				$E.on(tabTriggers[i], 'mouseover', config.delay?delayHandler:focusHandler);
				$E.on(tabTriggers[i], 'mouseout', cacelHandler);
			} 
			else {
				$E.on(tabTriggers[i], 'click', focusHandler);
			}
		}

		/* ���幫���ķ��� */
		TB.apply(handle, {
			switchTab: function(idx) {
				$D.setStyle(tabPanels, 'display', 'none');
				$D.removeClass(tabTriggerBoxs, config.currentClass);
				$D.addClass(tabTriggerBoxs[idx], config.currentClass);
				$D.setStyle(tabPanels[idx], 'display', 'block');
			},
			subscribeOnSwitch: function(func) {
				onSwitchEvent.subscribe(func);
			}
		});
		handle.onSwitch = handle.subscribeOnSwitch;
		
		/*��ʼ������*/
		$D.setStyle(tabPanels, 'display', 'none');
		if (config.autoSwitchToFirst)
			handle.switchTab(0);
		
		/* ���ز������� */
		return handle;
	}
};