import { render } from '@wordpress/element';
import App from './App';
import './index.css';

const root = document.getElementById('wp-rr-manager-root');

if (root) {
    render(<App />, root);
}
