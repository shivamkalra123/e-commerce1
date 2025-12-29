import React, { useEffect } from "react";
import AOS from "aos";
import { Trans } from "@lingui/macro";

const WhyUs = () => {

  // ensure AOS recalculates when this section mounts


  return (
    <section className="bg-[#f8f8f8] py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

        {/* LEFT – Editorial text */}
        <div data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-4xl md:text-5xl font-light leading-tight mb-6">
            <Trans>
              Designed for the way <br /> you shop today
            </Trans>
          </h2>

          <p className="text-gray-600 text-lg max-w-md">
            <Trans>
              Every detail is intentional — from the products we curate to the experience we deliver. We believe shopping should feel effortless, modern, and reliable.
            </Trans>
          </p>
        </div>

        {/* RIGHT – Value points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          <div className="border-t pt-6" data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-lg font-medium mb-2">
              <Trans>Premium curation</Trans>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              <Trans>
                Thoughtfully selected products that balance quality, design, and everyday practicality.
              </Trans>
            </p>
          </div>

          <div className="border-t pt-6" data-aos="fade-up" data-aos-delay="250">
            <h3 className="text-lg font-medium mb-2">
              <Trans>Seamless delivery</Trans>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              <Trans>
                Fast, reliable shipping with transparent tracking from checkout to doorstep.
              </Trans>
            </p>
          </div>

          <div className="border-t pt-6" data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-lg font-medium mb-2">
              <Trans>Customer-first approach</Trans>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              <Trans>
                Responsive support, easy returns, and policies designed around real customers.
              </Trans>
            </p>
          </div>

          <div className="border-t pt-6" data-aos="fade-up" data-aos-delay="350">
            <h3 className="text-lg font-medium mb-2">
              <Trans>Built to last</Trans>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              <Trans>
                We prioritize durability and timeless style over fast trends.
              </Trans>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyUs;
