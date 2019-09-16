

var gen_test_trial = function(o1_trig, prob_trig_idx, trig_val, matched_safe, safe_val_base){
  // need to define choice number, p_o1, o1_val, o2_val (that's it?)
  var prob_trig = all_prob_trig[prob_trig_idx];


  if (trig_val > 0){
    var other_noise = Math.round(5*Math.random());
    var gl_type = 'gain';
  } else {
      var other_noise = -1*Math.round(5*Math.random());
      var gl_type = 'loss';
  }


  if (matched_safe){
    var safe_val_base = Math.round(prob_trig*trig_val);
    // set the noise...
    var safe_noise = Math.round(3*Math.random() - 1.5);
    var trigger_noise = Math.round(3*Math.random() - 1.5);
    if (trig_val > 0){
      var other_noise = Math.round(2*Math.random());
    }else{
      var other_noise = -1*Math.round(2*Math.random());
    }
  } else{
    var safe_noise = Math.round(10*Math.random() - 5);
    var trigger_noise = Math.round(10*Math.random() - 5);
  }


  if (o1_trig){
    // o1 is the trigger, o2 is 0
    var o1_val_base = trig_val;
    var o1_val = o1_val_base + trigger_noise;
    var o2_val_base = 0;
    var o2_val = o2_val_base + other_noise;
    var p_o1 = prob_trig;
    var choice_number = 1 + prob_trig_idx; //
  } else{
    // o2 is the trigger, o1 is 0
    var o1_val_base = 0;
    var o1_val = o1_val_base + other_noise;
    var o2_val_base = trig_val;
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

// make a function that takes in trigger_val, p_trigger, gain or loss, o1_trigger and generates a trial.
var o1_trig = true;
var prob_trig_idx = 2;
var matched_safe = false;
var trig_val = 50;

test_trial_o1 = gen_test_trial(o1_trig, prob_trig_idx, trig_val, matched_safe,30)
test_trial_o2 = gen_test_trial(false, prob_trig_idx, trig_val, matched_safe,25)

// this is constant for all subjects (160 trials)
var all_prob_o1 = [.2, .4, .6, .8];
var all_prob_trig =  [.2, .4, .6, .8];
var all_win_safe_vals = [16, 32];
var all_loss_safe_vals = [-16, -32];
var all_win_amounts = [34, 46, 57, 68, 80];
var all_loss_amounts = [-34, -46, -57, -68, -80];

// this loop makes 120 trials match trials...
var matched_trials = [];
var alt_idx = 0;
for (var p_idx = 0; p_idx < all_prob_trig.length; p_idx++){
  for (var w_idx = 0; w_idx < all_win_amounts.length; w_idx++){
    // o1_trig is true and matched safe is true
    alt_idx = alt_idx + 1;
    var match_w_o1 = gen_test_trial(true, p_idx, all_win_amounts[w_idx], true);
    // o1_trig is false and matched safe is true
    var match_w_o2 = gen_test_trial(false, p_idx, all_win_amounts[w_idx], true);
    // o1_trig alternates and matched safe is true
    var alt_o1_trig = Boolean(alt_idx % 2);
    var match_w_alt = gen_test_trial(alt_o1_trig, p_idx, all_win_amounts[w_idx], true);
    matched_trials = matched_trials.concat([match_w_o1, match_w_o2, match_w_alt]);

    // just make the loss one's here as well
    var match_l_o1 = gen_test_trial(true, p_idx, all_loss_amounts[w_idx], true);
    var match_l_o2 = gen_test_trial(false, p_idx, all_loss_amounts[w_idx], true);
    var match_l_alt = gen_test_trial(alt_o1_trig, p_idx, all_loss_amounts[w_idx], true);
    matched_trials = matched_trials.concat([match_l_o1, match_l_o2, match_l_alt]);
  }
}

// generates 160 non-matched trials
var non_matched_trials = []; // remake the other trials...
// win_o1_trig_trials
for (var sv_idx = 0; sv_idx < all_win_safe_vals.length; sv_idx++){
  for (var w_idx = 0; w_idx < all_win_amounts.length; w_idx++){
    for (var p_idx = 0; p_idx < all_prob_trig.length; p_idx++){
      var nm_w_o1 =  gen_test_trial(true, p_idx, all_win_amounts[w_idx], false, all_win_safe_vals[sv_idx]);
      var nm_w_o2 =  gen_test_trial(false, p_idx, all_win_amounts[w_idx], false, all_win_safe_vals[sv_idx]);

      var nm_l_o1 =  gen_test_trial(true, p_idx, all_loss_amounts[w_idx], false, all_loss_safe_vals[sv_idx]);
      var nm_l_o2 =  gen_test_trial(false, p_idx, all_loss_amounts[w_idx], false, all_loss_safe_vals[sv_idx]);

      non_matched_trials = non_matched_trials.concat([nm_w_o1, nm_w_o2, nm_l_o1, nm_l_o2]);
    }
  }
}






// make the matched trials...
// loop through trigger vals and p_os, gain, loss
