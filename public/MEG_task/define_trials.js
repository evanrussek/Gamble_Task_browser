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
    use_image: use_image
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
        choice_number: choice_number
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



// generates 160 non-matched trials
var win_non_matched_trials = []; // remake the other trials...
var loss_non_matched_trials = []; // remake the other trials...

// win_o1_trig_trials
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

// block the position of things...

//all_loss_trials = loss_matched_trials.concat(loss_non_matched_trials);
//all_loss_trials = jsPsych.randomization.repeat(all_loss_trials,1);

all_loss_trials = jsPsych.randomization.repeat(loss_non_matched_trials,2);
all_win_trials = jsPsych.randomization.repeat(win_non_matched_trials,2);
// the task is

console.log(all_loss_trials)
console.log(all_win_trials)

// 36 trials per block ( 14 win and 14 loss) // block the safe?

// block size . ---

var block_size = all_loss_trials.length/8; // form 8 blocks...

var all_trials = []

var loss_first = (Math.random() < .5);
// want to counterbalance which comes first
if (loss_first){
  for (var i = 0; i < 6; i++){
    all_trials.push(build_text_trial("The next set of games will all have negative points.","Collecting more of these will make your bonus smaller.","",true));
    var loss_block = all_loss_trials.splice(0,block_size);
    var c = Math.round(loss_block.length/2);
    loss_block.splice(c,0,build_text_trial("Great work!.","Let's take a 5 second break.","",false))

    var t_new1 = 0;
    var a = loss_block.length;
    for (var t = 1; t < a; t++){
      t_new1 = t_new1 + 1;
      if (Math.random() < 1/8){
        if (loss_block[t_new1].type == "evan-run-trial"){
          // loss ones
          var quiz = rand_gen_rew_quiz_main(true);
          loss_block.splice(t_new1,0, quiz[0], quiz[1]);
          t_new1 = t_new1 + 1;
        }
      }
    }

    all_trials = all_trials.concat(loss_block);
    //////////////////////////////////////////////////////////////////
    all_trials.push(build_text_trial("The next set of games will all have positive points.","Collecting more of these will make your bonus larger.","",true));
    var win_block = all_win_trials.splice(0,block_size);
    var b = Math.round(win_block.length/2);
    win_block.splice(b,0,build_text_trial("Great work!.","Let's take a 5 second break.","",false))

    var t_new1 = 0;
    var a = win_block.length;
    for (var t = 1; t < a; t++){
      t_new1 = t_new1 + 1;
      if (Math.random() < 1/8){
        if (win_block[t_new1].type == "evan-run-trial"){
          var quiz = rand_gen_rew_quiz_main(false);
          win_block.splice(t_new1,0, quiz[0], quiz[1]);
          t_new1 = t_new1 + 1;
        }
      }
    }
    all_trials = all_trials.concat(win_block);
  }
}else{
  for (var i = 0; i < 6; i++){
    /// win
    all_trials.push(build_text_trial("The next set of games will all have positive points.","Collecting more of these will make your bonus larger.","",true));
    var win_block = all_win_trials.splice(0,block_size);
    var b = Math.round(win_block.length/2);
    win_block.splice(b,0,build_text_trial("Great work!.","Let's take a 5 second break.","",false))

    var t_new1 = 0;
    var a = win_block.length;
    for (var t = 1; t < a; t++){
      t_new1 = t_new1 + 1;
      if (Math.random() < 1/8){
        if (win_block[t_new1].type == "evan-run-trial"){
          var quiz = rand_gen_rew_quiz_main(false);
          win_block.splice(t_new1,0, quiz[0], quiz[1]);
          t_new1 = t_new1 + 1;
        }
      }
    }
    all_trials = all_trials.concat(win_block);
    // loss
    all_trials.push(build_text_trial("The next set of games will all have negative points.","Collecting more of these will make your bonus smaller.","",true));
    var loss_block = all_loss_trials.splice(0,block_size);
    var c = Math.round(loss_block.length/2);
    loss_block.splice(b,0,build_text_trial("Great work!.","Let's take a 5 second break.","",false))

    var t_new1 = 0;
    var a = loss_block.length;
    for (var t = 1; t < a; t++){
      t_new1 = t_new1 + 1;
      if (Math.random() < 1/8){
        if (loss_block[t_new1].type == "evan-run-trial"){
          var quiz = rand_gen_rew_quiz_main(true);
          loss_block.splice(t_new1,0, quiz[0], quiz[1]);
          t_new1 = t_new1 + 1;
        }
      }
    }

    all_trials = all_trials.concat(loss_block);
  }
}


var main_task = all_trials; //jsPsych.randomization.repeat(all_trials, 1);
//var all_trials_shuff = all_trials;
// insert a half way through

for (var tn = 0; tn < main_task.length; tn++){
  var b = tn;
  if (main_task[tn].type == "evan-run-trial"){
    main_task[tn].data.trial_num = b+1;
  }
}


// add more than just half way marks - maybe 1/4 parts
quart_text = build_text_trial("Great job! You're a quarter of the way through this task.","","",true);
half_way_txt = build_text_trial("Great job! You're half way through this task.","","",true);
three_quart_text = build_text_trial("Great job! You're three quarters of the way through this task.","","",true);

main_task.splice(Math.round(main_task.length/4), 0, quart_text)
main_task.splice(Math.round(main_task.length/2)+1, 0, half_way_txt)
main_task.splice(Math.round(3*main_task.length/4)+2, 0, three_quart_text)

task2_timeline = main_task;
//test_quiz = rand_gen_rew_quiz_main();
