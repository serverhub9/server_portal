// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import toast, { Toaster } from 'react-hot-toast';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <>

    <ThemeCustomization>
      <ScrollTop>
        <Routes />
      </ScrollTop>
    </ThemeCustomization>
    <Toaster
      position="top-center"
    />
  </>
);

export default App;
