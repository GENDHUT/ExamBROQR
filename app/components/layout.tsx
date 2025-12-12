// ============================
  // AUTO-RELAUNCH GLOBAL (user tidak bisa out aplikasi) belum selesai
  // ============================
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      const isLeavingApp =
        appState.current === "active" &&
        nextState !== "active";

      if (isLeavingApp) {
        // sedikit delay supaya tidak bentrok transition OS
        setTimeout(() => {
          Linking.openURL("myapp://home");
        }, 200);
      }

      appState.current = nextState;
    });

    return () => sub.remove();
  }, []);
  // ============================