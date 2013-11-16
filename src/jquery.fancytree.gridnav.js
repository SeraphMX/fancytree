/*!
 * jquery.fancytree.gridnav.js
 *
 * Support keyboard navigation for trees with embedded input controls.
 * (Extension module for jquery.fancytree.js: https://github.com/mar10/fancytree/)
 *
 * Copyright (c) 2013, Martin Wendt (http://wwWendt.de)
 *
 * Released under the MIT license
 * https://github.com/mar10/fancytree/wiki/LicenseInfo
 *
 * @version DEVELOPMENT
 * @date DEVELOPMENT
 */

;(function($, window, document, undefined) {

"use strict";


/*******************************************************************************
 * Private functions and variables
 */

// var isMac = /Mac/.test(navigator.platform);



/*******************************************************************************
 * Extension code
 */
$.ui.fancytree.registerExtension("gridnav", {
	version: "0.0.1",
	// Default options for this extension.
	options: {
		autofocusInput: true,
		startKeys: [],
		beforeEdit: $.noop, //
		edit: $.noop //
	},
	// Local attributes
	currentNode: null,

	// Override virtual methods for this extension.
	// `this`       : the Fancytree instance
	// `this._local`: the namespace that contains extension attributes and private methods (same as this.ext.EXTNAME)
	// `this._super`: the virtual function that was overridden (member of previous extension or Fancytree)
	treeInit: function(ctx){
		this._super(ctx);

		this.$container
			.addClass("fancytree-ext-gridnav")
			.attr("tabindex", "0");
		// Activate node if embedded input gets focus
		this.$container.on("focusin", "input", function(event){
			var //tree = ctx.tree,
				node = $.ui.fancytree.getNode(event.target);
			node.debug("INPUT focusin", event.target, event);
			if( !node.isActive() ){
				node.setActive();
			}
		}).on("focusin", function(event){
			ctx.tree.debug("$container focusin");
		}).on("focusout", function(event){
			ctx.tree.debug("$container focusout");
		}).on("keydown", function(event){
			ctx.tree.debug("$container keydown", event);
		});
	},
	// nodeRender: function(ctx) {
	// 	this._super(ctx);
	// 	// Add node title to the tab sequence
	// 	$(ctx.node.span).find("span.fancytree-title").attr("tabindex", "0");
	// },
	nodeRenderStatus: function(ctx) {
		this._super(ctx);
		// // Add node title to the tab sequence
		// $(ctx.node.span)
		// 	.find("span.fancytree-title")
		// 	.attr("tabindex", "0");
	},
	nodeSetActive: function(ctx, flag) {
		var $node = $(ctx.node.tr || ctx.node.span),
			$subInput = $node.find(":input:enabled:first");
		flag = flag !== false;
		this._super(ctx, flag);
		// Add node title to the tab sequence
		$(ctx.node.span)
			.find("span.fancytree-title")
			.attr("tabindex", flag ? "0" : "");
		ctx.node.debug("set tabindex to " + (flag ? "0" : ""));
		if(flag){
			ctx.tree.$container
				.attr("tabindex", "");
			ctx.node.debug("focus sub " + $subInput.length);
			$subInput.focus();
		}
	},
	nodeKeydown: function(ctx) {
		// switch( ctx.originalEvent.which ) {
		// case 113: // [F2]
		// 	ctx.node.startEdit();
		// 	return false;
		// case $.ui.keyCode.ENTER:
		// 	if( isMac ){
		// 		ctx.node.startEdit();
		// 		return false;
		// 	}
		// 	break;
		// }
		if( $(ctx.originalEvent.target).is(":input:enabled") ){
			ctx.node.debug("ignore keydown in input");
			return true;
		}
		this._super(ctx);
	}
});
}(jQuery, window, document));
