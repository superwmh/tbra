/**
 * @author zexin.zhaozx
 */
TB.form.CheckboxGroup = new function() {
	var Y = YAHOO.util;
	var defConfig = {
		checkAllBox: 'CheckAll',
		checkAllBoxClass: 'tb:chack-all',
		checkOnInit: true /* ��ʼ��ʱ�Ƿ�Ԥ���� */
	}
	var getChecked = function(o, i) { return o.checked;	}
	var setChecked = function(o, i) {
		if (o.type && o.type.toLowerCase()=='checkbox')
			o.checked = true; 
	}
	var setUnchecked = function(o, i) {
		if (o.type && o.type.toLowerCase()=='checkbox')
			o.checked = false; 
	}
	
	this.attach = function(checkboxGroup, config) {
		config = TB.applyIf(config || {}, defConfig);
		/*���ظ������ߵĿ�������ֻ�����Ե����߿ɼ��ķ���/����*/	
		var handle = {};
		var onCheckEvent = new Y.CustomEvent('onCheck', handle, false, Y.CustomEvent.FLAT);			
	
		var checkboxes = [];
		if (checkboxGroup) {
			if(checkboxGroup.length)
				checkboxes = TB.common.toArray(checkboxGroup);
			else
				checkboxes[0] = checkboxGroup; /*���ֻ��һ��checkbox*/		
		}
		
		var checkAllBoxes = [];
		if (config.checkAllBoxClass) {
			checkAllBoxes = $D.getElementsByClassName(config.checkAllBoxClass, null, checkboxes[0].form);
		}
		if ($(config.checkAllBox)) {
			checkAllBoxes.push($(config.checkAllBox));
		}
 
		var doCheck = function() {
			var checkedBoxes = checkboxes.filter(getChecked);
			if (checkboxes.length == 0) {
				checkAllBoxes.forEach(setUnchecked);
			} else {
				checkAllBoxes.forEach((checkedBoxes.length == checkboxes.length)?setChecked:setUnchecked);
			}			
			handle._checkedBoxCount = checkedBoxes.length;
		}		
		var clickHandler = function(ev) {
			var checkbox = $E.getTarget(ev);
			doCheck();
			onCheckEvent.fire(checkbox);
			return true;
		}

		TB.apply(handle, {
			_checkedBoxCount : 0,
			
			onCheck: function(func) {
				onCheckEvent.subscribe(func);
			},
			
			isCheckAll: function() {
				return this._checkedBoxCount == checkboxes.length;				
			},
			isCheckNone: function() {
				return this._checkedBoxCount == 0;
			},
			isCheckSome: function() {
				return this._checkedBoxCount != 0;
			},
			isCheckSingle: function() {
				return this._checkedBoxCount == 1;
			},
			isCheckMulti: function() {
				return this._checkedBoxCount > 1;
			},			
			toggleCheckAll: function() {
				var allChecked = checkboxes.every(getChecked);
				checkboxes.forEach(allChecked?setUnchecked:setChecked);
				if (checkboxes.length == 0) {
					checkAllBoxes.forEach(setUnchecked);
				} else {
					checkAllBoxes.forEach(allChecked?setUnchecked:setChecked);
				}
				handle._checkedBoxCount = (allChecked)?0:checkboxes.length;
				checkboxes.forEach(function(o){
					onCheckEvent.fire(o);
				});
			},
			toggleChecked: function(checkbox) {
				checkbox.checked = !checkbox.checked;
				doCheck();
				onCheckEvent.fire(checkbox);
			},
			getCheckedBoxes: function() {
				return checkboxes.filter(getChecked);
			}
		});

		$E.on(checkboxes, 'click', clickHandler);
		if (config.onCheck && YAHOO.lang.isFunction(config.onCheck)) 
			onCheckEvent.subscribe(config.onCheck, handle, true);
		if (checkAllBoxes.length > 0) {
			$E.on(checkAllBoxes, 'click', handle.toggleCheckAll);
		}
		if (config.checkOnInit) {
			doCheck();
			var checkOnInit = function() {
				checkboxes.forEach(function(o){
					onCheckEvent.fire(o);
				});
			}
			setTimeout(checkOnInit, 10);
		}
		return handle;
	}	 
}