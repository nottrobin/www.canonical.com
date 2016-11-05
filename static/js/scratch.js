

//Provides basic templating for strings
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

YUI().use('node', 'cookie', 'event-resize', 'event', 'jsonp', 'json-parse', function(Y) {

  core.setupHtmlClass = function() {
    Y.one('html').removeClass('no-js').addClass('yes-js');
  }

  core.setupAdditionalInfo = function() {
    Y.one('.find-out-more').setStyle('cursor', 'pointer').on('click',function(e) {
        this.toggleClass('active');
        Y.one('.external-link-list').toggleClass('active');
    });
  };

  core.cookiePolicy = function() {
    function open() {
      Y.one('body').prepend('<div class="cookie-policy"><div class="wrapper"><a href="?cp=close" class="link-cta">Close</a><p>We use cookies to improve your experience. By your continued use of this site you accept such use. To change your settings please <a href="/privacy-policy#cookies">see our policy</a>.</p></div></div>');
      Y.one('.cookie-policy .link-cta').on('click',function(e){
        e.preventDefault();
        close();
      });
    }
    function close() {
      Y.one('.cookie-policy').setStyle('display','none');
      setCookie();
    }
    function setCookie() {
      Y.Cookie.set("_cookies_accepted", "true", { expires: new Date("January 12, 2025") });
    }
    if(Y.Cookie.get("_cookies_accepted") != 'true'){
      open();
    }
  };

  core.tabbedContent = function() {
    Y.all('.tabbed-content .accordion-button').on('click', function(e){
      e.preventDefault();
      e.target.get('parentNode').toggleClass('open');
    });
  };

  core.rssLoader = {
    "outputFeed" : function(el, jobType) {
      var element = document.getElementById(el);
      if (jobType === undefined) {
        jobType = '';
      } else {
        jobType = ' ' + jobType;
      }
      return function(result){
        if (!result.error){
          var output = '';
          var thefeeds = result.feed.entries;
          var spinner = document.getElementById('spinner');
          if(spinner !== null){
            spinner.style.display = 'none';
          }
          if(element.className.indexOf('with-total') != -1){
            output += '<li>We currently have '+thefeeds.length+jobType+' vacancies';
          }
          for (var i = 0; i < thefeeds.length; i++){
            output += '<li><a href="{0}">{1} &rsaquo;</a></li>'.format(thefeeds[i].link, thefeeds[i].title);
          }
          element.innerHTML = element.innerHTML + output;
          return output;
        }
      }
    },

    "getFeed" : function(url, numItems, el, jobType){
      var feedpointer = new google.feeds.Feed(url); //Google Feed API method
      if(numItems != null){
        feedpointer.setNumEntries(numItems); //Google Feed API method
      }else{
        feedpointer.setNumEntries(250); //Google Feed API method
      }
      feedpointer.load(this.outputFeed(el, jobType)); //Google Feed API method
    }
  };

  core.svgFallback = function() {
    if (!Modernizr.svg || !Modernizr.backgroundsize) {
      Y.all("img[src$='.svg']").each(function(node) {
        node.setAttribute("src", node.getAttribute('src').toString().match(/.*\/(.+?)\./)[0]+'png');
      });
    }
  };

  core.renderJSON = function (response, id) {
    if (id == undefined) {
        id = '#dynamic-logos';
    }
    var JSON = response;
    var numberPartners = JSON.length;
    var numberToDisplay = numberPartners < 10 ? numberPartners : 10;

    for (var i = 0; i < numberToDisplay; i++) {
      Y.one(id).append(Y.Node.create('<li><img onload="this.style.opacity=\'1\';" src="'+JSON[i].logo+'" alt="'+JSON[i].name+'"></li>'));
    }
  };

  core.loadPartners = function (params, elementID, feedName) {
    if (typeof feedName === 'undefined') {
      feedName = 'partners';
    }

    var partnersAPI = "http://partners.ubuntu.com/" + feedName + ".json";
    var url = partnersAPI + params + "&callback={callback}";
    var callback = function(response) {
        return core.renderJSON(response, elementID);
    }
    Y.jsonp(url, callback);
  };

  core.resizeListener = function() {
    Y.on('windowresize', function(e) {
      core.redrawGlobal();
    });
    core.globalInit();
  };

  core.createToggle = function(button) {
    if (bottonElement = Y.one(button)) {
      Y.one(bottonElement).setStyle('cursor', 'pointer').on('click',function(e) {
        this.toggleClass('active');
        this.next('div').toggleClass('active');
      });
    }
  };

  core.globalInit= function() {
    if (document.documentElement.clientWidth < 768) {
      core.globalPrepend = '.global-footer-wrapper';
      core.extendGlobalNav();
      core.setupAdditionalInfo();
      Y.one('.nav-global-wrapper').insert('<h2 class="toggle-menu__button">Ubuntu websites</h2>','before');
      core.createToggle('#nav-global h2');
    } else if (document.documentElement.clientWidth >= 768) {
      core.globalPrepend = 'body';
      core.extendGlobalNav();
      Y.all('#additional-info h2').setStyle('cursor', 'default');
    }
  };

  core.redrawGlobal = function() {
    var globalNav = Y.one("#nav-global");
    if (document.documentElement.clientWidth < 768 && core.globalPrepend != '.footer') {
      core.globalPrepend = '.global-footer-wrapper';
      if (globalNav) {
        globalNav.remove();
        core.extendGlobalNav();
        core.setupAdditionalInfo();
        Y.one('.nav-global-wrapper').insert('<h2 class="toggle-menu__button">Ubuntu websites</h2>','before');
        core.createToggle('#nav-global h2');
      }
    } else if (document.documentElement.clientWidth >= 768 && core.globalPrepend != 'body') {
      core.globalPrepend = 'body';
      if (globalNav) {
        globalNav.remove();
        core.extendGlobalNav();
        Y.all('#additional-info h2').setStyle('cursor', 'default');
      }
    }
  };

  core.homeAnimation = function() {
    if(Y.one('body').hasClass('home')){
      var anim = Y.one('.animation');
      if(anim != null) {
        anim.addClass('run');
      }
    }
  };

  core.extendGlobalNav = function() {
    core.setupGlobalNav();
    if (navGlobal = Y.one('#nav-global')) {
      navGlobal.addClass('toggle-menu');
    }

    if (navWrapper = Y.one('#nav-global .nav-global-wrapper')) {
      navWrapper.addClass('toggle-menu__content');
    }
  }

  core.setupAccordion = function() {
    Y.all('.row-project li').each(function(node) {
      node.one('h3').append('<span></span>');
      node.one('a').on('click',function(e) {
        e.preventDefault();
        this.toggleClass('active');
        this.next('div').toggleClass('active');
      });
    });
  };

  core.setupAccordion();
  core.cookiePolicy();
  core.setupHtmlClass();
  core.tabbedContent();
  core.homeAnimation();
  core.svgFallback();
  core.resizeListener();
});

