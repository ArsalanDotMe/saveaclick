'use strict';

function isElementVisible(elem) {
  return elem.offsetParent !== null;
}

function isHeadline(elem) {
  if (elem.childElementCount === 0 && elem.innerText.length > 0) {
    var parent = elem.parentNode.parentNode;
    var siblings = Array.prototype.filter.call(parent.parentNode.children, function(child){
      return child !== parent;
    });
    for (var sibling of siblings) {
      if (sibling.tagName === "A") {
        return true;
      }
    }
  } else {
    return false;
  }
}

function openWebModal(event) {
  event.preventDefault();
  console.log(event.currentTarget);
  picoModal("Ah, the pitter patter of tiny feet in huge combat boots.").show();
  return false;
}

function prepare() {
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = '.__clickbait_link { border: 1px solid red; } ';
  css.innerHTML += `.__clickbait_button {
    background-color: #9b4dca;
    border: .1rem solid #9b4dca;
    border-radius: .4rem;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 700;
    height: 1.8rem;
    letter-spacing: .1rem;
    line-height: 1.8rem;
    padding: 0 1rem;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    white-space: nowrap;
    display: inline-block;
  } `;
  css.innerHTML += `.__clickbait_text {
    display: inline-block;
    margin-left: 1em;
  } `;
  document.head.appendChild(css);
}

// counter that increments to generate a new ID
var uniqueIds = 0;

function loop() {
  console.log("running loop");
  var allLinks = document.querySelectorAll('a[onmouseover^="LinkshimAsyncLink"]');
  var qualifyingLinks = [];

  for (var node of allLinks) {
    if (isElementVisible(node) && isHeadline(node) && !node.classList.contains("__clickbait_link")) {
      console.log(node);
      node.classList.add("__clickbait_link");
      var realUrl = decodeURIComponent(node.href).substring(33);
      realUrl = realUrl.substring(0, realUrl.indexOf('&h='));
      var containerDiv = document.createElement('div');
      var spanContainer = node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
      spanContainer.insertBefore(containerDiv, spanContainer[1]);
      console.log(containerDiv);

      var btn = document.createElement('a');
      btn.classList.add('__clickbait_button');
      btn.href = `http://saveaclick.herokuapp.com/?url=${encodeURIComponent(realUrl)}`;
      btn.setAttribute('target', '__blank');
      btn.innerText = 'Open';
      btn.addEventListener("click", openWebModal, true);
      containerDiv.appendChild(btn);
      // node.parentNode.appendChild(btn);

      var answerNode = document.createElement("p");
      answerNode.classList.add('__clickbait_text');
      answerNode.innerText = "#StopClickBait";
      answerNode.id = `__clickbait_ids_${(uniqueIds++)}`;
      // node.parentNode.appendChild(answerNode);
      containerDiv.appendChild(answerNode);

      chrome.runtime.sendMessage({ url: encodeURIComponent(realUrl), nodeId: answerNode.id });
    }
  }
}

chrome.runtime.onMessage.addListener(function onDataFetched(message) {
  document.getElementById(message.nodeId).innerText = message.answer.answer;
});

function init() {
  prepare();
  document.addEventListener("scroll", loop, false);
  loop();
}

init();

/**
 * TODOs:
 * Add throttling to scroll event
 * create a web service to store clickbait answers
 * create a producthunt type page to list answers and add a new one
 */

// temp1.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode