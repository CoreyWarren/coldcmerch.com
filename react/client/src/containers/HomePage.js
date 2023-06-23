import Layout from 'components/layouts/Layout';
import UpcomingShow from 'components/layouts/UpcomingShow';
import YouTubeEmbed from 'components/layouts/YouTubeEmbed';
import SocialMediaSlice from 'components/layouts/SocialMediaSlice';

import insta_icon from '../assets/insta_icon.png';
import spotify_icon from '../assets/spotify_icon.png';
import youtube_icon from '../assets/youtube_icon.png';

import ImageGallery from 'components/ImageGallery';



const HomePage = () => {

    // Display upcoming show if true:
    const show = false;
    const youtube_video_1 = true;
    const youtube_video_2 = true;


    // Function to render the upcoming show component
    const conditionallyRenderUpcomingShow = () => {
        if (show) {
            return (
                <UpcomingShow />
            );
        } else {
            return null;
        }
    };


    const conditionallyRenderYouTubeVideo = () => {
        if (youtube_video_1){
            return (
                <div className="youtube-embed-container">
                    <h2>Performance At the Lounge (Part 1)</h2>
                    <div>
                        <YouTubeEmbed
                        videoId="hJx8IvVBWYw"
                        width={800}
                        height={800}
                        resolution="hd720"
                        />
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }

    
    const conditionallyRenderYouTubeVideo2 = () => {
        if (youtube_video_2){
            return (
                <div className="youtube-embed-container">
                    <h2>Performance At the Lounge (Part 2)</h2>
                    <div>
                        <YouTubeEmbed
                        videoId="xEfLCVTlGWw"
                        width={800}
                        height={800}
                        resolution="hd720"
                        />
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }

    const renderSocialMediaSlice = () => {
        return (
            <SocialMediaSlice
            items={[
                { title: 'Our Insta', icon: insta_icon, link: 'https://www.instagram.com/coldcut_/'},
                { title: 'Our Spotify', icon: spotify_icon, link: 'https://open.spotify.com/artist/5kSVXoBjzVbHGJg3KND4XW'},
                { title: 'Our YouTube', icon: youtube_icon, link:'https://www.youtube.com/channel/UCZKNsuPrK5koGQUWB-cpoxg'},
            ]}
            />
        )
    }
        

    // Photo Gallery


      






    return (
        <Layout title = 'ColdC(ut) Merch | Home' content='Home Page'>

            <div className="home_page_panel">
            <h1 className='mb-5'>Cold Cut</h1>


            <div className="merch-home-banner" >
            <h2 style={{textAlign:"center", lineHeight:"3rem"}}>See our new <a href="/store" className="link-to-merch">Merch</a> in the shop!</h2>
            </div>
            
            {conditionallyRenderUpcomingShow()}

            <ImageGallery title="RIVER RATTS"
             gallery="gallery1" 
             type_original="" 
             type_thumbnail="_t" 
             credit="@Psychi.Media -- Nate Bena -- 03/17/2023 @ [Veterans of Foreign Wars]"
             />






            {conditionallyRenderYouTubeVideo()}

            {conditionallyRenderYouTubeVideo2()}

            <div className="info-item">
            <h2>Thanks for supporting us!</h2>
            <p>- Elmar</p>
            <p>- Lou</p>
            <p>- Brian</p>
            <p>- (and Corey, too!)</p>
            </div>

            {renderSocialMediaSlice()}

            <br></br>



            
            </div>
        </Layout>
    );
};

export default HomePage;