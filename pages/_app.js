import "../styles/globals.css";
import Head from "next/head";

import { Provider } from "react-redux";
import user from "../reducers/user";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const reducers = combineReducers({ user });

const persistConfig = { key: "kyber-vision-web-uploader", storage };
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Head>
            <title>KV API07 Manager</title>
            <meta property="og:title" content="K V Uploader 07" />
            <meta
              property="og:description"
              content="KV website to assist with the mobile and mobile API development"
            />
            <meta
              property="og:image"
              content="https://kv05-uploader.dashanddata.com/images/KyberV2Shiny.png"
            />
          </Head>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
