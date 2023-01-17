/**
 * post controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  async exampleAction(ctx) {
    await strapi.service('api::post.post').exampleService({ myParam: 'example' });
    try {
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },

  // Solution 1:  fetched all posts and filtered them afterwards
  // async find(ctx) {
  //   // fetch all the posts
  //   const { data, meta } = await super.find(ctx);

  //   if (ctx.state.user) return { data, meta }

  //   const filteredData = data.filter((post) => !post.attributes.premium);
  //   return { data: filteredData, meta }
  // },

  // Solution 2: rewrite the action to fetch only needed posts
  async find(ctx) {
    // if the request is authenticated
    // const isRequestingNonPremium = ctx.query.filters && ctx.query.filters.premium == false;
    console.log(ctx.params);
    
    if (ctx.state.user) return await super.find(ctx);

    // if the request is public ...
    // let's  call the underlying service with an additional filter: premium == false
    // /posts?filters[premium]=false
    const filteredPosts = await strapi.service('api::post.post').find({
      filters: {
        premium: false
      }
    })

    const sanitizedPosts = await this.sanitizeOutput(filteredPosts, ctx);

    return this.transformResponse(sanitizedPosts);
  },

  // Method 3: Replacing a core action
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.service('api::post.post').findOne(id, query);
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  }
}));
