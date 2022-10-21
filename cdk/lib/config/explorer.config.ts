import { ExplorerConfig } from "./iconfig";

export const explorer: ExplorerConfig = {
  name: process.env.APP_NAME || "explorer",
  envName: process.env.ENV_NAME || "dev",
  vpc: {
    vpcId: process.env.VPC_ID,
    cidr: "",
  },
  git: {
    owner: process.env.GIT_OWNER!,
    branch: process.env.GIT_BRANCH!,
    token: process.env.GIT_TOKEN!,
    repository: process.env.GIT_REPOSITORY!,
  },
};

export const zone: any = {
  zoneName: process.env.DNS_ZONE_NAME!,
  hostedZoneId: process.env.DNS_HOSTED_ZONE_ID!,
  certificateArn: process.env.DNS_CERTIFICATE_ARN || "",
};

export const explorerToolsZone: any = {
  zoneName: process.env.TOOLS_DNS_ZONE_NAME!,
  hostedZoneId: process.env.TOOLS_DNS_HOSTED_ZONE_ID!,
  certificateArn: process.env.TOOLS_DNS_CERTIFICATE_ARN || "",
};
