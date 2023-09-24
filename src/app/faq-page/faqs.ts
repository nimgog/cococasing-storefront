import { Scenario } from './scenario';
import { Section } from './section';

const dummyCase: Scenario = {
  title: 'I neglected to enter my promotional code.',
  body: 'When you buy something, you agree to pay the amount stated. Unfortunately, after a transaction has been made, discount codes cannot be applied. Naturally, you are able to make a new order using your discount coupon. Please be aware, though, that we are unable to cancel made orders, and you must return your initial purchase to receive a refund.',
};

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

// TODO: Replace these with real data
export const faqs: Section[] = [
  {
    title: 'Payment & Discount',
    topics: [
      {
        title: 'Payment',
        scenarios: [
          {
            title: 'Is my payment information protected?',
            body: lorem,
          },
          {
            title: 'Has my payment been received?',
            body: lorem,
          },
          {
            title: 'What payment methods do you offer?',
            body: lorem,
          },
        ],
      },
      {
        title: 'Discount',
        scenarios: [
          {
            title: 'How can I apply my coupon code?',
            body: `Add the code in the field for discounts at checkout. Is the code broken?Verify that the code doesn't have any extra spaces before or after it. Clear your cookies and cache, then try again (on windows: ctrl+F5, on mac: cmd+shift+r).- You can only use one discount coupon per order, and you can't mix them. Discount codes can't be used on sale products.- Some promotional codes are only good for certain products and are only good until a specified date.- Some codes are only applicable to certain consumers.- If you have received an offer from us in an email, it might only be accessible through the URL you were sent. Please be aware that you cannot add additional discount coupons to your purchase if the link contains a discount code.Still not functioning? We will, of course, assist you further if you contact our customer service department using the "Contact" button at the bottom of the page.Please be aware that the price cannot be changed after you have made your purchase, therefore you must input the discount code first.`,
          },
          { ...dummyCase },
          { ...dummyCase },
        ],
      },
      {
        title: 'Campaigns',
        scenarios: [{ ...dummyCase }, { ...dummyCase }, { ...dummyCase }],
      },
    ],
  },
  {
    title: 'Order & Delivery',
    topics: [
      {
        title: 'Order Information',
        scenarios: [{ ...dummyCase }, { ...dummyCase }, { ...dummyCase }],
      },
      {
        title: 'Delivery',
        scenarios: [{ ...dummyCase }, { ...dummyCase }, { ...dummyCase }],
      },
    ],
  },
  {
    title: 'Returns & Refunds',
    topics: [
      {
        title: 'Returns',
        scenarios: [{ ...dummyCase }, { ...dummyCase }, { ...dummyCase }],
      },
      {
        title: 'Refunds',
        scenarios: [{ ...dummyCase }, { ...dummyCase }, { ...dummyCase }],
      },
    ],
  },
  {
    title: 'Product & Warranty',
    topics: [
      {
        title: 'Product',
        scenarios: [
          {
            title: 'I have multiple iPhone models; can I use the same shell?',
            body: lorem,
          },
          {
            title:
              'When will the item I want to purchase become available again?',
            body: lorem,
          },
          {
            title: `My phone's shell won't come off!`,
            body: lorem,
          },
        ],
      },
      {
        title: 'Warranty',
        scenarios: [
          {
            title: 'What is covered by the warranty and how long is it valid?',
            body: `The warranty period for Coco Casing is one year from the date of purchase. The goods are produced in accordance with our strict quality requirements. The items are additionally protected by our warranty against any manufacturing flaws. Only the aforementioned components are covered by Coco Casing's warranty.The following things are not covered by Coco Casing's warranty:- defects and harm brought on by loss, theft, fire, water, or UV rays directly hitting the product.- defects or damage brought on by abuse, carelessness, accidents, or unauthorized repairs or modifications (such as knocks, dents, crushes, falls, etc.).- aesthetic modifications, flaws, and harm brought on by everyday wear and tear- The warranty could be void if maintenance recommendations are not followed.Please be aware that warranty claims are evaluated taking into consideration the fact that the value of your product declines over time.`,
          },
        ],
      },
    ],
  },
  {
    title: 'Partnerships & Dealers',
    topics: [
      {
        title: 'Partnerships',
        scenarios: [
          {
            title: 'Team up with us',
            body: lorem,
          },
        ],
      },
      {
        title: 'Dealers',
        scenarios: [
          {
            title:
              'Obtain certification as a Coco Casing distributor or dealer',
            body: 'Who should I get in touch with if I wish to become an authorized dealer or distributor?We appreciate your interest in our company. Please email contact@cococasing.se to reach out to our sales staff.In your application, kindly provide the following information:Company name and registration number:Full address:Telephone number:Email address:Company presentation:Please mention any extra details deemed pertinent, such as other brands sold by the company. After reviewing your application, one of our sales professionals will contact you as soon as possible with a response.',
          },
        ],
      },
    ],
  },
];
