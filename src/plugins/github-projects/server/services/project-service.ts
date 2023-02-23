
import { Strapi } from '@strapi/strapi'

export default ({ strapi }: { strapi: Strapi }) => ({
  async create(repo, userId) {
    const newProject = await strapi.entityService.create('plugin::github-projects.project', {
      data: {
        repositoryId: `${repo.id}`,
        title: repo.name,
        shortDescription: repo.shortDescription,
        repositoryUrl: repo.url,
        longDescription: repo.longDescription,
        createdBy: userId,
        updatedBy: userId,
      }
    })

    return newProject;
  },
  async delete(projectId) {
    const deletedProject = await strapi
      .entityService
      .delete('plugin::github-projects.project', projectId);

    return deletedProject;
  },

  async createAll(repos, userId) {
    const createPromises = repos.map(
      async (repo) =>
        await strapi
          .plugin('github-projects')
          .service('projectService')
          .create(repo, userId)
    );

    return Promise.all(createPromises);
  },

  async deleteAll(projectIds) {
    const deletePromises = projectIds.map(async (id) => await strapi
      .plugin('github-projects')
      .service('projectService')
      .delete(id)
    );

    return Promise.all(deletePromises);
  }
})