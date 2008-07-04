TB.form.Validation = new function() {
	var Y = YAHOO;
	var _ = this;

	//Ĭ������
	var defConfig = {
		useTitle: true,						//ʹ�ñ����title��Ϣ��Ϊ��ʾ����
		immediate: false,					//�Ƿ�ʱУ�飬ͨ��ע������ onblur �¼�
		focusOnError: true,					//ѡ���׸�У��ʧ�ܵı���
		passedClass: 'tb-fv-passed',		//У��ɹ��������ӵ� className
		failedClass: 'tb-fv-failed',		//У��ʧ�ܸ������ӵ� className
		onFieldValidate: false,				//����У���Ļص�����
		beforeValidate: false,				//У��ǰ�Ļص�����
		onValidate: false,					//��У���Ļص�����
		advice: 'default',					//������Ϣ֪ͨ����
		adviceClass: 'tb-fv-advice',		//У����Ϣ֪ͨ��� class
		adviceContainerClass: null,			//У����Ϣ֪ͨ��ĸ������� class�� ��ʱ֪ͨ��ͱ�����ͬһ��parentNode
		adviceMsgClass: 'tb-fv-advicemsg',	//У����Ϣ֪ͨ���з���Ϣ�ı�ǩ class����ʱ֪ͨ����ܰ���������ǩ
		attachEvent: true					//�Ƿ�ע�� onSubmit �� onReset �¼���Ĭ��Ϊ true ��ֻ�о�̬����ʱΪfalse
	};

	//У��������
	var Validator = function(clazz, warnMsg, test, rules) {
		if (Y.lang.isFunction(test)) { //������������У�鷽�������ĸ�������У�����
			this._test = test;
			this._rules = rules;
		} else if (Y.lang.isObject(test)) { //��������������У�����
			this._rules = test;
		}
		this.warnMsg = warnMsg || 'Validation failed!';
	}
	
	//��չУ��������ԭ��
	Y.lang.augmentObject(Validator.prototype, {
		_test: function() {return true;},
		_testRules: function(val, el) {
			var ra = [];
			for (var r in this._rules) {
				if (_.METHODS[r] && !_.METHODS[r](val, el, this._rules[r])) {
					return false;
				}
			}
			return true;
		},
		test: function(val, el) {
			return this._test(val, el) && this._testRules(val,el);
		}
	});


	_.ADVISORS = {
		'default': {
			__advices: {},
			getAdvice: function(el) {
				var id = $D.generateId(el, 'fv:field'); //�������Ƿ�ӵ��id���ԣ����û�У���������id (��ʽΪ fv:field0, fv:field1....)�����������id�����ظ�id.
				var advice;
				//���ȴ�cache��Ѱ��
				if (id in this.__advices)
					advice = this.__advices[id];
				else {
					var aid = (el.id || el.name) + '-advice'; //ƴ��advice��id
					advice = $(aid); //���ҳ���д��ڸ�id��<div>��ʹ������Ϊadvice
					if (!advice) {
						//��������� adviceContainerClass�����ݸ�class�ҵ�����������Ϊ������ܴ��ڶ��Ƕ��(��<table>����<div>��)����advice����Ҫ����ʾ�ڸ�����ָ����
						var container = this.adviceContainerClass? $D.getAncestorByClassName(el, this.adviceContainerClass) : el.parentNode;
						advice = $D.getElementsByClassName(this.adviceClass, 'div', container)[0];
						if (advice && advice.id && advice.id != aid) { advice = null; } //��������ͬparentNodeʱ�����⸲��
						if (!advice) {
							//����advice
							advice = document.createElement('div');
							$D.addClass(advice, this.adviceClass);
							if (this.adviceContainerClass) {
								container.appendChild(el);
							} else {
								//��advice��ʾ�ڽ������ĺ���
								switch (el.type.toLowerCase()) {
									//checkbox �� radio ��ʾ�ڸ�Ԫ�ص������
									case 'checkbox':
									case 'radio':
										el.parentNode.appendChild(advice, el);
										break;
									default:
										TB.dom.insertAfter(advice, el);
								}
							}
						}
						advice.id = aid;
					}
					
					this.__advices[id] = advice;
				}
				return advice;				
			},
			doFieldAdvice: function(ret, el, warnMsg) {
				var advice = this.getAdvice(el);
				if (!advice) return;
				if (!ret) {
					var msgbox = advice;
					//���ָ���˷���Ϣ��ʾ��������class�����ٴ�advice�����ҵ�ָ��������
					if (this.adviceMsgClass)
						msgbox = $D.getElementsByClassName(this.adviceMsgClass, '*', advice)[0] || advice;
					
					msgbox.innerHTML = warnMsg;
					$D.setStyle(advice, 'display', '');
				} else {
					$D.setStyle(advice, 'display', 'none');
				}
			},
			showAdvices: function(ret) {
				return;
			},
			resetAdvices: function() {
				for (var a in this.__advices) {
					$D.setStyle(this.__advices[a], 'display', 'none');
				}
			}
		},
		'alert': {
			__msgs: [],
			doFieldAdvice: function(ret, el, warnMsg) {
				if (!ret) {
					if (this.immediate) 
						alert(warnMsg);
					else
						this.__msgs[this.__msgs.length] = warnMsg;
				}
			},
			showAdvices: function(ret) {
				if (!ret && !this.immediate) {
					alert(' * ' + this.__msgs.join('\n * '));
				}
				this.resetAdvices();
			},
			resetAdvices: function() {
				this.__msgs.length = 0;	
			}
		}
	}

	_.METHODS = {
		//Ϊ��
		isEmpty: function(val, el) {return ((val == null) || (val.length == 0))},
		//��Ϊ��
		notEmpty: function(val, el) {return !((val == null) || (val.length == 0))},
		//������ʽ
		regexp : function(val,el,opt) {return opt.test(val)},
		//��С����
		minLength : function(val,el,opt) {return val.length >= opt},
		//��󳤶�
		maxLength : function(val,el,opt) {return val.length <= opt},
		//��Сֵ
		minValue : function(val,el,opt) {return val >= parseFloat(opt)}, 
		//���ֵ
		maxValue : function(val,el,opt) {return val <= parseFloat(opt)},
		//����������
		notOneOf : function(val,el,opt) {return TB.common.toArray(opt).every(function(v) {
			return val != v;
		})},
		//����֮һ
		oneOf : function(val,el,opt) {return TB.common.toArray(opt).some(function(v) {
			return val == v;
		})},
		//����
		equal : function(val,el,opt) {return val == opt},
		//������
		notEqual : function(val,el,opt) {return val != opt},
		//����ĳ�������ֵ
		equalToField : function(val,el,opt) {return val == $(opt).value},
		//������ĳ�������ֵ
		notEqualToField : function(val,el,opt) {return val != $(opt).value}
	}

	/**
	 * У����Map
	 */
	_.VALIDATORS = {};

	/**
	 * �����Ƿ�ɼ� (style.display != none)
	 */
	var _isVisible = function(el) {
		while(el.tagName != 'BODY') {
			if($D.getStyle(el, 'display') == 'none') return false;
			el = el.parentNode;
		}
		return true;
	}
	
	/**
	 * ȡ�ÿɼ��Ҿ߱�У��hook(class=fv:xxx)�ı��򼯺�
	 */
	var _getElements = function(frm) {
		var tags = ['INPUT', 'SELECT', 'TEXTAREA'];
		return $D.getElementsBy(function(f) {
			return $D.hasClass(f, 'fv:force') || ((tags.indexOf(f.tagName) != -1) && _isVHook(f.className) && _isVisible(f));
		}, '*', frm);
	}

	/**
	 * className ���Ƿ���� fv:xxx ��ʽ��class
	 */
	var _isVHook = function(c) {
		return c.indexOf('fv:') != -1;		
	}

	/**
	 * ��̬�ļ��麯��
	 */
	var _validate = function(frm, handle) {
		var els = _getElements(frm);
		var result = $D.batch(els, _validateField, handle).every(function(r){return r});
		handle.showAdvices(result);

		//������� focusOnError=true�� ѡ�е�һ��У��ʧ�ܱ���
		if (!result && handle.focusOnError) {
			var fel = $D.getElementsByClassName(handle.failedClass, '*', frm)[0];
			try {
				fel.focus();
				fel.select(); //select ������<select>��Ч
			} catch (e) {}
		}

		//ִ����������У���ص�����
		if (handle.onValidate) {
			handle.onValidate(result, frm);
		}
		return result;
	}
	
	var _validateField = function(el, handle) {
		var hooks = el.className.split(/\s+/).filter(_isVHook);  //�õ�����fv:xxx hook
		var result = hooks.every(function(h) {
			//����hookȡ�ö�ӦУ��������
			var validator = (handle.validators)? (handle.validators[h] || _.VALIDATORS[h]) : _.VALIDATORS[h]; 
			if (!validator) return true;
			//ִ��У�飬���õ����
			if (el.getAttribute('fv:params')) {
				validator = Y.lang.merge(validator, {
					_rules: el.getAttribute('fv:params').toQueryParams()
				});
			}
			var ret = validator.test(el.value, el);
			var msg; 
			if (!ret) {
				//ȡ����ʾ��Ϣ
				msg = handle.useTitle ? (el.title || validator.warnMsg) : validator.warnMsg;
				$D.removeClass(el, handle.passedClass);
				$D.addClass(el, handle.failedClass);
			} else {
				$D.removeClass(el, handle.failedClass);
				$D.addClass(el, handle.passedClass);
			}

			handle.doFieldAdvice(ret, el, msg);
			return ret;
		}, _);
		//ִ�б���У���Ļص�����
		if (handle.onFieldValidate) {
			handle.onFieldValidate(result, el);
		} 
		return result;
	}

	var _reset = function(frm, handle) {
		var els = _getElements(frm);
		$D.removeClass(els, handle.failedClass);
		$D.removeClass(els, handle.passedClass);
		if (handle.resetAdvices)
			handle.resetAdvices();
	}

	/**
	 * ��̬����
	 * @param {Object} frm
	 * @param {Object} config
	 */
	_.validate = function(frm, config) {
		return this.attach(frm, Y.lang.merge(config || {}, {
			attachEvent: false,
			immediate: false
		})).validate();
	}

	/**
	 * ����ȫ��У����
	 */
	_.add = function(clazz, warnMsg, test, rules) {
		this.validators[clazz] = new Validator(clazz, warnMsg, test, rules);
	}

	/**
	 * ��������ȫ��У����
	 */
	_.addAll = function(validators) {
		var vs = {};
		validators.forEach(function(v) {
			vs[v[0]] = new Validator(v[0], v[1], v[2], (v.length > 3 ? v[3] : {}));
		});
		Y.lang.augmentObject(_.VALIDATORS, vs);	
	}

	/**
	 * ��ָ��������У�鹦�ܣ�ͨ��ע����� onsubmit �¼����ڱ��ύʱִ��У��
	 * ���ʹ�ýű����� form.submit() ��������ô onsubmit �¼����ᴥ������Ҫ�ֹ��ȵ���
	 *  TB.form.Validation.validate(form);
	 */
	_.attach = function(frm, config) {
		frm = $(frm);
		var handle = Y.lang.merge(defConfig, config||{});
		handle.form = frm;
		handle.validators = {};

		if (Y.lang.isString(handle.advice)) {
			var type = (handle.advice in _.ADVISORS)? handle.advice : 'default';
			Y.lang.augmentObject(handle, _.ADVISORS[type]);
		} else {
			Y.lang.augmentObject(handle, handle.advice);
		}
		
		var onSubmit = function(ev) {
			if (!handle.validate())
				$E.stopEvent(ev);
		}

		var onReset = function(ev) {
			handle.reset();
		}
	
		handle.add = function(clazz, warnMsg, test, rules) {
			this.validators[clazz] = new Validator(clazz, warnMsg, test, rules);
		}

		handle.addAll = function(validators) {
			var vs = {};
			validators.forEach(function(v) {
				vs[v[0]] = new Validator(v[0], v[1], v[2], (v.length > 3 ? v[3] : {}));
			});
			Y.lang.augmentObject(this.validators, vs);
		}

		handle.reset = function() {
			_reset(frm, handle);
		}
		
		handle.validate = function(){
			if (Y.lang.isFunction(handle.beforeValidate) && !handle.beforeValidate(frm))
				return false;
			else
				return _validate(frm, handle);
		};

		if (handle.attachEvent) {
			$E.on(frm, 'submit', onSubmit);
			$E.on(frm, 'reset', onReset);
		}
		
		if (handle.immediate) {
			var els = _getElements(frm);
			$E.on(els, 'blur', function() {
				_validateField(this, handle);
			});
		}

		return handle;
	}

	var _isEmpty = _.METHODS['isEmpty'];

	/** 
	 * ��������Ĭ�ϵ�У����
	 */
	_.addAll([
		['fv:required', '���������ݣ�', function(v) {
				return !_isEmpty(v);
		}],
		//����
		['fv:number', '������һ����Ч�����֣�', function(v) {
			return _isEmpty(v) || (!isNaN(v) && !/^\s+$/.test(v));
		}],
		//����
		['fv:digits', '��������Ч��������', function(v) {
			return _isEmpty(v) ||  !/[^\d]/.test(v);
		}],
		//��ĸ
		['fv:alpha', '������Ӣ����ĸ��', function (v) {
			return _isEmpty(v) ||  /^[a-zA-Z]+$/.test(v);
		}],
		//���ּ���ĸ
		['fv:alphanum', '������Ӣ����ĸ�����֣�', function(v) {
			return _isEmpty(v) ||  !/\W/.test(v);
		}],
		//�������ڸ�ʽ yyyy-MM-dd�� ��У�����ںϷ���
		['fv:date', '��������Ч��ʱ�䣡', function(v) {
			return _isEmpty(v) || /^\d{4}-(?:[0]?)\d{1,2}-(?:[0]?)\d{1,2}$/.test(v);
		}],
		//�й��ֻ�����
		['fv:mobile', '��������Ч���ֻ����룡', function(v) {
			return _isEmpty(v) || /^(86)*0*1[3|5]\d{9}$/.test(v);
		}],
		//�й��ʱ�
		['fv:postcode', '��������Ч���������룡', function(v) {
			return _isEmpty(v) || /^[1-9]{1}(\d+){5}$/.test(v);
		}],
		//Email��ַ
		['fv:email', '��������Ч��Email��ַ��', function (v) {
			return _isEmpty(v) || /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/.test(v);
		}],
		//URL
		['fv:url', '��������Ч��URL��', function(v) {
			return _isEmpty(v) || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(v);
		}],
		//�Ƿ�ѡ�� for <select>
		['fv:selection', '��ѡ��һ��ѡ�', function(v, el){
			return el.options ? el.selectedIndex > 0 : !_isEmpty(v);
		}],
		//�Ƿ�ѡ�� for <input type=radio|checkbox />
		['fv:oneRequired', '��ѡ������һ��ѡ�', function (v,el) {
			var name = el.name;
			var group = el.form.elements[name];
			if (group.length) {
				return TB.common.toArray(group).some(function(o) {
					return o.checked;
				});
			} else {
				return group.checked;
			}
		}]
	]);

}

