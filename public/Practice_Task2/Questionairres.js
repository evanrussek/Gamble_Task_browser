var masq_Qs = ['Felt cheerful',
                'Felt very happy',
                'Felt optimistic',
                'Felt really bored',
                'Felt like I was having a lot of fun',
                'Felt withdrawn from other people',
                'Seemed to move quickly and easily',
                'Looked forward to things with enjoyment',
                'Felt like nothing was very enjoyable',
                'Felt like I had accomplished a lot',
                'Felt like a had a lot of interesting things to do',
                'Felt like it took extra effort to get started',
                'Felt like I had a lot to look forward to',
                "Felt like there wasn't anything interesting or fun to do",
                'Was proud of myself',
                'Felt unattractive',
                'Felt really up or lively',
                'Felt really slowed down',
                'Felt like I had a lot of energy',
                'Felt hopeful about the future',
                'Felt really good about myself',
                'Thought about death or suicide'];

var masq_preamble = "To what extent have you experienced the following over the past week, including today?";

var masq_options = ['Not at All', 'Slightly', 'Moderately', 'Very', 'Extremely', 'Prefer to not answer'];

var masq_questions = [];
for (var i = 0; i < masq_Qs.length; i ++){
    var this_q = {prompt: masq_Qs[i], options: masq_options, required: true};
    masq_questions.push(this_q);
}
var masq_questionairre = {
    type: "evan-quiz",
    preamble: ["<p align='center'> " + masq_preamble + "</p>"],
    questions: masq_questions,
    data: {Q_name: 'MASQ'}
}

// next...
var psqw_Qs = ['If I do not have enough time to do everything, I do not worry about it.',
            'My worries overwhelm me.',
            'I do not tend to worry about things.',
            'Many situations make me worry.',
            'I know I should not worry about things, but I just cannot help it.',
            'When I am under pressure I worry a lot.',
            'I am always worrying about something.',
            'I find it easy to dismiss worrisome thoughts.',
            'As soon as I finish one task, I start to worry about everything else I have to do.',
            'I never worry about anything.',
            'When there is nothing more I can do about a concern, I do not worry about it any more.',
            'I have been a worrier all my life.',
            'I notice that I have been worrying about things.',
            'Once I start worrying, I cannot stop.',
            'I worry all the time.',
            'I worry about projects until they are all done.'];

var psqw_preamble = "Rate each of the following statements on a scale of 1 (“not at all typical of me”) to 5 (“very typical of me”). Please do not leave any items blank.";

var psqw_options = ['1' , '2', '3', '4', '5', 'Prefer to not answer'];

var psqw_questions = [];
for (var i = 0; i < psqw_Qs.length; i ++){
    var this_q = {prompt: psqw_Qs[i], options: psqw_options, required: true};
    psqw_questions.push(this_q);
}
var psqw_questionairre = {
    type: "evan-quiz",
    preamble: ["<p align='center'> " + psqw_preamble + "</p>"],
    questions: psqw_questions,
    data: {Q_name: 'PSQW'},
    on_finish: function(){
        jsPsych.data.displayData()
    }
}


var stai_Qs = ['I feel pleasant',
'I feel nervous and restless',
'I feel satisfied with myself',
'I wish I could be as happy as others seem to be',
'I feel like a failure',
'I feel rested',
'I am calm, cool, and collected.',
'I feel that difficulties are piling up so that I cannot overcome them',
'I worry too much over something that really doesn’t matter',
'I am happy',
'I have disturbing thoughts',
'I lack self-confidence',
'I feel secure',
'I make decisions easily',
'I feel inadequate',
'I am content',
'Some unimportant thought runs through my mind and bothers me',
'I take disappointments so keenly that I can’t put them out of my mind',
'I am a steady person',
'I get in a state of tension or turmoil as I think over my recent concerns and interests'];

var stai_preamble = 'A number of statements which people have used to describe themselves are given below. Read each statement and then blacken in the appropriate circle to the right of the statement to indicate you generally feel.';

var stai_options = ['Almost Never', 'Sometimes', 'Often', 'Almost Always'];

var stai_questions = [];
for (var i = 0; i < psqw_Qs.length; i ++){
    var this_q = {prompt: stai_Qs[i], options: stai_options, required: true};
    stai_questions.push(this_q);
}
var stai_questionairre = {
    type: "evan-quiz",
    preamble: ["<p align='center'> " + stai_preamble + "</p>"],
    questions: stai_questions,
    data: {Q_name: 'PSQW'},
    on_finish: function(){
        jsPsych.data.displayData()
    }
}
