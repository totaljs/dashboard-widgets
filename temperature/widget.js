WIDGET('MyWidgetName', function() {

	var self = this;
	var padding = 10;
	var is = false;
	var memory;
	var cpu;

	function gauge(name, element, width, height, percentage) {

		var el = d3.select(element.get(0));

		if (is)
			el.selectAll('svg').remove();

		is = true;

		var svgProgress = el.append('svg');
		svgProgress.attr('width', width);
		svgProgress.attr('height', height - 20);
		svgProgress.style('position', 'absolute').style('left', 0).style('top', 0);

		var svgPointer = el.append('svg');
		svgPointer.attr('width', width);
		svgPointer.attr('height', height);
		svgPointer.style('position', 'absolute').style('left', 0).style('top', 0);

		height -= 20;
		var r = Math.min(width, height) / 2;
		var cx = (r / 2) + ((width / 2) - (r / 2));
		var cy = (r / 2) + ((height / 2) - (r / 2));

		var arc = d3.arc().innerRadius(height - 30).outerRadius(height).startAngle(0);
		var g = svgProgress.append('g').attr('transform', 'translate({0},{1})'.format(width / 2, height));

		g.append('path').attr('transform', 'rotate(-90)').datum({ endAngle: 0.5 * TAU }).style('fill', '#E0E0E0').attr('d', arc);

		var gprogress = g.append('g');
		var progress = gprogress.append('path').attr('transform', 'rotate(-270)').datum({ endAngle: 0.5 * TAU }).style('fill', '#C22E57').attr('d', arc);

		var gpointer = svgPointer.append('g').attr('transform', 'translate({0},{1})'.format(width / 2, height));
		var pointer = gpointer.append('g').attr('transform', 'rotate(90)');

		pointer.append('circle')
			.attr('r', 10)
			.style('fill', 'black');

		pointer.append('path')
			.attr('d', 'M-10 0 L0 {0} L10 0 Z'.format(height - 20));

		return function(value) {
			var value = ((180 / 100) * value >> 0);
			gprogress.transition().duration(500).attr('transform', 'rotate({0})'.format(value));
			gpointer.transition().duration(500).attr('transform', 'translate({0},{1}) rotate({2})'.format(width / 2, height, value));
		};
	}

	self.make = function(size) {
		self.html('<div style="width:50%;float:left;position:relative;background:blue" data-index="0"></div><div style="float:right;width:50%;position:relative;background:red" data-index="1"></div>')
		self.resize(size);
	};

	self.resize = function(size) {
		cpu = gauge('cpu', self.element.find('div[data-index="0"]'), size.width / 2, size.height / 4, 20);
		// memory = gauge('memory', self.element.find('div[data-index="1"]'), size.width / 2, size.height / 4, 20);
	};

}, function(config, inject) {

	this.example = { values: [1, 2, 3, 4] };
	this.preview = ''; // URL TO preview
	this.author = '';
	this.title = 'Temperature';

	config('background', 'Background Color', '#F8F8F8', 'Color');
	config('color', 'Font Color', '#F5F7FA', 'Color');
});

// UPDATE datasource value
// DATASOURCE({ values: [1, 2, 3, 4, 5] });
