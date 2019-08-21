// firebase stuff
firebase.firestore().enablePersistence()
.catch(function(err) {
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
    }
});

// Sign in
firebase.auth().signInAnonymously();

// User ID
var uid;

// When signed in, get the user ID
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    uid = user.uid;
  }
});

// create a reference to the database
var db = firebase.firestore();

db.collection("tasks").doc('new_task').collection('subjects').doc(uid).set({
    subjectID: subjectID,  // this refers to the subject's ID from prolific
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
})

db.collection("tasks").doc('new_task').collection('subjects').doc(uid).update({
    total_points: number_of_points
});


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
//timeline = timeline.concat(instruc_timeline1);
timeline.push(end_screen);

timeline = task2_timeline.slice(0,5);

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
     db.collection('gambletask').doc('run1').collection('subjects').doc(uid).set(task_data)

     //collection('trial_data').doc('trial_' + trial_data.trial_number.toString()).set({trial_data});


     jsPsych.data.get().localSave('csv','evan_practice_new.csv');
}
});
