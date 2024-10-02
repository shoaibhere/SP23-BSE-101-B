window.onload =  function(){
  var gform = document.getElementById("gform");
  gform.onsubmit = handleformsubmit;
}
function handleformsubmit(event){
  let fnamefield=document.getElementById("fname-field");
  let lnamefield=document.getElementById("lname-field");
  let emailfield=document.getElementById("email-field");
  let cityfield=document.getElementById("city-field");
  let addressfield=document.getElementById("address-field");

  let fnameerror=document.getElementById("fname-error");
  let lnameerror=document.getElementById("lname-error");
  let emailerror=document.getElementById("email-error");
  let cityerror=document.getElementById("city-error");
  let addresserror=document.getElementById("address-error");

  fnameerror.style.display="none";
  lnameerror.style.display="none";
  emailerror.style.display="none";
  addresserror.style.display="none";
  cityerror.style.display="none";

  if(fnamefield.value && lnamefield.value && emailfield.value && cityfield.value && addressfield.value){
    console.log("valid form");
  }
  else{
    if(!fnamefield.value)
    {
      fnameerror.style.display="inline";
    }
    if(!lnamefield.value)
    {
      lnameerror.style.display="inline";
    }
    if(!emailfield.value)
    {
      emailerror.style.display="inline";
    }
    if(!cityfield.value)
    {
      cityerror.style.display="inline";
    }
    if(!addressfield.value)
    {
      addresserror.style.display="inline";
    }
    event.preventDefault();
  }
}