/* -*- js-indent-level: 8 -*- */

var do_dom = true;

// MUTATIONOBSERVER
// create an observer instance
var observer = new MutationObserver(function(mutations) {
	var start = Date.now();
	mutations.forEach(function(mutation) {
		// console.log(mutation.type);
	});
	var end = Date.now();
	var elapsed = end - start; // time in milliseconds

	//console.log("observer elapsed: " + elapsed / 1000 + " seconds");
        return elapsed;
});

function purejs_callback(mutations) {
	var start = Date.now();
	mutations.forEach(function(mutation) {
		// console.log(mutation.type);
	});
	var end = Date.now();
	var elapsed = end - start; // time in milliseconds

	//console.log("observer elapsed: " + elapsed / 1000 + " seconds");
        return elapsed;
}

// configuration of the observer:
var config = {
	attributes: true,
	childList: true,
	characterData: true
};


// CREATE AND MODIFY
var s = document.createElement("scene");
document.body.appendChild(s);
s.setAttribute("id", "testScene");
var sliderValue = $( "#spinner" ).spinner().spinner( "value" ) ;

var purejs_ents = null;

var createElements = function() {
	sliderValue = $( "#spinner" ).spinner().spinner( "value" );
	var start = Date.now();
        if (!do_dom)
                purejs_ents = []
	for (var i = 0; i < sliderValue; i++) {
                if (do_dom) {
		        e = document.createElement("entity");
		        e.setAttribute("id", i);
		        s.appendChild(e);
		        observer.observe(e, config);
                } else
                        purejs_ents.push({'id': i, callback: purejs_callback});
	}

	var end = Date.now();
	var elapsed = end - start; // time in milliseconds

	console.log("create elapsed: " + elapsed / 1000 + " seconds");
}

var purejs_modifications = 0;
var modifyElements = function() {
	var start = Date.now();

	scene = document.getElementById("testScene");
	if (do_dom && scene.children.length) {
                console.log("modifying dom elt");
		var children = scene.children;
		for (var i = 0; i < children.length; i++) {
			var element = children[i];
			element.setAttribute("id", parseInt(element.getAttribute("id")) + 1);
		}
	}

        if (purejs_ents) {
                for (var i = 0; i < purejs_ents.length; i++) {
                        var ent = purejs_ents[i];
                        set_ent_attribute(ent, "id", ent["id"] + 1);
                        purejs_modifications += 1;
                }
        }

	var end = Date.now();
	var elapsed = end - start; // time in milliseconds

	//console.log("modify elapsed: " + elapsed / 1000 + " seconds");
        return elapsed;
}

function set_ent_attribute(ent, attrname, val) {
        ent[attrname] = val;
}

/* compat snippet from
   https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame */
// (function() {
//     var requestAnimationFrame = window.requestAnimationFrame ||
//         window.mozRequestAnimationFrame ||
//         window.webkitRequestAnimationFrame ||
//         window.msRequestAnimationFrame;
//     window.requestAnimationFrame = requestAnimationFrame;
// })();

function startAnimation() {
    console.log("start anim");
    var framecount = 0;
    var prev_timestamp;
    function frameCallback(timestamp) {
        var elapsed = timestamp - prev_timestamp;
        prev_timestamp = timestamp;
        framecount++;
        window.requestAnimationFrame(frameCallback);
        var modify_elapsed = modifyElements();
        if (framecount % 60 == 0) {
            console.log("frametime=" + elapsed + ", modify elapsed=" + modify_elapsed);
        }
    }
    window.requestAnimationFrame(frameCallback);
}

// startAnimation();
