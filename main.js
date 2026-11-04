
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

/* Interaction 1: category filters (programs and student life) */
function setupFilter(barId,itemSel){
  var bar=$(barId); if(!bar) return;
  bar.classList.remove("d-none");
  bar.addEventListener("click",function(e){
    var b=e.target.closest("button"); if(!b) return;
    var f=b.getAttribute("data-filter");
    $$("button",bar).forEach(function(x){var on=x===b;x.classList.toggle("active",on);x.setAttribute("aria-pressed",on)});
    $$(itemSel).forEach(function(i){i.classList.toggle("d-none",f!=="all"&&i.getAttribute("data-cat")!==f)});
  });
}
setupFilter("#progFilter",".prog");
setupFilter("#lifeFilter",".life");

/* Interaction 2: FAQ expand/collapse all */
var ft=$("#faqToggle");
if(ft){
  ft.classList.remove("d-none");
  ft.addEventListener("click",function(){
    var items=$$("#faqList details");
    var open=items.some(function(d){return !d.open});
    items.forEach(function(d){d.open=open});
    ft.textContent=open?"Collapse all":"Expand all";
  });
}

/* Helpers */
function setValid(el,ok){el.classList.toggle("is-valid",ok);el.classList.toggle("is-invalid",!ok);el.setAttribute("aria-invalid",!ok);return ok}
function showAlert(box,type,msg){box.innerHTML='<div class="alert alert-'+type+'">'+msg+'</div>';box.focus()}
var emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Contact form */
var cf=$("#contactForm");
if(cf){
  cf.addEventListener("submit",function(e){
    e.preventDefault();
    var ok=true;
    ok=setValid($("#cName"),$("#cName").value.trim().length>1)&&ok;
    ok=setValid($("#cEmail"),emailRe.test($("#cEmail").value.trim()))&&ok;
    ok=setValid($("#cSubject"),$("#cSubject").value.trim().length>1)&&ok;
    ok=setValid($("#cMessage"),$("#cMessage").value.trim().length>=10)&&ok;
    ok=setValid($("#cSpam"),$("#cSpam").value.trim()==="7")&&ok;
    var box=$("#contactAlert");
    if($("#cWeb").value!==""){return}
    if(!ok){showAlert(box,"danger","Something went wrong. Please check the fields and try again.");return}
    showAlert(box,"success","Thank you! Your message has been sent. We will reply within 2 working days.");
    cf.reset();$$("input,textarea",cf).forEach(function(x){x.classList.remove("is-valid","is-invalid")});
  });
}

/* Registration form */
var rf=$("#regForm");
if(rf){
  var intake=$("#rIntake");
  intake.min=new Date().toISOString().slice(0,10);
  function validate(){
    var ok=true,p=$("#rPass").value;
    ok=setValid($("#rName"),$("#rName").value.trim().split(/\s+/).join("").length>=2)&&ok;
    ok=setValid($("#rEmail"),emailRe.test($("#rEmail").value.trim()))&&ok;
    var digits=$("#rPhone").value.replace(/[\s()+-]/g,"");
    ok=setValid($("#rPhone"),/^\d{9,15}$/.test(digits))&&ok;
    ok=setValid($("#rProgram"),$("#rProgram").value!=="")&&ok;
    ok=setValid(intake,intake.value!==""&&intake.value>=intake.min)&&ok;
    var mode=!!$('input[name="mode"]:checked');
    $("#modeErr").hidden=mode;ok=mode&&ok;
    ok=setValid($("#rPass"),p.length>=8&&/\d/.test(p))&&ok;
    ok=setValid($("#rPass2"),p!==""&&$("#rPass2").value===p)&&ok;
    ok=setValid($("#rTerms"),$("#rTerms").checked)&&ok;
    return ok;
  }
  rf.addEventListener("submit",function(e){
    e.preventDefault();
    var box=$("#regAlert");
    if(validate()){
      showAlert(box,"success","Registration successful! Welcome to Engineering College. We will email you within 3 working days.");
      rf.reset();$$(".is-valid,.is-invalid",rf).forEach(function(x){x.classList.remove("is-valid","is-invalid")});
    }else{
      showAlert(box,"danger","Please fix the highlighted fields and try again.");
      var first=$(".is-invalid",rf);if(first)first.focus();
    }
  });
  rf.addEventListener("input",function(e){if(e.target.classList.contains("is-invalid")||e.target.classList.contains("is-valid"))validate()});
}
})();
