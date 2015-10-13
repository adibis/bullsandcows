var guess;
var i = 0;
var num;
var len = 4;
var nGuesses = 1;

function main() {
    for (j = 1; j < 10; j++) {
        $("#" + j).unbind("click");
    }
    i = 0;
    nGuesses = 1;
    guess = [0, 0, 0, 0];
    num = pickNum(len);
    $(".game-board").empty().append(0);
    $("#score").children().remove();
    for (j = 0; j < 4; j ++ ) {
    $("#score").append(
              "\<a href=\"#\" class=\"list-group-item disabled\"\>&nbsp;\<\/a\>");
    }
    console.log('The secret number is:\n  ' + num.join('\n  '));
    initGame();
}

function showScore(nBulls, nCows) {
    console.log('    Bulls: ' + nBulls + ', cows: ' + nCows);
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

function showFinalResult(guesses) {
    console.log('You win!!! Guesses needed: ' + guesses);
    var cell = $(".game-board");
    if( cell.hasClass("btn-primary") ) {
        cell.removeClass("btn-primary").addClass("btn-success");
    }
}

function countBovine(num, guess) {
    var count = {bulls:0, cows:0};
    var g = guess.join('');
    console.log(g);
    for (var i = 0; i < num.length; i++) {
        var digPresent = g.search(num[i]) != -1;
        if (num[i] == guess[i]) count.bulls++;
        else if (digPresent) count.cows++;
    }
    return count;
}

function getGuess(nGuesses, len) {
    while (true) {
        return guess;
    }
}

function hasDups(ary) {
    var t = ary.concat().sort();
    for (var i = 1; i < t.length; i++) {
        if (t[i] == t[i-1]) return true;
    }
    return false;
}

function pickNum(len) {
    var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    nums.sort(function(){return Math.random() - 0.5});
    return nums.slice(0, len);
}

function initGame(){
    var cell = $(".game-board");
    if( cell.hasClass("btn-success") ) {
        cell.removeClass("btn-success").addClass("btn-primary");
    }
    for(var i=1; i < 10; i++)
    {
        $("#" + i).bind("click", playMove);
    }
};

function playMove(){
    var cell = $(this);
    if (cell.attr('id') == "delete") {
        $("#answer").children("."+(i)).text(0);
        if (i != 0) {
            i--;
        }
        $("#"+guess[i]).bind("click", playMove);
        guess[i] = 0;
    } else {
        guess[i] = cell.attr('id').split(" ")[0];
        if (i == 0) {
            $(".game-board").empty().append(0);
        }
        $("#answer").children("."+(i+1)).text(guess[i]);
        cell.unbind("click");
        i++;
        if (i == 4) {
            for (j = 1; j < 10; j++) {
                $("#" + j).unbind("click");
            }
            var census = countBovine(num, guess);
            showScore(census.bulls, census.cows);
            if (census.bulls == len) {
                showFinalResult(nGuesses);
                //main();
            } else {
                i = 0;
                nGuesses++;
                guess = [0, 0, 0, 0];
                initGame();
            }
        }
    }
    console.log("Answer: " + guess);
    console.log("i = " + i);
};

$(document).ready(function(){
    console.log( "Starting" );
    $("#delete").bind("click", playMove);
    main();
});

