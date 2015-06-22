<?php

/*
Plugin Name: PhotoPress - Sideways Gallery
Plugin URI: http://www.photopresdev.com
Description: Adds a sideways scrolling gallery presentation to the core gallery shortcode.
Author: Peter Adams
Author URI: http://www.photopressdev.com
License: GPL v3
Version: 1.3
*/

/**
 * PhotoPress Image Taxonomies
 *
 * Copyright Peter Adams - peter@photopressdev.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

class photopress_gallery_sideways {
	
	static $admin_notices = array();
	static $enabled;
	
	static function init() {
	
		add_action('admin_notices', array( 'photopress_gallery_sideways', 'admin_notices' ) );
		
		// test for dependant photopress plugins
		
		
		if ( ! self::checkForDependants() ) {
			self::addAdminNotice(
				sprintf(
					__('PhotoPress Gallery Sideways relies on the <a href="%s">PhotoPress Gallery</a> plugin, please install this plugin.', 'photopress_gallery_sideways'), 'http://wordpress.org/plugins/photopress-gallery/'
				),
			'error');
		}
	}
	
	static function checkForDependants() {
		
		// test for dependant WordPress Simple Shopping Cart Plugin
		self::$enabled = function_exists('photopress_gallery_shortcode');
		return self::$enabled;
	}
	
	/**
	 * Append a message of a certain type to the admin notices.
	 *
	 * @param string $msg 
	 * @param string $type 
	 * @return void
	 */
	static function addAdminNotice( $msg, $type = 'updated' ) {
	
		self::$admin_notices[] = array(
			'type' => $type == 'error' ? $type : 'updated', // If it's not an error, set it to updated
			'msg' => $msg
		);
	}
	
	/**
	 * Displays admin notices 
	 *
	 * @return void
	 */
	static function admin_notices() {
		
		if ( is_array( self::$admin_notices ) ) {
		
			foreach ( self::$admin_notices as $notice ) {
				extract( $notice );
				?>
				<div class="<?php echo esc_attr($type); ?>">
					<p><?php echo $msg; ?></p>
				</div><!-- /<?php echo esc_html($type); ?> -->
				<?php
			}
		}
	}
	
	static function registerDependantActions() {
		
		if ( self::checkForDependants() ) {
		
			// filters shortcode attributes for various features
			add_filter( 'shortcode_atts_gallery', 'photopress_gallery_shortcode_attrs', 10, 3 );
			// enqueue various javascript libs
			add_action( 'wp_enqueue_scripts', 'photopress_gallery_scripts' );		
		}
	}
}

/**
 * Filter callback for adding markup before the gallery
 *
 */
function photopress_gallery_sideways_pre_output( $output, $selector, $attr ) {
	
	// Attributes needed for sideways gallery markup
	// needed in case there is more than 1 gallery per page
	if ( isset( $attr['type'] ) && $attr['type'] === 'sideways' ) {
	
		$height = false;
			
		// get the height of the image size being used by the gallery
		if ( isset ( $attr['size'] ) ) {
			
			$size = $attr['size'];
			
			// this is a bit fragile  but there is no API for retrieving image size dimensions.	
			global $_wp_additional_image_sizes;
		
			if ( isset ( $_wp_additional_image_sizes[ $size ] ) ) {
				
				$height = $_wp_additional_image_sizes[ $size ]['height'];
			
			}
			
			// Could be a standard image size, if so get the height from options.
			if ( ! $height ) {
			
				$height = get_option( $size . '_size_h' );
				
			}
			
			// final fallback
			if ( ! $height ) { 
				
				$height = 400;
			}	
		}		
		
		$height .= 'px';
		
		$output = "
		<div id='photopress-gallery-sideways-$selector' class='photopress-gallery-container'>
		<div id='' class='photopress-gallery-sideways-frame' style='height:$height'>";
	}
	
	return $output;
}

/**
 * Filter callback for adding markup after the gallery
 *
 */
function photopress_gallery_sideways_post_output( $output, $selector, $attr ) {
	
	if ( isset( $attr['type'] ) && $attr['type'] === 'sideways' ) {
	
		$global_options_var = 'photopress_gallery_sideways_options';
		
		$instance_options_var = 'photopress_gallery_sideways_'.str_replace( '-', '_', $selector).'_options';
		
		$output .= "
		
			</div>
		</div>
		
		<script>
		
		// make sure the dom is ready.
		jQuery( function( $ ){
	
			( function () {
				// look for global options
				var $global_options_var = $global_options_var || {};
				// look for instance options
				var $instance_options_var = $instance_options_var || $global_options_var;
				// create new sideways gallery
				photopress.galleries['$selector'] = new photopress.gallery.sideways('#photopress-gallery-sideways-$selector');
				// render gallery
				photopress.galleries['$selector'].render();	
		
			}()); 
		});
		
		</script>
		<!-- End PhotoPress Sideways Gallery -->
		";
	}
	
	// needed just in case other galleries on the same page need the default styles.
	add_filter( 'use_default_gallery_style', '__return_true' );
	
	return $output;
}

/**
 * Changes the gallery shortcode attrs to support various gallery types
 *
 */
function photopress_gallery_shortcode_attrs( $out, $pairs, $attr ) {
	
	// Attributes needed for sideways gallery markup
	if ( isset( $out['type'] ) && $out['type'] === 'sideways' ) {
		$out['containertag'] = 'ul';
		$out['itemtag'] = 'li';
		$out['icontag'] = 'p';
		$out['captiontag'] = 'span';
		$out['columns'] = -1;
		
		// remove the default wordpress inline gallery styles
		add_filter( 'use_default_gallery_style', '__return_false' );
		// adds pre markup
		add_filter( 'post_gallery_pre_output', 'photopress_gallery_sideways_pre_output', 99, 3 );
		// adds post markup
		add_filter( 'post_gallery_post_output', 'photopress_gallery_sideways_post_output', 99, 3 );
		
	} else {
		// needed in case a there are multiple galleries on the same page.
		//add_filter( 'use_default_gallery_style', '__return_true' );
	}
	
	// always need ot return the full set of attrs
	return $out;
}



/**
 * Hook callback for addingthe Sly javascrpt lib
 *
 */
function photopress_gallery_scripts() {
	
	// needed for sideways galleries
	wp_enqueue_script(
		'sly',
		plugins_url( 'js/sly.min.js' , __FILE__ ),
		array( 'jquery' )
	);
		
	// main  js lib
	wp_enqueue_script(
		'photopress-sideways-gallery',
		plugins_url( 'js/photopress-sideways-gallery.js' , __FILE__ ),
		array( 'jquery', 'sly' )
	);
	
	wp_register_style( 
		'photopress-sideways-gallery', 
		plugins_url('css/photopress-sideways-gallery.css',
		 __FILE__) 
	);
    
    wp_enqueue_style( 'photopress-sideways-gallery' );
    
    wp_register_style( 
		'font-awesome', 
		plugins_url('css/font-awesome/css/font-awesome.min.css',
		 __FILE__) 
	);
    
    wp_enqueue_style( 'font-awesome' );
}

add_action( 'init', array('photopress_gallery_sideways', 'init' ), 98 );
add_action( 'plugins_loaded', array('photopress_gallery_sideways', 'registerDependantActions' ) );


?>