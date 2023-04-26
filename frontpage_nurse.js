//Adding help-modal to the nurse's frontpage
const helpmodal = document.getElementById("helpModalNurse");
const helpbtn = document.getElementById("help-icon");
const helpspan = document.getElementsByClassName("closeHelpNurse")[0];

helpbtn.onclick = function() {
helpmodal.style.display = "block";
}
helpspan.onclick = function() {
helpmodal.style.display = "none";
}