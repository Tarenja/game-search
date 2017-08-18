 NYCDA Group Project

In a block, answer the following questions:
- What is the problem you are trying to solve?
We want to provide a shop that is in no way infringing on the copyright of a well-known character…. About Pac-Dude

- Who is your target audience?
Pac-Dude fans

- What are your specific goals?
To make a webshop full of games and merch, and to get people excited about Pac-Dude.

In another block, answer the following:
- What is your business model? Where is your revenue coming from?
Shop sales, ads.

- What are the costs of your business?
Server space, hosting, database maintenance/updating and time. Storage for merch.

Market research:
- Who is your current competition?
Every game shop ever. But oh well.

- How is your product different from currently available competitors?
Our shop focusses on the best game character ever made, Pac-Dude.

- What is the current supply / demand for your product?
Supply: We have all the merch.
Demand: Everyone wants Pac-Dude, demand is infinite. We hope. No but seriously, gamers will always buy games and pac-dude has retro appeal which is super popular right now.



Technical Specifications:
- What data will you need to store? How will it be organized? Describe each table, its columns, and its relationships with other tables.
Data:
Product information
Users and user information (plus playments information). Purchase history + game keys for steam/gog
Tables:
Users (first name, last name, email, username,  password)
Products (name, price, description, image url)
Keys
Purchases (userid, products, amount)

- What does your product look like? List each view, their purpose, and how they work
Homepage (login screen), Store page, User profile (purchase history, profile info, game keys of purchased games), Shopping Cart, Checkout + payments.

- Describe any complex business logic that is happening in your application. For example, how does data flow through your application 
We are using the paypal api for payments. 
User login, put items in their shopping cart, they can then open the shopping cart and checkout using paypal.

Have a timeline of milestones to reach, including deadlines:
- Create milestones that represent the discrete blocks of functionality.
 Users are able to register, login, logout
 User info is unique, validated, and secure/encrypted
 All pages styling and content is finalized.
 Shop is able to send items to shopping cart
 Shop items are all set into database + images can be shown
Users are able to access and modify shopping cart
 Paypal is integrated (test version) into shop
 User can use paypal to pay
Send emails to users after purchase (bonus!)
Git master

- Give an estimate for how long each will take per engineer.
Axel: 3, two days
Tim: 7,8, 9, two days
Jolissa: 1, 2, 4, 5, 6, 10, two days

- Determine whether things can be built concurrently.
	- we can each do our own things separately and thus concurrently
- Come up with a timeline of goals to stick to.
- finish everything by friday EOD



