import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsLetterBox'

import { Card, CardContent } from '../components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../components/ui/accordion'


const About = () => {
  return (
    <div className='container mx-auto px-4'>

      {/* Header */}
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      {/* Intro */}
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px] rounded-2xl shadow' src={assets.about_img} alt='About Branded Parcels' />
        <div className='flex flex-col justify-center gap-4 md:w-2/4 text-gray-600'>
          <p><b>Branded Parcels</b> is a shopping app connecting millions of customers across 20+ countries with thousands of merchants in Africa and beyond. New products are added daily—from everyday essentials to new favorites you never knew existed.</p>
          <p>Our platform is designed to be inspiring, personalized, and reliable. The more you browse and buy, the smarter our recommendations become—tailored to your style, interests, and budget.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>To empower customers with choice, convenience, and confidence—delivering a seamless shopping experience from discovery to delivery, backed by a strong money‑back guarantee and responsive support.</p>
        </div>
      </div>

      {/* How it Works */}
      <div className='my-12'>
        <Title text1={'HOW'} text2={'IT WORKS'} />
        <div className='grid md:grid-cols-3 gap-6 mt-6'>
          <Card className='rounded-2xl'>
            <CardContent className='p-6 text-gray-600'>
              <b>Personalized Discovery</b>
              <p>Sign up and shop—our platform learns your preferences and recommends products you’ll love.</p>
            </CardContent>
          </Card>
          <Card className='rounded-2xl'>
            <CardContent className='p-6 text-gray-600'>
              <b>Easy & Secure Checkout</b>
              <p>Multiple payment options with a smooth checkout experience.</p>
            </CardContent>
          </Card>
          <Card className='rounded-2xl'>
            <CardContent className='p-6 text-gray-600'>
              <b>Reliable Delivery</b>
              <p>Every delivery is covered by our Money Back Guarantee and supported by our customer care team.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Company Info */}
      <div className='my-12'>
        <Title text1={'COMPANY'} text2={'INFO'} />
        <div className='grid md:grid-cols-2 gap-6 mt-6 text-gray-600'>
          <Card className='rounded-2xl'>
            <CardContent className='p-6'>
              <b>Where we’re from</b>
              <p>Headquartered in Johannesburg, South Africa, with a vision for offices around the world.</p>
              <p className='mt-2'>Founded in 2023 by <b>Daniel Eghan</b> and <b>Dorcas Out</b>.</p>
            </CardContent>
          </Card>
          <Card className='rounded-2xl'>
            <CardContent className='p-6'>
              <b>Invest & Sell</b>
              <p>Interested in investing? Learn more on our Careers page.</p>
              <p className='mt-2'>Selling is currently invite‑only to ensure trust and quality across our marketplace.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delivery */}
      <div className='my-12'>
        <Title text1={'DELIVERY'} text2={'OPTIONS'} />
        <div className='grid md:grid-cols-2 gap-6 mt-6 text-gray-600'>
          <Card className='rounded-2xl'>
            <CardContent className='p-6'>
              <b>Standard Delivery</b>
              <p>All‑day delivery (7am–8pm), 2 working days. From $20.</p>
              <p className='mt-2'>Time slots available. From $35.</p>
            </CardContent>
          </Card>
          <Card className='rounded-2xl'>
            <CardContent className='p-6'>
              <b>Next‑Day Delivery</b>
              <p>Order by 7pm on weekdays. All‑day from $30.</p>
              <p className='mt-2'>Time slots available. From $45.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Returns */}
      <div className='my-12'>
        <Title text1={'RETURNS'} text2={'& EXCHANGES'} />
        <Card className='rounded-2xl mt-6'>
          <CardContent className='p-6 text-gray-600'>
            <p>Customers may return goods within 14 days of delivery if purchased remotely. Items must be preserved in original condition.</p>
            <ul className='list-disc pl-6 mt-3'>
              <li>Fully equipped product</li>
              <li>Proof of purchase</li>
              <li>Warranty card</li>
              <li>Defect report (if applicable)</li>
            </ul>
            <p className='mt-3'>Refunds are processed according to applicable legislation.</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <div className='my-12'>
        <Title text1={'FREQUENTLY'} text2={'ASKED QUESTIONS'} />
        <Accordion type='single' collapsible className='mt-6'>
          <AccordionItem value='item-1'>
            <AccordionTrigger>My order hasn’t arrived yet. Where is it?</AccordionTrigger>
            <AccordionContent>
              Delays can occur due to logistics or peak demand. Our support team will assist with tracking and updates.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger>Do you deliver on public holidays?</AccordionTrigger>
            <AccordionContent>
              Delivery availability may vary by location and courier schedules.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger>Is next‑day delivery available on all orders?</AccordionTrigger>
            <AccordionContent>
              Next‑day delivery depends on product type and your delivery address.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-4'>
            <AccordionTrigger>Do I need to be present to sign for delivery?</AccordionTrigger>
            <AccordionContent>
              Some items may require a signature, especially high‑value or large appliances.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

     

      <NewsletterBox />
    </div>
  )
}

export default About