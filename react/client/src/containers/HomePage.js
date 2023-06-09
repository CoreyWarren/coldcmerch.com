import Layout from 'components/Layout';
import upcoming_shows from '../assets/upcoming_show.jpg';

const HomePage = () => {
    return (
        <Layout title = 'ColdC(ut) Merch | Home' content='Home Page'>

            <div className="home_page_panel">
            <h1 className='mb-5'>Cold Cut Merchandise</h1>

            <div className="display-item">

                <div className="left">
                    <p>Come see us at our next show!</p>
                    <h1>RIVER RATTS</h1>
                    <img src={upcoming_shows}></img>

                </div>


                <div className="right">
                    <h2>[TIME]</h2>
                    <p>Saturday, June 17th, 2023</p>
                    <h2>[LOCATION]</h2>
                    <p>"Veterans of Foreign Wars" - 9190 Fontana Avenue Fontana, CA 92335</p>
                    <a href="https://www.eventbrite.com/e/river-ratts-wcold-cut-the-ghetto-on-phyre-and-more-tickets-645865640517">
                        <button className="cta-button">[ Buy Tickets Now ]</button>
                    </a>
                    <p>(Or buy at the door.)</p>

                </div>

            </div>


            <div className="info-item">
            <h2>Thanks for supporting us!</h2>
            <p>- Elmar</p>
            <p>- Lou</p>
            <p>- Brian</p>
            </div>


            <div className="info-item">
            <h2>Need Help?</h2>
            <p></p>
            <p>Please contact our admin Corey at:</p>
            <p style={{fontSize:"1.1rem", textDecoration:"underline"}}>support@coldcmerch.com</p>
            <p>for suggestions or reports.</p>


            </div>


            <div className="info-item">
            <h2>Privacy Concerns?</h2>
            <p></p>
            <p>This site respects your privacy and time:</p>
            <p>- No ads</p>
            <p>- No cross-site cookies</p>
            <p>- No clunky Wordpress or Shopify templates</p>

            <p></p>

            <p>Here, why don't you take a look at the code?</p>
            <div className="info-item-link"> 
                <p><a href="https://github.com/CoreyWarren/coldcmerch.com">
                [Github Repo]</a></p>
            </div>
            </div>


            <div className="info-item">
            <h2>In The Works:</h2>
            <p></p>
            <p>- Password Resets</p>
            <p>- Order History</p>
            <p>- User Rewards</p>
            </div>

            <br></br>



            
            </div>
        </Layout>
    );
};

export default HomePage;