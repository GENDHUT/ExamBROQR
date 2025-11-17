import AppStateHandler from "./AppStateHandler";
import { Slot } from "expo-router";


export default function App() {
  return (
    <>
      <AppStateHandler />
      <Slot />

    </>
  );
}
