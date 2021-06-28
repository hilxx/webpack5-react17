import React from 'react';
import type { History } from 'history'
import type { } from 'react-router-dom'

export default (props: { history: History }) => {
 console.log(props);
 return (
  <div>
   <p>
    this is pageA
   </p>
   <a onClick={() => props.history.push('/b', null)}>to B</a>
  </div>
 )
}