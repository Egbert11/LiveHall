require.config({
	// baseUrl 基目录 
	baseUrl: '../js/lib',
	// shim require.js加载非AMD规范的模块
	shim: {
		zepto: {
			exports: 'zepto'
		},
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		}
	},
	// paths 指定各个模块位于基目录的路径
	paths: {
		'zepto': 'zepto',
		'underscore': 'underscore',
		'backbone': 'backbone'
	}
});

requirejs(['backbone'], function (b) {
	//alert(1);
});