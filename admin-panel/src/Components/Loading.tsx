import { BeatLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <BeatLoader size={50} color="#0b3af8" />
    </div>
  );
};

export default Loading;
