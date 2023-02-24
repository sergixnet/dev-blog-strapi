import { Strapi } from "@strapi/strapi";

const RBAC_ACTIONS = [
  {
    section: "plugins",
    displayName: "View and access the plugin",
    uid: "use",
    pluginName: "github-projects",
  },
];

export default async ({ strapi }) => {
  await strapi.admin.services.permission.conditionProvider.registerMany(
    RBAC_ACTIONS
  );
};
