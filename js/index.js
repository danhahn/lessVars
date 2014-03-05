$(function () {
	//console.log(list);

	var valuePair = new Object(null);

	var removeAt = function(i){
		return i.replace("@", "");
	};

	var isComment = function (line) {
		var check = line.indexOf("//");
		if (check != -1) {
			return true;
		}
	};

	var getColorPair = function (item) {
		var step1 = item.replace(";", "").replace(/ /g, "").replace(/\t/g,'');;
		var step2 = step1.split(":");
		return step2;
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
		//Check if Object is real
		if(valuePair[key] == null) {
			throw new Error("This is not valid try again the " + key +" you entered is not found");
		}
		//Check if key is a HEX color
		if(valuePair[key].value.indexOf("#") != -1){
			return valuePair[key].value;
		}
		//Check if key is a pixel value
		else if (valuePair[key].value.indexOf('px') != -1) {
			return valuePair[key].value;
		}
		//Check if key is a list of fonts
		else if (valuePair[key].value.indexOf(',') != -1) {
			return valuePair[key].value;
		}
		//Check again since nothing is valid.
		else {
			return getVariable(removeAt(valuePair[key].value));
		}
	}

	var buildTile = function (label, value, type) {
		var $el = $('<article class="tile">');
		var $title = $('<header class="title">').html(value);
		var isVar = false;
		switch (type) {
			case 'color':
				$title.attr("style", "background-color:" + value);
				break
			case 'number':
				$title.attr("style", "width: " + value);
				break
			case 'variable':
				//Get Real value of variable
				var variable = getVariable(removeAt(value));
				$title.html('(' + variable  + ')');
				if(variable.indexOf("#") != -1){
					$title.attr("style", "background-color:" + variable);
					type = "color";
					isVar = true;
				}
				else if(variable.indexOf("px") != -1){
					$title.attr("style", "width: " + variable);
					type = "number";
				}
				else if(variable.indexOf(",") != -1){
					$title.attr("style", "font-family: " + variable);
				}
		}
		$title.appendTo($el);

		if(isVar) {
			var $label = $('<footer class="text">').html(label + ' &gt; ' + value);
		}
		else {
			var $label = $('<footer class="text">').html(label);
		}
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

				var childOjb = new Object(null);
				var label = pair[0];
				var value = pair[1];

				childOjb.lessVariable = label;
				childOjb.value = value;
				childOjb.type = getType(value);

				valuePair[removeAt(label)] = childOjb;

			}
		}
		displayInfo(valuePair);
	};

	$("#showCode").on("click", function() {
		var $el = $(this);
		console.log($el);
		$("<div class='overlay'></div>").appendTo("body");
		$("#dataInput").show();
	});

	$("#doUpdate").on("click", function() {
		_reset();
		_init();
		$("#dataInput, .overlay").fadeOut();
	});

	var _reset = function() {
		$("#color .tile, #number .tile, #variable .tile").remove();
	};

	var _init = function () {
		var input = $("#less").val();
		var list = input.match(/[^\r\n]+/g);
		getDataFromInput(list);
	};

	_init();


});