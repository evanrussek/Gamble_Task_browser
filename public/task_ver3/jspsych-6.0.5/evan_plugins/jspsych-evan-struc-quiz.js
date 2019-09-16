/*
 * Example plugin template
 */


// plugin to show either a photo, or a piece of text and ask which reward it was just paired with...
jsPsych.plugins["evan-struc-quiz"] = (function() {

  // add time up and record response...

  var plugin = {};

  plugin.info = {
    name: "evan-struc-quiz",
    parameters: {
      choice_image:{
        type: jsPsych.plugins.parameterType.IMAGE, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      outcome_image: {
        type: jsPsych.plugins.parameterType.IMAGE, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      correct_p: {
        type: jsPsych.plugins.parameterType.FLOAT,
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

      console.log("images")
      console.log(trial.outcome_image)
      var txt_q = 'What are the chances this slot machine will provide this banknote?';
      place_text(txt_q, 'Prompt', q_text_x, q_text_y, par.text_font_size/2, 1, "White");

      // place the money...
      place_img_bkg("info",2*par.w/3 - .8*par.img_bkg_width/2, 1.65*par.h/5 - .8*par.img_bkg_height/2, .8*par.img_bkg_width,.8*par.img_bkg_height,par.img_bkg_color,1);
      place_img(trial.outcome_image, "info", 2*par.w/3 - .8*par.image_width,  1.65*par.h/5 - .8*par.image_height/2, .8*par.image_width, .8*par.image_height, 1);

      var img_bkg_width = par.choice_stim_bkg_width/2;
      var img_bkg_height = par.choice_stim_bkg_height/2;
      var choice_img_width = par.choice_stim_width/2;
      var choice_img_height = par.choice_stim_height/2;
      // place the slot machine...
      place_img_bkg("choice_stim",par.w/3 - img_bkg_height/2 ,1.65*par.h/5 - img_bkg_height/2, img_bkg_width,img_bkg_height, par.choice_stim_bkg_color, 1);
      place_img(trial.choice_image, "choice_stim cL", par.w/3 - choice_img_width/2, 1.65*par.h/5 - choice_img_height/2, choice_img_width,choice_img_height,1);

      d3.select("svg").append("line")
                      .attr("x1",par.w/3 + 2*img_bkg_height/3 )
                      .attr("y1",1.65*par.h/5)
                      .attr("x2",2*par.w/3 - 2*.8*par.img_bkg_width/3)
                      .attr("y2",1.65*par.h/5)
                      .attr("stroke-width", 2)
                      .attr("marker-end", "url(#arrow)")
                      .attr("stroke", "white");

    // place money
    var prob_x = [par.w/5, 2*par.w/5, 3*par.w/5, 4*par.w/5];
    var prob_vals = [.2, .4, .6, .8];


    // background boxes
    var box_width = par.w/10;
    var box_height = par.w/10;
    var box_x = [prob_x[0] - box_width/2, prob_x[1] - box_width/2,
                  prob_x[2] - box_width/2, prob_x[3] - box_width/2];
    var box_y = 2*par.h/3 - box_height/2;

    for (var i = 0; i < 4; i++){
      var k = i+1;
      place_img_bkg(["bk" + k], box_x[i], box_y, box_width, box_height, par.good_color_vec[1], 0);
    }

    for (var i = 0; i < 4; i++){
      place_text(prob_vals[i], 'Prompt', prob_x[i], 2*par.h/3, par.text_font_size/2, 1, "Yellow");
    }

    // place key under it
    var key_vals = [1, 2, 3, 4];

    for (var i = 0; i < 4; i++){
      place_text(key_vals[i], 'Prompt', prob_x[i], 22.5*par.h/40, par.text_font_size/3, 1, "White");
    }

    place_text('Key Press ', 'Prompt', par.w/2, 23.5*par.h/40, par.text_font_size/3, 1, "White");


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
          wait_for_time(par.quiz_pause_resp_time,function(){place_text('CORRECT!', 'Prompt', par.w/2, 29*par.h/40, par.text_font_size, 1, "Red")})
          wait_for_time(par.quiz_pause_resp_time + par.quiz_feedback_time,end_trial)
        } else{
          correct = 0;
          wait_for_time(par.quiz_pause_resp_time,function(){place_text('WRONG!', 'Prompt', par.w/2, 29*par.h/40, par.text_font_size, 1, "Red")})
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

        wait_for_time(100000, handle_slow_response);

      var response = {
          rt: null,
          key: null
        };
        var correct = null;

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
              "key": response.key
              // need to add timing parameters
            };

            jsPsych.finishTrial(trial_data);
          } // end end_trial




    // end trial
    //jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
