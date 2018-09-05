export function setCookie(cname,value,iday,path){
    //使用日期对象
    var oDate = new Date();
    //设置过期时间
    oDate.setDate(oDate.getDate() + iday);
    //设置cookie
    document.cookie = cname + '=' + value + ';expires=' + oDate + '; path=' + path;
}


export function getCookie(cname) {  
  var name = cname + "=";  
  var ca = document.cookie.split(';');  
  for(var i=0; i<ca.length; i++) {  
      var c = ca[i];  
      while (c.charAt(0)==' ') c = c.substring(1);  
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);  
  }  
  return "";  
} 