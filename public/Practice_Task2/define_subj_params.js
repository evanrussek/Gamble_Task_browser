// this could also be a trial // for the scanner, add the date and time, and other info

// define subject parameters and set up the db...
// want a screen that will ask this... (could also break up each time...)
//
// want to solicit this from the subject... // and to verify that this still works.
//var quest = document.getElementById('experimenter-questionnaire');
//document.body.appendChild(quest);

// Consent form
var check_consent = function (elem) {
  if ($('#consent_checkbox1').is(':checked') && $('#consent_checkbox2').is(':checked') &&
      $('#consent_checkbox3').is(':checked') && $('#consent_checkbox4').is(':checked') &&
      $('#consent_checkbox5').is(':checked') && $('#consent_checkbox6').is(':checked') &&
      $('#consent_checkbox7').is(':checked'))
      {
        beginning_form();
      }

  else {
      alert("Unfortunately you will not be unable to participate in this research study if you do " +
          "not consent to the above. Thank you for your time.");
      return false;
  }
};




var start_task = function(){
    db = firebase.firestore();

    // firebase stuff
    firebase.firestore().enablePersistence().catch(function(err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
        }
    });

    firebase.auth().signInAnonymously();

    // User ID
    //var uid;


    // When signed in, get the user ID
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      uid = user.uid;
      // record new date and start time
      //Date =
      db.collection('gambletask').doc('MEG_1').collection('computers').
                    doc(uid).set({
                        subjectID: subjectID
                    })

      db.collection('gambletask').doc('MEG_1').collection('computers').
                    doc(uid).collection('subjects').doc(subjectID).set({
          subjectID: subjectID
      })

      // record new date and start time
      db.collection('gambletask').doc('MEG_1').collection('computers').
                    doc(uid).collection('subjects').doc(subjectID).collection('taskdata').doc('start').set({
          subjectID: subjectID,  // this refers to the subject's ID from prolific/
          date: new Date().toLocaleDateString(),
          start_time: new Date().toLocaleTimeString()
      })
      define_trials(exp_block);
    }
    });
}

var set_other_vars = function(){
//    if (start_phase == "LOC"){
           exp_block = start_block;
//    }else if (start_phase == "LEARN"){
//           exp_block = 6;
//    } else if (start_phase == "MAIN"){
//           exp_block = start_block + 6;
//          // console.log()
//    } else{
//          console.log("WRONGE PHASE NAME");
//    }


     subjectID = ('subj_' + subject_num + '_PracticeTask')

     seed = 'Seed for subject subjectID';
     Math.seedrandom(seed);

    // set condition here...
    cond_idx = subject_num%24;
    console.log('condition: ' + cond_idx)

     both_idx_vec = [[0,0], [0,1], [0,2],
                      [1,0], [1,1], [1,2],
                      [2,0], [2,1], [2,2],
                      [3,0], [3,1], [3,2]];

     choice_state_idx = 0;//both_idx_vec[cond_idx][0];//1; //1both_idx_vec[cond_idx][0]; // don't need
     outcome_state_idx = 0; // both_idx_vec[cond_idx][1];//1; //both_idx_vec[cond_idx][1];

     loss_first = (subject_num%2 == 1);

     instr_slides = 'Stimuli/MEG_slides_o' + outcome_state_idx;

     var pos_outcome_assigments = [[0, 1, 2], // Scissors is safe
                               [2, 0, 1], // House is safe / keep this for this run...
                               [1, 2, 0]]; // Girl is safe

     // outcome_state_idx 0 -- Scissors is safe
     // outcome_state_idx 1 -- House is safe
     // outcome_state_idx 2 -- GIRL is safe


     var pos_choice_assignments = [[0,1,2,3],
                               [3,0,1,2],
                               [2,3,0,1],
                               [1,2,3,0]];


       choice_idx_vec = pos_choice_assignments[choice_state_idx]
       outcome_idx_vec = pos_outcome_assigments[outcome_state_idx];

       pos_outcome_names = ["BALL", "BANANA", "UMBRELLA"];
       pos_choice_names = ["BICYCLE", "CAR", "ELEPHANT", "SNEAKERS"];

       pos_outcome_images = ["Stimuli/MEG_practice_stimuli/Ball.png",
                         "Stimuli/MEG_practice_stimuli/Banana.png",
                         "Stimuli/MEG_practice_stimuli/Umbrella.png"];

       pos_choice_images = ["Stimuli/MEG_practice_stimuli/Bicycle.png",
                         "Stimuli/MEG_practice_stimuli/Car.png",
                         "Stimuli/MEG_practice_stimuli/Elephant.png",
                         "Stimuli/MEG_practice_stimuli/Sneakers.png"];

       choice_images = [pos_choice_images[choice_idx_vec[0]],
                             pos_choice_images[choice_idx_vec[1]],
                             pos_choice_images[choice_idx_vec[2]],
                             pos_choice_images[choice_idx_vec[3]]];


       choice_names = [pos_choice_names[choice_idx_vec[0]],
             pos_choice_names[choice_idx_vec[1]],
             pos_choice_names[choice_idx_vec[2]],
             pos_choice_names[choice_idx_vec[3]]];

       outcome_images = [pos_outcome_images[outcome_idx_vec[0]],
                             pos_outcome_images[outcome_idx_vec[1]],
                             pos_outcome_images[outcome_idx_vec[2]]];

       outcome_names = [pos_outcome_names[outcome_idx_vec[0]],
             pos_outcome_names[outcome_idx_vec[1]],
             pos_outcome_names[outcome_idx_vec[2]]];


       // this is constant for all subjects (160 trials)
       all_prob_o1 = [.2, .4, .6, .8];
       all_win_safe_vals = [15, 30, 45, 60];
       all_loss_safe_vals = [-15, -30, -45, -60];
       all_win_amounts = [45, 60, 75];
       all_loss_amounts = [-45, -60, -75];
       all_prob_trig = all_prob_o1;

       jsPsych.data.addProperties({subject: subject_num});

       start_task();
}



