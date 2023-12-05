import type { Section } from '../models/faq.model';

export const faqs: Section[] = [
  {
    id: 'payment-and-discount',
    title: 'Payment & Discount',
    topics: [
      {
        title: 'Payment',
        scenarios: [
          {
            title: 'Is my payment information protected?',
            body: `The Payment Card Industry Data Security Standard (PCI DSS) is a security standard for organizations that handle credit and debit card information. The standard was created to increase controls around payment data to reduce fraud.
            If you want to sell online and accept payments from Visa, Mastercard, American Express, or Discover, your software and hosting needs to be PCI compliant.

            As we use Shopify Payments, Shopify is certified Level 1 PCI DSS compliant. This compliance extends by default to all stores powered by Shopify.`,
          },
          {
            title: 'Has my payment been received?',
            body: `To ensure utmost security, our payment procedure involves a number of security checks. Within 24 hours of a successful payment, an order confirmation email will be delivered.

            Check your spam folder if you haven't received your order confirmation.

            Not getting emails from us? To send us the information, kindly click the "Contact" button at the bottom of the page.`,
          },
          {
            title: 'What payment methods do you offer?',
            body: `We provide a number of payment methods. When making your purchase, under the payment methods section at checkout, you can quickly select your payment method. Click on the options in the checkout view for further details on each payment method. All payment methods are made through Shopify Payment (Klarna, Visa, Mastercard, etc.).
            For a full list of payment providers enabled through Shopify, please see: <a href="https://www.shopify.com/payment-gateways/sweden">Here </a>`,
          },
          {
            title: 'How do I stop my invoice?',
            body: `If you have decided to invoice via Klarna but would like to halt your invoice, please do so first through the Klarna app. Please get in touch with Klarna's customer care if you have any questions concerning the app.`,
          },
          {
            title: 'Can I place a business order?',
            body: `We now only provide corporate purchasing via Klarna. When entering your payment information, be sure to check the box that says "Organisation/Company" if you want to change this.
            Contact us at contact@cococasing.se if you are a retailer and we will be pleased to help you further`,
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
          {
            title: 'I neglected to enter my promotional code.',
            body: `When you buy something, you agree to pay the amount stated. Unfortunately, after a transaction has been made, discount codes cannot be applied. Naturally, you are able to make a new order using your discount coupon. Please be aware, though, that we are unable to cancel made orders, and you must return your initial purchase to receive a refund.`,
          },
          {
            title: 'What terms are present during the promotion?',
            body: `Our online promotions are subject to the following terms:
            <br>
            <br>
            - The discount is only valid for orders placed directly through our website.
            <br>
            - Orders placed before or after the promotional period are not eligible for the time-limited offer.
            <br>
            - Discount codes can't be used in conjunction with sales pricing or on items that are already on sale.`,
          },
        ],
      },
      {
        title: 'Campaigns',
        scenarios: [
          {
            title: 'How do I return package offers?',
            body: `It is not possible to return individual products when you have purchased multiple items as part of a so-called package deal or "buy 3 pay for 2," which means that all of the items must be returned.`,
          },
          {
            title: 'How long are sales and deals good for?',
            body: `On our website and in our email newsletters, we share details about our deals and specials.
            Would you like to be the first to learn about our news, special pre-orders, promotions, and limited editions? So please feel free to sign up for our newsletter.
            While some products are extremely popular and sell out very quickly during promotions, others are only available in limited quantities. We retain the right to run out of stock on some items.`,
          },
          {
            title:
              'Can I take advantage of the offer if I made my purchases right before or right after the promotion?',
            body: `Our specials have a time limit, therefore they are only good while they are listed on our website. Unfortunately, the offer pricing is not available to you whether you ordered before or after.
            You are of course welcome to return your order and repurchase it at the discounted price if you made your purchase just before the special period. Please abide by our return policy, which you can read down below under "Returns & refunds" by selecting "How can I send my order back?".`,
          },
        ],
      },
    ],
  },
  {
    id: 'order-and-delivery',
    title: 'Order & Delivery',
    topics: [
      {
        title: 'Order Information',
        scenarios: [
          {
            title: 'Has my order been processed?',
            body: `Within 24 hours of your order being finished, an email with an order confirmation will be sent to the email address you supplied. Please check your spam if you can't see your order confirmation.
            Please get in touch with us by clicking "Contact" if you haven't received your order confirmation after checking your spam folder and waiting 24 hours. We would be pleased to help you further.`,
          },
          {
            title: `Why haven't I gotten a confirmation of my order?`,
            body: `You ought to have gotten an email from the system automatically confirming your order if it was placed and your information was entered accurately. Try looking in your spam folder first if you can't find your order confirmation. Due to heavy workloads, it occasionally takes up to 24 hours to get your email.
            Please get in touch with us by clicking "Contact" if you haven't received your order confirmation after checking your spam folder and waiting 24 hours. We would be pleased to help you further.`,
          },
          {
            title: `I didn't get all the items I ordered.`,
            body: `We regret the mistake. Please verify what you have received with the information on your order confirmation if you only received a portion of your item.
            Please get in touch with us by clicking "Contact" if you haven't received all the products you ordered or if you got the wrong ones. We'll need to know which items you need.`,
          },
        ],
      },
      {
        title: 'Delivery',
        scenarios: [
          {
            title: `Can I revoke my purchase?`,
            body: `We understand that you need your products quickly, so we typically handle your purchase as soon as you place it. We regrettably do not have the option to cancel your order as a result.
            Of course, you can return your order back to us if something went wrong with it. You can find more details regarding returns on "Returns & Refund": "How can I send my order back?" down below.`,
          },
          {
            title: `Can I alter the order?`,
            body: `We understand that you need your products quickly, so we typically handle your purchase as soon as you place it. Because of this, we regrettably do not have the option to modify an order.
            Of course, you can return your order back to us if something went wrong with it. You can find more details regarding returns on: "How can I send my order back?".`,
          },
          {
            title: `Can my delivery address be changed?`,
            body: `Since we are aware that you need your products as soon as possible, we typically handle orders right away. Because of this, we regrettably do not have the option to alter the delivery address for a purchase.
            The delivery of your order will take place at the address you gave. The order will probably be returned to us if the stated address cannot be delivered to. We can only help you with a refund once we have received the returned item. Please be aware that if the return is the result of an inaccurate address being provided, there will be a handling fee of 100SEK, 10€ or 10$ that will be subtracted from the refund.`,
          },
          {
            title: `Where is my purchase?`,
            body: `You will receive an email as soon as the shipment is on its way with delivery details. You can monitor your shipment there and find information about your delivery there. Unless otherwise specified, your order will first be delivered directly to your mailbox. The package will either be left on your doorstep or transported to the closest delivery location if it cannot fit in your mailbox. You will be informed as soon as your package is prepared for pickup if it is delivered to a local post office.

            The postal code and email address must be provided precisely as they were when the order was placed.
            Whenever you see a message "Could not locate any tracking data. Please try once again" Please double-check your entry of the right data; if you made a mistake, your order is still being processed at our warehouse.
            Press "Contact" to get in touch with us if it has been more than 14 days (10 working days) since you placed your order and you still haven't received your package.
            After you submit your order, we want to send it as soon as we can. Under normal circumstances, the expected shipping time inside Sweden is 1 to 3 working days.

            Please be aware that the anticipated delivery time is just that—an estimate—and that it could change depending on variables outside the control of Coco Casing and its delivery partners. Extreme weather, technological difficulties, delays at customs, etc. are a few examples of these issues, although they are not restricted to them. Please be aware that during promotions, delivery times can be longer than usual.
            Typically, packages are not sent out on weekends or local holidays.`,
          },
          {
            title: `How long does it take to deliver?`,
            body: `Our constant objective is to deliver your item as promptly as we can.
            Depending on the shipping option you select, a projected delivery date will be given. When you complete your order, you will see the anticipated delivery time for each delivery choice in the "delivery details" section. Normal delivery times inside Sweden are between 1-3 business days and globally 2-7 business days depending on country.
            Please be aware that the anticipated delivery time is just that—an estimate—and that it could change depending on variables outside the control of Coco Casing and its delivery partners. Extreme weather, technological difficulties, delays at customs, etc. are a few examples of these issues, although they are not restricted to them.
            Please be aware that during promotions, delivery times can be longer than usual. Typically, packages are not sent out on weekends or local holidays.`,
          },
          {
            title: `What should I do if I received the wrong product?`,
            body: `We apologise for the wrong goods you have received.
            To make sure you received everything you ordered, please verify your order confirmation once more. Please get in touch with us by pressing "Contact" if you haven't gotten what was promised in the confirmation; we'll do all in our power to make things right.
            Naturally, you can exchange the item if you unintentionally ordered the incorrect one by returning your order and placing a new one on the correct one. Further information on how to submit a return you can find in "Returns & refunds": "How can I send my order back?" down below.`,
          },
          {
            title: `What should I do if the goods I received is damaged?`,
            body: `Have you ever gotten a delivery that included a damaged item? We sincerely regret that.
            Please contact us on contact@cococasing.se, and we'll do everything we can to assist you right away.
            When reaching out to us, kindly include the following:
            - Your order number - A photograph of the harmed item`,
          },
          {
            title: `Which shipping options are available?`,
            body: `We provide letter delivery by Postnord globally. The mail will be left at your door or sent to a nearby point of delivery if you choose the waybill and the letter is too large to fit in the letterbox.
            The "delivery options" area of the checkout process is where you can always locate the delivery options that are offered.`,
          },
          {
            title: `Do you offer international delivery?`,
            body: `Yes. We are open for sales internationally.`,
          },
          {
            title: `What happens if I don't pick up the package from the delivery point?`,
            body: `Normally, your package will stay with your shop for 7 days after it arrives. Your package will be returned to us if you do not pick it up. The package will subsequently be marked as "not collected," and a cost of 100SEK, 10€ or 10$ will be assessed. You will receive a refund for the balance of the order in the same form of payment that you used to make the original purchase.
            In order to prevent your order from being marked as "not collected," you must receive the package if you decide to cancel after placing it.`,
          },
          {
            title: `Where is the origin of my package?`,
            body: `We will be dispatched from Malmö, Sweden, where we are now situated.`,
          },
        ],
      },
    ],
  },
  {
    id: 'returns-and-refunds',
    title: 'Returns & Refunds',
    topics: [
      {
        title: 'Returns',
        scenarios: [
          {
            title: `What prerequisites must be met for returns?`,
            body: `After receiving your order, you have 30 days to return one or more items for a refund.
            For customers who made purchases between October 30 and December 22, we extend the return period (open buy) until December 31, 2013.
            The following conditions must be satisfied in order for your return to be approved:
            - The item must to be in the same state as when it was delivered.
            - The item needs to be in its original box with all labels and security stickers in tact.

            The item is not hygienic and cannot be returned for hygienic or health reasons (e.g. face masks)
            Please take note of:

            The cost of the return is covered by us. Please keep your post office return receipt on hand at all times until you get a return confirmation from us.

            To replace a product, simply place a new order on our website after returning the original one for a refund.

            Please be aware that we will reimburse the sum you paid if you request a refund. If you took advantage of a promotional deal, you will be reimbursed for the lower cost. If you made a purchase during a promotion, we reserve the right to deny you the offer or discount if, following a return, your transaction no longer meets the requirements.
            For instance, if you used a discount coupon that called for a minimum order, we reserve the right to refuse you the discount code if the total after your returns is less than the minimum.
            For refunds on purchases made using package deals (such as buy 3 get 2), the complete order must be returned.`,
          },
          {
            title: `Is it possible to return several orders in one box?`,
            body: `Yes, just make sure that you include a tracking code and what orders or products it contains in your email to us at contact@cococasing.se`,
          },
          {
            title: `How can I send my order back?`,
            body: `In every package and order we send out to customers, we include a second label. This label is to be used as the label for return, which we have pre-paid (within Sweden). Please make sure to read the return policy in order to make sure your order is eligible for return.  If you have any questions regarding the state of your package, email us directly at "contact@cococasing.se".Steps:
            <br>
            <br>
            1. Write to us here at "contact" and give us your order ID together with the message "RETURN", we will write back to you and confirm your return.
            <br>
            2. Use the label that came with the box, if you do not have the box or the label left you will have to pay for the return yourself.
            <br>
            3. Make sure the old label is covered completely.
            <br>
            4. Leave at your local PostNord Office or your local postal office.`,
          },
          {
            title: `Have you gotten my return yet?`,
            body: `When we've completed processing your refund, we'll get in touch with you via email. Please also check your spam folder because occasionally emails from us get accidentally moved there. It typically takes us 7 to 14 days to receive and process your return, depending on the nation of shipping and the postal system.
            Please use the "Contact" option at the bottom of the page to get in touch with us if, three weeks after submitting your return, you have not heard from us.`,
          },
          {
            title: `What should I do if I can't register my return?`,
            body: `If you are registering a return, please make sure that:
            <br>
            <br>
            - Sure you used the same email address to make your purchase.
            <br>
            - That you submitted only numbers for the order number.
            <br>
            - That you are still within your right to cancel.
            <br>
            <br>

            The details of our return policy are available in "How can I send my order back?".
            Please get in touch with us if you need any additional help using the "Contact" option at the bottom of the page if you're still having trouble registering your return.`,
          },
          {
            title: `What should I do if I've already registered a return but later decide I want to keep one or more of the products?`,
            body: `No issue! You don't need to take any action or get in touch with us if you change your mind about returning something and want to keep one or more things.`,
          },
        ],
      },
      {
        title: 'Refunds',
        scenarios: [
          {
            title: `Do I still have to pay my invoice even after I returned my order?`,
            body: `We advise you to put your invoice with Klarna on hold until we have processed your return in order to avoid any reminder fees. In the Klarna app, you can do this on your own or get in touch with them for assistance. You may email and chat with them here: Customer service for Klarna
            We advise that you pay the invoice if it is not possible to pause it for some reason. You will receive a refund as soon as your return is accepted (via Klarna).`,
          },
          {
            title: `Incorrect refund`,
            body: `
            I'm sorry to hear that you believe you have not received the proper reimbursement.
            I believe the following justifications will address your query:
            <br>
            <br>
            We will charge a handling fee of 100SEK, 10€ or 10$ that will be assessed if your order is returned for any of the following reasons. The shipment, return freight, administrative, and handling charges are covered by this price.
            <br>
            <br>
            - Incorrect address provided at the time of purchase
            <br>
            - The package was left at the post office unclaimed.
            <br>
            - When the package was delivered, it was denied.
            <br>
            <br>
            Yet another incorrect refund?
            Please get in touch with us by using the "Contact" link down below the page.`,
          },
          {
            title: `When will I receive my return's refund?`,
            body: `
            You will automatically receive an email confirming your reimbursement after we have received and confirmed your return. Please get in touch with us by clicking "Contact" further down the page if it has been more than three weeks since you submitted your return and you have not gotten this email.
After we have processed the refund, it typically takes 1 to 5 business days for the money to show up in your account. The money is always returned in the same fashion in which it was received.`,
          },
          {
            title: `Refund for promotional purchases`,
            body: `
            Please be aware that we will reimburse the sum you paid if you request a refund. If you took advantage of a promotional deal, you will be reimbursed for the lower cost. If you made a purchase during a promotion, we reserve the right to deny you the offer or discount if, following a return, your transaction no longer meets the requirements.
            For instance, if you used a discount coupon that called for a minimum order, we reserve the right to refuse you the discount code if the total after your returns is less than the minimum.
            For refunds on purchases made using package deals (such as buy 3 get 2), the complete order must be returned.`,
          },
          {
            title: `If a product's price has increased since I ordered it, am I still eligible for a refund?`,
            body: `We modify our prices in response to market conditions, stock availability, and consumer demand. Price differences that result from promotions or price changes cannot be refunded.
            <br>
            <br>
            However, you are always welcome to reach out to us and we can look over what we can do to assist you in this matter.
            `,
          },
        ],
      },
    ],
  },
  {
    id: 'product-and-warranty',
    title: 'Product & Warranty',
    topics: [
      {
        title: 'Product',
        scenarios: [
          {
            title: `I have multiple iPhone models; can I use the same Coco Case?`,
            body: `Yes, but at your own risk! The same shell will suit multiple iPhone models because there is only a 0.1–0.2 mm difference in size between versions. The slight modification, however, might not protect your phone as well as the appropriate case for your model. You can check which shells work well together below:
            <br>
            <br>
            12 and 12 Pro
            13 and 14
            <br>
            <br>
            The shells listed below can be used with one another, but not the other way around:
            <br>
            <br>
            Products for iPhone 13 Pro Max fits iPhone 12 Pro Max
            <br>
            <br>
            Please choose your model from the product list here to see how the shell appears on your phone.`,
          },
          {
            title: `When will the item I want to purchase become available again?`,
            body: `If the item is anticipated to be back in stock, a box with the words "notify me when available" will be present. You can register by clicking the box and be the first to learn when the product becomes available once again. We do not currently have a date for a refill if the box is not available.`,
          },
          {
            title: `My phone's shell won't come off!`,
            body: `Normally this is not possible with The Coco Case but in the unlikely event that this does happen we advice:
            <br>
            <br>
            Beginning with one corner, press the edges off the bottom of the shell using both hands.
            To pry the shell off, use a soft, pointed instrument. NOTE! Never use anything that could damage your phone!`,
          },
        ],
      },
      {
        title: 'Warranty',
        scenarios: [
          {
            title: `What is covered by the warranty and how long is it valid?`,
            body: `The warranty period for Coco Casing is one year from the date of purchase. The goods are produced in accordance with our strict quality requirements. The items are additionally protected by our warranty against any manufacturing flaws. Only the aforementioned components are covered by Coco Casing's warranty.
            The following things are not covered by Coco Casing's warranty:
            <br>
            <br>
            - defects and harm brought on by loss, theft, fire, water, or UV rays directly hitting the product.
            <br>
            - defects or damage brought on by abuse, carelessness, accidents, or unauthorized repairs or modifications (such as knocks, dents, crushes, falls, etc.).
            <br>
            - aesthetic modifications, flaws, and harm brought on by everyday wear and tear
            <br>
            - The warranty could be void if maintenance recommendations are not followed.
            <br>
            <br>

            However, just reach out to us. We will always do our best in order to help you.`,
          },
        ],
      },
    ],
  },
  {
    id: 'partnerships-and-dealers',
    title: 'Partnerships & Dealers',
    topics: [
      {
        title: 'Partnerships',
        scenarios: [
          {
            title:
              'What steps do I need to take if I wish to collaborate with you as an influencer?',
            body: `It's wonderful that you wish to join our team at Coco Casing! You can work together directly or through one of our platforms, such as Brandbassador, DIPI, or Rewardstyle. Choose from one or all of them.
            Collaboration Do you have a social media presence with more than 1,000 followers, an accessible profile, and significant engagement? Would you be interested in working with us? You can reach us by email at contact@cococasing.se. After considering your request, we'll get back to you.
            Please be aware that we can only react to applicants that we decide to work with because there are so many of them.
            Please fill out the entire form below (in English);
            <br>
            <br>
            Name:
            <br>
            nation of residence:
            <br>
            Your social media:
            <br>
            What about your profile makes working with Coco Casing a good fit:`,
          },
        ],
      },
      {
        title: 'Dealers',
        scenarios: [
          {
            title:
              'Who should I get in touch with if I wish to become an authorized dealer or distributor?',
            body: `We appreciate your interest in our company.
            Please email contact@cococasing.se to reach out to our sales staff.
            In your application, kindly provide the following information:
            <br>
            <br>
            Company name and registration number:
            <br>
            Full address:
            <br>
            Telephone number:
            <br>
            Email address:
            <br>
            Company presentation:
            <br>
            <br>
            Please mention any extra details deemed pertinent, such as other brands sold by the company. After reviewing your application, one of our sales professionals will contact you as soon as possible with a response.`,
          },
        ],
      },
    ],
  },
];
