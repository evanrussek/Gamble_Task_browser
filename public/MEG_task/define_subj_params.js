// this could also be a trial // for the scanner, add the date and time, and other info

// define subject parameters and set up the db...
// want a screen that will ask this... (could also break up each time...)
//
// want to solicit this from the subject... // and to verify that this still works.
var quest = document.getElementById('experimenter-questionnaire');
document.body.appendChild(quest);

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
    if (start_phase == "LOC"){
           exp_block = start_block;
    }else if (start_phase == "LEARN"){
           exp_block = start_block + 5;
    } else if (start_phase == "TASK"){
           exp_block = start_block + 7;
    } else{
          console.log("WRONGE PHASE NAME");
    }

     subjectID = ('subj_MEG_' + subject_num)

     seed = 'Seed for subject ' + subjectID;
     Math.seedrandom(seed);

    // set condition here...
    cond_idx = subject_num%12;
    console.log('condition: ' + cond_idx)

     both_idx_vec = [[0,0], [0,1], [0,2],
                      [1,0], [1,1], [1,2],
                      [2,0], [2,1], [2,2],
                      [3,0], [3,1], [3,2],
                    ];

     choice_state_idx = both_idx_vec[cond_idx][0];//1; //1both_idx_vec[cond_idx][0]; // don't need
     outcome_state_idx = both_idx_vec[cond_idx][1];//1; //both_idx_vec[cond_idx][1];

     loss_first = (subject_num%2 == 1); // adjust this...

     instr_slides = 'Stimuli/MEG_slides_o' + outcome_state_idx;

     var pos_outcome_assigments = [[0, 1, 2], // Scissors is safe
                               [2, 0, 1], // House is safe / keep this for this run...
                               [1, 2, 0]]; // Girl is safe

     // outcome_state_idx 0 -- Scissors is safe
     // outcome_state_idx 1 -- House is safe
     // outcome_state_idx 2 -- GIRL is safe

// make end part...

     var pos_choice_assignments = [[0,1,2,3],
                               [3,0,1,2],
                               [2,3,0,1],
                               [1,2,3,0]];


       choice_idx_vec = pos_choice_assignments[choice_state_idx]
       outcome_idx_vec = pos_outcome_assigments[outcome_state_idx];

       pos_outcome_names = ["GIRL", "HOUSE", "SCISSORS"];
       pos_choice_names = ["HAND", "PEPPER", "BUTTERFLY", "ZEBRA"];

       pos_outcome_images = ["Stimuli/Evan_Stimuli/Girl.png",
                         "Stimuli/Evan_Stimuli/House.png",
                         "Stimuli/Evan_Stimuli/Scissors.png"];

       pos_choice_images = ["Stimuli/Evan_Stimuli/Hand.png",
                         "Stimuli/Evan_Stimuli/Pepper.png",
                         "Stimuli/Evan_Stimuli/Butterfly.png",
                         "Stimuli/Evan_Stimuli/Zebra.png"];

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
       all_win_safe_vals = [20, 32, 44, 56];
       all_loss_safe_vals = [-20, -32, -44, -56];
       all_win_amounts = [47.5, 60, 75];
       all_loss_amounts = [-47.5, -60, -75];
       all_prob_trig = all_prob_o1;

       jsPsych.data.addProperties({subject: subject_num, choice_names: choice_names, outcome_names: outcome_names, loss_first: loss_first});
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
    subject_num = parseInt(researcher_inputs.subjectNumber.value);
    console.log(subject_num)
    // var env = researcher_inputs.env.value;
    start_phase = researcher_inputs.stage.value;
    console.log(start_phase)

    start_block = parseInt(researcher_inputs.run.value);
    console.log(start_block)

    set_other_vars();

}
