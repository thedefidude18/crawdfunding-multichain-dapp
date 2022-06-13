import "../styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { wrapper, store } from "../store";
import { Provider } from "react-redux";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import "@fontsource/space-grotesk";

const theme = extendTheme({
  fonts: {
    heading: "Space Grotesk",
    body: "Space Grotesk",
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
            <NavBar />
            <Component {...pageProps} />
            <Footer />
        </ChakraProvider>
      </Provider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
