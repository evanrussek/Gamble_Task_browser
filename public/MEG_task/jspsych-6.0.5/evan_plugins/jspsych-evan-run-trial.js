/*
 * Example plugin template
 */

jsPsych.plugins["evan-run-trial"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "evan-run-trial",
    parameters: {

      first_stage:{
        type: jsPsych.plugins.parameterType.INT,
        default: undefined
      },
      last_stage:{
        type: jsPsych.plugins.parameterType.INT,
        default: undefined
      },
      allow_reject:{
        type: jsPsych.plugins.parameterType.BOOL,
        default: true
      },
      show_money_val:{
        type: jsPsych.plugins.parameterType.BOOL,
        default: undefined
      },
      safe_val: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined
      },
      o1_val: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined
      },
      o2_val: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined
      },
      p_o1: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: undefined
      },
      o1_image: {
        type: jsPsych.plugins.parameterType.IMAGE,
        default: undefined
      },
      o2_image: {
        type: jsPsych.plugins.parameterType.IMAGE,
        default: undefined
      },
      safe_image: {
        type: jsPsych.plugins.parameterType.IMAGE,
        default: undefined
      },
      choice_image: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: undefined
      },
      exp_stage: {
        type: jsPsych.plugins.parameterType.STRING,
        default: "trial"
      },
      show_prompt:{
        type: jsPsych.plugins.parameterType.BOOL,
        default: false
      },
      limit_time:{
        type: jsPsych.plugins.parameterType.BOOL,
        default: true
      },
      stim_pos_y:{
        type: jsPsych.plugins.parameterType.INT,
        default: 1
      },
      show_diode:{
        type: jsPsych.plugins.parameterType.BOOL,
        default: true
      }
    }
  }

  plugin.trial = function(display_element, trial) {


    var outcome_images = [trial.o1_image, trial.o2_image, trial.safe_image];
    var outcome_vals = [trial.o1_val, trial.o2_val, trial.safe_val];

    var myInds = [0,1,2];
    var shuffledInds = jsPsych.randomization.repeat(myInds, 1);
    var stim_pos_y = trial.stim_pos_y;
    var stim_pos_x = 1; /// change this?

    //par = define_parameters('trial', trial.o1_image, trial.o2_image,
    //          trial.safe_image, trial.o1_val, trial.o2_val, trial.safe_val);

    var par = define_parameters(trial.exp_stage);


    // you should randomize the y...
    if (par.randomize_info_y){
      var stim_pos_y = 1 + Math.round(Math.random());
    }

    if (par.randomize_info_x){
      var stim_pos_x = 1 + Math.round(Math.random());
    }

    par.outcome_images = [trial.o1_image, trial.o2_image, trial.safe_image];
    par.outcome_vals = [trial.o1_val, trial.o2_val, trial.safe_val];

    myInds = [0,1,2];
    par.shuffledInds = jsPsych.randomization.repeat(myInds, 1);

    //d3.select(".jspsych-content-wrapper").remove();

    ///// set all timing parameters (in milliseconds)
    //// generally useful helper functions
    var wait_for_time = function(n_msec, next_fun){
      // wait n_msec and then call next function
      jsPsych.pluginAPI.setTimeout(function() {
          next_fun() //
        }, n_msec);
    } // end wait for time

    // functions to assist with callbacks after multiple transitions are run
    var setupMT = function(sel){
      counter = sel.size(); // set a function
      //console.log('counter_start:' + counter)
    }
    var onMT = function(next_fun){
      counter--;
      if(counter == 0){ next_fun(); }
    }

    var this_MT = function(){
       return onMT(this_next_fun);
     }

    // create svg - stimulus background // need to define this here so other funcs can use it
    var svg = d3.select(".jspsych-content-wrapper")
                .append("svg")
                .attr("width", par.w)
                .attr("height", par.h)

    // place grey background on it
    d3.select("svg").append("rect")
          .attr("x", 0).attr("y", 0).attr("width", par.w)
          .attr("height", par.h).style("fill", par.svg_color).style("opacity",.7);

    //// functions for placing stimuli
    var place_stg_bkg = function(class_name,color,opacity) {
        // place stage background
        // only thing that changes here is the class_name and the color
          d3.select("svg").append("rect")
              .attr("class", class_name)
              .attr("x", par.w/2 - par.background_width/2 + par.diode_width)
              .attr("y", par.h/2 - par.background_height/2)
              .attr("width", par.background_width)
              .attr("height", par.background_height)
              .style("fill", color)
              .style("opacity",opacity);
      };

    place_diode(par.background_height, par.background_width, par.h);
    //display_diode();
    d3.select('svg')
      .append('line')
      .attr('x1', par.diode_width)
      .attr('x2', par.diode_width)
      .attr('y1', 0)
      .attr('y2', par.h)
      .style('stroke-width', 1)
      .style('stroke', 'black')



    var place_fixation = function(){
      d3.select('svg').append("text")
                .attr("class", "my_fix")
                .attr("x",  par.fixation_x)
                .attr("y", par.fixation_y)
                .attr("font-family","monospace")
                .attr("font-weight","bold")
                .attr("dominant-baseline", "central")
                .attr("font-size",par.fixation_font_size)
                .attr("text-anchor","middle")
                .attr("fill", par.fixation_color)
                .style("opacity",1)
                .text('+')
      }


    var place_outcomes = function(opacity){
      // put up the accept outcome 1  (just 1 for now)outcome_img_height
      place_img_bkg("ob",par.f_outcome_img_bkg_x,par.f_outcome_img_bkg_y,par.f_outcome_img_bkg_width,par.f_outcome_img_bkg_height,par.img_bkg_color,opacity);
      place_img(trial.o1_image, "o1", par.f_outcome_img_x, par.f_outcome_img_y,
                    par.f_outcome_img_width, par.f_outcome_img_height,opacity);
      if (trial.show_money_val){place_reward(trial.o1_val, "o1",
                  par.outcome_text_x, par.outcome_text_y, par.outcome_text_font_size,opacity)};

      // accept outcome 2
      place_img(trial.o2_image, "o2", par.f_outcome_img_x,
                  par.f_outcome_img_y, par.f_outcome_img_width, par.f_outcome_img_height,opacity);

      if (trial.show_money_val){place_reward(trial.o2_val, "o2", par.outcome_text_x,
                    par.outcome_text_y, par.outcome_text_font_size,opacity)};

      // reject outcome
      place_img(trial.safe_image, "safe", par.f_outcome_img_x, par.f_outcome_img_y,
            par.f_outcome_img_width, par.f_outcome_img_height,opacity);
      if (trial.show_money_val){place_reward(trial.safe_val, "safe",
              par.outcome_text_x, par.outcome_text_y, par.outcome_text_font_size,opacity)};
    }

    var place_choice = function(opacity){

      // put up choice_stim too so we can fade into it
      place_stg_bkg("choice_stim choice_bkg",par.choice_bkg_color,opacity);
      // put up the image background
      place_img_bkg("choice_stim",par.choice_stim_bkg_x,par.choice_stim_bkg_y,
                    par.choice_stim_bkg_width,par.choice_stim_bkg_height,
                      par.choice_stim_bkg_color,opacity);

      place_img(trial.choice_image, "choice_stim", par.choice_stim_x,
                            par.choice_stim_y, par.choice_stim_width, par.choice_stim_height,opacity);

    }

    var place_info = function(opacity){

      // place stage background
      place_stg_bkg("info_bkg",par.info_bkg_color,opacity);

      if (par.info_pos == 1){

        // place every image specific background and every image on top of it
        for (var i=0; i<3; i++){
          place_img_bkg("info",par.img_bkg_x,par.img_bkg_y_vec[i],par.img_bkg_width,par.img_bkg_height,par.img_bkg_color,opacity);
          if (par.randomize_info){ // but randomize for subjects?
            place_img(par.outcome_images[par.shuffledInds[i]], "info", par.image_x, par.image_y_vec[i], par.image_width, par.image_height,opacity);
            place_reward(par.outcome_vals[par.shuffledInds[i]], "info", par.text_x, par.text_y_vec[i], par.text_font_size,opacity);
          } else{
            place_img(par.outcome_images[i], "info", par.image_x, par.image_y_vec[i], par.image_width, par.image_height,opacity);
            place_reward(par.outcome_vals[i], "info", par.text_x, par.text_y_vec[i], par.text_font_size,opacity);
          }
        }
      } else{
        // use different posittions -
        // place every image specific background and every image on top of it
        if (stim_pos_y == 1){ // x/y
          var this_pos = [0, 1];
        } else{
          var this_pos = [1, 0];
        };

        if (stim_pos_x == 1){
          var this_pos_x = [0, 0, 2];
        } else{
           var this_pos_x = [2, 2, 0];
        }

        for (var i=0; i<2; i++){
            place_img_bkg("info",par.img_bkg_x2_vec[this_pos_x[i]],par.img_bkg_y2_vec[i],par.img_bkg_width2,par.img_bkg_height2,par.img_bkg_color,opacity);
          //if (par.randomize_info){ // but randomize for subjects?
            place_img(par.outcome_images[this_pos[i]], "info", par.image_x2_vec[this_pos_x[i]], par.image_y2_vec[i], par.image_width, par.image_height,opacity);
            place_reward(par.outcome_vals[this_pos[i]], "info", par.text_x2_vec[this_pos_x[i]], par.text_y2_vec[i], par.text_font_size,opacity);
        }
        var i = 2;
        place_img_bkg("info",par.img_bkg_x2_vec[this_pos_x[i]],par.img_bkg_y2_vec[i],par.img_bkg_width2,par.img_bkg_height2,par.img_bkg_color,opacity);
      //if (par.randomize_info){ // but randomize for subjects?
        place_img(par.outcome_images[i], "info", par.image_x2_vec[this_pos_x[i]], par.image_y2_vec[i], par.image_width, par.image_height,opacity);
        place_reward(par.outcome_vals[i], "info", par.text_x2_vec[this_pos_x[i]], par.text_y2_vec[i], par.text_font_size,opacity);

      }
    }

    var place_everything  = function(){
      place_fixation();
      place_outcomes(0);
      place_choice(0);
      place_info(0);
    }


    // each time you end a stange, set frame_count to 0, and
    // frame_count_stage to
    // 0
    // function for stopping the presentation

    // special variables for requestAnimateFrame
    var estimated_frame_duration = null;
    var frame_count;
    var frame_count_stage;
    var frame_count_diode;
    var data_temp = {};

    // function for easier update of stage variables
    // so, we do this with frame counts --- timing stims is
    var update_stage_vars = function(timing_stim, timing_diode, txt, response_on = false) {
        frame_count = 0;
        frame_count_stage = Math.round(timing_stim / estimated_frame_duration);
        frame_count_diode = Math.round(timing_diode / estimated_frame_duration);
        txt_offset = txt;
        if (response_on) {
            diode_on = false;
        } else {
            diode_on = true;
        }
        // print stage info
        if (verbose) {
            console.log("---------- " + txt + " stage ---------")
            console.log("Target frame count stage", frame_count_stage)
            console.log("Target frame count diode", frame_count_diode)
        };
    };

    var check_timeout = function(timestamp) {
        frame_count++;
        // diode specific timeout
      //  console.log('frame_count_diode: ' + frame_count_diode)
      //  console.log('frame_count_stage: ' + frame_count_stage)
      //  console.log('frame_count: '+  frame_count)
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



    ////// master function which runs the whole trial
    var trial_master = function(trial_stage){
      // reset frame stuff...

      switch(trial_stage){
        // part 1 is stage 1
        case 1:
          //console.log('trial_part_1_starting')
          // information
          if (trial.last_stage < 2){
            txt_offset = 'quiz_info';
          } else{  txt_offset = 'trial_info'; }
          stage_1_master(1);
          break;

        case 2:
          //console.log('trial_part_2 starting')
          // choice
          txt_offset = 'trial_choice_stim'; // record when this comes off
          stage_2_master(1);
          break;
        case 3:
          // feedback - want a diode when the feedback is on.
          txt_offset = 'trial_feedback'; // record when this comes off
          stage_3_master(1);
          break;
        case 4:
          // end trial
          //console.log('end trial')
          end_trial();
          // end the trial
      }
    }

    //// function to run each stage
    var stage_1_master = function(stage_1_part){
      switch(stage_1_part){
        case 1:
          // takes x seconds - set it above how long it should take
          display_trial_info();
          break;
        case 2: // got here twice?
          remove_trial_info();
          //wait_for_time(par.info_time,remove_trial_info);
          break;
        case 3:
          window.cancelAnimationFrame(rafID1); // cancel the info animation frame
          window.cancelAnimationFrame(rafID2);
          if (trial.last_stage < 2){var next_stage_number = 4} else{var next_stage_number = 2};
          wait_for_time(par.post_info_time,function(){trial_master(next_stage_number)});
        }
      }

    var stage_2_master = function(stage_2_part){
      // this is getting ca
      switch(stage_2_part){
        case 1:
          //console.log('stage_2_called')
          // post_info_time
          display_choice();
          //wait_for_time(1000, display_choice);
          break;
        case 2:
          remove_choice();
          break;
        case 3:
          if (trial.last_stage < 3){var next_stage_number = 4} else{var next_stage_number = 3};
    //      console.log('end of stage 2')
          wait_for_time(par.post_choice_time,function(){trial_master(next_stage_number)});
      }
    }

    var stage_3_master = function(stage_3_part){
      switch(stage_3_part){
        case 1:
          // specify how long to wait
          display_outcome();
          break;
        case 2:
          wait_for_time(par.outcome_time, remove_outcome);
          break;
        case 3:
          trial_master(4);
          break;
      }
    }


    /// specific functions called by each stage trial_master
    // stage 1 funcs
    var display_trial_info = function(){

      //d3.select('.info_bkg').transition().style("opacity",1).duration(par.info_fadein_time);
      rafID1 = window.requestAnimationFrame(function() {
          rafID2 = window.requestAnimationFrame(function(timestamp) {

            // display trial info
            d3.select('.info_bkg').style("opacity",1)
            d3.selectAll('.info')
              .style("opacity",1)

            display_diode();

            time_onset = window.performance.now();
            data_temp[txt_offset + '_diode_onset'] = time_onset;
            data_temp[txt_offset + '_onset'] = time_onset;
            // set the diode_timing global
            diode_on = true
            frame_count_diode = Math.round(par.info_diode_time / estimated_frame_duration);
            //console.log('frame_count_diode ' + frame_count_diode)
            frame_count_stage = Math.round(par.info_time / estimated_frame_duration);
            frame_count = 0;
            next_stage_fun = function(){stage_1_master(2)};
            count_time = true;

            // wait for info time par.info_time
            //if (count_time == true){
            window.requestAnimationFrame(check_timeout);
            //}
        })
      })
    }

     // end display trial info

    var remove_trial_info = function(){
      // this runs for info fadeout time...
      this_next_fun = function(){
         stage_1_master(3);
      }

      d3.select('.info_bkg').transition().style("opacity",0)
        .duration(par.info_fadeout_time);

      // remove info
      d3.selectAll('.info').call(setupMT).transition()
        .style("opacity",0).duration(par.info_fadeout_time)
        .on('end', this_MT);

      data_temp[txt_offset + '_offset'] = time_onset;

    } // end remove trial info

    ///// stage 2 funcs
    var display_choice = function(){
      // want to add something showing that their choice was registered? - maybe change the background color?
      // display the choice and start the keyboard listeners
      count_time = true

      rafID1 = window.requestAnimationFrame(function() {
          rafID2 = window.requestAnimationFrame(function(timestamp) {
            d3.selectAll('.choice_stim')
              .style("opacity",1)

              //.transition()
              //.style("opacity",1)
              //.duration(par.choice_fadein_time)

              // do we want a prompt?
              var bkg_y = par.h/2 + par.background_height/2;
              //                   this should be the space between bottom and end of background
              var txt_y = bkg_y + par.stg_bkg_y/2;
              if (trial.show_prompt){
                if (trial.allow_reject){
                  place_text('Press 1 to PLAY the machine or 2 to REJECT.', "choice_stim", par.w/2, txt_y, par.text_font_size/2, 1, "White")
                } else{
                  place_text('Press 1 to PLAY the machine.', "choice_stim", par.w/2, txt_y, par.text_font_size/2, 1, "White")
                }
              }
              // time stuff, etc.
              display_diode();

              time_onset = window.performance.now();
              data_temp[txt_offset + '_diode_onset'] = time_onset;
              data_temp[txt_offset + '_onset'] = time_onset;
              // set the diode_timing global
              diode_on = true
              frame_count_diode = Math.round(par.choice_stim_diode_time / estimated_frame_duration);
              //console.log('frame_count_diode ' + frame_count_diode)
              frame_count_stage = Math.round(par.max_response_time / estimated_frame_duration); // max choice time
              frame_count = 0;
              next_stage_fun = function(){handle_slow_response()};
              //if (count_time == true){
              window.requestAnimationFrame(check_timeout);
              //}
              //window.requestAnimationFrame(check_timeout);

          })
        })




      var handle_response = function(info){
        // kill the wait...
  //      console.log('response heard')
        count_time = false
        window.cancelAnimationFrame(rafID1);
        window.cancelAnimationFrame(rafID2);

        // clear timeout counting response time
        jsPsych.pluginAPI.clearAllTimeouts();

        if (response.key == null) {
            response = info;
        }

        var choice_char = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key);
        response.choice = choice_char;
        if (choice_char == par.accept_key){
          response.accept = 1;
        } else if (choice_char == par.reject_key){
          response.accept = 0;
        }

        // change background color based on choice
        //if (choice_char == 'a'){d3.select('.choice_bkg').style('fill',accept_color);}
        //else if (choice_char == 'r'){d3.select('.choice_bkg').style('fill',reject_color);}

        // kill keyboard listeners
        if (typeof keyboardListener !== 'undefined') {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }
        // call stage_2_master

        // want to add something showing that their choice was registered? - maybe change the background color?
        //this_next_fun = function(){stage_2_master(2);}
        //wait_for_time(post_response_static_time, this_next_fun);
        stage_2_master(2);

      }

      var handle_slow_response = function(){
        count_time = false
        window.cancelAnimationFrame(rafID1);
        window.cancelAnimationFrame(rafID2);

        jsPsych.pluginAPI.clearAllTimeouts();
        place_reward('Please respond faster!', 'slow_reply', par.slow_reply_x, par.slow_reply_y, par.slow_reply_font_size, 1)
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

      if (trial.allow_reject){
        var valid_responses = [par.accept_key, par.reject_key];
      }else{
        var valid_responses = [par.accept_key];
      }

      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: handle_response,
          valid_responses: valid_responses,
          rt_method: 'performance', // check this
          persist: false,
          allow_held_key: false
        });
      //if (trial.limit_time){
      //  wait_for_time(par.max_response_time, handle_slow_response);
      //}
    } // end display choice...

    var remove_choice = function(){
      this_next_fun = function(){stage_2_master(3);}

      d3.selectAll('.choice_stim').call(setupMT).transition()
        .style("opacity",0).duration(par.choice_fadeout_time).on('end', this_MT)

      time_onset = window.performance.now();
      data_temp[txt_offset + '_offset'] = time_onset;
    }

    //// stage 3 funcs
    var display_outcome = function(){
      // this will display the outcome based on the response, which is a global variable
      //response.choice = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key);
      var choice_char = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key);

      var next_state = 'safe';
      if (choice_char == par.accept_key){
        var choice = 'accept'; // accept
        if (Math.random() < trial.p_o1)
        {
          var next_state = 'o1';
          outcome_reached = 1;
        } else{
          var next_state = 'o2';
          outcome_reached = 2;
        }
      } else{
        var next_state = 'safe';
        var choice = 'reject';
        outcome_reached = 3;
      }
      sel_text = '.ob,.'+next_state;
      points_received = par.outcome_vals[outcome_reached - 1];

      //this_next_fun = function(){
      //   stage_3_master(2);
      //}


      rafID1 = window.requestAnimationFrame(function() {
          rafID2 = window.requestAnimationFrame(function(timestamp) {

            // display the feedback with some delay
            d3.selectAll(sel_text)
              .style("opacity",1)

            // time stuff, etc.
            display_diode();

            time_onset = window.performance.now();
            data_temp[txt_offset + '_diode_onset'] = time_onset;
            data_temp[txt_offset + '_onset'] = time_onset;
            // set the diode_timing global
            diode_on = true
            count_time = true
            par.choice_stim_diode_time = 200;
            frame_count_diode = Math.round(par.outcome_diode_time / estimated_frame_duration);
            //console.log('frame_count_diode ' + frame_count_diode)

            frame_count_stage = Math.round(par.outcome_time / estimated_frame_duration); // max choice time
            frame_count = 0;
            next_stage_fun = function(){stage_3_master(2)};
            //if (count_time == true){
            window.requestAnimationFrame(check_timeout);

          })
        })

    } // end display outcome

    var remove_outcome = function(){

      count_time = false
      window.cancelAnimationFrame(rafID1);
      window.cancelAnimationFrame(rafID2);


      this_next_fun = function(){
        stage_3_master(3);
      } // end this_next_fun

      d3.selectAll(sel_text)
        .call(setupMT)
        .transition()
        .style("opacity",0)
        .duration(par.outcome_fadeout_time)
        .on('end', this_MT)

      time_onset = window.performance.now();
      data_temp[txt_offset + '_offset'] = time_onset;
    } // end remove outcome

  /// stage 4 - end trial, save data,
  var end_trial = function(){
     // console.log(data_temp)

    if (typeof keyboardListener !== 'undefined') {
      jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
    }
    d3.select('svg').remove()

    var trial_data = { // need to add timing to this.
      "stim_pos_y": stim_pos_y,
      "stim_pos_x": stim_pos_x,
      "first_stage": trial.first_stage,
      "last_stage": trial.last_stage,
      "show_money_val": trial.show_money_val,
      "p_o1": trial.p_o1,
      "safe_val": trial.safe_val,
      "o1_val": trial.o1_val,
      "o2_val": trial.o2_val,
      "o1_image": trial.o1_image,
      "o2_image": trial.o2_image,
      "safe_image": trial.safe_image,
      "choice_image": trial.choice_image,
      "key_press_num": response.key,
      "choice": response.choice,
      "rt": response.rt,
      "accept": response.accept,
      "outcome_reached": outcome_reached,
      "points_received": points_received
      // need to add timing parameters
    };

    // adding timing data
    function add_timing_data(vars) {
        for (var i = 0; i < vars.length; i++) {
            trial_data[vars[i] + '_onset'] = data_temp[vars[i] + '_onset'];
            trial_data[vars[i] + '_offset'] = data_temp[vars[i] + '_offset'];
        };
    };

    add_timing_data(['trial_info', 'trial_choice_stim', 'trial_feedback',
                      'trial_info_diode', 'trial_choice_stim_diode',
                    'trial_feedback_diode'])
    console.log(trial_data)

    jsPsych.finishTrial(trial_data);
  } // end end_trial


  // define the response that we'll append
  var response = {
      rt: null,
      key: null,
      choice:null,
      accept:null
    };

  var outcome_reached = null;
  var points_received = null;


    //// start the trial -  place everything
    place_everything();

    // wait pretrial time sec (ITI), call trial master
    // h
    // we use the allotted time to estimate the frame rate
    //estimate_frame_rate(function(frame_rate){
    //    estimated_frame_duration = frame_rate;
    //    setTimeout(next_stage, 100);
    //}, trial.timing_ITI - 100, true);
    // we use the allotted time to estimate the frame rate
    estimate_frame_rate(function(frame_rate){
        estimated_frame_duration = frame_rate;
        console.log('frame_rate: ' + estimated_frame_duration)
        setTimeout(function(){trial_master(trial.first_stage)}, 100);
    }, par.pre_trial_time - 100, true);

    //jsPsych.pluginAPI.setTimeout(function() {
    //   trial_master(trial.first_stage) //
     //}, par.pre_trial_time); // this is where the wait time goes / rn this is 1250 sec
     // check the frame rate here...
  };

  return plugin;
})();
