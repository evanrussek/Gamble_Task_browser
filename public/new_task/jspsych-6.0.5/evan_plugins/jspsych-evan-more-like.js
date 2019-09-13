jsPsych.plugins["evan-more-like"] = (function() {
  /// problem::: choiced is processed in outcome stage -- want it processed in choice stage

  var plugin = {};

  plugin.info = {
    name: "evan-more-like",
    parameters: {
        outcome_image: {
          type: jsPsych.plugins.parameterType.INT,
          default: undefined
        },
        c1_image: {
          type: jsPsych.plugins.parameterType.IMAGE,
          default: undefined
        },
        c2_image: {
          type: jsPsych.plugins.parameterType.IMAGE,
          default: undefined
        },
        correct_c: {
          type: jsPsych.plugins.parameterType.IMAGE,
          default: undefined
        }
      }
}


plugin.trial = function(display_element, trial) {

  var handle_slow_response = function(){
    jsPsych.pluginAPI.clearAllTimeouts();
    place_reward('Please respond faster!', 'slow_reply', par.slow_reply_x, par.slow_reply_y, par.slow_reply_font_size, 1);
    d3.select(".slow_reply")
      .attr("fill", "red")
    response.choice = "SLOW";
    response.accept = "NA";

    // kill keyboard listeners
    if (typeof keyboardListener !== 'undefined') {
      jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
    }

    wait_for_time(par.slow_reply_time, end_trial);
  }

  var wait_for_time = function(n_msec, next_fun){
    // wait n_msec and then call next function
    jsPsych.pluginAPI.setTimeout(function() {
        next_fun() //
      }, n_msec);
  } // end wait for time

  par = define_parameters('trial');
  // place the svg.
  // create svg - stimulus background // need to define this here so other funcs can use it
  var svg = d3.select(".jspsych-content-wrapper")
              .append("svg")
              .attr("width", par.w)
              .attr("height", par.h)

  // place grey background on it
  d3.select("svg").append("rect")
        .attr("x", 0).attr("y", 0).attr("width", par.w)
        .attr("height", par.h).style("fill", par.svg_color).style("opacity",.7);
  ////////////////////////////////////////

    // place question
    var q_text_y = par.h/6;
    var q_text_x = par.w/2;

    var txt_q = 'Which slot-machine is more likely to lead to this banknote?';
    place_text(txt_q, 'Prompt', q_text_x, q_text_y, par.text_font_size/2, 1, "White");


    //
    var img_bkg_y = par.h/5;
    var img_y = img_bkg_y + par.img_bkg_height / 2 - par.image_height/2;

    // place bank note
    place_img_bkg("info",par.img_bkg_x,img_bkg_y,par.img_bkg_width,par.img_bkg_height,par.img_bkg_color,1);
    place_img(trial.outcome_image, "outcome_image", par.image_x, img_y, par.image_width, par.image_height,1);

    // place 2 slot machines
    // put up the image background
    var choice_img_width = par.choice_stim_width/2;
    var choice_img_height = par.choice_stim_height/2;
    var choice_img_x_vec = [par.stg_bkg_x + par.background_width/4 - choice_img_width/2, par.stg_bkg_x + 3*par.background_width/4 - choice_img_width/2];
    var choice_img_y = 9*par.h/15 - choice_img_height/2;

    var img_bkg_width = par.choice_stim_bkg_width/2;
    var img_bkg_height = par.choice_stim_bkg_height/2;
    var c_bkg_x = [par.stg_bkg_x + par.background_width/4 - img_bkg_width/2, par.stg_bkg_x + 3*par.background_width/4 - img_bkg_width/2];
    place_img_bkg("choice_stim cL",c_bkg_x[0],9*par.h/15 - img_bkg_height/2, img_bkg_width,img_bkg_height, par.choice_stim_bkg_color, 1);
    place_img_bkg("choice_stim cR",c_bkg_x[1],9*par.h/15 - img_bkg_height/2, img_bkg_width,img_bkg_height, par.choice_stim_bkg_color, 1);

    //var myCInds = [0,1];
    //par.shuffledCInds = jsPsych.randomization.repeat(myInds, 1);
    //par.choice_images = [trial.c1_image, trial.c2_image];

    var myCInds = [1,2];
    var shuffledCInds = jsPsych.randomization.repeat(myCInds, 1);

    var choice_images = [trial.c1_image, trial.c2_image];

    place_img(choice_images[shuffledCInds[0]-1], "choice_stim cL", choice_img_x_vec[0], choice_img_y, choice_img_width,choice_img_height,1);
    place_img(choice_images[shuffledCInds[1]-1], "choice_stim cR", choice_img_x_vec[1], choice_img_y, choice_img_width,choice_img_height,1);

    // place key under it
    var key_vals = [1, 2];

    var txt_y= 9*par.h/15 + img_bkg_height/2 + par.text_font_size/1.5;

    for (var i = 0; i < 2; i++){
      place_text(key_vals[i], 'Prompt', choice_img_x_vec[i] + choice_img_width/2, txt_y, par.text_font_size/3, 1, "White");
    }

    place_text('Key Press', 'Prompt', par.w/2, txt_y + par.text_font_size/2, par.text_font_size/3, 1, "White");

  var handle_response = function(info){
      console.log('response heard')
      jsPsych.pluginAPI.clearAllTimeouts();
      if (response.key == null) {
          response = info;
      }
      var choice_char = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key);
      if (choice_char == '1'){
        var bkg_class = '.cL';
      } else{
        var bkg_class = '.cR';
      }
      console.log(bkg_class)
      d3.select(bkg_class).style("fill","brown");

      // figure out if it's correct or not - record this...
      if (shuffledCInds[parseInt(choice_char)-1] == trial.correct_c){
        correct = 1;
        //place_text('Correct!', 'Prompt', par.w/2, 29*par.h/40, par.text_font_size, 1, "Red");
        //wait_for_time(par.quiz_pause_resp_time,function(){place_text('CORRECT!', 'Prompt', par.w/2, 29*par.h/40, par.text_font_size, 1, "Red")})
        wait_for_time(par.quiz_pause_resp_time,function(){d3.selectAll('.choice_stim').remove()})
        //wait_for_time(par.quiz_pause_resp_time,function(){place_text('Correct!', 'Prompt', par.w/2, 34*par.h/40, par.text_font_size, 1, "Red")})
        wait_for_time(par.quiz_pause_resp_time + par.quiz_feedback_time,end_trial)
      } else{
        correct = 0;
        wait_for_time(par.quiz_pause_resp_time,function(){d3.selectAll('.choice_stim').remove()})
        //wait_for_time(par.quiz_pause_resp_time,function(){place_text('WRONG!', 'Prompt', par.w/2, 34*par.h/40, par.text_font_size, 1, "Red")})
        wait_for_time(par.quiz_pause_resp_time + par.quiz_feedback_time,end_trial)
      }
    }

    var valid_responses = ['1', '2'];
    var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: handle_response,
        valid_responses: valid_responses,
        rt_method: 'performance', // check this
        persist: false,
        allow_held_key: false
      });

      //wait_for_time(par.quiz_response_time, handle_slow_response);

    var response = {
        rt: null,
        key: null
      };
      correct = null;


        /// stage 4 - end trial, save data,
        var end_trial = function(){

          if (typeof keyboardListener !== 'undefined') {
            jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          }
          d3.select('svg').remove()

          var trial_data = {
            "outcome_image": trial.outcome_image,
            "c1_image": trial.c1_image,
            "c2_image": trial.c2_image,
            "correct": correct,
            "rt": response.rt,
            "key": response.key
            // need to add timing parameters
          };

          jsPsych.finishTrial(trial_data);
        } // end end_trial



};

return plugin;
})();
