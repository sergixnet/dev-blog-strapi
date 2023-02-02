import { request } from "@octokit/request";
import { Strapi } from "@strapi/strapi";
import axios from "axios";

export default ({ strapi }: { strapi: Strapi }) => ({
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
          console.log({response});

          if (response.status === 200) {
            longDescription = response.data;
          }
        } catch (err) {
          console.log(err);
        }

        return {
          id,
          name,
          shortDescription: description,
          url: html_url,
          longDescription,
        };
      })
    ).catch((error) => {
      console.log(error);
    });
  },
});
