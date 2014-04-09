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
						"marker-symbol": ""
					}
				}
				geojson['features'].push(newFeature);	
			});
			console.log(geojson);
			mapIt(geojson);
		},
		simpleSheet: true
	});
 
	function mapIt(groups) {
		var map = L.mapbox.map('map', 'examples.map-9ijuk24y');
	    var featureLayer = map.featureLayer
	    	.setGeoJSON(groups);
		map.fitBounds(featureLayer.getBounds());
		
		// get each group and append to the groups element
		var info = document.getElementById('groups');
		map.featureLayer.eachLayer(function(marker) {
			console.log('waka');
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
		});
	}

	// add button
	$('#add-button').click(function(){
		$('#add').toggleClass('do-it');
		$(this).toggleClass('do-it');
	});
	$('#close-add').click(function(){
		$('#add').toggleClass('do-it');
		$('#add-button').toggleClass('do-it');
	});
}

window.onLoad = init();