$(function () {
	//console.log(list);

	var valuePair = new Object(null);

	var isComment = function (line) {
		var check = line.indexOf("//");
		if (check != -1) {
			return true;
		}
	};

	var getColorPair = function (item) {
		var step1 = item.replace(";", "").replace(/ /g, "").replace(/\t/g,'');;
		var step2 = step1.split(":");

		//console.log(item);

		//var check = item[1].indexOf("#");

		//if (check != -1) {
			return step2;
		//}
	}

	var getType = function(value) {
		if(value.indexOf("#") != -1) {
			return "color";
		}
		if(value.indexOf("px") != -1) {
			return "number";
		}
		if(value.indexOf("@") != -1) {
			return "variable";
		}
	};

	var buildTile = function (label, color) {
		var $el = $('<article class="tile">').addClass("tile");
		var $color = $('<header class="color">').html(color);
		$color.attr("style", "background-color:" + color);
		$color.appendTo($el);
		var $label = $('<footer class="text">').html(label);
		$label.appendTo($el);
		return $el;
	};

	var displayInfo = function(valuePair){
		$.each(valuePair, function(key,value){
			console.log(value.type)
			if(value.type == "color") {
				buildTile(value.lessVariable, value.value).appendTo("#colors");
			}
			if()
		});
	};

	var getDataFromInput = function(list) {
		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			if (!isComment(item)) {
				var pair = getColorPair(item);
				//if (pair) {

					var newRow = new Object(null);
					var label = pair[0];
					var value = pair[1];

					newRow.lessVariable = label;
					newRow.value = value;
					newRow.type = getType(value);

					valuePair[label.replace("@", "")] = newRow;

					//buildTile(label, color).appendTo('#output');

				//}
			}
		}
		displayInfo(valuePair);
	};

	var _init = function () {
		var input = $("#less").val();
		var list = input.match(/[^\r\n]+/g);
		getDataFromInput(list);
	};

	_init();


});