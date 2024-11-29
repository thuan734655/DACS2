import React from "react";

const SuccessMessage = ( {title, desc,textNav, navigate,nextPage}) => (
  <div>
    <h2 className="text-lg font-bold mb-4">{title}</h2>
    <p>{desc}</p>
    <button
      className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => navigate(nextPage)}
    >
     {textNav}
    </button>
  </div>
);

export default SuccessMessage;
