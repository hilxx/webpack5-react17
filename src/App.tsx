import type { ReactNode } from 'react'
import React from 'react'
import { render } from 'react-dom'
import './App.less'

type A = ReactNode

const App = () => {
 return (
  <div className='red'>
   test123
  </div>
 )
}



export default render(<App />, document.getElementById('app'))



