/**
 * @author zexin.zhaozx
 */
TB.form.TagAssistor = new function() {
	
	/**
	 * Ĭ�����ò���
	 */
	var defConfig = {
		separator: ' ', /*Ĭ�Ϸָ����ǿո�*/
		selectedClass: 'Selected'
	}
	
	/**
	 * �ж�ѡ�е�tag�Ƿ���array�д��ڣ�������ڷ���true����֮false��
	 * @param {Object} tagArr
	 * @param {Object} tagEl
	 */
	var tagExists = function(tagArr, tagEl) {
		return tagArr.indexOf(TB.common.trim(tagEl.innerHTML)) != -1;
	}
	
	var value2TagArray = function(textField, separator) {
		/*�������Ŀո��滻Ϊ�����ո񣬲�ȥ����β�Ŀո�*/
		var val = textField.value.replace(/\s+/g, ' ').trim();
		if (val.length > 0)
			return val.split(separator);
		else
			return [];
	}
	
	/**
	 * ָ�ɸ�����Ԫ�غͱ�ѡtag������
	 * @param {Object} textField ������һ��<input>����<textarea>
	 * @param {Object} tagsContainer ���ñ�ѡtag��element��������һ��ul��dl
	 * @param {Object} config ���ò���
	 */
	this.attach = function(textField, tagsContainer, config) {
		textField = $(textField);
		tagsContainer = $(tagsContainer);
		config = TB.applyIf(config || {}, defConfig);
		
		
		var triggers = TB.common.toArray(tagsContainer.getElementsByTagName('a'));		
		
		/**
		 * �����ѡtag���¼��������
		 * @param {Object} ev
		 */
		var clickHandler = function(ev) {
			var tagArray = value2TagArray(textField, config.separator);
			var target = $E.getTarget(ev);
			/* tag��ѡ�� */
			if (tagExists(tagArray, target)) {
				tagArray.remove(TB.common.trim(target.innerHTML));
			} else {
				tagArray.push(TB.common.trim(target.innerHTML));
			}
			updateClass(tagArray);
			textField.value = tagArray.join(config.separator);
		}
		
		var updateClass = function(tagArray) {
			triggers.forEach(function(o, i) {
				if (tagExists(tagArray, o)) {
					$D.addClass(o, config.selectedClass);
				} else {
					$D.removeClass(o, config.selectedClass);
				}						
			})						
		}
		
		var handle = {};
		/**
		 * ��ʼ����һЩ����
		 */
		handle.init = function() {
			var tagArray = value2TagArray(textField, config.separator);

			/* ��ÿ��	��ѡtag��<a> ע���¼�������� */
			triggers.forEach(function(o, i){
				if (tagExists(tagArray, o)) {
					$D.addClass(o, config.selectedClass);
				}
				$E.on(o, 'click', clickHandler);
			});
			
			/* ���ÿ�εļ��̶������������ƥ����߲�ƥ���tag���֣����ӻ�ȡ������Ч�� */
			$E.on(textField, 'keyup', function(ev){
				var tagArray = value2TagArray(textField, config.separator);
				updateClass(tagArray);				
			});
		}
		handle.init();
	}
}
