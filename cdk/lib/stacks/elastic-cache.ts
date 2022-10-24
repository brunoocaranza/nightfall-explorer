import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Peer, Port, SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { explorer } from "../config";
import { VpcConstruct } from "../constructs/vpc-construct";
import * as redis from "aws-cdk-lib/aws-elasticache";

export class RedisStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
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

    const securityGroup = new SecurityGroup(this, "RedisSecurityGroup", {
      vpc,
      allowAllOutbound: true,
      securityGroupName: "RedisSecurityGroup",
    });
    securityGroup.addIngressRule(
      Peer.ipv4(vpc.vpcCidrBlock),
      Port.tcp(6379),
      "allow all traffic from vpc cidr block"
    );

    const subnetGroup = new redis.CfnSubnetGroup(this, "RedisSubnetGroup", {
      description: "Redis subnet group",
      subnetIds: vpc.privateSubnets.map((subnet) => subnet.subnetId),
    });

    const redisCluster = new redis.CfnCacheCluster(this, "RedisCluster", {
      autoMinorVersionUpgrade: true,
      cacheNodeType: "cache.t2.micro",
      engine: "redis",
      numCacheNodes: 1,
      cacheSubnetGroupName: subnetGroup.ref,
      vpcSecurityGroupIds: [securityGroup.securityGroupId],
      clusterName: "ExplorerRedisCluster",
    });

    new CfnOutput(this, "RedisClusterEndpoint", {
      value: redisCluster.attrRedisEndpointAddress,
      exportName: "RedisClusterEndpoint",
    });

    new CfnOutput(this, "RedisClusterPort", {
      value: redisCluster.attrRedisEndpointPort,
      exportName: "RedisClusterPort",
    });
  }
}
