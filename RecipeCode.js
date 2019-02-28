'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = undefined;

/***********
Data: Customize the data below as you please.
***********/

const SKILL_NAME = "Lindas Five Minute Recipes";
const STOP_MESSAGE = "See you next time.";
const CANCEL_MESSAGE = "Okay. Do you want to hear a different recipe instead?";

const HELP_START = "I know how to make tasty meals in less than 5 minutes.";
const HELP_START_REPROMPT = "Just tell me what type of meal you'd like.";
const HELP_RECIPE = "Choose whatever recipe you want.";
const HELP_RECIPE_REPROMPT = "Just ask me for a recipe.";
const HELP_INSTRUCTIONS = "You can ask me to repeat the instructions or say 'next' to hear the next line of instructions.";
const HELP_INSTRUCTIONS_REPROMPT = "Hello.";
const HELP_CANCEL = "You can hear a new recipe or just not eat.";
const HELP_CANCEL_REPROMPT = "Not eating so far caused 100% of test subjects to die.";

const CHOOSE_TYPE_MESSAGE = "Welcome to Linda's five minute recipes! I'm Linda and I will be walking you through simple, but delicious recipes. I know some fantastic breakfast, lunch, snack, and dinner meals. What kind of recipe are you looking for?";
const REPROMPT_TYPE = "I'm sorry, what meal type do you need a recipe for? You can choose a breakfast, lunch, snack, or dinner recipe.";
const MEALTYPE_NOT_IN_LIST = chosenType => `Sorry, I couldn't find any recipes for ${chosenType}. Do you want a breakfast, lunch, dinner or snack recipe?`;

const RECIPE_ADJECTIVES = [
    "awesome",
    "super simple",
    "fun",
    "extremely tasty"
];
const SUGGEST_RECIPE = recipeName => `I found this ${_pickRandom(RECIPE_ADJECTIVES)} ${recipeName} recipe! Do you want me to tell you how to make ${recipeName}?`;
const MISUNDERSTOOD_RECIPE_ANSWER = "Please answer with yes or no.";
const NO_REMAINING_RECIPE = "This was it. I don't know any more recipes. Do you want to select a different meal type?"
const INGREDIENTS_INTRO = "You will need"; // Here follows a list of ingredients
const INGREDIENTS_ENDING = "Does that sound like a meal you want to eat?"; // Will be said after the list of ingredients


const FIRST_TIME_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. ";
const REPROMPT_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. ";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Sorry, I didn't understand you there.";
const CLOSING_MESSAGE = "You did it! Bon Apetit! See ya!";

