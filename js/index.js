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
			if(value.indexOf("rgb") == -1) {
				return "number";
			}
		}
		if(value.indexOf("@") != -1) {
			if(value.indexOf("(") == -1) {
				return "variable";
			}
		}
	};

	var getVariable = function(key) {

		if(valuePair[key] == null) {
			throw new Error("This is not valid try again the " + key +" you entered is not found");
		}

		if(valuePair[key].value.indexOf("#") != -1){
			return valuePair[key].value;
		}
		else if (valuePair[key].value.indexOf('px') != -1) {
			return valuePair[key].value;
		}
		else if (valuePair[key].value.indexOf(',') != -1) {
			return valuePair[key].value;
		}
		else {
			return getVariable(valuePair[key].value.replace('@', ''));
		}

	}

	var buildTile = function (label, value, type) {
		var $el = $('<article class="tile">');
		var $title = $('<header class="title">').html(value);
		switch (type) {
			case 'color':
				$title.attr("style", "background-color:" + value);
				break
			case 'number':
				$title.attr("style", "width: " + value);
				break
			case 'variable':
				try{
					$title.html(value +' (' + getVariable(value.replace('@', ''))  + ')');
				} catch(e){
					debugger;
				}
		}
		$title.appendTo($el);
		var $label = $('<footer class="text">').html(label);
		$label.appendTo($el);
		$el.appendTo("#"+type)
	};

	var displayInfo = function(valuePair){
		$.each(valuePair, function(key,value){
			buildTile(value.lessVariable, value.value, value.type);
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
		console.log(valuePair)
	};

	var _init = function () {
		var input = $("#less").val();
		var list = input.match(/[^\r\n]+/g);
		getDataFromInput(list);
	};

	_init();


});