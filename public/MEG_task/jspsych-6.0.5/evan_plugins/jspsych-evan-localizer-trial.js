/*
 * Example plugin template
 */


// plugin to show either a photo, or a piece of text and ask which reward it was just paired with...
jsPsych.plugins["evan-localizer-trial"] = (function() {

  // diode this...

  var plugin = {};

  plugin.info = {
    name: "evan-localizer-trial",
    parameters: {
      image:{
        type: jsPsych.plugins.parameterType.IMAGE, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      image_name: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      other_name: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined
      },
      slot_machine: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    // Math.seedrandom(1001);


    var myInds = [0,1];
    var shuffledInds = jsPsych.randomization.repeat(myInds,1);
    var image_texts = [trial.image_name, trial.other_name];

    // special variables for requestAnimateFrame
    var estimated_frame_duration = null;
    var frame_count;
    var frame_count_stage;
    var frame_count_diode;
    var data_temp = {};

// 5 rounds of each - do 20 presentations of each... image in a block...

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

      wait_for_time(100, end_trial);
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

    d3.select('svg')
            .append('line')
            .attr('x1', par.diode_width)
            .attr('x2', par.diode_width)
            .attr('y1', 0)
            .attr('y2', par.h)
            .style('stroke-width', 1)
            .style('stroke', 'black')
/*    d3.select('svg').append("text")
            .attr("class", "my_fix")
            .attr("x",  par.fixation_x)
            .attr("y", par.fixation_y)
            .attr("font-family","monospace")
            .attr("font-weight","bold")
            .attr("dominant-baseline", "central")
            .attr("font-size",par.fixation_font_size/5)
            .attr("text-anchor","middle")
            .attr("fill", par.fixation_color)
            .style("opacity",1)
            .text('+') */

    d3.select('svg')
            .append('line')
            .attr('x1', par.w/3 + par.diode_width)
            .attr('x2', par.w/3 + par.diode_width)
            .attr('y1', 0)
            .attr('y2', par.h)
            .style('stroke-width', 1)
            .style('stroke', 'white')

    d3.select('svg')
            .append('line')
            .attr('x1', 2*par.w/3 + par.diode_width)
            .attr('x2', 2*par.w/3 + par.diode_width)
            .attr('y1', 0)
            .attr('y2', par.h)
            .style('stroke-width', 1)
            .style('stroke', 'white')


            //d3.select('.info_bkg').transition().style("opacity",1).duration(par.info_fadein_time);

    place_diode(par.background_height, par.background_width, par.h);

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



    var loc_stage1 = function(){
      rafID1 = window.requestAnimationFrame(function() {
          rafID2 = window.requestAnimationFrame(function(timestamp) {
            txt_offset = 'loc_image'

            count_time = true
            if (trial.slot_machine){
              place_img_bkg("stg1",par.choice_stim_bkg_x,par.choice_stim_bkg_y,
                            par.choice_stim_bkg_width,par.choice_stim_bkg_height,
                              par.choice_stim_bkg_color,1);
              place_img(trial.image, "stg1", par.choice_stim_x,
                          par.choice_stim_y, par.choice_stim_width,
                          par.choice_stim_height,1);
            }else{
              place_img_bkg("stg1",par.f_outcome_img_bkg_x,par.f_outcome_img_bkg_y,par.f_outcome_img_bkg_width,par.f_outcome_img_bkg_height,par.img_bkg_color,1);
              place_img(trial.image, "stg1", par.f_outcome_img_x, par.f_outcome_img_y,
                            par.f_outcome_img_width, par.f_outcome_img_height,1);
            }
            // time stuff, etc.
            display_diode();

            time_onset = window.performance.now();
            data_temp[txt_offset + '_diode_onset'] = time_onset;
            data_temp[txt_offset + '_onset'] = time_onset;
            // set the diode_timing global
            diode_on = true
            frame_count_diode = Math.round(par.loc_image_diode_time / estimated_frame_duration);
            //console.log('frame_count_diode ' + frame_count_diode)
            frame_count_stage = Math.round(par.loc_image_time / estimated_frame_duration); // max choice time
            frame_count = 0;
            next_stage_fun = function(){remove_stage1()};
            //if (count_time == true){
            window.requestAnimationFrame(check_timeout);
      })
    })
  }

  var remove_stage1 = function(){
    d3.selectAll(".stg1").transition().style("opacity",0).duration(par.loc_image_fade_time)
    data_temp[txt_offset + '_offset'] = window.performance.now();
    // wait a second
    wait_for_time(par.loc_image_fade_time,loc_stage2)
  }


  var handle_response = function(info){
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
      wait_for_time(par.loc_pause_resp_time,function(){
        place_text('CORRECT!', 'Prompt', par.w/2 + par.diode_width, 29*par.h/40, par.text_font_size, 1, "Red")
        var feedback_time = window.performance.now();})
      wait_for_time(par.loc_pause_resp_time + par.loc_feedback_time,end_trial)
    } else{
      correct = 0;
      wait_for_time(par.loc_pause_resp_time,function(){
        place_text('WRONG!', 'Prompt', par.w/2 + par.diode_width, 29*par.h/40, par.text_font_size, 1, "Red")
        var feedback_time = window.performance.now();
      })
      wait_for_time(par.quiz_pause_resp_time + par.quiz_feedback_time,end_trial)
    }
  }

  var loc_stage2 = function(){
    var box_width = par.w/7;
    var box_height = par.w/7;
    place_img_bkg('bk1', 2*par.w/5 - box_width/2 + par.diode_width ,
     par.h/2 - box_height/2 - par.text_font_size/3, box_width, box_height, par.good_color_vec[1], 0);
    place_text(image_texts[shuffledInds[0]], 'stg2', 2*par.w/5 + par.diode_width, par.h/2 , par.text_font_size, 1, "White");
    place_text('1', 'stg2', 2*par.w/5 + par.diode_width, par.h/2 + .25*box_height , par.text_font_size/3, 1, "White");

    place_img_bkg('bk2', 3*par.w/5 - box_width/2 + par.diode_width , par.h/2 - box_height/2 - par.text_font_size/3,
     box_width, box_height, par.good_color_vec[1], 0);
    place_text(image_texts[shuffledInds[1]], 'stg2', 3*par.w/5 + par.diode_width, par.h/2, par.text_font_size , 1, "White");
    place_text('2', 'stg2', 3*par.w/5 + par.diode_width, par.h/2 + .25*box_height , par.text_font_size/3, 1, "White");

    // set up the keypress
    var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: handle_response,
        valid_responses: ['1', '2'],
        rt_method: 'performance', // check this
        persist: false,
        allow_held_key: false
      });
    // want to call the resopnse handler and also the
    wait_for_time(par.loc_max_response_time, handle_slow_response);

    // slow response stuff
  }

  var response = {
      rt: null,
      key: null
    };
  var  correct = null;
  //loc_stage1();
  //remove_stage1();
//  loc_stage2();
  var iti_time = (Math.random() * (700 - 500) ) + 500;

  estimate_frame_rate(function(frame_rate){
      estimated_frame_duration = frame_rate;
      console.log('frame_rate: ' + estimated_frame_duration)
      setTimeout(function(){loc_stage1();}, 100);
  }, iti_time - 100, true);



  /// stage 4 - end trial, save data,
  var end_trial = function(){

    if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
    }
            d3.select('svg').remove()

            var trial_data = {
              "image": trial.image,
              "image_name": trial.image_name,
              "other_name": trial.other_name,
              "slot_machine_type": trial.slot_machine,
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
            add_timing_data(['loc_image', 'loc_image_diode'])
            console.log(trial_data)


            jsPsych.finishTrial(trial_data);
        } // end end_trial




    // end trial
    //jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
