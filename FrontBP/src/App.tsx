import { BrowserRouter } from "react-router-dom";
import Pages from "./pages/Pages";
import ShoppingCartProvider from "./components/ShoppingCart/ShoppingCartProvider";

function App() {
  return (
    <BrowserRouter>
      <ShoppingCartProvider>
        <Pages />
      </ShoppingCartProvider>
    </BrowserRouter>
  );
}

export default App;
