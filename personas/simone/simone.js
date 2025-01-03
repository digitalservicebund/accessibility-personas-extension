// adapted from    https://github.com/alphagov/accessibility-personas

(function () {
  "use strict";

  // general-purpose tree walker
  // @source: https://gist.github.com/Sphinxxxx/ed372d176c5c2c1fd9ea1d8d6801989b
  // @author: Andreas Borgen and Gavin Kistner
  function walkNodeTree(root, options) {
    options = options || {};

    const inspect = options.inspect || ((n) => true),
      collect = options.collect || ((n) => true);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL, {
      acceptNode: function (node) {
        if (!inspect(node)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!collect(node)) {
          return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) {
      options.callback && options.callback(n);
      nodes.push(n);
    }

    return nodes;
  }

  // create a list of text nodes to be messed up
  var textNodes = [];

  function updateTextNodes(root) {
    textNodes = textNodes.concat(
      walkNodeTree(root, {
        inspect: (n) => !["STYLE", "SCRIPT"].includes(n.nodeName),
        collect: (n) => n.nodeType === Node.TEXT_NODE,
      }),
    );
  }

  // scramble text nodes continuously
  var iterateFunction = function () {
    for (var i = 0; i < textNodes.length; i++) {
      textNodes[i].nodeValue = messUpWords(textNodes[i].nodeValue);
    }
    window.requestAnimationFrame(iterateFunction);
  };

  // initial scramble
  updateTextNodes(document.body);
  window.requestAnimationFrame(iterateFunction);

  // observe for new nodes being added to the DOM
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          node.nodeValue = messUpWords(node.nodeValue);
          textNodes.push(node);
        } else {
          updateTextNodes(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // parse words out of a string and mess them up
  function messUpWords(str) {
    var messedUpText = "";

    // iterate through each word and scramble it
    var re = /\w+/g;
    var word;
    while ((word = re.exec(str)) != null) {
      // include any special characters before the word
      messedUpText += str.slice(messedUpText.length, word.index);
      // scramble the word
      messedUpText += scrambleWord(word[0]);
    }
    // include any special characters after the word
    messedUpText += str.slice(messedUpText.length, str.length);

    return messedUpText;
  }

  // scramble the word, being sure to always keep the first and last letters
  // in-tact. this is important so the text can still be read.
  function scrambleWord(word) {
    var scrambledWord = "";

    // if it's a small word or ~randomness~, don't scramble it
    if (word.length < 3 || Math.random() > 1 / 10) {
      return word;
    }

    var a = getRandomInt(1, word.length - 1);
    var b = getRandomInt(a, word.length - 1);

    scrambledWord += word.slice(0, a);
    scrambledWord += word.slice(a, b).split("").reverse().join("");
    scrambledWord += word.slice(b, word.length);

    return scrambledWord;
  }

  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
})();
