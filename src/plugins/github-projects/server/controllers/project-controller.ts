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
  async delete(ctx) {
    const projectId = ctx.params.id;

    const deletedProject = await strapi
      .plugin('github-projects')
      .service('projectService')
      .delete(projectId);

    return deletedProject;
  },

  async createAll(ctx) {
    const { repos } = ctx.request.body;
    const createdProjects = await strapi
      .plugin('github-projects')
      .service('projectService')
      .createAll(repos, ctx.state.user.id);
    return createdProjects;
  }
});
