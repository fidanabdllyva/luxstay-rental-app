import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ROUTER from "./routes";
import { ThemeProvider } from "./components/common/theme-provider";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "sonner";

function App() {
  const routes = createBrowserRouter(ROUTER);

  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster richColors position="top-center" />
        <RouterProvider router={routes} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
