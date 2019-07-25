//On page load:
$( document ).ready(function() {
    //the cursor appears in the "Name" field, ready for a user to type.
    $('#name').focus();
    //the color dropdown for the t-shirt is hidden
    $('#color').hide();
    //creates a span element with text "Please select a T-shirt theme"
    const $selectThemeText = $('<span id="js-select-theme">Please select a T-shirt theme</span>');
    $('#colors-js-puns').append($selectThemeText);
    //create total price element below activities
    $('fieldset.activities').append('<h3 id="js-total-price"></h3>');
    // create all validation divs and hide them
    //name validation error div
    $('label[for="name"]').append('<div id="js-name-error" class="js-validation-error"></div>');
    $('#js-name-error').hide();
    //mail validation error div
    $('label[for="mail"]').append('<div id="js-email-error" class="js-validation-error"></div>');
    $('#js-email-error').hide();
    // activity registration validation warning div
    $('fieldset.activities legend').append('<div id="js-activity-error" class="js-validation-error"></div>');
    $('#js-activity-error').hide();
    //credit card number validation error div
    $('label[for="cc-num"]').append('<div id="js-card-error" class="js-validation-error"></div>');
    $('#js-card-error').hide();
    //cvv validation error div
    $('label[for="cvv"]').append('<div id="js-cvv-error" class="js-validation-error"></div>');
    $('#js-cvv-error').hide();
    //zip validation error div
    $('label[for="zip"]').append('<div id="js-zip-error" class="js-validation-error"></div>');
    $('#js-zip-error').hide();
    //whole form validation error div displayed above 
    $('button[type="submit"]').after('<div id="js-submit-error" class="js-validation-error"></div>');
    $('#js-submit-error').hide();
});


//global variables declaration
//totalPrice will store the total price the user needs to pay, it is initialized with zero on page load
let $totalPrice = 0;
//best email regex taken from https://emailregex.com/
const bestEmailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;


//"Your job role" text field appears when user selects "Other" from the Job Role menu.
$('select#title').on('change', function(){
    const $selectedRole = $('select#title option:selected').val();
    const $otherInputExists = $("#other").length;
    //if user selected other and the text input has not been created yet
    if ( $selectedRole === 'other' && !$otherInputExists ) {
        const $otherRole = `
            <label for="other">Your job role</label>
            <input type="text" id="other" name="user_other">
            `;
        $('#title').after($otherRole);
    } 
    //if user selected other and the text input has already been created
    else if( $selectedRole === 'other' && $otherInputExists ) {
        $('#other').show();
    }
    //if user selected other job than other and other exists it will be hidden
    else if( $selectedRole !== 'other' && $otherInputExists ) {
        $('#other').hide();
    }
});


// Until a theme is selected from the “Design” menu, no color options appear in the “Color” drop down and the “Color” field reads “Please select a T-shirt theme”.
// “Color” drop down menu is hidden until a T-Shirt design is selected.
// When a new theme is selected from the "Design" menu, the "Color" field and drop down menu is updated.
$('select#design').on('change', function(){
    const $selectedShirtTheme = $('select#design option:selected').val();
    const $shirtColorOptions = $('select#color option');  
    //if shirt theme is value="js puns" display only the first three colors
    if($selectedShirtTheme === 'js puns') {
        //shows color dropdown
        $('#color').show(); 
        //hides please select theme warning text displayed at color dropdown position
        $('#js-select-theme').hide(); 
        for(let x=0; x<3; x++) {
            $shirtColorOptions.eq(x).show();
            $shirtColorOptions.eq(x+3).hide();
        }
        //deselects all colors and selects the first color which is compatible with js puns theme
        $shirtColorOptions.removeAttr('selected');
        $shirtColorOptions.eq(0).attr('selected','true');
    }
    //else if theme value="heart js" display only the last three color options which are compatible
    else if($selectedShirtTheme === 'heart js') {
        //shows color dropdown
        $('#color').show();
        //hides please select theme warning text displayed at color dropdown position
        $('#js-select-theme').hide(); 
        for(let x=0; x<3; x++) {
            $shirtColorOptions.eq(x).hide();
            $shirtColorOptions.eq(x+3).show();
        }
        //deselects all selected colors and selects the first color which is compatible with js heart theme
        $shirtColorOptions.removeAttr('selected');
        $shirtColorOptions.eq(3).attr('selected','true');
    } 
    //if none of the above options are selected color dropdown is hidden and a text warning "please select theme ..." is displayed
    else if($selectedShirtTheme === 'Select Theme') {
        $('#color').hide();
        $('#js-select-theme').show(); 
    }
});


