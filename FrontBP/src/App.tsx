import { BrowserRouter } from "react-router-dom";
import Pages from "./pages/Pages";
import ShoppingCartProvider from "./components/ShoppingCart/Cart/ShoppingCartProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId="210370745181-k7ig9s8qpfkp02pdd8p761oum1bfemct.apps.googleusercontent.com">
        <ShoppingCartProvider>
          <Pages />
        </ShoppingCartProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
