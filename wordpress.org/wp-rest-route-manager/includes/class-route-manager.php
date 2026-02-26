<?php

class WP_RR_Route_Manager {
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_custom_routes' ) );
	}

	public function register_custom_routes() {
		$routes = get_option( 'wp_rr_custom_routes', array() );

		foreach ( $routes as $route ) {
			if ( empty( $route['active'] ) ) {
				continue;
			}

			$namespace = $route['namespace'];
			if ( ! empty( $route['version'] ) ) {
				$namespace .= '/' . $route['version'];
			}

			$path = '/' . ltrim( $route['path'], '/' );
			register_rest_route( $namespace, $path, array(
				'methods'  => $route['method'],
				'callback' => array( $this, 'handle_route_action' ),
				'permission_callback' => function( $request ) use ( $route ) {
					return $this->handle_permission_callback( $request, $route );
				},
				'args' => $this->prepare_args( $route['params'] ),
				'route_id' => $route['id'],
			) );
		}
	}

	public function handle_route_action( $request ) {
		$route_id = $request->get_attributes()['route_id'];
		$routes = get_option( 'wp_rr_custom_routes', array() );

		// Find the route config
		$route_config = null;
		foreach ( $routes as $r ) {
			if ( $r['id'] === $route_id ) {
				$route_config = $r;
				break;
			}
		}

		if ( ! $route_config ) {
			return new WP_Error( 'route_not_found', 'Route configuration not found', array( 'status' => 404 ) );
		}

		// Simplified action execution
		$results = array();
		if ( ! empty( $route_config['actions'] ) && is_array( $route_config['actions'] ) ) {
			foreach ( $route_config['actions'] as $action ) {
				$results[] = $this->execute_action_block( $action, $request, $results );
			}
		}

		return rest_ensure_response( ! empty( $results ) ? end( $results ) : array( 'success' => true ) );
	}

	private function execute_action_block( $action, $request, $previous_results ) {
		global $wpdb;

		switch ( $action['type'] ) {
			case 'db_query':
				$table_name = $wpdb->prefix . 'users';
				$user_id = $request->get_param( 'user_id' );

				if ( $user_id ) {
					$data = $wpdb->get_row( $wpdb->prepare( "SELECT ID, user_login, user_email FROM $table_name WHERE ID = %d", $user_id ) );
				} else {
					$data = $wpdb->get_results( "SELECT ID, user_login FROM $table_name LIMIT 5" );
				}

				return array(
					'message' => 'Query executed',
					'data' => $data ? $data : array( 'error' => 'No data found' )
				);

			case 'mail':
				return array( 'message' => 'Email action processed' );

			case 'output':
				return $action['data'] ?? array( 'message' => 'Output action processed' );

			default:
				return array( 'status' => 'success', 'action' => $action['type'] );
		}
	}

	public function handle_permission_callback( $request, $route_config ) {
		// Use flat structure to match the frontend state
		if ( empty( $route_config['requireAuth'] ) ) {
			return true;
		}

		$callback = isset( $route_config['permissionCallback'] ) ? $route_config['permissionCallback'] : 'is_user_logged_in';

		// Whitelist of safe callbacks
		$allowed_callbacks = array( 'is_user_logged_in', 'manage_options', 'edit_posts' );

		if ( in_array( $callback, $allowed_callbacks, true ) ) {
			if ( 'is_user_logged_in' === $callback ) {
				return is_user_logged_in();
			}
			return current_user_can( $callback );
		}

		// Support custom callbacks but only if they exist and are not dangerous
		if ( 'custom' === $callback && ! empty( $route_config['customPermissionCallback'] ) ) {
			$custom = $route_config['customPermissionCallback'];
			$disallowed = array( 'exec', 'passthru', 'system', 'shell_exec', 'popen', 'proc_open', 'eval' );

			if ( function_exists( $custom ) && ! in_array( strtolower( $custom ), $disallowed, true ) ) {
				return call_user_func( $custom, $request );
			}
		}

		return false;
	}

	private function prepare_args( $params ) {
		$args = array();
		if ( ! is_array( $params ) ) return $args;

		foreach ( $params as $param ) {
			$args[ $param['name'] ] = array(
				'type'     => $param['type'] ?? 'string',
				'required' => $param['required'] ?? false,
			);
		}
		return $args;
	}
}
