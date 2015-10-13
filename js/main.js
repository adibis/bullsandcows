var i;
var len = 4;
var num;
var guess;
var nGuesses

/* Initial game and page conditions.
 * - Resets all variables.
 * - Clears the main number display.
 * - Clears previous entries.
 * ------------------------------------------------------------------------- */
function main() {

    // Unbind all click events when cleaning up previous entry/game.
    for (j = 1; j < 10; j++) {
        $("#" + j).unbind("click");
    }

    // Reset all variables.
    i = 0;
    nGuesses = 1;
    guess = [0, 0, 0, 0];
    num = pickNum(len);

    // Remove old data from HTML page.
    $(".game-board").empty().append(0);
    $("#score").children().remove();
    for (j = 0; j < 4; j ++ ) {
        $("#score").append("\<a href=\"#\" class=\"list-group-item disabled\"\>&nbsp;\<\/a\>");
    }
    console.log('The secret number is:  ' + num.join(',  '));

    // Initialize all buttons and game-board again.
    initBoard();
}

/* Updates the entry list with the current guess.
 * Also deletes the initial empty lists.
 * Scrolls to the bottom, where new entry is created.
 * ------------------------------------------------------------------------- */
function showScore(nBulls, nCows) {
    if (nGuesses < 5) {
        $("#score").children("a:first").remove();
    }
    $("#score").append(
            "\<a href=\"#\" class=\"list-group-item disabled\"\>" +
            nGuesses + ": " +
            guess.join("") +
            "\<span class=\"bull\"\>&#x1F402;: " + nBulls +"\<\/span\>" +
            "\<span class=\"cow\"\>&#x1F404;: " + nCows + "\<\/span\>" +
            "\<\/a\>");
    $("#score").animate({ scrollTop: $("#score")[0].scrollHeight }, "slow");
}

/* Changes the game-board to green on victory.
 * TODO: Perhaps display message in the entry list when correct?
 * ------------------------------------------------------------------------- */
function showFinalResult(guesses) {
    console.log('You win!!! Guesses needed: ' + guesses);
    var cell = $(".game-board");
    if( cell.hasClass("btn-primary") ) {
        cell.removeClass("btn-primary").addClass("btn-success");
    }
}

/* Counts the bulls and cows in the current entry.
 * ------------------------------------------------------------------------- */
function countBovine(num, guess) {
    var count = {bulls:0, cows:0};
    var g = guess.join('');
    for (var i = 0; i < num.length; i++) {
        var digPresent = g.search(num[i]) != -1;
        if (num[i] == guess[i]) count.bulls++;
        else if (digPresent) count.cows++;
    }
    console.log("Guess: " + g + ".\nBulls: " + count.bulls + ". Cows: " + count.cows + ".");
    return count;
}

/* Picks a random 4 digits number with no duplicates.
 * ------------------------------------------------------------------------- */
function pickNum(len) {
    var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var i = nums.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
    console.log(nums);
    return nums.slice(0, len);
}

/* Initialize the main board.
 * Change success button (green) to reset state (blue).
 * Also bind the clicks back to buttons.
 * ------------------------------------------------------------------------- */
function initBoard(){
    var cell = $(".game-board");
    if( cell.hasClass("btn-success") ) {
        cell.removeClass("btn-success").addClass("btn-primary");
    }
    for(var i=1; i < 10; i++)
    {
        $("#" + i).bind("click", playMove);
    }
};

/* Decode which button was pressed based on button ID.
 * - Also handles the delete event.
 * ------------------------------------------------------------------------- */
function playMove(){
    var cell = $(this);

    // Check if we're deleting the last entry.
    // If so, roll back the position of guess and clear game-board.
    if (cell.attr('id') == "delete") {
        $("#answer").children("."+(i)).text(0);
        if (i != 0) {
            i--;
        }
        $("#"+guess[i]).bind("click", playMove);
        guess[i] = 0;

    } else {
        // Get the number clicked from button ID.
        guess[i] = cell.attr('id').split(" ")[0];

        // Reset the game-board if this is start of a new guess.
        if (i == 0) {
            $(".game-board").empty().append(0);
        }

        // Update game-board with the number entered.
        // Also disable click on this number as duplicates are not allowed.
        $("#answer").children("."+(i+1)).text(guess[i]);
        cell.unbind("click");
        i++;

        // When all 4 digits are entered, disable all future clicks.
        // Then process bulls and cows.
        // Update the input entry.
        if (i == 4) {
            for (j = 1; j < 10; j++) {
                $("#" + j).unbind("click");
            }

            var census = countBovine(num, guess);
            showScore(census.bulls, census.cows);

            // Correct number guessed, update the game-board to success.
            if (census.bulls == len) {
                showFinalResult(nGuesses);

                // If not then reset everything for next guess.
            } else {
                i = 0;
                nGuesses++;
                guess = [0, 0, 0, 0];
                initBoard();
            }
        }
    }
};

/* This is executed when the page is loaded.
 * ------------------------------------------------------------------------- */
$(document).ready(function(){
    // Bing the delete button to delete key.
    $("#delete").bind("click", playMove);
    main();
});
