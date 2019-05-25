import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import './index.css';
import * as serviceWorker from './serviceWorker';
import Routes from './routes/Routes';

ReactDOM.render(<Routes />, document.getElementById('root'));

serviceWorker.unregister();