// User cannot select two activities that are at the same time.
// Total cost of selected activities is calculated and displayed below the list of activities.
$('fieldset[class="activities"]').on('change','input',function(){
    const $activitiesCheckBoxes = $('fieldset[class="activities"] input[type="checkbox"]');
    const $checkedActivityName = $(this).attr('name');
    //if activity is checked increase price else if activity is unchecked decrease price accordingly
    if( this.checked && $checkedActivityName !== 'all' ) {$totalPrice+= 100;}
    else if( !this.checked && $checkedActivityName !== 'all') {$totalPrice-= 100;}
    else if( this.checked && $checkedActivityName === 'all') {$totalPrice+= 200;}
    else if( !this.checked && $checkedActivityName === 'all') {$totalPrice-= 200;}
    $('#js-total-price').text(`Total Price: $${$totalPrice}`);
    //when total price is zero it will not be displayed anymore
    if (!$totalPrice) {
        $('#js-total-price').text('');
    }  
    //function to toggle availability of activities that happen at the same time
    function toggleCompatibleActivities(isChecked,x,y) {
        if(isChecked) {
            $activitiesCheckBoxes.eq(x).
                attr('disabled', 'true')
                .parent().
                addClass('checkbox-disabled-label');
            $activitiesCheckBoxes.eq(y)
                .attr('disabled', 'true')
                .parent()
                .addClass('checkbox-disabled-label');
        }
        else {
            $activitiesCheckBoxes.eq(x)
                .removeAttr('disabled')
                .parent()
                .removeClass('checkbox-disabled-label');
            $activitiesCheckBoxes.eq(y)
                .removeAttr('disabled')
                .parent()
                .removeClass('checkbox-disabled-label');
        }
    }
    // the following activities happen at the same time so exclude each other
    // js-frameworks - index 1 / express - index 3 / build-tools - index 5
    // js-libs - index 2 / node - index 4 / npm - index 6
    if( $checkedActivityName === 'js-frameworks' ) {
        toggleCompatibleActivities(this.checked, 3, 5);
    }
    else if( $checkedActivityName === 'express' ) {
        toggleCompatibleActivities(this.checked, 1, 5);
    }
    else if( $checkedActivityName === 'build-tools' ) {
        toggleCompatibleActivities(this.checked, 1, 3);
    }
    else if( $checkedActivityName === 'js-libs' ) {
        toggleCompatibleActivities(this.checked, 4, 6);
    }
    else if( $checkedActivityName === 'node' ) {
        toggleCompatibleActivities(this.checked, 2, 6);
    }
    else if( $checkedActivityName === 'npm' ) {
        toggleCompatibleActivities(this.checked, 2, 4);
    }
    else if( $checkedActivityName === 'js-frameworks' ) {
        toggleCompatibleActivities(this.checked, 3, 5);
    }
    activityValidation();
});


//The "Credit Card" payment option is selected by default.
$('select#payment option').eq(1).attr('selected','true');
const $creditCardDiv = $('#credit-card');
const $payPalDiv = $creditCardDiv.next();
const $bitCoinDiv = $payPalDiv.next();
$payPalDiv.hide();
$bitCoinDiv.hide();
//Payment option in the select menu matches the payment option displayed on the page.
//When a user chooses a payment option, the chosen payment section is revealed and the other payment sections are hidden.
$('select#payment').on('change', function(){
    const $selectedOptionValue = $('select#payment option:selected').val();
    //if credit card is selected the other payment divs need to be hidden
    if ($selectedOptionValue === 'credit card') {
        $creditCardDiv.show();
        $payPalDiv.hide();
        $bitCoinDiv.hide();
    }
    else if($selectedOptionValue === 'paypal') {
        $creditCardDiv.hide();
        $payPalDiv.show();
        $bitCoinDiv.hide();
    }
    else if($selectedOptionValue === 'bitcoin') {
        $creditCardDiv.hide();
        $payPalDiv.hide();
        $bitCoinDiv.show();
    }
    //if no payment option is selected, all payment divs need to be hidden
    else if($selectedOptionValue === 'select_method') {
        $creditCardDiv.hide();
        $payPalDiv.hide();
        $bitCoinDiv.hide();
    }
});


