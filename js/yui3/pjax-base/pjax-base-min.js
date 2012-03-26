YUI.add("pjax-base",function(f){var d=f.config.win,b=f.Lang,e=f.ClassNameManager.getClassName("pjax"),a="navigate";function c(){}c.prototype={_regexURL:/^((?:[^\/#?:]+:\/\/|\/\/)[^\/]*)?([^?#]*)(\?[^#]*)?(#.*)?$/,initializer:function(){this.publish(a,{defaultFn:this._defNavigateFn});if(this.get("html5")){this._pjaxBindUI();}},destructor:function(){this._pjaxEvents&&this._pjaxEvents.detach();},navigate:function(h,g){h=this._resolveURL(h);if(this._navigate(h,g)){return true;}if(!this._hasSameOrigin(h)){f.error("Security error: The new URL must be of the same origin as the current URL.");}return false;},_getRoot:function(){var h="/",i=f.getLocation().pathname,g;if(i.charAt(i.length-1)===h){return i;}g=i.split(h);g.pop();return g.join(h)+h;},_navigate:function(i,h){if(!this.hasRoute(i)){return false;}h||(h={});h.url=i;var k=this._getURL(),j,g;g=i.replace(/(#.*)$/,function(l,n,m){j=n;return l.substring(m);});if(j&&g===k.replace(/#.*$/,"")){if(!this.get("navigateOnHash")){return false;}h.hash=j;}b.isValue(h.replace)||(h.replace=i===k);if(this.get("html5")||h.force){this.fire(a,h);}else{if(h.replace){d&&d.location.replace(i);}else{d&&(d.location=i);}}return true;},_normalizePath:function(p){var m="..",g="/",h,l,o,j,k,n;if(!p||p===g){return g;}j=p.split(g);n=[];for(h=0,l=j.length;h<l;++h){k=j[h];if(k===m){n.pop();}else{if(k){n.push(k);}}}o=g+n.join(g);if(o!==g&&p.charAt(p.length-1)===g){o+=g;}return o;},_pjaxBindUI:function(){if(!this._pjaxEvents){this._pjaxEvents=f.one("body").delegate("click",this._onLinkClick,this.get("linkSelector"),this);}},_resolvePath:function(g){if(!g){return this._getPath();}if(g.charAt(0)==="/"){return this._normalizePath(g);}return this._normalizePath(this._getRoot()+g);},_resolveURL:function(i){var m=i&&i.match(this._regexURL),h,l,j,k,g;if(!m){return this._getURL();}h=m[1];l=m[2];j=m[3];k=m[4];if(h){if(h.indexOf("//")===0){h=f.getLocation().protocol+h;}return h+(l||"/")+(j||"")+(k||"");}g=this._getOrigin()+this._resolvePath(l);if(l||j){return g+(j||"")+(k||"");}j=this._getQuery();return g+(j?("?"+j):"")+(k||"");},_defNavigateFn:function(g){this[g.replace?"replace":"save"](g.url);if(d&&this.get("scrollToTop")){setTimeout(function(){d.scroll(0,0);},1);}},_onLinkClick:function(h){var g;if(h.button!==1||h.ctrlKey||h.metaKey){return;}g=h.currentTarget.get("href");g&&this._navigate(g,{originEvent:h})&&h.preventDefault();}};c.ATTRS={linkSelector:{value:"a."+e,writeOnce:"initOnly"},navigateOnHash:{value:false},scrollToTop:{value:true}};f.PjaxBase=c;},"@VERSION@",{requires:["classnamemanager","node-event-delegate","router"]});