import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  async create(ctx) {
    // create new project
    const repo = ctx.request.body;

    const newProject = await strapi
      .plugin('github-projects')
      .service('projectService')
      .create(repo, ctx.state.user.id);
    return newProject;
  },
});
