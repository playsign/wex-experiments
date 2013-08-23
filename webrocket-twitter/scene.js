var speed = 1.0;
var comp = me.hoveringtext;
var bMouseIn = false;

if (!comp)
    print("This Entity does not have HoveringText component");
else
    GetHoveringTextComponent();

frame.Updated.connect(Update);
scene.ComponentAdded.connect(CheckComponent);
me.Action("MouseHoverIn").Triggered.connect(MouseIn);
me.Action("MouseHoverOut").Triggered.connect(MouseOut);

// GITHUB
engine.ImportExtension("qt.core"); //enables you to use qt 
// Initialize data object
var data = {};

sceneinteract.EntityClicked.connect(onClicked);

// // Register raw input context
// this.data.InputContext = input.RegisterInputContextRaw("usingPhysicsInput",100);
// this.data.InputContext.



// RequestAsset("https://api.github.com/repos/realXtend/naali/issues?", "Binary");
RequestAsset("https://dl.dropboxusercontent.com/u/60485425/issues?", "Binary");


//Checking if EC_Hoveringtext component has added after EC_Script to Entity

function CheckComponent(entity, component, type) {
    if (component.typeName == "EC_HoveringText")
        GetHoveringTextComponent();
}

function GetHoveringTextComponent() {
    if (comp == null) {
        comp = me.hoveringtext;
        if (comp != null) {
            var mode = comp.updateMode;
            mode.value = 2;
            comp.updateMode = mode;
        }
    }
}

function Update(frametime) {
    if (comp == null)
        return;

    comp.overlayAlpha = Math.max(0.0, Math.min(1.0, comp.overlayAlpha + frametime * speed * (bMouseIn ? 1 : -1)));
}

function MouseIn() {
    bMouseIn = true;
    print("Tooltip: Mouse IN");
}

function MouseOut() {
    bMouseIn = false;
    print("Tooltip: Mouse OUT");
}

function pathForAsset(assetref) {
    return asset.GetAsset(assetref).DiskSource();
}

// GITHUB

function ForgetAsset(assetRef) {
    // Make AssetAPI forget this asset if already loaded in
    // to the system and remove the disk cache entry.
    asset.ForgetAsset(assetRef, true);
}

// Downloading assets

function RequestAsset(ref, type) {
    this.ForgetAsset(ref);

    print("Requesting:", ref);
    var transfer = asset.RequestAsset(ref, type);
    transfer.Downloaded.connect(this.DownloadReady);
    transfer.Succeeded.connect(this.AssetReady);
}

function DownloadReady( /* IAssetTransfer* */ transfer) {
    var data = transfer.RawData();
    // print(data);
  

    print("Download ready");
    // print("  >> Source    :", transfer.SourceUrl());
    // print("  >> Type      :", transfer.AssetType());
    // print("  >> Data len  :", data.size(), "\n");
}

function AssetReady( /* IAssetPtr* */ assetvar) {
    var data = assetvar.GetRawData();
    print("Asset ready");



  var ts = new QTextStream(data, QIODevice.ReadOnly);

    var issues = JSON.parse(ts.readAll());
    // print(issues);
    for (var i in issues) {
        var issue = issues[i];
        // print(issue.updated_at);

        var issueBox = loadBox();
        print("issueBox entity");
        print(issueBox);

        issueBox.hoveringtext.text = issue.updated_at + " \n " + issue.title;
        issueBox.placeable.SetPosition(new float3(i , 0.232, 0));
        print("issue.updated_at " + issue.updated_at);
        print("issue.title " + issue.title);

        // issueBox.hoveringtext.SetTextColor(new Color());
        // issueBox.hoveringtext.SetPosition(new float3(0,5,0));

        // Max issues
        if (i == 5) {
            break;
        }
    }

    
    // print("  >> Class ptr :", assetvar);
    // print("  >> Type      :", assetvar.Type());
    // print("  >> Name      :", assetvar.Name());
    // print("  >> Data len  :", data.size(), "\n");
}



print("[ScenePartManager] Loading script...");

var part2ents = []; //a map of part.name -> ents in that part

function print(s) {
    console.LogInfo(s);
}

function loadBox() {
    var parts = scene.EntitiesWithComponent("EC_DynamicComponent", "ScenePart");
    print("parts");
    print(parts);

    var partfile;
    var part;

    for (var i = 0; i < parts.length; i++) {
        // print(i + ":" + parts[i]);

        var placeholder = parts[i];
        partfile = placeholder.dynamiccomponent.GetAttribute("sceneref");
        print("partfile");
        print(partfile);
        part = loadPart(placeholder, partfile);
    }

    return part;
}

function pathForAsset(assetref) {

    var asse = asset.GetAsset(assetref);
    if (asse === null) {
        print("XXX asset not found:" + assetref);
        return;
    } else
        print("XXX GetAsset worked");
    return asse.DiskSource();
}

function loadPart(placeholder, partfile) {
    // print(placeholder + ":" + partfile);

    var ents = scene.LoadSceneXML(pathForAsset(partfile), false, false, 2); //, changetype);
    // var ents = scene.LoadSceneXML(partfile, false, false, 2); //, changetype);

    // var ents = partfile;
    var ent;
    for (var i = 0; i < ents.length; i++) {
        ent = ents[i];
        if (ent.placeable) {
            ent.placeable.SetParent(placeholder, false);
            ent.SetTemporary(true);
        }
    }
    part2ents[placeholder.name] = ents;

    return ent;
}

function onClicked(entity, button, result) {
    print("entity clicked: " + entity.id);
    entity.dynamiccomponent.SetAttribute("rotate", !entity.dynamiccomponent.GetAttribute("rotate"));
}


// loadBox();

// GITHUB
// RequestAsset("https://api.github.com/repos/realXtend/naali/issues?", "Binary"); 

// CreateBox();