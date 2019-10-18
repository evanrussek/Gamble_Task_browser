// this should be a function to be called by setupdb.js
function define_trials(start_block){

// this start block thing has to be changed for naming and filtering...

// fix trial number and block number for filtering ... 

console.log(start_block)
if (typeof start_block == 'undefined'){
  console.log('this is undefined')
  start_block = 1;
}

console.log(start_block)


seed = 'Seed for subject ' + subjectID;
Math.seedrandom(seed);

function round5(x)
{
    return Math.ceil(x/5)*5;
}

function round10(x)
{
    return Math.ceil(x/10)*10;
}



function rand_gen_rew_quiz_main(loss_trial){

  // generate a reward trial as well
  // set each outcome reward
  //
  if (typeof loss_trial == 'undefined'){
    loss_trial = Math.random() < .5;
  }

  var tv_idx  = Math.round((all_win_amounts.length - 1)*Math.random());
  var safe_idx = Math.round(1*Math.random());
  var t_val = all_win_amounts[tv_idx]; //+ -5 + Math.round(10*Math.random());
  var other_val = 0; //Math.round(8*Math.random());
  var safe_val = all_win_safe_vals[safe_idx];// + - 5 +Math. round(10*Math.random());
  var lure_val = -50 + round10(100*Math.random())
  if (lure_val == t_val){lure_val = lure_val + 5};
  if (lure_val == safe_val){lure_val = lure_val + 5};

  if (loss_trial){t_val = -1*t_val; safe_val = -1*safe_val; other_val = -1*other_val};
  if (Math.random() < .5){o1_val = t_val, o2_val = other_val}
  else{o1_val = other_val, o2_val = t_val}

  var these_outcome_vals = [o1_val, o2_val, safe_val];
  var these_outcome_names = [outcome_names[0], outcome_names[1], outcome_names[2]];
  var these_outcome_imgs = [outcome_images[0], outcome_images[1], outcome_images[2]];


  var outcome_idx = Math.round(2*Math.random());
  var this_outcome_val = these_outcome_vals[outcome_idx];
  var this_outcome_img = these_outcome_imgs[outcome_idx];
  var this_outcome_text = these_outcome_names[outcome_idx];

  var all_other_vals = [o1_val, o2_val].concat([safe_val, lure_val]);
  all_other_vals.splice(outcome_idx,1);

 var use_image = (Math.random() < .5);

 this_trial = {
   type: 'evan-run-trial',

   data:{
     phase:'REW TEST 1',
   },
   first_stage: 1,
   last_stage:1,
   show_money_val: true,
   allow_reject: true,
   // these define the trial in the frame useful for analysis
   safe_val_base: all_win_safe_vals[sv_idx], // not the actual val
   p_trigger: all_prob_o1[p_idx], // here p_o1 corresponds to the trigger prob
   trigger_val: all_win_amounts[tv_idx], // win trial
   o1_trigger: null,
   safe_noise: null,
   trigger_noise: null,
   other_noise: null,
   /// define it in terms useful for actually running the trial
   /// which stimulus do we want?
   p_o1: 0,
   safe_val: safe_val,
   o1_val: o1_val, // because O1 is the trigger
   o2_val: o2_val,
   ///
   o1_image: outcome_images[0], // set per subject, using subject number -- need to counterbalance this...
   o2_image: outcome_images[1], //
   safe_image: outcome_images[2],
   // this depends on the proability...
   choice_image: choice_images[1] // each choice image corresponds to a probability for o1
 }


  var reward_quiz = {
    type: 'evan-reward-quiz',
    outcome_image: this_outcome_img,
    outcome_name: this_outcome_text,
    outcome_val: this_outcome_val,
    other_vals: all_other_vals,
    use_image: use_image,
    data: {}
  }

  return([this_trial, reward_quiz])
}



function rand_gen_trial(loss_trial){

  // generate a reward trial as well
  // set each outcome reward
  //

  // generate a reward trial as well
  // set each outcome reward
  //
  if (typeof loss_trial == undefined){
    loss_trial = Math.random() < .5;
  }

  var tv_idx  = Math.round((all_win_amounts.length - 1)*Math.random());
  var safe_idx = Math.round(1*Math.random());
  var t_val = all_win_amounts[tv_idx]; //+ -5 + Math.round(10*Math.random());
  var other_val = 0; //Math.round(8*Math.random());
  var safe_val = all_win_safe_vals[safe_idx];// + - 5 +Math. round(10*Math.random());
  var lure_val = -50 + round10(100*Math.random())
  if (lure_val == t_val){lure_val = lure_val + 5};

  if (loss_trial){t_val = -1*t_val; safe_val = -1*safe_val; other_val = -1*other_val};
  if (Math.random() < .5){o1_val = t_val, o2_val = other_val}
  else{o1_val = other_val, o2_val = t_val}

  var these_outcome_vals = [o1_val, o2_val, safe_val];
  var these_outcome_names = [outcome_names[0], outcome_names[1], outcome_names[2]];
  var these_outcome_imgs = [outcome_images[0], outcome_images[1], outcome_images[2]];


  var outcome_idx = Math.round(2*Math.random());
  var this_outcome_val = these_outcome_vals[outcome_idx];
  var this_outcome_img = these_outcome_imgs[outcome_idx];
  var this_outcome_text = these_outcome_names[outcome_idx];

  var all_other_vals = [o1_val, o2_val].concat([safe_val, lure_val]);
  all_other_vals.splice(outcome_idx,1);

 var use_image = (Math.random() < .5);
 var choice_number = 1 + Math.round(3*Math.random());


 this_trial = {
   type: 'evan-run-trial',

   data:{
     phase:'REW TEST 1',
   },
   first_stage: 1,
   last_stage:4,
   show_money_val: true,
   allow_reject: true,
   // these define the trial in the frame useful for analysis
   safe_val_base: all_win_safe_vals[sv_idx], // not the actual val
   p_trigger: all_prob_o1[p_idx], // here p_o1 corresponds to the trigger prob
   trigger_val: all_win_amounts[tv_idx], // win trial
   o1_trigger: null,
   safe_noise: null,
   trigger_noise: null,
   other_noise: null,
   /// define it in terms useful for actually running the trial
   /// which stimulus do we want?
   p_o1: all_prob_o1[choice_number - 1],
   safe_val: safe_val,
   o1_val: o1_val, // because O1 is the trigger
   o2_val: o2_val,
   ///
   o1_image: outcome_images[0], // set per subject, using subject number -- need to counterbalance this...
   o2_image: outcome_images[1], //
   safe_image: outcome_images[2],
   // this depends on the proability...
   choice_image: choice_images[choice_number - 1], // each choice image corresponds to a probability for o1
   show_prompt: true
 }

  return(this_trial)
}


// this generates a trial for the main task...
var gen_test_trial = function(o1_trig, prob_trig_idx, trig_val, matched_safe, safe_val_base){

  //if (typeof block_number == "undefined"){
  //  block_number = 0;
  //}

  // need to define choice number, p_o1, o1_val, o2_val (that's it?)
  var prob_trig = all_prob_trig[prob_trig_idx];


  if (trig_val > 0){
    var other_noise = 0; //Math.round(5*Math.random());
    var gl_type = 'gain';
  } else {
      var other_noise = 0; //-1*Math.round(5*Math.random());
      var gl_type = 'loss';
  }


  if (matched_safe){
    var safe_val_base = round5(Math.round(prob_trig*trig_val));
    // set the noise...
    var safe_noise = 0// Math.round(3*Math.random() - 1.5);
    var trigger_noise = 0//Math.round(3*Math.random() - 1.5);
    if (trig_val > 0){
      var other_noise = 0//Math.round(2*Math.random());
    }else{
      var other_noise = 0//-1*Math.round(2*Math.random());
    }
  } else{
    var safe_noise = 0//Math.round(10*Math.random() - 5);
    var trigger_noise = 0//Math.round(10*Math.random() - 5);
  }


  if (o1_trig){
    // o1 is the trigger, o2 is 0
    var o1_val_base = round5(trig_val);
    var o1_val = o1_val_base + trigger_noise;
    var o2_val_base = 0;
    var o2_val = o2_val_base + other_noise;
    var p_o1 = prob_trig;
    var choice_number = 1 + prob_trig_idx; //
  } else{
    // o2 is the trigger, o1 is 0
    var o1_val_base = 0;
    var o1_val = o1_val_base + other_noise;
    var o2_val_base = round5(trig_val);
    var o2_val = o2_val_base + trigger_noise;
    var p_o1 = 1 - prob_trig;
    var choice_number = 1 + (3 - prob_trig_idx);
  }

  this_trial = {
      type: 'evan-run-trial',

      data: {
        // these define the trial in the frame useful for analysis
        safe_val_base: safe_val_base, // not the actual val
        safe_val_actual: safe_val_base + safe_noise,
        p_trigger: prob_trig, // here o2 is the trigger
        trigger_val_base: trig_val,
        trigger_val_actual: trig_val + trigger_noise,
        o1_trigger: o1_trig,
        safe_noise: safe_noise,
        trigger_noise: trigger_noise,
        other_noise: other_noise,
        phase:'TEST',
        matched_safe: matched_safe,
        gl_type: gl_type,
        choice_number: choice_number,
      //  block_number: block_number
      },

      first_stage: 1,
      last_stage:4,
      show_money_val: true,
      allow_reject: true,
      p_o1: p_o1, // this is always the same
      safe_val: safe_val_base + safe_noise,
      o1_val: o1_val,
      o2_val: o2_val, // because O2 is the trigger
      o1_image: outcome_images[0],
      o2_image: outcome_images[1],
      safe_image: outcome_images[2],
      choice_image: choice_images[choice_number - 1]
    }
    return this_trial;
}

// need a function to add data from a block...

var add_save_block_data = function(this_trial){
  this_trial.on_finish = function(){
    var this_block_data = jsPsych.data.get().filter({block_number: this.data.block_number}).json()
    console.log('saving this block')
    db.collection('gambletask').doc('MEG_1').collection('computers').
                  doc(uid).collection('subjects').doc(subjectID).collection('taskdata')
                  .doc('block_' + this.data.block_number.toString()).set({
      block_data: this_block_data
    })
  }
}
// generates 160 non-matched trials
var win_non_matched_trials = []; // remake the other trials...
var loss_non_matched_trials = []; // remake the other trials...

// win_o1_trig_trials
for (var rep = 0; rep < 2; rep++){
  for (var sv_idx = 0; sv_idx < all_win_safe_vals.length; sv_idx++){
    for (var w_idx = 0; w_idx < all_win_amounts.length; w_idx++){
      for (var p_idx = 0; p_idx < all_prob_trig.length; p_idx++){
        if (all_win_safe_vals[sv_idx] < (all_win_amounts[w_idx] - 10)){

          var nm_w_o1 =  gen_test_trial(true, p_idx, all_win_amounts[w_idx], false, all_win_safe_vals[sv_idx]);
          var nm_w_o2 =  gen_test_trial(false, p_idx, all_win_amounts[w_idx], false, all_win_safe_vals[sv_idx]);
          win_non_matched_trials = win_non_matched_trials.concat([nm_w_o1, nm_w_o2]);

          var nm_l_o1 =  gen_test_trial(true, p_idx, all_loss_amounts[w_idx], false, all_loss_safe_vals[sv_idx]);
          var nm_l_o2 =  gen_test_trial(false, p_idx, all_loss_amounts[w_idx], false, all_loss_safe_vals[sv_idx]);

          loss_non_matched_trials = loss_non_matched_trials.concat([nm_l_o1, nm_l_o2]);
        }
      }
    }
  }
}

// block the position of things...

//all_loss_trials = loss_matched_trials.concat(loss_non_matched_trials);
//all_loss_trials = jsPsych.randomization.repeat(all_loss_trials,1);

// need to actually copy these,
all_loss_trials = jsPsych.randomization.repeat(loss_non_matched_trials,1);
all_win_trials = jsPsych.randomization.repeat(win_non_matched_trials,1);
// the task is

console.log(all_loss_trials)
console.log(all_win_trials)


// 36 trials per block ( 14 win and 14 loss) // block the safe?
// we're saving data!
// now, let's get it so that we start from a certain point...

// block size . ---
var n_blocks = 8;

// 4 win blocks and 4 loss blocks...
var block_size = all_loss_trials.length/(n_blocks/2);

var all_trials = []

var loss_first = 1;
var quiz_p = 1;


if (loss_first){
  for (var i = 0; i < 4; i++){
    var final_text_trial = build_text_trial("Great work! ", "Let's take a short break", "",true);
    var intro_text_trial = build_text_trial("Starting block " + (2*i + 1) + " of 8.","Games in this block will all have negative points.","Collecting more of these will make your bonus smaller.",false);
    var loss_block = [intro_text_trial];
    loss_block = loss_block.concat(all_loss_trials.splice(0,block_size));
    var c = Math.round(loss_block.length/3);

    var t_new1 = 0;
    var a = loss_block.length;
    for (var t = 1; t < a; t++){
      t_new1 = t_new1 + 1;
      if (Math.random() < quiz_p){
        if (loss_block[t_new1].type == "evan-run-trial"){
          var quiz = rand_gen_rew_quiz_main(true);
          loss_block.splice(t_new1,0, quiz[0], quiz[1]);
          t_new1 = t_new1 + 1;
        }
      }
    }
    loss_block.push(final_text_trial);

    // add the loss block
    for (var t = 0; t < loss_block.length; t++){
      loss_block[t].data.block_number = 2*i + 1;
    }
    add_save_block_data(loss_block[loss_block.length - 2])

    all_trials = all_trials.concat(loss_block);
    //////////////////////////////////////////////////////////////////
    var final_text_trial = build_text_trial("Great work! ", "Let's take a short break", "", true);
    var intro_text_trial = build_text_trial("Starting block " + (2*i + 2) + " of 8.","The next set of games will all have positive points.","Collecting more of these will make your bonus larger.",false);
    var win_block = [intro_text_trial];
    win_block = win_block.concat(all_win_trials.splice(0,block_size));
    var b = Math.round(win_block.length/3);

    var t_new1 = 0;
    var a = win_block.length;
    for (var t = 1; t < a; t++){
      t_new1 = t_new1 + 1;
      if (Math.random() < quiz_p){
        if (win_block[t_new1].type == "evan-run-trial"){
          var quiz = rand_gen_rew_quiz_main(false);
          win_block.splice(t_new1,0, quiz[0], quiz[1]);
          t_new1 = t_new1 + 1;
        }
      }
    }
    win_block.push(final_text_trial);
    // add the win block
    for (var t = 0; t < win_block.length; t++){
      win_block[t].data.block_number = 2*i + 2;
    } // save data on the last trial.
    add_save_block_data(win_block[win_block.length - 2])
    all_trials = all_trials.concat(win_block);
  }
}else{
  for (var i = 0; i < 4; i++){
    /// win
    var final_text_trial = build_text_trial("Great work! ", "Let's take a short break", "", true);
    var intro_text_trial = build_text_trial("Starting block " + (2*i + 1) + " of 8.","The next set of games will all have positive points.","Collecting more of these will make your bonus larger.",false);
    var win_block = [intro_text_trial];
    win_block = loss_block.concat(all_win_trials.splice(0,block_size));

    var b = Math.round(win_block.length/3);
    //win_block.splice(b,0,build_text_trial("Great work!.","Let's take a 5 second break.","",false))

    var t_new1 = 0;
    var a = win_block.length;
    for (var t = 1; t < a; t++){
      t_new1 = t_new1 + 1;
      if (Math.random() < quiz_p){
        if (win_block[t_new1].type == "evan-run-trial"){
          var quiz = rand_gen_rew_quiz_main(false);
          win_block.splice(t_new1,0, quiz[0], quiz[1]);
          t_new1 = t_new1 + 1;
        }
      }
    }

    win_block.push(final_text_trial);
    // add the win block
    for (var t = 0; t < win_block.length; t++){
      win_block[t].data.block_number = 2*i + 1;
    }
    add_save_block_data(win_block[win_block.length - 2])
    all_trials = all_trials.concat(win_block);

    // loss
    var final_text_trial = build_text_trial("Great work! ", "Let's take a short break", "", true);
    var intro_text_trial = build_text_trial("Starting block " + (2*i + 2) + " of 8.","Games in this block will all have negative points.","Collecting more of these will make your bonus smaller.",false);
    var loss_block = [intro_text_trial];
    loss_block = loss_block.concat(all_loss_trials.splice(0,block_size));
    var c = Math.round(loss_block.length/3);
    //loss_block.splice(b,0,build_text_trial("Great work!.","Let's take a 5 second break.","",false))

    var t_new1 = 0;
    var a = loss_block.length;
    for (var t = 1; t < a; t++){
      t_new1 = t_new1 + 1;
      if (Math.random() < quiz_p){
        if (loss_block[t_new1].type == "evan-run-trial"){
          var quiz = rand_gen_rew_quiz_main(true);
          loss_block.splice(t_new1,0, quiz[0], quiz[1]);
          t_new1 = t_new1 + 1;
        }
      }
    } // add to the end of each block...
    // add the win block
    loss_block.push(final_text_trial);
    for (var t = 0; t < loss_block.length; t++){
      loss_block[t].data.block_number = 2*i + 2;
    }
    add_save_block_data(loss_block[loss_block.length - 2])
    all_trials = all_trials.concat(loss_block);
  }
} // the block is listed...

main_task = [];
// insert a half way through

var trial_number = 0;
for (var tn = 0; tn < all_trials.length; tn++){
  this_trial = all_trials[tn]
  if (this_trial.type == "evan-run-trial"){
    trial_number = trial_number + 1;
    this_trial.data.trial_number = trial_number;
  }
  main_task.push(this_trial)
}

// add more than just half way marks - maybe 1/4 parts
quart_text = build_text_trial("Great job! You're a quarter of the way through this task.","","",true);
half_way_txt = build_text_trial("Great job! You're half way through this task.","","",true);
three_quart_text = build_text_trial("Great job! You're three quarters of the way through this task.","","",true);

// does the task end appropriately?

//main_task.splice(Math.round(main_task.length/4), 0, quart_text)
//main_task.splice(Math.round(main_task.length/2)+1, 0, half_way_txt)
//main_task.splice(Math.round(3*main_task.length/4)+2, 0, three_quart_text)

// add data saving into the end of each block. also allow starting the task from any block.... // then random number generator, etc.

task2_timeline = main_task;
// filter so we're at the start block...
task2_timeline = task2_timeline.filter(function(el){return el.data.block_number >= start_block})

/* create timeline */
var timeline = [];

var full_screen = {
  type: 'fullscreen',
  fullscreen_mode: true
};


// add to the end of every block



// put together the full timeline
timeline = [];
timeline.push(full_screen);
timeline = timeline.concat(task2_timeline);
//timeline.push(end_screen);

var all_task_images = [];

// want to make a function to run a block in which we run each image 20 times - we'll do 5 blocks.


var make_loc_block = function(block_number){

  var n_reps = 1;

  var slot_machine_arr = [1, 1, 1, 1, 0, 0, 0];
  var img_numbers = [1,2,3,4, 1,2,3];
  var theseInds = [0, 1, 2, 3, 4, 5, 6];
  var shuffledInds = jsPsych.randomization.repeat(theseInds,1);


  var block_trials = [];
  for (var im_idx = 0; im_idx < shuffledInds.length; im_idx++){
    //var this_im_idx = shuffledInds[]
    var all_names = choice_names.concat(outcome_names);
    all_names.splice(im_idx,1);
    console.log(all_names)
    if (slot_machine_arr[im_idx] == 1){
      var this_image = choice_images[img_numbers[im_idx] -1];
      var this_image_name = choice_names[img_numbers[im_idx] -1];
      var this_slot_machine = true;
      //var this_other_name = ... come up with that...
    }else{
      var this_image = outcome_images[img_numbers[im_idx] - 1];
      var this_image_name = outcome_names[img_numbers[im_idx] - 1];
      var this_slot_machine = false;
    }
    console.log(this_image)
    // remove the other name from all_names and select a random name from the list...
    var this_other_name = jsPsych.randomization.sampleWithReplacement(all_names, 1);

    var loc_trial = {
      type: 'evan-localizer-trial',
      image: this_image,
      image_name: this_image_name,
      other_name: this_other_name,
      slot_machine: this_slot_machine,
      data: {
        img_number: img_numbers[im_idx],
        block_number: ('loc_' + block_number)
      }
    }
    block_trials.push(loc_trial);
  }

  block_trials = jsPsych.randomization.repeat(block_trials,n_reps);

  add_save_block_data(block_trials[block_trials.length - 1])

  return block_trials
}

var n_loc_blocks = 5;
var loc_exp = [];
for (var i = 0; i < n_loc_blocks; i++){
  var block_num = i + 1;
  var this_loc_block  = make_loc_block(block_num);
  var final_text_trial = build_text_trial("Great work! ","You've completed " + block_num + " of 5 blocks.", "Let's take a short break",true);
  this_loc_block.push(final_text_trial);
  loc_exp = loc_exp.concat(this_loc_block)

}

  loc_block = make_loc_block(1);
  timeline = [full_screen];
  timeline = timeline.concat(loc_exp)
  /* start the experiment */
  jsPsych.init({
   timeline: timeline,
   show_preload_progress_bar: false,
   on_finish: function() {
     jsPsych.data.get().localSave('csv','evan_practice_new.csv');
  }
});

}
