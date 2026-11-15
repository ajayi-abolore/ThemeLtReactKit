import Header from '../Components/Header.jsx';
import Footer from '../Components/Footer.jsx';

export default function Default({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}