import * as React from "react";
import { trpc } from "../utils/trpc";

const ColorPicker = () => {
  const changeColor = trpc.user.changeColor.useMutation();

  return (
    <div className="mr-auto flex gap-2">
      <button className="bg-blue-400 p-4" />
      <button className="bg-red-400 p-4" />
      <button className="bg-green-400 p-4" />
    </div>
  );
};

export default ColorPicker;
