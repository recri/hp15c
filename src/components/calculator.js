(function(){
    var a=document.getElementById("cwos"),b;
    var c=parseFloat(a.innerText||a.textContent),d=c.toString();
    if(12>=d.replace(/^-/,"").replace(/\./,"").length)
	b=d;
    else if(d=c.toPrecision(12),-1!=d.indexOf("e")) {
	var e=d.match(/e.*$/)[0].length;
	b=c.toPrecision(12-e-("0"==d[0]?1:0)).replace(/\.?0*e/,"e")
    } else {
	var f=d.match(/(^-|\.)/g),g=d.substr(0,12+(f?f.length:0));
	b=-1!=g.indexOf(".")?g.replace(/\.?0*$/,""):g}a.innerHTML=b;
}).call(this);
