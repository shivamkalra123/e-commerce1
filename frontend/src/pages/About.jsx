import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsLetterBox";

import { Card, CardContent } from "../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

import { Trans, t } from "@lingui/macro";

const About = () => {
  return (
    <div className="container mx-auto px-4">

      {/* Header */}
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={t`ABOUT`} text2={t`US`} />
      </div>

      {/* Intro */}
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px] rounded-2xl shadow"
          src={assets.about_img}
          alt={t`About Branded Parcels`}
        />

        <div className="flex flex-col justify-center gap-4 md:w-2/4 text-gray-600">
          <p>
            <b><Trans>Branded Parcels</Trans></b>{" "}
            <Trans>
              is a shopping app connecting millions of customers across 20+ countries with thousands of merchants in Africa and beyond. New products are added daily—from everyday essentials to new favorites you never knew existed.
            </Trans>
          </p>

          <p>
            <Trans>
              Our platform is designed to be inspiring, personalized, and reliable. The more you browse and buy, the smarter our recommendations become—tailored to your style, interests, and budget.
            </Trans>
          </p>

          <b className="text-gray-800">
            <Trans>Our Mission</Trans>
          </b>

          <p>
            <Trans>
              To empower customers with choice, convenience, and confidence—delivering a seamless shopping experience from discovery to delivery, backed by a strong money-back guarantee and responsive support.
            </Trans>
          </p>
        </div>
      </div>

      {/* How it Works */}
      <div className="my-12">
        <Title text1={t`HOW`} text2={t`IT WORKS`} />

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <Card className="rounded-2xl">
            <CardContent className="p-6 text-gray-600">
              <b><Trans>Personalized Discovery</Trans></b>
              <p>
                <Trans>
                  Sign up and shop—our platform learns your preferences and recommends products you’ll love.
                </Trans>
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6 text-gray-600">
              <b><Trans>Easy & Secure Checkout</Trans></b>
              <p>
                <Trans>
                  Multiple payment options with a smooth checkout experience.
                </Trans>
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6 text-gray-600">
              <b><Trans>Reliable Delivery</Trans></b>
              <p>
                <Trans>
                  Every delivery is covered by our Money Back Guarantee and supported by our customer care team.
                </Trans>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Company Info */}
      <div className="my-12">
        <Title text1={t`COMPANY`} text2={t`INFO`} />

        <div className="grid md:grid-cols-2 gap-6 mt-6 text-gray-600">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <b><Trans>Where we’re from</Trans></b>
              <p>
                <Trans>
                  Headquartered in Johannesburg, South Africa, with a vision for offices around the world.
                </Trans>
              </p>
              <p className="mt-2">
                <Trans>
                  Founded in 2023 by <b>Daniel Eghan</b> and <b>Dorcas Out</b>.
                </Trans>
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <b><Trans>Invest & Sell</Trans></b>
              <p>
                <Trans>
                  Interested in investing? Learn more on our Careers page.
                </Trans>
              </p>
              <p className="mt-2">
                <Trans>
                  Selling is currently invite-only to ensure trust and quality across our marketplace.
                </Trans>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delivery */}
      <div className="my-12">
        <Title text1={t`DELIVERY`} text2={t`OPTIONS`} />

        <div className="grid md:grid-cols-2 gap-6 mt-6 text-gray-600">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <b><Trans>Standard Delivery</Trans></b>
              <p><Trans>All-day delivery (7am–8pm), 2 working days. From $20.</Trans></p>
              <p className="mt-2"><Trans>Time slots available. From $35.</Trans></p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <b><Trans>Next-Day Delivery</Trans></b>
              <p><Trans>Order by 7pm on weekdays. All-day from $30.</Trans></p>
              <p className="mt-2"><Trans>Time slots available. From $45.</Trans></p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Returns */}
      <div className="my-12">
        <Title text1={t`RETURNS`} text2={t`& EXCHANGES`} />

        <Card className="rounded-2xl mt-6">
          <CardContent className="p-6 text-gray-600">
            <p>
              <Trans>
                Customers may return goods within 14 days of delivery if purchased remotely. Items must be preserved in original condition.
              </Trans>
            </p>

            <ul className="list-disc pl-6 mt-3">
              <li><Trans>Fully equipped product</Trans></li>
              <li><Trans>Proof of purchase</Trans></li>
              <li><Trans>Warranty card</Trans></li>
              <li><Trans>Defect report (if applicable)</Trans></li>
            </ul>

            <p className="mt-3">
              <Trans>
                Refunds are processed according to applicable legislation.
              </Trans>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <div className="my-12">
        <Title text1={t`FREQUENTLY`} text2={t`ASKED QUESTIONS`} />

        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Trans>My order hasn’t arrived yet. Where is it?</Trans>
            </AccordionTrigger>
            <AccordionContent>
              <Trans>
                Delays can occur due to logistics or peak demand. Our support team will assist with tracking and updates.
              </Trans>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              <Trans>Do you deliver on public holidays?</Trans>
            </AccordionTrigger>
            <AccordionContent>
              <Trans>
                Delivery availability may vary by location and courier schedules.
              </Trans>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              <Trans>Is next-day delivery available on all orders?</Trans>
            </AccordionTrigger>
            <AccordionContent>
              <Trans>
                Next-day delivery depends on product type and your delivery address.
              </Trans>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              <Trans>Do I need to be present to sign for delivery?</Trans>
            </AccordionTrigger>
            <AccordionContent>
              <Trans>
                Some items may require a signature, especially high-value or large appliances.
              </Trans>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
