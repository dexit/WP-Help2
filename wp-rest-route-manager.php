<?php
/**
 * Plugin Name: REST Route & Action Manager
 * Description: A visual manager for custom WordPress REST API routes and actions.
 * Version: 1.0.0
 * Author: Jules
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WP_RR_MANAGER_PATH', plugin_dir_path( __FILE__ ) );
define( 'WP_RR_MANAGER_URL', plugin_dir_url( __FILE__ ) );

require_once WP_RR_MANAGER_PATH . 'includes/class-rest-api.php';
require_once WP_RR_MANAGER_PATH . 'includes/class-route-manager.php';

class WP_RR_Manager {
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'register_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		new WP_RR_Route_Manager();
		new WP_RR_REST_API();
	}

	public function register_admin_menu() {
		add_menu_page(
			__( 'Custom Routes', 'wp-rr-manager' ),
			__( 'Custom Routes', 'wp-rr-manager' ),
			'manage_options',
			'wp-rr-manager',
			array( $this, 'render_admin_page' ),
			'dashicons-rest-api',
			30
		);
	}

	public function render_admin_page() {
		echo '<div id="wp-rr-manager-root"></div>';
	}

	public function enqueue_scripts( $hook ) {
		if ( 'toplevel_page_wp-rr-manager' !== $hook ) {
			return;
		}

		$asset_path   = WP_RR_MANAGER_PATH . 'build/index.asset.php';
		$dependencies = array( 'wp-api-fetch', 'wp-element', 'wp-components', 'wp-i18n' );
		$version      = '1.0.0';

		if ( file_exists( $asset_path ) ) {
			$asset_file   = include $asset_path;
			$dependencies = $asset_file['dependencies'];
			$version      = $asset_file['version'];
		}

		wp_enqueue_script(
			'wp-rr-manager-js',
			WP_RR_MANAGER_URL . 'build/index.js',
			$dependencies,
			$version,
			true
		);

		wp_enqueue_style(
			'wp-rr-manager-css',
			WP_RR_MANAGER_URL . 'build/index.css',
			array(),
			$version
		);

		wp_enqueue_style(
			'wp-rr-manager-fonts',
			'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
			array(),
			'1.0.0'
		);

		wp_enqueue_style(
			'wp-rr-manager-material-symbols',
			'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap',
			array(),
			'1.0.0'
		);

		// Localize script for API nonce and URL
		wp_localize_script( 'wp-rr-manager-js', 'wpRRManagerData', array(
			'root' => esc_url_raw( rest_url() ),
			'nonce' => wp_create_nonce( 'wp_rest' ),
		) );
	}
}

new WP_RR_Manager();
