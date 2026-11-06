(function(){
    var cur="0" ,prev=null,op=null,overwrite=false,exprText="";
    var SYM={"+":"+","-":"-","*":"×","/":"÷"};
    var resEl=document.getElementById("result"),exprEl=document.getElementById("expr");


function fmt(s){
    if(s==="Error")return s;
    var p=s.split("."),i=p[0],neg=i[0]==="-";
    if(neg)i=i.slice(1);
        i=i.replace(/\B(?=(\d{3})+(?!\d))/g,",");
        return (neg?"-":"")+i+(p.length>1?"."+p[1]:"");
    
}



  function compute(a,b,o){
    a=parseFloat(a);b=parseFloat(b);var r;
    if(o==="+")r=a+b;else if(o==="-")r=a-b;else if(o==="*")r=a*b;
    else{if(b===0)return "Error";r=a/b;}
    return String(parseFloat(r.toPrecision(12)));
  }
  function render(){
    var t=fmt(cur);
    resEl.textContent=t;
    resEl.style.fontSize=t.length>14?"1.8rem":t.length>10?"2.4rem":"";
    exprEl.textContent=op?fmt(prev)+" "+SYM[op]:exprText;
    document.querySelectorAll(".key.op").forEach(function(b){
      b.classList.toggle("active",op===b.dataset.k&&overwrite);
    });
  }
  function digit(d){
    if(cur==="Error"||overwrite||cur==="0"){cur=d;overwrite=false;exprText=op?exprText:"";}
    else if(cur.replace(/[-.]/g,"").length<15)cur+=d;
  }
  function dot(){
    if(cur==="Error"||overwrite){cur="0.";overwrite=false;return;}
    if(cur.indexOf(".")===-1)cur+=".";
  }
  function operator(o){
    if(cur==="Error")return;
    if(op&&!overwrite)cur=compute(prev,cur,op);
    prev=cur;op=o;overwrite=true;
    if(cur==="Error"){op=null;prev=null;}
  }
  function equals(){
    if(!op||cur==="Error")return;
    var a=prev,b=cur,o=op;
    cur=compute(a,b,o);
    exprText=fmt(a)+" "+SYM[o]+" "+fmt(b)+" =";
    prev=null;op=null;overwrite=true;
  }
  function back(){
    if(cur==="Error"){cur="0";return;}
    if(overwrite)return;
    cur=(cur.length>1&&!(cur.length===2&&cur[0]==="-"))?cur.slice(0,-1):"0";
  }
  function percent(){
    if(cur==="Error")return;
    cur=String(parseFloat((parseFloat(cur)/100).toPrecision(12)));
  }
  function press(k){
    if(/^\d$/.test(k))digit(k);
    else if(k===".")dot();
    else if(k==="+"||k==="-"||k==="*"||k==="/")operator(k);
    else if(k==="="||k==="Enter")equals();
    else if(k==="Backspace")back();
    else if(k==="AC"||k==="Escape"||k==="Delete"){cur="0";prev=null;op=null;overwrite=false;exprText="";}
    else if(k==="%")percent();
    else return;
    render();
  }
  document.getElementById("keys").addEventListener("click",function(e){
    var b=e.target.closest(".key");if(b)press(b.dataset.k);
  });
  document.addEventListener("keydown",function(e){
    var k=e.key;if(k==="Enter")e.preventDefault();
    if(k==="Enter")k="=";
    var btn=document.querySelector('.key[data-k="'+(k==="Escape"||k==="Delete"?"AC":k)+'"]');
    if(!btn)return;
    press(k);
    btn.classList.add("pressed");
    setTimeout(function(){btn.classList.remove("pressed");},120);
  });
  document.getElementById("theme").addEventListener("click",function(){
    var r=document.documentElement;
    var dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;
    r.dataset.theme=dark?"light":"dark";
  });
  render();
})();