TB.util.Pagination = new function() {
	
	var PAGE_SEPARATOR = '...'; //ҳʡ�Է���	

	//Ĭ�����ò���	
	var defConfig = {
		pageUrl: '',
		prevPageClass: 'PrevPage',  //��һҳ<li>��className
		noPrevClass: 'NoPrev',       //��һҳ������ʱ<li>��className
		prevPageText: 'prevPageText',
		nextPageClass: 'NextPage',  //��һҳ<li>��className
		nextPageText: 'nextPageText',
		noNextClass: 'NoNext',       //��һҳ������ʱ<li>��className		
		currPageClass: 'CurrPage',  //��ǰҳ<li>��className
		pageParamName: 'page',		//��ʶҳ���Ĳ�����
		appendParams: '',   //���������Ĳ���
		pageBarMode: 'bound',  //��ҳ������ʽ  bound | eye | line
		showIndicator: true,   //��ʾ������ʾͼ��,
		cachePageData: false  //�����ҳ����
	}
	
	/**
	 * ֹͣclick�¼�������������/��һҳ������ʱ�����߷�ҳ���ݼ�����ʱ���з�ҳ�㶼������ʱ
	 * @param {Object} ev  �¼�����
	 */
	var cancelHandler = function(ev) {
		$E.stopEvent(ev);
	}
	
	/**
	 * ��ҳ����¼��������
	 * @param {Object} ev  	 �¼�����
	 * @param {Object} args  ������ʽΪ [pageIndex, handle]
	 */
	var pageHandler = function(ev, args) {
		$E.stopEvent(ev);
		var target = $E.getTarget(ev);
		args[1].gotoPage(args[0]);
	}
	
	/**
	 * ����"bound"��ʽ�ķ�ҳ�б�
	 * @param {Object} pageIndex  ��ǰҳ
	 * @param {Object} pageCount  ��ҳ��
	 */
	var buildBoundPageList = function(pageIndex, pageCount) {
        var l = [];
        var leftStart = 1;
        var leftEnd = 2;
        var mStart = pageIndex - 2;
        var mEnd = pageIndex + 2;
        var rStart = pageCount - 1;
        var rEnd = pageCount;

        if (mStart <= leftEnd) {
            leftStart = 0;
            leftEnd = 0;
            mStart = 1;
        }

        if (mEnd >= rStart) {
            rStart = 0;
            rEnd = 0;
            mEnd = pageCount;
        }

        if (leftEnd > leftStart) {
            for (var i = leftStart; i <= leftEnd; ++i) {
            	l[l.length] = ""+i;
            }

            if ((leftEnd + 1) < mStart) {
            	l[l.length] = PAGE_SEPARATOR;
            }
        }

        for (var i = mStart; i <= mEnd; ++i) {
        	l[l.length] = ""+i;
        }

        if (rEnd > rStart) {
            if ((mEnd + 1) < rStart) {
            	l[l.length] = PAGE_SEPARATOR;
            }

            for (var i = rStart; i <= rEnd; ++i) {
            	l[l.length] = ""+i;
            }
        }
        return l;
	}
	
	/**
	 * ��������ҳ����<li> element
	 * @param {Object} idx   ҳ��
	 * @param {Object} config
	 */
	var buildPageEntry = function(idx, config) {
		var liEl = document.createElement('li');
		if (idx != PAGE_SEPARATOR) {
			$D.addClass(liEl, (idx=='prev')?config.prevPageClass:(idx=='next')?config.nextPageClass:'');
			var aEl = document.createElement('a');
			aEl.setAttribute('title',(idx == 'prev')?$M(config.prevPageText):(idx=='next')?$M(config.nextPageText):''+idx);
			aEl.href = buildPageUrl(idx, config) + '&t=' + new Date().getTime();
			aEl.innerHTML = (idx=='prev')?$M(config.prevPageText):(idx=='next')?$M(config.nextPageText):idx;
			liEl.appendChild(aEl);
		} else {
			//����Ƿ�ҳʡ�Էָ�����ֱ����ʾʡ�Ժ�
			liEl.innerHTML = PAGE_SEPARATOR;
		}
		return liEl;
	}
	
	/**
	 * ����ҳ��Url
	 * @param {Object} idx
	 * @param {Object} config
	 */
	var buildPageUrl = function(idx, config) {
		var url = config.pageUrl + (config.pageUrl.lastIndexOf('?')!=-1?'&':'?') + config.pageParamName + '=' + idx;
		if (config.appendParams)
			url += '&' + config.appendParams;
		return url;
	}
	
	/**
	 * �ӿں���
	 * @param {Object} pageBarContainer ��ҳ������
	 * @param {Object} pageDataContainer  ҳ����������
	 * @param {Object} config ���ò���
	 */
	this.attach = function(pageBarContainer, pageDataContainer, config) {	
		pageBarContainer = $(pageBarContainer);
		pageDataContainer = $(pageDataContainer);
		config = TB.applyIf(config||{}, defConfig);
		
		//���ݻ������
		if (config.cachePageData) {
			var pageDataCache = {};
		}
		
		var ulEl = document.createElement('ul');
		pageBarContainer.appendChild(ulEl);
		
		var pageLoadEvent = new YAHOO.util.CustomEvent('pageLoad', null, false, YAHOO.util.CustomEvent.FLAT);
		
		var handle = {};
		
		/**
		 * ���������ҳ��
		 * @param {Object} pageObj  JSON��ʽ�ķ�ҳ����
		 * 
		 * ���ݸ�ʽ
		 * {
		 * 		"Pagination": {
		 * 			"PageIndex": 1, //��ǰҳ
		 * 			"PageCount" : 3 , //��ҳ��
		 * 			"PageSize" : 100, //ҳ����Ŀ��
		 * 			"TotalCount" : 300, //��Ŀ��������ѡ��
		 * 			"PageData" : "<html>" //������html����
		 * 		} 
		 * 	}
		 */
		handle.rebuildPageBar = function(pageObj) {
			if (pageObj) {
				this.pageIndex = parseInt(pageObj.PageIndex);
				this.totalCount = parseInt(pageObj.TotalCount);
				this.pageCount = parseInt(pageObj.PageCount);
				this.pageSize = parseInt(pageObj.PageSize);
			}
			
			//���page UL ���ݲ����¹���
			ulEl.innerHTML = '';
			
			//��ȡ��ҳҳ���б�
			var list = this.repaginate();

			//��һҳ������Ԫ
			var prevLiEl = buildPageEntry('prev', config);
			if (!this.isPrevPageAvailable()) {
				$D.addClass(prevLiEl, config.noPrevClass);
				$E.on(prevLiEl, 'click', cancelHandler);
			} else {
				$E.on(prevLiEl, 'click', pageHandler, [this.pageIndex-1, this]);
			}
			ulEl.appendChild(prevLiEl);			
			
			//ѭ�������ҳ��
			for (var i = 0; i < list.length; i++) {
				var liEl = buildPageEntry(list[i], config);
				if (list[i] == this.pageIndex) {
					$D.addClass(liEl, config.currPageClass);
					$E.on(liEl, 'click', cancelHandler);
				} else {
					$E.on(liEl, 'click', pageHandler, [list[i], this]);				
				}
				ulEl.appendChild(liEl);
			}
			
			//��һҳ������Ԫ
			var nextLiEl = buildPageEntry('next', config);
			if (!this.isNextPageAvailable()) {
				$D.addClass(nextLiEl, config.noNextClass);
				$E.on(nextLiEl, 'click', cancelHandler);
			} else {
				$E.on(nextLiEl, 'click', pageHandler, [this.pageIndex+1, this]);
			}			
			ulEl.appendChild(nextLiEl);
		}
		
		/**
		 * �����ҳҳ���
		 */
		handle.repaginate = function() {
			var mode = config.pageBarMode;
			if (mode == 'bound') {
				//���� bound ��ʽ�ķ�ҳ��������Ե���ʾҳ��
				return buildBoundPageList(parseInt(this.pageIndex), parseInt(this.pageCount));
			} else if (mode == 'line') {
				//���� line ��ʽ�ķ�ҳ������ʾ����ҳ��
				var l = [];
				for (var i = 1; i <= this.pageCount; i++) {
					l.push(i);
				}
				return l;
			} else if (mode == 'eye') {
				//���� eye ��ʽ�ķ�ҳ��,ֻ����ǰ���ķ�ҳ��ʽ
				return [];
			}
		}
		
		/**
		 * ��ʾָ��ҳ�������
		 * @param {Object} idx  ҳ��
		 */
		handle.gotoPage = function(idx) {
			this.disablePageBar();
			if (config.showIndicator) {
				$D.setStyle(pageDataContainer, 'display', 'none');
				var indicator = TB.util.Indicator.attach(pageDataContainer, {message:$M('loading')});
				indicator.show();
			}
			var url = buildPageUrl(idx, config);
			
			//������������ݻ��棬�����ֻ��������Ѵ��ڣ�ֱ����ʾ�����е�����
			if (config.cachePageData) {
				if (pageDataCache[url]) {
					handle.showPage(pageDataCache[url]);
					return;
				}
			} 
			
			YAHOO.util.Connect.asyncRequest('GET', url + '&t=' + new Date().getTime(), {
				success: function(req) {
					var resultSet = eval('(' + req.responseText + ')');
					handle.showPage(resultSet.Pagination);
					if (config.cachePageData) {
						pageDataCache[url] = resultSet.Pagination;	
					}
					if (config.showIndicator){
						indicator.hide();
						$D.setStyle(pageDataContainer, 'display', 'block');
					}			
				},
				failure: function(req) {
					if (config.showIndicator){
						$D.setStyle(pageDataContainer, 'display', 'block');						
						indicator.hide();
					}
					handle.rebuildPageBar();					
					alert($M('ajaxError'));
				}
			});	
		}
		
		handle.showPage = function(pageObj) {
			if (pageObj.PageData && YAHOO.lang.isString(pageObj.PageData))
				pageDataContainer.innerHTML = pageObj.PageData;
			this.rebuildPageBar(pageObj);
			pageLoadEvent.fire(pageObj);
		}

		/**
		 * ������һҳ��
		 */
		handle.isNextPageAvailable = function() {
			return this.pageIndex < this.pageCount;
		}

		/**
		 * ������һҳ?
		 */
		handle.isPrevPageAvailable = function() {
			return this.pageIndex > 1;
		}
		
		/**
		 * ���÷�ҳ�������û����ĳ����ҳ��ʱ������������ҳ��������<a>�ĵ����������������disabled=1
		 * @param {Object} bar
		 */
		handle.disablePageBar = function() {
			$D.addClass(pageBarContainer, 'Disabled');
			//����������onclick event handler
			$E.purgeElement(pageBarContainer, true, 'click');
			var els = TB.common.toArray(pageBarContainer.getElementsByTagName('a'));
			els.forEach(function(el, i){
				$E.on(el, 'click', cancelHandler);
				el.disabled = 1;
			});
		}		
		
		/**
		 * ע��ҳ�����ݼ�����ɺ�ִ�еĻص�����
		 * @param {Object} callback
		 */
		handle.onPageLoad = function(callback) {
			if (YAHOO.lang.isFunction(callback))
				pageLoadEvent.subscribe(callback);
		} 
		
		/**
		 * ����query��������
		 * @param {Object} params
		 */
		handle.setAppendParams = function(params) {
			config.appendParams = params;
		}
		
		return handle;		
	}			
}