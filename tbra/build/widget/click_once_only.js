/*
* ��С��ʹ��
*ʹ�÷�Χ��ֻ����ǰҳ��POST���ݵ�A����BUTTONʹ�á����Ǻ�˳���ȷʵ�޷������ظ��ύ��
* ���÷�����
var oConfig={
elClass:"clickOnceOnly", //����CLASS
elTag:"a",							//����tagName
elParent:document.body  //������ �뾡����С��
}
TB.widget.clickOnceOnly.init(oConfig);
*
*******/

TB.widget.clickOnceOnly = new function(){
			var defConfig={
				elClass:"clickOnceOnly",
				elTag:"*",
				elParent:document.body
				};
			var clicked = function(ev,aDefFun){
				YUE.removeListener(el,"click",clicked);
				var el=YUE.getTarget(ev,true);
				YUE.stopEvent(ev);
				el.disabled=true;
				if(aDefFun && YL.isArray(aDefFun)){
					for(var i=0, n = aDefFun.length;i<n;i++){
							aDefFun[i]();
						}
					}
				try{
				YUE.removeListener(el,"click",clicked);
				if(el.tagName.toLowerCase()=="a"){
					el.href="javascript:void(0);";
					}
				}catch(E){}
				};
				var doHref = function(ev,pObj){
							var el=YUE.getTarget(ev,true);
							YUE.removeListener(el,"click",doHref);
							var sTarget = pObj.sTarget || "_self";
							el.target=null;
							window.open(pObj.sHref,sTarget);
						};
			this.init = function(oConfig){
				var config  = TB.applyIf(oConfig||{}, defConfig);
				var items = YUD.getElementsByClassName(config.elClass,config.elTag,config.elParent);
				for(var i=0, n = items.length; i<n;i++){
					var f=[];
					if(items[i].type=="submit"){
					var p = TB.dom.getAncestorByTagName(items[i],"form");
					YUE.on(p,"submit",function(ev,obj){obj.disabled=true;},items[i])
					}else{
					f[f.length] = items[i].onclick;
					items[i].onclick=null;
					YUE.removeListener(items[i],"click");
					if(items[i].href){
						YUE.on(items[i],"click",doHref,{sHref:items[i].href,sTarget:items[i].target});
						}
					YUE.on(items[i],"click",clicked,f);
				}
				}
				};
				
}