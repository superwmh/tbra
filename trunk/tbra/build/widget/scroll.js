/**
 * @author xiaoma
 */
/** �򵥹��� */
TB.widget.SimpleScroll = new function() {
	
	var Y = YAHOO.util;	
 	var defConfig = {
		delay: 2,
		speed: 20,
		startDelay: 2,
		scrollItemCount: 1  /** ��ͬһ�й�����li������Ĭ��1 */		
	}
	/**
	 * container ������һ�� ul
	 * @param {Object} container
	 * @param {Object} config
	 */
	this.decorate = function(container, config) {
		container = $(container);
		config = TB.applyIf(config||{}, defConfig);
		/* ���ظ������ߵĿ�������ֻ�����Ե����߿ɼ��ķ���/���� */	
		var handle = {};
		
		var scrollTimeId = null, pause = false;
		var onScrollEvent = new Y.CustomEvent("onScroll", handle, false, Y.CustomEvent.FLAT);
		if (config.onScroll) {
			onScrollEvent.subscribe(config.onScroll);
		} else {
			onScrollEvent.subscribe(function() {
				for (var i = 0; i < config.scrollItemCount; i++) {
					container.appendChild(container.getElementsByTagName('li')[0]);
				}
			});
		}
		
		var scroll = function() {
			if (pause) return;
			container.scrollTop += 2;
			var lh = config.lineHeight || container.getElementsByTagName('li')[0].offsetHeight;
			if (container.scrollTop % lh <= 1) {
				clearInterval(scrollTimeId);
				onScrollEvent.fire();
				container.scrollTop = 0;					
				setTimeout(start, config.delay*1000);
			}			
		}
		
		var start = function() {
			var lh = config.lineHeight || container.getElementsByTagName('li')[0].offsetHeight;
			if (container.scrollHeight - container.offsetHeight >= lh)
				scrollTimeId=setInterval(scroll, config.speed);
		}

		$E.on(container, 'mouseover', function(){pause=true;});
		$E.on(container, 'mouseout', function(){pause=false;});
		setTimeout(start, config.startDelay*1000);

		TB.apply(handle, {
			subscribeOnScroll: function(func, override) {
				if (override === true && onScrollEvent.subscribers.length > 0)
					onScrollEvent.unsubscribeAll();
				onScrollEvent.subscribe(func);
			}
		});
		handle.onScroll = handle.subscribeOnScroll;
		return handle;
	}
};