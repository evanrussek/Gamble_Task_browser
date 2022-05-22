var age_question = {
  type: 'survey-text',
  questions: [
    {prompt: "How many years old are you?"}
  ],
  data:{block_number: 'Q', Q_name: 'age'}
};

var sex_question = {
  type: 'evan-quiz',
  questions: [
    {prompt: "What is your sex?", options: ['male', 'female', 'other']}
  ],
  data:{block_number: 'Q', Q_name: 'sex'}
};

var bis_Qs = [ 'I plan tasks carefully.',
                'I do things without thinking.',
                'I make-up my mind quickly.',
                'I am happy-go-lucky.',
                'I do not pay attention.',
                'I have racing thoughts.',
                'I plan trips well ahead of time.',
                'I am self controlled.',
                'I concentrate easily.',
                'I save regularly. ',
                'I squirm at plays or lectures.',
                'I am a careful thinker.',
                'I plan for job security.',
                'I say things without thinking.',
                'I like to think about complex problems.',
                'I change jobs.',
                'I act on impulse.',
                'I get easily bored when solving thought problems.',
                'I act on the spur of the moment.',
                'I am a steady thinker.',
                'I change residences.',
                'I buy things on impulse.',
                'I can only think about one thing at a time.',
                'I change hobbies.',
                'I spend or charge more than I earn.',
                'I often have extraneous thoughts when thinking.',
                'I am more interested in the present than the future.',
                'I am restless at the theater or lectures.',
                'I like puzzles.',
                'I am future oriented.'];

var bis_preamble = 'People differ in the ways they act and think in different situations. This is a test to measure some of the ways in which you act and think. Do not spend too much time on any statement. Answer quickly and honestly.';
var bis_options = ['Rarely/Never', 'Occasionally', 'Often', 'Almost Always/Always', 'Prefer to not answer'];

var bis_questions = [];
for (var i = 0; i < bis_Qs.length; i ++){
    var this_q = {prompt: bis_Qs[i], options: bis_options, required: true};
    bis_questions.push(this_q);
}
var bis_questionairre = {
    type: "evan-quiz",
    preamble: ["<p align='center'> " + bis_preamble + "</p>"],
    questions: bis_questions,
    data: {Q_name: 'BIS', block_number: 'Q'},
    on_finish: function(){
    //    jsPsych.data.displayData()
    }
}
