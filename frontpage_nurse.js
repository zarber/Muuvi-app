const fetchData = async () => {
    //User data from the database
    const response_userData = await fetch('/api/user/users');
    const jsonUserData = await response_userData.json();
    console.log("jsonUserData", jsonUserData);

    //Filtering out patients from jsonUserData
    const jsonPatientData = jsonUserData.filter(user => user.role === "patient");
    console.log("jsonPatientData", jsonPatientData);

    //Adding patients to the list
    let innerHTML = "<ol>";
    if(jsonPatientData.length === 0) {
        innerHTML += "<li>Potilaita ei löytynyt</li>";
    } else {
        for (const patient of jsonPatientData) {
            console.log("patient", patient);
            innerHTML += `<li><a href="/etusivu_ammattilainen/${patient._id}">${patient.firstname} ${patient.lastname}</a><br>${patient.email}</li>`;
        }
    }
    innerHTML += "</ol>";

    const userList = document.getElementsByClassName('list');
    userList[0].innerHTML = innerHTML;
};


fetchData();

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

const exercisePlanLink = document.getElementById('exercise_plan_edit');
const pathname = window.location.pathname;
const asPatient = pathname.split('/').pop();
console.log(asPatient);
exercisePlanLink.href = `/liikuntasuunnitelma/${asPatient}`;
