// setup the fire base database stuff
var subjectID = 'subj_1_10_18_2pm'
// things like date would be good as well

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
  define_trials(start_block);
}
});

var db = firebase.firestore();

// great...

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
