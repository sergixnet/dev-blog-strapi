export default {
  async beforeCreate({ params }) {
    // find the admin user who is about to create the post
    const adminUserId = params.data.createdBy;

    // find the corresponding Author
    const author = (await strapi.entityService.findMany('api:author.author', {
      filters: {
        admin_user: [adminUserId]
      }
    })).results[0];

    console.log({author});
    

    // update the data payload of the request for creating the new post
    // by adding the Author to the 'authors' relation
    params.data.authors.connect = [...params.data.authors.connect, author.id];
  }
}