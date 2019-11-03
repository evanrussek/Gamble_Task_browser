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
        choice_image: {
          type: jsPsych.plugins.parameterType.IMAGE,
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
        o1_image: {
          type: jsPsych.plugins.parameterType.IMAGE,
          default: undefined
        },
        o2_image:{
          type: jsPsych.plugins.parameterType.IMAGE,
          default: undefined
        },
        correct_c: {
          type: jsPsych.plugins.parameterType.IMAGE,
          default: undefined
        },
        q_type: {
          type: jsPsych.plugins.parameterType.INT,
          default: 2
        }
      }
}


plugin.trial = function(display_element, trial) {

  myCInds = [1,2];
  shuffledCInds = jsPsych.randomization.repeat(myCInds, 1);

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

  par = define_parameters('trial');


    // special variables for requestAnimateFrame
    var estimated_frame_duration = null;
    var frame_count;
    var frame_count_stage;
    var frame_count_diode;
    var data_temp = {};
    txt_offset = 'quiz_im';



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
      //    place_text('Correct!', 'Prompt', par.w/2, 29*par.h/40, par.text_font_size, 1, "Red");
          //wait_for_time(par.quiz_pause_resp_time,function(){place_text('CORRECT!', 'Prompt', par.w/2, 29*par.h/40, par.text_font_size, 1, "Red")})
          wait_for_time(par.quiz_pause_resp_time,function(){})
          //wait_for_time(par.quiz_pause_resp_time,function(){place_text('Correct!', 'Prompt', par.w/2, 34*par.h/40, par.text_font_size, 1, "Red")})
          wait_for_time(par.quiz_pause_resp_time + par.quiz_feedback_time,end_trial)
        } else{
          correct = 0;
          wait_for_time(par.quiz_pause_resp_time,function(){})
        //  d3.selectAll('.choice_stim').remove()})
          //wait_for_time(par.quiz_pause_resp_time,function(){place_text('WRONG!', 'Prompt', par.w/2, 34*par.h/40, par.text_font_size, 1, "Red")})
          wait_for_time(par.quiz_pause_resp_time + par.quiz_feedback_time,end_trial)
        }
      }

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


    var place_question1 = function(){
      // place question
       q_text_y = par.h/6;
       q_text_x = par.w/2;

      var txt_q = 'Which slot-machine is more likely to lead to this banknote?';
      place_text(txt_q, 'Prompt', q_text_x, q_text_y, par.text_font_size/2, 1, "White");
    }

    var place_question2 = function(){
      // place question
       q_text_y = par.h/6;
       q_text_x = par.w/2;

      var txt_q = 'Which banknote is this slot machine more likely to produce?';
      place_text(txt_q, 'Prompt', q_text_x, q_text_y, par.text_font_size/2, 1, "White");
    }


    var place_top1 = function(){

       img_bkg_y = par.h/5;
       img_y = img_bkg_y + par.img_bkg_height / 2 - par.image_height/2;

      // place bank note
      place_img_bkg("info",par.img_bkg_x,img_bkg_y,par.img_bkg_width,par.img_bkg_height,par.img_bkg_color,1);
    }

    var place_top2 = function(){

       img_bkg_y = par.h/5;
       img_y = img_bkg_y + par.img_bkg_height / 2 - par.image_height/2;

      // place bank note
    //  place_img_bkg("info",par.img_bkg_x,img_bkg_y,par.img_bkg_width,par.img_bkg_height,par.img_bkg_color,1);
      place_img_bkg("info",par.w/2 - 1.2*par.choice_stim_bkg_width/6,img_bkg_y, 1.2*par.choice_stim_bkg_width/3, 1.2*par.choice_stim_bkg_height/3, par.choice_stim_bkg_color, 1);
    }

    var place_bottom1 = function(){
      // place 2 slot machines
      // put up the image background
       choice_img_width = par.choice_stim_width/2;
       choice_img_height = par.choice_stim_height/2;
       choice_img_x_vec = [par.stg_bkg_x + par.background_width/4 - choice_img_width/2, par.stg_bkg_x + 3*par.background_width/4 - choice_img_width/2];
       choice_img_y = 9*par.h/15 - choice_img_height/2;

       img_bkg_width = par.img_bkg_width;
       img_bkg_height = par.img_bkg_height;
       c_bkg_x = [par.stg_bkg_x + par.background_width/4 - img_bkg_width/2, par.stg_bkg_x + 3*par.background_width/4 - img_bkg_width/2];
       place_img_bkg("choice_stim cL",c_bkg_x[0] + img_bkg_width/4,9*par.h/15 - img_bkg_height/2, img_bkg_height,img_bkg_height, par.choice_stim_bkg_color, 1);
       place_img_bkg("choice_stim cR",c_bkg_x[1] + img_bkg_width/4,9*par.h/15 - img_bkg_height/2, img_bkg_height,img_bkg_height, par.choice_stim_bkg_color, 1);


      choice_image_arr = [trial.c1_image, trial.c2_image];

      // ce key under it
      var key_vals = [1, 2];

      var txt_y= 9*par.h/15 + img_bkg_height/2 + par.text_font_size/1.5;

      for (var i = 0; i < 2; i++){
        place_text(key_vals[i], 'Prompt', choice_img_x_vec[i] + choice_img_width/2, txt_y, par.text_font_size/3, 1, "White");
      }

      place_text('Key Press', 'Prompt', par.w/2, txt_y + par.text_font_size/2, par.text_font_size/3, 1, "White");

    }

    var place_bottom2 = function(){
      // place 2 slot machines
      // put up the image background
       choice_img_width = par.choice_stim_width/2;
       choice_img_height = par.choice_stim_height/2;
       choice_img_x_vec = [par.stg_bkg_x + par.background_width/4 - choice_img_width/2, par.stg_bkg_x + 3*par.background_width/4 - choice_img_width/2];
       choice_img_y = 9*par.h/15 - choice_img_height/2;

       img_bkg_width = par.choice_stim_bkg_width/2;
       img_bkg_height = par.choice_stim_bkg_height/2;

       //c_bkg_x = [par.stg_bkg_x + par.background_width/4 - img_bkg_width/2, par.stg_bkg_x + 3*par.background_width/4 - img_bkg_width/2];
       c_x_ctrs = [par.w/2];
       c_y_ctrs = [.8*par.h/2];

        o_bkg_width = par.h/4;
        o_bkg_height = par.h/7;
        o_img_width = o_bkg_height*.8;

       // outcome 1 background
       place_img_bkg("choice_stim cL",c_x_ctrs[0] - par.w/8 - o_bkg_width/2,
        c_y_ctrs[0] + par.h/4 - o_bkg_width/2, o_bkg_width,o_bkg_height,par.img_bkg_color,1);

        // outcome 2 background
        place_img_bkg("choice_stim cR",c_x_ctrs[0] + par.w/8 - o_bkg_width/2,
         c_y_ctrs[0] + par.h/4 - o_bkg_width/2, o_bkg_width,o_bkg_height,par.img_bkg_color,1);

        // outcome 2 background
      //  place_img_bkg("info",c_x_ctrs[i] + par.w/8 - o_bkg_width/2,
      //   c_y_ctrs[i] + par.h/4 - o_bkg_width/2, o_bkg_width,o_bkg_height,par.img_bkg_color,1);



      choice_image_arr = [trial.c1_image, trial.c2_image];

      // ce key under it
      var key_vals = [1, 2];

      var txt_y= 9*par.h/15 + img_bkg_height/2 + par.text_font_size/1.5;

      for (var i = 0; i < 2; i++){
        place_text(key_vals[i], 'Prompt', choice_img_x_vec[i] + choice_img_width/2, txt_y, par.text_font_size/3, 1, "White");
      }

      place_text('Key Press', 'Prompt', par.w/2, txt_y + par.text_font_size/2, par.text_font_size/3, 1, "White");

    }

    var place_images1 = function(){
      place_img(trial.outcome_image, "outcome_image", par.image_x, img_y, par.image_width, par.image_height,1);
      place_img(choice_image_arr[shuffledCInds[0]-1], "choice_stim cL", choice_img_x_vec[0], choice_img_y, choice_img_width,choice_img_height,1);
      place_img(choice_image_arr[shuffledCInds[1]-1], "choice_stim cR", choice_img_x_vec[1], choice_img_y, choice_img_width,choice_img_height,1);
    }

    var place_images2 = function(){
      place_img(trial.choice_image, "choice_image", par.w/2 - par.image_width/2, img_y, par.image_width, par.image_height,1);


      outcome_image_arr = [trial.o1_image, trial.o2_image];

      // o2 image...
        place_img(outcome_image_arr[shuffledCInds[0]-1],"image",
        c_x_ctrs[0] - par.w/8 - o_img_width,
         c_y_ctrs[0] + par.h/4 - o_img_width,
          o_img_width,o_img_width,par.img_bkg_color,1);

      // o2 image...
      place_img(outcome_image_arr[shuffledCInds[1]-1],"image",
      c_x_ctrs[0] + par.w/8 - o_img_width,
       c_y_ctrs[0] + par.h/4 - o_img_width,
        o_img_width,o_img_width,par.img_bkg_color,1);
    }

    var place_images_fun = function(){
      rafID1 = window.requestAnimationFrame(function() {
          rafID2 = window.requestAnimationFrame(function(timestamp) {
            if (trial.q_type == 1){
              place_images1();
            }else{place_images2();}
            display_diode();
            var valid_responses = ['1', '2'];
            keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
               callback_function: handle_response,
               valid_responses: valid_responses,
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

    if (trial.q_type == 1){
      place_question1(); place_top1(); place_bottom1();
      estimate_frame_rate(function(frame_rate){
          estimated_frame_duration = frame_rate;
          console.log('frame_rate: ' + estimated_frame_duration)
          setTimeout(function(){place_images_fun();
            }, 100);
          }, 500 - 100, true);
    }else{

      place_question2();
      place_top2();
      place_bottom2();

      estimate_frame_rate(function(frame_rate){
          estimated_frame_duration = frame_rate;
          console.log('frame_rate: ' + estimated_frame_duration)
          setTimeout(function(){place_images_fun();
            var valid_responses = ['1', '2'];
            }, 100);
          }, 500 - 100, true);
    }

    //var myCInds = [0,1];
    //par.shuffledCInds = jsPsych.randomization.repeat(myInds, 1);
    //par.choice_images = [trial.c1_image, trial.c2_image];


      var max_time = 80000000;
      wait_for_time(max_time, handle_slow_response);

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



};

return plugin;
})();
