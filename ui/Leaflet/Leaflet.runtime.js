TW.Runtime.Widgets.Leaflet = function() {
	"use strict"; //strict mode - cant use undeclared variables
	var thisWidget = this;
	thisWidget.map = undefined;
	thisWidget.imageOverlay = undefined;
	thisWidget.layerControls = undefined;
	thisWidget.imageUrl;
	thisWidget.imageDimensions = [500, 500];
	thisWidget.bounds = undefined;
	var tooltipMashupWidth = 100;
	var tooltipMashupHeight = 100;
	var isMashupTooltipConfigured = false;
	thisWidget.debug = false;
	thisWidget.layerControl = true;
	thisWidget.zoomControl = true;
	thisWidget.scrollWheelZoom = true;
	thisWidget.dragging = true;
	thisWidget.minZoom = -15;
	thisWidget.maxZoom = 15;
	thisWidget.zoomSnap = 0.25;
	thisWidget.xAxisField;
	thisWidget.yAxisField;
	thisWidget.dataRows;
	// New Props - START
	thisWidget.radiusField;
	thisWidget.geofenceTypeField;
	thisWidget.geofenceLabelField;
	thisWidget.showGeofences = false;
	thisWidget.gateways;
	thisWidget.zones;
	var gatewaypinstyle = {
		fillColor: "white",
		color: "blue"
	};
	thisWidget.zoneLayer = undefined;
	thisWidget.gatewayLayer = undefined;
	// END
	thisWidget.layoutDimension = [500, 500];
	thisWidget.layoutWidth = undefined;
	thisWidget.layoutHeight = undefined;
	thisWidget.currentZoom = 2;
	thisWidget.originPoint = [0, 0];
	//thisWidget.enableMarkerSelection = true;
	this.renderHtml = function() {
		tooltipMashupWidth = thisWidget.getProperty("TooltipMashupWidth"); //what does tooltipmashup do?
		tooltipMashupHeight = thisWidget.getProperty("TooltipMashupHeight");
		var mashupName = thisWidget.getProperty("TooltipMashupName");
		if(mashupName !== undefined && mashupName.length > 0) {
			isMashupTooltipConfigured = true;
		}
		return "<div class='widget-content widget-Leaflet-runtime'></div>";
	};
	//is called after the HTML fragment representing the widget has been inserted into the mashup DOM element and a usable element ID has
	//been assigned to the DOM element holding the widget content, the DOM element is now ready to be manipulated
	this.afterRender = function() {
		thisWidget.imageDimensions = this.getProperty("ImageDimensions");
		thisWidget.layoutDimension = this.getProperty("LayoutDimensions");
		thisWidget.layoutHeight = parseFloat(eval(thisWidget.layoutDimension)[0]);
		thisWidget.layoutWidth = parseFloat(eval(thisWidget.layoutDimension)[1]);
		//log("Height Layout : " + thisWidget.layoutHeight + " Width// Layout : " + thisWidget.layoutWidth);
		thisWidget.imageUrl = this.getProperty("Image");
		thisWidget.debug = this.getProperty("Debug", false);
		thisWidget.layerControl = this.getProperty("LayerControl", true);
		thisWidget.zoomControl = this.getProperty("ZoomControl", true);
		thisWidget.scrollWheelZoom = this.getProperty("ScrollWheelZoom", true);
		thisWidget.dragging = this.getProperty("Dragging", true);
		thisWidget.minZoom = this.getProperty("MinZoom", -5);
		thisWidget.maxZoom = this.getProperty("MaxZoom", 5);
		// New Props
		thisWidget.radiusField = this.getProperty("RadiusField");
		thisWidget.geofenceTypeField = this.getProperty("GeofenceTypeField");
		thisWidget.geofenceLabelField = this.getProperty("GeofenceLabelField");
		thisWidget.showGeofences = this.getProperty("ShowGeofences");
		thisWidget.xAxisField = this.getProperty("X-AxisField");
		thisWidget.yAxisField = this.getProperty("Y-AxisField");
		thisWidget.originPoint = this.getProperty("OriginPoint");
		thisWidget.currentZoom = this.getProperty("CurrentZoom");
		//thisWidget.enableMarkerSelection = this.getProperty('EnableMarkerSelection')
		var bindings = thisWidget.mashup.DataBindings;
		//log("bindings: " + bindings);
		if(bindings != undefined && bindings.length > 0) {
			for(var i = 0; i < bindings.length; i++) {
				var binding = bindings[i];
				var isBoundToSelectedRows = TW.Runtime.isBindingBoundToSelectedRows(binding);
				if(!isBoundToSelectedRows && binding.PropertyMaps[0].TargetPropertyBaseType === "INFOTABLE") {
					thisWidget.mashup.dataMgr.addSelectedRowsForWidgetHandleSelectionUpdateSubscription(binding, function(sourceId, selectedRows, selectedRowIndices) {
						try {
							if(sourceId !== thisWidget.jqElementId) {
								try {
									thisWidget["handleSelectionUpdate"](binding.PropertyMaps[0].TargetProperty, selectedRows, selectedRowIndices);
								} catch(err) {
									TW.log.error("An error occurred while calling " + thisWidget.properties.Type + '::handleSelectionUpdate, Id = "' + thisWidget.properties.Id + '". ', err);
								}
							}
						} catch(err) {
							TW.log.error('An error occurred while handling "' + JSON.stringify(binding) + '" for handleSelectionUpdate processing', err);
						}
					});
				}
			}
		}
		createMap(false);
		//updateMap();
		//log("after render: imageUrl = " + thisWidget.imageUrl);
		//log("after render: imageDimensions = " + thisWidget.imageDimensions);
		//log("after render: layerControl = " + thisWidget.layerControl);
		//log("after render: zoomControl = " + thisWidget.zoomControl);
		//log("after render: scrollWheelZoom = " + thisWidget.scrollWheelZoom);
		//log("after render: dragging = " + thisWidget.dragging);
		//log("after render: minZoom = " + thisWidget.minZoom);
		//log("after render: maxZoom = " + thisWidget.maxZoom);
		//log("after render: zoomSnap = " + thisWidget.zoomSnap);
	};
	//
	this.updateProperty = function(updatePropertyInfo) {
		switch(updatePropertyInfo.TargetProperty) {
			case "Image":
				thisWidget.imageUrl = updatePropertyInfo.RawSinglePropertyValue;
				updateMap(updatePropertyInfo.TargetProperty);
				break;
			case "ImageDimensions":
				thisWidget.imageDimensions = updatePropertyInfo.RawSinglePropertyValue;
				updateMap(updatePropertyInfo.TargetProperty);
				break;
			case "LayoutDimensions":
				thisWidget.layoutDimension = updatePropertyInfo.RawSinglePropertyValue;
				if(thisWidget.layoutDimension !== undefined && thisWidget.layoutDimension !== null && thisWidget.layoutDimension !== "") {
					thisWidget.layoutHeight = parseFloat(eval(thisWidget.layoutDimension)[0]);
					thisWidget.layoutWidth = parseFloat(eval(thisWidget.layoutDimension)[0]);
					//log("Height : " + thisWidget.layoutHeight + " Width : " + thisWidget.layoutWidth);
				}
				updateMap(updatePropertyInfo.TargetProperty);
				break;
			case "Data":
				thisWidget.setProperty("Data", updatePropertyInfo.SinglePropertyValue);
				thisWidget.dataRows = updatePropertyInfo.ActualDataRows;
				thisWidget.xAxisField = this.getProperty("X-AxisField");
				thisWidget.yAxisField = this.getProperty("Y-AxisField");
				thisWidget.radiusField = this.getProperty("RadiusField");
				thisWidget.geofenceTypeField = this.getProperty("GeofenceTypeField");
				thisWidget.geofenceLabelField = this.getProperty("GeofenceLabelField");
				log("Updated: Data property!");
				log("Data records : " + thisWidget.dataRows.length);
				updateMap(updatePropertyInfo.TargetProperty);
				break;
			case "CurrentZoom":
				thisWidget.setProperty("CurrentZoom", updatePropertyInfo.SinglePropertyValue);
				thisWidget.currentZoom = this.getProperty("CurrentZoom");
				break;
			case "OriginPoint":
				thisWidget.setProperty("OriginPoint", updatePropertyInfo.SinglePropertyValue);
				thisWidget.originPoint = this.getProperty("OriginPoint");
				break;
			case "ShowGeofences":
				thisWidget.setProperty("ShowGeofences", updatePropertyInfo.SinglePropertyValue);
				thisWidget.showGeofences = this.getProperty("ShowGeofences");
				break;
		}
	};
	//if you wrote your own service then itll be here not used right now
	this.serviceInvoked = function(serviceName) {
		//log("service invoked: center: " + map.getCenter());
		// map.setView(L.latLng(0, 0), 0);
		/*

		* if (serviceName === 'AutoZoom') { setTimeout(function () {

		* autofitMap(); }, 1); } else { TW.log.error('Leaflet CRS Map Widget,

		* unexpected serviceName invoked "' + serviceName + '"'); }

		*/
	};
	this.beforeDestroy = function() {};

	function autofitMap() {
		// thisWidget.map.fitBounds(L.latLngBounds(thisWidget.getAllPoints()));
	}

	function onEachFeatureGateway(feature, layer) {
		if(feature && feature.properties.popupContent) {
			layer.bindPopup(feature.properties.popupContent, {
				maxWidth: "auto",
			});
		}
	}

	function onEachFeatureZone(feature, layer) {
		if(feature && feature.properties.popupContent) {
			layer.bindPopup(feature.properties.popupContent, {
				maxWidth: "auto",
			});
			layer.setStyle({
				opacity: 0.4,
				color: feature.properties.color,
			});
		}
	}
	//Create the Leaflet map instance. If the remove parameter is true, then first remove the map.
	function createMap(remove) {
		try {
			if(remove && thisWidget.map) {
				thisWidget.map.remove();
			}
			if(!thisWidget.map) {
				thisWidget.map = L.map(thisWidget.jqElementId, {
					crs: L.CRS.Simple,
					minZoom: thisWidget.minZoom,
					maxZoom: thisWidget.maxZoom,
					zoomSnap: thisWidget.zoomSnap,
					zoomControl: thisWidget.zoomControl,
					dragging: thisWidget.dragging,
					center: [0, 0],
					zoom: thisWidget.currentZoom !== undefined ? thisWidget.currentZoom : 2,
				});
				if(!thisWidget.scrollWheelZoom) {
					thisWidget.map.scrollWheelZoom.disable();
				} else {
					thisWidget.map.scrollWheelZoom.enable();
				}
			}
		} catch(err) {
			console.log("Error in createMap(): " + err);
		}
	}
	//Update the map and render it.
	function updateMap(property) {
		try {
			if(thisWidget.map) {
				log("update map called for prop: " + property);
				thisWidget.bounds = [
					[0, 0], eval(thisWidget.imageDimensions)
				];
				if(property === "Image") {
					if(thisWidget.imageOverlay) {
						thisWidget.imageOverlay.remove();
					}
					if(thisWidget.imageUrl !== undefined && thisWidget.imageUrl !== "") {
						thisWidget.imageOverlay = L.imageOverlay(thisWidget.imageUrl, thisWidget.bounds).addTo(thisWidget.map);
					}
					log("updateMap: image overlay " + thisWidget.imageUrl);
					log("updateMap: bounds " + thisWidget.bounds);
				}
				if(property === "Data") {
					thisWidget.zones = [];
					thisWidget.gateways = [];
					if(thisWidget.layerControls) {
						thisWidget.map.removeControl(thisWidget.layerControls);
					}
					if(thisWidget.zoneLayer) {
						thisWidget.map.removeLayer(thisWidget.zoneLayer);
					}
					if(thisWidget.gatewayLayer) {
						thisWidget.map.removeLayer(thisWidget.gatewayLayer);
					}
					if(thisWidget.dataRows !== null && thisWidget.dataRows !== undefined && thisWidget.dataRows.length > 0 && thisWidget.showGeofences) {
						thisWidget.dataRows.forEach((ele) => {
							if(ele[thisWidget.geofenceTypeField] === "Zone") {
								thisWidget.zones.push({
									"type": "Point",
									"coordinates": [
										parseFloat(ele[thisWidget.yAxisField]),
										parseFloat(ele[thisWidget.xAxisField]),
									],
									"properties": {
										"popupContent": ele[thisWidget.geofenceLabelField],
										"radius": parseFloat(ele[thisWidget.radiusField]),
										"color": "#ee88aa",
									},
								});
							} else {
								thisWidget.gateways.push({
									"type": "Point",
									"coordinates": [
										parseFloat(ele[thisWidget.yAxisField]),
										parseFloat(ele[thisWidget.xAxisField]),
									],
									"properties": {
										"popupContent": ele[thisWidget.geofenceLabelField],
										"radius": parseFloat(ele[thisWidget.radiusField]),
										"color": "#3388ff",
									},
								});
							}
						});
						log("zones after: " + JSON.stringify(thisWidget.zones));
						log("gateways after: " + JSON.stringify(thisWidget.gateways));
						thisWidget.gatewayLayer = L.geoJSON(thisWidget.gateways, {
							pointToLayer: function(feature, latlng) {
								return L.circle(latlng, feature.properties.radius);
							},
							style: gatewaypinstyle,
							onEachFeature: onEachFeatureGateway,
						});
						thisWidget.zoneLayer = L.geoJSON(thisWidget.zones, {
							pointToLayer: function(feature, latlng) {
								return L.circle(latlng, feature.properties.radius);
							},
							onEachFeature: onEachFeatureZone,
						});
						thisWidget.layerControls = L.control.layers().addTo(thisWidget.map);
						thisWidget.layerControls.addOverlay(thisWidget.zoneLayer, "Zones");
						thisWidget.layerControls.addOverlay(thisWidget.gatewayLayer, "Gateways");
						thisWidget.zoneLayer.addTo(thisWidget.map); // Make layer active
					}
				}
				thisWidget.map.fitBounds(thisWidget.bounds);
				thisWidget.map.setZoom(thisWidget.currentZoom !== undefined ? thisWidget.currentZoom : 2);
			}
		} catch(err) {
			console.log("Error in updateMap(): " + err);
		}
	};
	/**

	* Print console messages if debugging is turned on.

	*/
	function log(str) {
		if(thisWidget.debug) {
			console.log(str);
		}
	}
};