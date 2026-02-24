<?php

class WP_RR_REST_API {
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes() {
		register_rest_route( 'wp-rr-manager/v1', '/routes', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_routes' ),
				'permission_callback' => array( $this, 'get_permission_callback' ),
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'save_routes' ),
				'permission_callback' => array( $this, 'get_permission_callback' ),
			),
		) );
	}

	public function get_routes() {
		$routes = get_option( 'wp_rr_custom_routes', array() );
		if ( empty( $routes ) ) {
			$routes = array(
				array(
					'id' => '1',
					'namespace' => 'custom-api',
					'path' => '/user-profiles',
					'method' => 'GET',
					'associatedAction' => 'fetch_user_meta_data',
					'status' => 'Active',
					'active' => true,
					'version' => 'v1',
					'requireAuth' => true,
					'permissionCallback' => 'is_user_logged_in',
					'customPermissionCallback' => '',
					'params' => array(
						array( 'name' => 'user_id', 'type' => 'integer' ),
						array( 'name' => 'fields', 'type' => 'string' )
					),
					'actions' => array(
						array(
							'id' => 'a1',
							'type' => 'db_query',
							'name' => 'Get User Meta',
							'description' => 'Query wp_usermeta where user_id matches request param.'
						)
					)
				),
				array(
					'id' => '2',
					'namespace' => 'custom-api',
					'path' => '/update-cart',
					'method' => 'POST',
					'associatedAction' => 'process_cart_items',
					'status' => 'Active',
					'active' => true,
					'version' => 'v1',
					'requireAuth' => true,
					'permissionCallback' => 'is_user_logged_in',
					'customPermissionCallback' => '',
					'params' => array(),
					'actions' => array()
				),
				array(
					'id' => '3',
					'namespace' => 'custom-api',
					'path' => '/debug-log',
					'method' => 'GET',
					'associatedAction' => 'N/A',
					'status' => 'Draft',
					'active' => false,
					'version' => 'v1',
					'requireAuth' => false,
					'permissionCallback' => 'is_user_logged_in',
					'customPermissionCallback' => '',
					'params' => array(),
					'actions' => array()
				)
			);
		}
		return rest_ensure_response( $routes );
	}

	public function save_routes( $request ) {
		$routes = $request->get_json_params();

		if ( ! is_array( $routes ) ) {
			return new WP_Error( 'invalid_data', 'Invalid route data', array( 'status' => 400 ) );
		}

		// Sanitize routes
		$sanitized_routes = array();
		foreach ( $routes as $route ) {
			$sanitized_routes[] = array(
				'id'                       => sanitize_text_field( $route['id'] ),
				'namespace'                => sanitize_title( $route['namespace'] ),
				'version'                  => sanitize_text_field( $route['version'] ),
				'path'                     => sanitize_text_field( $route['path'] ),
				'method'                   => sanitize_text_field( $route['method'] ),
				'status'                   => sanitize_text_field( $route['status'] ?? 'Draft' ),
				'active'                   => (bool) ( $route['active'] ?? false ),
				'associatedAction'         => sanitize_text_field( $route['associatedAction'] ?? 'N/A' ),
				'requireAuth'              => (bool) ( $route['requireAuth'] ?? false ),
				'permissionCallback'       => sanitize_text_field( $route['permissionCallback'] ?? 'is_user_logged_in' ),
				'customPermissionCallback' => sanitize_text_field( $route['customPermissionCallback'] ?? '' ),
				'params'                   => $this->sanitize_params( $route['params'] ?? array() ),
				'actions'                  => $this->sanitize_actions( $route['actions'] ?? array() ),
			);
		}

		update_option( 'wp_rr_custom_routes', $sanitized_routes );
		return rest_ensure_response( array( 'success' => true ) );
	}

	private function sanitize_params( $params ) {
		if ( ! is_array( $params ) ) return array();
		$sanitized = array();
		foreach ( $params as $param ) {
			$sanitized[] = array(
				'name'     => sanitize_text_field( $param['name'] ),
				'type'     => sanitize_text_field( $param['type'] ),
				'required' => (bool) ( $param['required'] ?? false ),
			);
		}
		return $sanitized;
	}

	private function sanitize_actions( $actions ) {
		if ( ! is_array( $actions ) ) return array();
		$sanitized = array();
		foreach ( $actions as $action ) {
			$sanitized[] = array(
				'id'          => sanitize_text_field( $action['id'] ?? '' ),
				'type'        => sanitize_text_field( $action['type'] ),
				'name'        => sanitize_text_field( $action['name'] ?? '' ),
				'description' => sanitize_text_field( $action['description'] ?? '' ),
				'data'        => is_array( $action['data'] ?? '' ) ? $action['data'] : sanitize_textarea_field( $action['data'] ?? '' ),
			);
		}
		return $sanitized;
	}

	public function get_permission_callback() {
		return current_user_can( 'manage_options' );
	}
}
