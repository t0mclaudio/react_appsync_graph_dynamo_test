import React from 'react';
import ReactDOM from 'react-dom';
import WithProvider from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<WithProvider />, document.getElementById('root'));
registerServiceWorker();
