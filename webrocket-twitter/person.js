// engine.ImportExtension("qt.core");
// engine.ImportExtension("qt.gui");

// console.LogInfo("testttttttttttttttttttttttttt");

frame.Updated.connect(Update);

// var rotate = false;

// var test = true;
// me.hoveringtext.text = "TEST";


function Update(frametime) {
	if (me.dynamiccomponent.GetAttribute("rotate")) {
		// if (comp == null)
		//     return;

		// comp.overlayAlpha = Math.max(0.0, Math.min(1.0, comp.overlayAlpha + frametime * speed * (bMouseIn ? 1 : -1)));

		// me.placeable.SetPosition(new float3(5, -102.232, 0));
		var transform = me.placeable.transform;
		transform.rot.y  =  (100 * frametime + transform.rot.y) % 360;
		me.placeable.transform = transform;
		// me.placeable.SetRotation(me.placeable.)
	}
}