const recipes = {
    breakfast: [{
            name: "Savory Microwave Breakfast Mug",
            instructions: [
                "Tear or cut the bread into 1/2-inch pieces. Chop the meat and vegetables into small pieces. Shred the cheese.",
                "Add the butter to the bottom of a large mug (10-12oz.) and microwave on high for 20 seconds or until it is fully melted. Whisk in the milk, egg, salt, and pepper with a fork. Stir the meat, vegetables, and cheese into the milk and egg mixture first, then gently fold in the bread cubes until they are fully saturated.",
                "Let the mug sit for one minute to fully absorb the liquid, then microwave on high for about 90 seconds, or until the center is solid and it has begun to pull away from the mug around the edges. Serve hot."
            ],
            ingredients: [
                "one cup stale bread pieces",
                "one fourth cup pre-cooked chopped meat - optional",
                "one fourth cup finely chopped vegetables - optional",
                "two Tbsp shredded cheese - optional",
                "three sprays of olive oil",
                "three Tbsp milk",
                "one large egg",
                "Pinch of salt and pepper"
            ]
        },
        {
            name: "EASY EGG WRAPS",
            instructions: [
                "Heat a small skillet over medium heat. Grease with butter or oil",
                "In a bowl, crack one egg and mix well with a fork. Pour into a hot pan and tilt pan to spread egg into a large circle on the bottom of the pan. Let cook 30 seconds. (Sprinkle with seasonings if desired)",
                "Carefully flip with a large spatula and let cook another 30 seconds. Remove from pan and repeat with as many eggs as desired",

                "Let egg wraps cool slightly (or fully), top as desired with fillings, roll and serve warm or cold."
            ],
            ingredients: [
                "Eggs",
                "Optional fillings: turkey, avocado, cheese"
            ]
        },
        {
            name: "BERRY SMOOTHIE BOWL",
            instructions: [
                "Place the frozen fruits, plant milk, peanut butter powder in a blender and and blend until smooth.",
                "Place in a bowl and add toppings of choice."
            ],
            ingredients: [
                "three to four frozen bananas",
                "one third cup frozen blueberries",
                "one third cup frozen raspberries",
                "two tbs peanut butter powder",
                "one fourth cup cashew milk, unsweetened or sweetened",
                "rawnola",
                "blueberries"
            ]
        }
    ],
    lunch: [{
            name: "Leftover Quinoa for Salad",
            instructions: [
                "In a small bowl, whisk together pomegranate juice, lemon zest and juice, and olive oil. Salt and pepper to taste. Add more oil if needed. Set aside.",
                "In a large bowl, toss together quinoa, walnuts, parsley, green onion, pomegranate arils, and dried cranberries. Drizzle on vinaigrette to taste, and toss until well-coated. ",
                "We used all of the dressing, but always err on the side of caution and pour slowly! Salt and pepper to taste.",
                "Serve immediately. This salad keeps in the fridge for 1-2 days."
            ],
            ingredients: [
                "one fourth cup pomegranate juice",
                "one lemon",
                "one third cup olive oil",
                "two cups cooked quinoa",
                "one third cup walnuts",
                "one third cup parsley ",
                "one third cup green onion",
                "one small pomegranate",
                "one third cup dried cherries or cranberries"
            ]
        },
        {
            name: "Caprese Avocado Salad",
            instructions: [
                "To make the balsamic reduction, add balsamic vinegar and brown sugar to a small saucepan over medium heat. Bring to a slight boil and reduce by half, about 6-8 minutes; set aside and let cool.",
                "Heat olive oil in a medium skillet over medium high heat.",
                "Season chicken breasts with salt and pepper, to taste. Add to skillet and cook, flipping once, until cooked through, about 3-4 minutes per side. Let cool before dicing into bite-size pieces.",
                "To assemble the salad, place romaine lettuce in a large bowl; top with chicken, mozzarella, tomatoes, avocado and basil. Pour balsamic reduction on top of the salad and gently toss to combine."
            ],
            ingredients: [
                "half cup balsamic vinegar",
                "two tablespoons brown sugar",
                "one tablespoon olive oil",
                "two boneless, skinless thin-sliced chicken breasts",
                " salt and ground black pepper",
                "six cups chopped romaine lettuce",
                "six ounces ovaline fresh mozzarella",
                "one cup cherry tomatoes, halved",
                "one avocado, halved, seeded, peeled and diced",
                "one fourth cup basil leaves, chiffonade"

            ]
        },
        {
            name: "ASIAN CHICKEN SALAD",
            instructions: [
                "In a small bowl, whisk together peanut butter, soy sauce, rice wine vinegar, brown sugar, garlic and 1/4 cup warm water until smooth. Place in the refrigerator until ready to serve.",
                "In a gallon size Ziploc bag or large bowl, combine chicken and teriyaki sauce; marinate for at least 2 hours to overnight, turning the bag occasionally. Drain the chicken from the marinade. Preheat grill to medium heat.",
                "Brush with canola oil; season with salt and pepper, to taste. Add chicken to grill, and cook, turning occasionally, until chicken is completely cooked through, reaching an internal temperature of 165 degrees F, about 10 minutes.",
                "To assemble the salad, place romaine lettuce in a large bowl; top with chicken, cabbage, carrots, chow mein noodles, mandarin oranges, cashews, cilantro and green onions. Pour the peanut dressing on top of the salad and gently toss to combine."
            ],
            ingredients: [

                "two pounds Boneless Skinless Chicken Thighs",
                "one cup teriyaki sauce",
                "one and a half tablespoons oil",
                "salt and ground black pepper",
                "one head romaine, roughly chopped",
                "two cups shredded red cabbage",
                "one and a half cups julienned carrots",
                "three fourth cup crunchy chow mein noodles",
                "one can mandarin oranges, drained",
                " half cup roasted cashews",
                "half cup chopped fresh cilantro",
                "four green onions, thinly sliced"
            ]
        }
    ],
    dinner: [{
            name: "Tuna Avocado Pita",
            instructions: [
                "Halve and lightly toast a pita",
                "Meanwhile mix together 1 pouch (about 2 ounces) tuna, 2 tablespoons spicy mustard, 1/4 cup each shredded carrots and chopped celery, and a dash each turmeric, cumin, and black pepper. ",
                "After 10 to 15 minutes take the pizza out of the oven. ",
                "If you're really intro crusty pizza, you can wait 20 minutes. I've heard burned pizza is not as unhealthy as people might think."
            ],
            ingredients: [
                "pita",
                "one pouch tuna",
                "two tablespoons spicy mustard",
                "one fourth cup each shredded carrots",
                "one fourth chopped celery",
                "dash each turmeric, cumin, and black pepper."

            ]
        },

        {
            name: "Cinnamon 'n’ Honey Waffles",
            instructions: [
                "Top waffle with 2 tablespoons almond butter, ricotta cheese, and sliced banana.",
                "Drizzle with honey and sprinkle with cinnamon."

            ],
            ingredients: [
                " one toasted waffle", "2 tablespoons almond butter", "one fourth cup ricotta cheese", "half sliced banana"

            ]
        }
    ],
    snack: [{
            name: "Apple Crisp Energy Bites",
            instructions: [
                "Blend almonds in food processor for 1 minute or until almonds are well-ground. ",
                "Add the rest of the ingredients and blend until mixture comes together almost as a dough.",
                "Roll out balls in your hand and enjoy.  Energy bites stay fresh for a week in an air-tight container in the refrigerator.!"
            ],
            ingredients: [
                "one cup oats",
                "half cup almonds",
                "3 ounces pitted dates",
                "one and a half teaspoon cinnamon",
                "quarter teaspoon ground ginger",
                "three ounces dried apple slices",
                "two tablespoons fresh lemon juice",
                "one eight teaspoon sea salt"
            ]
        },
        {
            name: "Coconut Protein Bites",
            instructions: [
                "Place all ingredients in a food processor or high-powered blender.",
                "Mix until it forms a dough.",
                "Roll into balls. Store in the fridge or freezer."
            ],
            ingredients: [
                "one cup packed pitted medjool dates",
                "half quick oats",
                "quarter cup hemp seeds",
                "quarter cup Vega Performance Protein Vanilla",
                "quarter cup unsweetened shredded coconut",
                "one tsp cinnamon"

            ]
        }
    ]
};

