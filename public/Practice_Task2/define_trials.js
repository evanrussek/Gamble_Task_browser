// this should be a function to be called by setupdb.js
function define_trials(start_block){

// this start block thing has to be changed for naming and filtering...

// fix trial number and block number for filtering ...

//console.log(start_block)
if (typeof start_block == 'undefined'){
  console.log('this is undefined')
  start_block = 1;
}

//console.log(start_block)

function round5(x)
{
    return Math.ceil(x/5)*5;
}

function round2(x)
{
    return Math.ceil(x/2)*2;
}


function round10(x)
{
    return Math.ceil(x/10)*10;
}

var build_text_trial = function(line_1,line_2,line_3, wait_for_exp){
  var text_trial = {
    type: 'evan-display-text',
    line_1: line_1,
    line_2: line_2,
    line_3: line_3,
    wait_for_exp: wait_for_exp,
    data: {phase: 'INFO'} // note this shows up in main phase as well so isn't train per se
  }
  return text_trial;
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
var gen_test_trial = function(o1_trig, prob_trig_idx, trig_val, matched_safe, safe_val_base, trigger_noise, other_noise, safe_noise){

  //if (typeof block_number == "undefined"){
  //  block_number = 0;
  //}

  // need to define choice number, p_o1, o1_val, o2_val (that's it?)
  var prob_trig = all_prob_trig[prob_trig_idx];


  if (trig_val > 0){
//    var other_noise = round2(20*Math.random());
    var gl_type = 'gain';
  } else {
  //    var other_noise = -1*round2(20*Math.random());
      var gl_type = 'loss';
  }

  //var safe_noise = round2(30*Math.random() - 15);
  //var trigger_noise = round2(30*Math.random() - 15);


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
var win_non_matched_trials = []; // remake the other trials...
var loss_non_matched_trials = []; // remake the other trials...

//

// win_o1_trig_trials
for (var sv_idx = 0; sv_idx < all_win_safe_vals.length; sv_idx++){
  for (var w_idx = 0; w_idx < all_win_amounts.length; w_idx++){
    for (var p_idx = 0; p_idx < all_prob_trig.length; p_idx++){
      if (all_win_safe_vals[sv_idx] < (all_win_amounts[w_idx] - 10)){

      /// gen test trial... function(o1_trig, prob_trig_idx, trig_val, matched_safe, safe_val_base, trigger_noise, other_noise, safe_noise){
          var const_add = round2(Math.ceil(25*Math.random()));
          var tn = const_add + round2(Math.ceil(10*Math.random() - 5));
          var on = const_add + round2(Math.ceil(10*Math.random() - 5));
          var sn = const_add + round2(Math.ceil(10*Math.random() - 5));
          if (on < 0){ on = 0}

          for (var rep = 0; rep < 2; rep++){
            var nm_w_o1 =  gen_test_trial(true, p_idx, all_win_amounts[w_idx], false, all_win_safe_vals[sv_idx], tn, on, sn);
            win_non_matched_trials.push(nm_w_o1)
          }

          var const_add = round2(Math.ceil(25*Math.random()));
          var tn = const_add + round2(Math.ceil(10*Math.random() - 5));
          var on = const_add + round2(Math.ceil(10*Math.random() - 5));
          var sn = const_add + round2(Math.ceil(10*Math.random() - 5));
          if (on < 0){ on = 0}

          for (var rep = 0; rep < 2; rep++){
              var nm_w_o2 =  gen_test_trial(false, p_idx, all_win_amounts[w_idx], false, all_win_safe_vals[sv_idx], tn, on, sn)
              win_non_matched_trials.push(nm_w_o2)
          }

          var const_add = -1*round2(Math.ceil(25*Math.random()));
          var tn = const_add + round2(Math.ceil(10*Math.random() - 5));
          var on = const_add + round2(Math.ceil(10*Math.random() - 5));
          var sn = const_add + round2(Math.ceil(10*Math.random() - 5));
          if (on > 0){ on = 0}

          for (var rep = 0; rep < 2; rep++){
              var nm_l_o1 =  gen_test_trial(true, p_idx, all_loss_amounts[w_idx], false, all_loss_safe_vals[sv_idx], tn, on, sn);
              loss_non_matched_trials.push(nm_l_o1)
          }

          var const_add = -1*round2(Math.ceil(25*Math.random()));
          var tn = const_add + round2(Math.ceil(10*Math.random() - 5));
          var on = const_add + round2(Math.ceil(10*Math.random() - 5));
          var sn = const_add + round2(Math.ceil(10*Math.random() - 5));
          if (on > 0){ on = 0}

          for (var rep = 0; rep < 2; rep++){
              var nm_l_o2 =  gen_test_trial(false, p_idx, all_loss_amounts[w_idx], false, all_loss_safe_vals[sv_idx], tn, on, sn);
              loss_non_matched_trials.push(nm_l_o2)
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

//console.log(all_loss_trials)
//console.log(all_win_trials)


// 36 trials per block ( 14 win and 14 loss) // block the safe?
// we're saving data!
// now, let's get it so that we start from a certain point...

// block size . ---
var n_blocks = 8;

// 4 win blocks and 4 loss blocks...
var block_size = all_loss_trials.length/(n_blocks/2);

var all_trials = []

var loss_first = 1;

var quiz_p = 0;


if (loss_first){
  for (var i = 0; i < 1; i++){
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
      loss_block[t].data.block_number = 6 + 2*i + 1;
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
      win_block[t].data.block_number = 6 + 2*i + 2;
    } // save data on the last trial.
    add_save_block_data(win_block[win_block.length - 2])
    all_trials = all_trials.concat(win_block);
  }
}else{
  for (var i = 0; i < 1; i++){
    /// win
    var final_text_trial = build_text_trial("Great work! ", "Let's take a short break", "", true);
    var intro_text_trial = build_text_trial("Starting block " + (2*i + 1) + " of 8.","The next set of games will all have positive points.","Collecting more of these will make your bonus larger.",false);
    var win_block = [intro_text_trial];
    win_block = win_block.concat(all_win_trials.splice(0,block_size));

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
      win_block[t].data.block_number = 6 + 2*i + 1;
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
      loss_block[t].data.block_number = 6 + 2*i + 2;
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



// does the task end appropriately?

//main_task.splice(Math.round(main_task.length/4), 0, quart_text)
//main_task.splice(Math.round(main_task.length/2)+1, 0, half_way_txt)
//main_task.splice(Math.round(3*main_task.length/4)+2, 0, three_quart_text)

// add data saving into the end of each block. also allow starting the task from any block.... // then random number generator, etc.

task2_timeline = main_task;
// filter so we're at the start block...


/* create timeline */
var timeline = [];

var full_screen = {
  type: 'fullscreen',
  fullscreen_mode: true
};


// add to the end of every block


var all_task_images = [];

/////////////// LOCALIZER STUFF /////////////////////////////////////////////////////////////

var make_loc_block = function(block_number){

  var n_reps = 20;

  var slot_machine_arr = [1, 1, 1, 1, 0, 0, 0];
  var img_numbers = [1,2,3,4, 1,2,3];
  var theseInds = [0, 1, 2, 3, 4, 5, 6];
  var shuffledInds = jsPsych.randomization.repeat(theseInds,1);


  var block_trials = [];
  for (var im_idx = 0; im_idx < shuffledInds.length; im_idx++){
    //var this_im_idx = shuffledInds[]
    var all_names = choice_names.concat(outcome_names);
    all_names.splice(im_idx,1);
//    console.log(all_names)
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
//    console.log(this_image)
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
        block_number: block_number
      }
    }
    block_trials.push(loc_trial);
  }

  block_trials = jsPsych.randomization.repeat(block_trials,n_reps);

  add_save_block_data(block_trials[block_trials.length - 1])

  return block_trials
}

loc_pct_bonus = null;

var n_loc_blocks = 5;
var loc_exp = [];
for (var i = 0; i < n_loc_blocks; i++){
  var block_num = i + 1;
  var this_loc_block  = make_loc_block(block_num);
  var final_text_trial = build_text_trial(" ","You've completed " + block_num + " of 5 blocks.", "Let's take a short break",true);
  final_text_trial.data.block_number = block_num;
  final_text_trial.line_1 = function(){
    var this_block_number = block_num;//this.data.block_number;
    var prop_correct = jsPsych.data.get().filter({trial_type: 'evan-localizer-trial',
                                                block_number: this_block_number}).select('correct').mean()
    var pct_correct = Math.round(100*prop_correct);
    loc_pct_bonus = pct_correct;
    var str = "You answered " + pct_correct + "% of trials correctly";
    return str
  }
  //final_text_trial.data.block_number = block_num;
  this_loc_block.push(final_text_trial);
  loc_exp = loc_exp.concat(this_loc_block);
}


/////////////////////////////////// Structure TRAINING stuff //////////////////////////////////////

struc_pct_correct = null;
var make_struc_quiz_block = function(round_number, block_number, limit_time){ // need to alter this so that time and keyboard

  // let's

  var shuffled_idx = jsPsych.randomization.shuffle([0,1,2,3,4,5,6,7]);
  var choice_options = [1,2,3,4,1,2,3,4];
  var outcome_options = [1,1,1,1,2,2,2,2];
  var p_vec = [.2, .4, .6, .8];

  var this_round_trials = [];

  for (var i = 0; i < 8; i++){
    var this_idx = shuffled_idx[i];
    var this_choice_number = choice_options[this_idx];
    var this_outcome_number = outcome_options[this_idx];
    if (this_outcome_number == 1){
      var correct_p = p_vec[this_choice_number - 1]
    }else{
      var correct_p =  1 - p_vec[this_choice_number - 1]
    }

    // make the trial
    var this_trial = {
      type: "evan-struc-quiz",
      choice_image: choice_images[this_choice_number - 1],
      outcome_image: outcome_images[this_outcome_number - 1],
      correct_p: correct_p, // 1 - 4
      limit_time: limit_time,
      MEG_buttons: false,
      data:{
        phase: 'TRAIN STRUC QUIZ',
        choice_number: this_choice_number,
        outcome_number: this_outcome_number,
        block_number: block_number
      } // want a block number here...
    }
    // append this trial to the block
    this_round_trials.push(this_trial)
  }
  var feedback_trial = {
    type: 'evan-display-text',
    line_1: function(){
                      var n_correct = jsPsych.data.get().last(8).filter({correct: 1}).count()
                      var this_text = "You answered " + n_correct +" of the 8 questions correctly.";
                      return this_text;
                      struc_pct_correct = n_correct/8;
                    },
    line_2: "You've completed " + round_number + " out of 14 rounds.",
    line_3: "",
    wait_for_press: true,
    data: {phase: 'INFO',
          block_number: block_number} // note this shows up in main phase as well so isn't train per se
  }
  this_round_trials.push(outcome_image_arr_trial);
  return this_round_trials;
}


// this will change based on the task...
var build_more_like_quiz = function(outcome_number, c1_number, c2_number, correct_c){
  var ml_trial = {
    type: "evan-more-like",
    outcome_image: outcome_images[outcome_number - 1],
    c1_image: choice_images[c1_number - 1],
    c2_image: choice_images[c2_number - 1],
    correct_c: correct_c,
    q_type: 1,
    data:{
      phase: 'TRAIN ML QUIZ',
      c1_number: c1_number,
      c2_number: c2_number,
      outcome_number: outcome_number
    }
  }
  return ml_trial
}

// this will change based on the task...
var build_more_like_quiz2 = function(choice_number, correct_c){
  var ml_trial = {
    type: "evan-more-like",
    choice_image: choice_images[choice_number - 1],
    o1_image: outcome_images[0],
    o2_image: outcome_images[1],
    correct_c: correct_c,
    q_type: 2,
    data:{
      phase: 'TRAIN ML QUIZ',
      choice_number: choice_number,
    }
  }
  return ml_trial
}

var make_more_like_block1 = function(){
  var pairs = [[1, 2], [1, 3], [1,4], [2,3], [2,4], [3,4]];
  var num_list = [0,1,2,3,4,5];
  var outcome_numbers_shuff = jsPsych.randomization.shuffle([1,2]);
  var like_block_trials = [];
  for (o_block_number = 0; o_block_number < 2; o_block_number++){
    var this_outcome_number = outcome_numbers_shuff[o_block_number];
    //console.log('on' + this_outcome_number)
    var this_o_like_block = [];
    for (var i = 0; i<6; i++){
      if (this_outcome_number == 1){
        var correct_c = 2;
      } else{
        var correct_c = 1;
      }
      var this_trial = build_more_like_quiz(this_outcome_number, pairs[i][0], pairs[i][1], correct_c);
    //  var this_trial = build_more_like_quiz2(1 , 1);

      this_o_like_block.push(this_trial);

      // if it's 1 v 2 leading to outcome 1, increase it
      if (((pairs[i][0] == 1) & (pairs[i][1] == 2)) & (this_outcome_number == 1)){
        var this_trial = build_more_like_quiz(this_outcome_number, pairs[i][0], pairs[i][1], correct_c);
        this_o_like_block.push(this_trial);
      }

      if (((pairs[i][0] == 3) & (pairs[i][1] == 4)) & (this_outcome_number == 2)){
        var this_trial = build_more_like_quiz(this_outcome_number, pairs[i][0], pairs[i][1], correct_c);
        this_o_like_block.push(this_trial);
      }

    }
    like_block_trials = like_block_trials.concat(jsPsych.randomization.shuffle(this_o_like_block))
  }
  return like_block_trials
}

var make_more_like_block2 = function(){
  var c_nums = [1,2,3,4];
  var c_nums = jsPsych.randomization.shuffle(c_nums);
  var like_block_trials = [];
  for (c_idx = 0; c_idx < 4; c_idx++){
    var this_c_num = c_nums[c_idx];
    //console.log('on' + this_outcome_number)
      if (this_c_num < 3){
        var correct_c = 2;
      } else{
        var correct_c = 1;
      }
     var this_trial = build_more_like_quiz2(this_c_num , correct_c);

      like_block_trials.push(this_trial);
    }
  return like_block_trials
}


var build_po_vec = function(n_trials, p_o1){
  var n_o1_trials = n_trials*p_o1;
  var n_o2_trials = n_trials - n_o1_trials;
  var a_trials = new Array(n_o1_trials).fill(1);
  var po_vec = a_trials.concat(new Array(n_o2_trials).fill(0)); // need to shuffle it later
  return po_vec;
}


var build_practice_trial_stg1 = function(choice_number, p_o1, show_prompt, limit_time){
  // add a prompt ....
  if (typeof show_prompt == 'undefined'){
    var show_prompt = true;
  }
  if (typeof limit_time == 'undefined'){
    var limit_time = false;
  }


  var this_trial = {
    type: 'evan-run-trial',
    exp_stage: 'practice',
    first_stage: 2,
    last_stage:4,
    show_money_val: false,
    allow_reject: false,
    p_o1: p_o1, // this is always the same
    safe_val: 10,
    o1_val: 10,
    o2_val: 10, // because O2 is the trigger
    ///
    o1_image: outcome_images[0],
    o2_image: outcome_images[1],
    safe_image: outcome_images[2],
    // this depends on the proability...
    choice_image: choice_images[choice_number-1],
    data: {choice_number: choice_number, phase: 'TRAIN OBSERVE'},
    show_prompt: show_prompt,
    limit_time: limit_time
    }

  return this_trial;
}

///

function rand_gen_info_quiz(){

  if (Math.random() < .5){
    // quiz on outcome // need to access last outcome
    var info_quiz = {
      type: 'evan-info-quiz',
      correct_image: function(){
        var data = jsPsych.data.get().last(1).values()[0];
        return outcome_images[data.outcome_reached-1];
      },
      other_images:  function(){var data = jsPsych.data.get().last(1).values()[0]; var rm_idx = data.outcome_reached-1;
                      var cp_oi = [...outcome_images]; cp_oi.splice(rm_idx,1); return cp_oi; },
      correct_name: function(){
        var data = jsPsych.data.get().last(1).values()[0];
        return outcome_names[data.outcome_reached-1];
      },
      other_names: function(){var data = jsPsych.data.get().last(1).values()[0]; var rm_idx = data.outcome_reached-1;
                      var cp_on = [...outcome_names]; cp_on.splice(rm_idx,1); return cp_on; },

      use_image: (Math.random() < .5),
      use_outcome: true,
      data: {}
    }
  }else{
    var info_quiz = {
    // do it for choice
    type: 'evan-info-quiz',
    correct_image: function(){
      var data = jsPsych.data.get().last(1).values()[0];
      return choice_images[data.choice_number-1];
    },
    other_images:  function(){var data = jsPsych.data.get().last(1).values()[0]; var rm_idx = data.choice_number-1;
                     var cp_oi =JSON.parse( JSON.stringify( choice_images ) );
                      cp_oi.splice(rm_idx,1); return cp_oi; },
    correct_name: function(){
      var data = jsPsych.data.get().last(1).values()[0];
      return choice_names[data.choice_number-1];
    },
    other_names: function(){var data = jsPsych.data.get().last(1).values()[0]; var rm_idx = data.choice_number-1;
                  var cp_on =JSON.parse( JSON.stringify( choice_names ) );
                     cp_on.splice(rm_idx,1); return cp_on; },

    use_image: (Math.random() < .5), // random iamge or text
    use_outcome: false,
    data: {}

  }
  }
  return info_quiz;
}



var build_play_machine_round = function(block_number, round_number){

  /// this will make a round of going through each choice 10 times
  var this_round_trials = [];
  c_numb_shuff = jsPsych.randomization.repeat([1,2,3,4],1 );
  // // build all the passive trials
   for (var cx_idx = 0; cx_idx < 4; cx_idx++){
     var cx_number = c_numb_shuff[cx_idx];
     //var prep_text = "You'll now play the " + choice_names[cx_number - 1] + " slot machine.";
     //var start_block_text2 = "For each game, press 1 to play the machine.";
     //var start_block_text3 = "Please pay attention!";
     //this_round_trials.push(build_text_trial(prep_text,start_block_text2,start_block_text3, false));
     var schematic1 = {
       type: 'evan-display-map',
       choice_images: choice_images,
       outcome_images: outcome_images,
       data: {block_number: block_number}, // fix the block number,
       choice_number: cx_number,
       choice_name: choice_names[cx_number - 1]
     } // change prompt on the shematic
     this_round_trials.push(schematic1);

     var cx_trials_o1 = build_po_vec(10,all_prob_o1[cx_number - 1]);// build a_trials
     var cx_trials_o1 = jsPsych.randomization.repeat(cx_trials_o1,1);
  //   // build each passive trial
     for (var t = 0; t < cx_trials_o1.length; t++){
       this_round_trials.push(build_practice_trial_stg1(cx_number, cx_trials_o1[t]));
       if (Math.random() < .2){
         this_round_trials.push(rand_gen_info_quiz())
       }
       this_round_trials[this_round_trials.length - 1].data.block_number = block_number;
     }

    // this_round_trials = this_round_trials.concat(jsPsych.randomization.repeat(quiz_trials,1));
   }

   // build the choice quiz trials
   this_round_trials.push(build_text_trial("You will now be quized on what you've learned.","Please try your best.","", false))
   like_quiz_block2 = make_more_like_block2();
   this_round_trials = this_round_trials.concat(like_quiz_block2);
   like_quiz_block1 = make_more_like_block1();
   like_quiz_block1 = jsPsych.randomization.repeat(like_quiz_block1,1);
   this_round_trials = this_round_trials.concat(like_quiz_block1);
   // get the last 6 trials.

   var feedback_trial = {
     type: 'evan-display-text',
     line_1: function(){
                       var n_correct = jsPsych.data.get().last(18).filter({correct: 1}).count()
                       var this_text = "You answered " + n_correct +" of the 18 questions correctly.";
                       return this_text;
                     },
     line_2: "You've completed " + round_number + " out of 6 rounds.",
     line_3: "",
     wait_for_press: true,
     data: {phase: 'INFO'},
     wait_for_exp: false // note this shows up in main phase as well so isn't train per se
   }

   this_round_trials.push(feedback_trial)

   for (var i = 0; i < this_round_trials.length; i ++){
     //this_round_trials[i].data = {};
     this_round_trials[i].data.block_number = block_number;
   }
   return this_round_trials;
}

var model_learning = [];

// goes 4-6rounds of experience with quizzes.. at the end, do a quiz on each...
  for (var i = 0; i < 6; i++){

      if (i < 2){
        var bn = 6;
      }else{var bn = 7};

      play_trials = build_play_machine_round(bn, i+1);
      model_learning = model_learning.concat(play_trials);
    //  model_learning.push(build_text_trial("You'll now be quizzed on the chances of each slot machine producing either banknote.","Please try your best.","", false))
      model_learning[model_learning.length-1].data.block_number = bn;
//      model_learning = model_learning.concat(make_struc_quiz_block(i + 1, bn, false));
      if (i == 1){
    //    model_learning.push(build_text_trial("Let's take a short break.","","", true))
        add_save_block_data(model_learning[model_learning.length - 3])
        model_learning[model_learning.length-1].data.block_number = bn + 1;
        //add_save_block_data[model_learning[model_learning.length - 2]]
      }
      if (i == 3){
    //    model_learning.push(build_text_trial("Let's take a short break.","","", true))
        add_save_block_data(model_learning[model_learning.length - 3])
        model_learning[model_learning.length-1].data.block_number = bn + 1;
      //  add_save_block_data[model_learning[model_learning.length - 2]]
      }
      // do a quiz on each after this...
  }


//////////////////////////////////PLAYING THE SLOT MACHINE IN THE INTRO




//////////////////////////////////////////// Instructions

  // for two-stim choice add parameter for whether to limit choice time.
  var instruction_pages_1a = ['Stimuli/uws_instr_slides_ver2_jpg/Slide1.JPG',
                              'Stimuli/uws_instr_slides_ver2_jpg/Slide2.JPG',
                              'Stimuli/uws_instr_slides_ver2_jpg/Slide3.JPG'];

  var schematic_slide ='Stimuli/uws_instr_slides_ver2_jpg/Slide4.JPG'

  //var outcome_state_idx = both_idx_vec[cond_idx][1];

  //var pos_outcome_assigments = [[0, 1, 2],
  //                                [2, 0, 1],
  //                                [1, 2, 0]];

  var pages1a = [];
  for (var i = 0; i < instruction_pages_1a.length; i++){
      pages1a.push('<img src= "'+ instruction_pages_1a[i] +  '" alt = "" >')
  }


  var instruction_pages1a = {
      type: 'instructions',
      pages: pages1a,
      show_clickable_nav: true
  }

  //instruc1a_trials.splice(2,0,rand_gen_info_quiz());

  // define the instruction quiz...
  var options1a =  ["It is random",
              "Answers to attention check questions only.",
              "Answers to questions about which slotmachine is more likely to produce a given banknote.",
              "Answers to both types of questions.",
              "I do not know"
          ];
  var correct1a = 3;

  var options2a = ["1", "2", "3","4","5","6","7"];
  var correct2a = 1;

  var options3a = ["1", "2", "3","4","5","6","7"];
  var correct3a = 3;

  var options4a = ["Each slot machine can lead to any of the banknotes. The chances that a given slot machine provides a given banknote are different for each slot machine.",
                  "Each slot machine can lead to any of the banknotes. The chances that a given slot machine provides a given banknote are the same for each slot machine.",
                  "Some slot machines always provide the same banknote.",
                  "I do not know"];
  var correct4a = 0;

  var options5a = ["Yes", "No", "I do not know."];
  var correct5a = 1;

  var corr_string = '{"Q0":' + '"'+options1a[correct1a]+'",' + '"Q1":' + '"'+options2a[correct2a]+'",'
      + '"Q2":' + '"'+options3a[correct3a]+'",' + '"Q3":' + '"'+options4a[correct4a]+'",' +
      '"Q4":' + '"'+options5a[correct5a]+'"'  + '}';

  var questions1_arr = ["What determines the bonus for this task?",
  		"How many banknotes are in this task?",
  		"How many slot machines are in this task?",
  		"How do different slot machines produce different banknotes?",
  		"Do the chances that a given slot machine will produce a certain banknote change over the course of the task?"];


                          /* define instruction check block */
  var instructioncorrect = false;
  var instruction_check = {
      type: "evan-quiz",
      preamble: ["<p align='center'><b>Please answer every question. Answering 'I do not know' or answering incorrectly will require you return to the beginning of the instructions. </b></p>"],
      questions: [
          {prompt: "<b>Question 1</b>: What determines the bonus for this task?",
                  options: options1a, required: true},
          {prompt: "<b>Question 2</b>: How many banknotes are in this task?",
                      options: options2a, required: true},
          {prompt: "<b>Question 3</b>: How many slot machines are in this task?",
                          options: options3a, required: true},
          {prompt: "<b>Question 4</b>: How do different slot machines produce different banknotes?",
                          options: options4a, required: true},
          {prompt: "<b>Question 5</b>: Do the chances that a given slot machine will produce a certain banknote change over the course of the task?",
                      options: options5a, required: true},
                  ],
          on_finish: function(data) {
              console.log(data.responses)
              console.log(corr_string)
              if( data.responses == corr_string){
                  action = false;
                  instructioncorrect = true;
  								data.incor_questions;
              }else{
  							var post_choices = data.choice_idxs
  							// this is global
  							incor_questions = ['<br> </br'];
  							var correct_choices = [correct1a, correct2a, correct3a, correct4a, correct5a];
  							for (var i = 0; i < correct_choices.length; i++){
  								if (correct_choices[i] != post_choices[i]){
  									incor_questions.push('<br>' + questions1_arr[i] + '</br>');
  								}
  							}
  							data.incor_questions = incor_questions;
  							//alert('The following questions were answered incorrectly: ' + incor_choices)
  						}
          }
      }


  /* define a page for the incorrect response */
  var showsplash = true;
  var splash_screen = {
  	type: 'html-button-response',
      timing_post_trial: 0,
  	//    button_html: '<button class="jspsych-btn" style="display:none">%choice%</button>',
      choices: ['Click here to read the instructions again'],
      is_html: true,
      stimulus: function(){
  			var incor_q = jsPsych.data.get().last(1).select('incor_questions').values
  			var next_stimulus = 'The following questions were answered incorrectly: ' + incor_q;
  			return next_stimulus
  		}
  }

  /* ...but push it to a conditional node that only shows it if the response was wrong */
  var conditional_splash1 = {
    timeline: [splash_screen],
    conditional_function: function(data) {
  	return !instructioncorrect // skip if correct
    }
  }

  // 4 rounds of map with quiz...

  var intro_w_trials = [];
  intro_w_trials.push(instruction_pages1a);

  intro_w_trials = intro_w_trials.concat(model_learning)

  //var n_rounds = 12;
  //for (var i = 0; i < n_rounds; i++){
  //  var schematic = {
  //    type: 'evan-display-map',
  //    choice_images: choice_images,
  //    outcome_images: outcome_images,
  //    data: {block_number: 6} // fix the block number
  //  }
//  	intro_w_trials.push(schematic);
//    play_trials = build_play_machine_round();
//    console.log('play trials')
//    console.log(play_trials)
//    intro_w_trials = intro_w_trials.concat(play_trials);

    // push some play the machine trials onto it here...

//  	var quiz_trials = make_struc_quiz_block(i + 1);
//  	intro_w_trials = intro_w_trials.concat(quiz_trials);
//  }

  //intro_w_trials = intro_w_trials.concat(instruc1a_trials);

  var introloop = [];
  introloop.push(instruction_pages1a);
  introloop.push(instruction_check);
  introloop.push(conditional_splash1);
  /* finally, add the entirety of this introductory section to a loop node ... */
  var loop_node = {
    timeline: introloop,
    conditional_function: function(data) {
    	return !instructioncorrect // skip if correct
  },
    loop_function: function(data) {
  	var action = true;
  	return !instructioncorrect // stop looping if correct
  	}
  }
  //intro_w_trials.push(loop_node);
  var instruc_timeline1 = intro_w_trials;

  var finish_instruc1_screen = {
  	type: 'html-button-response',
      timing_post_trial: 0,
  	//    button_html: '<button class="jspsych-btn" style="display:none">%choice%</button>',
      choices: ['Begin the first task!'],
      is_html: true,
      stimulus: 'You passed the quiz! Great work. The first task will take about 30 minutes. Press the button to begin.'
  }
  //instruc_timeline1.push(finish_instruc1_screen);
  // add a prompt to the feedback screen?

  instruc2_timeline_w_trials = [];
  var instruction_pages_2a = ['Stimuli/uws_instr_slides_ver2_jpg/Slide5.JPG',
                              'Stimuli/uws_instr_slides_ver2_jpg/Slide6.JPG',
                              'Stimuli/uws_instr_slides_ver2_jpg/Slide7.JPG',
  														'Stimuli/uws_instr_slides_ver2_jpg/Slide8.JPG']
  var instruction_pages_2b = ['Stimuli/uws_instr_slides_ver2_jpg/Slide10.JPG'];
  var instruction_pages_2c = ["Stimuli/uws_instr_slides_ver2_jpg/Slide12.JPG"];

  var pages2a = [];
  for (var i = 0; i < instruction_pages_2a.length; i++){
      pages2a.push('<img src= "'+ instruction_pages_2a[i] +  '" alt = "" >')
  }
  var pages2b = [];
  for (var i = 0; i < instruction_pages_2b.length; i++){
      pages2b.push('<img src= "'+ instruction_pages_2b[i] +  '" alt = "" >')
  }
  var pages2c = [];
  for (var i = 0; i < instruction_pages_2c.length; i++){
      pages2c.push('<img src= "'+ instruction_pages_2c[i] +  '" alt = "" >')
  }

  var instruction_pages2a = {
      type: 'instructions',
      pages: pages2a,
      show_clickable_nav: true
  }

  var instruction_pages2b = {
      type: 'instructions',
      pages: pages2b,
      show_clickable_nav: true
  }

  var instruction_pages2c = {
      type: 'instructions',
      pages: pages2c,
      show_clickable_nav: true
  }

  // want some practice trials where the person just reports the point value of one of the bank notes.

  instruc2_timeline_w_trials.push(instruction_pages2a);
  var n_info_practice = 8;
  for (i = 0; i < n_info_practice; i ++){
  	instruc2_timeline_w_trials = instruc2_timeline_w_trials.concat(rand_gen_rew_quiz_main());
  }

  instruc2_timeline_w_trials.push(instruction_pages2b);
  var n_trial_practice = 6;
  for (i = 0; i < n_trial_practice; i ++){
  	instruc2_timeline_w_trials.push(rand_gen_trial());
  }

  instruc2_timeline_w_trials.push(instruction_pages2c);


  // define the instruction quiz...
  var options1b =  ["1", "2", "3", "4", "5", "6", "7", "I do not know"];
  var correct1b = 2;

  var options2b =  ["1", "2", "3", "4", "5", "6", "7", "I do not know"];
  var correct2b = 3;

  var options3b = ["Accepting a given slot machine can lead to any of the banknotes. The chances that a given slot machine provides a given banknote are the same for each slot machine.",
                  "Accepting a given slot machine can lead to either the " + outcome_names[0]  + " or the " + outcome_names[1] + "  banknotes. The chances that a given slot machine provides a given banknote are different for each slot machine.",
  				"Accepting a given slot machine can lead to either the " + outcome_names[1]  + " or the " + outcome_names[2] + "  banknotes. The chances that a given slot machine provides a given banknote are different for each slot machine.",
  				"Accepting a given slot machine can lead to either the " + outcome_names[0]  + " or the " + outcome_names[2] + "  banknotes. The chances that a given slot machine provides a given banknote are different for each slot machine.",
                  "Accepting some slot machines will always provide the same banknote.",
                  "I do not know"];
  var correct3b = 1;

  var options4b = ["Rejecting a slot machine always leads to the " + outcome_names[0]  + " banknote.",
                  "Rejecting a slot machine always leads to the " + outcome_names[1]  + " banknote.",
  				"Rejecting a slot machine always leads to the " + outcome_names[2]  + " banknote.",
  				"Rejecting a slot machine can lead to any of the banknotes.",
                  "I do not know"];
  var correct4b = 2;

  var options5b = ["Yes", "No", "I do not know."];
  var correct5b = 1;

  var options6b = ["Yes", "No", "I do not know."];
  var correct6b = 1;

  var options7b = ["The total number of points collected as well as answers to attention check questions.",
  				"It is random",
  				"Average number of points collected on four randomly selected games as well as answers to attention check questions.",
  				"Just total number of points collected.",
  				"Just answers to attention check questions.",
  				"I do not know."];
  var correct7b = 2;

  var options8b = ["If collected on a selected game, banknotes with positive point values will increase the bonus. \
                      Banknotes with negative point values will not affect the bonus.",
                      "If collected on a selected game, banknotes with positive point values will increase the bonus. \
                      If collected on a selected game, banknotes with negative point values will decrease the bonus.",
                       "Banknotes with positive point values will not affect the bonus.\
                       If collected on a selected game, banknotes with negative point values will decrease the bonus.",
                       "I do not know"];

  var correct8b = 1;


  var corr2_string = '{"Q0":' + '"'+options1b[correct1b]+'",' + '"Q1":' + '"'+options2b[correct2b]+'",'
      + '"Q2":' + '"'+options3b[correct3b]+'",' + '"Q3":' + '"'+options4b[correct4b]+'",' +
      '"Q4":' + '"'+options5b[correct5b]+'",' + '"Q5":' + '"'+options6b[correct6b]+'",'
       + '"Q6":' + '"'+options7b[correct7b]+'",' + '"Q7":' + '"'+options8b[correct8b]+'"'+ '}';

  var questions2_arr = ["How many banknotes are in this task?",
  										"How many slot machines are in this task?",
  									 	"What happens if you accept a slot machine?",
  									 "What happens if you reject a slot machine?",
  									 "Will the chances of getting a certain banknote after accepting a given slot machine change over the course of the task?",
   								 	"Are the chances of getting a certain banknote after accepting a given slot machine different than what you were tested on in the last task?",
   									 "What determines my bonus in this task?",
  									 "How does collecting positive point and negative point banknotes affect your bonus?"
  								 ];

  var instruction2correct = false;
  var instruction2_check = {
      type: "evan-quiz",
      preamble: ["<p align='center'><b>Please answer every question. Answering 'I do not know' or answering incorrectly will require you return to the beginning of the instructions. </b></p>"],
      questions: [
          {prompt: "<b>Question 1</b>: How many banknotes are in this task?",
                  options: options1b, required: true},
          {prompt: "<b>Question 2</b>: How many slot machines are in this task?",
                      options: options2b, required: true},
          {prompt: "<b>Question 3</b>: What happens if you accept a slot machine?",
                      options: options3b, required: true},
          {prompt: "<b>Question 4</b>: What happens if you reject a slot machine?",
                          options: options4b, required: true},
          {prompt: "<b>Question 5</b>: Will the chances of getting a certain banknote after accepting a given slot machine change over the course of the task?",
                          options: options5b, required: true},
          {prompt: "<b>Question 6</b>: Are the chances of getting a certain banknote after accepting a given slot machine different than what you were tested on in the last task?",
                      options: options6b, required: true},
          {prompt: "<b>Question 7</b>: What determines my bonus in this task?",
                                  options: options7b, required: true},
  				{prompt: "<b>Question 8</b>: How does collecting positive point and negative point banknotes affect your bonus?",
  											options: options8b, required: true}
  				],
  				on_finish: function(data) {
  						console.log(data.responses)
  						console.log(corr2_string)
              if( data.responses == corr2_string){
                  action = false;
                  instruction2correct = true;
              }else{
  							var post_choices = data.choice_idxs
  							// this is global
  							incor_questions = ['<br> </br'];
  							var correct_choices = [correct1b, correct2b, correct3b, correct4b, correct5b, correct6b, correct7b, correct8b];
  							for (var i = 0; i < correct_choices.length; i++){
  								if (correct_choices[i] != post_choices[i]){
  									incor_questions.push('<br>' + questions2_arr[i] + '</br>');
  								}
  							}
  							data.incor_questions = incor_questions;
  							//alert('The following questions were answered incorrectly: ' + incor_choices)
  						}
  					}
      }

  var splash_screen2 = {
  			type: 'html-button-response',
  		    timing_post_trial: 0,
  			//    button_html: '<button class="jspsych-btn" style="display:none">%choice%</button>',
  		    choices: ['Click here to read the instructions again'],
  		    is_html: true,
  		    stimulus: function(){
  					var incor_q = jsPsych.data.get().last(1).select('incor_questions').values
  					var next_stimulus = 'The following questions were answered incorrectly: ' + incor_q;
  					return next_stimulus
  				}
  		}

  	/* ...but push it to a conditional node that only shows it if the response was wrong */
  	var conditional_splash2 = {
  	  timeline: [splash_screen2],
  	  conditional_function: function(data) {
  		return !instruction2correct // skip if correct
  	  }
  	}


  	var finish_instruc2_screen = {
  		type: 'html-button-response',
  	    timing_post_trial: 0,
  		//    button_html: '<button class="jspsych-btn" style="display:none">%choice%</button>',
  	    choices: ['Begin the second task!'],
  	    is_html: true,
  	    stimulus: 'You passed the quiz! Great work. This task will take about 40 minutes. Press the button to begin.'
  	}


  //instruc2_timeline_w_trials = [];
  instruc2_timeline_w_trials.push(instruction2_check);
  instruc2_timeline_w_trials.push(conditional_splash2);

  var intro2loop = [];
  intro2loop.push(instruction_pages2a);
  intro2loop.push(instruction_pages2b);
  intro2loop.push(instruction_pages2c);
  intro2loop.push(instruction2_check);
  intro2loop.push(conditional_splash2);


  /* finally, add the entirety of this introductory section to a loop node ... */
  var loop2_node = {
    timeline: intro2loop,
    conditional_function: function(data) {
    	return !instruction2correct // skip if correct
  },
    loop_function: function(data) {
  	var action = true;
  	return !instruction2correct // stop looping if correct
  	}
  }
  instruc2_timeline_w_trials.push(loop2_node);
  instruc2_timeline_w_trials.push(finish_instruc2_screen);

  var instruc_timeline2 = instruc2_timeline_w_trials;

  //-- to compute the bonus...

  //var point_vals = jsPsych.data.get().filter({phase: 'TRAIN CHOICE'}).select('points_received').values
  //var practice_bonus_trial_points = jsPsych.randomization.sampleWithoutReplacement(point_vals, 4)
  //practice_bonus_trial_points =  arrAvg(practice_bonus_trial_points);

////////////////// instruction trials


//////////////////////////////////

var welcome_slide = instr_slides + '/Slide2.JPG';
var preloc_slide = instr_slides + '/Slide3.JPG';
var pretrain_slide = instr_slides + '/Slide4.JPG';
var pretask_slide = instr_slides + '/Slide5.JPG';

console.log(pretrain_slide)

var instr1 = {
    type: 'instructions',
    pages: ['<img src= "'+ welcome_slide +  '" alt = "" >',
            '<img src= "'+ preloc_slide +  '" alt = "" >'],
    show_clickable_nav: false,
    key_forward: '4',
    data: {
      block_number: 1
    }
}

var pretrain = {
    type: 'instructions',
    pages: ['<img src= "'+ pretrain_slide +  '" alt = "" >'],
    show_clickable_nav: false,
    key_forward: '4',
    data: {
      block_number: 6
    }
}

var pretask = {
    type: 'instructions',
    pages: ['<img src= "'+ pretask_slide +  '" alt = "" >'],
    show_clickable_nav: false,
    key_forward: '4',
    data: {
      block_number: 7
    }
}

/////////// PUT THE TIMELINE TOGETHER
pre_text_trial1 = build_text_trial("", "Waiting for experimenter", "",true);
pre_text_trial1.data.block_number = 1;

pre_text_trial2 = build_text_trial("", "Waiting for experimenter", "",true);
pre_text_trial2.data.block_number = 6;

pre_text_trial3 = build_text_trial("", "Waiting for experimenter", "",true);
pre_text_trial3.data.block_number = 7;
const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length

var end_screen = {
     	type: 'html-button-response',
         timing_post_trial: 0,
         choices: ['End Task'],
     	//on_start: function(){
        //    var task_data = jsPsych.data.get().json();
            //db.collection('gambletask').doc('run3_v').collection('subjects').doc(uid).collection('rounds').doc(subjectID.toString()).update({
            //    task_data: task_data})
          //  },
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
         		//	'practice_quiz_pct': practice_quiz_pct,
         		//	'practice_bonus_trial_points_avg': practice_bonus_trial_points_avg,
         			'test_quiz_pct': test_quiz_pct,
         			'test_bonus_trial_points_avg': test_bonus_trial_points_avg
         		};
         		jsPsych.data.write(bonus_data)
                var task_data = jsPsych.data.get().json();
                db.collection('gambletask').doc('MEG_1').collection('computers').
                                  doc(uid).collection('subjects').doc(subjectID).collection('taskdata')
                                  .doc('end').set({
                                    bonus_data: bonus_data,
                                    end_time: new Date().toLocaleTimeString()})
         		var string = 'You have finished the task. \
         					For the attention checks  you got ' + test_quiz_pct + ' percent correct. On four randomly selected games, \
         					the average number of points you collected was '  + test_bonus_trial_points_avg + '. \
         					 Your bonus will be based on these results. The experimenter will soon be in touch regarding the MEG session.';

         		return string;
         	},
        //on_finish: function(){
        //    window.location = "https://app.prolific.co/submissions/complete?cc=V23QBQM3";
      //  }
     }

//task2_timeline = task2_timeline.filter(function(el){return el.data.block_number >= start_block})
//loc_exp = loc_exp.filter(function(el){return el.data.block_number >= start_block})
//full_screen
// put together the full timeline
 timeline = [];
 timeline.push(full_screen);
 timeline = timeline.concat(instruc_timeline1);
 //timeline = timeline.concat(task1_timeline);
 timeline = timeline.concat(instruc_timeline2);
 timeline = timeline.concat(task2_timeline);
 //timeline = task2_timeline.slice(0,2);
 timeline.push(end_screen);

 var final_slide = 'Stimuli/uws_instr_slides_ver2_jpg/Slide13.JPG';

 console.log(pretrain_slide)

// need to add the subject number...

 var final_screen = {
     type: 'instructions',
     pages: ['<img src= "'+ final_slide +  '" alt = "" >'],
     show_clickable_nav: false,
     key_forward: '4',
     data: {
       block_number: 1
     }
 }

 timeline.push(final_screen);


     var all_task_images = [];
     all_task_images = all_task_images.concat(pos_outcome_images);
     all_task_images = all_task_images.concat(pos_choice_images);
     all_task_images = all_task_images.concat(instruction_pages_1a);
     all_task_images = all_task_images.concat(schematic_slide);
     all_task_images = all_task_images.concat(instruction_pages_2a);
     all_task_images = all_task_images.concat(instruction_pages_2b);
     all_task_images = all_task_images.concat(instruction_pages_2c);


 //timeline = [end_screen];

//console.log(model_learning)
console.log(timeline)

  /* start the experiment */
  jsPsych.init({
   timeline: timeline,
   preload_images: all_task_images,
   show_preload_progress_bar: false,
   on_finish: function() {
     jsPsych.data.get().localSave('csv','evan_practice_new.csv');
  }
});

}
