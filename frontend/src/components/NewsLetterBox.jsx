import React from "react";
import { Trans, t } from "@lingui/macro";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        <Trans>Subscribe now & get 20% off</Trans>
      </p>

      <p className="text-gray-400 mt-3">
        <Trans>
          Join our newsletter for style tips, special offers, and early access to new products.
        </Trans>
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder={t`Enter your email`}
          required
        />

        <button
          type="submit"
          className="bg-black text-white text-xs px-10 py-4"
        >
          <Trans>SUBSCRIBE</Trans>
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
