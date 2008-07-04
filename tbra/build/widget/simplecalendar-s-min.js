TB.widget.SimpleCalendar=new function(){var G={DATE_FIELD_DELIMITER:"-",DATE_RANGE_DELIMITER:"~",MDY_YEAR_POSITION:1,MDY_MONTH_POSITION:2,MDY_DAY_POSITION:3,MY_YEAR_POSITION:1,MY_MONTH_POSITION:2,MONTHS_SHORT:["1","2","3","4","5","6","7","8","9","10","11","12"],MONTHS_LONG:["1\u6708","2\u6708","3\u6708","4\u6708","5\u6708","6\u6708","7\u6708","8\u6708","9\u6708","10\u6708","11\u6708","12\u6708"],WEEKDAYS_1CHAR:["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"],WEEKDAYS_SHORT:["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"],WEEKDAYS_MEDIUM:["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"],WEEKDAYS_LONG:["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"],MY_LABEL_YEAR_POSITION:1,MY_LABEL_MONTH_POSITION:2,MY_LABEL_YEAR_SUFFIX:"\u5e74",MY_LABEL_MONTH_SUFFIX:"\u6708",LOCALE_MONTHS:"short"};var F={strings:{month:"\u9009\u62e9\u6708\u4efd",year:"\u8f93\u5165\u5e74\u4efd",submit:"\u786e\u5b9a",cancel:"\u53d6\u6d88",invalidYear:"\u8bf7\u8f93\u5165\u6709\u6548\u7684\u5e74\u4efd"},initialFocus:"year"};var I={YEAR_MAX:2020,YEAR_MIN:1970};var B=function(J){return((J<10)?"0":"")+J};var D=function(){this[this._status=="show"?"hide":"show"]()};var C=function(L,K){var J=document.createElement("div");J.id=L+"_container";return($(K)||document.body).appendChild(J)};var H=function(){var J=/^(\d{4})-(?:[0]?)(\d{1,2})-(?:[0]?)(\d{1,2})$/;return function(M){try{var K=M.match(J).slice(1);return new Date(K[0],K[1]-1,K[2])}catch(L){return M}}}();var A=function(K){if(YAHOO.lang.isString(K)){if(K.indexOf("-")!=-1){return K}if("today"==K.toLowerCase()){var J=new Date();return E([J.getFullYear(),J.getMonth()+1,J.getDate()])}}else{if(YAHOO.lang.isArray(K)){return E(K)}}};var E=function(J){return J[0]+"-"+B(J[1])+"-"+B(J[2])};return{config_zh:G,enhance:function(K,J){J=TB.applyIf(J||{},I);if(J.maxdate){J.maxdate=A(J.maxdate);K.cfg.setProperty("pagedate",H(J.maxdate));K.cfg.setProperty("maxdate",J.maxdate)}if(J.mindate){J.mindate=A(J.mindate);K.cfg.setProperty("pagedate",H(J.mindate));K.cfg.setProperty("mindate",J.mindate)}if(J.selected){J.selected=A(J.selected);K.cfg.setProperty("pagedate",H(J.selected));K.cfg.setProperty("selected",J.selected)}if(J.enableOOM){K.renderCellNotThisMonth=function(M,L){YAHOO.util.Dom.addClass(L,this.Style.CSS_CELL_OOM);L.innerHTML=M.getDate();return K.renderCellDefault(M,L)}}if(!J.pages&&J.enableSelectYear){K.buildMonthLabel=function(){var N=this.cfg.getProperty(YAHOO.widget.Calendar._DEFAULT_CONFIG.PAGEDATE.key);var R=N.getFullYear(),M=N.getMonth();var O=['<select class="calyearselector">'];for(var Q=J.YEAR_MIN;Q<=J.YEAR_MAX;++Q){O.push('<option value="'+Q+'"'+(R==Q?' selected="selected"':"")+">"+Q+"</option>")}O.push("</select>");var P=['<select class="calmonthselector">'];for(var L=0;L<12;++L){P.push('<option value="'+L+'"'+(M==L?' selected="selected"':"")+">"+(L+1)+"</option>")}P.push("</select>");return O.join("")+this.Locale.MY_LABEL_YEAR_SUFFIX+P.join("")+this.Locale.MY_LABEL_MONTH_SUFFIX};K.renderEvent.subscribe(function(){var M=this.cfg.getProperty(YAHOO.widget.Calendar._DEFAULT_CONFIG.PAGEDATE.key);var N=M.getFullYear(),O=M.getMonth();if(N==J.YEAR_MAX&&O==11&&this.linkRight){$D.setStyle(this.linkRight,"display","none")}else{if(N==J.YEAR_MIN&&O==0&&this.linkLeft){$D.setStyle(this.linkLeft,"display","none")}}var L=this.oDomContainer.getElementsByTagName("select");$E.on(L[0],"change",function(P,Q){Q.setYear(this.value);Q.render()},this);$E.on(L[1],"change",function(P,Q){Q.setMonth(this.value);Q.render()},this)},K,true)}},init:function(L,K,J,M){K=$(K);L=$(L);J=$(J)||L;M=M||{};var O=$D.generateId(null,"_tbpc_");if(!K){K=C(O,M.containerRoot)}var Q;if(M.navigator){if(YAHOO.lang.isObject(M.navigator)){TB.applyIf(M.navigator,F)}else{M.navigator=F}}if(M.pages&&M.pages>1){Q=new YAHOO.widget.CalendarGroup(O,K.id,TB.apply(G,M))}else{Q=new YAHOO.widget.Calendar(O,K.id,TB.apply(G,M))}this.enhance(Q,M);if(YAHOO.lang.isFunction(M.onSelect)){Q.selectEvent.subscribe(M.onSelect,Q,true)}if(YAHOO.lang.isFunction(M.onBeforeSelect)){Q.beforeSelectEvent.subscribe(M.onBeforeSelect,Q,true)}if(YAHOO.lang.isFunction(M.onClear)){Q.clearEvent.subscribe(M.onClear,Q,true)}if(M.footer){Q.renderFooter=function(R){R.push('<tfoot><tr><td colspan="8">'+M.footer+"</td></tr></tfoot>");return R}}var N=function(T,R,U){var S=R[0];L.value=E(S[0]);P.hide()};$D.setStyle(K,"position","absolute");Q.selectEvent.subscribe(N,Q,true);Q.hide();Q.render();var P={};P._status="hide";P._beforeShowEvent=new YAHOO.util.CustomEvent("beforeShow",P,false,YAHOO.util.CustomEvent.FLAT);P.calObj=Q;P.hide=function(){Q.hide();P._status="hide"};P.show=function(){P._beforeShowEvent.fire();Q.show();P._status="show";var R=$D.getXY(L);R[1]+=L.offsetHeight;$D.setXY(K,R)};P.select=function(R){return Q.select(R)};P.getSelectedDates=function(){return Q.getSelectedDates()};$E.on(J,(L===J)?"focus":"click",D,P,true);$E.on(document,"mousedown",function(R){var S=$E.getTarget(R);if(!(S===L||S===J||$D.isAncestor(K,S))){if(YAHOO.env.ua.gecko==1.9&&$D.getAncestorByClassName(S,"yui-calendar")){return }P.hide()}});$E.on(document,"keydown",function(R){if(R.keyCode==27){P.hide()}});return P},initRange:function(J,O,N,L){if(!YAHOO.lang.isArray(J)||J.length<2){alert("You need pass an array including tow input fields.");return }var M=this.init(J[0],O?O[0]:null,N?toogles[0]:null,L);var P=this.init(J[1],O?O[1]:null,N?toogles[1]:null,L);var K=function(){var S=arguments[1][0];var Q=arguments[1][1];S.hide();var R=S._input.value;if(R){this.calObj.cfg.setProperty("pagedate",H(R));this.calObj.cfg.setProperty(Q==1?"mindate":"maxdate",R);this.calObj.render()}};M._beforeShowEvent.subscribe(K,[P,0],M);M._input=J[0];P._beforeShowEvent.subscribe(K,[M,1],P);P._input=J[1];if(L.autoMoveToNext){M.calObj.selectEvent.subscribe(function(){if(P._input.value==""&&!P._input.disabled){P.show()}})}return[M,P]}}};
