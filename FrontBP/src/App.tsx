import { BrowserRouter } from "react-router-dom";
import Pages from "./pages/Pages";
import ShoppingCartProvider from "./components/ShoppingCart/Cart/ShoppingCartProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  return (
    <BrowserRouter>
      <PayPalScriptProvider
        options={{
          clientId:
            "AdvfXprzLkgFJvKoKWTuYYfTupqqjDtYExbaKIPyLccMHYJc7_x9ZLqoSyFOGSWieAIfT8U_phGKvLkP",
        }}
      >
        <GoogleOAuthProvider clientId="210370745181-k7ig9s8qpfkp02pdd8p761oum1bfemct.apps.googleusercontent.com">
          <ShoppingCartProvider>
            <Pages />
          </ShoppingCartProvider>
        </GoogleOAuthProvider>
      </PayPalScriptProvider>
    </BrowserRouter>
  );
}

export default App;
