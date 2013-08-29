var speed = 1.0;
var comp = me.hoveringtext;
var bMouseIn = false;

var jsonObjects = [];

if (!comp)
    print("This Entity does not have HoveringText component");
else
    GetHoveringTextComponent();

frame.Updated.connect(Update);
scene.ComponentAdded.connect(CheckComponent);
me.Action("MouseHoverIn").Triggered.connect(MouseIn);
me.Action("MouseHoverOut").Triggered.connect(MouseOut);
// me.Action("DoRaycast").Triggered.connect(doRaycast);
me.Action("onClickedWeb").Triggered.connect(onClickedWeb);

// And then initialize inputmapper to grab left mouse
var inputmapper = me.GetOrCreateComponent("InputMapper", 2, false);
inputmapper.contextPriority = 100;
inputmapper.takeMouseEventsOverQt = true;
inputmapper.modifiersEnabled = false;
inputmapper.executionType = 1; // Execute actions locally
// Connect left mouse button
var inputContext = inputmapper.GetInputContext();

// GITHUB
engine.ImportExtension("qt.core"); //enables you to use qt 
// Initialize data object
var data = {};

sceneinteract.EntityClicked.connect(onClicked);

// RequestAsset("https://api.github.com/repos/realXtend/naali/issues?", "Binary");  // Github json
// RequestAsset("https://dl.dropboxusercontent.com/u/60485425/issues?", "Binary"); // Dropbox github json
// RequestAsset("http://huhkiainen:huhhuh33@api.supertweet.net/1.1/search/tweets.json?q=%22%20%22&geocode=65.016667,25.466667,15mi?", "Binary"); // Dropbox json
RequestAsset("https://dl.dropboxusercontent.com/u/60485425/Playsign/GitHub/wex-experiments/webrocket-twitter/tweets.json", "Binary"); // Dropbox twitter json

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

    // var jsonObjects = JSON.parse(ts.readAll()); // Github
    var jsonfile = JSON.parse(ts.readAll()); // Twitter
    jsonObjects = jsonfile.statuses

    for (var i in jsonObjects) {
        var obj = jsonObjects[i];
        // print(obj.updated_at);

        var person = loadPerson();
        print("person entity");
        print(person);

        // person.hoveringtext.text = obj.updated_at + " \n " + obj.title; // Github
        person.hoveringtext.text = "@" + obj.user.screen_name + ": " + obj.text; // Twitter
        person.placeable.SetPosition(new float3(i, 0.232, 0));
        // Webrocket doesn't support hoveringtext so add it to the dynamiccomponent also
        // person.dynamiccomponent.SetAttribute("text", obj.updated_at + " \n " + obj.title); // Github
        var screenNameAndTweet = "@" + obj.user.screen_name + ": " + obj.text;
        person.dynamiccomponent.SetAttribute("tooltipText", screenNameAndTweet); // Twitter
        person.dynamiccomponent.SetAttribute("screenNameAndTweet", screenNameAndTweet);
        person.dynamiccomponent.SetAttribute("name", obj.user.name);
        person.dynamiccomponent.SetAttribute("screen_name", obj.user.screen_name);
        person.dynamiccomponent.SetAttribute("location", obj.user.location);
        person.dynamiccomponent.SetAttribute("description", obj.user.description);


        // print("obj.updated_at " + obj.updated_at);
        // print("obj.title " + obj.title);

        // person.hoveringtext.SetTextColor(new Color());
        // person.hoveringtext.SetPosition(new float3(0,5,0));

        // Max objs
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

function loadPerson() {
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

function onClickedWeb(entityId){
    var ent = scene.EntityById(entityId);
    onClicked(ent);
}

function onClicked(entity, button, result) {
    print("entity clicked: " + entity.id);
    var rotate = entity.dynamiccomponent.GetAttribute("rotate");
    if (rotate != null) {
        rotate = !rotate;
        entity.dynamiccomponent.SetAttribute("rotate", rotate);

        var text, location, description, text;

        if (rotate) {
            name = entity.dynamiccomponent.GetAttribute("name");
            location = entity.dynamiccomponent.GetAttribute("location");
            description = entity.dynamiccomponent.GetAttribute("description");
            text = "Name: " + name + "\nLocation: " + location + "\n" + description;
            entity.hoveringtext.text = text;
            text = "Name: " + name + "<br>Location: " + location + "<br>" + description;
            entity.dynamiccomponent.SetAttribute("tooltipText", text);
        } else {
            text = entity.dynamiccomponent.GetAttribute("screenNameAndTweet");
            entity.hoveringtext.text = text;
            entity.dynamiccomponent.SetAttribute("tooltipText", text);
        }
    }
}

// function doRaycast(originAndDirection) {
//     var originAndDirectionArray = originAndDirection.split(/, */);

//     var rayOrigin = new float3(originAndDirectionArray[0], originAndDirectionArray[1], originAndDirectionArray[2]);
//     var rayDirection = new float3(originAndDirectionArray[3], originAndDirectionArray[4], originAndDirectionArray[5]);

//     var newRay = Ray(rayOrigin, rayDirection);x

//     var result = scene.ogre.Raycast(newRay, 1);
//     if (result.entity === null) {
//         print("Raycast result was null");
//         return;
//     }

//     print("entity name: " + result.entity.dynamiccomponent.GetAttribute("name"));
//     if (result.entity != null) {
//         print("result.entity.dynamiccomponent.GetAttribute(type): " + result.entity.dynamiccomponent.GetAttribute("type"));
//         onClicked(result.entity);
//     }
// }

function OnScriptDestroyed() {
    var persons = scene.FindEntities("Person");
    for (var i = persons.length - 1; i >= 0; --i) {
        scene.RemoveEntity(persons[i].id);
    }
}