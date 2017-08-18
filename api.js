const igdb = require('igdb-api-node').default; //requiring igdb api
global['3scaleKey'] = '9779fd3defc4a693f320fa9fc94f54e5'; //api-key
const client = igdb(); //setting my credentials and initializing igdb





client.games({
  fields: "*",
   search: "action"
})
.then( response => {
  for (var i = 0; i < response.body.length; i++) {
    console.log(response.body[i].name);
    console.log(response.body[i].id);
  }
})



// client.games({
//     fields: 'themes', // Return all fields
//     limit: 8, // Limit to 5 results
//     search: 'action'
// }
// , [
//   'name',
//   'cover'
// ]
// )
// .then( response => {
//    for (var i = 0; i < response.body.length; i++) {
//      console.log(response.body[i].name);
//      console.log(response.body[i].cover.url);
//     // client.image({
//     //   cloudinary_id: 'example-id-123'
//     // }, 'cover_small', 'jpg');
//    }
// //                       // response.body contains the parsed JSON response to this query
// })
.catch(error => {
    throw error;
});