//Form cannot be submitted (the page does not refresh when the submit button is clicked) until the following requirements have been met:
//Name field isn’t blank.
//At least one checkbox under "Register for Activities" section must be selected.
//Email field contains validly formatted e-mail address: (doesn’t have to check that it's a real e-mail address, just that it's formatted like one: dave@teamtreehouse.com, for example).
//If "Credit Card" is the selected payment option, the three fields accept only numbers: a 13 to 16-digit credit card number, a 5-digit zip code, and 3-number CVV value.
// On submission, the form provides an error indication or message for each field that requires validation:
// Name field
// Email field
// “Register for Activities” checkboxes
// Credit Card number, Zip code, and CVV, only if the credit card payment method is selected.
$('form').on('submit', function (event) { 
    //validation functions are triggered for name mail activities card cvv and zip fields and options
    const name = nameValidation();
    const email = mailValidation();
    const activity = activityValidation();
    const card = cardValidation();
    const cvv = cvvValidation();
    const zip = zipValidation();
    //if all validation function returned zero then prevent default behaviour of form submit
    if( !(name && email && activity && card && cvv && zip) ) {
        $('#js-submit-error').show().text('Fix errors marked with red above, then resubmit');
        event.preventDefault();
    }
});

// function mailValidation 
// Form provides messages that change depending on the error. 
// For example, the email field displays a different error message when the email field is empty 
// than it does when the email address is formatted incorrectly. 
// *This is accomplished without the use of HTML5's built-in field validation.
// the error message appears near the email field when the user begins to type, 
// and disappears as soon as the user has entered a complete and correctly formatted email address.
function mailValidation() {
    const $emailIsValid = bestEmailRegex.test( $('#mail').val() ); 
    if( !$('#mail').val() ) {
        $('#js-email-error').show().text('Field empty. Please enter your email.');
        return 0;
    } 
    else if( !$emailIsValid ) {
        $('#js-email-error').show().text('Enter a valid email address.');
        return 0;
    }   
    else {
        $('#js-email-error').hide();
        return 1;
    }
};
//mail validation is called each time user adds text to email input field
$('input#mail').on('input', mailValidation);

//name validation returns 0 if name is not valid and 1 if name is valid
//also when function is called it displays validation error
function nameValidation() {
    const $nameIsValid = $('input#name').val(); 
    if( !$nameIsValid || $nameIsValid.length < 3) {
        $('#js-name-error').show().text('Your full name needs to be entered');
        return 0;
    }
    else {
        $('#js-name-error').hide();
        return 1;
    }
};
//namevalidation function is called each time the user adds text to the name field
//Form provides error messages in real time, before the form is submitted. 
$('input#name').on('input', nameValidation);

// function activity is selected checks if the user has registered to at least one activity of the conference
// function is called on form submit
function activityValidation() {
    //at least one activity is checked, that means that total price is different from zero
    const $activityIsSelected = $totalPrice !== 0; 
    if( !$activityIsSelected ) {
        $('#js-activity-error').show().html('<sub>One or more activities need to be selected</sub>');
        return 0;
    }
    else {
        $('#js-activity-error').hide();
        return 1;
    }
};
//each time the user clicks on one of the select options activityValidation is run, the function is called with the activity configurator event handler farther above

// credit card number validation
// checks if credit card has between 13 and 16 digits, to do that all spaces are also removed
function cardValidation () { 
    const $cardIsValid = /^\d{13}\d?\d?\d?$/.test( $('#cc-num').val().replace(/\s+/g,'') ) ;
    if( !$cardIsValid ) {
        $('#js-card-error').show().text('Enter valid card number');
    }
    else {
        $('#js-card-error').hide();
    }
};
// card validation is done each time user inputs digits into card number field 
$('#cc-num').on('input', cardValidation);

// cvv validation
function cvvValidation () { 
    //checks if cvv has 3 digits 
    const $cvvIsValid = /^\d{3}$/.test( $('#cvv').val() );    
    if( !$cvvIsValid ) {
        $('#js-cvv-error').show().text('Enter 3-digit cvv');
    }
    else {
        $('#js-cvv-error').hide();
    }
};
// cvv validation is done each time user inputs digits into card number field 
$('#cvv').on('input', cvvValidation);

// zip validation
function zipValidation () { 
    //checks if zip field has 5 digits
    const $zipIsValid = /^\d{5}$/.test( $('#zip').val() ); 
    if( !$zipIsValid ) {
        $('#js-zip-error').show().text('Enter 5-digit zip');
    }
    else {
        $('#js-zip-error').hide();
    }
};
// card validation is done each time user inputs digits into card number field 
$('#zip').on('input', zipValidation);
