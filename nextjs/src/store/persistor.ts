import { persistStore } from "redux-persist";

// Export một function để tạo persistor khi cần
export const createPersistor = (store: any) => {
  return persistStore(store);
};
