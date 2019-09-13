var safe_name = outcome_names[2];
// for two-stim choice add parameter for whether to limit choice time.
var instruction_pages_1a = ['Stimuli/Evan_Stimuli/Slide1.JPG',
                            'Stimuli/Evan_Stimuli/Slide2.JPG',
                            'Stimuli/Evan_Stimuli/Slide3.JPG',
														'Stimuli/Evan_Stimuli/Slide4.JPG'];

var instruction_pages_1b = ['Stimuli/Evan_Stimuli/Slide6.JPG',
														'Stimuli/Evan_Stimuli/Slide7.JPG'
													];



var outcome_state_idx = both_idx_vec[cond_idx][1];

var pos_outcome_assigments = [[0, 1, 2],
                                [2, 0, 1],
                                [1, 2, 0]];

var pages1a = [];
for (var i = 0; i < instruction_pages_1a.length; i++){
    pages1a.push('<img src= "'+ instruction_pages_1a[i] +  '" alt = "" >')
}
var pages1b = [];
for (var i = 0; i < instruction_pages_1b.length; i++){
    pages1b.push('<img src= "'+ instruction_pages_1b[i] +  '" alt = "" >')
}


var instruction_pages1a = {
    type: 'instructions',
    pages: pages1a,
    show_clickable_nav: true
}

var instruction_pages1b = {
    type: 'instructions',
    pages: pages1b,
    show_clickable_nav: true
}


var instruc1a_trials = jsPsych.randomization.repeat([build_practice_trial_stg1(1,.2,true,false), build_practice_trial_stg1(2,.4,true,false),
    build_practice_trial_stg1(3,.6,true,false), build_practice_trial_stg1(4,.8,true,false)],1);

instruc1a_trials.splice(2,0,rand_gen_info_quiz());


// define the instruction quiz...
var options1a =  ["It is random",
            "Answers to attention check questions only.",
            "Answers to questions about which slotmachine is more likely to produce a given banknote.",
            "Answers to both types of questions.",
            "I do not know"
        ];
var correct1a = 3;

var options2a = ["1", "2", "3","4","5","6","7"];
var correct2a = 1;

var options3a = ["1", "2", "3","4","5","6","7"];
var correct3a = 3;

var options4a = ["Each slot machine can lead to any of the banknotes. The chances that a given slot machine provides a given banknote are different for each slot machine.",
                "Each slot machine can lead to any of the banknotes. The chances that a given slot machine provides a given banknote are the same for each slot machine.",
                "Some slot machines always provide the same banknote.",
                "I do not know"];
var correct4a = 0;

var options5a = ["Yes", "No", "I do not know."];
var correct5a = 1;

var corr_string = '{"Q0":' + '"'+options1a[correct1a]+'",' + '"Q1":' + '"'+options2a[correct2a]+'",'
    + '"Q2":' + '"'+options3a[correct3a]+'",' + '"Q3":' + '"'+options4a[correct4a]+'",' +
    '"Q4":' + '"'+options5a[correct5a]+'"'  + '}';

var questions1_arr = ["What determines the bonus for this task?",
		"How many banknotes are in this task?",
		"How many slot machines are in this task?",
		"How do different slot machines produce different banknotes?",
		"Do the chances that a given slot machine will produce a certain banknote change over the course of the task?"];


                        /* define instruction check block */
var instructioncorrect = false;
var instruction_check = {
    type: "evan-quiz",
    preamble: ["<p align='center'><b>Please answer every question. Answering 'I do not know' or answering incorrectly will require you return to the beginning of the instructions. </b></p>"],
    questions: [
        {prompt: "<b>Question 1</b>: What determines the bonus for this task?",
                options: options1a, required: true},
        {prompt: "<b>Question 2</b>: How many banknotes are in this task?",
                    options: options2a, required: true},
        {prompt: "<b>Question 3</b>: How many slot machines are in this task?",
                        options: options3a, required: true},
        {prompt: "<b>Question 4</b>: How do different slot machines produce different banknotes?",
                        options: options4a, required: true},
        {prompt: "<b>Question 5</b>: Do the chances that a given slot machine will produce a certain banknote change over the course of the task?",
                    options: options5a, required: true},
                ],
        on_finish: function(data) {
            console.log(data.responses)
            console.log(corr_string)
            if( data.responses == corr_string){
                action = false;
                instructioncorrect = true;
								data.incor_questions;
            }else{
							var post_choices = data.choice_idxs
							// this is global
							incor_questions = ['<br> </br'];
							var correct_choices = [correct1a, correct2a, correct3a, correct4a, correct5a];
							for (var i = 0; i < correct_choices.length; i++){
								if (correct_choices[i] != post_choices[i]){
									incor_questions.push('<br>' + questions1_arr[i] + '</br>');
								}
							}
							data.incor_questions = incor_questions;
							//alert('The following questions were answered incorrectly: ' + incor_choices)
						}
        }
    }


