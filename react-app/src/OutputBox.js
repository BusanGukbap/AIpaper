import React from 'react';

function Output(props) {
  return (
    <div style={{ height: '100px' }}>
      <p>{props.value}</p>

    </div>
  );
}

export default Output;