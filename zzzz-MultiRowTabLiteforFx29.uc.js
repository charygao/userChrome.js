// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx29.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    多段タブもどき実験版 CSS入れ替えまくりバージョン
// @include        main
// @compatibility  Firefox 29(Firefox17以上はzzzz-removeTabMoveAnimation.uc.js併用)
// @author         Alice0775
// @note           CSS checked it only on a defailt theme. Firefox17以上はzzzz-removeTabMoveAnimation.uc.js併用
// @version        2014/05/06 22:00
// ==/UserScript==
// ==UserScript==
"user strict";

zzzz_MultiRowTabLite();


function zzzz_MultiRowTabLite(){
  // -- config --
  var TABBROWSERTABS_MAXROWS = 3;
  var TAB_HEIGHT = 24;

  var TAB_MIN_WIDTH = 150;
  var TAB_MAX_WIDTH = 250;

  // -- config --

  // Tab Mix plus
  if("tablib" in window) return;
  // Tree Style tab
  if('TreeStyleTabService' in window) return;

  var timer = timer2 = null;
  if (!gPrefService)
    gPrefService = Components.classes["@mozilla.org/preferences-service;1"]
                                 .getService(Components.interfaces.nsIPrefBranch);
  gPrefService.setBoolPref("browser.tabs.autoHide", false);
  gPrefService.setBoolPref("browser.tabs.animate", false);

  /*タブが多い時に多段で表示するCSS適用 インラインを使用しないバージョン*/
  var style = ' \
    @namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul); \
    .tabbrowser-tabs \
    { \
      max-height: {TAB_HEIGHT}px; \
      min-height: 0px !important; \
      background-repeat: repeat !important; \
      overflow-x: hidden; \
      overflow-y: hidden; \
    } \
     \
    .tabbrowser-tabs > .tabbrowser-tab:not([pinned]) { \
      min-width: {TAB_MIN_WIDTH}px; \
    } \
     \
    .tabbrowser-tabs > .tabbrowser-tab:not([pinned])[fadein] { \
      min-width: {TAB_MIN_WIDTH}px; \
      max-width: {TAB_MAX_WIDTH}px; \
    }\
    .tabbrowser-tabs[positionpinnedtabs] > .tabbrowser-tab[pinned] { \
      display: -moz-box!important; \
      position: static !important; \
    } \
    .tabbrowser-tabs .tabbrowser-arrowscrollbox \
    { \
      /*height: 78px;*/ \
      overflow: auto; \
    } \
    .tabbrowser-tabs .tabbrowser-arrowscrollbox > scrollbox \
    { \
      overflow: visible; \
    } \
    .tabbrowser-tabs .tabbrowser-arrowscrollbox > scrollbox > box \
    { \
      display: block; \
      overflow: visible; \
    } \
     \
    /* hide the scroll arrows and alltabs button */ \
    .tabbrowser-tabs .scrollbutton-up, \
    .tabbrowser-tabs .scrollbutton-down \
    { \
      display: none; \
    } \
     \
    .tabbrowser-tabs .tabbrowser-arrowscrollbox > .tabs-newtab-button \
    { \
      display: none; \
    } \
    #new-tab-button \
    { \
      visibility: visible !important; \
    } \
    #alltabs-button \
    { \
      visibility: visible !important; \
    } \
     \
    .closing-tabs-spacer { \
      height: 0px !important; \
      width: 0px !important; \
      display: none !important; \
    } \
    ';

  style += ' \
    /* Tabs デフォテーマ*/ \
    #TabsToolbar { \
        background: transparent !important; \
        margin-bottom: 0 !important; \
    } \
\
    #TabsToolbar .tabbrowser-tabs{ \
        min-height:{TAB_HEIGHT}px; \
\
    } \
\
    #TabsToolbar .arrowscrollbox-scrollbox { \
        padding: 0 !important; \
    } \
\
    #TabsToolbar .tabbrowser-tab { \
        -moz-border-top-colors: none !important; \
        -moz-border-left-colors: none !important; \
        -moz-border-right-colors: none !important; \
        -moz-border-bottom-colors: none !important; \
        border-style: solid !important; \
        border-color: rgba(0,0,0,.2) !important; \
        border-width: 1px 1px 0 1px !important; \
        text-shadow: 0 0 4px rgba(255,255,255,.75) !important; \
        background: rgba(255,255,255,.27) !important; \
        background-clip: padding-box !important; \
\
        height:{TAB_HEIGHT}px; \
    } \
 \
    #TabsToolbar .tab-content:not([pinned]) { \
        -moz-padding-end: 3px !important;; \
        -moz-padding-start: 3px !important;; \
    } \
\
    /*workaround newtab position*/ \
    #TabsToolbar .tabbrowser-tab:not([image]) .tab-icon-image { \
      display: -moz-box !important; \
    } \
\
    #TabsToolbar .tabbrowser-tab[first-tab][last-tab], \
    #TabsToolbar .tabbrowser-tab[last-visible-tab] { \
        border-right-width: 1px !important; \
    } \
\
    #TabsToolbar .tabbrowser-tab[afterselected] { \
       border-left-color: rgba(0,0,0,.25) !important; \
    } \
\
    #TabsToolbar .tabbrowser-tab[selected] { \
        background: #EAF2FA !important; \
        background-clip: padding-box !important; \
        border-color: rgba(0,0,0,.25) !important; \
    } \
\
    #TabsToolbar .tabs-newtab-button:hover, \
    #TabsToolbar .tabbrowser-tab:hover:not([selected]) { \
        border-color: rgba(0,0,0,.2) !important; \
        background-color: rgba(255,255,255,.55) !important; \
    } \
\
    #TabsToolbar .tab-background { \
        margin: 0 !important; \
        background: transparent !important; \
    } \
\
    #TabsToolbar .tab-background-start, \
    #TabsToolbar .tab-background-end { \
        display: none !important; \
    } \
\
    #TabsToolbar .tab-background-middle { \
        margin: 0 !important; \
        background: transparent !important; \
    } \
\
    #TabsToolbar .tabbrowser-tab:after, \
    #TabsToolbar .tabbrowser-tab:before { \
        display: none !important; \
    } \
  ';

  style = style.replace(/\s+/g, " ")
     .replace(new RegExp("{TAB_HEIGHT}", "g"), TAB_HEIGHT)
     .replace(new RegExp("{TAB_MIN_WIDTH}", "g"), TAB_MIN_WIDTH)
     .replace(new RegExp("{TAB_MAX_WIDTH}", "g"), TAB_MAX_WIDTH);
  var sspi = document.createProcessingInstruction(
    'xml-stylesheet',
    'type="text/css" href="data:text/css,' + encodeURIComponent(style) + '"'
  );
  document.insertBefore(sspi, document.documentElement);
  sspi.getAttribute = function(name) {
    return document.documentElement.getAttribute(name);
  };

  style = ' \
    /* Tabs CTR*/ \
  	#TabsToolbar .tabbrowser-tabs:not([multibar]) .tabs-newtab-button, \
  	#TabsToolbar .tabbrowser-tabs:not([multibar]) .tabbrowser-tab { \
  	  margin-bottom: 0 !important; \
    } \
  ';
  style = style.replace(/\s+/g, " ")
     .replace(new RegExp("{TAB_HEIGHT}", "g"), TAB_HEIGHT)
     .replace(new RegExp("{TAB_MIN_WIDTH}", "g"), TAB_MIN_WIDTH)
     .replace(new RegExp("{TAB_MAX_WIDTH}", "g"), TAB_MAX_WIDTH);

  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
                      .getService(Components.interfaces.nsIStyleSheetService);
  var ios = Components.classes["@mozilla.org/network/io-service;1"]
                      .getService(Components.interfaces.nsIIOService);
  var uri = ios.newURI("data:text/css," + encodeURIComponent(style), null, null);
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

  function multirowtabH() {
    var H;
    try {
      var tabs = gBrowser.tabContainer.childNodes;
      for (let i = 0, len = tabs.length; i < len; i++){
        if (!tabs[i].hasAttribute("hidden")) {
          var style = window.getComputedStyle(tabs[i], null);
          H = tabs[i].boxObject.height +
              parseInt(style.marginTop, 10) + parseInt(style.marginBottom , 10)
          break;
        }
      }
    } catch(e) {}
    return H;
  }

  TabView.hide = function() {
        if (!this.isVisible()) {
        return;
    }
    this._window.UI.exit();
    setTabWidthAutomatically({type:"resize"});
    setTimeout(function(){setTabWidthAutomatically({type:"resize"});}, 250);
  }

  //D&Dの調整
  var func = gBrowser.tabContainer._setEffectAllowedForDataTransfer.toString();
  func = func.replace(
    'event.screenX <= sourceNode.boxObject.screenX + sourceNode.boxObject.width',
    ' \
    $& && \
    event.screenY > sourceNode.boxObject.screenY && \
    event.screenY < sourceNode.boxObject.screenY + sourceNode.boxObject.height \
    '
  );
  eval("gBrowser.tabContainer._setEffectAllowedForDataTransfer = " + func);

  gBrowser.tabContainer.lastVisibleTab = function() {
    var tabs = this.childNodes;
    for (let i = tabs.length - 1; i >= 0; i--){
      if (!tabs[i].hasAttribute("hidden"))
        return i;
    }
    return -1;
  };

  gBrowser.tabContainer.clearDropIndicator = function() {
    var tabs = this.childNodes;
    for (let i = 0, len = tabs.length; i < len; i++){
      let tab_s= tabs[i].style;
      tab_s.removeProperty("border-left-color");
      tab_s.removeProperty("border-right-color");
    }
  };
  gBrowser.tabContainer.addEventListener("drop", gBrowser.tabContainer.clearDropIndicator, true);
  gBrowser.tabContainer.addEventListener("dragleave", gBrowser.tabContainer.clearDropIndicator, true);

  gBrowser.tabContainer._onDragOver = function(event) {
    this.MultiRowTabonDragOver(event);

    //event.stopPropagation();
    this.clearDropIndicator();
    var newIndex = this._getDropIndex(event);
    if (newIndex == null) {
      return;
    }
    let tab = document.evaluate(
                'ancestor-or-self::*[local-name()="tab"][1]',
                event.originalTarget,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
    if (tab &&
        (event.type == "drop" || event.type == "dragover") &&
        this._setEffectAllowedForDataTransfer(event) == "link") {
      let boxObject = tab.boxObject;
      if (event.screenX >= boxObject.screenX + boxObject.width * .25 &&
          event.screenX <= boxObject.screenX + boxObject.width * .75) {
        return;
      }
    }
    if (newIndex < this.childNodes.length) {
      this.childNodes[newIndex].style.setProperty("border-left-color","red","important");
    } else {
      newIndex = gBrowser.tabContainer.lastVisibleTab();
      if (newIndex >= 0)
        this.childNodes[newIndex].style.setProperty("border-right-color","red","important");
    }
  };

  gBrowser.tabContainer.addEventListener("dragover", gBrowser.tabContainer._onDragOver, true);

  gBrowser.tabContainer._getDragTargetTab = function(event) {
    let tab = document.evaluate(
                'ancestor-or-self::*[local-name()="tab"][1]',
                event.originalTarget,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
     if (tab &&
         (event.type == "drop" || event.type == "dragover") &&
         this._setEffectAllowedForDataTransfer(event) == "link") {
       let boxObject = tab.boxObject;
       if (event.screenX < boxObject.screenX + boxObject.width * .25 ||
           event.screenX > boxObject.screenX + boxObject.width * .75) {
         return null;
       }
     }
     return tab;
  };

gBrowser.tabContainer._handleTabDrag = function(event) {
  let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
  if (!draggedTab.parentNode) // tab was closed during drag
    return;
  event.preventDefault();
  if (this._updateTabDetachState(event))
    return;

  let ltr = (window.getComputedStyle(this).direction == "ltr");
  let ind = this._tabDropIndicator;
  let newIndex = this._getDropIndex(event, draggedTab);
  let tabAtNewIndex = this.childNodes[newIndex > draggedTab._tPos ?
                                      newIndex-1 : newIndex];
  if (tabAtNewIndex.pinned != draggedTab.pinned)
    this._positionDropIndicator(ind, newIndex, 0, ltr);
  else
    ind.collapsed = true;

  // keep the dragged tab visually within the region of like tabs
  let tabs = this.tabbrowser.visibleTabs;
  let numPinned = this.tabbrowser._numPinnedTabs;
  let leftmostTab = draggedTab.pinned ? tabs[0] : tabs[numPinned];
  let rightmostTab = draggedTab.pinned ? tabs[numPinned-1] : tabs[tabs.length-1];
  let tabWidth = draggedTab.getBoundingClientRect().width;
  if (!ltr)
    [leftmostTab, rightmostTab] = [rightmostTab, leftmostTab];
  let left = leftmostTab.boxObject.screenX;
  let right = rightmostTab.boxObject.screenX + tabWidth;
  let transformX = event.clientX - draggedTab.__dragStartX;
  if (!draggedTab.pinned)
    transformX += this.mTabstrip.scrollPosition;
  let tabX = draggedTab.boxObject.screenX + transformX;
  draggedTab.__dragDistX = transformX;
  if (tabX < left)
    transformX += left - tabX;
  // prevent unintended overflow, especially in RTL mode
  else if (tabX + tabWidth > right)
    transformX += right - tabX - tabWidth - (ltr ? 0 : 1);

  if (!ltr)
    tabWidth *= -1;
  tabs.forEach(function(tab) {
    /*
    if (tab == draggedTab)
      tab.style.MozTransform = "translate(" + transformX + "px)";
    else if (tab.pinned != draggedTab.pinned)
      return;
    else if (tab._tPos < draggedTab._tPos && tab._tPos >= newIndex)
      tab.style.MozTransform = "translate(" + tabWidth + "px)";
    else if (tab._tPos > draggedTab._tPos && tab._tPos < newIndex)
      tab.style.MozTransform = "translate(" + -tabWidth + "px)";
    else
    */
      tab.style.MozTransform = "";
  });
}


 gBrowser.tabContainer._getDropIndex = function(aEvent) {
    var tabs = this.childNodes;
    if (window.getComputedStyle(this, null).direction == "ltr") {
      for (let i = 0; i < tabs.length; i++){
        if (aEvent.screenY > tabs[i].boxObject.screenY &&
            aEvent.screenY < tabs[i].boxObject.screenY + tabs[i].boxObject.height) {
          if (aEvent.screenX > tabs[i].boxObject.screenX &&
              aEvent.screenX < tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2)
            return i;
          if (aEvent.screenX > tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2 &&
              aEvent.screenX < tabs[i].boxObject.screenX + tabs[i].boxObject.width)
            return i + 1;
        }
      }
    } else {
      for (let i = 0; i < tabs.length; i++){
        if (aEvent.screenY > tabs[i].boxObject.screenY &&
            aEvent.screenY < tabs[i].boxObject.screenY + tabs[i].boxObject.height) {
          if (aEvent.screenX < tabs[i].boxObject.screenX + tabs[i].boxObject.width &&
              aEvent.screenX > tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2)
            return i;
          if (aEvent.screenX < tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2 &&
              aEvent.screenX > tabs[i].boxObject.screenX)
            return i + 1;
        }
      }
    }
    return tabs.length;
  };

 gBrowser.tabContainer.MultiRowTabtimer = null;
 gBrowser.tabContainer.MultiRowTabscroll = true;

 gBrowser.tabContainer.MultiRowTabonDragOver = function(event) {
    var tabs = this.childNodes;
    if (tabs.length < 1)
      return false;
    if (!this.MultiRowTabscroll)
      return false;
    this.MultiRowTabscroll = false;
    this.MultiRowTabtimer = setTimeout(function(self){self.MultiRowTabscroll = true;}, 400, this);

    var y;
    if (this.boxObject.screenY + 10 > event.screenY) {
      y = this.boxObject.screenY - 20;
    } else if (this.boxObject.screenY + this.boxObject.height - 13
     < event.screenY) {
      y = this.boxObject.screenY + this.boxObject.height + 20;
    } else {
      return false;
    }

    var tab = null;
    for (var i = 0; i < tabs.length; i++) {
      if (y > tabs[i].boxObject.screenY &&
          y < tabs[i].boxObject.screenY + tabs[i].boxObject.height){
        tab = tabs[i];
        break;
      }
    }
    if (!tab)
    if (y < tabs[0].boxObject.screenY){
      tab = tabs[0]
    } else if (y > tabs[tabs.length - 1].boxObject.screenY
            + tabs[tabs.length - 1].boxObject.height){
      tab = tabs[tabs.length - 1]
    }
    try{
      var mShell = Components.classes["@mozilla.org/inspector/flasher;1"]
               .createInstance(Components.interfaces.inIFlasher);
      mShell.scrollElementIntoView(tab);
      return true;
    }catch(e){}
  };

  gBrowser.tabContainer.MultiRowTabsScroll = function(event) {
    var tab = null
    let containerTop = gBrowser.tabContainer.boxObject.screenY;
    let containerBottom = containerTop + gBrowser.tabContainer.boxObject.height;
    if (event.detail > 0) {
      for (let i=0, len=gBrowser.tabs.length; i<len; i++) {
        tab = gBrowser.tabs.item(i);
        let tabBottom = tab.boxObject.screenY + tab.boxObject.height;
        if (tabBottom > containerBottom) {
          break;
        }
      }
    } else {
      for (let i=gBrowser.tabs.length - 1; i > -1; i--) {
        tab = gBrowser.tabs.item(i);
        let tabTop = tab.boxObject.screenY;
        if (tabTop < containerTop) {
          break;
        }
      }
    }
    if (tab)
    try {
      var mShell = Components.classes["@mozilla.org/inspector/flasher;1"]
               .createInstance(Components.interfaces.inIFlasher);
      mShell.scrollElementIntoView(tab);
    }catch(e){}
  }

  document.getElementById("TabsToolbar").addEventListener("DOMMouseScroll", gBrowser.tabContainer.MultiRowTabsScroll, true);


//ここからはタブ幅自動調整
  gBrowser.tabContainer._positionPinnedTabs = function() {
    this.mTabstrip.ensureElementIsVisible(this.selectedItem, false);
    return;
  }
  gBrowser.tabContainer._handleTabSelect = function(aSmoothScroll) {
      setTabWidthAutomatically();
      setTimeout(function(self) {
        self.mTabstrip.ensureElementIsVisible(self.selectedItem, aSmoothScroll);
      }, 100, this);
  }
  //タブバー高調整
  var arrowscrollbox = gBrowser.tabContainer.mTabstrip;
  var scrollbox = document.getAnonymousElementByAttribute(arrowscrollbox, "class", "arrowscrollbox-scrollbox");

  window.setTabWidthAutomatically =function(event) {

    gBrowser.tabContainer.style.removeProperty("-moz-padding-start");
    gBrowser.tabContainer.style.removeProperty("-moz-margin-start");

    //delay to adust height for CTR
    setTimeout(function() {
      var y = 0, numrows = 0;
      for (let i=0, len=gBrowser.tabs.length; i<len; i++) {
        let aTab = gBrowser.tabs.item(i);
        if (!aTab.getAttribute("hidden")) {
          aTab.style.removeProperty("-moz-margin-start");
          if (y + 5 < aTab.boxObject.screenY) {
            y = aTab.boxObject.screenY;
            numrows++;
          }
        }
      }

      var er = scrollbox.scrollHeight % multirowtabH();
      if (numrows > 1) {
        arrowscrollbox.style.setProperty("height", (numrows) * multirowtabH() + er + "px", "");
        gBrowser.tabContainer.style.setProperty("max-height", TABBROWSERTABS_MAXROWS * multirowtabH() + er + "px", "");
      } else {
        arrowscrollbox.style.removeProperty("height");
        gBrowser.tabContainer.style.removeProperty("max-height");
      }

    }, 250);
  };

  //以下はタブバー高調整のためのイベント登録
  window.addEventListener("resize", function(event) {
    if(event.originalTarget == window) {
      if (timer)
        clearTimeout(timer);
      setTimeout(function(event){setTabWidthAutomatically(event);}, 0, {type:"resize"});
      timer = setTimeout(function(event){ensureVisibleElement(gBrowser.selectedTab);}, 250);
   }
  }, true);

  function ensureVisibleElement(aTab){
    var selectedTab = gBrowser.selectedTab || aTab
    try{
      var mShell = Components.classes["@mozilla.org/inspector/flasher;1"]
               .createInstance(Components.interfaces.inIFlasher);
      mShell.scrollElementIntoView(selectedTab);
    }catch(e){}
  }

  //初回起動時ダミーイベント
  function forceResize(delay) {
    if (timer2)
      clearTimeout(timer2);
    timer2 = setTimeout(function(event){
      setTabWidthAutomatically(event);
      ensureVisibleElement();
    }, delay, {type:"resize"});
  }
  forceResize(0);
  forceResize(800);


  gBrowser.tabContainer.addEventListener('TabSelect', ensureVisibleElement, false);
  gBrowser.tabContainer.addEventListener('TabClose', setTabWidthAutomatically, false);
  gBrowser.tabContainer.addEventListener('TabOpen', setTabWidthAutomatically, true);
  gBrowser.tabContainer.addEventListener("TabPinned", setTabWidthAutomatically, false);
  gBrowser.tabContainer.addEventListener("TabUnpinned", setTabWidthAutomatically, false);
  window.addEventListener("aftercustomization", function(){forceResize(0);}, false);
}