/* define a page for the incorrect response */
var showsplash = true;
var splash_screen = {
	type: 'html-button-response',
    timing_post_trial: 0,
	//    button_html: '<button class="jspsych-btn" style="display:none">%choice%</button>',
    choices: ['Click here to read the instructions again'],
    is_html: true,
    stimulus: function(){
			var incor_q = jsPsych.data.get().last(1).select('incor_questions').values
			var next_stimulus = 'The following questions were answered incorrectly: ' + incor_q;
			return next_stimulus
		}
}

/* ...but push it to a conditional node that only shows it if the response was wrong */
var conditional_splash1 = {
  timeline: [splash_screen],
  conditional_function: function(data) {
	return !instructioncorrect // skip if correct
  }
}



var intro_w_trials = [];
intro_w_trials.push(instruction_pages1a);
intro_w_trials = intro_w_trials.concat(instruc1a_trials);
intro_w_trials.push(instruction_pages1b);
intro_w_trials.push(instruction_check);
intro_w_trials.push(conditional_splash1);

var introloop = [];
introloop.push(instruction_pages1a);
introloop.push(instruction_pages1b);
introloop.push(instruction_check);
introloop.push(conditional_splash1);
/* finally, add the entirety of this introductory section to a loop node ... */
var loop_node = {
  timeline: introloop,
  conditional_function: function(data) {
  	return !instructioncorrect // skip if correct
},
  loop_function: function(data) {
	var action = true;
	return !instructioncorrect // stop looping if correct
	}
}
intro_w_trials.push(loop_node);
var instruc_timeline1 = intro_w_trials;

var finish_instruc1_screen = {
	type: 'html-button-response',
    timing_post_trial: 0,
	//    button_html: '<button class="jspsych-btn" style="display:none">%choice%</button>',
    choices: ['Begin the first task!'],
    is_html: true,
    stimulus: 'You passed the quiz! Great work. The first task will take about 30 minutes. Press the button to begin.'
}
instruc_timeline1.push(finish_instruc1_screen);
// add a prompt to the feedback screen?

instruc2_timeline_w_trials = [];
var instruction_pages_2a = ['Stimuli/Evan_Stimuli/Slide8.JPG',
                            'Stimuli/Evan_Stimuli/Slide9.JPG',
                            'Stimuli/Evan_Stimuli/Slide10.JPG',
														'Stimuli/Evan_Stimuli/Slide11.JPG']
var instruction_pages_2b = ['Stimuli/Evan_Stimuli/Slide13.JPG'];
var instruction_pages_2c = ["Stimuli/Evan_Stimuli/Slide15.JPG"];

var pages2a = [];
for (var i = 0; i < instruction_pages_2a.length; i++){
    pages2a.push('<img src= "'+ instruction_pages_2a[i] +  '" alt = "" >')
}
var pages2b = [];
for (var i = 0; i < instruction_pages_2b.length; i++){
    pages2b.push('<img src= "'+ instruction_pages_2b[i] +  '" alt = "" >')
}
var pages2c = [];
for (var i = 0; i < instruction_pages_2c.length; i++){
    pages2c.push('<img src= "'+ instruction_pages_2c[i] +  '" alt = "" >')
}

var instruction_pages2a = {
    type: 'instructions',
    pages: pages2a,
    show_clickable_nav: true
}

var instruction_pages2b = {
    type: 'instructions',
    pages: pages2b,
    show_clickable_nav: true
}

var instruction_pages2c = {
    type: 'instructions',
    pages: pages2c,
    show_clickable_nav: true
}

// want some practice trials where the person just reports the point value of one of the bank notes.

instruc2_timeline_w_trials.push(instruction_pages2a);
var n_info_practice = 8;
for (i = 0; i < n_info_practice; i ++){
	instruc2_timeline_w_trials = instruc2_timeline_w_trials.concat(rand_gen_rew_quiz_main());
}

instruc2_timeline_w_trials.push(instruction_pages2b);
var n_trial_practice = 6;
for (i = 0; i < n_trial_practice; i ++){
	instruc2_timeline_w_trials.push(rand_gen_trial());
}

instruc2_timeline_w_trials.push(instruction_pages2c);


// define the instruction quiz...
var options1b =  ["1", "2", "3", "4", "5", "6", "7", "I do not know"];
var correct1b = 2;

var options2b =  ["1", "2", "3", "4", "5", "6", "7", "I do not know"];
var correct2b = 3;

var options3b = ["Accepting a given slot machine can lead to any of the banknotes. The chances that a given slot machine provides a given banknote are the same for each slot machine.",
                "Accepting a given slot machine can lead to either the " + outcome_names[0]  + " or the " + outcome_names[1] + "  banknotes. The chances that a given slot machine provides a given banknote are different for each slot machine.",
				"Accepting a given slot machine can lead to either the " + outcome_names[1]  + " or the " + outcome_names[2] + "  banknotes. The chances that a given slot machine provides a given banknote are different for each slot machine.",
				"Accepting a given slot machine can lead to either the " + outcome_names[0]  + " or the " + outcome_names[2] + "  banknotes. The chances that a given slot machine provides a given banknote are different for each slot machine.",
                "Accepting some slot machines will always provide the same banknote.",
                "I do not know"];
var correct3b = 1;

var options4b = ["Rejecting a slot machine always leads to the " + outcome_names[0]  + " banknote.",
                "Rejecting a slot machine always leads to the " + outcome_names[1]  + " banknote.",
				"Rejecting a slot machine always leads to the " + outcome_names[2]  + " banknote.",
				"Rejecting a slot machine can lead to any of the banknotes.",
                "I do not know"];
var correct4b = 2;

var options5b = ["Yes", "No", "I do not know."];
var correct5b = 1;

var options6b = ["Yes", "No", "I do not know."];
var correct6b = 1;

var options7b = ["The total number of points collected as well as answers to attention check questions.",
				"It is random",
				"Average number of points collected on four randomly selected games as well as answers to attention check questions.",
				"Just total number of points collected.",
				"Just answers to attention check questions.",
				"I do not know."];
var correct7b = 2;

var options8b = ["If collected on a selected game, banknotes with positive point values will increase the bonus. \
                    Banknotes with negative point values will not affect the bonus.",
                    "If collected on a selected game, banknotes with positive point values will increase the bonus. \
                    If collected on a selected game, banknotes with negative point values will decrease the bonus.",
                     "Banknotes with positive point values will not affect the bonus.\
                     If collected on a selected game, banknotes with negative point values will decrease the bonus.",
                     "I do not know"];

var correct8b = 1;


var corr2_string = '{"Q0":' + '"'+options1b[correct1b]+'",' + '"Q1":' + '"'+options2b[correct2b]+'",'
    + '"Q2":' + '"'+options3b[correct3b]+'",' + '"Q3":' + '"'+options4b[correct4b]+'",' +
    '"Q4":' + '"'+options5b[correct5b]+'",' + '"Q5":' + '"'+options6b[correct6b]+'",'
     + '"Q6":' + '"'+options7b[correct7b]+'",' + '"Q7":' + '"'+options8b[correct8b]+'"'+ '}';

var questions2_arr = ["How many banknotes are in this task?",
										"How many slot machines are in this task?",
									 	"What happens if you accept a slot machine?",
									 "What happens if you reject a slot machine?",
									 "Will the chances of getting a certain banknote after accepting a given slot machine change over the course of the task?",
									 "Are the chances of getting a certain banknote after accepting a given slot machine different in this task than they were in the last task?",
									 "What determines my bonus in this task?",
									 "How does collecting positive point and negative point banknotes affect your bonus?"
								 ];

