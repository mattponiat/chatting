import { create } from "zustand";
import * as React from "react";

type ChattingStore = {
  nullUser: {
    name: string;
    color: string;
    image: string;
  };
  listRef: React.RefObject<HTMLUListElement>;
};

const useChattingStore = create<ChattingStore>()((set) => ({
  nullUser: {
    name: "Anon",
    color: "#c2caf5",
    image:
      "https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg",
  },
  listRef:
    React.createRef<HTMLUListElement>() as React.RefObject<HTMLUListElement>,
}));

export default useChattingStore;
