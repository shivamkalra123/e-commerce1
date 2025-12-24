import React from "react";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md bg-white rounded-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-center">
          Login Required
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Please login or sign up to write a review.
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => {
              onClose();
              navigate("/login");
            }}
            className="w-full bg-black text-white py-3"
          >
            Login
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/signup");
            }}
            className="w-full border border-black py-3"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
