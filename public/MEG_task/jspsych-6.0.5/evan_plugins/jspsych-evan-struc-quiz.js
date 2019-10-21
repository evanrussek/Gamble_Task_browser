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
      },
      limit_time: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: false
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    var prob_vals = [.2, .4, .6, .8];


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
      wait_for_time(250, end_trial);
    }

    var wait_for_time = function(n_msec, next_fun){
      // wait n_msec and then call next function
      jsPsych.pluginAPI.setTimeout(function() {
          next_fun() //
        }, n_msec);
    } // end wait for time

    // special variables for requestAnimateFrame
    var estimated_frame_duration = null;
    var frame_count;
    var frame_count_stage;
    var frame_count_diode;
    var data_temp = {};
    txt_offset = 'quiz_im';

    var check_timeout = function(timestamp) {

      // get x out of 8 3 times in a row.

        frame_count++;
        // diode specific timeout
    //    console.log('frame_count_diode: ' + frame_count_diode)
    //    console.log('frame_count_stage: ' + frame_count_stage)
    //    console.log('frame_count: '+  frame_count)
        if (frame_count >= frame_count_diode && diode_on) {
            //document.querySelector('#diode').remove();
            remove_diode();
            data_temp[txt_offset + '_diode_offset'] = window.performance.now();
          //  console.log(data_temp)
            diode_on = false;
            window.requestAnimationFrame(check_timeout);
        // general stage timeout
        } else if (frame_count >= frame_count_stage) {
            //next_fun();
            next_stage_fun();
            //next_stage();
        // otherwise repeat the loop
        } else {
          if (count_time){
            window.requestAnimationFrame(check_timeout);
          }
        };
    };  // end of the function


    //function ()

    par = define_parameters('trial');

    // create svg - stimulus background // need to define this here so other funcs can use it
    var svg = d3.select(".jspsych-content-wrapper")
                .append("svg")
                .attr("width", par.w)
                .attr("height", par.h)

    // place grey background on it
    d3.select("svg").append("rect")
          .attr("x", 0).attr("y", 0).attr("width", par.w)
          .attr("height", par.h).style("fill", par.svg_color).style("opacity",.7);


    place_diode(par.background_height, par.background_width, par.h);

    ////////////////////////////////////////

    var handle_response = function(info){
      console.log('response heard')
      jsPsych.pluginAPI.clearAllTimeouts();
      if (response.key == null) {
          response = info;
      }

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      var choice_char = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key);
      var bkg_class = ".bk"+choice_char;
      console.log(bkg_class)
      d3.select(bkg_class).style("opacity",1);

      // here... add correct / incorrect - it's based on the prob that was chosen...
      chosen_p = prob_vals[parseInt(choice_char)-1];
      var pause_time = 50;
      var feedback_time = 250;
      //console.log(chosen_p)
      //console.log(trial.correct_p)
      if (Math.abs(chosen_p - trial.correct_p) < .0001){
        correct = 1;
        wait_for_time(pause_time,function(){place_text('CORRECT!', 'Prompt', par.w/2 + par.diode_width, 20*par.h/40, par.text_font_size, 1, "Green")})
        wait_for_time(pause_time + feedback_time,end_trial)
      } else{
        correct = 0;
        wait_for_time(pause_time,function(){place_text('WRONG!', 'Prompt', par.w/2 + par.diode_width, 20*par.h/40, par.text_font_size, 1, "Red")})
        wait_for_time(pause_time + feedback_time,end_trial)
      }
    }
    txt_offset = 'quiz_im';

    var place_images = function(){

      rafID1 = window.requestAnimationFrame(function() {
          rafID2 = window.requestAnimationFrame(function(timestamp) {

            // place the diode here
                // place the money...
              //  place_img_bkg("info",2*par.w/3 - .8*par.img_bkg_width/2 + par.diode_width, 1.7*par.h/5 - .8*par.img_bkg_height/2, .8*par.img_bkg_width,.8*par.img_bkg_height,par.img_bkg_color,1);
                place_img(trial.outcome_image, "info", 2*par.w/3 - .8*par.image_width + par.diode_width,  1.7*par.h/5 - .8*par.image_height/2, .8*par.image_width, .8*par.image_height, 1);

                var img_bkg_width = par.choice_stim_bkg_width/2;
                var img_bkg_height = par.choice_stim_bkg_height/2;
                var choice_img_width = par.choice_stim_width/2;
                var choice_img_height = par.choice_stim_height/2;
                // place the slot machine...
      //          place_img_bkg("choice_stim",par.w/3 - img_bkg_height/2 + par.diode_width ,1.7*par.h/5 - img_bkg_height/2, img_bkg_width,img_bkg_height, par.choice_stim_bkg_color, 1);
                place_img(trial.choice_image, "choice_stim cL", par.w/3 - choice_img_width/2 + par.diode_width, 1.7*par.h/5 - choice_img_height/2, choice_img_width,choice_img_height,1);
                display_diode();

                // set up the keypress
                keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: handle_response,
                    valid_responses: ['1', '2', '3', '4'],
                    rt_method: 'performance', // check this
                    persist: false,
                    allow_held_key: false
                  });


                time_onset = window.performance.now();
                data_temp[txt_offset + '_diode_onset'] = time_onset;
                data_temp[txt_offset + '_onset'] = time_onset;
                            // set the diode_timing global
                diode_on = true
                frame_count_diode = Math.round(par.struc_quiz_diode_time / estimated_frame_duration);
                            //console.log('frame_count_diode ' + frame_count_diode)
                frame_count_stage = function(){};//Math.round(par.info_time / estimated_frame_duration);
                frame_count = 0;
                next_stage_fun = function(){}; // tne next stage func should be about taking too long, but maybe we don't need it...
                count_time = true;
                window.requestAnimationFrame(check_timeout);
        })
      })
    }

      var place_options = function(){
        // place question
        var q_text_y = par.h/6;
        var q_text_x = par.w/2;
        var img_bkg_width = par.choice_stim_bkg_width/2;
        var img_bkg_height = par.choice_stim_bkg_height/2;

        var txt_q = 'What are the chances this slot machine will provide this banknote?';
        place_text(txt_q, 'Prompt', q_text_x + par.diode_width, q_text_y, par.text_font_size/2, 1, "White");

        place_img_bkg("info",2*par.w/3 - .8*par.img_bkg_width/2 + par.diode_width, 1.7*par.h/5 - .8*par.img_bkg_height/2, .8*par.img_bkg_width,.8*par.img_bkg_height,par.img_bkg_color,1);
        place_img_bkg("choice_stim",par.w/3 - img_bkg_height/2 + par.diode_width ,1.7*par.h/5 - img_bkg_height/2, img_bkg_width,img_bkg_height, par.choice_stim_bkg_color, 1);

        d3.select("svg").append("line")
                        .attr("x1",par.w/3 + 2*img_bkg_height/3 + par.diode_width)
                        .attr("y1",1.65*par.h/5)
                        .attr("x2",2*par.w/3 - 2*.8*par.img_bkg_width/3 + par.diode_width)
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
        var box_y = 24*par.h/40 - box_height/2;

        for (var i = 0; i < 4; i++){
          var k = i+1;
          place_img_bkg(["bk" + k], box_x[i] + par.diode_width, box_y, box_width, box_height, par.good_color_vec[1], 0);
        }

        for (var i = 0; i < 4; i++){
          place_text(100*prob_vals[i] + '%', 'Prompt', prob_x[i] + par.diode_width, 24*par.h/40, par.text_font_size/2, 1, "Yellow");
        }

        // place key under it
        var key_vals = [1, 2, 3, 4];

        for (var i = 0; i < 4; i++){
          place_text(key_vals[i], 'Prompt', prob_x[i] + par.diode_width, 2*par.h/3, par.text_font_size/3, 1, "White");
        }

        place_text('Key Press ', 'Prompt', par.w/2 + par.diode_width, 2.2*par.h/3, par.text_font_size/3, 1, "White");



        /// make them respond fast??? ///
        if (trial.limit_time){
          wait_for_time(3000, handle_slow_response);
        }else{
          wait_for_time(100000, handle_slow_response);
        }
      }


  place_options()
  //var iti_time = 500; // randomize this...
  var iti_time = (Math.random() * (700 - 500) ) + 500;

  estimate_frame_rate(function(frame_rate){
      estimated_frame_duration = frame_rate;
  //    console.log('frame_rate: ' + estimated_frame_duration)
      setTimeout(function(){place_images();}, 100);
  }, iti_time - 100, true);


  //wait_for_time(iti_time, place_images);

  var response = {
          rt: null,
          key: null
  };
        var correct = null;
        var chosen_p = null;

          /// stage 4 - end trial, save data,
          var end_trial = function(){

            if (typeof keyboardListener !== 'undefined') {
              jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
            }
            d3.select('svg').remove()
            data_temp[txt_offset + '_offset'] =  window.performance.now();

            var trial_data = {
              "outcome_image": trial.outcome_image,
              "choice_image": trial.choice_image,
              "correct_p": trial.correct_p,
              "chosen_p": chosen_p,
              "correct": correct,
              "rt": response.rt,
              "key": response.key
              // need to add timing parameters
            };


                      // adding timing data
            function add_timing_data(vars) {
                    for (var i = 0; i < vars.length; i++) {
                        trial_data[vars[i] + '_onset'] = data_temp[vars[i] + '_onset'];
                        trial_data[vars[i] + '_offset'] = data_temp[vars[i] + '_offset'];
                              };
                          };
                      add_timing_data(['quiz_im', 'quiz_im_diode'])
                      console.log(trial_data)


            jsPsych.finishTrial(trial_data);
          } // end end_trial

    // end trial
    //jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
