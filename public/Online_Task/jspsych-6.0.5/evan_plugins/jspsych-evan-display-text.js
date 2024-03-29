/*
 * Example plugin template
 */

jsPsych.plugins["evan-display-text"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "evan-display-text",
    parameters: {
      line_1: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: ''
      },
      line_2: {
        type: jsPsych.plugins.parameterType.STRING,
        default: ''
    },
    line_3: {
      type: jsPsych.plugins.parameterType.STRING,
      default: ''
    },
    wait_for_press: {
      type: jsPsych.plugins.parameterType.BOOL,
      default: true
    },
  wait_time: {
    type: jsPsych.plugins.parameterType.FLOAT,
    default: 5000
  },
  wait_for_exp: {
    type: jsPsych.plugins.parameterType.BOOL,
    default: false
  }
}
}

  plugin.trial = function(display_element, trial) {

    // define the response that we'll append
    var response = {
        rt: null,
        key: null
      };


    var wait_for_time = function(n_msec, next_fun){
      // wait n_msec and then call next function
      jsPsych.pluginAPI.setTimeout(function() {
          next_fun() //
        }, n_msec);
    } // end wait for time


    // get params
    var par = define_parameters('trial');

    var svg = d3.select(".jspsych-content-wrapper")
                .append("svg")
                .attr("width", par.w)
                .attr("height", par.h)

    // place grey background on it
    d3.select("svg").append("rect")
          .attr("x", 0).attr("y", 0).attr("width", par.w)
          .attr("height", par.h).style("fill", par.svg_color).style("opacity",.7);

    place_text(trial.line_1, 'text', par.w/2 + par.diode_width, par.h/2 - par.text_font_size, par.text_font_size/2, 1, "White");
    place_text(trial.line_2, 'text', par.w/2+ par.diode_width, par.h/2, par.text_font_size/2, 1, "White");
    place_text(trial.line_3, 'text', par.w/2+ par.diode_width, par.h/2 + par.text_font_size, par.text_font_size/2, 1, "White");

    ///////////////////////////////////////

    // put up the svg

    if (trial.wait_for_exp){
      var valid_responses = ['c'];
    }else{
      var valid_responses = ['c'];
    }

    if (trial.wait_for_press){
      // set up max response time?
      var txt_y =  par.h  - par.stg_bkg_y;
      if (trial.wait_for_exp){
        var prompt = 'Waiting for experimenter to continue.'
      }else{
        var prompt = 'Press c to continue.'
      }
      place_text(prompt, "prompt", par.w/2 + par.diode_width, txt_y, par.text_font_size/2, 1, "White")

      var handle_response = function(info){
        jsPsych.pluginAPI.clearAllTimeouts();

        if (response.key == null) {
            response = info;
        }

        // data saving
        var trial_data = {
          // add time to this...
          line_1: trial.line_1,
          line_2: trial.line_2,
          line_3: trial.line_3,
          rt: response.rt
        };


        // kill keyboard listeners
        if (typeof keyboardListener !== 'undefined') {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }

        d3.select('svg').remove(); jsPsych.finishTrial(trial_data);
      }

      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: handle_response,
          valid_responses: valid_responses,
          rt_method: 'performance', // check this
          persist: false,
          allow_held_key: false
        });
    }else{
      // data saving
      var trial_data = {
        // add time to this...
        line_1: trial.line_1,
        line_2: trial.line_2,
        line_3: trial.line_3,
      };
      wait_for_time(trial.wait_time,function(){ d3.select('svg').remove(); jsPsych.finishTrial(trial_data);});
    }


  };

  return plugin;
})();
