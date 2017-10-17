// content.js
// Has access to the current page.
// Talks to the background.js if it needs to do anything crazy
// A js file that runs in the context of webpages
// Runs immediately when you visit a page allow in the manifest
// under content_scripts > matches


// BVH: This is a bit of a hack
var sheet = document.styleSheets[0];
sheet.insertRule('.dimmed:after {content: " "; z-index: 10; display: block; position: absolute; height: 100%; top: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.8);}', sheet.cssRules.length);
sheet.insertRule('.dimmed {position: relative;}', sheet.cssRules.length);

// BVH: this works but you will probably need to reload it, since facebook does infinite scrolling
var posts = document.getElementsByClassName("_5jmm _5pat _3lb4 o_9kam8ma7g");
posts[0].className += ' dimmed';
