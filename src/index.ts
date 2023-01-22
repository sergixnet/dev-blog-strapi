export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // we listen to lifecycle events
    strapi.db.lifecycles.subscribe({
      models: ['admin::user'], // only listen to events for this model
      async afterCreate({ result }) {
        // create an Author instance from the fields of the Admin User
        // that has just been created

        // Extract the fields from newly created Admin user
        const { id, firstname, lastname, email, username, createdAt, updatedAt } = result;

        await strapi.service('api::author.author').create({
          data: {
            firstname,
            lastname,
            email,
            username,
            createdAt,
            updatedAt,
            admin_user: [id]
          }
        })
      },
      async afterUpdate({ result }) {
        // get ID of the author tha corresponds
        // to the Admin User that's been just updated
        const correspondingAuthor = (await strapi.service('api::author.author').find({
          admin_user: [result.id]
        })).results[0]; //reults

        // update the author accordingly
        const { firstname, lastname, email, username, updatedAt } = result;

        await strapi.service('api::author.author').update(correspondingAuthor.id, {
          data: {
            firstname, lastname, email, username, updatedAt
          }
        })
      }
    })

  },
};
