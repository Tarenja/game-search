Group Project

n a block, answer the following questions:
- What is the problem you are trying to solve?
We want to provide a way for people to find games they might like to buy next based on their preferences.

- Who is your target audience?
Gamers (particularly ones who are looking for new games)

- What are your specific goals?
To create a website that will provide a recommendation of possible games, based on the search the user has made,
made through a form we create on which they can indicate their preferences.

In another block, answer the following:
- What is your business model? Where is your revenue coming from?
Advertising and affiliate links. Optional membership, donations.

- What are the costs of your business?
Server space, hosting, database maintenance/updating and time.

Market research:
- Who is your current competition?
The Quantic Lab - https://apps.quanticfoundry.com/
https://www.proprofs.com/quiz-school/story.php?title=pq-what-game-should-i-play
http://www.playbuzz.com/taylor59/what-video-game-should-you-play

- How is your product different from currently available competitors?
Our app is monetized, customizable. It is not a quiz game, and our users will be able to save their recommendation list.
Unlike Quantic Lab this app is all about the list, there is not another primary focus

- What is the current supply / demand for your product?
Supply: outside of store pages there are not very many options to get customized, personalized recommendations without a purchase history.
Demand: Seems pretty high, 570 million results for game recommendation searches. Most people who play games at some point would search for games they should buy or play next.

Technical Specifications:
- What data will you need to store? How will it be organized? Describe each table, its columns, and its relationships with other tables.
Data:
Games, tags, links to store affiliate links. Users and user information (plus payments information). Search results saved to user account.
Tables:
Users (username, email, password, payment info?)
Games (title, gametype, genre, playertype)
Gametypes (FPS, Action Adventure, Action, Adventure, Puzzle, RPG, RPG, MMORPG, racing, sports, strategy,
      simulation, visual novel, VR, Platformer, arcade, point and click, rogue-like, building and crafting, metroidvania, etc)
Genres (post-apocalyptic, fantasy, sci-fi, modern-day, historical, horror, story-rich, anime, gore, comedy, retro, pixel-art,
        mystery, war, cyberpunk, romance, magic, surreal, steampunk, cartoony, lovecraftian, noir etc)
Playertype (single player, multiplayer)
View (first-person, third-person, top-down, isometric)
Searches (searchparams, userID)

Gametypes.hasMany(games) (other suggestions?)
games.belongsTo(gametypes)
Gentres.hasMany (games)
games.belongsTo(genres)
Playertype.hasMany (games)
views.hasMany(games)
games.belongsTo(views)
games.belongsTo(playertype)
Users.hasMany (searches)
searches.belongsTo(users)

this means the games table will have a column with the ids of the genres and gametypes and views and playertype the game has. I think.
and the users will have a page where their searches are saved. Or do you think this should be the recommendation that is saved, not the search?

- What does your product look like? List each view, their purpose, and how they work


- Describe any complex business logic that is happening in your application. For example, how does data flow through your application ???????


Have a timeline of milestones to reach, including deadlines:
- Create milestones that represent the discrete blocks of functionality.
- Give an estimate for how long each will take per engineer.
- Determine whether things can be built concurrently.
- Come up with a timeline of goals to stick to.
