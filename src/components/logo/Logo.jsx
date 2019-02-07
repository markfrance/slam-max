import React from 'react';

import "./Logo.css";

const Logo = (props) => {
  return ( 
    <div className="Logo">
      <img src="/assets/images/slam_title_logo.png" alt="Logo" class="desktop-logo"/>
      <img src="/assets/images/mobile/flying_dice_icon.png" alt="Logo" class="mobile-logo-1"/>
      <img src="/assets/images/mobile/slam_title_logo.png" alt="Logo" class="mobile-logo-2"/>
    </div>
   );
}
 
export default Logo;