import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ROUTER from "./routes"
import { ThemeProvider } from "./components/common/theme-provider"


function App() {
  const routes = createBrowserRouter(ROUTER)

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={routes}></RouterProvider>
      </ThemeProvider>
    </>
  )
}

export default App
