#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ExplorerStack } from "../lib/stacks/explorer-stack";
import * as config from "../lib/config";
import { ExplorerTools } from "../lib/stacks/explorer-tools";
import { RedisStack } from "../lib/stacks/elastic-cache";

const { explorer } = config;

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

const nightfallApplicationStack = new ExplorerStack(
  app,
  `${explorer.envName}-${explorer.name}`,
  {
    env,
  }
);

const redisCluster = new RedisStack(app, `RedisCluster`, {
  env,
});

// const explorerToolsStack = new ExplorerTools(app, `explorer-tools`, {
//   env,
//   name: `explorer-tools`,
//   zone: config.explorerToolsZone,
//   sshKeyName: "djuro-ssh",
//   vpcId: config.explorer.vpc.vpcId!,
// });