core.rssLoader = function(feedurl, jobType, htmlelement, joblimit) {
  $.getFeed({
    url: feedurl,
    success: function(feed) {
      var html = '';
      /* correct grammar for 0 and 1 on total list item */
      if (feed.items.length === 0) {
        html += '<li class="total">Sorry, we currently have no ' + jobType + ' vacancies';
      } else if (feed.items.length === 1) {
        html += '<li class="total">We currently have ' + feed.items.length + ' ' + jobType + ' vacancy';
      } else {
        html += '<li class="total">We currently have ' + feed.items.length + ' ' + jobType + ' vacancies';
      }

      /* set a default limit for number of jobs returned */
      if (joblimit == undefined) {
        joblimit = 5;
      }

      for(var i = 0; i < feed.items.length && i < joblimit; i++) {
        var item = feed.items[i];
        html += "<li><a href='" + item.link + "'>" + item.title + "&nbsp;&rsaquo;</a></li>";
      }

      /* hide the gif spinner */
      $('.spinner').hide();
      $(htmlelement).append(html);
    }
  })
};

core.getInsightsFeed = function(url, maxItems, htmlID, type) {
  $.getFeed({
    url: url,
    success: function(feed) {
      var html = "";
      for(var i = 0; i < feed.items.length && i < maxItems; i++) {
        var item = feed.items[i];
        if (type == "resource") {
          html += "<li><a href='{0}'>{1}</a><p class='note'>{2}</p></li>".format(item.link, item.title, item.category);
        } else {
          html += "<li><a href='{0}'>{1}</a><p class='note'><time pubdate datetime='{2}'>{3}</time></p></li>".format(item.link, item.title, item.updated, item.nicedate);
        }
      }

      if ($(htmlID)) {
        $(htmlID).append(html);
      }
    }
  });
}
