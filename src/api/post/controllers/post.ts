/**
 * post controller
 */

import { factories } from '@strapi/strapi'
import { Context } from 'koa';

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
  /*
  async find(ctx: Context) {
    // if the request is authenticated
    const isRequestingNonPremium = ctx.query.filters && (ctx.query.filters as any).premium["$eq"] == "false";
    if (ctx.state.user || isRequestingNonPremium) return await super.find(ctx);

    // if the request is public ...
    // let's  call the underlying service with an additional filter: premium == false
    // /posts?filters[premium]=false
    const { query } = ctx;
    const filters = query.filters;
    const filteredPosts = await strapi.service('api::post.post').find({
      ...query,
      filters: {
        ...filters as object,
        premium: false
      }
    })

    const sanitizedPosts = await this.sanitizeOutput(filteredPosts, ctx);

    return this.transformResponse(sanitizedPosts);
  },
  */

  async find(ctx: Context) {
    // if the request is authenticated
    const isRequestingNonPremium = ctx.query.filters && (ctx.query.filters as any).premium["$eq"] == "false";
    if (ctx.state.user || isRequestingNonPremium) return await super.find(ctx);

    // if the request is public
    const publicPosts = await strapi.service('api::post.post').findPublic(ctx.query);
    const sanitizedPosts = await this.sanitizeOutput(publicPosts, ctx);

    return this.transformResponse(sanitizedPosts);
  },

  // Method 3: Replacing a core action
  async findOne(ctx: Context) {
    if (ctx.state.user) return await super.findOne(ctx);

    const { id } = ctx.params;
    const { query } = ctx;

    const postIfPublic = await strapi.service('api::post.post').findOneIfPublic({ id, query });
    const sanitizedEntity = await this.sanitizeOutput(postIfPublic, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  async likePost(ctx: Context) {
    const user = ctx.state.user;
    const postId = ctx.params.id;
    const { query } = ctx;
    const updatedPost = await strapi.service('api::post.post').likePost({
      postId, userId: user.id, query
    });

    const sanitizedEntity = await this.sanitizeOutput(updatedPost, ctx);
    return this.transformResponse(sanitizedEntity);
  }
}));
