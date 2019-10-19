// need to add the consent stuff.

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
var uid;

// Consent form
var check_consent = function (elem) {
  if ($('#consent_checkbox1').is(':checked') && $('#consent_checkbox2').is(':checked') &&
      $('#consent_checkbox3').is(':checked') && $('#consent_checkbox4').is(':checked') &&
      $('#consent_checkbox5').is(':checked') && $('#consent_checkbox6').is(':checked') &&
      $('#consent_checkbox7').is(':checked'))
      {
          // When signed in, get the user ID
          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              uid = user.uid;
              task(uid);
            }
          });
      }

  else {
      alert("Unfortunately you will not be unable to participate in this research study if you do " +
          "not consent to the above. Thank you for your time.");
      return false;
  }
};

// want to create a subject ID - either from ...

// Sign in


function task(uid){

    // get or generate a subjectID

    if (window.location.search.indexOf('PROLIFIC_PID') > -1) {
      var subjectID = getQueryVariable('PROLIFIC_PID');
    }
    else {
        var subjectID = Math.floor(Math.random() * (2000000 - 0 + 1)) + 0; // if no prolific ID, generate random ID (for testing)
    }

    // create a reference to the database
    var db = firebase.firestore();

    console.log(uid)
    db.collection('gambletask').doc('run3_v').collection('subjects').doc(uid).set({
        last_subjectID: subjectID,  // this refers to the subject's ID from prolific
        last_date: new Date().toLocaleDateString(),
        last_time: new Date().toLocaleTimeString()
    })

    db.collection('gambletask').doc('run3_v').collection('subjects').doc(uid).collection('rounds').doc(subjectID.toString()).set({
        subjectID: subjectID,  // this refers to the subject's ID from prolific/
        date: new Date().toLocaleDateString(),
        start_time: new Date().toLocaleTimeString(),
        end_time: null,
        task_data: null,
        bonus_data:null
    })


    /* */
    /* */
    /* create timeline */
    var timeline = [];

    var full_screen = {
      type: 'fullscreen',
      fullscreen_mode: true
    };


    var all_task_images = [];
    all_task_images = all_task_images.concat(pos_outcome_images);
    all_task_images = all_task_images.concat(pos_choice_images);
    all_task_images = all_task_images.concat(instruction_pages_1a);
    all_task_images = all_task_images.concat(schematic_slide);
    all_task_images = all_task_images.concat(instruction_pages_2a);
    all_task_images = all_task_images.concat(instruction_pages_2b);
    all_task_images = all_task_images.concat(instruction_pages_2c);

     // compute bonus for the main task...
     var end_screen = {
     	type: 'html-button-response',
         timing_post_trial: 0,
     	//    button_html: '<button class="jspsych-btn" style="display:none">%choice%</button>',
         choices: ['End Task'],
     	on_start: function(){
            var task_data = jsPsych.data.get().json();
            db.collection('gambletask').doc('run3_v').collection('subjects').doc(uid).collection('rounds').doc(subjectID.toString()).update({
                task_data: task_data})
            },
         is_html: true,
         stimulus: function(){
     		var point_vals = jsPsych.data.get().filter({phase: 'TRAIN CHOICE'}).select('points_received').values
     		if (point_vals.length > 0){
     			var practice_bonus_trial_points = jsPsych.randomization.sampleWithoutReplacement(point_vals, 4)
     			var practice_bonus_trial_points_avg =  Math.round(arrAvg(practice_bonus_trial_points));
     			var practice_quiz_pct = jsPsych.data.get().filter({trial_type: 'evan-info-quiz'}).select('correct').mean();
     			var practice_quiz_pct = Math.round(100*practice_quiz_pct);
     		} else{
     			var practice_bonus_trial_points_avg= 0
     			var practice_quiz_pct = 0;
     		}


     		var test_point_vals = jsPsych.data.get().filterCustom(function(trial){
     											return ((trial.points_received != null) & (trial.phase == 'TEST'));
     										}).select('points_received').values
     		if (test_point_vals.length > 0){
     			var rand_test_point_vals = jsPsych.randomization.sampleWithoutReplacement(test_point_vals, 4)
     			var test_bonus_trial_points_avg =  Math.round(arrAvg(rand_test_point_vals));
     			var test_quiz_perf = jsPsych.data.get().filter({trial_type: 'evan-reward-quiz'}).select('correct').mean()
     			var test_quiz_pct = Math.round(100*test_quiz_perf);
     		}else{
     			var test_quiz_pct = 0;
     			var test_bonus_trial_points_avg = 0;
     		}

     		// write this data
     		var bonus_data = {
     			'practice_quiz_pct': practice_quiz_pct,
     			'practice_bonus_trial_points_avg': practice_bonus_trial_points_avg,
     			'test_quiz_pct': test_quiz_pct,
     			'test_bonus_trial_points_avg': test_bonus_trial_points_avg
     		};
     		jsPsych.data.write(bonus_data)
            var task_data = jsPsych.data.get().json();
            db.collection('gambletask').doc('run3_v').collection('subjects').doc(uid).collection('rounds').doc(subjectID.toString()).update({
                bonus_data: bonus_data,
                end_time: new Date().toLocaleTimeString()})
     		var string = 'You have finished the task. Thank you for your contribution to science! \
     					For the attention checks  you got ' + test_quiz_pct + ' percent correct. On four randomly selected games, \
     					the average number of points you collected was '  + test_bonus_trial_points_avg + '. \
     					 Your bonus will be based on these results. You should receive your payment and bonus shortly. <b> PLEASE CLICK END TASK TO SUBMIT THE TASK TO PROLIFIC </b>.';

     		return string;
     	},
        on_finish: function(){
            window.location = "https://app.prolific.co/submissions/complete?cc=V23QBQM3";
        }
     }

     // put together the full timeline
      timeline = [];
      timeline.push(full_screen);
      timeline = timeline.concat(instruc_timeline1);
      //timeline = timeline.concat(task1_timeline);
      timeline = timeline.concat(instruc_timeline2);
      timeline = timeline.concat(task2_timeline);
      //timeline = task2_timeline.slice(0,2);
      timeline.push(end_screen);
      //timeline = [end_screen];


    /* start the experiment */ // at end, write the data to the database
    jsPsych.init({
     timeline: timeline,
     preload_images: all_task_images,
     show_preload_progress_bar: true,
     on_finish: function() {
         //var task_data = jsPsych.data.get().json();
         console.log('finished')
         //console.log(task_data)
         //console.log(uid)
         // create a new run of this for if someone already did it...
         //db.collection('gambletask').doc('run1').collection('subjects').doc(uid).collection('rounds').doc(subjectID).set
         //db.collection('gambletask').doc('run1').collection('subjects').doc(uid).collection('rounds').doc(subjectID.toString()).update({
        //     task_data: task_data})
         //jsPsych.data.get().localSave('csv','evan_practice_new.csv');
     }
    });
}

