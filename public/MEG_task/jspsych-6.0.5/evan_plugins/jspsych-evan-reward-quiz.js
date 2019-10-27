/*
 * Example plugin template
 */


// plugin to show either a photo, or a piece of text and ask which reward it was just paired with...
jsPsych.plugins["evan-reward-quiz"] = (function() {

  // diode this...

  var plugin = {};

  plugin.info = {
    name: "evan-reward-quiz",
    parameters: {
      outcome_image:{
        type: jsPsych.plugins.parameterType.IMAGE, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      outcome_name: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      outcome_val: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined
      },
      other_vals: { // try this for a list...
        type: jsPsych.plugins.parameterType.INT,
        default: undefined
      },
      use_image: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined
      },
      MEG_buttons: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: true
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


    var correct_response = 1;

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

          d3.select('svg')
            .append('line')
            .attr('x1', par.diode_width)
            .attr('x2', par.diode_width)
            .attr('y1', 0)
            .attr('y2', par.h)
            .style('stroke-width', 1)
            .style('stroke', 'black')


            //d3.select('.info_bkg').transition().style("opacity",1).duration(par.info_fadein_time);

//    place_diode(par.background_height, par.background_width, par.h);

    ////////////////////////////////////////

    // place question
    var q_text_y = par.h/5;
    var q_text_x = par.w/2 + par.diode_width;

    if (trial.use_image){
      console.log("images")
      console.log(trial.outcome_image)
      var txt_q = 'How many points is this banknote worth?';
      place_text(txt_q, 'Prompt', q_text_x, q_text_y, par.text_font_size/2, 1, "White");

      place_img_bkg("info",par.w/2 - .8*par.img_bkg_width/2 + par.diode_width, 1.65*par.h/5 - .8*par.img_bkg_height/2, .8*par.img_bkg_width,.8*par.img_bkg_height,par.img_bkg_color,1);
      place_img(trial.outcome_image, "info", par.w/2 - .8*par.image_width + par.diode_width,  1.65*par.h/5 - .8*par.image_height/2, .8*par.image_width, .8*par.image_height, 1);

    } else{
      console.log("text")
      console.log(trial.outcome_name)
      var txt_q = 'How many points is this banknote worth?';
      place_text(txt_q, 'Prompt', q_text_x, q_text_y, par.text_font_size/2, 1, "White");
      place_text(trial.outcome_name, 'Prompt', q_text_x, 1.7*par.h/5, 2*par.text_font_size/3, 1, "Green");

    }

    // place money


    if (trial.MEG_buttons){
        var rew_x = [par.w/2, 1.2*par.w/2, par.w/2, .8*par.w/2];
        //24*par.h/40
        var rew_y = [.95*par.h/2, 1.15*par.h/2, 1.35*par.h/2, 1.15*par.h/2];
    }else{
      var rew_x = [par.w/5 + par.diode_width, 2*par.w/5 + par.diode_width,
         3*par.w/5 + par.diode_width, 4*par.w/5 + par.diode_width];
         var rew_y = [1.1*par.h/2, 1.1*par.h/2,
            1.1*par.h/2, 1.1*par.h/2];
    }

    var money_vals = [trial.outcome_val, trial.other_vals[0], trial.other_vals[1], trial.other_vals[2]];
    var myInds = [0,1,2,3];
    var shuffledInds = jsPsych.randomization.repeat(myInds,1);

    // background boxes
    var box_width = par.w/10;
    var box_height = par.w/10;
    var box_x = [rew_x[0] - box_width/2,
     rew_x[1] - box_width/2,
                  rew_x[2] - box_width/2,
                  rew_x[3] - box_width/2];

    var box_y = par.h/2 - box_height/2;

    for (var i = 0; i < 4; i++){
      var k = i+1;
      place_img_bkg(["bk" + k], rew_x[i] - box_width/2, rew_y[i] - box_width/2, box_width, box_height, par.good_color_vec[1], 0);
    }

    for (var i = 0; i < 4; i++){
      place_text(money_vals[shuffledInds[i]], 'Prompt', rew_x[i], rew_y[i], par.text_font_size/2, 1, "Yellow");
    }

    // place key under it
    var key_vals = [1, 2, 3, 4];

    for (var i = 0; i < 4; i++){
      place_text(key_vals[i], 'Prompt', rew_x[i], 1.05*rew_y[i], par.text_font_size/3, 1, "White");
    }

      place_text('Key Press ', 'Prompt', par.w/2 + par.diode_width, rew_y[1], par.text_font_size/3, 1, "White");

      var quiz_on_time = window.performance.now();

      var handle_response = function(info){
        console.log('response heard')
        jsPsych.pluginAPI.clearAllTimeouts();
        if (response.key == null) {
            response = info;
        }
        var choice_char = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key);
        var bkg_class = ".bk"+choice_char;
        console.log(bkg_class)
        d3.select(bkg_class).style("opacity",1);

        if (shuffledInds[parseInt(choice_char)-1] == 0){
          correct = 1;
          wait_for_time(par.quiz_pause_resp_time,function(){
            place_text('CORRECT!', 'Prompt', par.w/2 + par.diode_width, 29*par.h/40, par.text_font_size, 1, "Red")
            var feedback_time = window.performance.now();})
          wait_for_time(par.quiz_pause_resp_time + par.quiz_feedback_time,end_trial)
        } else{
          correct = 0;
          wait_for_time(par.quiz_pause_resp_time,function(){
            place_text('WRONG!', 'Prompt', par.w/2 + par.diode_width, 29*par.h/40, par.text_font_size, 1, "Red")
            var feedback_time = window.performance.now();
          })
          wait_for_time(par.quiz_pause_resp_time + par.quiz_feedback_time,end_trial)
        }
      }

      // set up the keypress
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: handle_response,
          valid_responses: ['1', '2', '3', '4'],
          rt_method: 'performance', // check this
          persist: false,
          allow_held_key: false
        });

        wait_for_time(par.quiz_response_time, handle_slow_response);
        //wait_for_time(par.quiz_response_time, 100000000);

      var response = {
          rt: null,
          key: null
        };
        var correct = null;
        var quiz_on_time = null;
        var feedback_time = null;

          /// stage 4 - end trial, save data,
          var end_trial = function(){

            if (typeof keyboardListener !== 'undefined') {
              jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
            }
            d3.select('svg').remove()

            var trial_data = {
              "outcome_image": trial.outcome_image,
              "outcome_val": trial.outcome_val,
              "outcome_name": trial.outcome_name,
              "correct": correct,
              "rt": response.rt,
              "key": response.key,
              "quiz_on_time": quiz_on_time,
              "feedback_time": feedback_time
              // need to add timing parameters
            };

            jsPsych.finishTrial(trial_data);
          } // end end_trial




    // end trial
    //jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
