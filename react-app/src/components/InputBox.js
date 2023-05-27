import React from 'react';

function Input(props) {
  return (
    <input type="text" onChange={props.onChange} value={props.value} placeholder="키워드를 입력해주세요"/>
  );
}

export default Input;