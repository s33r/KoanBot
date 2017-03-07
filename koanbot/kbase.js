var phraseAnalysis = require('./phraseAnalysis');
var koans1 = require('./koan1');
var koanList = [];



function randomIndex(length) {
    return Math.floor(Math.random() * length);
}

function loadKoans(koans) {
    for (var j = 0; j < koans.length; j++) {
        koanList.push(phraseAnalysis.createMatcher(koans[j]));
    }
}


function findKoan(inputMatcher) {
    var bestMatch = null;
    var bestStrength = 0;

    for (var j = 0; j < koanList.length; j++) {
        var strength = phraseAnalysis.compareMatchers(inputMatcher, koanList[j]);

        if (strength > bestStrength) {
            bestMatch = koanList[j];
            bestStrength = strength;
        }
    }

    return bestMatch;
}

module.exports.initialize = function() {
    loadKoans(koans1);
}

module.exports.getKoan = function (inputPhrase) {
    var inputMatcher = phraseAnalysis.createMatcher(inputPhrase);
    var result = findKoan(inputMatcher);

    if (!!result) {
        return result.phrase;
    }

    return 'Mu';
};