/***********
Execution Code: Avoid editing the code below if you don't know JavaScript.
***********/

// Private methods (this is the actual code logic behind the app)

const _getCurrentStep = handler => handler.attributes['instructions'][handler.attributes['current_step']];

const _intentAndSlotPresent = handler => {
    try {
        return handler.event.request.intent.slots.mealType;
    } catch (e) {
        return false;
    }
};
const _selectedMealType = handler => {
    return _intentAndSlotPresent(handler) && handler.event.request.intent.slots.mealType.value;
};
const _checkMealTypePresence = handler => {
    return Object.keys(recipes).includes(_selectedMealType(handler));
};
const _setMealType = handler => {
    // Reset remaining recipes in case the user went back from before
    handler.attributes['mealType'] = _selectedMealType(handler);
    handler.attributes['remainingRecipes'] = recipes[handler.attributes['mealType']];
    handler.handler.state = states.RECIPEMODE;
    handler.emitWithState("Recipe");
    return true;
};

const _randomIndexOfArray = (array) => Math.floor(Math.random() * array.length);
const _pickRandom = (array) => array[_randomIndexOfArray(array)];

// Handle user input and intents:

const states = {
    STARTMODE: "_STARTMODE",
    RECIPEMODE: "_RECIPEMODE",
    INSTRUCTIONSMODE: "_INSTRUCTIONSMODE",
    CANCELMODE: "_CANCELMODE"
};


const newSessionhandlers = {
    'NewSession': function() {
        this.handler.state = states.STARTMODE;
        this.emitWithState('NewSession');
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', HELP_START, HELP_START_REPROMPT);
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', CANCEL_MESSAGE);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', STOP_MESSAGE);
    },
    'Unhandled': function() {
        this.emit(':ask', REPROMPT_TYPE);
    }
};

const startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'NewSession': function(startMessage = CHOOSE_TYPE_MESSAGE) {
        if (_checkMealTypePresence(this)) {
            // Go directly to selecting a meal if mealtype was already present in the slots
            _setMealType(this);
        } else {
            this.emit(':ask', startMessage, REPROMPT_TYPE);
        }
    },
    'ChooseTypeIntent': function() {
        if (_checkMealTypePresence(this)) {
            _setMealType(this);
        } else {
            this.emit(':ask', MEALTYPE_NOT_IN_LIST(_selectedMealType(this)));
        }
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', HELP_START, HELP_START_REPROMPT);
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', CANCEL_MESSAGE);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', STOP_MESSAGE);
    },
    'Unhandled': function() {
        this.emit(':ask', REPROMPT_TYPE);
    }
});

