
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
  }
})