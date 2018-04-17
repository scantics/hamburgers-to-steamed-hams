function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
    var text = textNode.wholeText;
    if(text.search(/hamburger/i) >= 0 // steamed hams
        || text.search(/incredible experience/i) >= 0 // unforgettable luncheon
        || text.search(/fast food/i) >= 0 // my own cooking 
        || text.search(/(Krusty|big mac|whopper)/i) >= 0 // patented skinnerburgers
        || text.search(/(kitchen|stove) fire/i) >= 0 // aurora borealis
        || text.search(/stretching/i) >= 0 // isometric exercise
        || text.search(/a good man/i) >= 0 // steams a good ham
        || text.search(/I made it/i) >= 0 // I made it, despite your directions
        || text.search(/bigger/i) >= 0 // steamier
        || text.search(/brilliant/i) >= 0) { // delightfully devilish
        textNode.nodeValue = replaceText(textNode.nodeValue);
    }
}

function replaceText(v)
{
    // Apply regional dialect.
    v = v.replace(/\bHamburger(s)?\b/g, "Steamed ham$1");
    v = v.replace(/\bhamburger(s)?\b/g, "steamed ham$1");
    v = v.replace(/\bincredible experience(s)?\b/g, "unforgettable luncheon$1");
    v = v.replace(/\bIncredible experience(s)?\b/g, "Unforgettable luncheon$1");
    v = v.replace(/\bIncredible Experience(s)?\b/g, "Unforgettable Luncheon$1");
    v = v.replace(/\b(B|b)ig (M|m)ac(s)?\b/g, "Patented Skinnerburger$3");
    v = v.replace(/\b(W|w)hopper(s)?\b/g, "Patented Skinnerburger$2");
    v = v.replace(/\b(K|k)rusty( )?(B|b)urger(s)?\b/g, "Patented Skinnerburger$4");
    v = v.replace(/\bfast food(s)?\b/g, "my own cooking");
    v = v.replace(/\bFast (F|f)ood(s)?\b/g, "My own cooking");
    v = v.replace(/\bstretching\b/g, "isometric exercise");
    v = v.replace(/\bhe's a good man\b/g, "he steams a good ham");
    v = v.replace(/\bwas a good man\b/g, "steamed a good ham");
    v = v.replace(/\bbigger\b/g, "steamier");
    v = v.replace(/\bBigger\b/g, "Steamier");
    v = v.replace(/\b(brilliant|strategic)\b/g, "delightfully devilish");

    return v;
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType === 3) {
                // Replace the text for text nodes
                handleText(mutation.addedNodes[i]);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(mutation.addedNodes[i]);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
