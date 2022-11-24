//Backend
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const ColorPicker = () => {
  const changeColor = trpc.user.changeColor.useMutation();
  const session = useSession();

  const handleChangeColor = (color: string) => {
    if (session.status === "authenticated") {
      changeColor.mutateAsync({
        color: color,
      });
    }
  };

  return (
    <div className="mr-auto flex gap-2">
      <button
        className="bg-blue-500 p-4"
        onClick={() => handleChangeColor("#3b82f6")}
      />
      <button
        className="bg-red-500 p-4"
        onClick={() => handleChangeColor("#ef4444")}
      />
      <button
        className="bg-green-500 p-4"
        onClick={() => handleChangeColor("#22c55e")}
      />
    </div>
  );
};

export default ColorPicker;
