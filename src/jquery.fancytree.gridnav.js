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


// Allow these navigation keys even when input controls are focused

var INPUT_KEYS = {
		"text": [$.ui.keyCode.UP, $.ui.keyCode.DOWN],
		"checkbox": [],
		"radiobutton": []
	},
	KC = $.ui.keyCode;


function findNeighbourTd($target, keyCode){
	var $td = $target.closest("td");
	switch( keyCode ){
		case KC.LEFT:
			return $td.prev();
		case KC.RIGHT:
			return $td.next();
		case KC.UP:
			return $td.parent().prev(":visible").find("td").eq($td.index());
		case KC.DOWN:
			return $td.parent().next(":visible").find("td").eq($td.index());
	}
	return null;
}

/*******************************************************************************
 * Extension code
 */
$.ui.fancytree.registerExtension("gridnav", {
	version: "0.0.1",
	// Default options for this extension.
	options: {
		autofocusInput: false,  // Focus first embedded input if node gets activated
		handleUpDown: true,     // Allow UP/DOWN in inputs to move to prev/next node
		nodesTabbable: true    // Add node title to TAB chain
	},

	treeInit: function(ctx){

		this._super(ctx);

		//
		this.$container
			.addClass("fancytree-ext-gridnav");
			// .attr("tabindex", "0");

		// Activate node if embedded input gets focus
		this.$container
			.on("focusin", "input", function(event){
				var ctx2,
					node = $.ui.fancytree.getNode(event.target);

				node.debug("INPUT focusin", event.target, event);
				if( !node.isActive() ){
					// Call node.setActive(), but also pass the event
					ctx2 = ctx.tree._makeHookContext(node, event);
					ctx.tree._callHook("nodeSetActive", ctx2, true);
				}
			// }).on("focusin", function(event){
			// 	ctx.tree.debug("$container focusin");
			// }).on("focusout", function(event){
			// 	ctx.tree.debug("$container focusout");
			// }).on("keydown", function(event){
			// 	ctx.tree.debug("$container keydown", event);
			});
	},
	nodeRender: function(ctx) {
		this._super(ctx);
		// Add every node title to the tab sequence
		if( ctx.options.gridnav.nodesTabbable ){
			$(ctx.node.span).find("span.fancytree-title").attr("tabindex", "0");
		}
	},
	// nodeRenderStatus: function(ctx) {
	// 	this._super(ctx);
	// 	// // Add node title to the tab sequence
	// 	// $(ctx.node.span)
	// 	// 	.find("span.fancytree-title")
	// 	// 	.attr("tabindex", "0");
	// },
	nodeSetActive: function(ctx, flag) {
		var opts = ctx.options.gridnav,
			node = ctx.node,
			event = ctx.originalEvent || {},
			$node = $(node.tr || node.span);

		flag = (flag !== false);

		this._super(ctx, flag);

		// ctx.node.debug("set tabindex to " + (flag ? "0" : ""), ctx, opts);
		// Add node title to the tab sequence
		// if( !opts.nodesTabbable ){
		// 	if ( flag ){
		// 		$(ctx.node.span).find("span.fancytree-title").attr("tabindex", "0");
		// 	}else{
		// 		$(ctx.node.span).find("span.fancytree-title").removeAttr("tabindex");
		// 	}
		// }

		// $(node.span)
		// 	.find("span.fancytree-title")
		// 	.attr("tabindex", flag ? "0" : "");

		if(flag){
			if( opts.nodesTabbable ){
				$(node.span).find("span.fancytree-title").focus();
				// If one node is tabbable, the container no longer needs to be
				// ctx.tree.$container .attr("tabindex", "-1");
				ctx.tree.$container.removeAttr("tabindex");
			} else if( opts.autofocusInput && !$(event.target).is(":input") ){
				// Set focus to input sub input (if node was clicked, but not
				// when TAB was pressed )
				$node.find(":input:enabled:first").focus();
			}
		}
	},
	nodeKeydown: function(ctx) {
		var inputType, handleKeys, $td,
			event = ctx.originalEvent,
			$target = $(event.target);

		if( $target.is(":input:enabled") ){
			if( ctx.options.gridnav.handleUpDown ){
				inputType = $target.prop("type");
				handleKeys = INPUT_KEYS[inputType];
				$td = findNeighbourTd($target, event.which);
				if( $td && $td.length ) {
					$td.find(":input:enabled").focus();
					return false;
				}
				// if( handleKeys && $.inArray(event.which, handleKeys) === -1 ){
				// 	ctx.node.debug("ignore keydown in input", event.which, handleKeys);
				// 	// Prevent Fancytree default navigation
				// 	return true;
				// }
				return true;
			}
		}
		this._super(ctx);
	}
});
}(jQuery, window, document));