function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

//document.getElementById("submit-button").onclick = start_task;
var beginning_form = function(researcher_inputs){
    ///subject_num = 999;//parseInt(researcher_inputs.subjectNumber.value);
  //  console.log(subject_num)
    // var env = researcher_inputs.env.value;

    if (window.location.search.indexOf('subject_num') > -1) { // this should be something related to prolific...
       subject_num = parseInt(getQueryVariable('subject_num'));
    }
    else {
        subject_num = 9898;//Math.floor(Math.random() * (2000 - 0 + 1)) + 0; // if no prolific ID, generate random ID (for testing)
    }

    start_phase = 'LOC'; //researcher_inputs.stage.value;
//    console.log(start_phase)

    start_block = 1// 1researcher_inputs.run.value;
//    console.log(start_block)

    set_other_vars();
}

//beginning_form();

document.getElementById('header_title').innerHTML = "Welcome";
document.getElementById('consent').innerHTML = "   <p><b>Who is conducting this research study?</b><p>\n" +
    "        <p>\n" +

    "        This research is being conducted by the Division of Psychiatry and the Max Planck UCL Centre for Computational Psychiatry\n" +
    "        and Ageing Research at University College London, London, UK. The lead researcher(s) for this project is\n" +
    "        <a href=\"mailto:e.russek@ucl.ac.uk\">Dr Evan Russek</a>. This study has been approved by the UCL Research Ethics Committee\n" +
    "        (project ID number 16639/001) and is funded by the Max Planck Society and the Welcomme Trust.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>What is the purpose of this study?</b><p>\n" +
    "        <p>\n" +
    "        We are interested in how the adult brain controls learning and decision-making. This research aims to provide\n" +
    "        insights into how the healthy brain works to help us understand the causes of a number of different medical\n" +
    "        conditions.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>Who can participate in the study?</b><p>\n" +
    "        <p>\n" +
    "            You must be 18 or over to participate in this study. Please confirm this to proceed.\n" +
    "        </p>\n" +
    "            <label class=\"container\">I confirm I am over 18 years old\n" +
    "                <input type=\"checkbox\" id=\"consent_checkbox1\">\n" +
    "                <span class=\"checkmark\"></span>\n" +
    "            </label>\n" +
    "        <br>\n" +
    "\n" +
    "        <p><b>What will happen to me if I take part?</b><p>\n" +
    "        <p>\n" +
    "            You will play one or more online computer games and answer some survey questionairres which will last approximately 60 minutes.\n" +
    "            Remember, you are free to withdraw at any time without giving a reason.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>What are the possible disadvantages and risks of taking part?</b><p>\n" +
    "        <p>\n" +
    "            The task will you complete does not pose any known risks.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>What are the possible benefits of taking part?</b><p>\n" +
    "        <p>\n" +
    "            While there are no immediate benefits to taking part, your participation in this research will help us\n" +
    "        understand how people make decisions and this could have benefits for our understanding of mental health problems.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>Complaints</b><p>\n" +
    "        <p>\n" +
    "        If you wish to complain or have any concerns about any aspect of the way you have been approached or treated\n" +
    "        by members of staff, then the research UCL complaints mechanisms are available to you. In the first instance,\n" +
    "        please talk to the <a href=\"mailto:e.russek@ucl.ac.uk\">researcher</a> or the chief investigator\n" +
    "        (<a href=\"mailto:q.huys@ucl.ac.uk\">Dr Quentin Huys</a>) about your\n" +
    "        complaint. If you feel that the complaint has not been resolved satisfactorily, please contact the chair of\n" +
    "        the <a href=\"mailto:ethics@ucl.ac.uk\">UCL Research Ethics Committee</a>.\n" +
    "\n" +
    "        If you are concerned about how your personal data are being processed please contact the data controller\n" +
    "        who is <a href=\"mailto:data-protection@ucl.ac.uk\">UCL</a>.\n" +
    "        If you remain unsatisfied, you may wish to contact the Information Commissioner Office (ICO).\n" +
    "        Contact details, and details of data subject rights, are available on the\n" +
    "        <a href=\"https://ico.org.uk/for-organisations/data-protection-reform/overview-of-the-gdpr/individuals-rights\">ICO website</a>.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>What about my data?</b><p>\n" +
    "        <p>\n" +
    "        This local privacy notice sets out the information that applies to this particular study. Further information on how UCL uses participant information can be found in our general privacy notice: \n \n " +
    "        For participants in research studies, click <a href=\"https://www.ucl.ac.uk/legal-services/privacy/ucl-general-research-participant-privacy-notice\">here</a>    \n \n   " +
    "        The information that is required to be provided to participants under data protection legislation (GDPR and DPA 2018) is provided across both the local and general privacy notices. \n" +

    "        To help future research and make the best use of the research data you have given us (such as answers" +
    "        to questionnaires) we may keep your research data indefinitely and share these.  The data we collect will\n" +
    "        be shared and held as follows:<br> \n" +
    "        In publications, your data will be anonymised, so you cannot be identified. <br> \n" +
    "        In public databases, your data will be anonymised (your personal details will be removed and a code used e.g. 00001232, instead of your User ID) <br>" +
    "\n" +
    "         Personal data is any information that could be used to identify you, such as your User ID.  When we collect your data, your User ID will be replaced with a non-identifiable random ID number. No personally identifying data will be stored \n" +
    "        If there are any queries or concerns please do not hesitate to contact <a href=\"mailto:e.russek@ucl.ac.uk\">Dr Evan Russek</a>.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>If you are happy to proceed please read the statement below and click the boxes to show that you\n" +
    "            consent to this study proceeding</b><p>\n" +
    "\n" +
    "        <label class=\"container\">I have read the information above, and understand what the study involves.\n" +
    "            <input type=\"checkbox\" id=\"consent_checkbox2\">\n" +
    "            <span class=\"checkmark\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <label class=\"container\">I understand that my anonymised/pseudonymised personal data can be shared with others\n" +
    "            for future research, shared in public databases and in scientific reports.\n" +
    "            <input type=\"checkbox\" id=\"consent_checkbox3\">\n" +
    "            <span class=\"checkmark\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <label class=\"container\">I understand that I am free to withdraw from this study at any time without\n" +
    "            giving a reason and this will not affect my future medical care or legal rights.\n" +
    "            <input type=\"checkbox\" id=\"consent_checkbox4\">\n" +
    "            <span class=\"checkmark\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <label class=\"container\">I understand the potential benefits and risks of participating, the support available\n" +
    "            to me should I become distressed during the research, and who to contact if I wish to lodge a complaint.\n" +
    "            <input type=\"checkbox\" id=\"consent_checkbox5\">\n" +
    "            <span class=\"checkmark\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <label class=\"container\">I understand the inclusion and exclusion criteria in the Information Sheet.\n" +
    "            I confirm that I do not fall under the exclusion criteria.\n" +
    "            <input type=\"checkbox\" id=\"consent_checkbox6\">\n" +
    "            <span class=\"checkmark\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <label class=\"container\">I agree that the research project named above has been explained to me to my\n" +
    "            satisfaction and I agree to take part in this study\n" +
    "            <input type=\"checkbox\" id=\"consent_checkbox7\">\n" +
    "            <span class=\"checkmark\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <br><br>\n" +
    "        <button type=\"button\" id=\"start\" class=\"submit_button\">continue</button>\n" +
    "        <br><br>";


document.getElementById("start").onclick = check_consent;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    alert("Sorry, this experiment does not work on mobile devices");
    document.getElementById('consent').innerHTML = "";
}
