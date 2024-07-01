mergeInto(LibraryManager.library, {
  UpdateDataDev : function(json){
     try {
      window.dispatchReactUnityEvent("UpdateDataDev", UTF8ToString(json));
    } catch (e) {
      console.warn("Failed to dispatch event");
    }
  },
});