//Top navigation bar
function topNavFunction() {
  var x = document.getElementById("topNav");
  if (x.className === "navigation") {
    x.className += "responsive";
  } else {
    x.className = "navigation";
  }
}

//Adding info-modal to the student's frontpage
const infomodal = document.getElementById("infoModal");
const infobtn = document.getElementById("info");
const infospan = document.getElementsByClassName("closeInfo")[0];

infobtn.onclick = function() {
infomodal.style.display = "block";
}
infospan.onclick = function() {
infomodal.style.display = "none";
}

//Adding help-modal to the student's frontpage
const helpmodal = document.getElementById("helpModal");
const helpbtn = document.getElementById("help-icon");
const helpspan = document.getElementsByClassName("closeHelp")[0];

helpbtn.onclick = function() {
helpmodal.style.display = "block";
}
helpspan.onclick = function() {
helpmodal.style.display = "none";
}

//List of aphorisms
const aphorisms = [
  '"Liikunta on parasta terveydenhoitoa."',
  '"Liikunta lisää hyvää oloa."',
  '"Et koskaan tiedä rajojasi, ellet ylitä niitä."',
  '"Pitkäkin matka täytyy aloittaa yhdellä askeleella."',
  '"Kaikki on mahdollista. Mahdottoman toteuttaminen vain vie hieman enemmän aikaa."',
  '"Tulevaisuus tulee. Vain sinä voit päättää, mihin se menee."',
  '"Tee yksi ihminen onnelliseksi joka päivä — vaikkapa se olisit sinä itse."',
  '"Jokainen voi kuntoilla omien voimiensa mukaan."',
  '"Loppujen lopuksi kadumme vain mahdollisuuksia, joihin emme tarttuneet."',
  '"Sinun täytyy odottaa asioita itseltäsi ennen kuin pystyt niihin."',
  '"Se ei ole vuori, jonka valloitamme, vaan itsemme."'
];
//Randomly choosing an aphorism from the list to website
var randomAphorism = Math.floor(Math.random()*aphorisms.length);
document.getElementById("aphorism").innerText = aphorisms[randomAphorism];

//Adding a date to the diary
document.addEventListener('DOMContentLoaded', () => {
const currentDate = new Date();
const formattedDate = currentDate.toISOString().slice(0, 10);
document.querySelector('#diary_date').value = formattedDate;
}); 
