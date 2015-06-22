var photopress = photopress || {'gallery': {}, 'galleries': {} };

photopress.gallery.sideways = function( dom_selector, options ) {
	
	this.dom_selector = dom_selector || '';
	
	this.options = {};
	this.options = this.defaults;
	
	if ( options ) {
		
		for (var opt in options) {
			
			this.options[opt] = options[opt];
		}
	}
};

photopress.gallery.sideways.prototype = {
	
	
	defaults : {
		
		frame_selector				: '.photopress-gallery-sideways-frame',
		scrollbar_selector			: '.photopress-gallery-sideways-scrollbar',
		pages_selector				: '.photopress-gallery-sideways-pages',
		fwd_button_selector			: '.controls > .forward',
		back_button_selector		: '.controls > .backward',
		prevpage_button_selector	: '.controls > .prevPage',
		nextpage_button_selector	: '.controls > .nextPage',
		prev_button_selector		: '.controls > .prev',
		next_button_selector		: '.controls > .next',
		sly_options					: {},
		buttons						: {
			
			toStart		:	false,
			toEnd		:	false,
			prevPage	:	false,
			nextPage	:	false,
			prev 		:	true,
			next 		:	true,
			backward	:	true,
			forward		:	true,
			
		},
		showPages					: true,
		showScrollBar				: true
		
	},
	
	addScrollbar: function() {
		
		var that = this;
		
		if ( this.options.showScrollBar ) {
			
			var sb = "<div class='photopress-gallery-sideways-scrollbar'><div class='handle'><div class='mousearea'></div></div></div>";
			
			jQuery( that.dom_selector ).append( sb );
		}
		
	},

	
	addPages: function() {
		
		var that = this;
		
		if ( this.options.showPages ) {
			
			var pages = "<ul class='photopress-gallery-sideways-pages'></ul>";
			
			jQuery( that.dom_selector ).append( pages );
		}
		
	},
	
	addButtons: function() {
		
		var that = this;
		
		var buttons = '<div class="controls center">';
		// return to start button
		if ( this.options.buttons.toStart ) {
			buttons +=	'<button class="btn toStart"><i class="icon-hand-left"></i> Beginning</button>';
		}
		
		if ( this.options.buttons.prevPage ) {
			buttons +=	'<button class="btn prevPage"><i class="icon-chevron-left"></i><i class="icon-chevron-left"></i> Previous Page</button>';
		}
		
		if ( this.options.buttons.prev ) {
			buttons +=	'<button class="btn prev"><i class="icon-chevron-left"></i> Previous</button>';
		}
		
		if ( this.options.buttons.backward ) {
			buttons +=	'<button class="btn backward"><i class="icon-chevron-left"></i> Pan Left</button>';
		
		}
		
		if ( this.options.buttons.forward ) {
			buttons +=	'<button class="btn forward">Pan Right <i class="icon-chevron-right"></i></button>';
		}
		
		if ( this.options.buttons.next ) {
			buttons +=	'<button class="btn next">Next <i class="icon-chevron-right"></i></button>';
		}
		
		if ( this.options.buttons.nextPage ) {
			buttons +=	'<button class="btn nextPage">Next Page <i class="icon-chevron-right"></i><i class="icon-chevron-right"></i></button>';
		}
		
		if ( this.options.buttons.toEnd ) {
			buttons +=	'<button class="btn toEnd">End <i class="icon-hand-right"></i></button>';
		}
		
		buttons +=	'</div>'
		
		jQuery( that.dom_selector ).append( buttons );	
	},
	
	render : function( ) {
		
		var that = this;
		var selector = that.dom_selector;
		var frame = jQuery( selector + ' > ' + that.options.frame_selector );
		var slidee = frame.children('ul').eq(0);
		var wrap = frame.parent();
		
		this.addScrollbar();
		this.addPages();
		// add buttons
		this.addButtons();
		
		frame.sly({
		
			horizontal: 1,
		
		    // Item based navigation
			itemNav			: 'basic',
			smart			: 1,
			activateOn		: null,
			activateMiddle	: 0,  // Always activate the item in the middle of the FRAME. forceCentered only.
			
			// Dragging
			dragSource		: that.options.sly_options.dragSource || null, // Selector or DOM element for catching dragging events. Default is FRAME.
			mouseDragging	: 1,    // Enable navigation by dragging the SLIDEE with mouse cursor.
			touchDragging	: 1,    // Enable navigation by dragging the SLIDEE with touch events.
			releaseSwing	: 1,    // Ease out on dragging swing release.
			swingSpeed		: 0.2,  // Swing synchronization speed, where: 1 = instant, 0 = infinite.
			elasticBounds	: 1,    // Stretch SLIDEE position limits when dragging past FRAME boundaries.
					
			// scrollbar
			scrollBar		: wrap.find(that.options.scrollbar_selector),
			dragHandle		: 1,
			dynamicHandle	: 1,
			minHandleSize	: 50,   // Minimal height or width (depends on sly direction) of a handle in pixels.
			clickBar		: 1,    // Enable navigation by clicking on scrollbar.
			syncSpeed		: 0.5,  // Handle => SLIDEE synchronization speed, where: 1 = instant, 0 = infinite.
			
			// scrolling
			scrollSource	: null, // Element for catching the mouse wheel scrolling. Default is FRAME.
			scrollBy		: 1,
			
			// pages bar
			pagesBar		: wrap.find(that.options.pages_selector),
			activatePageOn	: 'click',
			// mixed options
			moveBy			: 300,
			speed			: that.options.sly_options.speed || 4000,
			easing			: that.options.sly_options.easing || 'swing',
			startAt			: that.options.sly_options.startAt || 0,
			keyboardNavBy	: that.options.sly_options.keyboardNavBy || 1,
			// Navigation Buttons
			forward			: that.dom_selector + '>' + that.options.fwd_button_selector,
			backward		: that.dom_selector + '>' + that.options.back_button_selector,
			prev			: that.dom_selector + '>' + that.options.prev_button_selector,
			next			: that.dom_selector + '>' + that.options.next_button_selector,
			prevPage		: that.dom_selector + '>' + that.options.prevpage_button_selector,
			nextPage		: that.dom_selector + '>' + that.options.nextpage_button_selector,
			// Automated cycling
			cycleBy			: that.options.sly_options.cycleBy || null, // Enable automatic cycling by 'items' or 'pages'.
			cycleInterval	: that.options.sly_options.cycleInterval || 5000, // Delay between cycles in milliseconds.
			pauseOnHover	: that.options.sly_options.pauseOnHover || 0,    // Pause cycling when mouse hovers over the FRAME.
			startPaused		: that.options.sly_options.startPaused || 0,    // Whether to start in paused sate.
			// Classes
			draggedClass	: that.options.sly_options.draggedClass || 'dragged',  // Class for dragged elements (like SLIDEE or scrollbar handle).
			activeClass		: that.options.sly_options.activeClass || 'active',   // Class for active items and pages.
			disabledClass	: that.options.sly_options.disabledClass || 'disabled'  // Class for disabled navigation elements.
		});
		
		// To Start button
		wrap.find('.toStart').on('click', function () {
			var item = jQuery(this).data('item');
			// Animate a particular item to the start of the frame.
			// If no item is provided, the whole content will be animated.
			frame.sly('toStart', item);
		});
		// To Center button
			wrap.find('.toCenter').on('click', function () {
			var item = jQuery(this).data('item');
			// Animate a particular item to the center of the frame.
			// If no item is provided, the whole content will be animated.
			frame.sly('toCenter', item);
		});
		// To End button
		wrap.find('.toEnd').on('click', function () {
			var item = jQuery(this).data('item');
			// Animate a particular item to the end of the frame.
			// If no item is provided, the whole content will be animated.
			frame.sly('toEnd', item);
		});
	}	
};

/*
photopress.gallery.masonry = function( dom_selector, options ) {
	
	this.dom_selector = dom_selector || '';
	
	this.options = this.defaults;
	
	if ( options ) {
		
		for (var opt in options) {
			
			this.options[opt] = options[opt];
		}
	}	
};

photopress.gallery.masonry.prototype = {
	
	defaults : {

		//itemSelector: '.gallery-icon > a > img'
		itemSelector: '.gallery-item'
		
	},
	
	render : function() {
		
		var that = this;
		var container = jQuery( that.dom_selector );
		
		container.imagesLoaded(function(){
		  container.masonry({
		   itemSelector : that.options.itemSelector,
		   gutter: that.options.gutter || 10
		    //gutterWidth: '15px'
		    //columnWidth : 
		  });
		});
	}
};
*/