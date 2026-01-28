import React from 'react'
import SideNavbar from '../../Component/SideNavbar/SideNavbar';     // Capital S
import HomePage from '../../Component/HomePage/HomePage';           // Capital H
import './home.css'
import "@fontsource/poppins/800.css";
const Home = ({sideNavbar}) => {
  return (
    <div className='home'>
        <SideNavbar sideNavbar={sideNavbar}/>
        <HomePage sideNavbar={sideNavbar}/>

    </div>
  )
}

export default Home