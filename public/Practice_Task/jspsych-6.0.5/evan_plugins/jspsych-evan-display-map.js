/*
 * Example plugin template
 */

jsPsych.plugins["evan-display-map"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "evan-display-map",
    parameters: {
      choice_images: {
        type: jsPsych.plugins.parameterType.IMAGE, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: ''
      },
      outcome_images: {
        type: jsPsych.plugins.parameterType.IMAGE,
        default: ''
      },
      full_map: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: true
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    console.log('MAP TRIAL')
    console.log(choice_images)
    console.log(outcome_images)

    // define the response that we'll append
    var response = {
        rt: null,
        key: null
      };

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
    ///////////////////////////////////////

    // put up the svg

    var display_map = function(){

      var c_x_ctrs = [par.w/4, 3*par.w/4, par.w/4, 3*par.w/4];
      var c_y_ctrs = [1.25*par.h/8, 1.25*par.h/8, 4.5*par.h/8, 4.5*par.h/8];
      var bkg_width = par.h/8;
      var bkg_height = par.h/8;

      var o_bkg_width = par.h/6;
      var o_bkg_height = par.h/10;

      var p_vals = ['20%', '40%', '60%', '80%'];

      // display images
      for (var i = 0; i < 4; i++){

        // draw c -> o1 line
        d3.select('svg').append("line")          // attach a line
          .style("stroke", "white")  // colour the line
          .attr("x1", c_x_ctrs[i] )     // x position of the first end of the line
          .attr("y1", c_y_ctrs[i] )      // y position of the first end of the line
          .attr("x2", c_x_ctrs[i] - par.w/8 )     // x position of the second end of the line
          .attr("y2", c_y_ctrs[i] + par.h/4 )
          .style('stroke-width', 2);

          // draw c -> o2 line
          d3.select('svg').append("line")          // attach a line
            .style("stroke", "white")  // colour the line
            .attr("x1", c_x_ctrs[i] )     // x position of the first end of the line
            .attr("y1", c_y_ctrs[i] )      // y position of the first end of the line
            .attr("x2", c_x_ctrs[i] + par.w/8 )     // x position of the second end of the line
            .attr("y2", c_y_ctrs[i] + par.h/4 )
            .style('stroke-width', 2);

        // place text to o1
        place_text(p_vals[i], 'reward_val',c_x_ctrs[i] - par.w/16 - par.text_font_size/3, c_y_ctrs[i] + par.h/8, par.text_font_size/3, 1, "white");
        place_text(p_vals[3 - i], 'reward_val',c_x_ctrs[i] + par.w/16 + par.text_font_size/3, c_y_ctrs[i] + par.h/8, par.text_font_size/3, 1, "white");

        // choice background
        place_img_bkg("info",c_x_ctrs[i] - bkg_width/2, c_y_ctrs[i] - bkg_height/2, bkg_width,bkg_height,par.img_bkg_color,1);

        // outcome 1 background
        place_img_bkg("info",c_x_ctrs[i] - par.w/8 - o_bkg_width/2,
         c_y_ctrs[i] + par.h/4 - o_bkg_width/2, o_bkg_width,o_bkg_height,par.img_bkg_color,1);

         // outcome 2 background
         place_img_bkg("info",c_x_ctrs[i] + par.w/8 - o_bkg_width/2,
          c_y_ctrs[i] + par.h/4 - o_bkg_width/2, o_bkg_width,o_bkg_height,par.img_bkg_color,1);

        var choice_img_width = bkg_width*.6;
        var o_img_width = o_bkg_height*.6;

        // choice image
        place_img(trial.choice_images[i],"image",
          c_x_ctrs[i] - choice_img_width/2, c_y_ctrs[i] - choice_img_width/2,
          choice_img_width,choice_img_width,par.img_bkg_color,1);

        // o2 image...
          place_img(trial.outcome_images[0],"image",
          c_x_ctrs[i] - par.w/8 - o_img_width,
           c_y_ctrs[i] + par.h/4 - o_img_width,
            o_img_width,o_img_width,par.img_bkg_color,1);

        // o2 image...
        place_img(trial.outcome_images[1],"image",
        c_x_ctrs[i] + par.w/8 - o_img_width,
         c_y_ctrs[i] + par.h/4 - o_img_width,
          o_img_width,o_img_width,par.img_bkg_color,1);

        // set up max response time?
        var txt_y =  par.h  - 2*par.stg_bkg_y/3;
        place_text('Please study this map.', "prompt", par.w/2 + par.diode_width, par.stg_bkg_y, par.text_font_size/3, 1, "White")
        place_text('Press 4 to continue.', "prompt", par.w/2 + par.diode_width, txt_y, par.text_font_size/3, 1, "White")

      }
    }

    if (trial.full_map){
      display_map();
    }


    var valid_responses = ['4'];


      var handle_response = function(info){
        console.log('response made')
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


  };

  return plugin;
})();
