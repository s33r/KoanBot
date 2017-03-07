var _ = require('lodash');

var filterExpression = /[^\w]/g;

function createWordList(phrase) {
    var result = [];

    var wordList = phrase.split(/\s/);

    for (var j = 0; j < wordList.length; j++) {
        var value = wordList[j].replace(filterExpression, '').toLowerCase();

        result.push(value);
    }

    result = _.uniq(result);

    return result;
}

function getCommonWords(set1, set2) {
    return _.intersection(set1, set2);
}

module.exports.createMatcher = function(phrase) {
    var result = {
        phrase: phrase,
        words: createWordList(phrase)
    };

    return result;
};

module.exports.compareMatchers = function(left, right) {
    var result = 0;

    var common = getCommonWords(left.words, right.words);

    result = common.length;

    return result;
};