const recipeModeHandlers = Alexa.CreateStateHandler(states.RECIPEMODE, {
    'Recipe': function() {
        if (this.new) {
            this.attributes['remainingRecipes'] = recipes[handler.attributes['mealType']];
        }

        if (this.attributes['remainingRecipes'].length > 0) {
            // Select random recipe and remove it form remainingRecipes
            this.attributes['recipe'] = this.attributes['remainingRecipes'].splice(_randomIndexOfArray(this.attributes['remainingRecipes']), 1)[0]; // Select a random recipe
            // Ask user to confirm selection
            this.emit(':ask', SUGGEST_RECIPE(this.attributes['recipe'].name));
        } else {
            this.attributes['remainingRecipes'] = recipes[this.attributes['mealType']];
            this.handler.state = states.CANCELMODE;
            this.emitWithState('NoRecipeLeftHandler');
        }
    },
    'IngredientsIntent': function() {
        var ingredients = this.attributes['recipe'].ingredients.join(', ').replace(/,(?!.*,)/gmi, ' and'); // Add 'and' before last ingredient

        this.emit(':ask', `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`)
    },
    'YesIntent': function() {
        this.attributes['instructions'] = this.attributes['recipe'].instructions;
        this.attributes['current_step'] = 0;
        this.handler.state = states.INSTRUCTIONSMODE;
        this.emitWithState('InstructionsIntent');
    },
    'NoIntent': function() {
        this.emitWithState('Recipe');
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', HELP_RECIPE, HELP_RECIPE_REPROMPT);
    },
    'AMAZON.CancelIntent': function() {
        this.handler.state = states.CANCELMODE;
        this.emitWithState('AskToCancelHandler');
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', STOP_MESSAGE);
    },
    'Unhandled': function() {
        this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER);
    }
});

const instructionsModeHandlers = Alexa.CreateStateHandler(states.INSTRUCTIONSMODE, {
    'InstructionsIntent': function() {
        const firstTimeInstructions = (this.attributes['current_step'] == 0) ? FIRST_TIME_INSTRUCTIONS : '';
        this.emit(':ask', `${_getCurrentStep(this)} ${firstTimeInstructions}`, REPROMPT_INSTRUCTIONS);
    },
    'NextStepIntent': function() {
        this.attributes['current_step']++;

        if (this.attributes['current_step'] < this.attributes['instructions'].length - 1) {
            this.emitWithState('InstructionsIntent');
        } else {
            this.emitWithState('InstructionsEnded');
        }
    },
    'InstructionsEnded': function() {
        this.emit(':tell', `${_getCurrentStep(this)} ${CLOSING_MESSAGE}`);
    },
    'DifferentRecipeIntent': function() {
        this.handler.state = states.RECIPEMODE;
        this.emitWithState('Recipe');
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', HELP_INSTRUCTIONS, HELP_INSTRUCTIONS_REPROMPT);
    },
    'AMAZON.CancelIntent': function() {
        this.handler.state = states.CANCELMODE;
        this.emitWithState('AskToCancelHandler');
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', STOP_MESSAGE);
    },
    'Unhandled': function() {
        this.emit(':ask', MISUNDERSTOOD_INSTRUCTIONS_ANSWER);
    }
});


const cancelModeHandlers = Alexa.CreateStateHandler(states.CANCELMODE, {
    'NoRecipeLeftHandler': function() {
        this.emit(':ask', NO_REMAINING_RECIPE);
    },
    'AskToCancelHandler': function() {
        this.emit(':ask', CANCEL_MESSAGE);
    },
    'YesIntent': function() {
        this.attributes['current_step'] = 0;
        this.handler.state = states.STARTMODE;
        this.emitWithState('NewSession', REPROMPT_TYPE);
    },
    'NoIntent': function() {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', HELP_CANCEL, HELP_CANCEL_REPROMPT);
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', STOP_MESSAGE);
    },
    'Unhandled': function() {
        this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER);
    }
});

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(newSessionhandlers, startModeHandlers, recipeModeHandlers, instructionsModeHandlers, cancelModeHandlers);
    alexa.execute();
};
