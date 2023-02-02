import { request } from "@octokit/request";
import { Strapi } from "@strapi/strapi";
import axios from "axios";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export default ({ strapi }: { strapi: Strapi }) => ({
  async getProjectForRepo(repo) {
    const { id } = repo;
    const matchingProjects = await strapi.entityService.findMany(
      "plugin::github-projects.project",
      {
        filters: {
          repositoryId: id,
        },
      }
    );

    if (matchingProjects.length == 1) return matchingProjects[0].id;

    return null;
  },

  async getPublicRepos() {
    const result = await request("GET /user/repos", {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      type: "public",
    });

    // id, name, shortDecription, url, longDescription
    // https://raw.githubusercontent.com/sergixnet/dev-blog-strapi/main/README.md

    return Promise.all(
      result.data.map(async (item) => {
        const { id, name, description, html_url, owner, default_branch } = item;
        const readmeUrl = `https://raw.githubusercontent.com/${owner.login}/${name}/${default_branch}/README.md`;
        let longDescription = "";

        try {
          const response = await axios.get(readmeUrl);

          if (response.status === 200) {
            longDescription = md
              .render(response.data)
              .replaceAll("\n", "<br/>");
          }
        } catch (err) {
          console.log('TODO: handle the error');
        }

        const repo = {
          id,
          name,
          shortDescription: description,
          url: html_url,
          longDescription,
        };

        const relatedProjectId = await strapi
          .plugin("github-projects")
          .service("getReposService")
          .getProjectForRepo(repo);

        return {
          ...repo,
          projectId: relatedProjectId,
        };
      })
    ).catch((error) => {
      console.log(error);
    });
  },
});
