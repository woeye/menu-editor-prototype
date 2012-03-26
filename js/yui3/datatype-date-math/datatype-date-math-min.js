YUI.add("datatype-date-math",function(b){var a=b.Lang;b.mix(b.namespace("DataType.Date"),{isValidDate:function(c){if(a.isDate(c)&&(isFinite(c))&&(c!="Invalid Date")&&!isNaN(c)&&(c!=null)){return true;}else{return false;}},areEqual:function(d,c){return(this.isValidDate(d)&&this.isValidDate(c)&&(d.getTime()==c.getTime()));},isGreater:function(d,c){return(this.isValidDate(d)&&this.isValidDate(c)&&(d.getTime()>c.getTime()));},isGreaterOrEqual:function(d,c){return(this.isValidDate(d)&&this.isValidDate(c)&&(d.getTime()>=c.getTime()));},isInRange:function(e,d,c){return(this.isGreaterOrEqual(e,d)&&this.isGreaterOrEqual(c,e));},addDays:function(d,c){return new Date(d.getTime()+86400000*c);},addMonths:function(f,c){var e=f.getFullYear();var g=f.getMonth()+c;e=Math.floor(e+g/12);g=(g%12+12)%12;var d=new Date(f.getTime());d.setYear(e);d.setMonth(g);return d;},addYears:function(f,e){var d=f.getFullYear()+e;var c=new Date(f.getTime());c.setYear(d);return c;},listOfDatesInMonth:function(g){if(!this.isValidDate(g)){return[];}var e=this.daysInMonth(g),f=g.getFullYear(),h=g.getMonth(),d=[];for(var c=1;c<=e;c++){d.push(new Date(f,h,c,12,0,0));}return d;},daysInMonth:function(e){if(!this.isValidDate(e)){return 0;}var d=e.getMonth();var f=[31,28,31,30,31,30,31,31,30,31,30,31];if(d!=1){return f[d];}else{var c=e.getFullYear();if(c%400===0){return 29;}else{if(c%100===0){return 28;}else{if(c%4===0){return 29;}else{return 28;}}}}}});},"@VERSION@",{requires:["yui-base"]});