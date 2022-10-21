export interface ServiceConfig {
  hostname: string;
  privateNode?: boolean;
  cloudfront?: {
    hostname: string;
  };
  port: number;
  logGroup: string;
  taskDefinition: {
    cpu: number;
    memoryLimitMiB: number;
  };
  targetGroup: {
    pathPatterns: [string];
    priority: number;
    healthcheck: {
      path: string;
    };
  };
  autoScaling?: {
    minCapacity: number;
    maxCapacity: number;
    cpuUtilization: {
      target: number;
    };
  };
  ecr: {
    repositoryName: string;
    tag: string;
  };
  git: {
    repository: string;
  };
  env?: any;
  secretVars?: { envName: string; type: string; parameterName: string }[];
}

export interface ExplorerConfig {
  name: string;
  envName: string;
  vpc: {
    vpcId?: string;
    cidr?: string;
  };
  git: {
    owner: string;
    branch: string;
    token: string;
  };
}
