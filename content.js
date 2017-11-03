// content.js

var storyContainerClasses = ["_5jmm", "_5pcr"];

var sheet = document.styleSheets[0];
sheet.insertRule('.dimmed:after {content: " "; z-index: 10; display: block; position: absolute; height: 100%; top: 0; left: 0; right: 0; background: rgba(255, 255, 255, 0.75); }', sheet.cssRules.length);
sheet.insertRule('.dimmed {position: relative;}', sheet.cssRules.length);
// overlay style sheet rules
sheet.insertRule('#overlayDiv {position: absolute; z-index: 11; height: 100%; top: 0; left: 0; right: 0; -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);}', sheet.cssRules.length);
// make class one for the header
// make class one for the subheader

var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('overlay.css');
(document.head||document.documentElement).appendChild(style);


var editedPosts = new Array();

// This is where we hardcode the URLS to ban....for now
var bannedDomains = ["https://www.facebook.com/TheOnion/"];

function cleanNewsFeed(){
    chrome.storage.sync.get("clean_news_feed", function(data){
        if (data["clean_news_feed"]){
            // find all potential posts
            _.each(storyContainerClasses, function(storyContainerClass){
                posts = document.getElementsByClassName(storyContainerClass);
                _.each(posts, function(post){
                    checkLinks(post);
                });
            });
        }
    });
}


function checkLinks(item){
    var links = item.getElementsByTagName("a");
    _.each(links, function(link){
        var href = link.href.toLowerCase();
        _.each(bannedDomains, function(domain){
          var itemClassName = item.className.toString();
            if (href.indexOf(domain.toLowerCase()) != -1 && (itemClassName.indexOf('dimmed') == -1)){
                // edit the post here
                editedPosts[editedPosts.length] = (item.className += ' dimmed');
                // create an unique overlay with a link to the actual post
                var div = document.createElement( 'div' );
                div.id = 'overlayDiv';

                // get the ACTUAL link to the post
                var postLink = item.getElementsByClassName("_52c6")["0"].attributes[1].nodeValue;

                // edit the string here to edit the overlay div HTML
                div.innerHTML = '<center><h1 class="overlay">This article was flagged as satire. It may be unreliable.</h1><h4 class="overlay">To read, click <a href = "' + postLink +'"> here. </a> </h4></center>';
                // This is where we add the div.
                item.appendChild(div);

            }
        });
    });
}



cleanNewsFeed(); // run once on page load

// debounce the function so it's not running constantly
var scrollPlugin = _.debounce(cleanNewsFeed, 300);
document.addEventListener("scroll", scrollPlugin);
