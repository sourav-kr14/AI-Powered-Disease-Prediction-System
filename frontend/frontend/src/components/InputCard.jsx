import React, { useState } from "react";

const InputCard = ({ onPredict }) => {
  const [input, setInput] = useState("");

  const handlePredict = () => {
    if (!input.trim()) return;

    const symptoms = input
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    onPredict(symptoms);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <input
        type="text"
        placeholder="Enter symptoms (e.g. fever, cough)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
      />

      <button
        onClick={handlePredict}
        className="w-full bg-black text-white py-3 rounded-lg"
      >
        Predict
      </button>
    </div>
  );
};

export default InputCard;
