import React from "react";
import { assets } from "../assets/assets";
import { Trans } from "@lingui/macro";

const Footer = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* LEFT */}
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="Logo" />
          <p className="w-full md:w-2/3 text-gray-600">
            <Trans>
              Designed for the modern shopper. We blend simplicity with style to bring you everyday essentials you’ll love.
            </Trans>
          </p>
        </div>

        {/* COMPANY */}
        <div>
          <p className="text-xl font-medium mb-5">
            <Trans>COMPANY</Trans>
          </p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li><Trans>Home</Trans></li>
            <li><Trans>About us</Trans></li>
            <li><Trans>Delivery</Trans></li>
            <li><Trans>Privacy policy</Trans></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <p className="text-xl font-medium mb-5">
            <Trans>GET IN TOUCH</Trans>
          </p>
          <ul className="flex flex-col gap-1 text-gray-600">
            {/* ❌ Do NOT translate phone/email */}
            <li>+27 784 281 036</li>
            <li>support@brandedparcels.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          <Trans>
            Copyright 2025 brandedparcels.com - All Right Reserved.
          </Trans>
        </p>
      </div>
    </div>
  );
};

export default Footer;
