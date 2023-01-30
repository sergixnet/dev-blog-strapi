import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('github-projects')
      .service('myService')
      .getWelcomeMessage();
  },
});
