function init() {
 	var geojson = {};
	geojson['type'] = 'FeatureCollection';
	geojson['features'] = [];

	Tabletop.init({
		key: '0AkE-VGwUGzsSdHRjTmtNMXhONjYxQUxnOV9SajY4VkE',
		callback: function(data, tabletop) {
			$.each(data, function(key, val) {
				var newFeature = {
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [parseFloat(val.longitude), parseFloat(val.latitude)]
					},
					"properties": {
						"title": val.groupname,
						"description": val.fulldescription,
						"shortdesc": val.shortdescription,
						"twitter": val.twitter,
						"contact": val.contactname,
						"contactEmail": val.contactemail,
						"marker-size": "large",
						"marker-color": "#4682b4",
						"marker-symbol": ""
					}
				}
				geojson['features'].push(newFeature);	
			});
			mapIt(geojson);
		},
		simpleSheet: true
	});
 
	function mapIt(groups) {
		var map = L.mapbox.map('map', 'examples.map-9ijuk24y');
	    var featureLayer = map.featureLayer
	    	.setGeoJSON(groups);
		map.fitBounds(featureLayer.getBounds());

		L.Control.Command = L.Control.extend({
			options: {
			    position: 'topleft',
			},
			onAdd: function (map) {
			    var controlDiv = L.DomUtil.create('div', 'leaflet-control-command');
			    L.DomEvent
			        .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
			        .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
			    .addListener(controlDiv, 'click', function () { MapShowCommand(); });

			    var controlUI = L.DomUtil.create('div', 'leaflet-control-command-interior', controlDiv);
			    controlUI.title = 'Map Commands';
			    return controlDiv;
			}
		});

		// custom popup
		featureLayer.eachLayer(function(marker) {
		    var content = '<h1>size: ' + marker.feature.properties.size + '<\/h1>' +
		        '<h2>population: ' + marker.feature.properties.population + '<\/h2>';
		    marker.bindPopup(content);
		});
		
		// get each feature and populate page with properties
		var info = document.getElementById('groups');
		map.featureLayer.eachLayer(function(marker) {

			// append to left column
			var link = info.appendChild(document.createElement('div'));
			link.className = 'group';
			var group = marker.feature.properties;
			link.innerHTML = '<div class="group-header"><h2>' + group.title + '</h2>' + '<p class="short-desc">' + group.shortdesc + '</p><div class="info">' + marker.feature.geometry.coordinates[1] + ', ' + marker.feature.geometry.coordinates[0] + '</div></div>';
			link.innerHTML += '<div class="more"><p class="description">' + group.description + '</p><p class="contact"><span class="title">Contact</span><br>' + group.contact + '<br><em>' + group.contactEmail + '</em></p></div>';
			link.onclick = function() {
				if(/active/.test(this.className)) {
					this.className = this.className.replace(/active/, '').replace(/\s\s*$/, '');
				} else {
					var siblings = info.getElementsByClassName('group');
					for(var mug=0; mug<siblings.length; mug++) {
						siblings[mug].className = siblings[mug].className.replace(/active/, '').replace(/\s\s*$/, '');
					};
					this.className += ' active';
					map.panTo(marker.getLatLng());
					marker.openPopup();
				}
				return false;
			}

			// set popup content
			var popupContent = '<h2>' + group.title + '</h2><p>' + group.shortdesc + '</p>';
			marker.bindPopup(popupContent);
		});
	}

	// submit a new map
	$('#open-add, #close-add').click(function(){
		$('#add').toggleClass('active');
	});

	// form sequencing
	$('#start').click(function(){
		$('#start-field').hide(200);
		$(this).next('.field').show(200);
	});
}

window.onLoad = init();