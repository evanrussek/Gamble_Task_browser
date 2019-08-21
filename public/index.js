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

// want to create a subject ID - either from ...

// Sign in



firebase.auth().signInAnonymously();

// User ID
var uid;

// When signed in, get the user ID
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    uid = user.uid;
  }
  task(uid);
});


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
    db.collection('gambletask').doc('run1').collection('subjects').doc(uid).collection('rounds').doc(subjectID.toString()).set({
        subjectID: subjectID,  // this refers to the subject's ID from prolific/
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        task_data: null
    })



    //db.collection("tasks").doc('new_task').collection('subjects').doc(uid).update({/
    //    total_points: number_of_points
    //});


    /* */
    /* create timeline */
    var timeline = [];

    var full_screen = {
      type: 'fullscreen',
      fullscreen_mode: true
    };

    // put together the full timeline
    timeline = [];
    timeline.push(full_screen);
    timeline = timeline.concat(task2_timeline.slice(0,2));

    //timeline = timeline.concat(instruc_timeline1);
    //timeline.push(end_screen);

    //timeline = task2_timeline.slice(0,3);

    var all_task_images = [];
    all_task_images = all_task_images.concat(pos_outcome_images);
    all_task_images = all_task_images.concat(pos_choice_images);
    all_task_images = all_task_images.concat(instruction_pages_1a);
    all_task_images = all_task_images.concat(instruction_pages_1b);
    all_task_images = all_task_images.concat(instruction_pages_1c);
    all_task_images = all_task_images.concat(instruction_pages_2a);
    all_task_images = all_task_images.concat(instruction_pages_2b);
    all_task_images = all_task_images.concat(instruction_pages_2c);


    /* start the experiment */ // at end, write the data to the database
    jsPsych.init({
     timeline: timeline,
     preload_images: all_task_images,
     show_preload_progress_bar: true,
     on_finish: function() {
         var task_data = jsPsych.data.get().json();
         console.log(task_data)
         console.log(uid)
         // create a new run of this for if someone already did it...
         //db.collection('gambletask').doc('run1').collection('subjects').doc(uid).collection('rounds').doc(subjectID).set
         db.collection('gambletask').doc('run1').collection('subjects').doc(uid).collection('rounds').doc(subjectID.toString()).update({
             task_data: task_data})
         jsPsych.data.get().localSave('csv','evan_practice_new.csv');
     }
    });

}
