import { Helmet } from 'react-helmet';
import Navbar from 'components/Navbar';
import './Dashboard.css';
import '../fonts/Pilar.ttf'

const Layout = ({ title, content, children}) => (
    <>
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={content} />
        </Helmet>

        <Navbar />
        <div className='container mt-5'>
            {children}
        </div>
    </>
)

export default Layout;