var instruction2correct = false;
var instruction2_check = {
    type: "evan-quiz",
    preamble: ["<p align='center'><b>Please answer every question. Answering 'I do not know' or answering incorrectly will require you return to the beginning of the instructions. </b></p>"],
    questions: [
        {prompt: "<b>Question 1</b>: How many banknotes are in this task?",
                options: options1b, required: true},
        {prompt: "<b>Question 2</b>: How many slot machines are in this task?",
                    options: options2b, required: true},
        {prompt: "<b>Question 3</b>: What happens if you accept a slot machine?",
                    options: options3b, required: true},
        {prompt: "<b>Question 4</b>: What happens if you reject a slot machine?",
                        options: options4b, required: true},
        {prompt: "<b>Question 5</b>: Will the chances of getting a certain banknote after accepting a given slot machine change over the course of the task?",
                        options: options5b, required: true},
        {prompt: "<b>Question 6</b>: Are the chances of getting a certain banknote after accepting a given slot machine different in this task than they were in the last task?",
                    options: options6b, required: true},
        {prompt: "<b>Question 7</b>: What determines my bonus in this task?",
                                options: options7b, required: true},
				{prompt: "<b>Question 8</b>: How does collecting positive point and negative point banknotes affect your bonus?",
											options: options8b, required: true}
				],
				on_finish: function(data) {
						console.log(data.responses)
						console.log(corr2_string)
            if( data.responses == corr2_string){
                action = false;
                instruction2correct = true;
            }else{
							var post_choices = data.choice_idxs
							// this is global
							incor_questions = ['<br> </br'];
							var correct_choices = [correct1b, correct2b, correct3b, correct4b, correct5b, correct6b, correct7b, correct8b];
							for (var i = 0; i < correct_choices.length; i++){
								if (correct_choices[i] != post_choices[i]){
									incor_questions.push('<br>' + questions2_arr[i] + '</br>');
								}
							}
							data.incor_questions = incor_questions;
							//alert('The following questions were answered incorrectly: ' + incor_choices)
						}
					}
    }

var splash_screen2 = {
			type: 'html-button-response',
		    timing_post_trial: 0,
			//    button_html: '<button class="jspsych-btn" style="display:none">%choice%</button>',
		    choices: ['Click here to read the instructions again'],
		    is_html: true,
		    stimulus: function(){
					var incor_q = jsPsych.data.get().last(1).select('incor_questions').values
					var next_stimulus = 'The following questions were answered incorrectly: ' + incor_q;
					return next_stimulus
				}
		}

	/* ...but push it to a conditional node that only shows it if the response was wrong */
	var conditional_splash2 = {
	  timeline: [splash_screen2],
	  conditional_function: function(data) {
		return !instruction2correct // skip if correct
	  }
	}


	var finish_instruc2_screen = {
		type: 'html-button-response',
	    timing_post_trial: 0,
		//    button_html: '<button class="jspsych-btn" style="display:none">%choice%</button>',
	    choices: ['Begin the second task!'],
	    is_html: true,
	    stimulus: 'You passed the quiz! Great work. This task will take about 40 minutes. Press the button to begin.'
	}



//instruc2_timeline_w_trials = [];
instruc2_timeline_w_trials.push(instruction2_check);
instruc2_timeline_w_trials.push(conditional_splash2);

var intro2loop = [];
intro2loop.push(instruction_pages2a);
intro2loop.push(instruction_pages2b);
intro2loop.push(instruction_pages2c);
intro2loop.push(instruction2_check);
intro2loop.push(conditional_splash2);


/* finally, add the entirety of this introductory section to a loop node ... */
var loop2_node = {
  timeline: intro2loop,
  conditional_function: function(data) {
  	return !instruction2correct // skip if correct
},
  loop_function: function(data) {
	var action = true;
	return !instruction2correct // stop looping if correct
	}
}
instruc2_timeline_w_trials.push(loop2_node);
instruc2_timeline_w_trials.push(finish_instruc2_screen);

var instruc_timeline2 = instruc2_timeline_w_trials;

//-- to compute the bonus...
const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length

var point_vals = jsPsych.data.get().filter({phase: 'TRAIN CHOICE'}).select('points_received').values
var practice_bonus_trial_points = jsPsych.randomization.sampleWithoutReplacement(point_vals, 4)
practice_bonus_trial_points =  arrAvg(practice_bonus_trial_points);
// how correct were they on check trials?
