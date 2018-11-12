"use strict";

function Manager(container) {
  this.container = container;
  this.trie = new Trie();
}

Manager.prototype = function () {
  'use strict'; // Instance Constants

  var _styles = {
    "brands": "fab",
    "solid": "fas",
    "light": "fal",
    "regular": "far"
  }; // Private Methods

  function _createIconNode(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
  }

  function _loadIcons(icons, selectedCallback, parentElement, trie) {
    var iconCount = 0;
    var nodeCount = 0;
    var t0 = performance.now();
    var containerElement = parentElement.getElementsByClassName('result')[0];

    for (var key in icons) {
      iconCount++;
      var icon = icons[key];
      var html = icon.svg[icon.styles[0]].raw;

      var iconElement = _createIconNode(html); // set the icon data class 


      iconElement.dataset.class = _styles[icon.styles[0]] + " fa-" + key;
      iconElement.addEventListener('click', function (e) {
        var iconClass = '';

        if (e.target.nodeName === 'path') {
          iconClass = e.target.parentElement.dataset.class;
        } else {
          iconClass = e.target.dataset.class;
        }

        selectedCallback(iconClass);
        console.log("Icon selected: " + iconClass);
      });
      containerElement.appendChild(iconElement);

      if (!icon.search.terms.includes(key)) {
        icon.search.terms.push(key);
      }

      nodeCount += icon.search.terms.length;
      trie.addWords(icon.search.terms, iconElement);
    }

    var t1 = performance.now();
    console.log("Loading " + iconCount + " icons with " + nodeCount + " nodes finished in " + (t1 - t0) + "ms");
  } // Public Methods


  function dumpTrie() {
    console.log(JSON.stringify(this.trie.root, this.trie.replacer));
  }

  function handleKeyUp(e) {
    var key = e.key.toLowerCase(); // Enter, delete or backspace we need to do a full filter of the trie

    if (key === "enter" || key === "delete" || key === "backspace") {
      this.trie.filter(e.target.value);
    } else {
      if (key.length === 1) {
        this.trie.refine(key);
      }
    }
  }

  function setup(selectedCallback, url) {
    var _this = this;

    fetch(url).then(function (response) {
      return response.json();
    }).then(function (json) {
      _loadIcons(json, selectedCallback, _this.container, _this.trie);
    }).catch(function (error) {
      console.error(error);
    });
  }

  return {
    setup: setup,
    handleKeyUp: handleKeyUp,
    dumpTrie: dumpTrie
  };
}();