import { Helmet } from 'react-helmet';
import Navbar from 'components/Navbar';
import '../fonts/Pilar.ttf'

const LayoutStripeCheckout = ({ title, content, children}) => (
    <>
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={content} />

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></link>

            <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" crossorigin></script>

            <script
            src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"
            crossorigin></script>

            <script
            src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"
            crossorigin></script>
            
        </Helmet>


        <Navbar />
        <div className='container mt-5'>
            {children}
        </div>
    </>
)

export default LayoutStripeCheckout;