import React from 'react';
import upcoming_show_poster from '../../assets/upcoming_show.jpg';


const UpcomingShow = () => (
    <>

    <div className="display-item">

    <div className="left">
        <p>Come see us at our next show!</p>
        <h1>RIVER RATTS</h1>
        <img src={upcoming_show_poster}></img>

    </div>


    <div className="right">
        <h2>[TIME]</h2>
        <p>7:00 PM on Saturday, June 17th, 2023</p>
        <h2>[LOCATION]</h2>
        <p>"Veterans of Foreign Wars" - 9190 Fontana Avenue Fontana, CA 92335</p>
        <a href="">
            <button className="cta-button">[ Buy Tickets Now ]</button>
        </a>
        <p>(Or buy at the door.)</p>

    </div>

    </div>


    </>

)

export default UpcomingShow;