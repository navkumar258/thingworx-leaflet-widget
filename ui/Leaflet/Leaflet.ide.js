TW.IDE.Widgets.Leaflet = function () {

  this.widgetIconUrl = function () {

    return "../Common/extensions/Leaflet_WidgetExtension/ui/Leaflet/images/leaflet-green-leaf-38x43.png";

  };

 

  var thisWidget = this;

 

  this.renderHtml = function () {

    return '<div class="widget-content widget-Leaflet-ide"></div>';

  };

 

  this.widgetProperties = function () {

    return {

      name: "Leaflet",

      description:

        "Displays a Leaflet Map using the Coordinate Reference System for showing images that can be zoomed in/out and scrolled in the window",

      category: ["Data"],

      iconImage: "images/leaflet-green-leaf-38x43.png",

      isExtension: true,

      supportsAutoResize: true,

      defaultBindingTargetProperty: "Data",

      properties: {

        Image: {

          description: "The image to be displayed",

          isBindingTarget: true,

          isVisible: true,

          isEditable: true,

          defaultValue: "",

          baseType: "IMAGELINK",

        },

        ImageDimensions: {

          description: 'Image dimensions as "[height,width]"',

          isBindingTarget: true,

          isVisible: true,

          isEditable: true,

          baseType: "STRING",

          isLocalizable: true,

        },

        Data: {

          description: "Data source",

          isBindingTarget: true,

          isVisible: true,

          baseType: "INFOTABLE",

          warnIfNotBoundAsTarget: true,

        },

        "X-AxisField": {

          description: "Field that will provide x axis values",

          baseType: "FIELDNAME",

          sourcePropertyName: "Data",

          isBindingTarget: false,

          baseTypeRestriction: "NUMBER",

          isVisible: true,

        },

        "Y-AxisField": {

          description: "Field that will provide y axis values",

          baseType: "FIELDNAME",

          sourcePropertyName: "Data",

          isBindingTarget: false,

          baseTypeRestriction: "NUMBER",

          isVisible: true,

        },

        LayoutDimensions: {

          description:

            'Original layout dimensions(or reference co-ordinates)of image: maximum height and maximum width as : "[height,width]"',

          isBindingTarget: true,

         isVisible: true,

          isEditable: true,

          baseType: "STRING",

          isLocalizable: true,

        },

        OriginPoint: {

          description:

            'Lower left co-ordinate of the image.Default is : "[x,y]=[0,0]"',

          isBindingTarget: true,

          isVisible: true,

          isEditable: true,

          baseType: "STRING",

          defaultValue: "[0,0]",

          isLocalizable: true,

        },

        MashupParameters: {

          isVisible: false,

          baseType: "VALUES",

        },

        TooltipMashupName: {

          isBindingTarget: true,

          defaultValue: "",

          baseType: "MASHUPNAME",

        },

        TooltipMashupWidth: {

          //isVisible: false,

          defaultValue: 400,

          baseType: "NUMBER",

        },

        TooltipMashupHeight: {

          //isVisible: false,

          defaultValue: 300,

          baseType: "NUMBER",

        },

        Width: {

          description: "Widget width",

          defaultValue: 400,

        },

        Height: {

          description: "Widget height",

          defaultValue: 400,

        },

        LayerControl: {

          description: "If true, show layer controls",

          isBindingTarget: true,

          isVisible: true,

          isEditable: true,

          defaultValue: true,

          baseType: "BOOLEAN",

        },

        ZoomControl: {

          description: "If true, show zoom controls",

          isBindingTarget: true,

          isVisible: true,

          isEditable: true,

          defaultValue: true,

          baseType: "BOOLEAN",

        },

        MinZoom: {

          description: "The minimum zoom level of the map",

          isBindingTarget: true,

          isVisible: true,

          isEditable: true,

          defaultValue: -15,

          baseType: "NUMBER",

        },

        MaxZoom: {

          description: "The maximum zoom level of the map",

          isBindingTarget: true,

          isVisible: true,

          isEditable: true,

          defaultValue: 15,

          baseType: "NUMBER",

        },

        ScrollWheelZoom: {

          description: "If true, allow zooming with the mouse scroll wheel",

          isBindingTarget: true,

          isVisible: true,

          isEditable: true,

          defaultValue: true,

          baseType: "BOOLEAN",

        },

        Dragging: {

          description: "If true, allow panning/dragging",

          isBindingTarget: true,

          isVisible: true,

          isEditable: true,

          defaultValue: true,

          baseType: "BOOLEAN",

        },

        Debug: {

          description: "If true, turn on debug logging to the console",

          isBindingTarget: true,

          isVisible: true,

          isEditable: true,

          defaultValue: false,

          baseType: "BOOLEAN",

        },

        CurrentZoom: {

          description: "Map zoom level (ranges from 1 to 15)",

          isBindingSource: true,

          baseType: "NUMBER",

        },

        Zoom: {

          description: "Map zoom level (ranges from 1 to 15)",

          isBindingTarget: true,

          baseType: "NUMBER",

          defaultValue: 8,

        },

        AutoZoomBehavior: {

          isBindingTarget: false,

          description: "When to trigger AutoZoom",

          baseType: "STRING",

          defaultValue: "every-data-change",

          selectOptions: [

            {

              value: "every-data-change",

              text: "AutoZoom every time any data refreshes",

            },

            {

              value: "only-when-autozoom-invoked",

              text: "AutoZoom only when AutoZoom widget service is invoked",

            },

            {

              value: "disable-on-user-pan-zoom",

              text:

                "AutoZoom on data refresh, but disable AutoZoom if user manually pans or zooms",

            },

            {

              value: "only-initial-data",

              text:

                "AutoZoom on initial data only (useful if you use BoundsChanged to retrieve new data)",

           },

          ],

        },

        RadiusField: {

          description: "Field that will provide radius values for geofences",

          baseType: "FIELDNAME",

          sourcePropertyName: "Data",

          isBindingTarget: false,

          baseTypeRestriction: "NUMBER",

          isVisible: true,

        },

        GeofenceTypeField: {

          description:

            "Field that will provide geofence type values(if more than one)",

          baseType: "FIELDNAME",

          sourcePropertyName: "Data",

          isBindingTarget: false,

          baseTypeRestriction: "STRING",

          isVisible: true,

        },

        GeofenceLabelField: {

          description:

            "Field which will provide label information for geofences",

          isBindingTarget: true,

          isVisible: true,

          isEditable: true,

          defaultValue: "",

          sourcePropertyName: "Data",

          baseTypeRestriction: "STRING",

          baseType: "FIELDNAME",

        },

        ShowGeofences: {

          description: "Show map geofences",

          defaultValue: true,

          isBindingTarget: true,

          baseType: "BOOLEAN",

        },

      },

    };

  };

 

  //Write your own widget services here then call it in Runtime, currently AutoZoom isnt used at all

  this.widgetServices = function () {

    return {

      AutoZoom: { warnIfNotBound: false },

    };

  };

 

  //What does this do? cant seem to find in eventlistener/eventhandler in runtime, maybe can delete?

  this.widgetEvents = function () {

    return {

      Changed: {},

      DoubleClicked: {},

      BoundsChanged: {},

    };

  };

 

  //used when any property is entered, default created, in all widgets im assuming

  this.afterSetProperty = function (name, value) {

    var thisWidget = this;

    var refreshHtml = false;

    switch (name) {

      case "Style":

      case "Leaflet Property":

        thisWidget.jqElement.find(".Leaflet-property").text(value);

      case "Alignment":

        refreshHtml = true;

        break;

      default:

        break;

    }

    return refreshHtml;

  };

 

  //created, basically called after your object is loaded and properties have been restored from the file, but before your object has been rendered

  this.afterLoad = function () {

    if (this.getProperty("EnableAutoZoom") !== undefined) {

      if (!this.getProperty("EnableAutoZoom")) {

        this.setProperty("AutoZoomBehavior", "only-when-autozoom-invoked");

      } else {

        this.setProperty("AutoZoomBehavior", "every-data-change");

      }

      delete this.properties["EnableAutoZoom"];

    }

    setTimeout(function () {

      var mashupName = thisWidget.getProperty("TooltipMashupName");

      thisWidget.loadMashupParameters(

        mashupName,

        false /* isManuallyBeingSetNow */

      );

    }, 1000);

  };

 

  //only in composer, not in runtime, called after any property is updated within the composer

  this.afterSetProperty = function (name, value) {

    var refreshHtml = false;

    switch (name) {

      case "TooltipMashupName":

        if (value === undefined || value.length === 0) {

          var allWidgetProps = thisWidget.allWidgetProperties();

          var existingParmDefs =

            thisWidget.properties["MashupParameters"] || [];

          // delete existing parameters from currentParameterDefs, widgetProperties and properties

          for (var i = 0; i < existingParmDefs.length; i++) {

            delete allWidgetProps.properties[existingParmDefs[i].ParameterName];

          }

 

          thisWidget.properties["MashupParameters"] = [];

          thisWidget.properties["TooltipMashupWidth"] = undefined;

          thisWidget.properties["TooltipMashupHeight"] = undefined;

          thisWidget.updatedProperties();

          refreshHtml = true;

        } else {

          thisWidget.loadMashupParameters(

           value,

            true /* isManuallyBeingSetNow */

          );

          thisWidget.updatedProperties();

          refreshHtml = true;

        }

        break;

      default:

        break;

    }

    return refreshHtml;

  };

 

  //No idea what is going on here, they wrote this function themselves

  this.loadMashupParameters = function (mashupName, isManuallyBeingSetNow) {

    $.ajax({

      url:

        "/Thingworx/Mashups/" +

        thisWidget.getProperty("TooltipMashupName") +

        "?Accept=application/json",

      type: "GET",

      datatype: "json",

      cache: false,

      async: false,

      error: function (xhr, status) {

        TW.log.error(

          'could not load mashup "' +

            thisWidget.getProperty("TooltipMashupName") +

            '"'

        );

      },

      complete: function (xhr, status) {

        xhr.onreadystatechange = null;

        xhr.abort = null;

        delete xhr.onreadystatechange;

        delete xhr.abort;

        xhr = null;

      },

      success: function (data) {

        var allWidgetProps = thisWidget.allWidgetProperties();

        var parmDefsForThisMashup = data.parameterDefinitions;

 

        var existingParmDefs = thisWidget.properties["MashupParameters"] || [];

        // delete existing parameters from currentParameterDefs, widgetProperties and properties

        for (var i = 0; i < existingParmDefs.length; i++) {

          delete allWidgetProps.properties[existingParmDefs[i].ParameterName];

        }

 

        thisWidget.properties["MashupParameters"] = [];

 

        if (parmDefsForThisMashup !== undefined) {

          // add the new ones in to currentParameterDefs, widgetProperties and properties

          for (var x in parmDefsForThisMashup) {

            parmDef = parmDefsForThisMashup[x];

 

            var name = parmDef.name;

            var description = parmDef.description;

            var basetype = parmDef.baseType;

            var defaultValue = parmDef.aspects.defaultValue;

 

            allWidgetProps.properties[name] = {

              type: "property",

              description: description,

              isVisible: true,

              defaultValue: defaultValue,

              sourcePropertyName: "Data",

              //'baseTypeRestriction': basetype,

              baseType: "FIELDNAME",

              showAllFieldsOption: true,

            };

 

            thisWidget.properties["MashupParameters"].push({

              ParameterName: name,

              Description: description,

              BaseType: basetype,

              DefaultValue: defaultValue,

            });

          }

        }

 

        // Per MASHUP-3223, this is pretty dangerous to do ...

        //  Also, it shouldn't be done only if the mashup has parameters (although it doesn't actually make sense otherwise, does it?)

        if (isManuallyBeingSetNow === true) {

          try {

            var mashupDef = JSON.parse(data.mashupContent, TW.dateReviver);

 

            thisWidget.properties["TooltipMashupWidth"] =

              mashupDef.UI.Properties.Width;

            thisWidget.properties["TooltipMashupHeight"] =

              mashupDef.UI.Properties.Height;

          } catch (err) {

            TW.log.error(

              "An error occurred in TW.IDE.Widgets.repeater.loadMashupParameters()",

              err

            );

          }

        }

 

        try {

          switch (data.aspects.mashupType) {

            case "thingtemplatemashup":

            case "thingshapemashup":

              if (allWidgetProps.properties["Entity"] === undefined) {

                allWidgetProps.properties["Entity"] = {

                  baseType: "THINGNAME",

                  defaultValue: undefined,

                  //'isBaseProperty': false,

                  isVisible: true,

                  name: "Entity",

                  type: "property",

                  isBindingTarget: true,

                  isBindingSource: true,

                };

                thisWidget.properties["MashupParameters"].push({

                  ParameterName: "Entity",

                  Description: "Entity For Mashup",

                  BaseType: "THINGNAME",

                  DefaultValue: undefined,

                  ParmDef: {},

                });

              }

              break;

          }

        } catch (err) {}

      },

    });

  };

};