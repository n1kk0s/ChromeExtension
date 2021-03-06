// content.js

var storyContainerClasses = ["_5jmm", "_5pcr"];

// insert the 'dimmed' css rule into the stylesheet
var sheet = document.styleSheets[0];
sheet.insertRule('.dimmed:after {content: " "; z-index: 10; display: block; position: absolute; height: 100%; top: 0; left: 0; right: 0; background: rgba(255, 255, 255, 1); }', sheet.cssRules.length);
sheet.insertRule('.dimmed {position: relative;}', sheet.cssRules.length);
// overlay style sheet rules
sheet.insertRule('.overlayDiv {position: absolute; z-index: 11; height: 100%; top: 0; left: 0; right: 0; -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);}', sheet.cssRules.length);

var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('overlay.css');
(document.head||document.documentElement).appendChild(style);


var editedPosts = new Array();

// This is where we hardcode the URLS to ban....for now
var bannedDomains = ["https://www.facebook.com/TheOnion/", "https://www.facebook.com/infowars", "https://www.facebook.com/democraticmom", "prntly.com",
  "https://www.facebook.com/yournewswire", "https://www.facebook.com/clashdaily", "naturalnews.com", "https://www.facebook.com/thebabylonbee",
  "dailycaller.com", "palmerreport.com"];

var bannedReasons = ["Satire", "Conspiracy", "Incorrect", "Fake",
  "Fake", "Fake/Conspiracy", "Fake Science/Conspiracy", "Satire",
  "Clickbait/Bias", "Fake/Bias"];

function cleanNewsFeed(){
    chrome.storage.sync.get("clean_news_feed", function(data){
        if (data["clean_news_feed"]){

            // find all potential story posts
            _.each(storyContainerClasses, function(storyContainerClass){
                // filter the posts
                posts = document.getElementsByClassName(storyContainerClass);
                // loop through all of the story posts
                _.each(posts, function(post){
                    checkLinks(post);
                });
            });

        }
    });
}

function checkLinks(item){
    var links = item.getElementsByTagName("a");

    _.each(links, function(link) {
        var href = link.href.toLowerCase();
        var i = 0;
        _.each(bannedDomains, function(domain) {
            var itemClassName = item.className.toString();
            //console.log(href);

            if (href.indexOf(domain.toLowerCase()) != -1 && (itemClassName.indexOf('dimmed') == -1)) {

                // keep track of edited posts here
                if ((!editedPosts.includes(item.id)) && (item.id.toString().length > 5)) {

                  console.log(item.id + " " + href);

                    editedPosts.push(item.id);

                    item.className += ' dimmed';
                    // create an unique overlay with a link to the actual post
                    var div = document.createElement( 'div' );
                    div.className = 'overlayDiv';

                    // edit the string here to edit the overlay div HTML
                    div.innerHTML = '<center><h1 class="overlay">This article was flagged as ' + bannedReasons[i].toLowerCase() + '. It may be unreliable.</h1><h4 class="overlay">To read, click within this overlay. </a> </h4></center>';
                    // This is where we add the div.
                    item.appendChild(div);

                    div.onclick = function() {
                        var _div_ = div;
                        _div_.remove();

                        var _parent_ = item;
                        _parent_.classList.remove("dimmed");
                    };
                }
            }
          i = i + 1;
        });
    });
}

cleanNewsFeed(); // run once on page load

// debounce the function so it's not running constantly
var scrollPlugin = _.debounce(cleanNewsFeed, 300);
document.addEventListener("scroll", scrollPlugin);
