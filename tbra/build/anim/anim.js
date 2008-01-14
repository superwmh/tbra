/**
 * @fileOverview TB.anim ����YAHOO.util.Anim��װ�Ķ���Ч��
 * @name TB.anim
 * @example
	new TB.anim.Highlight(el, {
		startColor: '#ffff99'
	}).animate();
 */
 
/**
 * @constructor
 * @param {Object} el Ӧ�ö�����Ԫ��
 * @param {Object} [config]  ���ò���
 */	
TB.anim.Highlight = function(el, config) {
	if (!el) return;
	this.init(el, config)
}

/**
 * Ĭ������
 */
TB.anim.Highlight.defConfig = {
	/** ������ʼʱ���õı���ɫ*/
	startColor: '#ffff99',
	/** ����ʱ�� */
	duration: .5,
	/** �Ƿ񱣳�ԭ�ȵı��� */
	keepBackgroundImage: true
};

TB.anim.Highlight.prototype.init = function(el, config) {
	var Y = YAHOO.util;
	config = TB.applyIf(config||{}, TB.anim.Highlight.defConfig);

	var attr = {backgroundColor: {from: config.startColor}};
	var anim =	new Y.ColorAnim(el, attr, config.duration);
	var originBgColor = anim.getAttribute('backgroundColor');
	anim.attributes['backgroundColor']['to'] = originBgColor;

	if (config.keepBackgroundImage) {
		var originBg = $D.getStyle(el, 'background-image');
		anim.onComplete.subscribe(function() {
			$D.setStyle(el, 'background-image', originBg);
		});
	}
	
	/**
	 * onComplete �ص���ֱ�����ñ���װ�� Anim ����� onComplete �¼�
	 */	
	this.onComplete = anim.onComplete;
	
	/**
	 * ִ�ж���
	 */
	this.animate = function() {
		$D.setStyle(el, 'background-image', 'none');
		anim.animate();
	}
};