document.getElementById('header_title').innerHTML = "Welcome";
document.getElementById('consent').innerHTML = "        <p><b>Who is conducting this research study?</b><p>\n" +
    "        <p>\n" +
    "        This research is being conducted by the Wellcome Centre for Human Neuroimaging and the Max Planck UCL Centre\n" +
    "        for Computational Psychiatry and Ageing Research. The lead researcher(s) for this project is\n" +
    "        <a href=\"mailto:e.russek@ucl.ac.uk\">Dr Evan Russek</a>. This study has been approved by the UCL Research Ethics Committee\n" +
    "        (project ID number 9929/003) and funded by the Wellcome Trust.\n" +
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
    "            You will play one or more online computer games, which will last approximately 65 minutes. You will receive\n" +
    "            at least £6.50 per hour for helping us out with an opportunity for an additional bonus depending on your choices. The amount may vary with the decisions you make in the games.\n" +
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
    "        (<a href=\"mailto:r.dolan@ucl.ac.uk\">Professor Ray Dolan</a>) about your\n" +
    "        complaint. If you feel that the complaint has not been resolved satisfactorily, please contact the chair of\n" +
    "        the <a href=\"mailto:ethics@ucl.ac.uk\">UCL Research Ethics Committee</a>.\n" +
    "\n" +
    "        If you are concerned about how your personal data are being processed please contact the data controller\n" +
    "        who is <a href=\"mailto:protection@ucl.ac.uk\">UCL</a>.\n" +
    "        If you remain unsatisfied, you may wish to contact the Information Commissioner’s Office (ICO).\n" +
    "        Contact details, and details of data subject rights, are available on the\n" +
    "        <a href=\"https://ico.org.uk/for-organisations/data-protection-reform/overview-of-the-gdpr/individuals-rights\">ICO website</a>.\n" +
    "        </p>\n" +
    "\n" +
    "        <p><b>What about my data?</b><p>\n" +
    "        <p>\n" +
    "            To help future research and make the best use of the research data you have given us (such as answers\n" +
    "        to questionnaires) we may keep your research data indefinitely and share these.  The data we collect will\n" +
    "        be shared and held as follows:<br>" +
    "            •\tIn publications, your data will be anonymised, so you cannot be identified.<br>" +
    "            •\tIn public databases, your data will be anonymised<br>" +
    "\n" +
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
