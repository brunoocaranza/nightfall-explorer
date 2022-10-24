import * as cdk from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as iam from "aws-cdk-lib/aws-iam";
import {
  explorer,
  explorerApi,
  explorerApiPrivate,
  frontend,
  syncService,
  zone,
} from "../config";
import { DnsAndCertificateConstruct } from "../constructs/dns-certificate-construct";
import { VpcConstruct } from "../constructs/vpc-construct";
import { ECSServiceGroup } from "../constructs/ecs-service-group";
/**
 * This stack is responsible for creating the infrastructure for the ECS services.
 */
export class ExplorerStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Returns VPC and subnets for the application.
     * If VpcId provided it will try to use existing one,
     * otherwise it will create a new VPC.
     */
    const vpcConstruct = new VpcConstruct(
      this,
      `${explorer.envName}-${explorer.name}-vpc`,
      {
        vpcId: explorer.vpc.vpcId,
        name: explorer.envName + "-" + explorer.name,
        cidr: explorer.vpc.cidr,
      }
    );
    const { vpc } = vpcConstruct;

    //ECS CLUSTER
    const cluster = new ecs.Cluster(
      this,
      `${explorer.envName}-${explorer.name}-cluster`,
      {
        vpc: vpc,
        clusterName: `${explorer.envName}-${explorer.name}-cluster`,
      }
    );

    // Create role for ecs task definitions
    const taskRole = new iam.Role(
      this,
      `${explorer.envName}-${explorer.name}-taskRole`,
      {
        roleName: `${explorer.envName}-${explorer.name}-taskRole`,
        assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      }
    );

    const cloudWatchPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:PutLogEvents",
        "logs:GetLogEvents",
        "logs:FilterLogEvents",
        "logs:PutRetentionPolicy",
      ],
      resources: ["*"],
    });
    taskRole.addToPolicy(cloudWatchPolicy);

    // Add policy to role for ecs task definitions
    const executionRolePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ["*"],
      actions: [
        "ssmmessages:CreateControlChannel",
        "ssmmessages:CreateDataChannel",
        "ssmmessages:OpenControlChannel",
        "ssmmessages:OpenDataChannel",
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "cloudwatch:PutMetricData",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ],
    });
    const cert = new DnsAndCertificateConstruct(
      this,
      `${explorer.envName}-${explorer.name}-dns`,
      {
        zone,
        hostname: "*",
      }
    );

    const usCert = new DnsAndCertificateConstruct(
      this,
      `${explorer.envName}-${explorer.name}-cf-dns`,
      {
        zone,
        hostname: "*",
        cloudfront: true,
      }
    );

    /*
      Faragate Service Configuration
    */
    const fargateServices = [explorerApi, frontend, syncService]; // fargate service configurations
    explorerApiPrivate.hostname
      ? fargateServices.push(explorerApiPrivate)
      : null;
    fargateServices.forEach((serviceConfig) => {
      new ECSServiceGroup(this, `${serviceConfig.hostname}`, {
        cluster,
        vpc,
        explorer,
        taskRole,
        executionRolePolicy,
        serviceConfig,
        certificate: cert.certificate,
        usCertificate: usCert.certificate,
        zone,
      });
    });
  }
}
