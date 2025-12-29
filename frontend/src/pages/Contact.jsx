import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsLetterBox";
import { Trans, t } from "@lingui/macro";

const Contact = () => {
  return (
    <div>
      {/* Header */}
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={t`CONTACT`} text2={t`US`} />
      </div>

      {/* Content */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-full md:max-w-[480px]"
          src={assets.contact_img}
          alt={t`Contact Branded Parcels`}
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">
            <Trans>Head Office</Trans>
          </p>

          <p className="text-gray-500">
            <Trans>
              Kimberly Road, Judith Paarl, Johannesburg, South Africa
            </Trans>
          </p>

          <p className="text-gray-500">
            <Trans>
              Phone: +27 784 281 036
            </Trans>
            <br />
            <Trans>
              Email: support@brandedparcels.com
            </Trans>
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
