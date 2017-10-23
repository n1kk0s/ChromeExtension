// content.js
// Has access to the current page.
// Talks to the background.js if it needs to do anything crazy
// A js file that runs in the context of webpages
// Runs immediately when you visit a page allow in the manifest
// under content_scripts > matches


var storyContainerClasses = ["_5jmm", "_5pcr"];

var sheet = document.styleSheets[0];
sheet.insertRule('.dimmed:after {content: " "; z-index: 10; display: block; position: absolute; height: 100%; top: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.8);}', sheet.cssRules.length);
sheet.insertRule('.dimmed {position: relative;}', sheet.cssRules.length);

var editedPosts = new Array();

// This is where we hardcode the URLS to ban
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
                console.log(itemClassName);
            }
        });
    });
}



cleanNewsFeed(); // run once on page load

// debounce the function so it's not running constantly
var scrollPlugin = _.debounce(cleanNewsFeed, 300);
document.addEventListener("scroll", scrollPlugin);
