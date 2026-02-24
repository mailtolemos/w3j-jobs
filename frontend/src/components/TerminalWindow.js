import React from 'react';
import './TerminalWindow.css';

const TerminalWindow = ({ title = '$W3J - Web3 Jobs', children }) => {
  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="traffic-lights">
          <span className="light close"></span>
          <span className="light minimize"></span>
          <span className="light maximize"></span>
        </div>
        <div className="terminal-title">{title}</div>
        <div className="terminal-spacer"></div>
      </div>
      <div className="terminal-body">
        {children}
      </div>
    </div>
  );
};

export default TerminalWindow;
