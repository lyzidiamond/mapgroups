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
						"coordinates": [parseFloat(val.lon), parseFloat(val.lat)]
					},
					"properties": {
						"name": val.name,
						"desc": val.desc,
						"twitter": val.twitter,
						"contact": val.contact
					}
				}
				geojson['features'].push(newFeature);	
			});
			console.log(geojson)
			mapIt(geojson);
		},
		simpleSheet: true,
	});
 
	function mapIt(groups) {
		var map = L.mapbox.map('map', 'examples.map-9ijuk24y');
	    var featureLayer = L.mapbox.featureLayer(groups)
		    .addTo(map);
		map.fitBounds(featureLayer.getBounds());
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