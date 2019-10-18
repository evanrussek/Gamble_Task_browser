
// this produces practice round which can be added to the timeline

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


var build_more_like_quiz = function(outcome_number, c1_number, c2_number, correct_c){
  var ml_trial = {
    type: "evan-more-like",
    outcome_image: outcome_images[outcome_number - 1],
    c1_image: choice_images[c1_number - 1],
    c2_image: choice_images[c2_number - 1],
    correct_c: correct_c,
    data:{
      phase: 'TRAIN ML QUIZ',
      c1_number: c1_number,
      c2_number: c2_number,
      outcome_number: outcome_number
    }
  }
  return ml_trial
}

var build_text_trial = function(line_1,line_2,line_3, wait_for_press){
  var text_trial = {
    type: 'evan-display-text',
    line_1: line_1,
    line_2: line_2,
    line_3: line_3,
    wait_for_press: wait_for_press,
    data: {phase: 'INFO'} // note this shows up in main phase as well so isn't train per se
  }
  return text_trial;
}

var build_po_vec = function(n_trials, p_o1){
  var n_o1_trials = n_trials*p_o1;
  var n_o2_trials = n_trials - n_o1_trials;
  var a_trials = new Array(n_o1_trials).fill(1);
  var po_vec = a_trials.concat(new Array(n_o2_trials).fill(0)); // need to shuffle it later
  return po_vec;
}



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
      use_outcome: true
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
                    var cp_oi = [...choice_images]; cp_oi.splice(rm_idx,1); return cp_oi; },
    correct_name: function(){
      var data = jsPsych.data.get().last(1).values()[0];
      return choice_names[data.choice_number-1];
    },
    other_names: function(){var data = jsPsych.data.get().last(1).values()[0]; var rm_idx = data.choice_number-1;
                    var cp_on = [...choice_names]; cp_on.splice(rm_idx,1); return cp_on; },

    use_image: (Math.random() < .5), // random iamge or text
    use_outcome: false
  }
  }
  return info_quiz;
}


// make the actual practice block!


// make the whole localizer task... 
var make_more_like_block = function(){
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
      this_o_like_block.push(this_trial);
    }
    like_block_trials = like_block_trials.concat(jsPsych.randomization.shuffle(this_o_like_block))
  }
  return like_block_trials
}


// so the practice should be ~ 6 sets of 10 each (4) followed by a quiz.
var n_rounds = 10;

var practice_trials = [];
for (var i = 0; i < n_rounds; i++){
  var this_round_trials = [];
   c_numb_shuff = jsPsych.randomization.repeat([1,2,3,4],1 );
  //
  // // build all the passive trials
   for (var cx_idx = 0; cx_idx < c_numb_shuff.length; cx_idx++){
     var cx_number = c_numb_shuff[cx_idx];
     var prep_text = "You'll now play the " + choice_names[cx_number - 1] + " slot machine.";
     var start_block_text2 = "For each game, press 1 to play the machine.";
     var start_block_text3 = "Please pay attention! There will be checks.";
     this_round_trials.push(build_text_trial(prep_text,start_block_text2,start_block_text3, true));
  //
     var cx_trials_o1 = build_po_vec(10,all_prob_o1[cx_number - 1]);// build a_trials
     var cx_trials_o1 = jsPsych.randomization.repeat(cx_trials_o1,1);
  //   // build each passive trial
     for (var t = 0; t < cx_trials_o1.length; t++){
       this_round_trials.push(build_practice_trial_stg1(cx_number, cx_trials_o1[t]));
       if (Math.random() < 1/8){
         this_round_trials.push(rand_gen_info_quiz())
       }
     }
   }
  // build the choice quiz trials
  this_round_trials.push(build_text_trial("You'll now be quized on which slot-machine is more likely to lead to which banknote.","Your accuracy will affect your bonus payment.","", true))

  like_quiz_block = make_more_like_block();
  this_round_trials = this_round_trials.concat(like_quiz_block);
  // get the last 6 trials.
  practice_trials = practice_trials.concat(this_round_trials);
  var round_number = i+1;

  var feedback_trial = {
    type: 'evan-display-text',
    line_1: function(){
                      var n_correct = jsPsych.data.get().last(12).filter({correct: 1}).count()
                      var this_text = "You answered " + n_correct +" of the 12 questions correctly.";
                      return this_text;
                    },
    line_2: "You've completed " + round_number + " out of 10 rounds.",
    line_3: "",
    wait_for_press: true,
    data: {phase: 'INFO'} // note this shows up in main phase as well so isn't train per se
  }
  practice_trials.push(feedback_trial);
}


var make_struc_quiz_block = function(round_number){

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
      data:{
        phase: 'TRAIN STRUC QUIZ',
        choice_number: this_choice_number,
        outcome_number: this_outcome_number,
      }
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
                    },
    line_2: "You've completed " + round_number + " out of 12 rounds.",
    line_3: "",
    wait_for_press: true,
    data: {phase: 'INFO'} // note this shows up in main phase as well so isn't train per se
  }
  this_round_trials.push(feedback_trial);
  return this_round_trials;
}

this_round_trials = make_struc_quiz_block(1);

practice_trials = this_round_trials;

// figure out how long this will take.
task1_timeline = practice_trials;




// task1_timeline = [ml_trial];


//practice_round2;//practice_round;
//task1_timeline = choice_block_trials;

 //-- to compute the bonus...
//const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
//var point_vals = jsPsych.data.get().filter({phase: 'TRAIN CHOICE'}).select('points_received').values
//var practice_bonus_trial_points = jsPsych.randomization.sampleWithoutReplacement(point_vals, 4)
//practice_bonus_trial_points =  arrAvg(practice_bonus_trial_points);
// how correct were they on check trials?

//var quiz_pct = jsPsych.data.get().filter({trial_type: 'evan-info-quiz'}).select('correct').mean()
